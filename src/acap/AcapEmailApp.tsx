import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Copy,
  Check,
  RotateCcw,
  Download,
  Share2,
  Code2,
  Smartphone,
  Monitor,
  Sun,
  Moon,
  ArrowUpDown,
  Linkedin,
  Instagram,
  Facebook,
  Youtube
} from 'lucide-react';

// ============================================================================
// 1. OFFICIAL ACAP CONSTANTS & SIMPLE SELF-SERVICE OPTIONS
// ============================================================================
const ACAP_HOSTED_LOGO_URL =
  'https://ci3.googleusercontent.com/mail-sig/AIorK4wEqSyvBO5OYbjCoZh_TRsFJvM1Csn61Zm9l7rRH0bv8K4JYNEqzqLd51uDeazNIjDfrCb6vfQ';

export type ColorPaletteMode = 'adaptive' | 'crimson' | 'classic';
export type SocialIconStyle = 'website-card' | 'website-brand' | 'acap-crimson' | 'minimal';

export interface SocialChannel {
  id: 'linkedin' | 'instagram' | 'facebook' | 'youtube';
  label: string;
  url: string;
  brandHex: string;
  iconWhiteUrl: string;
  iconSlateUrl: string;
  iconCrimsonUrl: string;
  iconBrandUrl: string;
}

export const OFFICIAL_SOCIAL_CHANNELS: SocialChannel[] = [
  {
    id: 'linkedin',
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/company/acap/',
    brandHex: '#0A66C2',
    iconWhiteUrl: 'https://img.icons8.com/ios-filled/96/ffffff/linkedin.png',
    iconSlateUrl: 'https://img.icons8.com/ios-filled/96/475569/linkedin.png',
    iconCrimsonUrl: 'https://img.icons8.com/ios-filled/96/e81053/linkedin.png',
    iconBrandUrl: 'https://img.icons8.com/ios-filled/96/0A66C2/linkedin.png',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    url: 'https://www.instagram.com/acap_croampro/',
    brandHex: '#dc2743',
    iconWhiteUrl: 'https://img.icons8.com/ios-filled/96/ffffff/instagram-new.png',
    iconSlateUrl: 'https://img.icons8.com/ios-filled/96/475569/instagram-new.png',
    iconCrimsonUrl: 'https://img.icons8.com/ios-filled/96/e81053/instagram-new.png',
    iconBrandUrl: 'https://img.icons8.com/ios-filled/96/dc2743/instagram-new.png',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    url: 'https://www.facebook.com/croampro/',
    brandHex: '#1877F2',
    iconWhiteUrl: 'https://img.icons8.com/ios-filled/96/ffffff/facebook-new.png',
    iconSlateUrl: 'https://img.icons8.com/ios-filled/96/475569/facebook-new.png',
    iconCrimsonUrl: 'https://img.icons8.com/ios-filled/96/e81053/facebook-new.png',
    iconBrandUrl: 'https://img.icons8.com/ios-filled/96/1877F2/facebook-new.png',
  },
  {
    id: 'youtube',
    label: 'YouTube',
    url: 'https://www.youtube.com/channel/UCN0TeaVV29ldOKLqQ2PhuvQ',
    brandHex: '#FF0000',
    iconWhiteUrl: 'https://img.icons8.com/ios-filled/96/ffffff/youtube-play.png',
    iconSlateUrl: 'https://img.icons8.com/ios-filled/96/475569/youtube-play.png',
    iconCrimsonUrl: 'https://img.icons8.com/ios-filled/96/e81053/youtube-play.png',
    iconBrandUrl: 'https://img.icons8.com/ios-filled/96/FF0000/youtube-play.png',
  },
];

// Grouped common role pre-fills (simple, clean blocks)
export const ROLE_GROUPS: { group: string; options: string[] }[] = [
  {
    group: 'Leadership & Board',
    options: [
      'Board Member',
      'Board Member | Conference Chair',
      'Board Member | Technology & Innovation',
      'Executive Committee Member',
    ],
  },
  {
    group: 'Chapters & Committees',
    options: [
      'Chapter President',
      'Chapter Board Member',
      'Committee Chair',
      'Committee Member',
      'Member',
    ],
  },
];

// Common Chapter / Organization Subtitle options (with Pacific Northwest (PNW))
export const CHAPTER_OPTIONS: string[] = [
  'ACAP Foundation',
  'Pacific Northwest (PNW)',
  'New York Chapter',
  'Chicago Chapter',
  'Washington D.C. Chapter',
  'Los Angeles Chapter',
  'Silicon Valley Chapter',
  'Zagreb Chapter',
];

// Official CTA Button Options
export interface ActionButtonOption {
  id: 'member' | 'conference' | 'donate' | 'website';
  label: string;
  buttonText: string;
  url: string;
  description: string;
}

export const ACTION_BUTTON_OPTIONS: ActionButtonOption[] = [
  {
    id: 'member',
    label: 'Become a Member',
    buttonText: 'Become a Member',
    url: 'https://members.croampro.com/signup',
    description: 'members.croampro.com/signup',
  },
  {
    id: 'conference',
    label: 'Annual Conference',
    buttonText: 'Annual Conference',
    url: 'https://croampro.com/annual-conference',
    description: 'croampro.com/annual-conference',
  },
  {
    id: 'donate',
    label: 'Donate',
    buttonText: 'Donate',
    url: 'https://members.croampro.com/donations/foundation',
    description: 'members.croampro.com/donations/foundation',
  },
  {
    id: 'website',
    label: 'Visit Our Website',
    buttonText: 'Visit Our Website',
    url: 'https://croampro.com/',
    description: 'croampro.com',
  },
];

function getAcapLogoFallbackSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 230 65" width="125" height="35">
    <g fill="#e81053" font-family="Arial Black, Impact, sans-serif" font-weight="900" font-size="56">
      <text x="2" y="52">A</text>
      <text x="68" y="52">C</text>
      <text x="116" y="52">A</text>
      <text x="166" y="52">P</text>
    </g>
    <rect x="48" y="13" width="8" height="8" fill="#e81053"/>
    <rect x="56" y="21" width="8" height="8" fill="#e81053"/>
    <rect x="48" y="29" width="8" height="8" fill="#e81053"/>
    <rect x="56" y="37" width="8" height="8" fill="#e81053"/>
    <rect x="48" y="45" width="8" height="8" height="8" fill="#e81053"/>
    <text x="213" y="20" fill="#e81053" font-family="Arial, sans-serif" font-weight="bold" font-size="7">TM</text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

function escapeHtml(str: string): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export default function AcapEmailApp() {
  const isStandalone = useMemo(() => {
    try {
      return window.self === window.top;
    } catch {
      return false;
    }
  }, []);

  const initialParams = useMemo(() => {
    try {
      return new URLSearchParams(window.location.search);
    } catch {
      return new URLSearchParams();
    }
  }, []);

  // Step 1 State: Member Info
  const [name, setName] = useState<string>(
    () => initialParams.get('name') || 'Vedran Brozović'
  );
  const [role, setRole] = useState<string>(
    () => initialParams.get('role') || 'Board Member | Conference Chair'
  );
  const [phone, setPhone] = useState<string>(() => initialParams.get('phone') || '');
  const [chapter, setChapter] = useState<string>(
    () => initialParams.get('chapter') || 'Pacific Northwest (PNW)'
  );

  // Appearance & Button Selection State
  const [colorPalette, setColorPalette] = useState<ColorPaletteMode>('adaptive');
  const [iconStyle, setIconStyle] = useState<SocialIconStyle>('website-card');
  // Selected buttons in order (first button = primary crimson, second = secondary light pill)
  const [selectedButtons, setSelectedButtons] = useState<ActionButtonOption['id'][]>([
    'member',
    'website',
  ]);

  // Simulator & Guide State
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [guideTab, setGuideTab] = useState<'gmail' | 'outlook' | 'apple'>('gmail');
  const [copiedVisual, setCopiedVisual] = useState<boolean>(false);
  const [copiedHtml, setCopiedHtml] = useState<boolean>(false);
  const [copiedShareUrl, setCopiedShareUrl] = useState<boolean>(false);
  const [toast, setToast] = useState<{ title: string; subtitle: string } | null>(null);

  const triggerToast = (title: string, subtitle: string) => {
    setToast({ title, subtitle });
    setTimeout(() => {
      setToast((prev) => (prev?.title === title ? null : prev));
    }, 4000);
  };

  // Toggle an action button option (up to 2 buttons for a clean, professional layout)
  const handleToggleButton = (btnId: ActionButtonOption['id']) => {
    setSelectedButtons((prev) => {
      if (prev.includes(btnId)) {
        return prev.filter((id) => id !== btnId);
      }
      if (prev.length >= 2) {
        // Replace the second button so it never gets cluttered with too many buttons
        return [prev[0], btnId];
      }
      return [...prev, btnId];
    });
  };

  const handleSwapButtonOrder = () => {
    setSelectedButtons((prev) => (prev.length === 2 ? [prev[1], prev[0]] : prev));
  };

  // ============================================================================
  // 2. EMAIL-SAFE SIGNATURE HTML BUILDER
  // ============================================================================
  const buildSignatureHTML = (includeFallbackOnError: boolean = true): string => {
    const safeName = escapeHtml(name.trim() || 'Vedran Brozović');
    const safeRole = escapeHtml(role.trim() || 'Board Member');
    const safePhone = escapeHtml(phone.trim());
    const safeChapter = escapeHtml(chapter.trim() || 'ACAP Foundation');

    let nameColorRule = '';
    let roleColorRule = '';
    const orgColorHex = '#7c8594';
    let linkColorHex = '#e81053';

    if (colorPalette === 'crimson') {
      nameColorRule = 'color:#e81053;';
      roleColorRule = '';
    } else if (colorPalette === 'classic') {
      nameColorRule = 'color:#010333;';
      roleColorRule = 'color:#010333;';
      linkColorHex = '#2563eb';
    } else {
      nameColorRule = '';
      roleColorRule = '';
      linkColorHex = '#e81053';
    }

    const phoneRowHTML = safePhone
      ? `<tr>
                <td style="padding:0px 0px 8px 0px;font-size:9pt;font-family:Tahoma,Arial,sans-serif;color:${orgColorHex};line-height:1.3;">
                  ${safePhone}
                </td>
              </tr>`
      : '';

    // 4 Simple & Pretty Social Icon Styles
    const socialCellsHTML = OFFICIAL_SOCIAL_CHANNELS.map((ch, idx) => {
      const isLast = idx === OFFICIAL_SOCIAL_CHANNELS.length - 1;
      const spacerCell = isLast ? '' : `<td width="7" style="width:7px;font-size:1px;">&nbsp;</td>`;

      if (iconStyle === 'website-brand') {
        // Option 2: Website Filled Brand Tiles
        return `<td valign="middle" align="center" width="28" height="28" bgcolor="${ch.brandHex}" style="width:28px;height:28px;background-color:${ch.brandHex};border:1px solid ${ch.brandHex};border-radius:7px;text-align:center;vertical-align:middle;">
                          <a href="${ch.url}" target="_blank" title="ACAP on ${ch.label}" style="text-decoration:none;display:block;width:28px;height:28px;line-height:28px;">
                            <img alt="${ch.label}" border="0" width="15" height="15" src="${ch.iconWhiteUrl}" style="border:0px;display:inline-block;vertical-align:middle;width:15px;height:15px;">
                          </a>
                        </td>${spacerCell}`;
      }

      if (iconStyle === 'website-card') {
        // Option 1: Website Soft Card Badges
        return `<td valign="middle" align="center" width="28" height="28" bgcolor="#f8fafc" style="width:28px;height:28px;background-color:#f8fafc;border:1px solid #e2e5eb;border-radius:7px;text-align:center;vertical-align:middle;">
                          <a href="${ch.url}" target="_blank" title="ACAP on ${ch.label}" style="text-decoration:none;display:block;width:28px;height:28px;line-height:28px;">
                            <img alt="${ch.label}" border="0" width="15" height="15" src="${ch.iconBrandUrl}" style="border:0px;display:inline-block;vertical-align:middle;width:15px;height:15px;">
                          </a>
                        </td>${spacerCell}`;
      }

      if (iconStyle === 'acap-crimson') {
        // Option 3: ACAP Crimson Badges
        return `<td valign="middle" align="center" width="28" height="28" bgcolor="#fff1f5" style="width:28px;height:28px;background-color:#fff1f5;border:1px solid #fecdd3;border-radius:7px;text-align:center;vertical-align:middle;">
                          <a href="${ch.url}" target="_blank" title="ACAP on ${ch.label}" style="text-decoration:none;display:block;width:28px;height:28px;line-height:28px;">
                            <img alt="${ch.label}" border="0" width="15" height="15" src="${ch.iconCrimsonUrl}" style="border:0px;display:inline-block;vertical-align:middle;width:15px;height:15px;">
                          </a>
                        </td>${spacerCell}`;
      }

      // Option 4: Minimal Clean Icons
      return `<td valign="middle" align="center" style="padding-right:2px;vertical-align:middle;">
                          <a href="${ch.url}" target="_blank" title="ACAP on ${ch.label}" style="text-decoration:none;display:inline-block;">
                            <img alt="${ch.label}" border="0" width="20" height="20" src="${ch.iconSlateUrl}" style="border:0px;display:block;width:20px;height:20px;">
                          </a>
                        </td>${spacerCell}`;
    }).join('\n                        ');

    // Build Selected CTA Buttons (1st button = Primary Crimson, 2nd button = Secondary Light Pill)
    const activeButtonConfigs = selectedButtons
      .map((id) => ACTION_BUTTON_OPTIONS.find((opt) => opt.id === id))
      .filter((opt): opt is ActionButtonOption => Boolean(opt));

    const buttonsCellsHTML = activeButtonConfigs
      .map((btn, idx) => {
        const isPrimary = idx === 0;
        const spacer =
          idx < activeButtonConfigs.length - 1
            ? `\n                        <td width="8" style="width:8px;">&nbsp;</td>\n                        `
            : '';

        if (isPrimary) {
          return `<td bgcolor="#e81053" style="background-color:#e81053;border:1px solid #e81053;border-radius:4px;padding:6px 12px;text-align:center;">
                          <a href="${btn.url}" target="_blank" style="font-family:Tahoma,Arial,sans-serif;font-size:8.5pt;font-weight:bold;color:#ffffff;text-decoration:none;display:inline-block;white-space:nowrap;">${escapeHtml(btn.buttonText)}</a>
                        </td>${spacer}`;
        }

        return `<td bgcolor="#f1f5f9" style="background-color:#f1f5f9;border:1px solid #cbd5e1;border-radius:4px;padding:6px 12px;text-align:center;">
                          <a href="${btn.url}" target="_blank" style="font-family:Tahoma,Arial,sans-serif;font-size:8.5pt;font-weight:bold;color:#0f172a;text-decoration:none;display:inline-block;white-space:nowrap;">${escapeHtml(btn.buttonText)}</a>
                        </td>${spacer}`;
      })
      .join('');

    const buttonsRowHTML =
      activeButtonConfigs.length > 0
        ? `<tr>
                <td style="padding:0px;">
                  <table cellpadding="0" cellspacing="0" border="0" style="border-spacing:0px;border-collapse:collapse;">
                    <tbody>
                      <tr>
                        ${buttonsCellsHTML}
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>`
        : '';

    const onErrorAttr = includeFallbackOnError
      ? ` onerror="this.onerror=null;this.src='${getAcapLogoFallbackSvg()}';"`
      : '';

    return `<div dir="ltr">
  <table cellpadding="0" cellspacing="0" border="0" style="border-spacing:0px;border-collapse:collapse;width:100%;max-width:480px;font-size:10pt;font-family:Tahoma,Arial,sans-serif;line-height:1.4;">
    <tbody>
      <tr>
        <td valign="top" width="130" style="padding:8px 15px 12px 0px;width:130px;vertical-align:top;">
          <a href="https://croampro.com/" target="_blank" style="text-decoration:none;background-color:transparent;">
            <img border="0" alt="ACAP" width="125" src="${ACAP_HOSTED_LOGO_URL}"${onErrorAttr} style="border:0px;vertical-align:middle;width:125px;max-width:125px;height:auto;display:block;">
          </a>
        </td>
        <td valign="top" style="padding:4px 0px 12px 0px;vertical-align:top;">
          <table cellpadding="0" cellspacing="0" border="0" style="border-spacing:0px;border-collapse:collapse;background-color:transparent;width:100%;">
            <tbody>
              <tr>
                <td style="padding:0px 0px 2px 0px;font-size:12pt;font-weight:bold;font-family:Tahoma,Arial,sans-serif;${nameColorRule}line-height:1.2;">
                  ${safeName}
                </td>
              </tr>
              <tr>
                <td style="padding:0px 0px 8px 0px;font-size:10pt;font-family:Tahoma,Arial,sans-serif;${roleColorRule}line-height:1.3;">
                  ${safeRole}
                </td>
              </tr>
              <tr>
                <td style="padding:0px 0px 2px 0px;font-size:9.5pt;font-family:Tahoma,Arial,sans-serif;color:${orgColorHex};line-height:1.3;">
                  Association of Croatian American Professionals
                </td>
              </tr>
              <tr>
                <td style="padding:0px 0px 8px 0px;font-size:9.5pt;font-family:Tahoma,Arial,sans-serif;color:${orgColorHex};line-height:1.3;">
                  ${safeChapter} <span style="color:#e81053;font-weight:bold;">|</span> <a href="https://croampro.com/" target="_blank" style="color:${linkColorHex};text-decoration:underline;font-weight:bold;">croampro.com</a>
                </td>
              </tr>
              ${phoneRowHTML}
              <tr>
                <td style="padding:2px 0px 12px 0px;">
                  <table cellpadding="0" cellspacing="0" border="0" style="border-spacing:0px;border-collapse:collapse;">
                    <tbody>
                      <tr>
                        ${socialCellsHTML}
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              ${buttonsRowHTML}
            </tbody>
          </table>
        </td>
      </tr>
      <tr>
        <td colspan="2" style="padding:0px;border-top:2px solid #e81053;width:100%;max-width:480px;font-size:1px;line-height:1px;">&nbsp;</td>
      </tr>
    </tbody>
  </table>
</div>`;
  };

  const previewHtml = useMemo(
    () => buildSignatureHTML(true),
    [name, role, phone, chapter, colorPalette, iconStyle, selectedButtons]
  );

  const cleanExportHtml = useMemo(
    () => buildSignatureHTML(false),
    [name, role, phone, chapter, colorPalette, iconStyle, selectedButtons]
  );

  // ============================================================================
  // 3. COPY & RESET HANDLERS
  // ============================================================================
  const handleCopyVisualSignature = () => {
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'fixed';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.backgroundColor = '#ffffff';
    tempContainer.style.color = '#010333';
    tempContainer.innerHTML = cleanExportHtml;
    document.body.appendChild(tempContainer);

    try {
      const range = document.createRange();
      range.selectNodeContents(tempContainer);
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
      document.execCommand('copy');
      if (selection) {
        selection.removeAllRanges();
      }
      setCopiedVisual(true);
      setTimeout(() => setCopiedVisual(false), 3000);
      triggerToast(
        'Signature Copied to Clipboard!',
        'Now open your Gmail, Outlook, or Apple Mail signature settings and press Cmd+V (Mac) or Ctrl+V (Windows).'
      );
    } catch {
      navigator.clipboard?.writeText(cleanExportHtml);
      setCopiedVisual(true);
      setTimeout(() => setCopiedVisual(false), 3000);
      triggerToast(
        'Signature Copied!',
        'Paste directly into your Gmail, Outlook, or Apple Mail signature box.'
      );
    } finally {
      document.body.removeChild(tempContainer);
    }
  };

  const handleCopyRawHtml = () => {
    navigator.clipboard.writeText(cleanExportHtml);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2500);
    triggerToast(
      'Raw HTML Source Copied!',
      'Ready to paste into any HTML-based email signature manager.'
    );
  };

  const handleDownloadHtmlFile = () => {
    const slug = (name || 'acap-member')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const blob = new Blob([cleanExportHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `acap-signature-${slug}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    triggerToast('Downloaded HTML Signature', `Saved acap-signature-${slug}.html`);
  };

  const handleCopyShareableLink = () => {
    const params = new URLSearchParams();
    if (name.trim()) params.set('name', name.trim());
    if (role.trim()) params.set('role', role.trim());
    if (chapter.trim()) params.set('chapter', chapter.trim());
    if (phone.trim()) params.set('phone', phone.trim());
    const shareUrl = `${window.location.origin}/vibecoding/ACAPemail?${params.toString()}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedShareUrl(true);
    setTimeout(() => setCopiedShareUrl(false), 2500);
    triggerToast(
      'Pre-Filled Link Copied!',
      'Share this link with any member to open their pre-filled signature.'
    );
  };

  const handleResetForm = () => {
    setName('Vedran Brozović');
    setRole('Board Member | Conference Chair');
    setPhone('');
    setChapter('Pacific Northwest (PNW)');
    setColorPalette('adaptive');
    setIconStyle('website-card');
    setSelectedButtons(['member', 'website']);
  };

  const navigateBackToVibeCoding = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
      e.preventDefault();
      window.history.pushState({}, '', '/vibecoding?app=ACAPemail');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen flex flex-col font-sans antialiased">
      {/* Official ACAP Member Portal Header */}
      <header className="bg-[#010333] text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Brand Identity */}
            <div className="flex items-center gap-3.5">
              {isStandalone && (
                <a
                  href="/vibecoding?app=ACAPemail"
                  onClick={navigateBackToVibeCoding}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white text-xs font-semibold transition border border-white/15 shrink-0"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Vibe Coding</span>
                </a>
              )}

              <div className="px-2.5 py-1.5 rounded-lg bg-white flex items-center justify-center shadow-sm shrink-0">
                <span className="text-[#e81053] font-black tracking-tighter text-lg leading-none">
                  ACAP
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-bold text-white leading-tight">
                    Official Email Signature Generator
                  </h1>
                  <span className="hidden md:inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#e81053] text-white">
                    Member Tool
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Association of Croatian American Professionals • Create &amp; install in 60 seconds
                </p>
              </div>
            </div>

            {/* Primary One-Click Copy CTA */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyShareableLink}
                className="inline-flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs px-3.5 py-2.5 rounded-lg border border-white/15 transition cursor-pointer"
                title="Copy a link pre-filled with these details"
              >
                {copiedShareUrl ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Share2 className="w-3.5 h-3.5 text-rose-300" />
                )}
                <span>{copiedShareUrl ? 'Copied Link!' : 'Share Link'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyVisualSignature}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-[#e81053] hover:bg-[#ff1f64] active:scale-[0.99] text-white font-semibold text-sm px-5 py-2.5 rounded-lg shadow-md transition-all cursor-pointer"
              >
                {copiedVisual ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                <span>{copiedVisual ? 'Copied!' : 'Copy Signature'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Quick 3-Step Progress Bar Banner */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-xs">
            <div className="flex items-center gap-2.5 py-1">
              <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#e81053] to-[#be0b42] text-white font-bold flex items-center justify-center shrink-0 shadow-xs">
                1
              </span>
              <div>
                <span className="font-bold text-slate-900">Enter Your Details</span>
                <span className="text-slate-500 block sm:inline sm:ml-1">
                  — Name, ACAP title &amp; chapter
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 py-1">
              <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#e81053] to-[#be0b42] text-white font-bold flex items-center justify-center shrink-0 shadow-xs">
                2
              </span>
              <div>
                <span className="font-bold text-slate-900">Click &quot;Copy Signature&quot;</span>
                <span className="text-slate-500 block sm:inline sm:ml-1">
                  — Copies rich formatting, icons &amp; buttons
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 py-1">
              <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#e81053] to-[#be0b42] text-white font-bold flex items-center justify-center shrink-0 shadow-xs">
                3
              </span>
              <div>
                <span className="font-bold text-slate-900">Paste in Email Settings</span>
                <span className="text-slate-500 block sm:inline sm:ml-1">
                  — Follow the 1-minute guide below
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 transition-all duration-300">
          <div className="bg-slate-900 text-white px-5 py-4 rounded-xl shadow-2xl border border-emerald-500/40 flex items-center gap-3.5 max-w-md">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">{toast.title}</p>
              <p className="text-xs text-slate-300 mt-0.5">{toast.subtitle}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Step 1 - Personalize Your Signature (5 cols) */}
        <section className="lg:col-span-5 space-y-5">
          {/* Step 1 Card: Member Details */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#e81053] to-[#be0b42] text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Personalize Your Info
                </h2>
              </div>
              <button
                type="button"
                onClick={handleResetForm}
                className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-[#e81053] font-medium transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Default</span>
              </button>
            </div>

            {/* Full Name */}
            <div>
              <label
                htmlFor="inputName"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Full Name <span className="text-[#e81053]">*</span>
              </label>
              <input
                id="inputName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Ana Horvat"
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#e81053] focus:border-transparent font-medium text-slate-900"
              />
            </div>

            {/* Role / Title Input + Grouped Quick Role Pre-fills */}
            <div>
              <label
                htmlFor="inputRole"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Your ACAP Title / Role <span className="text-[#e81053]">*</span>
              </label>
              <input
                id="inputRole"
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g., Member | Pacific Northwest (PNW)"
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#e81053] focus:border-transparent font-medium text-slate-900"
              />

              <div className="mt-2.5 space-y-2">
                {ROLE_GROUPS.map((group) => (
                  <div key={group.group} className="bg-slate-50/80 border border-slate-200/70 rounded-lg p-2.5">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      {group.group}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {group.options.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setRole(preset)}
                          className={`text-[11px] px-2.5 py-1 rounded-md font-medium border transition-colors cursor-pointer ${
                            role === preset
                              ? 'bg-rose-50 text-[#e81053] border-[#e81053]/40 font-bold'
                              : 'bg-white hover:bg-rose-50 hover:text-[#e81053] text-slate-700 border-slate-200'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Org Subtitle / Chapter Line + Common Chapter Pre-Fills */}
            <div className="pt-2 border-t border-slate-100 space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="inputChapter"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Chapter / Subtitle Line
                  </label>
                  <input
                    id="inputChapter"
                    type="text"
                    value={chapter}
                    onChange={(e) => setChapter(e.target.value)}
                    placeholder="e.g., Pacific Northwest (PNW)"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#e81053] font-medium text-slate-900"
                  />
                </div>
                <div>
                  <label
                    htmlFor="inputPhone"
                    className="block text-xs font-medium text-slate-600 mb-1"
                  >
                    Phone <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    id="inputPhone"
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g., +1 (206) 555-0199"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#e81053]"
                  />
                </div>
              </div>

              <div className="bg-slate-50/80 border border-slate-200/70 rounded-lg p-2.5">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Quick-Select Chapter / Organization
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {CHAPTER_OPTIONS.map((chap) => (
                    <button
                      key={chap}
                      type="button"
                      onClick={() => setChapter(chap)}
                      className={`text-[11px] px-2.5 py-1 rounded-md font-medium border transition-colors cursor-pointer ${
                        chapter === chap
                          ? 'bg-rose-50 text-[#e81053] border-[#e81053]/40 font-bold'
                          : 'bg-white hover:bg-rose-50 hover:text-[#e81053] text-slate-700 border-slate-200'
                      }`}
                    >
                      {chap}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Appearance, Social Icon Look (4 Simple Options) & Action Buttons Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Buttons, Icons &amp; Dark Mode
              </h2>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                100% Email-Safe
              </span>
            </div>

            {/* Action Buttons Selector (Choose up to 2 from Member, Conference, Donate, Website) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Action Buttons (Pick up to 2)
                </label>
                {selectedButtons.length === 2 && (
                  <button
                    type="button"
                    onClick={handleSwapButtonOrder}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#e81053] hover:underline cursor-pointer"
                  >
                    <ArrowUpDown className="w-3 h-3" />
                    <span>Swap Order</span>
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {ACTION_BUTTON_OPTIONS.map((opt) => {
                  const selectedIdx = selectedButtons.indexOf(opt.id);
                  const isSelected = selectedIdx !== -1;
                  const isPrimary = selectedIdx === 0;

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleToggleButton(opt.id)}
                      className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-2 border-[#e81053] bg-rose-50/40'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-slate-900">{opt.label}</span>
                        {isSelected && (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              isPrimary
                                ? 'bg-[#e81053] text-white'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {isPrimary ? '1st (Pink)' : '2nd (Light)'}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 truncate mt-1">
                        {opt.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Social Media Icon Style (4 Simple, Pretty Website-Inspired Options) */}
            <div className="pt-3 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Social Media Icon Style (4 Options)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {/* 1. Soft Cards */}
                <button
                  type="button"
                  onClick={() => setIconStyle('website-card')}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer space-y-2 ${
                    iconStyle === 'website-card'
                      ? 'border-2 border-[#e81053] bg-rose-50/40'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900">1. Soft Card Badges</div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-6 h-6 rounded-md bg-[#f8fafc] border border-[#e2e5eb] text-[#0A66C2] flex items-center justify-center shadow-2xs">
                      <Linkedin className="w-3.5 h-3.5" />
                    </span>
                    <span className="w-6 h-6 rounded-md bg-[#f8fafc] border border-[#e2e5eb] text-[#dc2743] flex items-center justify-center shadow-2xs">
                      <Instagram className="w-3.5 h-3.5" />
                    </span>
                    <span className="w-6 h-6 rounded-md bg-[#f8fafc] border border-[#e2e5eb] text-[#1877F2] flex items-center justify-center shadow-2xs">
                      <Facebook className="w-3.5 h-3.5" />
                    </span>
                    <span className="w-6 h-6 rounded-md bg-[#f8fafc] border border-[#e2e5eb] text-[#FF0000] flex items-center justify-center shadow-2xs">
                      <Youtube className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </button>

                {/* 2. Brand Tiles */}
                <button
                  type="button"
                  onClick={() => setIconStyle('website-brand')}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer space-y-2 ${
                    iconStyle === 'website-brand'
                      ? 'border-2 border-[#e81053] bg-rose-50/40'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900">2. Brand Color Tiles</div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-6 h-6 rounded-md bg-[#0A66C2] text-white flex items-center justify-center shadow-2xs">
                      <Linkedin className="w-3.5 h-3.5" />
                    </span>
                    <span className="w-6 h-6 rounded-md bg-[#dc2743] text-white flex items-center justify-center shadow-2xs">
                      <Instagram className="w-3.5 h-3.5" />
                    </span>
                    <span className="w-6 h-6 rounded-md bg-[#1877F2] text-white flex items-center justify-center shadow-2xs">
                      <Facebook className="w-3.5 h-3.5" />
                    </span>
                    <span className="w-6 h-6 rounded-md bg-[#FF0000] text-white flex items-center justify-center shadow-2xs">
                      <Youtube className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </button>

                {/* 3. ACAP Crimson */}
                <button
                  type="button"
                  onClick={() => setIconStyle('acap-crimson')}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer space-y-2 ${
                    iconStyle === 'acap-crimson'
                      ? 'border-2 border-[#e81053] bg-rose-50/40'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900">3. ACAP Crimson</div>
                  <div className="flex items-center gap-1.5">
                    {[Linkedin, Instagram, Facebook, Youtube].map((IconComp, idx) => (
                      <span
                        key={idx}
                        className="w-6 h-6 rounded-md bg-[#fff1f5] border border-[#fecdd3] text-[#e81053] flex items-center justify-center shadow-2xs"
                      >
                        <IconComp className="w-3.5 h-3.5" />
                      </span>
                    ))}
                  </div>
                </button>

                {/* 4. Minimal Clean */}
                <button
                  type="button"
                  onClick={() => setIconStyle('minimal')}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer space-y-2 ${
                    iconStyle === 'minimal'
                      ? 'border-2 border-[#e81053] bg-rose-50/40'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900">4. Minimal Clean</div>
                  <div className="flex items-center gap-2 text-slate-600 pt-0.5">
                    <Linkedin className="w-4 h-4" />
                    <Instagram className="w-4 h-4" />
                    <Facebook className="w-4 h-4" />
                    <Youtube className="w-4 h-4" />
                  </div>
                </button>
              </div>
            </div>

            {/* Dark Mode Color Strategy Selector */}
            <div className="pt-3 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Text Color Mode (Light &amp; Dark Mode Visibility)
              </label>
              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => setColorPalette('adaptive')}
                  className={`text-left p-2.5 rounded-lg border transition-all cursor-pointer ${
                    colorPalette === 'adaptive'
                      ? 'border-2 border-[#e81053] bg-rose-50/40'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      Universal Adaptive (Recommended)
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#e81053] text-white">
                      Best for Dark Mode
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    Automatically turns crisp white in Dark Mode and dark navy/black in Light Mode.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setColorPalette('crimson')}
                  className={`text-left p-2.5 rounded-lg border transition-all cursor-pointer ${
                    colorPalette === 'crimson'
                      ? 'border-2 border-[#e81053] bg-rose-50/40'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      ACAP Crimson Accent Name (<code className="text-[#e81053]">#e81053</code>)
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      High Contrast
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setColorPalette('classic')}
                  className={`text-left p-2.5 rounded-lg border transition-all cursor-pointer ${
                    colorPalette === 'classic'
                      ? 'border-2 border-[#e81053] bg-rose-50/40'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      Classic Hardcoded Navy (<code className="text-slate-600">#010333</code>)
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                      Light Mode Best
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Step 2 (Live Preview & Copy) + Step 3 (Setup Instructions) (7 cols) */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          {/* STEP 2 CARD: Live Preview & One-Click Copy */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
            {/* Preview Header Bar with Device & Theme Toggles */}
            <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#e81053] to-[#be0b42] text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 leading-none">
                    Live Signature Preview
                  </h2>
                  <span className="text-[11px] text-slate-500">
                    {viewport === 'mobile' ? 'Mobile View (360px)' : 'Desktop View'} •{' '}
                    {theme === 'dark' ? 'Dark Mode Email Client' : 'Light Email Client'}
                  </span>
                </div>
              </div>

              {/* Interactive Simulator Toggles */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex bg-slate-200/80 p-0.5 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setViewport('desktop')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      viewport === 'desktop'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>Desktop</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewport('mobile')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      viewport === 'mobile'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Mobile</span>
                  </button>
                </div>

                <div className="inline-flex bg-slate-200/80 p-0.5 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      theme === 'light'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Light</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Dark Mode</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Outer Canvas Area */}
            <div className="p-4 sm:p-6 bg-slate-200/60 flex flex-col items-center justify-center">
              {/* Simulated Email Client Window */}
              <div
                style={{ maxWidth: viewport === 'mobile' ? '360px' : '100%' }}
                className={`w-full rounded-xl shadow-md border overflow-hidden transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-[#14171f] text-slate-100 border-slate-700'
                    : 'bg-white text-slate-900 border-slate-200/90'
                }`}
              >
                {/* Simulated Email Header */}
                <div
                  className={`px-5 py-2.5 border-b text-xs flex flex-wrap items-center justify-between gap-2 ${
                    theme === 'dark'
                      ? 'border-slate-800 text-slate-400'
                      : 'border-slate-100 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-400">To:</span>
                    <span
                      className={`px-2 py-0.5 rounded font-medium ${
                        theme === 'dark'
                          ? 'bg-slate-800 text-slate-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      community@croampro.com
                    </span>
                  </div>
                  {theme === 'dark' && (
                    <span className="text-[11px] text-emerald-400 font-medium">
                      ✓ Dark Mode Active: All text &amp; buttons remain high-contrast
                    </span>
                  )}
                </div>

                {/* Simulated Email Body + Live Signature Mount */}
                <div className="p-5 sm:p-6">
                  <p
                    className={`text-xs sm:text-sm mb-5 font-sans leading-relaxed ${
                      theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    Hi everyone,
                    <br />
                    Looking forward to connecting at our upcoming ACAP events and growing our global network.
                    <br />
                    <br />
                    Best regards,
                  </p>

                  {/* ACTUAL EMAIL SIGNATURE CONTAINER */}
                  <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                </div>
              </div>

              {/* Big Prominent Copy Action Bar Under Preview */}
              <div className="w-full mt-4 bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-center sm:text-left">
                  <p className="text-xs font-bold text-slate-900">
                    Ready to use your new signature?
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Click the button to copy the visual signature with all images, links &amp; buttons.
                  </p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleCopyVisualSignature}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-[#e81053] hover:bg-[#c90d47] active:scale-[0.99] text-white font-bold text-sm px-6 py-3 rounded-lg shadow-sm transition-all cursor-pointer"
                  >
                    {copiedVisual ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    <span>
                      {copiedVisual
                        ? '✓ Copied! Ready to Paste (Cmd+V / Ctrl+V)'
                        : 'Copy Signature to Clipboard'}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyRawHtml}
                    title="Copy Raw HTML Source Code"
                    className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3.5 py-3 rounded-lg border border-slate-200 transition-all cursor-pointer"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>{copiedHtml ? 'Copied!' : 'HTML'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadHtmlFile}
                    title="Download HTML Signature File"
                    className="inline-flex items-center justify-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3 py-3 rounded-lg border border-slate-200 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 3 CARD: Easy 1-Minute Setup Guide for Members (Tabbed) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50/60">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#e81053] to-[#be0b42] text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    How to Paste Into Your Email Client
                  </h3>
                  <p className="text-xs text-slate-500">
                    Select your email app below and follow the 4 quick steps
                  </p>
                </div>
              </div>

              <div className="inline-flex bg-slate-200/80 p-1 rounded-lg self-start sm:self-auto">
                {(['gmail', 'outlook', 'apple'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setGuideTab(tab)}
                    className={`px-3 py-1.5 rounded-md text-xs transition-all cursor-pointer capitalize ${
                      guideTab === tab
                        ? 'font-bold bg-white text-slate-900 shadow-2xs'
                        : 'font-semibold text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab === 'apple' ? 'Apple Mail' : tab}
                  </button>
                ))}
              </div>
            </div>

            {guideTab === 'gmail' && (
              <div className="p-5 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-rose-100 text-[#e81053] font-bold flex items-center justify-center shrink-0">
                      1
                    </span>
                    <div>
                      <p className="font-bold text-slate-900">Copy Your Signature</p>
                      <p className="text-slate-600 mt-0.5">
                        Click the pink <strong>&quot;Copy Signature to Clipboard&quot;</strong> button above.
                      </p>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-rose-100 text-[#e81053] font-bold flex items-center justify-center shrink-0">
                      2
                    </span>
                    <div>
                      <p className="font-bold text-slate-900">Open Gmail Settings</p>
                      <p className="text-slate-600 mt-0.5">
                        In Gmail on your computer, click the <strong>⚙️ Gear icon</strong> (top right) → <strong>&quot;See all settings&quot;</strong>.
                      </p>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-rose-100 text-[#e81053] font-bold flex items-center justify-center shrink-0">
                      3
                    </span>
                    <div>
                      <p className="font-bold text-slate-900">Paste Into Signature Box</p>
                      <p className="text-slate-600 mt-0.5">
                        Scroll down to <strong>Signature</strong>, click inside the text box, and press <strong>Cmd + V</strong> (Mac) or <strong>Ctrl + V</strong> (Windows).
                      </p>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-rose-100 text-[#e81053] font-bold flex items-center justify-center shrink-0">
                      4
                    </span>
                    <div>
                      <p className="font-bold text-slate-900">Assign &amp; Save Changes</p>
                      <p className="text-slate-600 mt-0.5">
                        Select your signature under <em>&quot;Signature defaults&quot;</em>, then scroll to the bottom and click <strong>Save Changes</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {guideTab === 'outlook' && (
              <div className="p-5 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-rose-100 text-[#e81053] font-bold flex items-center justify-center shrink-0">
                      1
                    </span>
                    <div>
                      <p className="font-bold text-slate-900">Copy Your Signature</p>
                      <p className="text-slate-600 mt-0.5">
                        Click the pink <strong>&quot;Copy Signature to Clipboard&quot;</strong> button above.
                      </p>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-rose-100 text-[#e81053] font-bold flex items-center justify-center shrink-0">
                      2
                    </span>
                    <div>
                      <p className="font-bold text-slate-900">Open Outlook Signatures</p>
                      <p className="text-slate-600 mt-0.5">
                        Go to <strong>Settings (⚙️)</strong> → <strong>Mail</strong> → <strong>Compose and reply</strong> (or <em>File → Options → Mail → Signatures</em> on Desktop).
                      </p>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-rose-100 text-[#e81053] font-bold flex items-center justify-center shrink-0">
                      3
                    </span>
                    <div>
                      <p className="font-bold text-slate-900">Create &amp; Paste</p>
                      <p className="text-slate-600 mt-0.5">
                        Click <strong>New signature</strong>, name it &quot;ACAP&quot;, and press <strong>Cmd + V</strong> or <strong>Ctrl + V</strong> inside the editor box.
                      </p>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-rose-100 text-[#e81053] font-bold flex items-center justify-center shrink-0">
                      4
                    </span>
                    <div>
                      <p className="font-bold text-slate-900">Keep Source Formatting</p>
                      <p className="text-slate-600 mt-0.5">
                        If prompted on paste, choose <strong>&quot;Keep Source Formatting&quot;</strong>, then click <strong>Save</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {guideTab === 'apple' && (
              <div className="p-5 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-rose-100 text-[#e81053] font-bold flex items-center justify-center shrink-0">
                      1
                    </span>
                    <div>
                      <p className="font-bold text-slate-900">Copy Your Signature</p>
                      <p className="text-slate-600 mt-0.5">
                        Click the pink <strong>&quot;Copy Signature to Clipboard&quot;</strong> button above.
                      </p>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-rose-100 text-[#e81053] font-bold flex items-center justify-center shrink-0">
                      2
                    </span>
                    <div>
                      <p className="font-bold text-slate-900">Open Mail Settings</p>
                      <p className="text-slate-600 mt-0.5">
                        In Apple Mail on Mac, open <strong>Mail → Settings (or Preferences) → Signatures</strong> and click <strong>[+]</strong>.
                      </p>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center shrink-0">
                      3
                    </span>
                    <div>
                      <p className="font-bold text-amber-900">Important: Uncheck Match Font</p>
                      <p className="text-amber-800 mt-0.5">
                        <strong>Uncheck</strong> <em>&quot;Always match my default message font&quot;</em> at the bottom BEFORE pasting so your layout stays intact.
                      </p>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-rose-100 text-[#e81053] font-bold flex items-center justify-center shrink-0">
                      4
                    </span>
                    <div>
                      <p className="font-bold text-slate-900">Paste &amp; Close Window</p>
                      <p className="text-slate-600 mt-0.5">
                        Press <strong>Cmd + V</strong> in the right preview pane (images may look like boxes in settings, but appear properly when composing an email!).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Collapsible Raw HTML & Link Verification Footer */}
            <details className="border-t border-slate-200 bg-slate-50">
              <summary className="px-5 py-3 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer flex items-center justify-between">
                <span>View Embedded Official ACAP Links &amp; Raw HTML Code (For IT / Advanced Users)</span>
                <span className="text-[#e81053]">Expand ↓</span>
              </summary>
              <div className="p-5 pt-2 space-y-3 border-t border-slate-200/60">
                <div className="flex flex-wrap gap-2 text-xs">
                  <a
                    href="https://croampro.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-[#e81053]"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#e81053]" /> Website: croampro.com ↗
                  </a>
                  <a
                    href="https://members.croampro.com/signup"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-[#e81053]"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#e81053]" /> Join: members.croampro.com/signup ↗
                  </a>
                  <a
                    href="https://croampro.com/annual-conference"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-[#e81053]"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#e81053]" /> Conference: croampro.com/annual-conference ↗
                  </a>
                  <a
                    href="https://members.croampro.com/donations/foundation"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-[#e81053]"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#e81053]" /> Donate: members.croampro.com/donations/foundation ↗
                  </a>
                </div>
                <div className="bg-slate-900 p-4 rounded-lg overflow-x-auto max-h-56">
                  <pre className="text-[11px] text-emerald-300 font-mono leading-relaxed select-all">
                    {cleanExportHtml}
                  </pre>
                </div>
              </div>
            </details>
          </div>
        </section>
      </main>
    </div>
  );
}
