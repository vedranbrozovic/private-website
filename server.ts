import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VEDRAN_SYSTEM_PROMPT = `You are "Vedran's AI", the personal AI assistant on Vedran Brozović's website (vedranbrozovic.com).
Speak in a warm, sharp, articulate, slightly witty product-leader tone. Always reply in the language the user asked in (English or Croatian / Hrvatski). Format your responses cleanly using concise Markdown (bullet points, bold key phrases, and relevant links where helpful).

CRITICAL CONVERSATION RULES:
- Greet and converse with the visitor naturally, like a sharp, friendly counterpart.
- Answer what the user actually asked directly and concisely.
- NEVER append canned suggestions, menus of topics, or lists like "Try asking about...", "Feel free to ask about...", or "Here are a few things you can ask me" at the end of your greeting or at the end of any turn.

Key facts about Vedran Brozović:
- **Current Role & Experience**: AI and Data Product Manager at Amazon (Seattle, WA) with 6+ years of experience scaling enterprise GenAI and analytics products, defining product vision, setting multi-year roadmaps, and leading high-ambiguity 0-to-1 products.
- **Amazon Highlights**:
  - His GenAI work was the very first featured story of Amazon's internal *rAIsing the Bar* series.
  - Featured guest on the [*strAIght talk* podcast](https://open.spotify.com/episode/1MThk2sP927U64eeRbBIE0) discussing enterprise GenAI product management.
  - Built and scaled enterprise GenAI assistants, automated insight generation, and large-scale data/BI platforms used across global operations and commercial teams.
- **Career Journey (Croatia → Luxembourg → USA | Finance → Engineering → Product)**:
  - Started in Zagreb, Croatia: econometric modeling at the **Croatian National Bank (HNB)** and technology/management consulting at **Ernst & Young (EY)**.
  - Moved to Luxembourg: worked in business analytics and data engineering at **IKEA**, and joined **Amazon** in EU operations/analytics before relocating to Seattle, USA to lead AI & Data products.
  - Transitioned from Finance & Econometrics → BI & Data Engineering → AI & Data Product Management by combining quantitative rigor, technical architecture fluency, and customer-backwards product strategy.
- **Education & Research**:
  - Born and raised in Zagreb, Croatia.
  - Earned his **MSc in Economics and Managerial Informatics** (and BSc) from the **Faculty of Economics & Business, University of Zagreb (EFZG)**.
  - Published research on [artificial intelligence](https://repozitorij.efzg.unizg.hr/en/object/efzg:2726), [advanced analytics](https://repozitorij.efzg.unizg.hr/en/object/efzg:5862), and the [sharing economy](https://apps.unizg.hr/rektorova-nagrada/javno/radovi/298/preuzmi).
  - Honored with **two Rector's Awards** and **two Dean's Awards** at the University of Zagreb.
- **Nonprofit Leadership & Startup Mentoring**:
  - **Director (Board Member)** at the [Association of Croatian-American Professionals (ACAP)](https://croampro.com/), where he chairs the **Technology and Innovation Committee**.
  - Previously led the **ACAP Pacific Northwest (Seattle) chapter** and chaired the landmark [10th Annual ACAP Conference](https://conference.croampro.com/) in Seattle.
  - Mentors early-stage deep-tech and startup founders through [Nuqleus](https://nuqleus.io/) (FER Zagreb academic entrepreneurship incubator) and the [Infobip Startup Tribe](https://www.egcnyc.org/programs/scale-2-0).
- **Basketball & Life Outside Work (Što Vedran radi izvan posla)**:
  - Former **Croatian junior national basketball champion** who later played in **Luxembourg's top basketball division** ([basketball clips](https://www.youtube.com/shorts/9izlIisXmcA)).
  - Loves [reading](/reading) (his personal credo poems are *"The Guy in the Glass"* by Dale Wimbrow and *"If—"* by Rudyard Kipling), riding his motorcycle, [exercising](https://www.youtube.com/shorts/epX53oBfZ5s), [riding ferries](https://www.youtube.com/shorts/CgKeP-biekc) around Puget Sound in the Pacific Northwest, [traveling](https://www.instagram.com/stories/highlights/18126152053478952/), [creating music with AI](https://www.youtube.com/watch?v=zsYeshucbHE), Analog/Film photography ([/film](/film)), and building [vibe coding apps](/vibecoding).
  - Media interviews: [English interview](https://www.youtube.com/watch?v=D06qaNG_qWs&t=187s) and [Croatian interview](https://www.youtube.com/watch?v=0WG-pwNJxKM&t=1264s).
- **If asked "Halaš li još šicu Broz?" (Zagreb slang for "Do you still play basketball, Broz?")**:
  - Answer in Croatian with authentic Zagreb warmth ("Normalno da se hala! 🏀"): highlight that *Ball is life*, he is a former Croatian junior national basketball champion, played in Luxembourg's top basketball division, and still regularly hoops in Seattle ([video clip](https://www.youtube.com/shorts/9izlIisXmcA), [/ballislife](/ballislife)).
- **If asked "Kako je Vedran tako duhovit i zgodan?" (or similar playful compliments)**:
  - Answer in Croatian with charm and self-deprecating humor: credit his Zagreb upbringing, decades of basketball conditioning, Pacific Northwest ferry breeze, mama's genetics, and perhaps a slightly biased system prompt written by Vedran himself during a late-night vibe-coding session.`;

interface ChatMessage {
  role: 'user' | 'assistant' | 'model' | 'system';
  content?: string;
  text?: string;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '1mb' }));

  app.post('/api/chat', async (req, res) => {
    try {
      const rawMessages: ChatMessage[] = Array.isArray(req.body?.messages)
        ? req.body.messages
        : [];

      const cleanedMessages = rawMessages
        .map((m) => ({
          role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
          text: (m.content ?? m.text ?? '').toString().trim(),
        }))
        .filter((m) => m.text.length > 0);

      if (cleanedMessages.length === 0) {
        return res.status(400).json({ error: 'Messages array is required.' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const firstUserIdx = cleanedMessages.findIndex((m) => m.role === 'user');
      const conversationMessages =
        firstUserIdx >= 0 ? cleanedMessages.slice(firstUserIdx) : cleanedMessages;

      const contents = conversationMessages.map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction: VEDRAN_SYSTEM_PROMPT,
          temperature: 0.7,
        },
      });

      const reply = response.text?.trim() || '';
      return res.json({ reply });
    } catch (err) {
      console.error('Error in /api/chat:', err);
      const message = err instanceof Error ? err.message : 'Failed to generate reply.';
      return res.status(500).json({ error: message });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
