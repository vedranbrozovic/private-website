import React from 'react';
import {
  ArrowLeft,
  ExternalLink,
  Linkedin,
  Github,
  Instagram,
  Youtube,
  Twitter
} from 'lucide-react';
import { SocialLink } from './SocialLink';

const navigateTo = (path: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
  if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
    e.preventDefault();
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

interface PageShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const PageShell: React.FC<PageShellProps> = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen bg-[#Faf9f6] text-[#20242c] font-sans flex flex-col justify-start px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 selection:bg-[#1c2229] selection:text-white antialiased">
      <div className="max-w-[680px] w-full mx-auto">
        <div className="mb-8">
          <a
            href="/"
            onClick={navigateTo('/')}
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#1c2229]/60 hover:text-[#1c2229] transition-colors mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>Vedran Brozović</span>
          </a>
          <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-[#1c2229]">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[15px] sm:text-base text-[#555f6f] mt-2 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        <main className="space-y-8 text-[15px] sm:text-[16px] leading-relaxed text-[#374151]">
          {children}
        </main>

        <footer className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6 border-t border-[#e2e5eb] pt-7 mt-14">
          <div className="flex gap-2.5 sm:gap-3.5 items-center flex-wrap">
            <SocialLink
              href="https://www.linkedin.com/in/vedranbrozovic/"
              icon={Linkedin}
              label="LinkedIn"
              platform="linkedin"
            />
            <SocialLink
              href="https://github.com/vedranbrozovic"
              icon={Github}
              label="GitHub"
              platform="github"
            />
            <SocialLink
              href="https://instagram.com/vedranbrozovic"
              icon={Instagram}
              label="Instagram"
              platform="instagram"
            />
            <SocialLink
              href="https://www.youtube.com/@vedran.brozovic"
              icon={Youtube}
              label="YouTube"
              platform="youtube"
            />
            <SocialLink
              href="https://twitter.com/vedranbrozovic"
              icon={Twitter}
              label="Twitter (X)"
              platform="twitter"
            />
          </div>

          <div>
            <a
              href="/"
              onClick={navigateTo('/')}
              className="text-xs sm:text-sm font-medium text-[#1c2229]/60 hover:text-[#1c2229] inline-flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to main site</span>
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export const EducationPage: React.FC = () => (
  <PageShell
    title="Education"
    subtitle="Faculty of Economics & Business, University of Zagreb (EFZG)"
  >
    <section className="space-y-4">
      <p>
        Born and raised in Zagreb, I completed my BSc and MSc in Economics and Managerial Informatics at the{' '}
        <span className="text-[#1c2229] font-medium">University of Zagreb (EFZG)</span>. My academic work focused on the intersection of quantitative methods, machine learning, and digital platform economics, recognized with two Rector&apos;s Awards and two Dean&apos;s Awards.
      </p>
    </section>

    <section className="space-y-4 pt-2">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-[#1c2229]/60">
        Selected Research &amp; Papers
      </h2>
      <div className="space-y-3">
        <a
          href="https://repozitorij.efzg.unizg.hr/en/object/efzg:2726"
          target="_blank"
          rel="noopener noreferrer"
          className="block p-4 rounded-xl bg-white/80 hover:bg-white border border-[#e2e5eb] hover:border-[#1c2229]/30 transition-all group"
        >
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-medium text-[#1c2229] group-hover:underline underline-offset-4">
              Artificial Intelligence &amp; Managerial Decision Systems
            </h3>
            <ExternalLink className="w-3.5 h-3.5 text-[#1c2229]/40 group-hover:text-[#1c2229] shrink-0" />
          </div>
          <p className="text-xs sm:text-sm text-[#555f6f] mt-1">
            EFZG Repository · Graduate Research
          </p>
        </a>

        <a
          href="https://repozitorij.efzg.unizg.hr/en/object/efzg:5862"
          target="_blank"
          rel="noopener noreferrer"
          className="block p-4 rounded-xl bg-white/80 hover:bg-white border border-[#e2e5eb] hover:border-[#1c2229]/30 transition-all group"
        >
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-medium text-[#1c2229] group-hover:underline underline-offset-4">
              Advanced Analytics &amp; Predictive Modeling
            </h3>
            <ExternalLink className="w-3.5 h-3.5 text-[#1c2229]/40 group-hover:text-[#1c2229] shrink-0" />
          </div>
          <p className="text-xs sm:text-sm text-[#555f6f] mt-1">
            EFZG Repository · Managerial Informatics
          </p>
        </a>

        <a
          href="https://apps.unizg.hr/rektorova-nagrada/javno/radovi/298/preuzmi"
          target="_blank"
          rel="noopener noreferrer"
          className="block p-4 rounded-xl bg-white/80 hover:bg-white border border-[#e2e5eb] hover:border-[#1c2229]/30 transition-all group"
        >
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-medium text-[#1c2229] group-hover:underline underline-offset-4">
              The Sharing Economy — Rector&apos;s Award Research Paper
            </h3>
            <ExternalLink className="w-3.5 h-3.5 text-[#1c2229]/40 group-hover:text-[#1c2229] shrink-0" />
          </div>
          <p className="text-xs sm:text-sm text-[#555f6f] mt-1">
            University of Zagreb · Rector&apos;s Award Winner
          </p>
        </a>
      </div>
    </section>
  </PageShell>
);

export const WorkPage: React.FC = () => (
  <PageShell
    title="Work"
    subtitle="From Croatia via Luxembourg to the United States, and from finance via engineering to product."
  >
    <div className="space-y-6">
      <div className="p-5 rounded-xl bg-white/80 border border-[#e2e5eb] space-y-2">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-semibold text-[#1c2229]">Amazon</h2>
          <span className="text-xs font-medium text-[#555f6f]">AI &amp; Data Product Manager</span>
        </div>
        <p className="text-sm sm:text-[15px] text-[#374151] leading-relaxed">
          6+ years scaling enterprise GenAI and analytics products at Amazon—defining the vision, setting multi-year roadmaps, and leading high-ambiguity products from 0 to 1. My AI work was the first featured story of Amazon&apos;s <em>rAIsing the Bar</em> series and was discussed on the{' '}
          <a
            href="https://open.spotify.com/episode/1MThk2sP927U64eeRbBIE0"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1c2229] underline decoration-[#1c2229]/30 hover:decoration-[#1c2229] underline-offset-[3px]"
          >
            <em>strAIght talk</em> podcast
          </a>
          .
        </p>
      </div>

      <div className="p-5 rounded-xl bg-white/80 border border-[#e2e5eb] space-y-2">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-semibold text-[#1c2229]">Ernst &amp; Young (EY)</h2>
          <span className="text-xs font-medium text-[#555f6f]">Consulting</span>
        </div>
        <p className="text-sm sm:text-[15px] text-[#374151] leading-relaxed">
          Worked in advisory and consulting engagements focusing on financial analysis, business transformation, and data-driven strategy.
        </p>
      </div>

      <div className="p-5 rounded-xl bg-white/80 border border-[#e2e5eb] space-y-2">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-semibold text-[#1c2229]">IKEA &amp; Croatian National Bank</h2>
          <span className="text-xs font-medium text-[#555f6f]">Business Analytics &amp; Econometric Modeling</span>
        </div>
        <p className="text-sm sm:text-[15px] text-[#374151] leading-relaxed">
          Built analytical models and business intelligence solutions at IKEA, following early quantitative work in econometric modeling at the Croatian National Bank.
        </p>
      </div>

      <div className="p-5 rounded-xl bg-white/80 border border-[#e2e5eb] space-y-2">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-semibold text-[#1c2229]">Startup Mentoring</h2>
          <span className="text-xs font-medium text-[#555f6f]">Nuqleus &amp; Infobip Startup Tribe</span>
        </div>
        <p className="text-sm sm:text-[15px] text-[#374151] leading-relaxed">
          Mentoring early-stage founders and deep-tech spin-offs on product strategy and 0-to-1 execution through{' '}
          <a
            href="https://nuqleus.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1c2229] underline decoration-[#1c2229]/30 hover:decoration-[#1c2229] underline-offset-[3px]"
          >
            Nuqleus
          </a>{' '}
          and the{' '}
          <a
            href="https://www.egcnyc.org/programs/scale-2-0"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1c2229] underline decoration-[#1c2229]/30 hover:decoration-[#1c2229] underline-offset-[3px]"
          >
            Infobip Startup Tribe
          </a>
          .
        </p>
      </div>
    </div>
  </PageShell>
);

export const NonprofitPage: React.FC = () => (
  <PageShell
    title="Nonprofit & Community"
    subtitle="Association of Croatian-American Professionals (ACAP)"
  >
    <section className="space-y-4">
      <p>
        I serve as a Director on the Board of the{' '}
        <a
          href="https://croampro.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#1c2229] underline decoration-[#1c2229]/30 hover:decoration-[#1c2229] underline-offset-[3px]"
        >
          Association of Croatian-American Professionals (ACAP)
        </a>
        , where I chair the Technology and Innovation Committee.
      </p>
      <p>
        Previously, I led the Pacific Northwest chapter in Seattle and chaired the{' '}
        <a
          href="https://conference.croampro.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#1c2229] underline decoration-[#1c2229]/30 hover:decoration-[#1c2229] underline-offset-[3px]"
        >
          10th Annual ACAP Conference
        </a>{' '}
        in Seattle, bringing together global leaders, entrepreneurs, engineers, and researchers across the diaspora.
      </p>
    </section>

    <section className="pt-2 space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-[#1c2229]/60">
        Interviews &amp; Features
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <a
          href="https://www.youtube.com/watch?v=D06qaNG_qWs&t=187s"
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 rounded-xl bg-white/80 hover:bg-white border border-[#e2e5eb] hover:border-[#1c2229]/30 transition-all flex items-center justify-between group"
        >
          <div>
            <h3 className="font-medium text-[#1c2229] group-hover:underline underline-offset-4">
              Conversation in English
            </h3>
            <p className="text-xs text-[#555f6f] mt-0.5">YouTube Interview</p>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-[#1c2229]/40 group-hover:text-[#1c2229]" />
        </a>

        <a
          href="https://www.youtube.com/watch?v=0WG-pwNJxKM&t=1264s"
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 rounded-xl bg-white/80 hover:bg-white border border-[#e2e5eb] hover:border-[#1c2229]/30 transition-all flex items-center justify-between group"
        >
          <div>
            <h3 className="font-medium text-[#1c2229] group-hover:underline underline-offset-4">
              Conversation in Croatian
            </h3>
            <p className="text-xs text-[#555f6f] mt-0.5">YouTube Feature</p>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-[#1c2229]/40 group-hover:text-[#1c2229]" />
        </a>
      </div>
    </section>
  </PageShell>
);

export const BallIsLifePage: React.FC = () => (
  <PageShell
    title="Ball Is Life"
    subtitle="From Zagreb youth courts to Luxembourg's top division and pickup runs in Seattle."
  >
    <section className="space-y-4">
      <p>
        Basketball has been a constant thread throughout my life. Growing up in Croatia, I won the Croatian junior national basketball championship and later competed in Luxembourg&apos;s top division while working in Europe.
      </p>
      <p>
        Today you can still find me on courts around Seattle and the Pacific Northwest.
      </p>
    </section>

    <section className="pt-2">
      <a
        href="https://www.youtube.com/shorts/9izlIisXmcA"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#1c2229] text-[#1c2229] hover:text-white border border-[#e2e5eb] transition-colors text-sm font-medium"
      >
        <span>Watch on court clip (YouTube Shorts)</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </section>
  </PageShell>
);

export const BlogPage: React.FC = () => (
  <PageShell
    title="Writing & Notes"
    subtitle="Essays, research notes, and ideas worth revisiting."
  >
    <section className="space-y-4">
      <p>
        A quiet corner for essays and notes on AI product strategy, economics, decision-making, and books. While new long-form essays are in drafts, you can explore my favourite poems and credo on the{' '}
        <a
          href="/reading"
          onClick={navigateTo('/reading')}
          className="text-[#1c2229] underline decoration-[#1c2229]/30 hover:decoration-[#1c2229] underline-offset-[3px]"
        >
          reading page
        </a>{' '}
        or interactive experiments on{' '}
        <a
          href="/vibecoding"
          onClick={navigateTo('/vibecoding')}
          className="text-[#1c2229] underline decoration-[#1c2229]/30 hover:decoration-[#1c2229] underline-offset-[3px]"
        >
          vibe coding apps
        </a>
        .
      </p>
    </section>

    <section className="space-y-3 pt-2">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-[#1c2229]/60">
        Favourite Quotes
      </h2>
      <div className="space-y-3">
        {[
          {
            text: 'Study hard what interests you the most in the most undisciplined, irreverent and original manner possible.',
            author: 'Richard Feynman'
          },
          {
            text: 'Never ask a barber whether you need a haircut.',
            author: 'Warren Buffett'
          },
          {
            text: "Ships are safe in the harbor, but that ain't what ships are made for.",
            author: 'John A. Shedd'
          },
          {
            text: 'It is not the best ones who succeed. It is the best ones of those who survive.',
            author: 'Luca Dellana'
          }
        ].map((q, idx) => (
          <blockquote
            key={idx}
            className="p-4 rounded-xl bg-white/80 border border-[#e2e5eb] text-sm sm:text-[15px] text-[#374151]"
          >
            <p className="italic">&ldquo;{q.text}&rdquo;</p>
            <footer className="mt-1.5 text-xs font-medium text-[#555f6f]">— {q.author}</footer>
          </blockquote>
        ))}
      </div>
    </section>
  </PageShell>
);

export const FilmPage: React.FC = () => (
  <PageShell
    title="Film & Visuals"
    subtitle="Cinema, visual storytelling, and moments from the Pacific Northwest."
  >
    <section className="space-y-4">
      <p>
        Capturing everyday moments around Puget Sound—from motorcycle rides and Washington State Ferries to travel photography and favourite cinema.
      </p>
    </section>

    <section className="space-y-3 pt-1">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-[#1c2229]/60">
        Visual Highlights
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <a
          href="https://www.youtube.com/shorts/CgKeP-biekc"
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 rounded-xl bg-white/80 hover:bg-white border border-[#e2e5eb] hover:border-[#1c2229]/30 transition-all flex items-center justify-between group"
        >
          <div>
            <h3 className="font-medium text-[#1c2229] group-hover:underline underline-offset-4">
              Riding Ferries Around Puget Sound
            </h3>
            <p className="text-xs text-[#555f6f] mt-0.5">YouTube Short</p>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-[#1c2229]/40 group-hover:text-[#1c2229]" />
        </a>

        <a
          href="https://www.instagram.com/stories/highlights/18126152053478952/"
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 rounded-xl bg-white/80 hover:bg-white border border-[#e2e5eb] hover:border-[#1c2229]/30 transition-all flex items-center justify-between group"
        >
          <div>
            <h3 className="font-medium text-[#1c2229] group-hover:underline underline-offset-4">
              Travel Stories &amp; Photography
            </h3>
            <p className="text-xs text-[#555f6f] mt-0.5">Instagram Highlights</p>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-[#1c2229]/40 group-hover:text-[#1c2229]" />
        </a>
      </div>
    </section>

    <section className="space-y-3 pt-2">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-[#1c2229]/60">
        Favourite Film
      </h2>
      <div className="p-4 rounded-xl bg-white/80 border border-[#e2e5eb]">
        <h3 className="font-medium text-[#1c2229]">Paterson</h3>
        <p className="text-xs text-[#555f6f] mt-0.5">Directed by Jim Jarmusch</p>
        <p className="text-sm text-[#374151] mt-2">
          A poetic and quiet look into the profound routines of an ordinary life.
        </p>
      </div>
    </section>
  </PageShell>
);
