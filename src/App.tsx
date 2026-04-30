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
  const [isReady, setIsReady] = useState(false);

  // Update ref when state changes
  useEffect(() => {
    gravityActiveRef.current = gravityActive;
    if (engineRef.current) {
      engineRef.current.world.gravity.y = gravityActive ? 1 : 0;
    }
  }, [gravityActive]);

  // Define positions and initial states
  const SKETCH_ITEMS = [
    { id: 'ai', Icon: Brain, size: 80, class: 'p-5 rounded-2xl bg-white dark:bg-black shadow-lg border border-black/10 dark:border-white/10 z-10', iconSize: 42, iconClass: 'text-blue-500', x: 0, y: 0 },
    { id: 'laptop', Icon: Monitor, size: 36, class: 'opacity-50 dark:opacity-70 text-zinc-700 dark:text-zinc-300', x: -160, y: -60 },
    { id: 'camera', Icon: Camera, size: 36, class: 'opacity-50 dark:opacity-70 text-zinc-700 dark:text-zinc-300', x: 160, y: -40 },
    { id: 'basketball', type: 'svg', size: 34, class: 'opacity-70 text-orange-600 dark:text-orange-500', x: -120, y: 80 },
    { id: 'books', Icon: BookOpen, size: 30, class: 'opacity-50 dark:opacity-70 text-zinc-700 dark:text-zinc-300', x: 120, y: 60 },
    { id: 'croatia', type: 'croatia', size: 35, class: 'text-red-600 dark:text-red-500', x: 200, y: 0 },
  ];

  useEffect(() => {
    if (!containerRef.current) return;
    setIsReady(true);

    const { Engine, Render, World, Bodies, Runner, MouseConstraint, Mouse, Composite } = Matter;
    
    // Create engine
    const engine = Engine.create();
    engineRef.current = engine;
    const world = engine.world;

    world.gravity.y = gravityActiveRef.current ? 1 : 0;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Boundaries
    const ground = Bodies.rectangle(width / 2, height + 50, width, 100, { isStatic: true });
    const ceiling = Bodies.rectangle(width / 2, -50, width, 100, { isStatic: true });
    const leftWall = Bodies.rectangle(-50, height / 2, 100, height, { isStatic: true });
    const rightWall = Bodies.rectangle(width + 50, height / 2, 100, height, { isStatic: true });

    Composite.add(world, [ground, ceiling, leftWall, rightWall]);

    // Create bodies for items
    SKETCH_ITEMS.forEach(item => {
      const body = Bodies.rectangle(
        width / 2 + item.x, 
        height / 2 + item.y, 
        item.size, 
        item.size, 
        { 
          restitution: 0.6, 
          friction: 0.1,
          frictionAir: 0.05
        }
      );
      bodiesRef.current[item.id] = body;
      Composite.add(world, body);
    });

    // Mouse control
    const mouse = Mouse.create(containerRef.current);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });

    Composite.add(world, mouseConstraint);

    // Run the engine
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Sync bodies with DOM
    let animationId: number;
    const update = () => {
      if (engineRef.current) {
        if (!gravityActiveRef.current) {
          // Add gentle floating forces when gravity is off
          SKETCH_ITEMS.forEach(item => {
            const body = bodiesRef.current[item.id];
            if (body) {
              const time = Date.now() * 0.001;
              const ix = SKETCH_ITEMS.indexOf(item);
              const forceMagnitude = 0.00002;
              
              Matter.Body.applyForce(body, body.position, {
                x: Math.sin(time + ix) * forceMagnitude,
                y: Math.cos(time * 0.8 + ix) * forceMagnitude
              });

              // Keep them centered-ish when floating
              const dx = (width / 2 + item.x) - body.position.x;
              const dy = (height / 2 + item.y) - body.position.y;
              Matter.Body.applyForce(body, body.position, {
                x: dx * 0.00001,
                y: dy * 0.00001
              });
            }
          });
        }

        SKETCH_ITEMS.forEach(item => {
          const body = bodiesRef.current[item.id];
          const element = itemsRef.current[item.id];
          if (body && element) {
            const x = body.position.x - width / 2;
            const y = body.position.y - height / 2;
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
    };
  }, [isReady]);

  return (
    <div className="relative group">
      <div 
        ref={containerRef} 
        className="relative w-full h-48 md:h-64 mb-10 rounded-3xl overflow-hidden border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-center cursor-crosshair"
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
        
        <div className="relative w-full h-full" style={{ filter: 'url(#sketchy)' }}>
          {SKETCH_ITEMS.map((item) => (
            <div
              key={item.id}
              ref={el => itemsRef.current[item.id] = el}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none ${item.class}`}
              style={{ width: item.size, height: item.size }}
            >
              <div className="w-full h-full flex items-center justify-center">
                {item.Icon && <item.Icon size={item.iconSize || item.size} className={item.iconClass} strokeWidth={2} />}
                
                {item.type === 'svg' && (
                  <svg width={item.size} height={item.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M2 12h20"></path>
                    <path d="M12 2v20"></path>
                    <path d="M4.9 4.9C6.9 8.2 6.9 15.8 4.9 19.1"></path>
                    <path d="M19.1 4.9C17.1 8.2 17.1 15.8 19.1 19.1"></path>
                  </svg>
                )}

                {item.type === 'croatia' && (
                  <div className="grid grid-cols-2 gap-1 w-full h-full p-1">
                    <div className="bg-current opacity-80 rounded-[2px]"></div>
                    <div className="bg-transparent border-2 border-current opacity-60 rounded-[2px]"></div>
                    <div className="bg-transparent border-2 border-current opacity-60 rounded-[2px]"></div>
                    <div className="bg-current opacity-80 rounded-[2px]"></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Gravity Control Overlay */}
        <div className="absolute bottom-4 right-4 z-20 flex gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); setGravityActive(!gravityActive); }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all border ${
              gravityActive 
                ? 'bg-blue-500 text-white border-blue-400' 
                : 'bg-white/80 dark:bg-black/80 text-black dark:text-white border-black/10 dark:border-white/10'
            } hover:scale-105 active:scale-95`}
          >
            <Target size={12} className={gravityActive ? 'animate-bounce' : ''} />
            {gravityActive ? 'Gravity ON' : 'Gravity OFF'}
          </button>
        </div>
      </div>
      
      {/* Interaction Hint */}
      {!gravityActive && (
        <motion.div 
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold uppercase tracking-[0.2em] opacity-40 pointer-events-none"
        >
          Toggle gravity to see physics in action
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
