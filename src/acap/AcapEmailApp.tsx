import React, { useState, useEffect, useMemo } from 'react';
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
  Sparkles,
  Plus,
  Trash2,
  Bookmark,
  ExternalLink,
  Mail,
  Sliders,
  Eye,
  HelpCircle,
  CheckCircle2,
  Linkedin,
  Instagram,
  Facebook,
  Youtube,
  Globe
} from 'lucide-react';

// ============================================================================
// 1. CONSTANTS, PRESETS & WEBSITE-STYLE PRETTY SOCIAL ICON DEFINITIONS
// ============================================================================
const ACAP_HOSTED_LOGO_URL =
  'https://ci3.googleusercontent.com/mail-sig/AIorK4wEqSyvBO5OYbjCoZh_TRsFJvM1Csn61Zm9l7rRH0bv8K4JYNEqzqLd51uDeazNIjDfrCb6vfQ';

export type ColorPaletteMode = 'adaptive' | 'crimson' | 'classic';
export type SocialIconStyle = 'website-card' | 'website-brand' | 'acap-crimson' | 'minimal';
export type ButtonOrderMode = 'member-first' | 'website-first';

export interface SocialChannelConfig {
  id: 'linkedin' | 'instagram' | 'facebook' | 'youtube' | 'twitter';
  label: string;
  enabled: boolean;
  url: string;
  defaultUrl: string;
  brandHex: string;
  softBgHex: string;
  softBorderHex: string;
  // High-resolution email-safe PNG icons (white, slate, crimson, brand)
  iconWhiteUrl: string;
  iconSlateUrl: string;
  iconCrimsonUrl: string;
  iconBrandUrl: string;
}

export const DEFAULT_SOCIAL_CHANNELS: SocialChannelConfig[] = [
  {
    id: 'linkedin',
    label: 'LinkedIn',
    enabled: true,
    url: 'https://www.linkedin.com/company/acap/',
    defaultUrl: 'https://www.linkedin.com/company/acap/',
    brandHex: '#0A66C2',
    softBgHex: '#f8fafc',
    softBorderHex: '#e2e5eb',
    iconWhiteUrl: 'https://img.icons8.com/ios-filled/96/ffffff/linkedin.png',
    iconSlateUrl: 'https://img.icons8.com/ios-filled/96/475569/linkedin.png',
    iconCrimsonUrl: 'https://img.icons8.com/ios-filled/96/e81053/linkedin.png',
    iconBrandUrl: 'https://img.icons8.com/ios-filled/96/0A66C2/linkedin.png',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    enabled: true,
    url: 'https://www.instagram.com/acap_croampro/',
    defaultUrl: 'https://www.instagram.com/acap_croampro/',
    brandHex: '#dc2743',
    softBgHex: '#f8fafc',
    softBorderHex: '#e2e5eb',
    iconWhiteUrl: 'https://img.icons8.com/ios-filled/96/ffffff/instagram-new.png',
    iconSlateUrl: 'https://img.icons8.com/ios-filled/96/475569/instagram-new.png',
    iconCrimsonUrl: 'https://img.icons8.com/ios-filled/96/e81053/instagram-new.png',
    iconBrandUrl: 'https://img.icons8.com/ios-filled/96/dc2743/instagram-new.png',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    enabled: true,
    url: 'https://www.facebook.com/croampro/',
    defaultUrl: 'https://www.facebook.com/croampro/',
    brandHex: '#1877F2',
    softBgHex: '#f8fafc',
    softBorderHex: '#e2e5eb',
    iconWhiteUrl: 'https://img.icons8.com/ios-filled/96/ffffff/facebook-new.png',
    iconSlateUrl: 'https://img.icons8.com/ios-filled/96/475569/facebook-new.png',
    iconCrimsonUrl: 'https://img.icons8.com/ios-filled/96/e81053/facebook-new.png',
    iconBrandUrl: 'https://img.icons8.com/ios-filled/96/1877F2/facebook-new.png',
  },
  {
    id: 'youtube',
    label: 'YouTube',
    enabled: true,
    url: 'https://www.youtube.com/channel/UCN0TeaVV29ldOKLqQ2PhuvQ',
    defaultUrl: 'https://www.youtube.com/channel/UCN0TeaVV29ldOKLqQ2PhuvQ',
    brandHex: '#FF0000',
    softBgHex: '#f8fafc',
    softBorderHex: '#e2e5eb',
    iconWhiteUrl: 'https://img.icons8.com/ios-filled/96/ffffff/youtube-play.png',
    iconSlateUrl: 'https://img.icons8.com/ios-filled/96/475569/youtube-play.png',
    iconCrimsonUrl: 'https://img.icons8.com/ios-filled/96/e81053/youtube-play.png',
    iconBrandUrl: 'https://img.icons8.com/ios-filled/96/FF0000/youtube-play.png',
  },
  {
    id: 'twitter',
    label: 'X (Twitter)',
    enabled: false,
    url: 'https://x.com/croampro',
    defaultUrl: 'https://x.com/croampro',
    brandHex: '#181717',
    softBgHex: '#f8fafc',
    softBorderHex: '#e2e5eb',
    iconWhiteUrl: 'https://img.icons8.com/ios-filled/96/ffffff/twitterx--v2.png',
    iconSlateUrl: 'https://img.icons8.com/ios-filled/96/475569/twitterx--v2.png',
    iconCrimsonUrl: 'https://img.icons8.com/ios-filled/96/e81053/twitterx--v2.png',
    iconBrandUrl: 'https://img.icons8.com/ios-filled/96/181717/twitterx--v2.png',
  },
];

export const ROLE_PRESETS = [
  'Board member | Seattle Conference Chair',
  'Board member | Technology and Innovation',
  'Board Member',
  'Chapter President | ACAP Seattle',
  'Chapter President',
  'Vice President',
  'Committee Chair',
  'Committee Member',
  'Task Force Lead',
  'Member',
];

export const CHAPTER_PRESETS = [
  'ACAP Foundation',
  'ACAP Seattle (PNW)',
  'ACAP New York',
  'ACAP Chicago',
  'ACAP Washington D.C.',
  'ACAP Los Angeles',
  'ACAP San Francisco / Silicon Valley',
  'ACAP Houston',
  'ACAP Cleveland',
  'ACAP Zagreb',
];

export interface SavedSignatureProfile {
  id: string;
  label: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  personalLinkedin: string;
  orgName: string;
  chapter: string;
  websiteLabel: string;
  websiteUrl: string;
  colorPalette: ColorPaletteMode;
  iconStyle: SocialIconStyle;
  buttonOrder: ButtonOrderMode;
  showMemberBtn: boolean;
  memberBtnText: string;
  memberBtnUrl: string;
  showWebsiteBtn: boolean;
  websiteBtnText: string;
  websiteBtnUrl: string;
  showBottomBorder: boolean;
  updatedAt: string;
}

const SAVED_PROFILES_STORAGE_KEY = 'acap_email_saved_profiles_v1';

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
    <rect x="48" y="45" width="8" height="8" fill="#e81053"/>
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

  // ============================================================================
  // 2. SELF-SERVICE STATE (WITH URL QUERY PARAM PRE-FILL SUPPORT)
  // ============================================================================
  const initialParams = useMemo(() => {
    try {
      return new URLSearchParams(window.location.search);
    } catch {
      return new URLSearchParams();
    }
  }, []);

  const [name, setName] = useState<string>(
    () => initialParams.get('name') || 'Vedran Brozović'
  );
  const [role, setRole] = useState<string>(
    () => initialParams.get('role') || 'Board member | Seattle Conference Chair'
  );
  const [email, setEmail] = useState<string>(() => initialParams.get('email') || '');
  const [phone, setPhone] = useState<string>(() => initialParams.get('phone') || '');
  const [personalLinkedin, setPersonalLinkedin] = useState<string>(
    () => initialParams.get('linkedin') || ''
  );
  const [orgName, setOrgName] = useState<string>(
    () => initialParams.get('org') || 'Association of Croatian American Professionals'
  );
  const [chapter, setChapter] = useState<string>(
    () => initialParams.get('chapter') || 'ACAP Foundation'
  );
  const [websiteLabel, setWebsiteLabel] = useState<string>('croampro.com');
  const [websiteUrl, setWebsiteUrl] = useState<string>('https://croampro.com/');

  // Appearance & Layout State
  const [colorPalette, setColorPalette] = useState<ColorPaletteMode>('adaptive');
  const [iconStyle, setIconStyle] = useState<SocialIconStyle>('website-card');
  const [buttonOrder, setButtonOrder] = useState<ButtonOrderMode>('member-first');
  const [showMemberBtn, setShowMemberBtn] = useState<boolean>(true);
  const [memberBtnText, setMemberBtnText] = useState<string>('Become a Member');
  const [memberBtnUrl, setMemberBtnUrl] = useState<string>('https://members.croampro.com/signup');
  const [showWebsiteBtn, setShowWebsiteBtn] = useState<boolean>(true);
  const [websiteBtnText, setWebsiteBtnText] = useState<string>('Visit Our Website');
  const [websiteBtnUrl, setWebsiteBtnUrl] = useState<string>('https://croampro.com/');
  const [showBottomBorder, setShowBottomBorder] = useState<boolean>(true);

  // Social Channels State
  const [socialChannels, setSocialChannels] = useState<SocialChannelConfig[]>(
    DEFAULT_SOCIAL_CHANNELS
  );
  const [showSocialUrlEditor, setShowSocialUrlEditor] = useState<boolean>(false);

  // Simulator & Guide State
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [guideTab, setGuideTab] = useState<'gmail' | 'outlook' | 'apple'>('gmail');
  const [copiedVisual, setCopiedVisual] = useState<boolean>(false);
  const [copiedHtml, setCopiedHtml] = useState<boolean>(false);
  const [copiedShareUrl, setCopiedShareUrl] = useState<boolean>(false);
  const [toast, setToast] = useState<{ title: string; subtitle: string } | null>(null);

  // Saved Self-Service Profiles in localStorage
  const [savedProfiles, setSavedProfiles] = useState<SavedSignatureProfile[]>(() => {
    try {
      const raw = localStorage.getItem(SAVED_PROFILES_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
      return [];
    } catch {
      return [];
    }
  });
  const [profileNameInput, setProfileNameInput] = useState<string>('');

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_PROFILES_STORAGE_KEY, JSON.stringify(savedProfiles));
    } catch {
      // Ignore storage error
    }
  }, [savedProfiles]);

  const triggerToast = (title: string, subtitle: string) => {
    setToast({ title, subtitle });
    setTimeout(() => {
      setToast((prev) => (prev?.title === title ? null : prev));
    }, 4000);
  };

  // ============================================================================
  // 3. EMAIL-SAFE SIGNATURE HTML BUILDER (WITH PRETTY WEBSITE-STYLE SOCIAL ICONS)
  // ============================================================================
  const buildSignatureHTML = (includeFallbackOnError: boolean = true): string => {
    const safeName = escapeHtml(name.trim() || 'Vedran Brozović');
    const safeRole = escapeHtml(role.trim() || 'Board member');
    const safeEmail = escapeHtml(email.trim());
    const safePhone = escapeHtml(phone.trim());
    const safePersonalLinkedin = escapeHtml(personalLinkedin.trim());
    const safeOrgName = escapeHtml(
      orgName.trim() || 'Association of Croatian American Professionals'
    );
    const safeChapter = escapeHtml(chapter.trim() || 'ACAP Foundation');
    const safeWebsiteLabel = escapeHtml(websiteLabel.trim() || 'croampro.com');
    const safeWebsiteUrl = escapeHtml(websiteUrl.trim() || 'https://croampro.com/');

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

    // Contact line (Phone / Email / Personal LinkedIn)
    const contactParts: string[] = [];
    if (safePhone) {
      contactParts.push(`<span>${safePhone}</span>`);
    }
    if (safeEmail) {
      contactParts.push(
        `<a href="mailto:${safeEmail}" style="color:${orgColorHex};text-decoration:underline;">${safeEmail}</a>`
      );
    }
    if (safePersonalLinkedin) {
      const normalizedLi = safePersonalLinkedin.startsWith('http')
        ? safePersonalLinkedin
        : `https://${safePersonalLinkedin}`;
      contactParts.push(
        `<a href="${normalizedLi}" target="_blank" style="color:${linkColorHex};text-decoration:underline;font-weight:bold;">Personal LinkedIn</a>`
      );
    }

    const contactRowHTML =
      contactParts.length > 0
        ? `<tr>
                <td style="padding:0px 0px 8px 0px;font-size:9pt;font-family:Tahoma,Arial,sans-serif;color:${orgColorHex};line-height:1.3;">
                  ${contactParts.join(` <span style="color:#cbd5e1;padding:0 4px;">•</span> `)}
                </td>
              </tr>`
        : '';

    // Build Prettier Website-Inspired Social Media Badges (100% Email-Client Compatible Table Cells)
    const activeSocials = socialChannels.filter((ch) => ch.enabled && ch.url.trim());
    const socialCellsHTML = activeSocials
      .map((ch, idx) => {
        const isLast = idx === activeSocials.length - 1;
        const spacerCell = isLast ? '' : `<td width="7" style="width:7px;font-size:1px;">&nbsp;</td>`;
        const safeUrl = escapeHtml(ch.url.trim());

        if (iconStyle === 'website-brand') {
          // Website Active/Hover Brand Rounded-XL Tile (#0A66C2, #dc2743, #1877F2, #FF0000 with crisp white icon)
          return `<td valign="middle" align="center" width="30" height="30" bgcolor="${ch.brandHex}" style="width:30px;height:30px;background-color:${ch.brandHex};border:1px solid ${ch.brandHex};border-radius:8px;text-align:center;vertical-align:middle;">
                          <a href="${safeUrl}" target="_blank" title="ACAP on ${ch.label}" style="text-decoration:none;display:block;width:30px;height:30px;line-height:30px;">
                            <img alt="${ch.label}" border="0" width="16" height="16" src="${ch.iconWhiteUrl}" style="border:0px;display:inline-block;vertical-align:middle;width:16px;height:16px;">
                          </a>
                        </td>${spacerCell}`;
        }

        if (iconStyle === 'website-card') {
          // Website Default Soft Card Badge (Clean #f8fafc card with #e2e5eb border & crisp brand icon)
          return `<td valign="middle" align="center" width="30" height="30" bgcolor="#f8fafc" style="width:30px;height:30px;background-color:#f8fafc;border:1px solid #e2e5eb;border-radius:8px;text-align:center;vertical-align:middle;">
                          <a href="${safeUrl}" target="_blank" title="ACAP on ${ch.label}" style="text-decoration:none;display:block;width:30px;height:30px;line-height:30px;">
                            <img alt="${ch.label}" border="0" width="16" height="16" src="${ch.iconBrandUrl}" style="border:0px;display:inline-block;vertical-align:middle;width:16px;height:16px;">
                          </a>
                        </td>${spacerCell}`;
        }

        if (iconStyle === 'acap-crimson') {
          // ACAP Signature Rose-Tinted Card Badge (#fff1f5 background, #fecdd3 border, #e81053 crimson icon)
          return `<td valign="middle" align="center" width="30" height="30" bgcolor="#fff1f5" style="width:30px;height:30px;background-color:#fff1f5;border:1px solid #fecdd3;border-radius:8px;text-align:center;vertical-align:middle;">
                          <a href="${safeUrl}" target="_blank" title="ACAP on ${ch.label}" style="text-decoration:none;display:block;width:30px;height:30px;line-height:30px;">
                            <img alt="${ch.label}" border="0" width="16" height="16" src="${ch.iconCrimsonUrl}" style="border:0px;display:inline-block;vertical-align:middle;width:16px;height:16px;">
                          </a>
                        </td>${spacerCell}`;
        }

        // 'minimal' — Clean soft slate rounded tile with slate icon (100% dark & light mode safe)
        return `<td valign="middle" align="center" width="28" height="28" bgcolor="#f1f5f9" style="width:28px;height:28px;background-color:#f1f5f9;border:1px solid #cbd5e1;border-radius:7px;text-align:center;vertical-align:middle;">
                          <a href="${safeUrl}" target="_blank" title="ACAP on ${ch.label}" style="text-decoration:none;display:block;width:28px;height:28px;line-height:28px;">
                            <img alt="${ch.label}" border="0" width="15" height="15" src="${ch.iconSlateUrl}" style="border:0px;display:inline-block;vertical-align:middle;width:15px;height:15px;">
                          </a>
                        </td>${spacerCell}`;
      })
      .join('\n                        ');

    const socialRowHTML =
      activeSocials.length > 0
        ? `<tr>
                <td style="padding:2px 0px 12px 0px;">
                  <table cellpadding="0" cellspacing="0" border="0" style="border-spacing:0px;border-collapse:collapse;">
                    <tbody>
                      <tr>
                        ${socialCellsHTML}
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>`
        : '';

    // Action Buttons
    const memberBtnHTML = showMemberBtn
      ? `<td bgcolor="#e81053" style="background-color:#e81053;border:1px solid #e81053;border-radius:6px;padding:6px 13px;text-align:center;">
                          <a href="${escapeHtml(memberBtnUrl.trim() || 'https://members.croampro.com/signup')}" target="_blank" style="font-family:Tahoma,Arial,sans-serif;font-size:8.5pt;font-weight:bold;color:#ffffff;text-decoration:none;display:inline-block;white-space:nowrap;">${escapeHtml(memberBtnText.trim() || 'Become a Member')}</a>
                        </td>`
      : '';

    const websiteBtnHTML = showWebsiteBtn
      ? `<td bgcolor="#f1f5f9" style="background-color:#f1f5f9;border:1px solid #cbd5e1;border-radius:6px;padding:6px 13px;text-align:center;">
                          <a href="${escapeHtml(websiteBtnUrl.trim() || 'https://croampro.com/')}" target="_blank" style="font-family:Tahoma,Arial,sans-serif;font-size:8.5pt;font-weight:bold;color:#0f172a;text-decoration:none;display:inline-block;white-space:nowrap;">${escapeHtml(websiteBtnText.trim() || 'Visit Our Website')}</a>
                        </td>`
      : '';

    let orderedBtns = '';
    if (showMemberBtn && showWebsiteBtn) {
      orderedBtns =
        buttonOrder === 'member-first'
          ? `${memberBtnHTML}\n                        <td width="8" style="width:8px;">&nbsp;</td>\n                        ${websiteBtnHTML}`
          : `${websiteBtnHTML}\n                        <td width="8" style="width:8px;">&nbsp;</td>\n                        ${memberBtnHTML}`;
    } else {
      orderedBtns = memberBtnHTML || websiteBtnHTML;
    }

    const buttonsTableHTML = orderedBtns
      ? `<tr>
                <td style="padding:0px;">
                  <table cellpadding="0" cellspacing="0" border="0" style="border-spacing:0px;border-collapse:collapse;">
                    <tbody>
                      <tr>
                        ${orderedBtns}
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>`
      : '';

    const onErrorAttr = includeFallbackOnError
      ? ` onerror="this.onerror=null;this.src='${getAcapLogoFallbackSvg()}';"`
      : '';

    const bottomRuleHTML = showBottomBorder
      ? `<tr>
        <td colspan="2" style="padding:0px;border-top:2px solid #e81053;width:100%;max-width:480px;font-size:1px;line-height:1px;">&nbsp;</td>
      </tr>`
      : '';

    return `<div dir="ltr">
  <table cellpadding="0" cellspacing="0" border="0" style="border-spacing:0px;border-collapse:collapse;width:100%;max-width:480px;font-size:10pt;font-family:Tahoma,Arial,sans-serif;line-height:1.4;">
    <tbody>
      <tr>
        <td valign="top" width="130" style="padding:8px 15px 12px 0px;width:130px;vertical-align:top;">
          <a href="${safeWebsiteUrl}" target="_blank" style="text-decoration:none;background-color:transparent;">
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
                  ${safeOrgName}
                </td>
              </tr>
              <tr>
                <td style="padding:0px 0px 8px 0px;font-size:9.5pt;font-family:Tahoma,Arial,sans-serif;color:${orgColorHex};line-height:1.3;">
                  ${safeChapter} <span style="color:#e81053;font-weight:bold;">|</span> <a href="${safeWebsiteUrl}" target="_blank" style="color:${linkColorHex};text-decoration:underline;font-weight:bold;">${safeWebsiteLabel}</a>
                </td>
              </tr>
              ${contactRowHTML}
              ${socialRowHTML}
              ${buttonsTableHTML}
            </tbody>
          </table>
        </td>
      </tr>
      ${bottomRuleHTML}
    </tbody>
  </table>
</div>`;
  };

  const previewHtml = useMemo(
    () => buildSignatureHTML(true),
    [
      name,
      role,
      email,
      phone,
      personalLinkedin,
      orgName,
      chapter,
      websiteLabel,
      websiteUrl,
      colorPalette,
      iconStyle,
      buttonOrder,
      showMemberBtn,
      memberBtnText,
      memberBtnUrl,
      showWebsiteBtn,
      websiteBtnText,
      websiteBtnUrl,
      showBottomBorder,
      socialChannels,
    ]
  );

  const cleanExportHtml = useMemo(
    () => buildSignatureHTML(false),
    [
      name,
      role,
      email,
      phone,
      personalLinkedin,
      orgName,
      chapter,
      websiteLabel,
      websiteUrl,
      colorPalette,
      iconStyle,
      buttonOrder,
      showMemberBtn,
      memberBtnText,
      memberBtnUrl,
      showWebsiteBtn,
      websiteBtnText,
      websiteBtnUrl,
      showBottomBorder,
      socialChannels,
    ]
  );

  // ============================================================================
  // 4. SELF-SERVICE ACTIONS (COPY VISUAL, COPY HTML, DOWNLOAD, SHARE LINK, PROFILES)
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
        'Open your Gmail, Outlook, or Apple Mail signature settings and press Cmd+V (Mac) or Ctrl+V (Windows).'
      );
    } catch {
      navigator.clipboard?.writeText(cleanExportHtml);
      setCopiedVisual(true);
      setTimeout(() => setCopiedVisual(false), 3000);
      triggerToast(
        'Signature Copied!',
        'Paste directly into your email client signature settings.'
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
      'Ready to paste into any HTML-based email signature manager or client.'
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
    triggerToast(
      'Downloaded Signature HTML File!',
      `Saved acap-signature-${slug}.html to your device.`
    );
  };

  const handleCopyShareableLink = () => {
    const params = new URLSearchParams();
    if (name.trim()) params.set('name', name.trim());
    if (role.trim()) params.set('role', role.trim());
    if (chapter.trim()) params.set('chapter', chapter.trim());
    if (email.trim()) params.set('email', email.trim());
    if (phone.trim()) params.set('phone', phone.trim());
    if (personalLinkedin.trim()) params.set('linkedin', personalLinkedin.trim());
    const shareUrl = `${window.location.origin}/vibecoding/ACAPemail?${params.toString()}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedShareUrl(true);
    setTimeout(() => setCopiedShareUrl(false), 2500);
    triggerToast(
      'Copied Pre-Filled Self-Service Link!',
      'Anyone opening this link will see this exact signature pre-filled and ready to copy.'
    );
  };

  const handleResetDefault = () => {
    setName('Vedran Brozović');
    setRole('Board member | Seattle Conference Chair');
    setEmail('');
    setPhone('');
    setPersonalLinkedin('');
    setOrgName('Association of Croatian American Professionals');
    setChapter('ACAP Foundation');
    setWebsiteLabel('croampro.com');
    setWebsiteUrl('https://croampro.com/');
    setColorPalette('adaptive');
    setIconStyle('website-card');
    setButtonOrder('member-first');
    setShowMemberBtn(true);
    setMemberBtnText('Become a Member');
    setMemberBtnUrl('https://members.croampro.com/signup');
    setShowWebsiteBtn(true);
    setWebsiteBtnText('Visit Our Website');
    setWebsiteBtnUrl('https://croampro.com/');
    setShowBottomBorder(true);
    setSocialChannels(DEFAULT_SOCIAL_CHANNELS);
    triggerToast('Reset to Default', 'Restored default ACAP signature template.');
  };

  const handleSaveCurrentProfile = () => {
    const label =
      profileNameInput.trim() || `${name.trim() || 'ACAP'} — ${role.split('|')[0].trim()}`;
    const newProfile: SavedSignatureProfile = {
      id: `sig_${Date.now()}`,
      label,
      name,
      role,
      email,
      phone,
      personalLinkedin,
      orgName,
      chapter,
      websiteLabel,
      websiteUrl,
      colorPalette,
      iconStyle,
      buttonOrder,
      showMemberBtn,
      memberBtnText,
      memberBtnUrl,
      showWebsiteBtn,
      websiteBtnText,
      websiteBtnUrl,
      showBottomBorder,
      updatedAt: new Date().toISOString(),
    };
    setSavedProfiles((prev) => [newProfile, ...prev]);
    setProfileNameInput('');
    triggerToast('Signature Template Saved!', `Saved "${label}" in your browser for 1-click reuse.`);
  };

  const handleLoadProfile = (prof: SavedSignatureProfile) => {
    setName(prof.name);
    setRole(prof.role);
    setEmail(prof.email);
    setPhone(prof.phone);
    setPersonalLinkedin(prof.personalLinkedin);
    setOrgName(prof.orgName);
    setChapter(prof.chapter);
    setWebsiteLabel(prof.websiteLabel);
    setWebsiteUrl(prof.websiteUrl);
    setColorPalette(prof.colorPalette);
    setIconStyle(prof.iconStyle);
    setButtonOrder(prof.buttonOrder);
    setShowMemberBtn(prof.showMemberBtn);
    setMemberBtnText(prof.memberBtnText);
    setMemberBtnUrl(prof.memberBtnUrl);
    setShowWebsiteBtn(prof.showWebsiteBtn);
    setWebsiteBtnText(prof.websiteBtnText);
    setWebsiteBtnUrl(prof.websiteBtnUrl);
    setShowBottomBorder(prof.showBottomBorder);
    triggerToast('Loaded Saved Signature', `Loaded "${prof.label}".`);
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
      {/* Official ACAP Member Self-Service Portal Header */}
      <header className="bg-[#010333] text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Brand Identity + Back to Vibe Coding */}
            <div className="flex items-center gap-3">
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
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-base sm:text-lg font-bold text-white leading-tight">
                    Official Email Signature Studio
                  </h1>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#e81053] text-white">
                    100% Self-Service
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Association of Croatian American Professionals • Customize, preview &amp; install in 60 seconds
                </p>
              </div>
            </div>

            {/* Header Actions: Share Pre-filled Link + Primary One-Click Copy CTA */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyShareableLink}
                className="inline-flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs px-3.5 py-2.5 rounded-lg border border-white/15 transition cursor-pointer"
                title="Copy a shareable link pre-filled with these details"
              >
                {copiedShareUrl ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Share2 className="w-3.5 h-3.5 text-rose-300" />
                )}
                <span>{copiedShareUrl ? 'Link Copied!' : 'Share Pre-Filled Link'}</span>
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
                <span>{copiedVisual ? 'Copied Signature!' : 'Copy Signature'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Quick 3-Step Self-Service Banner */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-xs">
            <div className="flex items-center gap-2.5 py-1">
              <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#e81053] to-[#be0b42] text-white font-bold flex items-center justify-center shrink-0 shadow-xs">
                1
              </span>
              <div>
                <span className="font-bold text-slate-900">Customize Everything</span>
                <span className="text-slate-500 block sm:inline sm:ml-1">
                  — Name, role, chapter, icons &amp; buttons
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
                  — Copies rich formatting, badges &amp; links
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
                  — Works in Gmail, Outlook &amp; Apple Mail
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
        {/* LEFT COLUMN: Self-Service Controls (5 cols) */}
        <section className="lg:col-span-5 space-y-5">
          {/* Card 1: Member Identity & Chapter Details */}
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
                onClick={handleResetDefault}
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

            {/* Role / Title Input + Quick Role Chips */}
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
                placeholder="e.g., Member | Seattle Chapter"
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#e81053] focus:border-transparent font-medium text-slate-900"
              />

              <div className="mt-2">
                <span className="block text-[11px] font-medium text-slate-400 mb-1.5">
                  Quick-fill role presets (click to apply):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {ROLE_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setRole(preset)}
                      className={`text-[11px] px-2.5 py-1 rounded-md font-medium border transition-colors cursor-pointer ${
                        role === preset
                          ? 'bg-rose-50 text-[#e81053] border-[#e81053]/40 font-semibold'
                          : 'bg-slate-100 hover:bg-rose-50 hover:text-[#e81053] text-slate-700 border-slate-200'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chapter / Subtitle Line + Quick Chapter Chips */}
            <div className="pt-2 border-t border-slate-100">
              <label
                htmlFor="inputChapter"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Chapter / Foundation Line
              </label>
              <input
                id="inputChapter"
                type="text"
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                placeholder="e.g., ACAP Foundation or ACAP Seattle"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#e81053] font-medium text-slate-900"
              />
              <div className="flex flex-wrap gap-1 mt-1.5">
                {CHAPTER_PRESETS.map((chap) => (
                  <button
                    key={chap}
                    type="button"
                    onClick={() => setChapter(chap)}
                    className={`text-[10px] px-2 py-0.5 rounded font-medium border transition-colors cursor-pointer ${
                      chapter === chap
                        ? 'bg-rose-50 text-[#e81053] border-[#e81053]/40 font-semibold'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {chap}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Contact Details (Phone, Email, Personal LinkedIn) */}
            <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              <div>
                <label
                  htmlFor="inputEmail"
                  className="block text-xs font-medium text-slate-600 mb-1"
                >
                  Email <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  id="inputEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g., name@croampro.com"
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#e81053]"
                />
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="inputPersonalLi"
                  className="block text-xs font-medium text-slate-600 mb-1"
                >
                  Personal LinkedIn URL <span className="text-slate-400 font-normal">(Optional link next to phone/email)</span>
                </label>
                <input
                  id="inputPersonalLi"
                  type="text"
                  value={personalLinkedin}
                  onChange={(e) => setPersonalLinkedin(e.target.value)}
                  placeholder="e.g., https://www.linkedin.com/in/yourprofile/"
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#e81053]"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Prettier Website-Inspired Social Media Icons & Channels */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Social Media Icon Design &amp; Links
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Styled after the rounded social icon badges on vedranbrozovic.com
                </p>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Email-Safe Badges
              </span>
            </div>

            {/* 4 Prettier Website-Inspired Icon Style Cards with Live Mini Previews */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Option 1: Website Soft Card Badges */}
              <button
                type="button"
                onClick={() => setIconStyle('website-card')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                  iconStyle === 'website-card'
                    ? 'border-2 border-[#e81053] bg-rose-50/30 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Website Soft Cards</span>
                  {iconStyle === 'website-card' && (
                    <span className="text-[10px] font-bold text-[#e81053]">Active</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-7 h-7 rounded-lg bg-[#f8fafc] border border-[#e2e5eb] text-[#0A66C2] flex items-center justify-center shadow-2xs">
                    <Linkedin className="w-3.5 h-3.5" />
                  </span>
                  <span className="w-7 h-7 rounded-lg bg-[#f8fafc] border border-[#e2e5eb] text-[#dc2743] flex items-center justify-center shadow-2xs">
                    <Instagram className="w-3.5 h-3.5" />
                  </span>
                  <span className="w-7 h-7 rounded-lg bg-[#f8fafc] border border-[#e2e5eb] text-[#1877F2] flex items-center justify-center shadow-2xs">
                    <Facebook className="w-3.5 h-3.5" />
                  </span>
                  <span className="w-7 h-7 rounded-lg bg-[#f8fafc] border border-[#e2e5eb] text-[#FF0000] flex items-center justify-center shadow-2xs">
                    <Youtube className="w-3.5 h-3.5" />
                  </span>
                </div>
              </button>

              {/* Option 2: Website Filled Brand Tiles */}
              <button
                type="button"
                onClick={() => setIconStyle('website-brand')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                  iconStyle === 'website-brand'
                    ? 'border-2 border-[#e81053] bg-rose-50/30 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Website Brand Tiles</span>
                  {iconStyle === 'website-brand' && (
                    <span className="text-[10px] font-bold text-[#e81053]">Active</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-7 h-7 rounded-lg bg-[#0A66C2] text-white flex items-center justify-center shadow-2xs">
                    <Linkedin className="w-3.5 h-3.5" />
                  </span>
                  <span className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shadow-2xs">
                    <Instagram className="w-3.5 h-3.5" />
                  </span>
                  <span className="w-7 h-7 rounded-lg bg-[#1877F2] text-white flex items-center justify-center shadow-2xs">
                    <Facebook className="w-3.5 h-3.5" />
                  </span>
                  <span className="w-7 h-7 rounded-lg bg-[#FF0000] text-white flex items-center justify-center shadow-2xs">
                    <Youtube className="w-3.5 h-3.5" />
                  </span>
                </div>
              </button>

              {/* Option 3: ACAP Crimson Rose Badges */}
              <button
                type="button"
                onClick={() => setIconStyle('acap-crimson')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                  iconStyle === 'acap-crimson'
                    ? 'border-2 border-[#e81053] bg-rose-50/30 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">ACAP Crimson Badges</span>
                  {iconStyle === 'acap-crimson' && (
                    <span className="text-[10px] font-bold text-[#e81053]">Active</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  {[Linkedin, Instagram, Facebook, Youtube].map((IconComp, idx) => (
                    <span
                      key={idx}
                      className="w-7 h-7 rounded-lg bg-[#fff1f5] border border-[#fecdd3] text-[#e81053] flex items-center justify-center shadow-2xs"
                    >
                      <IconComp className="w-3.5 h-3.5" />
                    </span>
                  ))}
                </div>
              </button>

              {/* Option 4: Minimal Slate Tiles */}
              <button
                type="button"
                onClick={() => setIconStyle('minimal')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                  iconStyle === 'minimal'
                    ? 'border-2 border-[#e81053] bg-rose-50/30 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Minimal Slate Cards</span>
                  {iconStyle === 'minimal' && (
                    <span className="text-[10px] font-bold text-[#e81053]">Active</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  {[Linkedin, Instagram, Facebook, Youtube].map((IconComp, idx) => (
                    <span
                      key={idx}
                      className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-300 text-slate-600 flex items-center justify-center shadow-2xs"
                    >
                      <IconComp className="w-3.5 h-3.5" />
                    </span>
                  ))}
                </div>
              </button>
            </div>

            {/* Self-Service Toggle & Edit Social Platforms */}
            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-700">
                  Included Social Icons (Click to toggle on/off):
                </span>
                <button
                  type="button"
                  onClick={() => setShowSocialUrlEditor((prev) => !prev)}
                  className="text-[11px] font-semibold text-[#e81053] hover:underline cursor-pointer"
                >
                  {showSocialUrlEditor ? 'Hide URLs' : 'Customize Links'}
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {socialChannels.map((ch) => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() =>
                      setSocialChannels((prev) =>
                        prev.map((item) =>
                          item.id === ch.id ? { ...item, enabled: !item.enabled } : item
                        )
                      )
                    }
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                      ch.enabled
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-100 text-slate-400 border-slate-200'
                    }`}
                  >
                    <span>{ch.enabled ? '✓' : '+'}</span>
                    <span>{ch.label}</span>
                  </button>
                ))}
              </div>

              {showSocialUrlEditor && (
                <div className="mt-3 space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-600">
                      Social Profile URLs (Official ACAP or Chapter Links)
                    </span>
                    <button
                      type="button"
                      onClick={() => setSocialChannels(DEFAULT_SOCIAL_CHANNELS)}
                      className="text-[11px] text-[#e81053] font-semibold hover:underline cursor-pointer"
                    >
                      Reset Links
                    </button>
                  </div>
                  {socialChannels.map((ch) => (
                    <div key={ch.id} className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-slate-600 w-20 shrink-0">
                        {ch.label}:
                      </span>
                      <input
                        type="text"
                        value={ch.url}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSocialChannels((prev) =>
                            prev.map((item) =>
                              item.id === ch.id ? { ...item, url: val } : item
                            )
                          );
                        }}
                        className="flex-1 bg-white border border-slate-200 rounded-md px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-[#e81053]"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Card 3: Dark Mode Text Palette & Action Buttons Customization */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Colors &amp; Call-To-Action Buttons
            </h2>

            {/* Text Color Mode */}
            <div>
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
                      Dark Mode Safe
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Automatically renders crisp white in Dark Mode and dark navy/black in Light Mode.
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

            {/* Action Buttons Self-Service Editor */}
            <div className="pt-2 border-t border-slate-100 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">
                  Action Buttons &amp; Order
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setButtonOrder('member-first')}
                    className={`text-[11px] px-2 py-1 rounded border font-semibold cursor-pointer ${
                      buttonOrder === 'member-first'
                        ? 'border-[#e81053] bg-rose-50 text-[#e81053]'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Member 1st
                  </button>
                  <button
                    type="button"
                    onClick={() => setButtonOrder('website-first')}
                    className={`text-[11px] px-2 py-1 rounded border font-semibold cursor-pointer ${
                      buttonOrder === 'website-first'
                        ? 'border-[#e81053] bg-rose-50 text-[#e81053]'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Website 1st
                  </button>
                </div>
              </div>

              {/* Primary CTA self-service row */}
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showMemberBtn}
                      onChange={(e) => setShowMemberBtn(e.target.checked)}
                      className="accent-[#e81053]"
                    />
                    <span>Primary Crimson Button</span>
                  </label>
                </div>
                {showMemberBtn && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    <input
                      type="text"
                      value={memberBtnText}
                      onChange={(e) => setMemberBtnText(e.target.value)}
                      placeholder="Button label"
                      className="bg-white border border-slate-200 rounded px-2 py-1 text-xs"
                    />
                    <input
                      type="text"
                      value={memberBtnUrl}
                      onChange={(e) => setMemberBtnUrl(e.target.value)}
                      placeholder="https://..."
                      className="bg-white border border-slate-200 rounded px-2 py-1 text-xs"
                    />
                  </div>
                )}
              </div>

              {/* Secondary CTA self-service row */}
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showWebsiteBtn}
                      onChange={(e) => setShowWebsiteBtn(e.target.checked)}
                      className="accent-[#e81053]"
                    />
                    <span>Secondary Light Button</span>
                  </label>
                </div>
                {showWebsiteBtn && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    <input
                      type="text"
                      value={websiteBtnText}
                      onChange={(e) => setWebsiteBtnText(e.target.value)}
                      placeholder="Button label"
                      className="bg-white border border-slate-200 rounded px-2 py-1 text-xs"
                    />
                    <input
                      type="text"
                      value={websiteBtnUrl}
                      onChange={(e) => setWebsiteBtnUrl(e.target.value)}
                      placeholder="https://..."
                      className="bg-white border border-slate-200 rounded px-2 py-1 text-xs"
                    />
                  </div>
                )}
              </div>

              <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showBottomBorder}
                  onChange={(e) => setShowBottomBorder(e.target.checked)}
                  className="accent-[#e81053]"
                />
                <span>Include bottom ACAP crimson accent divider line</span>
              </label>
            </div>
          </div>

          {/* Card 4: Self-Service Saved Signature Profiles */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-[#e81053]" />
                <span>Saved Signature Templates ({savedProfiles.length})</span>
              </h2>
            </div>
            <p className="text-[11px] text-slate-500">
              Save multiple versions of your signature in your browser (e.g., Board Role vs. Chapter Role) and switch in one click.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={profileNameInput}
                onChange={(e) => setProfileNameInput(e.target.value)}
                placeholder="Template name (optional)..."
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-[#e81053]"
              />
              <button
                type="button"
                onClick={handleSaveCurrentProfile}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save Current</span>
              </button>
            </div>

            {savedProfiles.length > 0 && (
              <div className="space-y-1.5 pt-1 max-h-40 overflow-y-auto">
                {savedProfiles.map((prof) => (
                  <div
                    key={prof.id}
                    className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                  >
                    <button
                      type="button"
                      onClick={() => handleLoadProfile(prof)}
                      className="text-left font-semibold text-slate-800 hover:text-[#e81053] truncate flex-1 cursor-pointer"
                    >
                      {prof.label}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setSavedProfiles((prev) => prev.filter((p) => p.id !== prof.id))
                      }
                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                      title="Delete saved template"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* RIGHT COLUMN: Step 2 (Live Preview & Copy) + Step 3 (Setup Instructions) (7 cols) */}
        <section className="lg:col-span-7 flex flex-col gap-6 lg:sticky lg:top-20">
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
                {/* Viewport Switcher */}
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

                {/* Light / Dark Theme Switcher */}
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
                      ✓ Dark Mode Active: High-contrast badges &amp; text
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

              {/* Big Prominent Self-Service Action Bar Under Preview */}
              <div className="w-full mt-4 bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-center sm:text-left">
                  <p className="text-xs font-bold text-slate-900">
                    Ready to install your signature?
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Copy the visual signature for Gmail/Outlook/Apple Mail, or download the HTML file.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleCopyVisualSignature}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-[#e81053] hover:bg-[#c90d47] active:scale-[0.99] text-white font-bold text-sm px-5 py-2.5 rounded-lg shadow-sm transition-all cursor-pointer"
                  >
                    {copiedVisual ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    <span>
                      {copiedVisual
                        ? '✓ Copied! Paste with Cmd+V / Ctrl+V'
                        : 'Copy Signature to Clipboard'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyRawHtml}
                    title="Copy Raw HTML Source Code"
                    className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3 py-2.5 rounded-lg border border-slate-200 transition-all cursor-pointer"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>{copiedHtml ? 'Copied HTML!' : 'Copy HTML'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadHtmlFile}
                    title="Download .html signature file"
                    className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3 py-2.5 rounded-lg border border-slate-200 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>.HTML</span>
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
                    Self-Service Installation Guide
                  </h3>
                  <p className="text-xs text-slate-500">
                    Select your email app below and follow the 4 quick steps
                  </p>
                </div>
              </div>

              {/* Client Instruction Tabs */}
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

            {/* Tab Content: Gmail */}
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
                        In Gmail, click the <strong>⚙️ Gear icon</strong> (top right) →{' '}
                        <a
                          href="https://mail.google.com/mail/u/0/#settings/general"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#e81053] underline font-semibold"
                        >
                          See all settings ↗
                        </a>
                        .
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
                        Scroll down to <strong>Signature</strong>, click inside the box, and press{' '}
                        <strong>Cmd + V</strong> (Mac) or <strong>Ctrl + V</strong> (Windows).
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
                        Select your signature under <em>&quot;Signature defaults&quot;</em>, then scroll down and click{' '}
                        <strong>Save Changes</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab Content: Outlook */}
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

            {/* Tab Content: Apple Mail */}
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
                        In Apple Mail on Mac, open <strong>Mail → Settings → Signatures</strong> and click <strong>[+]</strong>.
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
                        <strong>Uncheck</strong> <em>&quot;Always match my default message font&quot;</em> at the bottom BEFORE pasting.
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
                        Press <strong>Cmd + V</strong> in the preview pane (images appear properly as soon as you compose a new email!).
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
                    href={websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-[#e81053]"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#e81053]" /> Website: {websiteLabel} ↗
                  </a>
                  {showMemberBtn && (
                    <a
                      href={memberBtnUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-[#e81053]"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#e81053]" /> {memberBtnText} ↗
                    </a>
                  )}
                  {socialChannels
                    .filter((c) => c.enabled)
                    .map((c) => (
                      <a
                        key={c.id}
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-[#e81053]"
                      >
                        {c.label} ↗
                      </a>
                    ))}
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
