import React, { useState, useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Mail, 
  Instagram, 
  Youtube, 
  FileText, 
  Moon, 
  Sun, 
  ArrowUpRight, 
  ChevronRight,
  Code2,
  Heart,
  Target,
  Monitor,
  Camera,
  BookOpen,
  Brain,
  Book,
  Film,
  Mic,
  Quote,
  ChevronDown,
  ChevronUp,
  Play
} from 'lucide-react';

// --- Types ---
interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: React.ElementType;
}

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  year: string;
  url?: string;
  isHtml5?: boolean;
  path?: string;
}

interface BlogPost {
  id: string;
  title: string;
  date: string;
  readingTime: string;
}

// --- Data ---
const CONTACT_EMAIL = 'brozovic.vedran@gmail.com';

const SOCIAL_LINKS: SocialLink[] = [
  { id: 'linkedin', name: 'LinkedIn', url: 'https://www.linkedin.com/in/vedranbrozovic/', icon: Linkedin },
  { id: 'github', name: 'GitHub', url: 'https://github.com/vedranbrozovic', icon: Github },
  { id: 'twitter', name: 'Twitter', url: 'https://twitter.com/vedranbrozovic', icon: Twitter },
  { id: 'instagram', name: 'Instagram', url: 'https://instagram.com/vedranbrozovic', icon: Instagram },
  { id: 'youtube', name: 'YouTube', url: 'https://www.youtube.com/@vedran.brozovic', icon: Youtube },
];

const PROJECTS: Project[] = [
  {
    id: 'wolt-game',
    title: 'Wolt Delivery Game (v2)',
    description: 'A fun, single-file HTML5 arcade game about delivering food on time. Built in one quick vibe coding session.',
    category: 'HTML5 CANVAS / GAME',
    year: '2025',
    url: 'https://htmlpreview.github.io/?https://github.com/vedranbrozovic/vibe_coding_single_html/blob/main/wolt_game_v2.html',
    isHtml5: true
  },
  {
    id: 'economic-time-traveler',
    title: 'Economic Time Traveler',
    description: 'Slide through the years and witness economic and cultural shifts in a single HTML file visualization.',
    category: 'HTML5 VIZ',
    year: '2025',
    url: 'https://htmlpreview.github.io/?https://github.com/vedranbrozovic/vibe_coding_single_html/blob/main/economic_time_traveler_v2',
    isHtml5: true
  },
  {
    id: 'potato-inflation',
    title: 'Potato Inflation (v3)',
    description: 'A whimsical calculator and visualizer for analyzing inflation metrics through the universal currency of potatoes.',
    category: 'HTML5 APP',
    year: '2025',
    url: 'https://htmlpreview.github.io/?https://github.com/vedranbrozovic/vibe_coding_single_html/blob/main/potato_inflation_v3.html',
    isHtml5: true
  },
  {
    id: 'beer-indicator',
    title: 'Beer Indicator',
    description: 'An interactive HTML5 experiment exploring playful data points and indicators.',
    category: 'HTML5 EXPERIMENT',
    year: '2025',
    url: 'https://htmlpreview.github.io/?https://github.com/vedranbrozovic/vibe_coding_single_html/blob/main/beer_indicator.html',
    isHtml5: true
  }
];

const BLOG_POSTS: BlogPost[] = [];



// --- Sub-components ---

const ThemeToggle = ({ theme, toggle }: { theme: 'light' | 'dark', toggle: () => void }) => (
  <button 
    onClick={toggle}
    className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
    aria-label="Toggle theme"
  >
    {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
  </button>
);

const Navbar = ({ theme, toggle }: { theme: 'light' | 'dark', toggle: () => void }) => (
  <nav className="fixed top-0 left-0 right-0 z-50 glass-nav px-6 py-3 flex justify-between items-center transition-all">
    <div className="flex items-center gap-6">
      <a href="/" className="font-sans font-bold tracking-tighter text-base hover:text-accent transition-colors">VAB</a>
      <div className="hidden md:flex gap-5">
        {['Projects', 'Blog', 'Inspiration'].map((item) => (
          <a 
            key={item} 
            href={`#${item.toLowerCase()}`} 
            className="text-[10px] font-bold uppercase tracking-wider opacity-50 hover:opacity-100 transition-opacity"
          >
            {item}
          </a>
        ))}
      </div>
    </div>
    <div className="flex items-center gap-3">
      <ThemeToggle theme={theme} toggle={toggle} />
      <button 
        onClick={() => window.location.href = `mailto:${CONTACT_EMAIL}`}
        className="px-4 py-1.5 rounded-full bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold tracking-wide hover:scale-105 transition-transform"
      >
        CONTACT
      </button>
    </div>
  </nav>
);

const SectionHeading = ({ children, icon: Icon }: { children: React.ReactNode, icon: React.ElementType }) => (
  <div className="flex items-center gap-2 mb-8 opacity-40">
    <Icon size={14} strokeWidth={2} />
    <h2 className="text-[9px] uppercase tracking-[0.2em] font-bold">{children}</h2>
  </div>
);

// --- Main Components ---

const MotorcycleAnimation = () => {
  const [key, setKey] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [trick, setTrick] = useState<'jump' | 'wheelie' | 'stoppie' | null>(null);

  const handleBikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (trick) return;

    setClicks(c => c + 1);
    const tricks: ('jump' | 'wheelie' | 'stoppie')[] = ['jump', 'wheelie', 'stoppie'];
    const randomTrick = tricks[Math.floor(Math.random() * tricks.length)];
    
    setTrick(randomTrick);
    setTimeout(() => setTrick(null), randomTrick === 'jump' ? 400 : 800);
  };

  let animationState = { y: 0, rotate: 0 };
  let origin = '50% 50%';

  if (trick === 'jump') {
    animationState = { y: -25, rotate: -8 };
    origin = '50% 50%';
  } else if (trick === 'wheelie') {
    animationState = { y: -10, rotate: -35 }; 
    origin = '27% 96%'; 
  } else if (trick === 'stoppie') {
    animationState = { y: -10, rotate: 30 };
    origin = '73% 96%'; 
  }

  return (
    <>
      <button 
        onClick={(e) => { e.stopPropagation(); setKey(k => k + 1); setClicks(0); setTrick(null); }}
        className="absolute bottom-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 text-[10px] font-bold uppercase tracking-wider"
        aria-label="Ride Motorcycle"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.19M15 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3.19M23 13v-2M11 6l-4 6h6l-4 6"/>
        </svg>
        Send It!
      </button>

      {/* Track below the box - expanded height to prevent any clipping during jumps */}
      <div className="absolute -bottom-10 left-0 right-0 h-32 pointer-events-none overflow-hidden">
        
        {/* Cinematic Background Speed Lines */}
        <div className="absolute inset-0 opacity-40 mix-blend-screen">
           <motion.div className="absolute top-10 w-24 h-[1px] bg-white" initial={{ left: '100%' }} animate={{ left: '-20%' }} transition={{ duration: 0.3, repeat: Infinity, ease: 'linear' }} />
           <motion.div className="absolute top-16 w-16 h-[2px] bg-white" initial={{ left: '110%' }} animate={{ left: '-10%' }} transition={{ duration: 0.2, repeat: Infinity, ease: 'linear', delay: 0.1 }} />
           <motion.div className="absolute top-4 w-32 h-[1px] bg-white/50" initial={{ left: '105%' }} animate={{ left: '-30%' }} transition={{ duration: 0.4, repeat: Infinity, ease: 'linear', delay: 0.2 }} />
        </div>

        {/* Motorcycle wrapper */}
        <motion.div
          key={key}
          className="absolute bottom-6 z-40"
          initial={{ left: '-20%' }}
          animate={{ left: '120%' }}
          transition={{ duration: 7, ease: 'linear' }}
        >
          {/* Shadow element (stays on ground mostly) */}
          <motion.div 
            className="absolute -bottom-1 left-2 w-16 h-2 bg-black/50 blur-[4px] rounded-[100%]"
            animate={trick ? { scaleX: 0.5, opacity: 0.2 } : { scaleX: 1, opacity: 0.5 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          />

          <motion.div 
            animate={animationState}
            style={{ transformOrigin: origin }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="cursor-pointer pointer-events-auto relative drop-shadow-2xl"
            onClick={handleBikeClick}
          >
            {/* Extremely detailed SVG - scaled down by ~50% (95x72 vs old 180x135) */}
            <svg width="95" height="72" viewBox="-10 -40 220 170" className="overflow-visible">
              <defs>
                <linearGradient id="tank" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9ca3af" />
                  <stop offset="20%" stopColor="#6b7280" />
                  <stop offset="100%" stopColor="#374151" />
                </linearGradient>
                <linearGradient id="chrome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="40%" stopColor="#9ca3af" />
                  <stop offset="60%" stopColor="#f3f4f6" />
                  <stop offset="100%" stopColor="#6b7280" />
                </linearGradient>
                <radialGradient id="yellow-panel" cx="40%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="50%" stopColor="#eab308" />
                  <stop offset="100%" stopColor="#a16207" />
                </radialGradient>
                <radialGradient id="helmet-gloss" cx="40%" cy="20%" r="60%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="60%" stopColor="#cbd5e1" />
                  <stop offset="100%" stopColor="#64748b" />
                </radialGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                <linearGradient id="headlightBeam" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(254, 240, 138, 0.4)" />
                  <stop offset="100%" stopColor="rgba(254, 240, 138, 0)" />
                </linearGradient>
              </defs>

              {/* Headlight Beam */}
              <motion.path 
                d="M 148 44 L 350 -10 L 350 120 Z" 
                fill="url(#headlightBeam)" 
                animate={{ opacity: [0.5, 0.7, 0.5] }}
                transition={{ repeat: Infinity, duration: 0.1 }}
                style={{ pointerEvents: 'none' }}
              />

              <g>
                <animateTransform attributeName="transform" type="translate" values="0,0; 0,1.5; 0,-1; 0,0" dur="0.12s" repeatCount="indefinite" />
                
                {/* Rear Wheel (cx=50, cy=100) */}
                <g>
                  {/* Knobby Tire */}
                  <circle cx="50" cy="100" r="23.5" fill="none" stroke="#1f2937" strokeWidth="7" strokeDasharray="3 2"/>
                  <circle cx="50" cy="100" r="21" fill="none" stroke="#374151" strokeWidth="1"/> {/* Tire Highlight */}
                  <circle cx="50" cy="100" r="20" fill="none" stroke="#0f172a" strokeWidth="3"/>
                  <circle cx="50" cy="100" r="18" fill="none" stroke="url(#chrome)" strokeWidth="1"/>
                  {/* Disc Brake */}
                  <circle cx="50" cy="100" r="11" fill="none" stroke="#9ca3af" strokeWidth="3" strokeDasharray="2 1"/>
                  {/* Sprocket */}
                  <circle cx="50" cy="100" r="8" fill="#111827" />
                  <circle cx="50" cy="100" r="4" fill="url(#chrome)" />
                  <g>
                    <animateTransform attributeName="transform" type="rotate" from="0 50 100" to="360 50 100" dur="0.12s" repeatCount="indefinite" />
                    {[0, 20, 40, 60, 80, 100, 120, 140, 160].map(deg => (
                      <line key={deg} x1="50" y1="80" x2="50" y2="120" stroke="#6b7280" strokeWidth="1" transform={`rotate(${deg} 50 100)`}/>
                    ))}
                  </g>
                </g>

                {/* Front Wheel (cx=150, cy=100) */}
                <g>
                  {/* Knobby Tire */}
                  <circle cx="150" cy="100" r="24.5" fill="none" stroke="#1f2937" strokeWidth="7" strokeDasharray="3 2"/>
                  <circle cx="150" cy="100" r="22" fill="none" stroke="#374151" strokeWidth="1"/> {/* Tire Highlight */}
                  <circle cx="150" cy="100" r="21" fill="none" stroke="#0f172a" strokeWidth="3"/>
                  <circle cx="150" cy="100" r="19" fill="none" stroke="url(#chrome)" strokeWidth="1"/>
                  {/* Disc Brake */}
                  <circle cx="150" cy="100" r="13" fill="none" stroke="#9ca3af" strokeWidth="3" strokeDasharray="2 1"/>
                  <circle cx="150" cy="100" r="4" fill="url(#chrome)" />
                  <g>
                    <animateTransform attributeName="transform" type="rotate" from="0 150 100" to="360 150 100" dur="0.12s" repeatCount="indefinite" />
                    {[0, 20, 40, 60, 80, 100, 120, 140, 160].map(deg => (
                      <line key={deg} x1="150" y1="79" x2="150" y2="121" stroke="#6b7280" strokeWidth="1" transform={`rotate(${deg} 150 100)`}/>
                    ))}
                  </g>
                </g>

                {/* Forks / Suspension */}
                <line x1="150" y1="100" x2="135" y2="45" stroke="url(#chrome)" strokeWidth="6" strokeLinecap="round"/>
                <line x1="146" y1="82" x2="138" y2="52" stroke="#1f2937" strokeWidth="8" strokeDasharray="2 1.5"/> {/* Fork Gaiters */}
                <line x1="135" y1="45" x2="128" y2="28" stroke="#111" strokeWidth="7" strokeLinecap="round"/>
                
                {/* Fender */}
                <path d="M 130 65 Q 150 60, 165 75" fill="none" stroke="#374151" strokeWidth="4" strokeLinecap="round" />

                {/* Frame / Swingarm / Bash plate */}
                <line x1="50" y1="100" x2="90" y2="75" stroke="#4b5563" strokeWidth="5" strokeLinecap="round"/>
                <path d="M 90 75 L 85 45 L 125 45 L 125 75 Z" fill="none" stroke="#111827" strokeWidth="5" strokeLinejoin="round" />
                <path d="M 85 102 L 115 102 L 125 90 L 85 90 Z" fill="#4b5563" stroke="#374151" strokeWidth="2" strokeLinejoin="round" /> {/* Sump guard */}

                {/* Engine Block */}
                <path d="M 90 60 L 120 60 L 120 90 L 90 90 Z" fill="#374151" />
                <path d="M 90 60 L 120 60" stroke="#6b7280" strokeWidth="2" /> {/* Engine rim light */}
                <path d="M 90 65 L 122 65 M 90 70 L 122 70 M 90 75 L 122 75 M 90 80 L 122 80" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" /> {/* Fins */}
                <circle cx="104" cy="85" r="14" fill="#1f2937" />
                <circle cx="104" cy="85" r="10" fill="#4b5563" />
                <circle cx="102" cy="83" r="10" fill="none" stroke="#6b7280" strokeWidth="1" /> {/* Engine highlight */}

                {/* Exhaust System */}
                <path d="M 115 80 Q 125 95, 115 100 L 90 102 L 45 80" fill="none" stroke="#111827" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 75 88 L 45 76" fill="none" stroke="url(#chrome)" strokeWidth="9" strokeLinecap="round" />
                <path d="M 45 76 L 30 70" fill="none" stroke="#111827" strokeWidth="7" strokeLinecap="round" />
                <path d="M 32 70 L 28 68" fill="none" stroke="#374151" strokeWidth="4" strokeLinecap="round" /> {/* Tip */}

                {/* Seat (Stepped ADV seat) */}
                <path d="M 50 52 L 102 52 C 102 52, 105 58, 108 62 L 50 62 Z" fill="#0f172a" />
                <path d="M 70 52 L 102 52 L 98 58 L 70 58 Z" fill="#1e293b" /> {/* Pillion texture */}

                {/* Rear Tail / Rack */}
                <path d="M 50 54 L 28 54 L 25 58 L 50 58 Z" fill="#374151" />
                <circle cx="25" cy="56" r="4" fill="#ef4444" filter="url(#glow)"/> 

                {/* Rear Tire Hugger / License Plate */}
                <path d="M 30 58 C 20 70, 20 80, 22 90 L 27 85 C 26 78, 28 68, 35 60 Z" fill="#111827" />

                {/* Fuel Tank (Graphite Grey, realistic curve) */}
                <path d="M 95 55 L 100 35 C 115 30, 130 35, 135 48 L 132 58 Z" fill="url(#tank)" />
                
                {/* Scram 411 Yellow Accent Plate */}
                <path d="M 115 42 L 135 48 L 130 62 L 110 54 Z" fill="url(#yellow-panel)" stroke="#ca8a04" strokeWidth="1" />
                <path d="M 118 47 L 130 50 L 126 53 L 114 50 Z" fill="#111827" /> {/* Graphic */}

                {/* Headlight & Cowl */}
                <path d="M 132 35 L 148 35 C 150 42, 150 48, 145 55 L 132 50 Z" fill="#374151" />
                <circle cx="148" cy="44" r="8" fill="#fef08a" filter="url(#glow)"/>

                {/* Handlebars & Mirrors */}
                <path d="M 132 38 L 122 25 L 112 25" fill="none" stroke="#111" strokeWidth="4" strokeLinecap="round" />
                <path d="M 112 25 L 110 15" fill="none" stroke="#4b5563" strokeWidth="2" />
                <ellipse cx="110" cy="14" rx="5" ry="3" fill="#111827" transform="rotate(-20 110 14)" />

                {/* Rider */}
                {/* Body / Jacket */}
                <path d="M 68 52 C 62 30, 72 12, 85 12 C 98 10, 108 18, 110 25 L 92 48 Z" fill="#111827" />
                <path d="M 68 52 C 62 30, 72 12, 85 12 C 98 10, 108 18, 110 25" fill="none" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" /> {/* Rim light */}
                <path d="M 72 52 L 78 20 L 90 18" fill="none" stroke="#374151" strokeWidth="2" />
                
                {/* Arm */}
                <path d="M 85 16 L 105 32 L 122 30" fill="none" stroke="#1f2937" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 105 32 L 122 30" fill="none" stroke="#111827" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" /> {/* Forearm darker */}
                <path d="M 85 16 L 105 32 L 122 30" fill="none" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /> {/* Arm Rim light */}
                
                {/* Glove */}
                <circle cx="123" cy="29" r="4.5" fill="#000" />
                
                {/* Leg */}
                <path d="M 75 48 L 92 65 L 80 85" fill="none" stroke="#0f172a" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="92" cy="65" r="5" fill="#1e293b" /> 
                <path d="M 75 48 L 92 65" fill="none" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 2" /> {/* Seam */}
                
                {/* Boots */}
                <path d="M 73 78 L 88 80 L 85 92 L 68 92 Z" fill="#050505" />
                <path d="M 70 92 L 85 92" stroke="#333" strokeWidth="3" /> {/* Sole */}
                
                {/* ADV Helmet */}
                <path d="M 85 0 C 85 -20, 108 -20, 110 -2 C 112 10, 95 12, 85 0 Z" fill="url(#helmet-gloss)" />
                {/* Visor */}
                <path d="M 96 -6 C 96 -12, 110 -12, 110 -2 C 105 3, 98 0, 96 -6 Z" fill="#0f172a" />
                <path d="M 98 -9 C 102 -11, 108 -9, 108 -5" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
                {/* Peak */}
                <path d="M 95 -14 L 118 -14 L 112 -8 Z" fill="#e2e8f0" />
                {/* Jawpiece detail */}
                <path d="M 105 2 L 100 6" stroke="#94a3b8" strokeWidth="1.5" />
                
                {/* Scarf */}
                <path d="M 85 15 Q 40 18 20 28 Q 50 25 85 20" fill="#ef4444">
                  <animate attributeName="d" values="M 85 15 Q 40 18 20 28 Q 50 25 85 20; M 85 15 Q 50 10 15 25 Q 50 30 85 20; M 85 15 Q 40 18 20 28 Q 50 25 85 20" dur="0.15s" repeatCount="indefinite"/>
                </path>
              </g>
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

const HeroSketchVisual = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [gravityActive, setGravityActive] = useState(false);
  const gravityActiveRef = useRef(gravityActive);
  const itemsRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const engineRef = useRef<Matter.Engine | null>(null);
  const bodiesRef = useRef<{ [key: string]: Matter.Body }>({});
  const boundariesRef = useRef<Matter.Body[]>([]);
  const [isReady, setIsReady] = useState(false);

  // Update ref when state changes
  useEffect(() => {
    gravityActiveRef.current = gravityActive;
    if (engineRef.current) {
      engineRef.current.world.gravity.y = gravityActive ? 1.2 : 0;
      // When turning off gravity, give them a tiny nudge to start floating
      if (!gravityActive) {
        Object.values(bodiesRef.current).forEach(body => {
          Matter.Body.setVelocity(body, {
            x: (Math.random() - 0.5) * 3,
            y: (Math.random() - 0.5) * 3
          });
        });
      }
    }
  }, [gravityActive]);

  // Define positions and exact dimensions for accurate physics bounding boxes
  const SKETCH_ITEMS = [
    { id: 'efzg', type: 'efzg', w: 70, h: 60, class: 'z-10', x: -160, y: -60 },
    { id: 'ikea', type: 'ikea', w: 100, h: 42, class: 'z-10', x: -50, y: -60 },
    { id: 'ey', type: 'ey', w: 66, h: 50, class: 'z-10 text-zinc-900 dark:text-zinc-100', x: 60, y: -60 },
    { id: 'amazon', type: 'amazon', w: 120, h: 45, class: 'z-10 text-zinc-900 dark:text-zinc-100', x: 160, y: -60 },
    { id: 'acap', type: 'acap', w: 160, h: 55, class: 'z-10', x: -140, y: 30 },
    { id: 'basketball', type: 'basketball', w: 60, h: 60, class: 'z-10', x: -30, y: 30 },
    { id: 'reading', type: 'reading', w: 65, h: 65, class: 'z-10', x: 60, y: 30 },
    { id: 'photography', type: 'photography', w: 60, h: 60, class: 'z-10 text-zinc-900 dark:text-zinc-100', x: 150, y: 30 },
  ];

  useEffect(() => {
    if (!containerRef.current) return;
    setIsReady(true);

    const { Engine, World, Bodies, Runner, MouseConstraint, Mouse, Composite } = Matter;
    
    // Create engine
    const engine = Engine.create();
    engineRef.current = engine;
    const world = engine.world;
    world.gravity.y = gravityActiveRef.current ? 1.2 : 0;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Boundaries Creator helper
    const createBoundaries = (w: number, h: number) => {
      const thickness = 200;
      return [
        Bodies.rectangle(w / 2, h + thickness / 2, w, thickness, { isStatic: true, label: 'ground' }),
        Bodies.rectangle(w / 2, -thickness / 2, w, thickness, { isStatic: true, label: 'ceiling' }),
        Bodies.rectangle(-thickness / 2, h / 2, thickness, h, { isStatic: true, label: 'leftWall' }),
        Bodies.rectangle(w + thickness / 2, h / 2, thickness, h, { isStatic: true, label: 'rightWall' })
      ];
    };

    const boundaries = createBoundaries(width, height);
    boundariesRef.current = boundaries;
    Composite.add(world, boundaries);

    // Create bodies for items
    SKETCH_ITEMS.forEach(item => {
      // Create a precisely sized bounding box for each SVG
      const body = Bodies.rectangle(
        width / 2 + item.x, 
        height / 2 + item.y, 
        item.w, 
        item.h, 
        { 
          restitution: 0.5, 
          friction: 0.2,
          frictionAir: 0.04,
          density: 0.001
        }
      );
      bodiesRef.current[item.id] = body;
      Composite.add(world, body);
    });

    // Mouse control - Essential for interaction
    const mouse = Mouse.create(containerRef.current);
    
    // Fix for mobile/touch events in matter-js in an iframe
    // @ts-ignore
    mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
    // @ts-ignore
    mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);

    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.1,
        render: { visible: false }
      }
    });

    Composite.add(world, mouseConstraint);

    // Handle Resize
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries[0] || !engineRef.current) return;
      const { width: newW, height: newH } = entries[0].contentRect;
      
      // Update boundaries
      Composite.remove(engineRef.current.world, boundariesRef.current);
      const newBoundaries = createBoundaries(newW, newH);
      boundariesRef.current = newBoundaries;
      Composite.add(engineRef.current.world, newBoundaries);
    });
    
    resizeObserver.observe(containerRef.current);

    // Run the engine
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Sync bodies with DOM
    let animationId: number;
    const update = () => {
      if (engineRef.current && containerRef.current) {
        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight;

        if (!gravityActiveRef.current) {
          // Add gentle floating forces when gravity is off
          SKETCH_ITEMS.forEach(item => {
            const body = bodiesRef.current[item.id];
            if (body) {
              const time = Date.now() * 0.001;
              const ix = SKETCH_ITEMS.indexOf(item);
              const forceMagnitude = 0.00003;
              
              Matter.Body.applyForce(body, body.position, {
                x: Math.sin(time + ix) * forceMagnitude,
                y: Math.cos(time * 0.8 + ix) * forceMagnitude
              });

              // Gentle pull back to center if they wander too far
              const dx = (w / 2 + item.x) - body.position.x;
              const dy = (h / 2 + item.y) - body.position.y;
              Matter.Body.applyForce(body, body.position, {
                x: dx * 0.000005,
                y: dy * 0.000005
              });
            }
          });
        }

        SKETCH_ITEMS.forEach(item => {
          const body = bodiesRef.current[item.id];
          const element = itemsRef.current[item.id];
          if (body && element) {
            const x = body.position.x - w / 2;
            const y = body.position.y - h / 2;
            element.style.transform = `translate(${x}px, ${y}px) rotate(${body.angle}rad)`;
          }
        });
      }
      animationId = requestAnimationFrame(update);
    };

    update();

    return () => {
      Runner.stop(runner);
      Engine.clear(engine);
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, [isReady]);

  return (
    <div className="relative group mb-10">
      <div 
        ref={containerRef} 
        style={{ touchAction: 'pan-y' }}
        className="relative w-full h-56 md:h-72 rounded-3xl overflow-hidden border border-black/10 dark:border-white/10 bg-[#fafafa] dark:bg-[#0a0a0a] shadow-inner flex items-center justify-center cursor-grab active:cursor-grabbing"
      >
        {/* SVG filter for sketchy look */}
        <svg className="hidden">
          <filter id="sketchy">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>

        {/* Subtle gradient glow */}
        <div className="absolute inset-0 opacity-30 dark:opacity-40 pointer-events-none" style={{ background: 'radial-gradient(circle at center, rgba(150,150,150,0.15) 0%, transparent 60%)' }} />
        
        <div className="relative w-full h-full pointer-events-none" style={{ filter: 'url(#sketchy)' }}>
          {SKETCH_ITEMS.map((item) => (
            <div
              key={item.id}
              ref={el => itemsRef.current[item.id] = el}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${item.class}`}
              style={{ width: item.w, height: item.h }}
            >
              <div className="w-full h-full flex items-center justify-center filter drop-shadow-md">
                
                {item.type === 'efzg' && (
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm text-[#460F40] dark:text-[#d946c8]">
                    <path d="M 5 20 H 95 V 36 H 54 Q 50 36 50 42 Q 50 36 46 36 H 5 Z" fill="currentColor" />
                    <path d="M 25 48 H 80 V 64 H 54 Q 50 64 50 70 Q 50 64 46 64 H 25 Z" fill="currentColor" />
                    <path d="M 5 76 H 68 V 92 H 54 Q 50 92 50 98 Q 50 92 46 92 H 5 Z" fill="currentColor" />
                  </svg>
                )}

                {item.type === 'ikea' && (
                  <svg viewBox="0 0 120 50" className="w-full h-full drop-shadow-sm">
                    <rect x="0" y="0" width="120" height="50" fill="#0051BA" />
                    <ellipse cx="60" cy="25" rx="55" ry="22" fill="#FFCC00" />
                    <text x="60" y="36.5" fontFamily="Verdana, Geneva, sans-serif" fontWeight="900" fontSize="33" fontStyle="italic" fill="#0051BA" textAnchor="middle" letterSpacing="-1.5">IKEA</text>
                  </svg>
                )}

                {item.type === 'ey' && (
                  <svg viewBox="0 0 80 50" className="w-full h-full text-[#333333] dark:text-[#f8f8f8]">
                    <text x="0" y="42" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="48" fill="currentColor" letterSpacing="-4">EY</text>
                    <polygon points="61,42 66,16 76,16" fill="#FFE600" /> 
                  </svg>
                )}

                {item.type === 'amazon' && (
                  <svg viewBox="0 0 130 50" className="w-full h-full drop-shadow-sm text-current overflow-visible">
                    <text x="0" y="30" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="36" letterSpacing="-1.5" fill="currentColor">amazon</text>
                    <path d="M 12 36 Q 50 51 106 34" fill="none" stroke="#FF9900" strokeWidth="3.5" strokeLinecap="round"/>
                    <polygon points="106,34 100,29 96,35" fill="#FF9900"/>
                  </svg>
                )}

                {item.type === 'acap' && (
                  <svg viewBox="0 0 180 50" className="w-full h-full text-[#E31D3B] drop-shadow-sm overflow-visible">
                    <text x="0" y="42" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="48" letterSpacing="-3.5" fill="currentColor">A</text>
                    
                    <g transform="translate(36, 12)">
                      <rect x="0" y="0" width="10" height="9" fill="currentColor" />
                      <rect x="0" y="10" width="10" height="10" fill="transparent" />
                      <rect x="0" y="21" width="10" height="9" fill="currentColor" />
                      
                      <rect x="11" y="0" width="10" height="9" fill="transparent" />
                      <rect x="11" y="10" width="10" height="10" fill="currentColor" />
                      <rect x="11" y="21" width="10" height="9" fill="transparent" />
                    </g>
                    
                    <path d="M 85,12 A 16,15 0 1,0 85,42" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="square" />
                    
                    <text x="88" y="42" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="48" letterSpacing="-3.5" fill="currentColor">AP</text>
                  </svg>
                )}

                {item.type === 'basketball' && (
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                    <defs>
                      <radialGradient id="ballGlow" cx="30%" cy="30%" r="70%">
                        <stop offset="0%" stopColor="#fb923c" />
                        <stop offset="70%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#ea580c" />
                      </radialGradient>
                    </defs>
                    <circle cx="50" cy="50" r="46" fill="url(#ballGlow)" />
                    <g fill="none" stroke="#431407" strokeWidth="3" className="opacity-90">
                      <circle cx="50" cy="50" r="46" />
                      <path d="M 50 4 Q 52 50 50 96" />
                      <path d="M 4 50 Q 50 52 96 50" />
                      <path d="M 17 21 C 45 40, 45 60, 17 79" />
                      <path d="M 83 21 C 55 40, 55 60, 83 79" />
                    </g>
                  </svg>
                )}

                {item.type === 'reading' && (
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                    {/* Layout rotated a bit for style */}
                    <g transform="rotate(-5 50 50)">
                      <path d="M 10 80 L 10 20 C 30 15 45 20 50 25 C 55 20 70 15 90 20 L 90 80 C 70 75 55 80 50 85 C 45 80 30 75 10 80 Z" fill="#64748b" className="dark:fill-[#475569]" />
                      <path d="M 12 78 L 12 22 C 30 18 45 22 50 27 L 50 83 C 45 78 30 74 12 78 Z" fill="#f8fafc" className="dark:fill-[#f1f5f9]" />
                      <path d="M 88 78 L 88 22 C 70 18 55 22 50 27 L 50 83 C 55 78 70 74 88 78 Z" fill="#e2e8f0" className="dark:fill-[#e2e8f0]" />
                      {/* Text lines */}
                      <g stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="20" y1="35" x2="40" y2="38" />
                        <line x1="20" y1="45" x2="42" y2="48" />
                        <line x1="20" y1="55" x2="35" y2="57" />
                        <line x1="60" y1="38" x2="80" y2="35" />
                        <line x1="58" y1="48" x2="75" y2="45" />
                      </g>
                    </g>
                    {/* Pen */}
                    <g transform="translate(68, 48) rotate(-35)">
                       <rect x="-4" y="-20" width="8" height="40" rx="1" fill="#fcd34d" />
                       <polygon points="-4,20 4,20 0,30" fill="#e4e4e7" />
                       <polygon points="-1.5,26 1.5,26 0,30" fill="#1f2937" />
                       <rect x="-4" y="-25" width="8" height="5" fill="#f87171" rx="1" />
                    </g>
                  </svg>
                )}

                {item.type === 'photography' && (
                  <svg viewBox="0 0 100 100" className="w-full h-full text-[#4b5563] dark:text-[#9ca3af] drop-shadow-sm">
                    <rect x="10" y="32" width="80" height="52" rx="8" fill="currentColor" />
                    <path d="M 28 32 L 35 20 L 65 20 L 72 32 Z" fill="currentColor" className="opacity-80"/>
                    <circle cx="22" cy="45" r="4.5" fill="#fcd34d" />
                    <circle cx="80" cy="42" r="3" fill="#000" className="opacity-20" />
                    <circle cx="50" cy="58" r="18" fill="#1f2937" className="dark:fill-[#0f172a]"/>
                    <circle cx="50" cy="58" r="9" fill="#9ca3af" className="dark:fill-[#4b5563]" />
                    <circle cx="47" cy="54" r="2.5" fill="#fff" />
                  </svg>
                )}

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gravity Control Overlay - Moved outside for better reliability */}
      <div className="absolute bottom-4 right-4 z-50 flex gap-2">
        <button 
          type="button"
          onPointerDown={(e) => { e.stopPropagation(); setGravityActive(!gravityActive); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border shadow-lg ${
            gravityActive 
              ? 'bg-blue-600 text-white border-blue-400' 
              : 'bg-white dark:bg-zinc-900 text-black dark:text-white border-black/10 dark:border-white/10'
          } hover:scale-105 active:scale-95 cursor-pointer touch-manipulation`}
        >
          <Target size={14} className={gravityActive ? 'animate-bounce' : ''} />
          {gravityActive ? 'Gravity ON' : 'Gravity OFF'}
        </button>
      </div>
      
      {/* Interaction Hint */}
      {!gravityActive && (
        <motion.div 
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold uppercase tracking-[0.2em] opacity-40 pointer-events-none"
        >
          Grab and throw the icons!
        </motion.div>
      )}

      <MotorcycleAnimation />
    </div>
  );
};

const Hero = () => (
  <section className="flex flex-col justify-start max-w-4xl pb-12 pt-4">
    <HeroSketchVisual />
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="mb-6 inline-flex flex-wrap items-center gap-2 px-3 py-1 rounded-full bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/5">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
        <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">
          PM @ Amazon | Board Member @ ACAP
        </span>
      </div>
      
      <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-8">
        Vedran Brozović
      </h1>
      
      <div className="max-w-2xl text-sm md:text-base leading-relaxed opacity-70 mb-10 space-y-4">
        <p>
          I'm a <span className="font-semibold text-text opacity-100">Product Manager at Amazon</span> and Board Member at the <span className="font-semibold text-text opacity-100">Association of Croatian-American Professionals (ACAP)</span>. My background lays in the intersection of data, product and finance.
        </p>
        <p>
          As an eclectic generalist, I have plenty of experience tackling projects in which I have no prior experience. I approach every project with a researcher’s curiosity and an entrepreneur’s bias for action.
        </p>
        <p className="text-xs italic leading-relaxed">
          Based in Seattle. Reach out for NGO strategy, career growth, or to grab a coffee/play some <span className="text-orange-500 not-italic font-bold">basketball 🏀</span>.
        </p>
      </div>
      
      <div className="flex flex-wrap gap-4 mt-2">
        {SOCIAL_LINKS.map((link) => (
          <motion.a 
            key={link.id} 
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -2, scale: 1.1 }}
            className="p-3 bg-black/5 dark:bg-white/5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white"
            title={link.name}
          >
            <link.icon size={18} strokeWidth={2} />
          </motion.a>
        ))}
      </div>
    </motion.div>
  </section>
);

interface InspirationData {
  quotes: { text: string; author: string }[];
  poems: { title: string; author: string; significance: string; text: string }[];
  books: { title: string; author: string; link?: string }[];
  movies: { title: string; director: string; significance?: string }[];
  speeches: { title: string; speaker: string; youtubeUrl: string }[];
}

const InspirationSection = () => {
  const [data, setData] = useState<InspirationData | null>(null);
  const [activePoem, setActivePoem] = useState<number | null>(null);
  const [displayedQuotes, setDisplayedQuotes] = useState<{ text: string; author: string }[]>([]);

  useEffect(() => {
    fetch('/inspiration.json?t=' + new Date().getTime())
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch inspiration data');
        return res.json();
      })
      .then((resData: InspirationData) => {
        setData(resData);
        if (resData.quotes) {
          const shuffled = [...resData.quotes].sort(() => 0.5 - Math.random());
          setDisplayedQuotes(shuffled.slice(0, 6));
        }
      })
      .catch(console.error);
  }, []);

  const randomizeQuotes = () => {
    if (!data || !data.quotes) return;
    
    let availableQuotes = data.quotes.filter(q => !displayedQuotes.includes(q));
    let shuffled = [...availableQuotes].sort(() => 0.5 - Math.random());
    
    if (shuffled.length < 6) {
      const needed = 6 - shuffled.length;
      const currentShuffled = [...displayedQuotes].sort(() => 0.5 - Math.random());
      shuffled = [...shuffled, ...currentShuffled.slice(0, needed)];
    }
    
    setDisplayedQuotes(shuffled.slice(0, 6));
  };

  if (!data) return null;

  return (
    <section id="inspiration" className="py-12 border-t border-black/5 dark:border-white/5">
      <SectionHeading icon={Heart}>Inspiration</SectionHeading>
      
      <div className="space-y-16">
        
        {displayedQuotes && displayedQuotes.length > 0 && (
          <div>
            <div className="mb-6">
              <h3 className="text-[10px] uppercase tracking-widest font-bold opacity-30 flex items-center gap-2 mb-4">
                <Quote size={12} /> Quotes
              </h3>
              <button 
                onClick={randomizeQuotes}
                className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold opacity-50 hover:opacity-100 transition-opacity px-3 py-1.5 bg-black/[0.03] dark:bg-white/[0.03] rounded-full hover:bg-black/[0.05] dark:hover:bg-white/[0.05]"
                aria-label="Randomize Quotes"
              >
                Randomize
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {displayedQuotes.map((quote, i) => (
                <div key={i} className="flex flex-col group p-6 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20 transition-all">
                  <p className="text-lg font-serif italic opacity-80 mb-4 flex-1">"{quote.text}"</p>
                  <span className="text-[10px] uppercase tracking-widest font-bold opacity-40 group-hover:opacity-100 transition-opacity">— {quote.author}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.poems && data.poems.length > 0 && (
          <div>
            <h3 className="text-[10px] uppercase tracking-widest font-bold opacity-30 flex items-center gap-2 mb-6">
              <BookOpen size={12} /> Poems
            </h3>
            <div className="space-y-4">
              {data.poems.map((poem, i) => (
                <div key={i} className="border border-black/5 dark:border-white/5 rounded-2xl overflow-hidden bg-black/[0.01] dark:bg-white/[0.01]">
                  <button 
                    onClick={() => setActivePoem(activePoem === i ? null : i)}
                    className="w-full p-6 flex flex-col md:flex-row md:items-center justify-between text-left hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-center gap-3">
                        <h4 className="text-lg font-bold">{poem.title}</h4>
                        <span className="px-2 py-0.5 rounded text-[9px] uppercase tracking-widest font-bold bg-black/10 dark:bg-white/10">{poem.author}</span>
                      </div>
                      <p className="text-xs opacity-50 mt-2 font-medium">{poem.significance}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center bg-white dark:bg-[#0a0a0a] shadow-sm shrink-0">
                      {activePoem === i ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </div>
                  </button>
                  <AnimatePresence>
                    {activePoem === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-black/5 dark:border-white/5"
                      >
                        <div className="p-6 md:p-8 whitespace-pre-wrap font-serif text-sm opacity-80 leading-loose border-l-4 border-blue-500/20 ml-6 md:ml-8 my-4">
                          {poem.text}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {data.books && data.books.length > 0 && (
            <div>
              <h3 className="text-[10px] uppercase tracking-widest font-bold opacity-30 flex items-center gap-2 mb-6">
                <Book size={12} /> Books
              </h3>
              <div className="space-y-4">
                {data.books.map((book, i) => (
                  <a key={i} href={book.link || '#'} target={book.link ? "_blank" : "_self"} rel="noopener noreferrer" className="group flex items-center justify-between p-4 rounded-xl border border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-all">
                    <div>
                      <h4 className="font-bold text-sm group-hover:text-blue-500 transition-colors">{book.title}</h4>
                      <span className="text-[10px] uppercase tracking-widest font-bold opacity-40">{book.author}</span>
                    </div>
                    {book.link && <ArrowUpRight size={14} className="opacity-30 group-hover:opacity-100 transition-opacity" />}
                  </a>
                ))}
              </div>
            </div>
          )}

          {data.movies && data.movies.length > 0 && (
            <div>
              <h3 className="text-[10px] uppercase tracking-widest font-bold opacity-30 flex items-center gap-2 mb-6">
                <Film size={12} /> Movies
              </h3>
              <div className="space-y-4">
                {data.movies.map((movie, i) => (
                  <div key={i} className="p-4 rounded-xl border border-transparent hover:border-black/5 dark:hover:border-white/5 transition-all">
                    <h4 className="font-bold text-sm flex items-center gap-2">
                       <Play size={10} className="opacity-40" /> {movie.title}
                    </h4>
                    <span className="text-[10px] uppercase tracking-widest font-bold opacity-40 mt-1 block">Dir. {movie.director}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {data.speeches && data.speeches.length > 0 && (
          <div>
            <h3 className="text-[10px] uppercase tracking-widest font-bold opacity-30 flex items-center gap-2 mb-6">
              <Mic size={12} /> Speeches
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.speeches.map((speech, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]">
                  <div className="p-4 border-b border-black/5 dark:border-white/5">
                     <h4 className="font-bold text-sm">{speech.title}</h4>
                     <span className="text-[10px] uppercase tracking-widest font-bold opacity-40">{speech.speaker}</span>
                  </div>
                  <div className="relative pt-[56.25%]">
                    <iframe 
                      className="absolute inset-0 w-full h-full" 
                      src={speech.youtubeUrl} 
                      title={speech.title} 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Message from ${formData.name} (Bio Site)`);
    const body = encodeURIComponent(formData.message);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="py-12 border-t border-black/5 dark:border-white/5">
      <SectionHeading icon={Mail}>Connect</SectionHeading>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h3 className="text-2xl font-bold mb-6">Have a bold idea?</h3>
          <p className="opacity-50 text-sm mb-10 leading-relaxed">
            I'm always open to discussing supply chain innovation, NGO impact, or career development. Drop me a note and let's see what we can solve together.
          </p>
          <div className="flex gap-4 opacity-30">
             {SOCIAL_LINKS.slice(0, 3).map(link => (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">
                  <link.icon size={16} />
                </a>
             ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" 
            placeholder="Name"
            required
            className="w-full px-5 py-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 focus:border-blue-500 outline-none transition-all text-sm font-medium"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
          <textarea 
            placeholder="Your message..."
            required
            rows={4}
            className="w-full px-5 py-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 focus:border-blue-500 outline-none transition-all text-sm font-medium resize-none"
            value={formData.message}
            onChange={e => setFormData({ ...formData, message: e.target.value })}
          />
          <button 
            type="submit"
            className="w-full py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold text-[10px] uppercase tracking-widest hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

const ProjectsList = ({ onOpenHtml5 }: { onOpenHtml5: (url: string) => void }) => {
  const navigate = useNavigate();
  if (PROJECTS.length === 0) return null;
  return (
    <section id="projects" className="py-12 border-t border-black/5 dark:border-white/5">
      <SectionHeading icon={Code2}>Impact & Strategy</SectionHeading>
      <div className="space-y-4">
        {PROJECTS.map((project) => (
          <motion.div
            key={project.id}
            whileHover={{ x: 4 }}
            onClick={() => {
              if (project.isHtml5 && project.url) {
                onOpenHtml5(project.url);
              } else if (project.path) {
                navigate(project.path);
              } else if (project.url) {
                window.open(project.url, '_blank', 'noopener noreferrer');
              }
            }}
            className="group flex flex-col md:flex-row justify-between items-start md:items-center p-6 rounded-2xl bg-black/[0.01] dark:bg-white/[0.01] border border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20 transition-all cursor-pointer"
          >
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded text-[9px] uppercase tracking-widest font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">{project.category}</span>
                <span className="text-[9px] font-bold opacity-30">{project.year}</span>
                {project.isHtml5 && (
                  <span className="px-2 py-0.5 rounded text-[9px] uppercase tracking-widest font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center gap-1">
                    <Monitor size={10} /> HTML5 demo
                  </span>
                )}
                {project.path && (
                  <span className="px-2 py-0.5 rounded text-[9px] uppercase tracking-widest font-bold bg-green-500/10 text-green-600 dark:text-green-400 flex items-center gap-1">
                    <Monitor size={10} /> Launch App
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold group-hover:text-blue-500 transition-colors">{project.title}</h3>
              <p className="mt-2 text-xs opacity-60 leading-relaxed max-w-lg">
                {project.description}
              </p>
            </div>
            <div className="mt-4 md:mt-0 opacity-0 group-hover:opacity-100 transition-all bg-black/5 dark:bg-white/5 p-3 rounded-full">
               <ArrowUpRight size={18} className="text-blue-500 group-hover:scale-110 transition-transform" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const BlogList = () => {
  if (BLOG_POSTS.length === 0) return null;
  return (
    <section id="blog" className="py-12 border-t border-black/5 dark:border-white/5">
      <SectionHeading icon={FileText}>Writing</SectionHeading>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {BLOG_POSTS.map((post) => (
          <a key={post.id} href="#" className="group">
            <div className="h-full p-6 rounded-2xl bg-black/[0.01] dark:bg-white/[0.01] border border-black/5 dark:border-white/5 group-hover:border-black/20 dark:group-hover:border-white/20 transition-all flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4 opacity-40">
                  <span className="text-[9px] uppercase tracking-widest">{post.date}</span>
                  <span className="text-[9px] uppercase tracking-widest">{post.readingTime}</span>
                </div>
                <h3 className="text-base font-semibold leading-tight group-hover:text-blue-500 transition-colors">
                  {post.title}
                </h3>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="py-10 border-t border-black/5 dark:border-white/5 flex flex-col items-center text-center">
    <div className="mb-6 opacity-20">
      <Heart size={18} fill="currentColor" strokeWidth={0} />
    </div>
    <div className="flex gap-6 opacity-40 text-[9px] uppercase tracking-[0.2em] font-bold">
      <span>© 2026 Vedran Brozović</span>
      <a href="https://www.linkedin.com/in/vedranbrozovic/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">LinkedIn</a>
      <a href="https://github.com/vedranbrozovic" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">GitHub</a>
    </div>
  </footer>
);

const HTML5Viewer = ({ url, onClose }: { url: string, onClose: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.98 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="fixed inset-0 z-[100] bg-white dark:bg-[#0a0a0a] flex flex-col shadow-2xl"
    >
      <div className="h-14 border-b border-black/10 dark:border-white/10 flex items-center justify-between px-4 md:px-6 bg-white dark:bg-[#0a0a0a]">
        <div className="flex items-center gap-3">
          <button 
             onClick={onClose}
             className="flex items-center justify-center p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
             aria-label="Close demo and return"
          >
             <ChevronRight className="rotate-180 group-hover:-translate-x-0.5 transition-transform" size={20} />
          </button>
          <div>
             <span className="font-bold text-sm tracking-tight block leading-none">Interactive Demo</span>
             <span className="text-[10px] opacity-50 block mt-1 leading-none uppercase tracking-wider">{url.replace(/^https?:\/\//, '')}</span>
          </div>
        </div>
        <a href={url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded bg-black/5 dark:bg-white/5 text-xs font-bold uppercase tracking-wider hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center gap-2">
          New Tab <ArrowUpRight size={14} />
        </a>
      </div>
      <div className="flex-1 w-full relative bg-[#f1f1f1] dark:bg-[#111111]">
        <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
          <span className="text-xs uppercase tracking-widest font-bold animate-pulse">Loading engine...</span>
        </div>
        <iframe 
          src={url} 
          className="relative z-10 w-full h-full border-none bg-transparent"
          title="Project Demo"
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>
    </motion.div>
  );
};

// --- Pages ---
const Home = ({ setActiveHtml5Url }: { setActiveHtml5Url: (url: string | null) => void }) => {
  return (
    <>
      <Hero />
      <ProjectsList onOpenHtml5={(url) => setActiveHtml5Url(url)} />
      <BlogList />
      <InspirationSection />
      <ContactSection />
    </>
  );
};


// --- App Entry ---

function AppContent() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeHtml5Url, setActiveHtml5Url] = useState<string | null>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark');
  };

  useEffect(() => {
    // Explicitly set document title
    document.title = "Vedran Brozovic";

    // Check initial user preference
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDark) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <div className={`selection:bg-accent selection:text-white min-h-screen flex flex-col`}>
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-accent z-[60] origin-left" 
        style={{ scaleX }} 
      />
      
      <div className="noise" />
      <Navbar theme={theme} toggle={toggleTheme} />
      
      <main className="px-6 md:px-12 lg:px-24 pt-20 flex-1">
        <div className="max-w-6xl mx-auto">
          <Routes>
            <Route path="/" element={<Home setActiveHtml5Url={setActiveHtml5Url} />} />
          </Routes>
          <Footer />
        </div>
      </main>

      {/* Decorative gradients for that "Surya/Marijana" feel */}
      <div className="fixed -top-[20%] -left-[10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      
      <AnimatePresence>
        {activeHtml5Url && (
          <HTML5Viewer url={activeHtml5Url} onClose={() => setActiveHtml5Url(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
