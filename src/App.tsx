import React, { useState, useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
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
  Brain
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
  { id: 'instagram', name: 'Instagram', url: 'https://instagram.com/vedranbrozovic', icon: Instagram },
  { id: 'youtube', name: 'YouTube', url: 'https://www.youtube.com/@vedran.brozovic', icon: Youtube },
];

const PROJECTS: Project[] = [];

const BLOG_POSTS: BlogPost[] = [];

const QUOTES: { text: string; author: string }[] = [
  { text: "Price is what you pay. Value is what you get.", author: "Warren Buffett" },
  { text: "Someone's sitting in the shade today because someone planted a tree a long time ago.", author: "Warren Buffett" },
  { text: "Risk comes from not knowing what you're doing.", author: "Warren Buffett" },
];

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
        {['Projects', 'Blog'].map((item) => (
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
      
      <div className="flex flex-wrap gap-3">
        {SOCIAL_LINKS.map((link) => (
          <motion.a 
            key={link.id} 
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -2, backgroundColor: 'var(--text)', color: 'var(--bg)' }}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-black/10 dark:border-white/10 transition-all group"
          >
            <link.icon size={14} strokeWidth={2} />
            <span className="text-[11px] font-bold uppercase">{link.name}</span>
          </motion.a>
        ))}
      </div>
    </motion.div>
  </section>
);

const QuotesSection = () => {
  if (QUOTES.length === 0) return null;
  return (
    <section id="quotes" className="py-12 border-t border-black/5 dark:border-white/5">
      <SectionHeading icon={Heart}>Favourite Quotes</SectionHeading>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {QUOTES.map((quote, i) => (
          <div key={i} className="flex flex-col">
            <p className="text-lg font-serif italic opacity-80 mb-4">"{quote.text}"</p>
            <span className="text-[10px] uppercase tracking-widest font-bold opacity-30">— {quote.author}</span>
          </div>
        ))}
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

const ProjectsList = () => {
  if (PROJECTS.length === 0) return null;
  return (
    <section id="projects" className="py-12 border-t border-black/5 dark:border-white/5">
      <SectionHeading icon={Code2}>Impact & Strategy</SectionHeading>
      <div className="space-y-2">
        {PROJECTS.map((project) => (
          <motion.div
            key={project.id}
            whileHover={{ x: 4 }}
            className="group flex flex-col md:flex-row justify-between items-start md:items-center py-6 border-b border-black/5 dark:border-white/5 cursor-pointer"
          >
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] uppercase tracking-widest font-bold text-blue-500">{project.category}</span>
                <span className="text-[9px] opacity-20">{project.year}</span>
              </div>
              <h3 className="text-xl font-bold group-hover:opacity-60 transition-opacity">{project.title}</h3>
              <p className="mt-1 text-xs opacity-50 group-hover:opacity-80 transition-opacity leading-relaxed max-w-lg">
                {project.description}
              </p>
            </div>
            <div className="mt-4 md:mt-0 opacity-0 group-hover:opacity-100 transition-all">
               <ArrowUpRight size={16} className="text-blue-500" />
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

// --- App Entry ---

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
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
    <div className={`selection:bg-accent selection:text-white`}>
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-accent z-[60] origin-left" 
        style={{ scaleX }} 
      />
      
      <div className="noise" />
      <Navbar theme={theme} toggle={toggleTheme} />
      
      <main className="px-6 md:px-12 lg:px-24 pt-20">
        <div className="max-w-6xl mx-auto">
          <Hero />
          <ProjectsList />
          <BlogList />
          <QuotesSection />
          <ContactSection />
          <Footer />
        </div>
      </main>

      {/* Decorative gradients for that "Surya/Marijana" feel */}
      <div className="fixed -top-[20%] -left-[10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
}
