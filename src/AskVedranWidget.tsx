import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  RotateCcw,
  ChevronDown,
  Sun,
  Moon,
  CornerDownLeft,
} from 'lucide-react';

/**
 * Configurable proxy endpoint for "Ask Vedran's AI".
 * Set VITE_PROXY_URL in your environment (e.g., Cloudflare Worker / Cloud Run proxy URL)
 * or leave unset to use the built-in server proxy route at "/api/chat".
 */
export const PROXY_URL: string =
  (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_PROXY_URL ||
  '/api/chat';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

type LangFilter = 'all' | 'en' | 'hr';

interface StarterPrompt {
  id: string;
  lang: 'en' | 'hr';
  text: string;
}

const STARTER_PROMPTS: StarterPrompt[] = [
  {
    id: 'amazon-genai',
    lang: 'en',
    text: 'What GenAI products has Vedran built at Amazon?',
  },
  {
    id: 'career-transition',
    lang: 'en',
    text: 'How did Vedran transition from Finance & BI to AI PM?',
  },
  {
    id: 'acap-mentoring',
    lang: 'en',
    text: 'Tell me about his ACAP leadership & startup mentoring.',
  },
  {
    id: 'outside-work-hr',
    lang: 'hr',
    text: 'Što Vedran radi izvan posla?',
  },
  {
    id: 'witty-handsome-hr',
    lang: 'hr',
    text: 'Kako je Vedran tako duhovit i zgodan?',
  },
  {
    id: 'halas-sicu-broz-hr',
    lang: 'hr',
    text: 'Halaš li još šicu Broz?',
  },
];

function getLocalFallbackReply(userPrompt: string): string {
  const q = userPrompt.toLowerCase();

  if (q.includes('šicu') || q.includes('sicu') || q.includes('halaš') || q.includes('halas') || q.includes('košark') || q.includes('kosark')) {
    return `Normalno da se hala! 🏀 *Ball is life* nikad ne izlazi iz sistema.\n\n- **Od zagrebačkih haklova do titula**: Bivši je **juniorski prvak Hrvatske**, a kasnije je igrao i u **prvoj luksemburškoj ligi**.\n- **Seattle hakl**: I danas u Seattleu redovito [hala šicu](https://www.youtube.com/shorts/9izlIisXmcA) — šut je još uvijek mekan, a košarkaški IQ s terena samo je prebacio u vođenje AI proizvoda ([/ballislife](/ballislife)).`;
  }

  if (q.includes('duhovit') || q.includes('zgodan')) {
    return `To je vjerojatno najvažnije pitanje u cijelom sustavu! 😄\n\nZnanstveni konsenzus kaže da je u pitanju pažljivo izbalansirana kombinacija:\n- **Zagrebačkog šarma** i odrastanja na košarkaškim terenima,\n- **Svježeg pacifičkog zraka** na trajektima oko Seattlea i vožnji motorom,\n- **Dobrih gena** i redovitog treninga,\n- …i činjenice da je Vedran sam napisao *system prompt* za ovaj AI pa mi je strogo zabranjeno tvrditi drugačije! 😉`;
  }

  if (q.includes('izvan posla') || q.includes('slobodno') || q.includes('hobi')) {
    return `Izvan ureda, Vedran vodi prilično aktivan život na sjeverozapadu Pacifika (Seattle):\n\n- **Košarka**: Bivši je juniorski prvak Hrvatske te je igrao u prvoj luksemburškoj ligi — i danas redovito [igra košarku](https://www.youtube.com/shorts/9izlIisXmcA).\n- **Motor i trajekti**: Istražuje Puget Sound na motoru i [trajektima](https://www.youtube.com/shorts/CgKeP-biekc).\n- **Čitanje**: Voli [čitanje](/reading) (njegov osobni kredo su pjesme *The Guy in the Glass* i *If—*).\n- **Trening i putovanja**: Redovito [trenira](https://www.youtube.com/shorts/epX53oBfZ5s) i [putuje](https://www.instagram.com/stories/highlights/18126152053478952/).\n- **Kreativni AI projekti**: U zadnje vrijeme zabavlja se [stvaranjem glazbe pomoću AI-ja](https://www.youtube.com/watch?v=zsYeshucbHE) i izradom [vibe coding aplikacija](/vibecoding).`;
  }

  if (q.includes('genai') || q.includes('amazon') || q.includes('products')) {
    return `At **Amazon**, Vedran has spent **6+ years** scaling enterprise GenAI and data analytics products from **0 to 1**:\n\n- **0-to-1 Enterprise GenAI**: Defined the product vision, multi-year roadmaps, and execution for high-ambiguity generative AI products that automate analytical workflows and decision-making at scale.\n- ***rAIsing the Bar* Spotlight**: His AI work was the **first featured story** in Amazon's *rAIsing the Bar* series.\n- **Podcast Feature**: Discussed scaling GenAI products on the [*strAIght talk* podcast](https://open.spotify.com/episode/1MThk2sP927U64eeRbBIE0).\n- **Enterprise Analytics**: Led large-scale BI and data platforms across Luxembourg and Seattle.`;
  }

  if (q.includes('transition') || q.includes('finance') || q.includes('bi')) {
    return `Vedran's career evolved across **Croatia → Luxembourg → USA** and **Finance → Engineering → Product**:\n\n1. **Finance & Econometrics (Zagreb)**: Started with econometric modeling at the **Croatian National Bank** and consulting at **Ernst & Young**, earning an MSc in Economics & Managerial Informatics at the University of Zagreb (with two Rector's and two Dean's Awards for research on [AI](https://repozitorij.efzg.unizg.hr/en/object/efzg:2726) and [advanced analytics](https://repozitorij.efzg.unizg.hr/en/object/efzg:5862)).\n2. **Business Analytics & Data Engineering (Luxembourg)**: Built automated analytics pipelines at **IKEA** and **Amazon**.\n3. **AI & Data Product Management (Seattle)**: Combined quantitative rigor and technical architecture fluency with customer-backwards product strategy to lead 0-to-1 GenAI products at Amazon.`;
  }

  if (q.includes('acap') || q.includes('mentor') || q.includes('startup')) {
    return `Vedran is deeply involved in the Croatian-American tech community and startup ecosystem:\n\n- **Board Director @ [ACAP](https://croampro.com/)**: Serves on the Board of Directors of the Association of Croatian-American Professionals and chairs the **Technology and Innovation Committee**.\n- **Conference & Chapter Leadership**: Previously led the Pacific Northwest chapter and chaired the [10th Annual ACAP Conference](https://conference.croampro.com/) in Seattle.\n- **Startup Mentoring**: Mentors early-stage founders through **[Nuqleus](https://nuqleus.io/)** and the **[Infobip Startup Tribe](https://www.egcnyc.org/programs/scale-2-0)**.`;
  }

  return `Vedran Brozović is an **AI and Data Product Manager at Amazon** in Seattle with 6+ years of experience scaling enterprise GenAI and analytics products, a **Director at [ACAP](https://croampro.com/)**, and a startup mentor at **Nuqleus** and **Infobip Startup Tribe**.\n\nTry asking about his **GenAI products at Amazon**, his **transition from Finance & BI to AI PM**, his **ACAP leadership**, or **što radi izvan posla**!`;
}

/**
 * Lightweight, safe Markdown renderer for assistant messages.
 * Supports bold, italic, inline code, links, unordered/ordered lists, headings, and paragraphs.
 */
const renderInlineMarkdown = (text: string, isDark: boolean): React.ReactNode[] => {
  const tokenRegex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong
          key={idx}
          className={`font-semibold ${isDark ? 'text-[#faf9f6]' : 'text-[#1c2229]'}`}
        >
          {renderInlineMarkdown(part.slice(2, -2), isDark)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return (
        <em key={idx} className="italic">
          {renderInlineMarkdown(part.slice(1, -1), isDark)}
        </em>
      );
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code
          key={idx}
          className={`px-1.5 py-0.5 rounded text-[12px] font-mono ${
            isDark
              ? 'bg-white/10 text-emerald-300'
              : 'bg-[#20242c]/8 text-[#1c2229]'
          }`}
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, label, href] = linkMatch;
      const isInternal = href.startsWith('/');
      return (
        <a
          key={idx}
          href={href}
          target={isInternal ? undefined : '_blank'}
          rel={isInternal ? undefined : 'noopener noreferrer'}
          onClick={(e) => {
            if (isInternal && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
              e.preventDefault();
              window.history.pushState({}, '', href);
              window.dispatchEvent(new PopStateEvent('popstate'));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className={`underline underline-offset-[3px] transition-colors font-medium ${
            isDark
              ? 'text-emerald-300 decoration-emerald-400/40 hover:decoration-emerald-300'
              : 'text-[#1c2229] decoration-[#1c2229]/35 hover:decoration-[#1c2229]'
          }`}
        >
          {renderInlineMarkdown(label, isDark)}
        </a>
      );
    }
    return part;
  });
};

const MarkdownContent: React.FC<{ content: string; isDark: boolean }> = ({
  content,
  isDark,
}) => {
  const lines = content.split('\n');
  const blocks: React.ReactNode[] = [];
  let listItems: { ordered: boolean; items: string[] } | null = null;

  const flushList = (keyPrefix: string) => {
    if (!listItems) return;
    if (listItems.ordered) {
      blocks.push(
        <ol
          key={`${keyPrefix}-ol`}
          className="list-decimal pl-5 space-y-1.5 my-1.5"
        >
          {listItems.items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInlineMarkdown(item, isDark)}
            </li>
          ))}
        </ol>
      );
    } else {
      blocks.push(
        <ul
          key={`${keyPrefix}-ul`}
          className="list-disc pl-5 space-y-1.5 my-1.5"
        >
          {listItems.items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInlineMarkdown(item, isDark)}
            </li>
          ))}
        </ul>
      );
    }
    listItems = null;
  };

  lines.forEach((rawLine, idx) => {
    const line = rawLine.trim();
    if (!line) {
      flushList(`empty-${idx}`);
      return;
    }

    const ulMatch = line.match(/^[-*•]\s+(.*)$/);
    if (ulMatch) {
      if (!listItems || listItems.ordered) {
        flushList(`switch-ul-${idx}`);
        listItems = { ordered: false, items: [] };
      }
      listItems.items.push(ulMatch[1]);
      return;
    }

    const olMatch = line.match(/^\d+\.\s+(.*)$/);
    if (olMatch) {
      if (!listItems || !listItems.ordered) {
        flushList(`switch-ol-${idx}`);
        listItems = { ordered: true, items: [] };
      }
      listItems.items.push(olMatch[1]);
      return;
    }

    flushList(`line-${idx}`);

    const headingMatch = line.match(/^(#{1,3})\s+(.*)$/);
    if (headingMatch) {
      blocks.push(
        <p
          key={`h-${idx}`}
          className={`font-semibold mt-2 mb-1 ${
            isDark ? 'text-[#faf9f6]' : 'text-[#1c2229]'
          }`}
        >
          {renderInlineMarkdown(headingMatch[2], isDark)}
        </p>
      );
      return;
    }

    blocks.push(
      <p key={`p-${idx}`} className="leading-relaxed my-1.5 first:mt-0 last:mb-0">
        {renderInlineMarkdown(line, isDark)}
      </p>
    );
  });

  flushList('final');

  return <div className="space-y-1.5">{blocks}</div>;
};

export const AskVedranWidget: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [langFilter, setLangFilter] = useState<LangFilter>('all');
  const [isDark, setIsDark] = useState(false);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isLoading]);

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    const nextHistory: ChatMessage[] = [
      ...messages,
      { role: 'user', content: trimmed },
    ];

    setMessages(nextHistory);
    setInput('');
    setIsExpanded(true);
    setIsLoading(true);

    try {
      const response = await fetch(PROXY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: nextHistory,
        }),
      });

      if (!response.ok) {
        throw new Error(`Proxy responded with status ${response.status}`);
      }

      const data: { reply?: string; message?: string } = await response.json();
      const replyText =
        (data.reply ?? data.message ?? '').toString().trim() ||
        getLocalFallbackReply(trimmed);

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: replyText },
      ]);
    } catch {
      // Graceful fallback if custom proxy is unreachable
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: getLocalFallbackReply(trimmed) },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleReset = () => {
    setMessages([]);
    setInput('');
  };

  const visiblePrompts = STARTER_PROMPTS.filter(
    (p) => langFilter === 'all' || p.lang === langFilter
  );

  const placeholderText =
    langFilter === 'hr'
      ? 'Pitaj Vedranov AI bilo što (HR / EN)…'
      : 'Ask Vedran’s AI anything in English or Hrvatski…';

  return (
    <div className="relative my-4 sm:my-5 select-none">
      <div
        className={`relative w-full rounded-2xl overflow-hidden border transition-all duration-300 backdrop-blur-md shadow-xs ${
          isDark
            ? 'bg-[#181c23]/95 border-white/12 text-[#eef0f4] shadow-black/25'
            : 'bg-white/80 border-[#1f242e]/10 text-[#20242c]'
        }`}
      >
        {/* Subtle Float-Mode radial dot pattern background */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
            isDark ? 'opacity-15' : 'opacity-18'
          }`}
          style={{
            backgroundImage: isDark
              ? 'radial-gradient(#ffffff 0.75px, transparent 0.75px)'
              : 'radial-gradient(#20242c 0.75px, transparent 0.75px)',
            backgroundSize: '20px 20px',
          }}
        />

        {/* Top Header Bar */}
        <div className="relative z-10 px-3 sm:px-3.5 pt-2.5 pb-2 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => {
              setIsExpanded((prev) => !prev);
              setTimeout(() => inputRef.current?.focus(), 80);
            }}
            className="flex items-center gap-2 min-w-0 cursor-pointer group text-left"
          >
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.85)] animate-pulse" />
            <span
              className={`text-[11px] sm:text-[12px] font-semibold tracking-wide truncate ${
                isDark ? 'text-[#faf9f6]' : 'text-[#1c2229]'
              }`}
            >
              Ask Vedran&apos;s AI
            </span>
            <span
              className={`text-[10px] sm:text-[11px] font-normal truncate hidden xs:inline ${
                isDark ? 'text-[#94a3b8]' : 'text-[#8c94a4]'
              }`}
            >
              · Bilingual EN / HR
            </span>
          </button>

          {/* Right Controls: Bilingual Switch + Dark/Light Mode + Reset + Collapse */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Bilingual Toggle (All / EN / HR) */}
            <div
              className={`flex items-center p-0.5 rounded-lg border ${
                isDark
                  ? 'bg-[#232933] border-white/10'
                  : 'bg-[#f0f2f5] border-[#20242c]/5'
              }`}
            >
              {(
                [
                  { key: 'all', label: 'EN·HR' },
                  { key: 'en', label: 'EN' },
                  { key: 'hr', label: 'HR' },
                ] as const
              ).map((tab) => {
                const active = langFilter === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => {
                      setLangFilter(tab.key);
                      setIsExpanded(true);
                    }}
                    className={`px-1.5 sm:px-2 py-0.5 rounded-md text-[10px] font-medium transition-all cursor-pointer ${
                      active
                        ? isDark
                          ? 'bg-[#faf9f6] text-[#181c23] font-semibold shadow-2xs'
                          : 'bg-white text-[#1c2229] font-semibold shadow-2xs'
                        : isDark
                        ? 'text-[#94a3b8] hover:text-white'
                        : 'text-[#64748b] hover:text-[#1c2229]'
                    }`}
                    title={`Filter prompts: ${tab.label}`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Dark / Light Theme Toggle */}
            <button
              type="button"
              onClick={() => setIsDark((prev) => !prev)}
              className={`p-1 sm:p-1.5 rounded-lg border transition-colors cursor-pointer ${
                isDark
                  ? 'text-amber-300 border-white/10 hover:bg-white/10'
                  : 'text-[#64748b] border-transparent hover:text-[#1c2229] hover:bg-[#f0f2f5] hover:border-[#20242c]/10'
              }`}
              title={isDark ? 'Switch widget to Light Mode' : 'Switch widget to Dark Mode'}
              aria-label="Toggle widget theme"
            >
              {isDark ? <Sun size={12} /> : <Moon size={12} />}
            </button>

            {/* Clear conversation button (when messages exist) */}
            {messages.length > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className={`p-1 sm:p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  isDark
                    ? 'text-[#94a3b8] border-white/10 hover:text-white hover:bg-white/10'
                    : 'text-[#64748b] border-transparent hover:text-[#1c2229] hover:bg-[#f0f2f5] hover:border-[#20242c]/10'
                }`}
                title="Clear conversation"
                aria-label="Clear conversation"
              >
                <RotateCcw size={12} />
              </button>
            )}

            {/* Expand / Collapse toggle */}
            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              className={`p-1 sm:p-1.5 rounded-lg border transition-colors cursor-pointer ${
                isDark
                  ? 'text-[#94a3b8] border-white/10 hover:text-white hover:bg-white/10'
                  : 'text-[#64748b] border-transparent hover:text-[#1c2229] hover:bg-[#f0f2f5] hover:border-[#20242c]/10'
              }`}
              title={isExpanded ? 'Collapse chat' : 'Expand chat'}
              aria-label={isExpanded ? 'Collapse chat' : 'Expand chat'}
            >
              <ChevronDown
                size={13}
                className={`transition-transform duration-300 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Collapsible Section: Starter Prompt Chips & Multi-Turn Conversation Window */}
        {isExpanded && (
          <>
            {/* Starter Prompt Chips */}
            <div className="relative z-10 px-3 sm:px-3.5 pb-2.5 pt-0.5">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 flex-wrap">
                {visiblePrompts.map((prompt) => (
                  <button
                    key={prompt.id}
                    type="button"
                    disabled={isLoading}
                    onClick={() => sendMessage(prompt.text)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] sm:text-[11.5px] font-normal border transition-all cursor-pointer text-left active:scale-[0.98] disabled:opacity-50 ${
                      isDark
                        ? 'bg-[#222832]/90 border-white/10 text-[#e2e8f0] hover:border-emerald-400/50 hover:bg-[#28303d]'
                        : 'bg-white/90 border-[#20242c]/10 text-[#374151] hover:border-[#1c2229]/30 hover:bg-white hover:text-[#1c2229] shadow-2xs'
                    }`}
                  >
                    <span
                      className={`text-[9px] font-mono uppercase tracking-wider px-1 py-0.2 rounded ${
                        prompt.lang === 'hr'
                          ? isDark
                            ? 'text-amber-300/90 bg-amber-400/10'
                            : 'text-[#555f6f] bg-[#f0f2f5]'
                          : isDark
                          ? 'text-emerald-300/90 bg-emerald-400/10'
                          : 'text-[#555f6f] bg-[#f0f2f5]'
                      }`}
                    >
                      {prompt.lang.toUpperCase()}
                    </span>
                    <span>{prompt.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Multi-Turn Conversation Window */}
            {(messages.length > 0 || isLoading) && (
              <div
                ref={messagesContainerRef}
                className={`relative z-10 px-3 sm:px-3.5 py-3 max-h-72 sm:max-h-80 overflow-y-auto border-t space-y-3 select-text ${
                  isDark
                    ? 'border-white/10 bg-[#14171d]/70'
                    : 'border-[#20242c]/8 bg-[#faf9f6]/70'
                }`}
              >
                {messages.map((msg, idx) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div
                      key={idx}
                      className={`flex flex-col ${
                        isUser ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`max-w-[90%] sm:max-w-[86%] rounded-xl px-3 py-2 text-[13px] sm:text-[13.5px] leading-relaxed ${
                          isUser
                            ? isDark
                              ? 'bg-emerald-500/20 text-[#faf9f6] border border-emerald-400/30'
                              : 'bg-[#1c2229] text-[#faf9f6] shadow-2xs'
                            : isDark
                            ? 'bg-[#222832] text-[#e2e8f0] border border-white/10'
                            : 'bg-white text-[#20242c] border border-[#20242c]/10 shadow-2xs'
                        }`}
                      >
                        {isUser ? (
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        ) : (
                          <MarkdownContent content={msg.content} isDark={isDark} />
                        )}
                      </div>
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="flex items-start">
                    <div
                      className={`rounded-xl px-3 py-2 text-xs flex items-center gap-2 border ${
                        isDark
                          ? 'bg-[#222832] text-[#94a3b8] border-white/10'
                          : 'bg-white text-[#64748b] border-[#20242c]/10 shadow-2xs'
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.25s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.12s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
                      </span>
                      <span>
                        {langFilter === 'hr' ? 'Razmišljam…' : 'Thinking…'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Bottom Input Bar */}
        <form
          onSubmit={handleFormSubmit}
          className={`relative z-10 px-2.5 sm:px-3 py-2 border-t flex items-center gap-2 ${
            isDark
              ? 'border-white/10 bg-[#181c23]/95'
              : 'border-[#20242c]/8 bg-white/92'
          }`}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onFocus={() => setIsExpanded(true)}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholderText}
            disabled={isLoading}
            className={`w-full text-xs sm:text-[13px] bg-transparent px-2 py-1 focus:outline-hidden ${
              isDark
                ? 'text-[#faf9f6] placeholder:text-[#64748b]'
                : 'text-[#1c2229] placeholder:text-[#8c94a4]'
            }`}
            aria-label="Ask Vedran's AI"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer shrink-0 disabled:opacity-40 disabled:cursor-not-allowed ${
              isDark
                ? 'bg-emerald-500 text-[#12161c] hover:bg-emerald-400 font-semibold'
                : 'bg-[#1c2229] text-[#faf9f6] hover:bg-[#2d3540]'
            }`}
            title="Send message"
            aria-label="Send message"
          >
            <Send size={12} />
            <span className="hidden sm:inline">Ask</span>
            <CornerDownLeft size={10} className="hidden sm:inline opacity-60" />
          </button>
        </form>
      </div>
    </div>
  );
};
