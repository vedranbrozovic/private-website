import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NBA_SAVED_SLOTS_FILE = path.join(__dirname, 'nba-saved-leagues.json');
const MAX_NBA_SLOTS = 10;

interface StoredNbaSlot {
  slotNumber: number; // 1..10
  league: Record<string, any>;
  passwordHash?: string; // plain trimmed password for simple unlock
  savedAt: string;
}

function createDefaultSampleSlot(): StoredNbaSlot {
  const numPlayers = 3;
  const rounds = 30 / numPlayers;
  const snakeOrder: number[] = [];
  for (let r = 0; r < rounds; r++) {
    const row = [0, 1, 2];
    if (r % 2 === 1) row.reverse();
    snakeOrder.push(...row);
  }
  const sampleNames = ['Vedran', 'Luka', 'Nikola'];
  const players = sampleNames.map((name, idx) => ({
    id: idx,
    name,
    colorIndex: idx,
    teamIds: [] as number[],
  }));
  const draftPriorityIds = [
    18, 1, 7, 16, 3, 26, 17, 24, 10, 21,
    14, 27, 23, 28, 9, 25, 13, 22, 4, 30,
    11, 29, 6, 8, 5, 2, 12, 19, 20, 15,
  ];
  const picks = draftPriorityIds.map((teamId, pickIdx) => {
    const playerIndex = snakeOrder[pickIdx];
    players[playerIndex].teamIds.push(teamId);
    return {
      pickNumber: pickIdx + 1,
      playerIndex,
      teamId,
    };
  });
  const now = new Date().toISOString();
  return {
    slotNumber: 1,
    savedAt: now,
    league: {
      id: 'league_shared_slot_1',
      name: 'Championship Trio 2026-27 (Demo)',
      season: '2027',
      numPlayers,
      players,
      snakeOrder,
      picks,
      status: 'ACTIVE',
      gameNotes: {},
      createdAt: now,
      updatedAt: now,
    },
  };
}

function readNbaSavedSlots(): StoredNbaSlot[] {
  try {
    if (!fs.existsSync(NBA_SAVED_SLOTS_FILE)) {
      const initial = [createDefaultSampleSlot()];
      fs.writeFileSync(NBA_SAVED_SLOTS_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const raw = fs.readFileSync(NBA_SAVED_SLOTS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (s) =>
          s &&
          typeof s.slotNumber === 'number' &&
          s.slotNumber >= 1 &&
          s.slotNumber <= MAX_NBA_SLOTS &&
          s.league
      );
    }
    return [];
  } catch (err) {
    console.error('Error reading NBA saved slots:', err);
    return [];
  }
}

function writeNbaSavedSlots(slots: StoredNbaSlot[]): void {
  try {
    const sorted = [...slots]
      .filter((s) => s.slotNumber >= 1 && s.slotNumber <= MAX_NBA_SLOTS)
      .sort((a, b) => a.slotNumber - b.slotNumber)
      .slice(0, MAX_NBA_SLOTS);
    fs.writeFileSync(NBA_SAVED_SLOTS_FILE, JSON.stringify(sorted, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing NBA saved slots:', err);
  }
}

function sanitizeSlotForPublicList(slot: StoredNbaSlot) {
  const hasPassword = Boolean(slot.passwordHash && slot.passwordHash.trim().length > 0);
  const league = slot.league || {};
  return {
    slotNumber: slot.slotNumber,
    hasPassword,
    savedAt: slot.savedAt,
    summary: {
      id: league.id,
      name: league.name || `Slot #${slot.slotNumber} League`,
      season: league.season || '2027',
      numPlayers: league.numPlayers || (Array.isArray(league.players) ? league.players.length : 3),
      status: league.status || 'ACTIVE',
      picksCount: Array.isArray(league.picks) ? league.picks.length : 0,
      players: Array.isArray(league.players)
        ? league.players.map((p: any) => ({
            id: p.id,
            name: p.name,
            colorIndex: p.colorIndex,
            teamCount: Array.isArray(p.teamIds) ? p.teamIds.length : 0,
          }))
        : [],
      updatedAt: league.updatedAt || slot.savedAt,
    },
    // If no password is set, include full league right away for 1-click instant load!
    league: hasPassword ? null : slot.league,
  };
}

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
  - Loves [reading](/reading) (his personal credo poems are *"The Guy in the Glass"* by Dale Wimbrow and *"If—"* by Rudyard Kipling), riding his motorcycle, [exercising](https://www.youtube.com/shorts/epX53oBfZ5s), [riding ferries](https://www.youtube.com/shorts/CgKeP-biekc) around Puget Sound in the Pacific Northwest, [traveling](https://www.instagram.com/stories/highlights/18126152053478952/), [creating music with AI](https://www.youtube.com/watch?v=zsYeshucbHE), photography ([/film](/film)), and building [vibe coding apps](/vibecoding) — including [Crotopia: A Cozy Biome Odyssey](/vibecoding/crotopia) ([GitHub](https://github.com/vedranbrozovic/crotopia)), an interactive Polytopia-style 3D Three.js exploration game across Croatia's four biomes and 14 landmarks.
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

const MODEL_CANDIDATES: Array<{
  model: string;
  thinkingLevel?: ThinkingLevel;
  timeoutMs: number;
}> = [
  { model: 'gemini-3.1-flash-lite', thinkingLevel: ThinkingLevel.MINIMAL, timeoutMs: 10000 },
  { model: 'gemini-3.1-flash-lite', thinkingLevel: ThinkingLevel.LOW, timeoutMs: 12000 },
  { model: 'gemini-3.8-flash', thinkingLevel: ThinkingLevel.LOW, timeoutMs: 10000 },
];

function extractCleanErrorMessage(err: unknown): { status: number; message: string } {
  const raw = err instanceof Error ? err.message : String(err ?? '');

  // Attempt to parse embedded JSON error objects from SDK / upstream API
  const jsonStart = raw.indexOf('{');
  if (jsonStart !== -1) {
    try {
      const parsed = JSON.parse(raw.slice(jsonStart));
      const code = Number(parsed?.error?.code) || 500;
      const apiMsg = parsed?.error?.message;
      if (code === 503 || parsed?.error?.status === 'UNAVAILABLE') {
        return {
          status: 503,
          message:
            'The AI model is experiencing temporary high demand. Please try sending your message again in a few seconds.',
        };
      }
      if (code === 429 || parsed?.error?.status === 'RESOURCE_EXHAUSTED') {
        return {
          status: 429,
          message:
            'Rate limit reached. Please wait a few seconds and try again.',
        };
      }
      if (typeof apiMsg === 'string' && apiMsg.trim()) {
        return { status: code >= 400 && code < 600 ? code : 500, message: apiMsg.trim() };
      }
    } catch {
      // Ignore JSON parse failure and fall through
    }
  }

  if (/503|UNAVAILABLE|high demand|overloaded/i.test(raw)) {
    return {
      status: 503,
      message:
        'The AI model is experiencing temporary high demand. Please try sending your message again in a few seconds.',
    };
  }

  if (/abort|timeout|timed out/i.test(raw)) {
    return {
      status: 504,
      message: 'The AI request timed out. Please try asking again.',
    };
  }

  return {
    status: 500,
    message: 'Unable to generate a response right now. Please try again in a moment.',
  };
}

async function generateWithFallback(
  ai: GoogleGenAI,
  contents: Array<{ role: string; parts: Array<{ text: string }> }>
): Promise<string> {
  let lastError: unknown = null;

  for (let i = 0; i < MODEL_CANDIDATES.length; i++) {
    const candidate = MODEL_CANDIDATES[i];
    try {
      const response = await ai.models.generateContent({
        model: candidate.model,
        contents,
        config: {
          systemInstruction: VEDRAN_SYSTEM_PROMPT,
          temperature: 0.7,
          ...(candidate.thinkingLevel
            ? { thinkingConfig: { thinkingLevel: candidate.thinkingLevel } }
            : {}),
          abortSignal: AbortSignal.timeout(candidate.timeoutMs),
        },
      });

      const text = response.text?.trim();
      if (text) {
        return text;
      }
    } catch (err) {
      lastError = err;
      // Brief pause before trying the next candidate
      if (i < MODEL_CANDIDATES.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
    }
  }

  throw lastError ?? new Error('All model candidates failed.');
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

      const reply = await generateWithFallback(ai, contents);
      return res.json({ reply });
    } catch (err) {
      console.error('Error in /api/chat:', err);
      const { status, message } = extractCleanErrorMessage(err);
      return res.status(status).json({ error: message });
    }
  });

  // ============================================================================
  // SHARED 10-SLOT NBA GAME STORAGE (/vibecoding/nbagame/saved)
  // ============================================================================
  app.get(['/api/nbagame/saved', '/vibecoding/nbagame/saved.json'], (_req, res) => {
    const slots = readNbaSavedSlots();
    return res.json({
      maxSlots: MAX_NBA_SLOTS,
      slots: slots.map(sanitizeSlotForPublicList),
    });
  });

  app.post('/api/nbagame/saved/unlock', (req, res) => {
    const slotNumber = Number(req.body?.slotNumber);
    const password = String(req.body?.password ?? '').trim();

    if (!slotNumber || slotNumber < 1 || slotNumber > MAX_NBA_SLOTS) {
      return res.status(400).json({ error: 'Invalid slot number (must be 1–10).' });
    }

    const slots = readNbaSavedSlots();
    const found = slots.find((s) => s.slotNumber === slotNumber);
    if (!found) {
      return res.status(404).json({ error: `Slot #${slotNumber} is currently empty.` });
    }

    const storedPass = (found.passwordHash || '').trim();
    if (storedPass && storedPass !== password) {
      return res.status(403).json({ error: 'Incorrect password for this league slot.' });
    }

    return res.json({
      ok: true,
      slotNumber: found.slotNumber,
      league: found.league,
    });
  });

  app.post('/api/nbagame/saved', (req, res) => {
    const slotNumber = Number(req.body?.slotNumber);
    const league = req.body?.league;
    const currentPassword = String(req.body?.currentPassword ?? req.body?.password ?? '').trim();
    const newPasswordRaw = req.body?.newPassword;

    if (!slotNumber || slotNumber < 1 || slotNumber > MAX_NBA_SLOTS) {
      return res.status(400).json({ error: 'Slot number must be between 1 and 10.' });
    }
    if (!league || typeof league !== 'object' || !Array.isArray(league.players)) {
      return res.status(400).json({ error: 'Valid league object is required.' });
    }

    const slots = readNbaSavedSlots();
    const existingIdx = slots.findIndex((s) => s.slotNumber === slotNumber);

    if (existingIdx !== -1) {
      const existing = slots[existingIdx];
      const existingPass = (existing.passwordHash || '').trim();
      if (existingPass && existingPass !== currentPassword) {
        return res.status(403).json({
          error: `Slot #${slotNumber} is password-protected. Enter the existing slot password to overwrite or update it.`,
        });
      }
    }

    // Determine password to store: if newPassword is explicitly provided, use it; otherwise if creating new slot use currentPassword; if updating existing slot keep existing password
    let finalPassword = '';
    if (typeof newPasswordRaw === 'string') {
      finalPassword = newPasswordRaw.trim();
    } else if (existingIdx !== -1) {
      finalPassword = (slots[existingIdx].passwordHash || '').trim();
    } else {
      finalPassword = currentPassword;
    }

    const now = new Date().toISOString();
    const updatedSlot: StoredNbaSlot = {
      slotNumber,
      league: {
        ...league,
        updatedAt: now,
      },
      ...(finalPassword ? { passwordHash: finalPassword } : {}),
      savedAt: now,
    };

    if (existingIdx !== -1) {
      slots[existingIdx] = updatedSlot;
    } else {
      slots.push(updatedSlot);
    }

    writeNbaSavedSlots(slots);

    return res.json({
      ok: true,
      slot: sanitizeSlotForPublicList(updatedSlot),
      slots: readNbaSavedSlots().map(sanitizeSlotForPublicList),
    });
  });

  app.delete('/api/nbagame/saved/:slotNumber', (req, res) => {
    const slotNumber = Number(req.params.slotNumber);
    const password = String(req.body?.password ?? req.query?.password ?? '').trim();

    if (!slotNumber || slotNumber < 1 || slotNumber > MAX_NBA_SLOTS) {
      return res.status(400).json({ error: 'Invalid slot number.' });
    }

    const slots = readNbaSavedSlots();
    const existing = slots.find((s) => s.slotNumber === slotNumber);
    if (!existing) {
      return res.json({ ok: true, slots: slots.map(sanitizeSlotForPublicList) });
    }

    const existingPass = (existing.passwordHash || '').trim();
    if (existingPass && existingPass !== password) {
      return res.status(403).json({
        error: `Slot #${slotNumber} is password-protected. Enter its password to clear this slot.`,
      });
    }

    const remaining = slots.filter((s) => s.slotNumber !== slotNumber);
    writeNbaSavedSlots(remaining);

    return res.json({
      ok: true,
      slots: remaining.map(sanitizeSlotForPublicList),
    });
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
