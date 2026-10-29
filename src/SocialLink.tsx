import React, { useState } from 'react';

export type PlatformType = 'linkedin' | 'github' | 'instagram' | 'youtube' | 'twitter' | 'email';

export interface SocialLinkProps {
  href: string;
  icon: React.ElementType;
  label: string;
  platform: PlatformType;
  compact?: boolean;
}

export const BRAND_STYLES: Record<PlatformType, {
  hover: string;
  active: string;
  opened: string;
  tooltipBg: string;
}> = {
  linkedin: {
    hover: 'hover:bg-[#0A66C2] hover:border-[#0A66C2] hover:text-white hover:shadow-md hover:shadow-[#0A66C2]/30',
    active: 'active:bg-[#084e96] active:border-[#084e96] active:text-white',
    opened: 'bg-[#0A66C2] border-[#0A66C2] text-white shadow-sm shadow-[#0A66C2]/35',
    tooltipBg: 'bg-[#0A66C2]',
  },
  github: {
    hover: 'hover:bg-[#181717] hover:border-[#181717] hover:text-white hover:shadow-md hover:shadow-black/30',
    active: 'active:bg-black active:border-black active:text-white',
    opened: 'bg-[#181717] border-[#181717] text-white shadow-sm shadow-black/35',
    tooltipBg: 'bg-[#181717]',
  },
  instagram: {
    hover: 'hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:border-[#dc2743] hover:text-white hover:shadow-md hover:shadow-[#dc2743]/35',
    active: 'active:from-[#d87c22] active:via-[#be1b35] active:to-[#9a116f] active:text-white',
    opened: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] border-[#dc2743] text-white shadow-sm shadow-[#dc2743]/35',
    tooltipBg: 'bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888]',
  },
  youtube: {
    hover: 'hover:bg-[#FF0000] hover:border-[#FF0000] hover:text-white hover:shadow-md hover:shadow-[#FF0000]/30',
    active: 'active:bg-[#cc0000] active:border-[#cc0000] active:text-white',
    opened: 'bg-[#FF0000] border-[#FF0000] text-white shadow-sm shadow-[#FF0000]/35',
    tooltipBg: 'bg-[#FF0000]',
  },
  twitter: {
    hover: 'hover:bg-[#000000] hover:border-[#000000] hover:text-white hover:shadow-md hover:shadow-black/30',
    active: 'active:bg-[#111111] active:border-[#111111] active:text-white',
    opened: 'bg-[#000000] border-[#000000] text-white shadow-sm shadow-black/35',
    tooltipBg: 'bg-[#000000]',
  },
  email: {
    hover: 'hover:bg-[#EA4335] hover:border-[#EA4335] hover:text-white hover:shadow-md hover:shadow-[#EA4335]/30',
    active: 'active:bg-[#c5221f] active:border-[#c5221f] active:text-white',
    opened: 'bg-[#EA4335] border-[#EA4335] text-white shadow-sm shadow-[#EA4335]/35',
    tooltipBg: 'bg-[#EA4335]',
  },
};

export const SocialLink = ({ href, icon: Icon, label, platform, compact = false }: SocialLinkProps) => {
  const [copied, setCopied] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [isOpened, setIsOpened] = useState<boolean>(() => {
    try {
      return localStorage.getItem(`vb_social_opened_${platform}`) === 'true';
    } catch {
      return false;
    }
  });

  React.useEffect(() => {
    const syncOpened = () => {
      try {
        if (localStorage.getItem(`vb_social_opened_${platform}`) === 'true') {
          setIsOpened(true);
        }
      } catch {
        // ignore
      }
    };
    window.addEventListener('vb-social-opened', syncOpened);
    return () => window.removeEventListener('vb-social-opened', syncOpened);
  }, [platform]);

  const isEmail = href.startsWith('mailto:');
  const style = BRAND_STYLES[platform];

  const handleClick = () => {
    setClicked(true);
    setIsOpened(true);
    try {
      localStorage.setItem(`vb_social_opened_${platform}`, 'true');
      window.dispatchEvent(new Event('vb-social-opened'));
    } catch {
      // ignore
    }
    setTimeout(() => setClicked(false), 300);

    if (isEmail) {
      const email = href.replace('mailto:', '');
      navigator.clipboard?.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative group/social">
      <a 
        href={href} 
        target={isEmail ? undefined : "_blank"}
        rel={isEmail ? undefined : "noopener noreferrer"}
        onClick={handleClick}
        className={`
          relative flex items-center justify-center ${compact ? 'w-8 h-8 rounded-lg' : 'w-10 h-10 sm:w-10 sm:h-10 rounded-xl'}
          transition-all duration-200 ease-out touch-manipulation select-none
          ${
            isOpened 
              ? `${style.opened} hover:brightness-105 active:scale-95` 
              : `bg-white/80 border border-[#e2e5eb] text-[#555f6f] shadow-2xs ${style.hover} ${style.active}`
          }
          ${clicked ? 'scale-90' : 'hover:-translate-y-0.5 hover:scale-105'}
          focus:outline-hidden focus:ring-2 focus:ring-[#1c2229]/20
        `}
        aria-label={label}
      >
        <Icon 
          size={compact ? 15 : 18} 
          strokeWidth={1.8} 
          className={`transition-transform duration-200 group-hover/social:scale-110 ${isOpened ? 'text-white' : ''}`} 
        />
      </a>

      {/* Interactive Tooltip with matching brand accent */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover/social:opacity-100 group-hover/social:-translate-y-1 transition-all duration-200 z-20 flex flex-col items-center">
        <div className={`px-2 py-0.5 rounded-md ${style.tooltipBg} text-white text-[11px] font-medium tracking-wide shadow-md whitespace-nowrap`}>
          {copied ? 'Copied email!' : isOpened ? `Opened · ${label}` : label}
        </div>
        <div className="w-1.5 h-1.5 bg-[#1c2229] rotate-45 -mt-0.5 opacity-80" />
      </div>
    </div>
  );
};
