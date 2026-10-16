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

const Reading: React.FC = () => {
  const navigateHome = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
      e.preventDefault();
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#Faf9f6] text-[#20242c] font-sans flex flex-col justify-start px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 selection:bg-[#1c2229] selection:text-white antialiased">
      <div className="max-w-[700px] w-full mx-auto">
        
        {/* Navigation back to main site */}
        <div className="mb-6">
          <a
            href="/"
            onClick={navigateHome}
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#1c2229]/60 hover:text-[#1c2229] transition-colors mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>Vedran Brozović</span>
          </a>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1c2229]">
            Reading
          </h1>
        </div>

        {/* Credo introductory note - simple text without standing out */}
        <p className="text-[15px] sm:text-base text-[#1c2229]/75 mb-10 leading-relaxed">
          These are two of my favourite poems and they are my credo.
        </p>

        {/* POEM 1 (FIRST): THE GUY IN THE GLASS BY DALE WIMBROW */}
        <article className="mb-14">
          <header className="mb-5">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1c2229] tracking-tight mb-1">
              The Guy in the Glass
            </h2>
            <p className="text-sm font-medium text-[#1c2229]/60">
              by Dale Wimbrow (1934)
            </p>
          </header>

          {/* Intro & Copyright Notice */}
          <div className="mb-6 text-sm sm:text-base leading-relaxed text-[#3b4350] space-y-3">
            <p>
              For copyright and history details, visit{' '}
              <a 
                href="https://www.theguyintheglass.com/copyright.htm" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#1c2229] underline decoration-[#1c2229]/30 hover:decoration-[#1c2229] underline-offset-[3px] font-medium transition-colors inline-flex items-center gap-1"
              >
                <span>theguyintheglass.com/copyright.htm</span>
                <ExternalLink className="w-3 h-3 inline-block opacity-70" />
              </a>
              .
            </p>
            <p>
              The original poem by Dale Wimbrow titled &ldquo;The Guy in the Glass&rdquo; was first published in the <em>American Magazine</em> in 1934. The magazine had asked their readers to offer an answer to a young man&apos;s question to the Editor of the magazine as to &ldquo;Why he should be honest&rdquo;. The following is an excerpt from the issue that ran our father&apos;s poem:
            </p>
          </div>

          {/* Excerpt */}
          <div className="mb-8 p-4 sm:p-5 rounded-lg bg-[#f4f5f7] border-l-4 border-[#1c2229]/30 text-sm sm:text-[15px] leading-relaxed text-[#3b4350] space-y-3 italic">
            <div>
              <p className="font-semibold text-[#1c2229] not-italic mb-1">Why be honest?</p>
              <p>
                An eighteen-year-old boy recently wrote a letter the Editor of the American Magazine. &ldquo;One good reason, please,&rdquo; he asked, &ldquo;why an ambitious young man should be honest.&rdquo; In publishing that letter in the February issue we invited readers to answer him. His challenge aroused immense interest. Replies by the thousands poured in, are still pouring in as we go to press. They come from all walks of life, from oldsters and youngsters alike. The replies are now being considered by the judges, whose decision as to the prize-winners will be announced in an early issue.
              </p>
            </div>
            <div>
              <p>
                While awaiting the final verdict, we want to share with you some of the high lights from the letters received. Here are a few random excerpts:
              </p>
            </div>
            <div>
              <p className="font-semibold text-[#1c2229] not-italic mb-1">What the readers say</p>
              <p>
                From Jackson Heights, N.Y. comes this reply to J.W.s query about the value of being honest:
              </p>
            </div>
          </div>

          {/* Poem Body */}
          <div className="space-y-6 text-[15px] sm:text-[17px] leading-[1.8] text-[#2b333e] font-normal pl-3 sm:pl-4 border-l-2 border-[#1c2229]/20">
            <p>
              When you get what you want in your struggle for pelf,<br />
              &nbsp;&nbsp;&nbsp;&nbsp;And the world makes you king for a day,<br />
              Then go to the mirror and look at yourself,<br />
              &nbsp;&nbsp;&nbsp;&nbsp;And see what that guy has to say.
            </p>

            <p>
              For it isn&apos;t your father, or mother, or wife,<br />
              &nbsp;&nbsp;&nbsp;&nbsp;Whose judgment upon you must pass.<br />
              The feller whose verdict counts most in your life<br />
              &nbsp;&nbsp;&nbsp;&nbsp;Is the guy staring back from the glass.
            </p>

            <p>
              He&apos;s the feller to please, never mind all the rest,<br />
              &nbsp;&nbsp;&nbsp;&nbsp;For he&apos;s with you clear up to the end,<br />
              And you&apos;ve passed your most dangerous, difficult test<br />
              &nbsp;&nbsp;&nbsp;&nbsp;If the guy in the glass is your friend.
            </p>

            <p>
              You may be like Jack Horner and &ldquo;chisel&rdquo; a plum,<br />
              &nbsp;&nbsp;&nbsp;&nbsp;And think you&apos;re a wonderful guy,<br />
              But the man in the glass says you&apos;re only a bum<br />
              &nbsp;&nbsp;&nbsp;&nbsp;If you can&apos;t look him straight in the eye.
            </p>

            <p>
              You can fool the whole world down the pathway of years,<br />
              &nbsp;&nbsp;&nbsp;&nbsp;And get pats on the back as you pass,<br />
              But your final reward will be heartaches and tears<br />
              &nbsp;&nbsp;&nbsp;&nbsp;If you&apos;ve cheated the guy in the glass.
            </p>
          </div>
        </article>

        {/* Divider */}
        <hr className="border-[#e2e5eb] mb-14" />

        {/* POEM 2 (SECOND): IF BY RUDYARD KIPLING */}
        <article className="mb-16">
          <header className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1c2229] tracking-tight mb-1">
              If—
            </h2>
            <p className="text-sm font-medium text-[#1c2229]/60">
              by Rudyard Kipling (1895)
            </p>
          </header>

          <div className="space-y-6 text-[15px] sm:text-[17px] leading-[1.8] text-[#2b333e] font-normal pl-3 sm:pl-4 border-l-2 border-[#1c2229]/20">
            <p>
              If you can keep your head when all about you<br />
              &nbsp;&nbsp;&nbsp;&nbsp;Are losing theirs and blaming it on you,<br />
              If you can trust yourself when all men doubt you,<br />
              &nbsp;&nbsp;&nbsp;&nbsp;But make allowance for their doubting too;<br />
              If you can wait and not be tired by waiting,<br />
              &nbsp;&nbsp;&nbsp;&nbsp;Or being lied about, don’t deal in lies,<br />
              Or being hated, don’t give way to hating,<br />
              &nbsp;&nbsp;&nbsp;&nbsp;And yet don’t look too good, nor talk too wise:
            </p>

            <p>
              If you can dream—and not make dreams your master;<br />
              &nbsp;&nbsp;&nbsp;&nbsp;If you can think—and not make thoughts your aim;<br />
              If you can meet with Triumph and Disaster<br />
              &nbsp;&nbsp;&nbsp;&nbsp;And treat those two impostors just the same;<br />
              If you can bear to hear the truth you’ve spoken<br />
              &nbsp;&nbsp;&nbsp;&nbsp;Twisted by knaves to make a trap for fools,<br />
              Or watch the things you gave your life to, broken,<br />
              &nbsp;&nbsp;&nbsp;&nbsp;And stoop and build ’em up with worn-out tools:
            </p>

            <p>
              If you can make one heap of all your winnings<br />
              &nbsp;&nbsp;&nbsp;&nbsp;And risk it on one turn of pitch-and-toss,<br />
              And lose, and start again at your beginnings<br />
              &nbsp;&nbsp;&nbsp;&nbsp;And never breathe a word about your loss;<br />
              If you can force your heart and nerve and sinew<br />
              &nbsp;&nbsp;&nbsp;&nbsp;To serve your turn long after they are gone,<br />
              And so hold on when there is nothing in you<br />
              &nbsp;&nbsp;&nbsp;&nbsp;Except the Will which says to them: ‘Hold on!’
            </p>

            <p>
              If you can talk with crowds and keep your virtue,<br />
              &nbsp;&nbsp;&nbsp;&nbsp;Or walk with Kings—nor lose the common touch,<br />
              If neither foes nor loving friends can hurt you,<br />
              &nbsp;&nbsp;&nbsp;&nbsp;If all men count with you, but none too much;<br />
              If you can fill the unforgiving minute<br />
              &nbsp;&nbsp;&nbsp;&nbsp;With sixty seconds’ worth of distance run,<br />
              Yours is the Earth and everything that’s in it,<br />
              &nbsp;&nbsp;&nbsp;&nbsp;And—which is more—you’ll be a Man, my son!
            </p>
          </div>
        </article>

        {/* Footer with return link & social icons matching main site */}
        <footer className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6 border-t border-[#e2e5eb] pt-7 mt-12">
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
              onClick={navigateHome}
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

export default Reading;
