import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  FolderOpen,
  Plus,
  Download,
  Upload,
  Copy,
  Check,
  Trash2,
  Edit3,
  RefreshCw,
  ListOrdered,
  Shuffle,
  Search,
  Trophy,
  Calendar,
  Sparkles,
  FileJson,
  X,
  ChevronRight,
  Undo2,
  History,
  MessageSquarePlus,
  Filter,
  Cloud,
  Lock,
  Unlock,
  KeyRound,
  Share2
} from 'lucide-react';

// ============================================================================
// 1. STATIC NBA TEAMS METADATA (All 30 Franchises)
// ============================================================================
export interface NbaTeam {
  id: number;
  espnId: string;
  abbr: string;
  name: string;
  conf: 'East' | 'West';
  div: 'Atlantic' | 'Central' | 'Southeast' | 'Northwest' | 'Pacific' | 'Southwest';
}

export const NBA_TEAMS: NbaTeam[] = [
  // EASTERN CONFERENCE - Atlantic
  { id: 1, espnId: '2', abbr: 'BOS', name: 'Boston Celtics', conf: 'East', div: 'Atlantic' },
  { id: 2, espnId: '17', abbr: 'BKN', name: 'Brooklyn Nets', conf: 'East', div: 'Atlantic' },
  { id: 3, espnId: '18', abbr: 'NY', name: 'New York Knicks', conf: 'East', div: 'Atlantic' },
  { id: 4, espnId: '20', abbr: 'PHI', name: 'Philadelphia 76ers', conf: 'East', div: 'Atlantic' },
  { id: 5, espnId: '28', abbr: 'TOR', name: 'Toronto Raptors', conf: 'East', div: 'Atlantic' },
  // EASTERN CONFERENCE - Central
  { id: 6, espnId: '4', abbr: 'CHI', name: 'Chicago Bulls', conf: 'East', div: 'Central' },
  { id: 7, espnId: '5', abbr: 'CLE', name: 'Cleveland Cavaliers', conf: 'East', div: 'Central' },
  { id: 8, espnId: '8', abbr: 'DET', name: 'Detroit Pistons', conf: 'East', div: 'Central' },
  { id: 9, espnId: '11', abbr: 'IND', name: 'Indiana Pacers', conf: 'East', div: 'Central' },
  { id: 10, espnId: '15', abbr: 'MIL', name: 'Milwaukee Bucks', conf: 'East', div: 'Central' },
  // EASTERN CONFERENCE - Southeast
  { id: 11, espnId: '1', abbr: 'ATL', name: 'Atlanta Hawks', conf: 'East', div: 'Southeast' },
  { id: 12, espnId: '30', abbr: 'CHA', name: 'Charlotte Hornets', conf: 'East', div: 'Southeast' },
  { id: 13, espnId: '14', abbr: 'MIA', name: 'Miami Heat', conf: 'East', div: 'Southeast' },
  { id: 14, espnId: '19', abbr: 'ORL', name: 'Orlando Magic', conf: 'East', div: 'Southeast' },
  { id: 15, espnId: '27', abbr: 'WSH', name: 'Washington Wizards', conf: 'East', div: 'Southeast' },
  // WESTERN CONFERENCE - Northwest
  { id: 16, espnId: '7', abbr: 'DEN', name: 'Denver Nuggets', conf: 'West', div: 'Northwest' },
  { id: 17, espnId: '16', abbr: 'MIN', name: 'Minnesota Timberwolves', conf: 'West', div: 'Northwest' },
  { id: 18, espnId: '25', abbr: 'OKC', name: 'Oklahoma City Thunder', conf: 'West', div: 'Northwest' },
  { id: 19, espnId: '22', abbr: 'POR', name: 'Portland Trail Blazers', conf: 'West', div: 'Northwest' },
  { id: 20, espnId: '26', abbr: 'UTAH', name: 'Utah Jazz', conf: 'West', div: 'Northwest' },
  // WESTERN CONFERENCE - Pacific
  { id: 21, espnId: '9', abbr: 'GS', name: 'Golden State Warriors', conf: 'West', div: 'Pacific' },
  { id: 22, espnId: '12', abbr: 'LAC', name: 'LA Clippers', conf: 'West', div: 'Pacific' },
  { id: 23, espnId: '13', abbr: 'LAL', name: 'Los Angeles Lakers', conf: 'West', div: 'Pacific' },
  { id: 24, espnId: '21', abbr: 'PHX', name: 'Phoenix Suns', conf: 'West', div: 'Pacific' },
  { id: 25, espnId: '23', abbr: 'SAC', name: 'Sacramento Kings', conf: 'West', div: 'Pacific' },
  // WESTERN CONFERENCE - Southwest
  { id: 26, espnId: '6', abbr: 'DAL', name: 'Dallas Mavericks', conf: 'West', div: 'Southwest' },
  { id: 27, espnId: '10', abbr: 'HOU', name: 'Houston Rockets', conf: 'West', div: 'Southwest' },
  { id: 28, espnId: '29', abbr: 'MEM', name: 'Memphis Grizzlies', conf: 'West', div: 'Southwest' },
  { id: 29, espnId: '3', abbr: 'NO', name: 'New Orleans Pelicans', conf: 'West', div: 'Southwest' },
  { id: 30, espnId: '24', abbr: 'SA', name: 'San Antonio Spurs', conf: 'West', div: 'Southwest' },
];

export interface PlayerColor {
  bg: string;
  text: string;
  border: string;
  badge: string;
  hex: string;
}

export const PLAYER_COLORS: PlayerColor[] = [
  { bg: 'from-orange-500 to-amber-500', text: 'text-orange-400', border: 'border-orange-500/40', badge: 'bg-orange-500/20 text-orange-300 border-orange-500/40', hex: '#f97316' },
  { bg: 'from-sky-500 to-blue-600', text: 'text-sky-400', border: 'border-sky-500/40', badge: 'bg-sky-500/20 text-sky-300 border-sky-500/40', hex: '#0ea5e9' },
  { bg: 'from-emerald-500 to-teal-600', text: 'text-emerald-400', border: 'border-emerald-500/40', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', hex: '#10b981' },
  { bg: 'from-purple-500 to-indigo-600', text: 'text-purple-400', border: 'border-purple-500/40', badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40', hex: '#a855f7' },
  { bg: 'from-rose-500 to-pink-600', text: 'text-rose-400', border: 'border-rose-500/40', badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40', hex: '#f43f5e' },
  { bg: 'from-yellow-400 to-amber-600', text: 'text-yellow-300', border: 'border-yellow-500/40', badge: 'bg-yellow-500/20 text-yellow-200 border-yellow-500/40', hex: '#eab308' },
];

export interface LeaguePlayer {
  id: number;
  name: string;
  colorIndex: number;
  teamIds: number[];
}

export interface DraftPick {
  pickNumber: number;
  playerIndex: number;
  teamId: number;
}

export interface LeagueData {
  id: string;
  name: string;
  season: string; // '2027' (2026-27) or '2026' (2025-26)
  numPlayers: number;
  players: LeaguePlayer[];
  snakeOrder: number[];
  picks: DraftPick[];
  status: 'DRAFTING' | 'ACTIVE';
  gameNotes?: Record<string, string>; // Custom notes keyed by game ID
  createdAt: string;
  updatedAt: string;
}

interface TeamStanding {
  wins: number;
  losses: number;
  gamesPlayed: number;
  winPct: number;
}

interface ScheduleGame {
  id: string;
  status: string;
  isCompleted: boolean;
  awayTeam: NbaTeam;
  homeTeam: NbaTeam;
  awayScore: string | null;
  homeScore: string | null;
}

interface DaySchedule {
  dateLabel: string;
  dateCode: string;
  games: ScheduleGame[];
}

export interface HistoricalGame {
  id: string;
  dateIso: string;
  dateFormatted: string;
  statusDetail: string;
  awayTeam: NbaTeam;
  homeTeam: NbaTeam;
  awayScore: number;
  homeScore: number;
  winnerTeam: NbaTeam;
  loserTeam: NbaTeam;
  winnerScore: number;
  loserScore: number;
}

export interface SharedSlotSummary {
  id: string;
  name: string;
  season: string;
  numPlayers: number;
  status: 'DRAFTING' | 'ACTIVE';
  picksCount: number;
  players: { id: number; name: string; colorIndex: number; teamCount: number }[];
  updatedAt: string;
}

export interface SharedSlotItem {
  slotNumber: number; // 1..10
  hasPassword: boolean;
  savedAt: string;
  summary: SharedSlotSummary;
  league: LeagueData | null; // Present immediately when hasPassword is false
}

const SHARED_SLOTS_FALLBACK_KEY = 'nba_wins_shared_10_slots_fallback_v1';
const MAX_SHARED_SLOTS = 10;

const getLogoUrl = (abbr: string) =>
  `https://a.espncdn.com/i/teamlogos/nba/500/${abbr.toLowerCase()}.png`;

// ============================================================================
// 2. HELPER FUNCTIONS: SNAKE DRAFT & POSSIBLE POINTS ENGINE
// ============================================================================
function generateSnakeOrder(numPlayers: number): number[] {
  const rounds = 30 / numPlayers;
  const order: number[] = [];
  for (let r = 0; r < rounds; r++) {
    const roundPicks = Array.from({ length: numPlayers }, (_, i) => i);
    if (r % 2 === 1) roundPicks.reverse();
    order.push(...roundPicks);
  }
  return order;
}

/**
 * Estimates NBA regular season head-to-head matchups between two teams:
 * - Same division: 4 games per season
 * - Same conference (different division): ~3.6 games per season
 * - Different conference: 2 games per season
 */
function getPairSeasonGames(teamA: NbaTeam, teamB: NbaTeam): number {
  if (teamA.id === teamB.id) return 0;
  if (teamA.div === teamB.div) return 4;
  if (teamA.conf === teamB.conf) return 3.6;
  return 2;
}

function calculatePlayerPossiblePoints(
  teamIds: number[],
  standingsMap: Record<number, TeamStanding>
) {
  const teams = teamIds
    .map((id) => NBA_TEAMS.find((t) => t.id === id))
    .filter((t): t is NbaTeam => Boolean(t));

  let totalWins = 0;
  let totalLosses = 0;
  let totalGamesPlayed = 0;

  teams.forEach((t) => {
    const rec = standingsMap[t.id] || { wins: 0, losses: 0, gamesPlayed: 0, winPct: 0 };
    totalWins += rec.wins;
    totalLosses += rec.losses;
    totalGamesPlayed += rec.gamesPlayed;
  });

  // Calculate total full-season internal games between this player's own teams
  let totalInternalSeasonGames = 0;
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      totalInternalSeasonGames += getPairSeasonGames(teams[i], teams[j]);
    }
  }
  totalInternalSeasonGames = Math.round(totalInternalSeasonGames);

  const totalSeasonGamesForGroup = teams.length * 82;
  const seasonProgressRatio =
    totalSeasonGamesForGroup > 0
      ? Math.min(1, totalGamesPlayed / totalSeasonGamesForGroup)
      : 0;

  const estimatedInternalGamesPlayedSoFar = Math.round(
    totalInternalSeasonGames * seasonProgressRatio
  );
  const remainingInternalGames = Math.max(
    0,
    totalInternalSeasonGames - estimatedInternalGamesPlayedSoFar
  );

  // Possible points to date = Total games played by player's teams minus 1 guaranteed loss per internal matchup played
  const possiblePointsToDate = Math.max(
    totalWins,
    totalGamesPlayed - estimatedInternalGamesPlayedSoFar
  );

  // Max Possible Season Points (Remaining Ceiling)
  const remainingGamesForGroup = Math.max(0, totalSeasonGamesForGroup - totalGamesPlayed);
  const maxRemainingWins = Math.max(0, remainingGamesForGroup - remainingInternalGames);
  const maxPossibleSeasonPoints = totalWins + maxRemainingWins;

  return {
    totalWins,
    totalLosses,
    totalGamesPlayed,
    winPct: totalGamesPlayed > 0 ? totalWins / totalGamesPlayed : 0,
    possiblePointsToDate,
    maxPossibleSeasonPoints,
    totalInternalSeasonGames,
  };
}

const VAULT_STORAGE_KEY = 'nba_wins_leagues_vault_v1';
const ACTIVE_LEAGUE_ID_KEY = 'nba_wins_active_league_id_v1';
const LEGACY_SINGLE_KEY = 'nba_wins_league_v1';

function normalizeImportedLeague(raw: any): LeagueData | null {
  if (!raw || !Array.isArray(raw.players) || !Array.isArray(raw.picks)) {
    return null;
  }
  const now = new Date().toISOString();
  const numPlayers = Number(raw.numPlayers) || raw.players.length || 3;
  return {
    id: typeof raw.id === 'string' && raw.id ? raw.id : `league_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: typeof raw.name === 'string' && raw.name.trim() ? raw.name.trim() : `NBA Wins League (${raw.season === '2026' ? '2025-26' : '2026-27'})`,
    season: raw.season === '2026' ? '2026' : '2027',
    numPlayers,
    players: raw.players.map((p: any, idx: number) => ({
      id: typeof p.id === 'number' ? p.id : idx,
      name: typeof p.name === 'string' && p.name.trim() ? p.name.trim() : `Player ${idx + 1}`,
      colorIndex: typeof p.colorIndex === 'number' ? p.colorIndex % PLAYER_COLORS.length : idx % PLAYER_COLORS.length,
      teamIds: Array.isArray(p.teamIds) ? p.teamIds.map(Number) : [],
    })),
    snakeOrder: Array.isArray(raw.snakeOrder) && raw.snakeOrder.length === 30
      ? raw.snakeOrder.map(Number)
      : generateSnakeOrder(numPlayers),
    picks: raw.picks.map((pk: any, idx: number) => ({
      pickNumber: typeof pk.pickNumber === 'number' ? pk.pickNumber : idx + 1,
      playerIndex: Number(pk.playerIndex),
      teamId: Number(pk.teamId),
    })),
    status: raw.status === 'ACTIVE' || raw.picks.length === 30 ? 'ACTIVE' : 'DRAFTING',
    gameNotes: raw.gameNotes && typeof raw.gameNotes === 'object' ? raw.gameNotes : {},
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : now,
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : now,
  };
}

function createSampleLeague(): LeagueData {
  const numPlayers = 3;
  const snakeOrder = generateSnakeOrder(numPlayers);
  const sampleNames = ['Vedran', 'Luka', 'Nikola'];
  const players: LeaguePlayer[] = sampleNames.map((name, idx) => ({
    id: idx,
    name,
    colorIndex: idx,
    teamIds: [],
  }));

  const draftPriorityIds = [
    18, 1, 7, 16, 3, 26, 17, 24, 10, 21,
    14, 27, 23, 28, 9, 25, 13, 22, 4, 30,
    11, 29, 6, 8, 5, 2, 12, 19, 20, 15
  ];

  const picks: DraftPick[] = draftPriorityIds.map((teamId, pickIdx) => {
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
    id: `league_sample_${Date.now()}`,
    name: 'Championship Trio 2026-27',
    season: '2027',
    numPlayers,
    players,
    snakeOrder,
    picks,
    status: 'ACTIVE',
    gameNotes: {},
    createdAt: now,
    updatedAt: now,
  };
}

// ============================================================================
// 3. MAIN APPLICATION COMPONENT
// ============================================================================
export default function NbaGameApp() {
  const isStandalone = useMemo(() => {
    try {
      return window.self === window.top;
    } catch {
      return false;
    }
  }, []);

  // Load saved leagues vault from localStorage (and migrate legacy single-league key if present)
  const [leagues, setLeagues] = useState<LeagueData[]>(() => {
    try {
      const vaultStr = localStorage.getItem(VAULT_STORAGE_KEY);
      let loaded: LeagueData[] = [];
      if (vaultStr) {
        const parsed = JSON.parse(vaultStr);
        if (Array.isArray(parsed)) {
          loaded = parsed.map(normalizeImportedLeague).filter((l): l is LeagueData => Boolean(l));
        }
      }
      const legacyStr = localStorage.getItem(LEGACY_SINGLE_KEY);
      if (legacyStr) {
        const legacyLeague = normalizeImportedLeague(JSON.parse(legacyStr));
        if (legacyLeague && !loaded.some((l) => l.id === legacyLeague.id)) {
          loaded = [legacyLeague, ...loaded];
        }
      }
      return loaded;
    } catch {
      return [];
    }
  });

  const [activeLeagueId, setActiveLeagueId] = useState<string | null>(() => {
    try {
      const savedId = localStorage.getItem(ACTIVE_LEAGUE_ID_KEY);
      if (savedId) return savedId;
      const vaultStr = localStorage.getItem(VAULT_STORAGE_KEY);
      if (vaultStr) {
        const parsed = JSON.parse(vaultStr);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].id) {
          return parsed[0].id;
        }
      }
      return null;
    } catch {
      return null;
    }
  });

  const league = useMemo(
    () => leagues.find((l) => l.id === activeLeagueId) || null,
    [leagues, activeLeagueId]
  );

  // Sync leagues vault to localStorage & also keep legacy key updated with active league
  useEffect(() => {
    try {
      localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(leagues));
      if (activeLeagueId) {
        localStorage.setItem(ACTIVE_LEAGUE_ID_KEY, activeLeagueId);
      } else {
        localStorage.removeItem(ACTIVE_LEAGUE_ID_KEY);
      }
      if (league) {
        localStorage.setItem(LEGACY_SINGLE_KEY, JSON.stringify(league));
      }
    } catch (e) {
      console.error('Failed to save leagues to localStorage:', e);
    }
  }, [leagues, activeLeagueId, league]);

  const updateActiveLeague = (updater: (current: LeagueData) => LeagueData) => {
    if (!league) return;
    const updated = {
      ...updater(league),
      updatedAt: new Date().toISOString(),
    };
    setLeagues((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
  };

  // Setup Form State (when creating a new league)
  const [setupLeagueName, setSetupLeagueName] = useState<string>('2026-27 NBA Wins Pool');
  const [numPlayersInput, setNumPlayersInput] = useState<number>(3);
  const [playerNamesInput, setPlayerNamesInput] = useState<string[]>([
    'Player 1',
    'Player 2',
    'Player 3',
    'Player 4',
    'Player 5',
    'Player 6',
  ]);
  const [seasonInput, setSeasonInput] = useState<string>('2027');

  // Draft Filter State
  const [confFilter, setConfFilter] = useState<'ALL' | 'East' | 'West'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [draftTab, setDraftTab] = useState<'AVAILABLE' | 'BOARD'>('AVAILABLE');

  // Modals & UI Feedback State
  const [showLeagueVault, setShowLeagueVault] = useState<boolean>(false);
  const [showSharedSavedHub, setShowSharedSavedHub] = useState<boolean>(() => {
    try {
      const path = window.location.pathname.replace(/\/+$/, '');
      return path === '/vibecoding/nbagame/saved';
    } catch {
      return false;
    }
  });
  const [sharedSlots, setSharedSlots] = useState<SharedSlotItem[]>([]);
  const [loadingSharedSlots, setLoadingSharedSlots] = useState<boolean>(false);
  const [savingToSlotNumber, setSavingToSlotNumber] = useState<number | null>(null);
  const [selectedSaveSlot, setSelectedSaveSlot] = useState<number>(1);
  const [saveSlotPassword, setSaveSlotPassword] = useState<string>('');
  const [unlockingSlotNumber, setUnlockingSlotNumber] = useState<number | null>(null);
  const [unlockPasswordInput, setUnlockPasswordInput] = useState<string>('');
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [deletingSlotNumber, setDeletingSlotNumber] = useState<number | null>(null);
  const [deleteSlotPasswordInput, setDeleteSlotPasswordInput] = useState<string>('');
  // Remember unlocked passwords by slot number during session so updates are 1-click
  const [sessionUnlockedPasswords, setSessionUnlockedPasswords] = useState<Record<number, string>>({});

  const [showDraftRecap, setShowDraftRecap] = useState<boolean>(false);
  const [showHowItWorks, setShowHowItWorks] = useState<boolean>(false);
  const [showPasteJsonModal, setShowPasteJsonModal] = useState<boolean>(false);
  const [pasteJsonText, setPasteJsonText] = useState<string>('');
  const [editingLeagueId, setEditingLeagueId] = useState<string | null>(null);
  const [editingNameValue, setEditingNameValue] = useState<string>('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedLeagueId, setCopiedLeagueId] = useState<string | null>(null);
  const [copiedSharedUrl, setCopiedSharedUrl] = useState<boolean>(false);

  // Historical Games State & Filters
  const [showHistoricalSection, setShowHistoricalSection] = useState<boolean>(true);
  const [historicalGames, setHistoricalGames] = useState<HistoricalGame[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);
  const [historyPlayerFilter, setHistoryPlayerFilter] = useState<string>('ALL'); // 'ALL' or player index string
  const [historyWinnerOnly, setHistoryWinnerOnly] = useState<boolean>(false);
  const [historyTeamFilter, setHistoryTeamFilter] = useState<string>('ALL'); // 'ALL' or team ID string
  const [historyMatchupType, setHistoryMatchupType] = useState<'ALL' | 'PVP' | 'INTERNAL' | 'NOTES'>('ALL');
  const [historySearch, setHistorySearch] = useState<string>('');
  const [historySortOrder, setHistorySortOrder] = useState<'DESC' | 'ASC'>('DESC');
  const [historyVisibleCount, setHistoryVisibleCount] = useState<number>(30);
  const [editingNoteGameId, setEditingNoteGameId] = useState<string | null>(null);
  const [editingNoteText, setEditingNoteText] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Toggle /vibecoding/nbagame/saved URL & modal cleanly
  const openSharedSavedHub = () => {
    setShowSharedSavedHub(true);
    try {
      if (!window.location.pathname.endsWith('/saved')) {
        window.history.pushState({}, '', '/vibecoding/nbagame/saved');
      }
    } catch {
      // Ignore history push error
    }
    fetchSharedSavedSlots();
  };

  const closeSharedSavedHub = () => {
    setShowSharedSavedHub(false);
    setUnlockingSlotNumber(null);
    setUnlockError(null);
    setDeletingSlotNumber(null);
    try {
      if (window.location.pathname.endsWith('/saved')) {
        window.history.pushState({}, '', '/vibecoding/nbagame');
      }
    } catch {
      // Ignore history push error
    }
  };

  useEffect(() => {
    const onPopState = () => {
      const path = window.location.pathname.replace(/\/+$/, '');
      setShowSharedSavedHub(path === '/vibecoding/nbagame/saved');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Fetch the 10 shared saved slots from /api/nbagame/saved (with local fallback)
  const fetchSharedSavedSlots = async () => {
    setLoadingSharedSlots(true);
    try {
      const res = await fetch('/api/nbagame/saved');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data?.slots)) {
          setSharedSlots(data.slots);
          localStorage.setItem(SHARED_SLOTS_FALLBACK_KEY, JSON.stringify(data.slots));
          setLoadingSharedSlots(false);
          return data.slots as SharedSlotItem[];
        }
      }
    } catch {
      // Fallback to local storage if offline or static host
    }

    try {
      const raw = localStorage.getItem(SHARED_SLOTS_FALLBACK_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setSharedSlots(parsed);
          setLoadingSharedSlots(false);
          return parsed as SharedSlotItem[];
        }
      }
    } catch {
      // Ignore parse error
    }
    setLoadingSharedSlots(false);
    return [];
  };

  useEffect(() => {
    fetchSharedSavedSlots().then((loadedSlots) => {
      // Check if URL has ?slot=N for quick deep-link loading
      try {
        const params = new URLSearchParams(window.location.search);
        const slotParam = Number(params.get('slot'));
        if (slotParam >= 1 && slotParam <= MAX_SHARED_SLOTS && loadedSlots.length > 0) {
          const targetSlot = loadedSlots.find((s) => s.slotNumber === slotParam);
          if (targetSlot) {
            if (!targetSlot.hasPassword && targetSlot.league) {
              const normalized = normalizeImportedLeague(targetSlot.league);
              if (normalized) {
                setLeagues((prev) => {
                  const rest = prev.filter((l) => l.id !== normalized.id);
                  return [normalized, ...rest];
                });
                setActiveLeagueId(normalized.id);
                setSelectedSaveSlot(slotParam);
                showToast(`Loaded Slot #${slotParam}: "${normalized.name}"`);
              }
            } else if (targetSlot.hasPassword) {
              setShowSharedSavedHub(true);
              setUnlockingSlotNumber(slotParam);
            }
          }
        }
      } catch {
        // Ignore URL param error
      }
    });
  }, []);

  // Auto-select matching slot number when active league changes
  useEffect(() => {
    if (!league) return;
    const matched = sharedSlots.find((s) => s.summary?.id === league.id);
    if (matched) {
      setSelectedSaveSlot(matched.slotNumber);
    } else {
      // Default to first empty slot (1..10), or Slot 1 if all full
      const occupiedNums = new Set(sharedSlots.map((s) => s.slotNumber));
      for (let i = 1; i <= MAX_SHARED_SLOTS; i++) {
        if (!occupiedNums.has(i)) {
          setSelectedSaveSlot(i);
          break;
        }
      }
    }
  }, [league?.id, sharedSlots]);

  const handleLoadSharedSlot = (slot: SharedSlotItem) => {
    if (slot.hasPassword && !slot.league) {
      setUnlockingSlotNumber(slot.slotNumber);
      setUnlockPasswordInput(sessionUnlockedPasswords[slot.slotNumber] || '');
      setUnlockError(null);
      return;
    }
    if (slot.league) {
      const normalized = normalizeImportedLeague(slot.league);
      if (normalized) {
        setLeagues((prev) => {
          const rest = prev.filter((l) => l.id !== normalized.id);
          return [normalized, ...rest];
        });
        setActiveLeagueId(normalized.id);
        setSelectedSaveSlot(slot.slotNumber);
        closeSharedSavedHub();
        showToast(`Loaded Slot #${slot.slotNumber}: "${normalized.name}"`);
      }
    }
  };

  const handleUnlockAndLoadSlot = async (slotNumber: number) => {
    setUnlockError(null);
    const pwd = unlockPasswordInput.trim();
    try {
      const res = await fetch('/api/nbagame/saved/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotNumber, password: pwd }),
      });
      const data = await res.json();
      if (!res.ok) {
        setUnlockError(data?.error || 'Incorrect password.');
        return;
      }
      if (data?.league) {
        const normalized = normalizeImportedLeague(data.league);
        if (normalized) {
          setSessionUnlockedPasswords((prev) => ({ ...prev, [slotNumber]: pwd }));
          setLeagues((prev) => {
            const rest = prev.filter((l) => l.id !== normalized.id);
            return [normalized, ...rest];
          });
          setActiveLeagueId(normalized.id);
          setSelectedSaveSlot(slotNumber);
          setUnlockingSlotNumber(null);
          setUnlockPasswordInput('');
          closeSharedSavedHub();
          showToast(`Unlocked & loaded Slot #${slotNumber}: "${normalized.name}"!`);
        }
      }
    } catch {
      setUnlockError('Unable to verify password right now.');
    }
  };

  const handleSaveLeagueToSharedSlot = async (
    targetSlotNumber: number,
    targetLeague: LeagueData,
    passwordInput?: string
  ) => {
    setSavingToSlotNumber(targetSlotNumber);
    const pwd =
      passwordInput !== undefined
        ? passwordInput.trim()
        : saveSlotPassword.trim() || sessionUnlockedPasswords[targetSlotNumber] || '';

    try {
      const res = await fetch('/api/nbagame/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slotNumber: targetSlotNumber,
          league: targetLeague,
          currentPassword: pwd,
          ...(saveSlotPassword.trim() ? { newPassword: saveSlotPassword.trim() } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data?.error || `Could not save to Slot #${targetSlotNumber}.`);
        setSavingToSlotNumber(null);
        return;
      }
      if (Array.isArray(data?.slots)) {
        setSharedSlots(data.slots);
        localStorage.setItem(SHARED_SLOTS_FALLBACK_KEY, JSON.stringify(data.slots));
      }
      if (pwd) {
        setSessionUnlockedPasswords((prev) => ({ ...prev, [targetSlotNumber]: pwd }));
      }
      setSaveSlotPassword('');
      showToast(
        `Saved "${targetLeague.name}" to Shared Slot #${targetSlotNumber} (/vibecoding/nbagame/saved)!`
      );
    } catch {
      // Offline / static fallback
      const now = new Date().toISOString();
      const newSlot: SharedSlotItem = {
        slotNumber: targetSlotNumber,
        hasPassword: Boolean(pwd),
        savedAt: now,
        summary: {
          id: targetLeague.id,
          name: targetLeague.name,
          season: targetLeague.season,
          numPlayers: targetLeague.numPlayers,
          status: targetLeague.status,
          picksCount: targetLeague.picks.length,
          players: targetLeague.players.map((p) => ({
            id: p.id,
            name: p.name,
            colorIndex: p.colorIndex,
            teamCount: p.teamIds.length,
          })),
          updatedAt: now,
        },
        league: targetLeague,
      };
      setSharedSlots((prev) => {
        const next = [...prev.filter((s) => s.slotNumber !== targetSlotNumber), newSlot].sort(
          (a, b) => a.slotNumber - b.slotNumber
        );
        localStorage.setItem(SHARED_SLOTS_FALLBACK_KEY, JSON.stringify(next));
        return next;
      });
      showToast(`Saved "${targetLeague.name}" to Slot #${targetSlotNumber}!`);
    } finally {
      setSavingToSlotNumber(null);
    }
  };

  const handleClearSharedSlot = async (slotNumber: number, passwordToUse?: string) => {
    const pwd =
      passwordToUse !== undefined
        ? passwordToUse.trim()
        : deleteSlotPasswordInput.trim() || sessionUnlockedPasswords[slotNumber] || '';
    try {
      const res = await fetch(`/api/nbagame/saved/${slotNumber}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pwd }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data?.error || `Incorrect password to clear Slot #${slotNumber}.`);
        return;
      }
      if (Array.isArray(data?.slots)) {
        setSharedSlots(data.slots);
        localStorage.setItem(SHARED_SLOTS_FALLBACK_KEY, JSON.stringify(data.slots));
      }
      setDeletingSlotNumber(null);
      setDeleteSlotPasswordInput('');
      showToast(`Cleared Shared Slot #${slotNumber}.`);
    } catch {
      setSharedSlots((prev) => {
        const next = prev.filter((s) => s.slotNumber !== slotNumber);
        localStorage.setItem(SHARED_SLOTS_FALLBACK_KEY, JSON.stringify(next));
        return next;
      });
      setDeletingSlotNumber(null);
      showToast(`Cleared Slot #${slotNumber}.`);
    }
  };

  // Live Data State
  const [standings, setStandings] = useState<Record<number, TeamStanding>>({});
  const [upcomingGames, setUpcomingGames] = useState<DaySchedule[]>([]);
  const [loadingLive, setLoadingLive] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [apiNotice, setApiNotice] = useState<string | null>(null);

  // ============================================================================
  // 4. FETCH LIVE NBA STANDINGS, 3-DAY SCHEDULE & ALL HISTORICAL SEASON GAMES
  // ============================================================================
  const fetchLiveNbaData = async (targetSeason?: string) => {
    const activeSeason = targetSeason || league?.season || seasonInput || '2027';
    setLoadingLive(true);
    setLoadingHistory(true);
    setApiNotice(null);

    const parsedStandings: Record<number, TeamStanding> = {};
    NBA_TEAMS.forEach((t) => {
      parsedStandings[t.id] = { wins: 0, losses: 0, gamesPlayed: 0, winPct: 0 };
    });

    // 1. Fetch All 30 Teams' Regular Season Schedules to build the complete Historical Games Log
    //    AND accurately compute standings from completed regular season games!
    try {
      const gameMap = new Map<string, HistoricalGame>();
      const scheduleWins: Record<number, { wins: number; losses: number }> = {};
      NBA_TEAMS.forEach((t) => {
        scheduleWins[t.id] = { wins: 0, losses: 0 };
      });

      await Promise.all(
        NBA_TEAMS.map(async (team) => {
          try {
            const url = `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${team.espnId}/schedule?season=${activeSeason}&seasontype=2`;
            const res = await fetch(url);
            const data = await res.json();
            const events = data?.events || [];

            events.forEach((ev: any) => {
              const comp = ev.competitions?.[0];
              const isCompleted = Boolean(comp?.status?.type?.completed);
              if (!isCompleted) return;

              const eventId = String(ev.id);
              if (gameMap.has(eventId)) return;

              const competitors = comp?.competitors || [];
              const homeComp =
                competitors.find((c: any) => c.homeAway === 'home') || competitors[0];
              const awayComp =
                competitors.find((c: any) => c.homeAway === 'away') || competitors[1];

              const homeTeam = NBA_TEAMS.find(
                (t) =>
                  t.espnId === String(homeComp?.team?.id || homeComp?.id) ||
                  t.abbr === String(homeComp?.team?.abbreviation || '').toUpperCase()
              );
              const awayTeam = NBA_TEAMS.find(
                (t) =>
                  t.espnId === String(awayComp?.team?.id || awayComp?.id) ||
                  t.abbr === String(awayComp?.team?.abbreviation || '').toUpperCase()
              );

              if (!homeTeam || !awayTeam) return;

              const homeScore = Number(
                homeComp?.score?.value ?? homeComp?.score?.displayValue ?? homeComp?.score ?? 0
              );
              const awayScore = Number(
                awayComp?.score?.value ?? awayComp?.score?.displayValue ?? awayComp?.score ?? 0
              );

              const homeWon =
                homeComp?.winner === true ||
                (homeComp?.winner === undefined && homeScore > awayScore);

              const winnerTeam = homeWon ? homeTeam : awayTeam;
              const loserTeam = homeWon ? awayTeam : homeTeam;
              const winnerScore = homeWon ? homeScore : awayScore;
              const loserScore = homeWon ? awayScore : homeScore;

              const dateObj = new Date(ev.date);
              const dateFormatted = dateObj.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              gameMap.set(eventId, {
                id: eventId,
                dateIso: ev.date,
                dateFormatted,
                statusDetail:
                  comp?.status?.type?.shortDetail ||
                  comp?.status?.type?.detail ||
                  'Final',
                awayTeam,
                homeTeam,
                awayScore,
                homeScore,
                winnerTeam,
                loserTeam,
                winnerScore,
                loserScore,
              });
            });
          } catch {
            // Ignore single team schedule fetch failure
          }
        })
      );

      const allHistorical = Array.from(gameMap.values()).sort(
        (a, b) => new Date(b.dateIso).getTime() - new Date(a.dateIso).getTime()
      );

      // Tally wins & losses from all deduplicated completed regular-season games
      allHistorical.forEach((g) => {
        if (scheduleWins[g.winnerTeam.id]) {
          scheduleWins[g.winnerTeam.id].wins += 1;
        }
        if (scheduleWins[g.loserTeam.id]) {
          scheduleWins[g.loserTeam.id].losses += 1;
        }
      });

      NBA_TEAMS.forEach((t) => {
        const w = scheduleWins[t.id].wins;
        const l = scheduleWins[t.id].losses;
        const gp = w + l;
        parsedStandings[t.id] = {
          wins: w,
          losses: l,
          gamesPlayed: gp,
          winPct: gp > 0 ? w / gp : 0,
        };
      });

      setHistoricalGames(allHistorical);
    } catch (err) {
      console.warn('Could not load historical schedule from ESPN:', err);
    } finally {
      setLoadingHistory(false);
    }

    // 2. Also check ESPN Standings API (overrides if standings API has higher GP)
    try {
      const standingsUrl = `https://site.api.espn.com/apis/v2/sports/basketball/nba/standings?season=${activeSeason}`;
      const res = await fetch(standingsUrl);
      const data = await res.json();

      const extractEntries = (node: any) => {
        if (node?.standings?.entries) {
          node.standings.entries.forEach((entry: any) => {
            const espnId = String(entry.team?.id || '');
            const abbr = String(entry.team?.abbreviation || '').toUpperCase();
            const matchedTeam = NBA_TEAMS.find(
              (t) => t.espnId === espnId || t.abbr === abbr
            );

            if (matchedTeam && entry.stats) {
              const winsStat = entry.stats.find((s: any) => s.name === 'wins');
              const lossesStat = entry.stats.find((s: any) => s.name === 'losses');
              const wins = Number(winsStat?.value ?? 0);
              const losses = Number(lossesStat?.value ?? 0);
              const gp = wins + losses;
              if (gp >= (parsedStandings[matchedTeam.id]?.gamesPlayed || 0)) {
                parsedStandings[matchedTeam.id] = {
                  wins,
                  losses,
                  gamesPlayed: gp,
                  winPct: gp > 0 ? wins / gp : 0,
                };
              }
            }
          });
        }
        if (node?.children) {
          node.children.forEach(extractEntries);
        }
      };

      extractEntries(data);
    } catch {
      // Standings already populated from schedule games
    }

    setStandings(parsedStandings);

    // 3. Fetch Next 3 Days Schedule from ESPN Scoreboard API
    try {
      const daysToFetch: { dateObj: Date; dateCode: string; label: string }[] = [];
      const now = new Date();
      for (let offset = 0; offset < 3; offset++) {
        const d = new Date(now);
        d.setDate(now.getDate() + offset);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const label =
          offset === 0
            ? 'Today'
            : offset === 1
            ? 'Tomorrow'
            : d.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              });
        daysToFetch.push({ dateObj: d, dateCode: `${yyyy}${mm}${dd}`, label });
      }

      const scheduleResults = await Promise.all(
        daysToFetch.map(async (dayInfo) => {
          const sbUrl = `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=${dayInfo.dateCode}`;
          const sbRes = await fetch(sbUrl);
          const sbData = await sbRes.json();

          const games: ScheduleGame[] = (sbData.events || [])
            .map((ev: any) => {
              const comp = ev.competitions?.[0];
              const competitors = comp?.competitors || [];
              const homeComp =
                competitors.find((c: any) => c.homeAway === 'home') || competitors[0];
              const awayComp =
                competitors.find((c: any) => c.homeAway === 'away') || competitors[1];

              const homeTeam = NBA_TEAMS.find(
                (t) =>
                  t.espnId === String(homeComp?.team?.id) ||
                  t.abbr === String(homeComp?.team?.abbreviation).toUpperCase()
              );
              const awayTeam = NBA_TEAMS.find(
                (t) =>
                  t.espnId === String(awayComp?.team?.id) ||
                  t.abbr === String(awayComp?.team?.abbreviation).toUpperCase()
              );

              return {
                id: String(ev.id),
                status:
                  ev.status?.type?.shortDetail ||
                  ev.status?.type?.detail ||
                  'Scheduled',
                isCompleted: Boolean(ev.status?.type?.completed),
                awayTeam: awayTeam || {
                  id: 0,
                  espnId: '0',
                  abbr: awayComp?.team?.abbreviation || 'TBD',
                  name: awayComp?.team?.displayName || 'Away',
                  conf: 'East',
                  div: 'Atlantic',
                },
                homeTeam: homeTeam || {
                  id: 0,
                  espnId: '0',
                  abbr: homeComp?.team?.abbreviation || 'TBD',
                  name: homeComp?.team?.displayName || 'Home',
                  conf: 'East',
                  div: 'Atlantic',
                },
                awayScore: awayComp?.score ?? null,
                homeScore: homeComp?.score ?? null,
              };
            })
            .filter((g: ScheduleGame) => g.awayTeam.id !== 0 || g.homeTeam.id !== 0);

          return {
            dateLabel: dayInfo.label,
            dateCode: dayInfo.dateCode,
            games,
          };
        })
      );

      setUpcomingGames(scheduleResults);
    } catch (err) {
      console.warn('Could not load schedule from ESPN API:', err);
    }

    setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setLoadingLive(false);
  };

  useEffect(() => {
    fetchLiveNbaData(league?.season || seasonInput);
  }, [league?.season]);

  // ============================================================================
  // 5. LEAGUE CREATION, DRAFT, NOTES & VAULT MANAGEMENT ACTIONS
  // ============================================================================
  const handleStartDraft = () => {
    const cleanName = setupLeagueName.trim() || `NBA Wins League (${seasonInput === '2027' ? '2026-27' : '2025-26'})`;
    const players: LeaguePlayer[] = Array.from({ length: numPlayersInput }, (_, i) => ({
      id: i,
      name: playerNamesInput[i]?.trim() || `Player ${i + 1}`,
      colorIndex: i % PLAYER_COLORS.length,
      teamIds: [],
    }));
    const snakeOrder = generateSnakeOrder(numPlayersInput);
    const now = new Date().toISOString();

    const newLeague: LeagueData = {
      id: `league_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name: cleanName,
      season: seasonInput,
      numPlayers: numPlayersInput,
      players,
      snakeOrder,
      picks: [],
      status: 'DRAFTING',
      gameNotes: {},
      createdAt: now,
      updatedAt: now,
    };

    setLeagues((prev) => [newLeague, ...prev]);
    setActiveLeagueId(newLeague.id);
    showToast(`Created "${cleanName}" — Snake Draft started!`);
  };

  const handleLoadSampleLeague = () => {
    const sample = createSampleLeague();
    setLeagues((prev) => [sample, ...prev]);
    setActiveLeagueId(sample.id);
    setShowLeagueVault(false);
    showToast(`Loaded sample league "${sample.name}"!`);
  };

  const handleRandomizeDraftOrder = () => {
    const activeNames = playerNamesInput.slice(0, numPlayersInput);
    for (let i = activeNames.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [activeNames[i], activeNames[j]] = [activeNames[j], activeNames[i]];
    }
    setPlayerNamesInput([...activeNames, ...playerNamesInput.slice(numPlayersInput)]);
    showToast('Draft order randomized!');
  };

  const handleDraftTeam = (teamId: number) => {
    if (!league || league.status !== 'DRAFTING') return;
    const currentPickIndex = league.picks.length;
    if (currentPickIndex >= 30) return;

    const currentPlayerIndex = league.snakeOrder[currentPickIndex];
    const updatedPicks: DraftPick[] = [
      ...league.picks,
      {
        pickNumber: currentPickIndex + 1,
        playerIndex: currentPlayerIndex,
        teamId,
      },
    ];

    const updatedPlayers = league.players.map((p, idx) =>
      idx === currentPlayerIndex ? { ...p, teamIds: [...p.teamIds, teamId] } : p
    );

    const isComplete = updatedPicks.length === 30;
    updateActiveLeague((curr) => ({
      ...curr,
      players: updatedPlayers,
      picks: updatedPicks,
      status: isComplete ? 'ACTIVE' : 'DRAFTING',
    }));

    if (isComplete) {
      showToast('All 30 NBA franchises drafted! League is now ACTIVE.');
    }
  };

  const handleUndoLastPick = () => {
    if (!league || league.picks.length === 0) return;
    const lastPick = league.picks[league.picks.length - 1];
    const updatedPicks = league.picks.slice(0, -1);
    const updatedPlayers = league.players.map((p, idx) =>
      idx === lastPick.playerIndex
        ? { ...p, teamIds: p.teamIds.filter((id) => id !== lastPick.teamId) }
        : p
    );

    updateActiveLeague((curr) => ({
      ...curr,
      players: updatedPlayers,
      picks: updatedPicks,
      status: 'DRAFTING',
    }));
  };

  const handleSaveGameNote = (gameId: string, noteText: string) => {
    if (!league) return;
    const trimmed = noteText.trim();
    updateActiveLeague((curr) => {
      const nextNotes = { ...(curr.gameNotes || {}) };
      if (trimmed) {
        nextNotes[gameId] = trimmed;
      } else {
        delete nextNotes[gameId];
      }
      return {
        ...curr,
        gameNotes: nextNotes,
      };
    });
    setEditingNoteGameId(null);
    showToast(trimmed ? 'Game note saved to league.' : 'Game note removed.');
  };

  const handleDeleteLeague = (targetId: string) => {
    const target = leagues.find((l) => l.id === targetId);
    const remaining = leagues.filter((l) => l.id !== targetId);
    setLeagues(remaining);
    if (activeLeagueId === targetId) {
      setActiveLeagueId(remaining.length > 0 ? remaining[0].id : null);
    }
    setConfirmDeleteId(null);
    if (target) {
      showToast(`Deleted "${target.name}".`);
    }
  };

  const handleDuplicateLeague = (source: LeagueData) => {
    const now = new Date().toISOString();
    const copy: LeagueData = {
      ...source,
      id: `league_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name: `${source.name} (Copy)`,
      createdAt: now,
      updatedAt: now,
    };
    setLeagues((prev) => [copy, ...prev]);
    setActiveLeagueId(copy.id);
    showToast(`Duplicated "${source.name}"!`);
  };

  const handleSaveRename = (targetId: string) => {
    const trimmed = editingNameValue.trim();
    if (!trimmed) {
      setEditingLeagueId(null);
      return;
    }
    setLeagues((prev) =>
      prev.map((l) =>
        l.id === targetId ? { ...l, name: trimmed, updatedAt: new Date().toISOString() } : l
      )
    );
    setEditingLeagueId(null);
    showToast('League name saved.');
  };

  const exportLeagueJson = (targetLeague: LeagueData) => {
    const slug = targetLeague.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(targetLeague, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute(
      'download',
      `${slug || 'nba-league'}-${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
    showToast(`Exported "${targetLeague.name}" JSON file.`);
  };

  const exportAllLeaguesVaultJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(
        JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), leagues }, null, 2)
      );
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute(
      'download',
      `nba-all-leagues-backup-${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
    showToast(`Exported all ${leagues.length} leagues to backup file.`);
  };

  const copyLeagueJsonToClipboard = (targetLeague: LeagueData) => {
    navigator.clipboard.writeText(JSON.stringify(targetLeague, null, 2));
    setCopiedLeagueId(targetLeague.id);
    setTimeout(() => {
      setCopiedLeagueId((prev) => (prev === targetLeague.id ? null : prev));
    }, 2000);
    showToast(`Copied "${targetLeague.name}" JSON to clipboard!`);
  };

  const processImportedJsonPayload = (parsed: any) => {
    const rawList = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed?.leagues)
      ? parsed.leagues
      : [parsed];

    const normalizedList = rawList
      .map(normalizeImportedLeague)
      .filter((l): l is LeagueData => Boolean(l));

    if (normalizedList.length === 0) {
      showToast('Invalid league JSON format. Please check the file or text.');
      return false;
    }

    setLeagues((prev) => {
      const importedIds = new Set(normalizedList.map((l) => l.id));
      const rest = prev.filter((l) => !importedIds.has(l.id));
      return [...normalizedList, ...rest];
    });

    setActiveLeagueId(normalizedList[0].id);
    setShowLeagueVault(false);
    setShowPasteJsonModal(false);
    setPasteJsonText('');
    showToast(
      normalizedList.length === 1
        ? `Imported league "${normalizedList[0].name}"!`
        : `Imported ${normalizedList.length} leagues into your vault!`
    );
    return true;
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(String(event.target?.result || ''));
        processImportedJsonPayload(parsed);
      } catch {
        showToast('Could not parse JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // ============================================================================
  // 6. DERIVED DATA FOR DRAFT, SCOREBOARD & HISTORICAL GAMES
  // ============================================================================
  const draftedTeamIds = useMemo(
    () => new Set(league?.picks.map((p) => p.teamId) || []),
    [league]
  );

  const teamOwnerMap = useMemo(() => {
    const map: Record<
      number,
      { id: number; name: string; colorClass: string; badgeClass: string; textClass: string }
    > = {};
    if (!league) return map;
    league.players.forEach((p, idx) => {
      const c = PLAYER_COLORS[p.colorIndex % PLAYER_COLORS.length];
      p.teamIds.forEach((tId) => {
        map[tId] = {
          id: idx,
          name: p.name,
          colorClass: c.bg,
          badgeClass: c.badge,
          textClass: c.text,
        };
      });
    });
    return map;
  }, [league]);

  const leaderboard = useMemo(() => {
    if (!league) return [];
    return league.players
      .map((player) => {
        const stats = calculatePlayerPossiblePoints(player.teamIds, standings);
        const color = PLAYER_COLORS[player.colorIndex % PLAYER_COLORS.length];
        return {
          ...player,
          ...stats,
          color,
        };
      })
      .sort(
        (a, b) =>
          b.totalWins - a.totalWins ||
          b.winPct - a.winPct ||
          b.maxPossibleSeasonPoints - a.maxPossibleSeasonPoints
      );
  }, [league, standings]);

  // Enriched & Filtered Historical Games
  const filteredHistoricalGames = useMemo(() => {
    const notesMap = league?.gameNotes || {};

    const list = historicalGames.filter((game) => {
      const awayOwner = teamOwnerMap[game.awayTeam.id];
      const homeOwner = teamOwnerMap[game.homeTeam.id];
      const winnerOwner = teamOwnerMap[game.winnerTeam.id];
      const isInternal = awayOwner && homeOwner && awayOwner.id === homeOwner.id;
      const customNote = notesMap[game.id] || '';

      // 1. Player Filter
      if (historyPlayerFilter !== 'ALL') {
        const targetPlayerIdx = Number(historyPlayerFilter);
        if (historyWinnerOnly) {
          if (!winnerOwner || winnerOwner.id !== targetPlayerIdx) return false;
        } else {
          const awayMatches = awayOwner && awayOwner.id === targetPlayerIdx;
          const homeMatches = homeOwner && homeOwner.id === targetPlayerIdx;
          if (!awayMatches && !homeMatches) return false;
        }
      }

      // 2. Team Filter
      if (historyTeamFilter !== 'ALL') {
        const targetTeamId = Number(historyTeamFilter);
        if (game.awayTeam.id !== targetTeamId && game.homeTeam.id !== targetTeamId) {
          return false;
        }
      }

      // 3. Matchup Type Filter
      if (historyMatchupType === 'INTERNAL' && !isInternal) return false;
      if (historyMatchupType === 'PVP' && isInternal) return false;
      if (historyMatchupType === 'NOTES' && !customNote) return false;

      // 4. Search Query
      if (historySearch.trim()) {
        const q = historySearch.toLowerCase();
        const hay = [
          game.awayTeam.name,
          game.awayTeam.abbr,
          game.homeTeam.name,
          game.homeTeam.abbr,
          awayOwner?.name || '',
          homeOwner?.name || '',
          game.dateFormatted,
          customNote,
        ]
          .join(' ')
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }

      return true;
    });

    if (historySortOrder === 'ASC') {
      return [...list].reverse();
    }
    return list;
  }, [
    historicalGames,
    teamOwnerMap,
    league?.gameNotes,
    historyPlayerFilter,
    historyWinnerOnly,
    historyTeamFilter,
    historyMatchupType,
    historySearch,
    historySortOrder,
  ]);

  const navigateBackToVibeCoding = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
      e.preventDefault();
      window.history.pushState({}, '', '/vibecoding?app=nbagame');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  // ============================================================================
  // 7. SHARED TOP PERSISTENT LEAGUE VAULT BAR + MODALS
  // ============================================================================
  const renderTopVaultBar = () => (
    <div className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {isStandalone && (
            <a
              href="/vibecoding?app=nbagame"
              onClick={navigateBackToVibeCoding}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition border border-slate-700"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Vibe Coding</span>
            </a>
          )}

          <div className="flex items-center gap-2">
            <span className="text-lg">🏀</span>
            <span className="font-black text-xs sm:text-sm tracking-tight text-white uppercase">
              NBA Wins Pool
            </span>
          </div>

          {league && (
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-800 text-xs">
              <span className="text-slate-400">Active League:</span>
              <span className="font-bold text-orange-400 truncate max-w-[200px]">
                {league.name}
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-300 font-medium">
                {league.status === 'ACTIVE'
                  ? 'Active (30/30)'
                  : `Drafting (${league.picks.length}/30)`}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {leagues.length > 0 && (
            <select
              aria-label="Switch saved league"
              value={activeLeagueId || ''}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '__NEW__') {
                  setActiveLeagueId(null);
                } else {
                  setActiveLeagueId(val);
                  const found = leagues.find((l) => l.id === val);
                  if (found) showToast(`Switched to "${found.name}"`);
                }
              }}
              className="bg-slate-800 border border-slate-700 text-white text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-orange-500 max-w-[190px] sm:max-w-[240px] truncate"
            >
              {!activeLeagueId && <option value="">— Creating New League —</option>}
              {leagues.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name} ({l.status === 'ACTIVE' ? `${l.numPlayers}P Active` : `Pick ${l.picks.length}/30`})
                </option>
              ))}
              <option value="__NEW__">+ Create New League...</option>
            </select>
          )}

          <button
            type="button"
            onClick={openSharedSavedHub}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-orange-500/20 to-amber-500/20 hover:from-orange-500/30 hover:to-amber-500/30 text-orange-300 text-xs font-black border border-orange-500/40 transition cursor-pointer"
            title="Open /vibecoding/nbagame/saved — 10 shared game slots anyone can load without local JSON files"
          >
            <Cloud className="w-3.5 h-3.5 text-orange-400" />
            <span>/saved Games ({sharedSlots.length}/10)</span>
          </button>

          <button
            type="button"
            onClick={() => setShowLeagueVault(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition cursor-pointer"
          >
            <FolderOpen className="w-3.5 h-3.5 text-sky-400" />
            <span>Local JSON Vault ({leagues.length})</span>
          </button>

          {league && (
            <button
              type="button"
              onClick={() => setActiveLeagueId(null)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition cursor-pointer"
              title="Start another league (your current league stays saved)"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New League</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const renderModalsAndToast = () => (
    <>
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 border border-orange-500/50 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-semibold animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Shared 10-Slot Saved Games Hub Modal (/vibecoding/nbagame/saved) */}
      {showSharedSavedHub && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-5xl w-full p-5 sm:p-6 shadow-2xl max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-md bg-orange-500/20 border border-orange-500/40 text-orange-300 text-[11px] font-black font-mono">
                    /vibecoding/nbagame/saved
                  </span>
                  <span className="text-xs font-bold text-emerald-400">
                    · {sharedSlots.length} of {MAX_SHARED_SLOTS} Slots Used
                  </span>
                </div>
                <h2 className="text-lg sm:text-2xl font-black text-white flex items-center gap-2 mt-1">
                  <Cloud className="w-5 h-5 text-orange-400" />
                  <span>Shared Saved Games (Up to 10 Leagues)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Anyone can visit <span className="text-slate-200 font-mono">/vibecoding/nbagame/saved</span> to load a league in 1 click without needing a local JSON file. Optional password lock available per slot.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const url = `${window.location.origin}/vibecoding/nbagame/saved`;
                    navigator.clipboard.writeText(url);
                    setCopiedSharedUrl(true);
                    setTimeout(() => setCopiedSharedUrl(false), 2000);
                    showToast('Copied /vibecoding/nbagame/saved link!');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition cursor-pointer"
                >
                  {copiedSharedUrl ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Share2 className="w-3.5 h-3.5 text-orange-400" />
                  )}
                  <span>{copiedSharedUrl ? 'Copied Link!' : 'Copy /saved Link'}</span>
                </button>

                <button
                  type="button"
                  onClick={fetchSharedSavedSlots}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
                  title="Refresh shared slots"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingSharedSlots ? 'animate-spin' : ''}`} />
                </button>

                <button
                  type="button"
                  onClick={closeSharedSavedHub}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Save Active League Banner */}
            {league ? (
              <div className="bg-slate-950/90 border border-orange-500/40 rounded-2xl p-4 mb-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-orange-400">
                      Save Active League to Shared Slot (1–10)
                    </div>
                    <div className="text-sm font-black text-white mt-0.5">
                      {league.name}{' '}
                      <span className="text-xs font-medium text-slate-400">
                        ({league.season === '2027' ? '2026-27' : '2025-26'} · {league.numPlayers} Players ·{' '}
                        {league.status === 'ACTIVE' ? '30/30 Complete' : `Pick ${league.picks.length}/30`})
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      aria-label="Choose slot number 1 to 10"
                      value={selectedSaveSlot}
                      onChange={(e) => setSelectedSaveSlot(Number(e.target.value))}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-orange-500"
                    >
                      {Array.from({ length: MAX_SHARED_SLOTS }, (_, i) => i + 1).map((num) => {
                        const existing = sharedSlots.find((s) => s.slotNumber === num);
                        return (
                          <option key={num} value={num}>
                            Slot #{num}: {existing ? `${existing.summary.name} (Overwrite/Update)` : 'Empty Slot'}
                          </option>
                        );
                      })}
                    </select>

                    <div className="relative flex items-center">
                      <KeyRound className="w-3.5 h-3.5 text-slate-500 absolute left-3 pointer-events-none" />
                      <input
                        type="text"
                        value={saveSlotPassword}
                        onChange={(e) => setSaveSlotPassword(e.target.value)}
                        placeholder="Optional password (blank = open)"
                        className="bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 w-52"
                      />
                    </div>

                    <button
                      type="button"
                      disabled={savingToSlotNumber !== null}
                      onClick={() => handleSaveLeagueToSharedSlot(selectedSaveSlot, league)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-lg shadow-orange-500/20"
                    >
                      <Cloud className="w-3.5 h-3.5" />
                      <span>
                        {savingToSlotNumber === selectedSaveSlot
                          ? 'Saving...'
                          : `Save to Slot #${selectedSaveSlot}`}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 mb-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
                <span>
                  💡 Select any of the 10 saved league slots below to load it immediately — no JSON download required!
                </span>
                <button
                  type="button"
                  onClick={() => {
                    closeSharedSavedHub();
                    setShowLeagueVault(true);
                  }}
                  className="text-sky-400 hover:text-sky-300 font-bold underline cursor-pointer"
                >
                  Or open Local JSON Vault →
                </button>
              </div>
            )}

            {/* 10 Slots Grid */}
            <div className="overflow-y-auto flex-1 pr-1 grid grid-cols-1 md:grid-cols-2 gap-3">
              {Array.from({ length: MAX_SHARED_SLOTS }, (_, i) => i + 1).map((slotNum) => {
                const slot = sharedSlots.find((s) => s.slotNumber === slotNum);
                const isUnlocking = unlockingSlotNumber === slotNum;
                const isDeleting = deletingSlotNumber === slotNum;
                const isActiveLoaded = Boolean(league && slot && slot.summary.id === league.id);

                if (!slot) {
                  return (
                    <div
                      key={slotNum}
                      className="p-4 rounded-2xl bg-slate-950/50 border border-dashed border-slate-800 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-mono font-black text-xs text-slate-500">
                          #{slotNum}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-400">
                            Slot #{slotNum} — Empty
                          </div>
                          <div className="text-[11px] text-slate-600">
                            Available for any league (1-click load)
                          </div>
                        </div>
                      </div>

                      {league && (
                        <button
                          type="button"
                          disabled={savingToSlotNumber !== null}
                          onClick={() => handleSaveLeagueToSharedSlot(slotNum, league)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-orange-500 hover:text-slate-950 text-slate-300 text-xs font-bold border border-slate-700 transition cursor-pointer shrink-0"
                        >
                          + Save Here
                        </button>
                      )}
                    </div>
                  );
                }

                return (
                  <div
                    key={slotNum}
                    className={`p-4 rounded-2xl border transition flex flex-col justify-between gap-3 ${
                      isActiveLoaded
                        ? 'bg-slate-800/90 border-orange-500/60 shadow-lg'
                        : 'bg-slate-950/85 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="px-2 py-1 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-400 font-mono font-black text-xs shrink-0">
                            #{slotNum}
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-black text-sm sm:text-base text-white truncate">
                                {slot.summary.name}
                              </h3>
                              {isActiveLoaded && (
                                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-orange-500 text-slate-950">
                                  Loaded
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-400 mt-0.5">
                              <span>
                                {slot.summary.season === '2027' ? '2026-27' : '2025-26'}
                              </span>
                              <span>·</span>
                              <span>{slot.summary.numPlayers} Players</span>
                              <span>·</span>
                              <span
                                className={
                                  slot.summary.status === 'ACTIVE'
                                    ? 'text-emerald-400 font-semibold'
                                    : 'text-amber-400 font-semibold'
                                }
                              >
                                {slot.summary.status === 'ACTIVE'
                                  ? '30/30 Active'
                                  : `Draft ${slot.summary.picksCount}/30`}
                              </span>
                            </div>
                          </div>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border shrink-0 ${
                            slot.hasPassword
                              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                              : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          }`}
                        >
                          {slot.hasPassword ? (
                            <>
                              <Lock className="w-3 h-3" />
                              <span>Password</span>
                            </>
                          ) : (
                            <>
                              <Unlock className="w-3 h-3" />
                              <span>Open</span>
                            </>
                          )}
                        </span>
                      </div>

                      {/* Players pills */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                        {slot.summary.players.map((p) => (
                          <span
                            key={p.id}
                            className="text-[11px] text-slate-300 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md"
                          >
                            {p.name} ({p.teamCount})
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Inline Password Unlock Box if Locked & Clicked */}
                    {isUnlocking && (
                      <div className="bg-slate-900 border border-amber-500/40 rounded-xl p-2.5 space-y-2">
                        <div className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                          <KeyRound className="w-3.5 h-3.5" />
                          <span>Enter password to unlock Slot #{slotNum}:</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="password"
                            value={unlockPasswordInput}
                            onChange={(e) => setUnlockPasswordInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleUnlockAndLoadSlot(slotNum);
                            }}
                            placeholder="League password..."
                            autoFocus
                            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white flex-1 focus:outline-none focus:border-orange-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleUnlockAndLoadSlot(slotNum)}
                            className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs cursor-pointer"
                          >
                            Unlock &amp; Load
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setUnlockingSlotNumber(null);
                              setUnlockError(null);
                            }}
                            className="px-2 py-1.5 rounded-lg bg-slate-800 text-slate-400 text-xs cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                        {unlockError && (
                          <div className="text-[11px] text-rose-400 font-semibold">
                            {unlockError}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Inline Delete Confirmation */}
                    {isDeleting && (
                      <div className="bg-slate-900 border border-rose-500/40 rounded-xl p-2.5 space-y-2">
                        <div className="text-[11px] font-bold text-rose-300">
                          Clear Slot #{slotNum} ({slot.summary.name})?
                        </div>
                        <div className="flex items-center gap-2">
                          {slot.hasPassword && (
                            <input
                              type="password"
                              value={deleteSlotPasswordInput}
                              onChange={(e) => setDeleteSlotPasswordInput(e.target.value)}
                              placeholder="Slot password..."
                              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white flex-1 focus:outline-none"
                            />
                          )}
                          <button
                            type="button"
                            onClick={() => handleClearSharedSlot(slotNum)}
                            className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer"
                          >
                            Confirm Clear
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDeletingSlotNumber(null);
                              setDeleteSlotPasswordInput('');
                            }}
                            className="px-2 py-1 rounded-lg bg-slate-800 text-slate-400 text-xs cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Slot Action Buttons */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                      <span className="text-[10px] text-slate-500">
                        Saved{' '}
                        {new Date(slot.savedAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleLoadSharedSlot(slot)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer inline-flex items-center gap-1.5 ${
                            isActiveLoaded
                              ? 'bg-orange-500 text-slate-950'
                              : 'bg-slate-800 hover:bg-orange-500 hover:text-slate-950 text-white border border-slate-700'
                          }`}
                        >
                          {slot.hasPassword && !slot.league ? (
                            <>
                              <Lock className="w-3 h-3" />
                              <span>Unlock &amp; Load</span>
                            </>
                          ) : (
                            <span>{isActiveLoaded ? 'Reload Slot' : 'Load League'}</span>
                          )}
                        </button>

                        {league && (
                          <button
                            type="button"
                            onClick={() => handleSaveLeagueToSharedSlot(slotNum, league)}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition cursor-pointer"
                            title={`Save current active league ("${league.name}") into Slot #${slotNum}`}
                          >
                            Update Slot
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            const slotUrl = `${window.location.origin}/vibecoding/nbagame/saved?slot=${slotNum}`;
                            navigator.clipboard.writeText(slotUrl);
                            showToast(`Copied direct link to Slot #${slotNum}!`);
                          }}
                          className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
                          title={`Copy direct link to Slot #${slotNum}`}
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeletingSlotNumber(slotNum)}
                          className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-slate-700 transition cursor-pointer"
                          title="Clear slot"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Saved Leagues Vault Modal */}
      {showLeagueVault && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full p-6 shadow-2xl max-h-[88vh] flex flex-col">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-orange-400" />
                  <span>Local Browser Vault &amp; JSON Backup ({leagues.length})</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  All leagues and custom game notes are automatically saved in your browser. You can also export/import local JSON files or share via /vibecoding/nbagame/saved.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowLeagueVault(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveLeagueId(null);
                    setShowLeagueVault(false);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-xs transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New League</span>
                </button>

                <button
                  type="button"
                  onClick={handleLoadSampleLeague}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Load Sample 3P League</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-sky-400" />
                  <span>Import JSON File</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportFile}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setShowLeagueVault(false);
                    setShowPasteJsonModal(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition cursor-pointer"
                >
                  <FileJson className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Paste League JSON</span>
                </button>

                {leagues.length > 0 && (
                  <button
                    type="button"
                    onClick={exportAllLeaguesVaultJson}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-orange-400" />
                    <span>Backup All ({leagues.length})</span>
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-y-auto space-y-3 pr-1 flex-1">
              {leagues.length === 0 ? (
                <div className="text-center py-12 bg-slate-950/60 border border-slate-800 rounded-2xl p-6">
                  <div className="text-3xl mb-2">🏀</div>
                  <div className="text-sm font-bold text-white mb-1">
                    No Saved Leagues Yet
                  </div>
                  <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
                    Start a new snake draft below, import a league JSON file from a friend, or load a sample 3-player league to explore the live dashboard.
                  </p>
                  <button
                    type="button"
                    onClick={handleLoadSampleLeague}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 text-slate-950 font-black text-xs hover:bg-orange-400 transition"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Load Sample Completed League</span>
                  </button>
                </div>
              ) : (
                leagues.map((item) => {
                  const isCurrent = item.id === activeLeagueId;
                  const isEditing = editingLeagueId === item.id;
                  const isConfirmingDelete = confirmDeleteId === item.id;

                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border transition ${
                        isCurrent
                          ? 'bg-slate-800/90 border-orange-500/60 shadow-lg'
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          {isEditing ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={editingNameValue}
                                onChange={(e) => setEditingNameValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveRename(item.id);
                                  if (e.key === 'Escape') setEditingLeagueId(null);
                                }}
                                autoFocus
                                className="bg-slate-900 border border-orange-500 rounded-lg px-2.5 py-1 text-sm font-bold text-white focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => handleSaveRename(item.id)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 text-xs font-bold"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingLeagueId(null)}
                                className="px-2 py-1 rounded-lg bg-slate-800 text-slate-400 text-xs"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-black text-base text-white truncate">
                                {item.name}
                              </h3>
                              {isCurrent && (
                                <span className="text-[11px] font-bold text-orange-400">
                                  · Active
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingLeagueId(item.id);
                                  setEditingNameValue(item.name);
                                }}
                                className="text-slate-500 hover:text-slate-300 p-1"
                                title="Rename league"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}

                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400 mt-1">
                            <span>
                              {item.season === '2027' ? '2026-27 Season' : '2025-26 Season'}
                            </span>
                            <span>·</span>
                            <span>{item.numPlayers} Players</span>
                            <span>·</span>
                            <span
                              className={
                                item.status === 'ACTIVE'
                                  ? 'text-emerald-400 font-semibold'
                                  : 'text-amber-400 font-semibold'
                              }
                            >
                              {item.status === 'ACTIVE'
                                ? 'Draft Complete (30/30)'
                                : `In Draft (${item.picks.length}/30 Picks)`}
                            </span>
                            <span>·</span>
                            <span>
                              Updated{' '}
                              {new Date(item.updatedAt).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5 mt-2">
                            {item.players.map((p) => (
                              <span
                                key={p.id}
                                className="text-[11px] text-slate-300 bg-slate-900/90 border border-slate-800 px-2 py-0.5 rounded-md"
                              >
                                {p.name} ({p.teamIds.length})
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveLeagueId(item.id);
                              setShowLeagueVault(false);
                              showToast(`Loaded "${item.name}"`);
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                              isCurrent
                                ? 'bg-orange-500 text-slate-950'
                                : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                            }`}
                          >
                            {isCurrent ? 'Viewing' : 'Open League'}
                          </button>

                          <button
                            type="button"
                            onClick={() => copyLeagueJsonToClipboard(item)}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
                            title="Copy League JSON to clipboard"
                          >
                            {copiedLeagueId === item.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => exportLeagueJson(item)}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
                            title="Download League JSON file"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDuplicateLeague(item)}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition cursor-pointer"
                            title="Duplicate this league"
                          >
                            Clone
                          </button>

                          {isConfirmingDelete ? (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleDeleteLeague(item.id)}
                                className="px-2.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer"
                              >
                                Confirm
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-2 py-1.5 rounded-xl bg-slate-800 text-slate-400 text-xs cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(item.id)}
                              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-slate-700 transition cursor-pointer"
                              title="Delete league"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Paste JSON Modal */}
      {showPasteJsonModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h3 className="text-lg font-black text-white">
                Paste League JSON Code
              </h3>
              <button
                type="button"
                onClick={() => setShowPasteJsonModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Paste the JSON copied from another device or friend below to immediately store and open the league:
            </p>
            <textarea
              rows={8}
              value={pasteJsonText}
              onChange={(e) => setPasteJsonText(e.target.value)}
              placeholder='{"name": "2026-27 NBA Wins Pool", "season": "2027", ...}'
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-orange-500 mb-4"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPasteJsonModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  try {
                    const parsed = JSON.parse(pasteJsonText);
                    processImportedJsonPayload(parsed);
                  } catch {
                    showToast('Invalid JSON text. Please check and try again.');
                  }
                }}
                className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-black"
              >
                Import &amp; Save League
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  // ============================================================================
  // VIEW A: LEAGUE SETUP & SAVED LEAGUES LAUNCHER (When no active league is selected)
  // ============================================================================
  if (!league) {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col">
        {renderTopVaultBar()}
        {renderModalsAndToast()}

        <div className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left / Main Column: Create New League Form */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-2xl shadow-lg shadow-orange-500/20">
                  🏀
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                    NBA Franchise Wins League
                  </h1>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    Snake Draft all 30 NBA teams · 1 Regular Season Win = 1 Point
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  1. League Name (Stored in your League Vault)
                </label>
                <input
                  type="text"
                  value={setupLeagueName}
                  onChange={(e) => setSetupLeagueName(e.target.value)}
                  placeholder="e.g., 2026-27 Boys NBA Wins Pool"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-orange-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  2. Target NBA Season
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSeasonInput('2027')}
                    className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                      seasonInput === '2027'
                        ? 'bg-orange-500/15 border-orange-500 text-white'
                        : 'bg-slate-800/60 border-slate-700/70 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <div className="font-bold text-sm">2026–27 Season</div>
                    <div className="text-xs opacity-75">Full Season &amp; Game History</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSeasonInput('2026')}
                    className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                      seasonInput === '2026'
                        ? 'bg-orange-500/15 border-orange-500 text-white'
                        : 'bg-slate-800/60 border-slate-700/70 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <div className="font-bold text-sm">2025–26 Season</div>
                    <div className="text-xs opacity-75">Completed Season &amp; Game Log</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  3. Number of Players (Evenly Divides 30 NBA Teams)
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {[2, 3, 5, 6].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setNumPlayersInput(n)}
                      className={`py-3 px-4 rounded-xl border font-bold transition text-center cursor-pointer ${
                        numPlayersInput === n
                          ? 'bg-orange-500 text-slate-950 border-orange-400 shadow-lg shadow-orange-500/20'
                          : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="text-lg">{n} Players</div>
                      <div className="text-[11px] font-medium opacity-80">
                        {30 / n} Teams Each
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                    4. Player Names &amp; Draft Order (Pick #1 to #{numPlayersInput})
                  </label>
                  <button
                    type="button"
                    onClick={handleRandomizeDraftOrder}
                    className="inline-flex items-center gap-1 text-xs font-bold text-orange-400 hover:text-orange-300 transition cursor-pointer"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>Randomize Order</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Array.from({ length: numPlayersInput }).map((_, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2"
                    >
                      <span
                        className={`w-6 h-6 rounded-full bg-gradient-to-br ${PLAYER_COLORS[idx].bg} text-slate-950 font-black text-xs flex items-center justify-center shrink-0`}
                      >
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={playerNamesInput[idx]}
                        onChange={(e) => {
                          const copy = [...playerNamesInput];
                          copy[idx] = e.target.value;
                          setPlayerNamesInput(copy);
                        }}
                        placeholder={`Player ${idx + 1}`}
                        className="bg-transparent text-sm font-medium text-white w-full focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleStartDraft}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-base tracking-wide shadow-xl shadow-orange-500/20 transition cursor-pointer"
              >
                Start Snake Draft (30 Picks) →
              </button>
            </div>
          </div>

          {/* Right Column: Quick Access to Shared 10 Slots (/saved) & Local Vault */}
          <div className="lg:col-span-5 space-y-5">
            {/* Shared 10-Slot Directory Card */}
            <div className="bg-slate-900/90 border border-orange-500/40 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-orange-400" />
                  <span>Shared Saved Games ({sharedSlots.length}/10)</span>
                </h2>
                <button
                  type="button"
                  onClick={openSharedSavedHub}
                  className="text-xs font-bold text-orange-400 hover:text-orange-300 cursor-pointer"
                >
                  Open /saved →
                </button>
              </div>
              <p className="text-xs text-slate-400 mb-3">
                Stored in <span className="font-mono text-slate-200">/vibecoding/nbagame/saved</span> — load any of the 10 shared leagues in 1 click without needing a local JSON file:
              </p>

              <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
                {sharedSlots.map((slot) => (
                  <div
                    key={slot.slotNumber}
                    onClick={() => handleLoadSharedSlot(slot)}
                    className="p-3 rounded-2xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-orange-500/50 transition cursor-pointer flex items-center justify-between gap-2.5 group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="px-2 py-0.5 rounded-md bg-orange-500/15 border border-orange-500/30 text-orange-400 font-mono font-black text-xs shrink-0">
                        #{slot.slotNumber}
                      </span>
                      <div className="min-w-0">
                        <div className="font-bold text-xs sm:text-sm text-white group-hover:text-orange-300 truncate flex items-center gap-1.5">
                          <span className="truncate">{slot.summary.name}</span>
                          {slot.hasPassword && <Lock className="w-3 h-3 text-amber-400 shrink-0" />}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {slot.summary.season === '2027' ? '2026-27' : '2025-26'} · {slot.summary.numPlayers}P ·{' '}
                          {slot.summary.status === 'ACTIVE'
                            ? 'Active'
                            : `Pick ${slot.summary.picksCount}/30`}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-orange-400 group-hover:translate-x-0.5 transition shrink-0">
                      {slot.hasPassword ? 'Unlock →' : 'Load →'}
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={openSharedSavedHub}
                className="w-full mt-3 py-2.5 px-3 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 text-orange-300 font-black text-xs border border-orange-500/30 transition inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Cloud className="w-3.5 h-3.5" />
                <span>View All 10 Shared Slots (/vibecoding/nbagame/saved)</span>
              </button>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-sky-400" />
                  <span>Local Browser Vault &amp; JSON ({leagues.length})</span>
                </h2>
                {leagues.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowLeagueVault(true)}
                    className="text-xs font-bold text-orange-400 hover:text-orange-300"
                  >
                    Manage All →
                  </button>
                )}
              </div>

              {leagues.length === 0 ? (
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 text-center">
                  <p className="text-xs text-slate-400 mb-3">
                    Every league you create or import is also stored locally in your browser and can be exported as JSON anytime.
                  </p>
                  <button
                    type="button"
                    onClick={handleLoadSampleLeague}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-slate-700 transition inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Try Sample Completed 3-Player League</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[240px] overflow-y-auto pr-1">
                  {leagues.map((saved) => (
                    <div
                      key={saved.id}
                      onClick={() => setActiveLeagueId(saved.id)}
                      className="p-3.5 rounded-2xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-orange-500/40 transition cursor-pointer flex items-center justify-between gap-3 group"
                    >
                      <div className="min-w-0">
                        <div className="font-bold text-sm text-white group-hover:text-orange-300 truncate">
                          {saved.name}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {saved.season === '2027' ? '2026-27' : '2025-26'} · {saved.numPlayers} Players ·{' '}
                          <span
                            className={
                              saved.status === 'ACTIVE' ? 'text-emerald-400' : 'text-amber-400'
                            }
                          >
                            {saved.status === 'ACTIVE'
                              ? 'Active'
                              : `Pick ${saved.picks.length}/30`}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-orange-400 shrink-0" />
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2.5 mt-4 pt-4 border-t border-slate-800">
                <label className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 cursor-pointer transition">
                  <Upload className="w-3.5 h-3.5 text-sky-400" />
                  <span>Import JSON File</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportFile}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => setShowPasteJsonModal(true)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 cursor-pointer transition"
                >
                  <FileJson className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Paste JSON Code</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // VIEW B: SNAKE DRAFT ROOM (When league.status === 'DRAFTING')
  // ============================================================================
  if (league.status === 'DRAFTING') {
    const currentPickNum = league.picks.length + 1;
    const currentPlayerIdx = league.snakeOrder[league.picks.length];
    const currentPlayer = league.players[currentPlayerIdx];
    const currentRound = Math.floor(league.picks.length / league.numPlayers) + 1;

    const availableTeams = NBA_TEAMS.filter((t) => !draftedTeamIds.has(t.id))
      .filter((t) => confFilter === 'ALL' || t.conf === confFilter)
      .filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.abbr.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.div.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return (
      <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col">
        {renderTopVaultBar()}
        {renderModalsAndToast()}

        <div className="max-w-7xl w-full mx-auto p-4 md:p-8 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-orange-400">
                  Live Snake Draft · {league.name}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white mt-0.5">
                Round {currentRound} of {30 / league.numPlayers} · Pick #{currentPickNum}{' '}
                <span className="text-slate-500 text-lg font-semibold">/ 30</span>
              </h1>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={handleUndoLastPick}
                disabled={league.picks.length === 0}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-bold text-slate-200 border border-slate-700 transition cursor-pointer"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span>Undo Last Pick</span>
              </button>

              <button
                type="button"
                onClick={openSharedSavedHub}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-xs font-black text-orange-300 border border-orange-500/40 transition cursor-pointer"
              >
                <Cloud className="w-3.5 h-3.5" />
                <span>Save to /saved Slot</span>
              </button>

              <button
                type="button"
                onClick={() => exportLeagueJson(league)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Draft JSON</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-5 mb-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${
                    PLAYER_COLORS[currentPlayer.colorIndex].bg
                  } flex items-center justify-center text-slate-950 font-black text-xl shadow-lg`}
                >
                  #{currentPickNum}
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider font-bold text-slate-400">
                    On The Clock Now
                  </div>
                  <div className="text-xl md:text-2xl font-black text-white">
                    {currentPlayer.name}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {league.snakeOrder
                  .slice(league.picks.length, league.picks.length + 6)
                  .map((pIdx, i) => {
                    const p = league.players[pIdx];
                    const pickNo = league.picks.length + i + 1;
                    return (
                      <div
                        key={pickNo}
                        className={`px-3 py-2 rounded-xl border shrink-0 ${
                          i === 0
                            ? 'bg-orange-500/20 border-orange-500 text-white'
                            : 'bg-slate-950/70 border-slate-800 text-slate-400'
                        }`}
                      >
                        <div className="text-[10px] font-bold uppercase">Pick #{pickNo}</div>
                        <div className="text-xs font-bold truncate max-w-[90px]">{p.name}</div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            {league.players.map((p) => {
              const c = PLAYER_COLORS[p.colorIndex];
              return (
                <div
                  key={p.id}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-bold text-sm truncate ${c.text}`}>{p.name}</span>
                    <span className="text-xs font-semibold text-slate-400">
                      {p.teamIds.length}/{30 / league.numPlayers}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {p.teamIds.map((tId) => {
                      const t = NBA_TEAMS.find((team) => team.id === tId);
                      if (!t) return null;
                      return (
                        <div
                          key={tId}
                          className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg px-1.5 py-1 text-[11px] font-bold"
                          title={t.name}
                        >
                          <img
                            src={getLogoUrl(t.abbr)}
                            alt={t.abbr}
                            className="w-4 h-4 object-contain"
                          />
                          <span>{t.abbr}</span>
                        </div>
                      );
                    })}
                    {p.teamIds.length === 0 && (
                      <span className="text-xs text-slate-600 italic">No picks yet</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDraftTab('AVAILABLE')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  draftTab === 'AVAILABLE'
                    ? 'bg-orange-500 text-slate-950'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                Available Teams ({30 - league.picks.length})
              </button>
              <button
                type="button"
                onClick={() => setDraftTab('BOARD')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  draftTab === 'BOARD'
                    ? 'bg-orange-500 text-slate-950'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                Draft Board ({league.picks.length} Picked)
              </button>
            </div>

            {draftTab === 'AVAILABLE' && (
              <div className="flex flex-wrap items-center gap-2">
                {(['ALL', 'East', 'West'] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setConfFilter(c)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                      confFilter === c
                        ? 'bg-slate-800 border-orange-500 text-white'
                        : 'bg-slate-900/70 border-slate-800 text-slate-400'
                    }`}
                  >
                    {c === 'ALL' ? 'All Conferences' : `${c}ern Conf`}
                  </button>
                ))}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search team or division..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            )}
          </div>

          {draftTab === 'AVAILABLE' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {availableTeams.map((team) => {
                const rec = standings[team.id] || { wins: 0, losses: 0, gamesPlayed: 0, winPct: 0 };
                return (
                  <div
                    key={team.id}
                    className="bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-orange-500/50 rounded-2xl p-4 flex flex-col justify-between transition group"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={getLogoUrl(team.abbr)}
                        alt={team.name}
                        className="w-11 h-11 object-contain shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-sm text-white leading-tight truncate">
                          {team.name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {team.conf} · {team.div}
                        </div>
                        {rec.gamesPlayed > 0 && (
                          <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                            Record: {rec.wins}-{rec.losses}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDraftTeam(team.id)}
                      className="w-full py-2 rounded-xl bg-slate-800 group-hover:bg-orange-500 group-hover:text-slate-950 text-xs font-extrabold text-slate-200 transition cursor-pointer"
                    >
                      Draft to {currentPlayer.name}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              {league.picks.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm">
                  No teams drafted yet.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {league.picks.map((pick) => {
                    const player = league.players[pick.playerIndex];
                    const team = NBA_TEAMS.find((t) => t.id === pick.teamId);
                    const c = PLAYER_COLORS[player.colorIndex];
                    if (!team) return null;
                    return (
                      <div
                        key={pick.pickNumber}
                        className={`p-3 rounded-xl bg-slate-950 border ${c.border}`}
                      >
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                          <span>Pick #{pick.pickNumber}</span>
                          <span className={`font-bold ${c.text}`}>{player.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <img
                            src={getLogoUrl(team.abbr)}
                            alt={team.abbr}
                            className="w-6 h-6 object-contain"
                          />
                          <span className="font-bold text-xs text-white truncate">
                            {team.name}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============================================================================
  // VIEW C: ACTIVE LEAGUE DASHBOARD (Scoreboard, Possible Points, 3-Day Schedule & Historical Games Log)
  // ============================================================================
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col">
      {renderTopVaultBar()}
      {renderModalsAndToast()}

      <div className="max-w-7xl w-full mx-auto p-4 md:p-8 space-y-8 flex-1">
        {/* HEADER BAR */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-2xl shadow-lg shadow-orange-500/20 shrink-0">
              🏆
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl md:text-2xl font-black text-white">
                  {league.name}
                </h1>
                <button
                  type="button"
                  onClick={() => {
                    setEditingLeagueId(league.id);
                    setEditingNameValue(league.name);
                    setShowLeagueVault(true);
                  }}
                  className="text-slate-400 hover:text-white p-1 rounded"
                  title="Rename or manage league"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-400">
                {league.numPlayers} Players · {30 / league.numPlayers} NBA Teams per Player ·{' '}
                {historicalGames.length} Completed Season Games ·{' '}
                {lastUpdated ? `Synced at ${lastUpdated}` : 'Syncing live data...'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              aria-label="Select NBA season"
              value={league.season}
              onChange={(e) => {
                const nextSeason = e.target.value;
                updateActiveLeague((curr) => ({ ...curr, season: nextSeason }));
                fetchLiveNbaData(nextSeason);
              }}
              className="bg-slate-800 border border-slate-700 text-xs font-bold text-white rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500"
            >
              <option value="2027">2026–27 Season</option>
              <option value="2026">2025–26 Season</option>
            </select>

            <button
              type="button"
              onClick={() => fetchLiveNbaData(league.season)}
              disabled={loadingLive}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingLive ? 'animate-spin' : ''}`} />
              <span>{loadingLive ? 'Refreshing...' : 'Refresh Scores'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowHistoricalSection((prev) => !prev);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                showHistoricalSection
                  ? 'bg-orange-500/20 border-orange-500/50 text-orange-300'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>
                {showHistoricalSection ? 'Hide' : 'Show'} Historical Games ({historicalGames.length})
              </span>
            </button>

            <button
              type="button"
              onClick={() => setShowDraftRecap(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition cursor-pointer"
            >
              <ListOrdered className="w-3.5 h-3.5 text-orange-400" />
              <span>Draft Board</span>
            </button>

            <button
              type="button"
              onClick={openSharedSavedHub}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-xs font-black text-orange-300 border border-orange-500/40 transition cursor-pointer"
              title="Save or load from the 10 shared slots at /vibecoding/nbagame/saved"
            >
              <Cloud className="w-3.5 h-3.5 text-orange-400" />
              <span>Save / Load Slot ({sharedSlots.length}/10)</span>
            </button>

            <button
              type="button"
              onClick={() => copyLeagueJsonToClipboard(league)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition cursor-pointer"
              title="Copy shareable league JSON to clipboard"
            >
              {copiedLeagueId === league.id ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-sky-400" />
              )}
              <span>{copiedLeagueId === league.id ? 'Copied JSON!' : 'Copy JSON'}</span>
            </button>

            <button
              type="button"
              onClick={() => exportLeagueJson(league)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>

        {apiNotice && (
          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-200 px-4 py-3 rounded-2xl text-xs flex flex-wrap items-center justify-between gap-2">
            <span>ℹ️ {apiNotice}</span>
          </div>
        )}

        {/* SECTION 1: LEAGUE STANDINGS & POSSIBLE POINTS ENGINE */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-orange-400" />
                <span>Standings &amp; Possible Points Leaderboard</span>
              </h2>
              <p className="text-xs text-slate-400">
                1 NBA Regular Season Win = 1 Point. Internal head-to-head matchups between a player&apos;s own teams automatically deduct 1 guaranteed loss from Possible Points.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowHowItWorks(!showHowItWorks)}
              className="text-xs font-bold text-orange-400 hover:text-orange-300 underline cursor-pointer"
            >
              {showHowItWorks ? 'Hide Formula' : 'How Possible Points Work?'}
            </button>
          </div>

          {showHowItWorks && (
            <div className="mb-4 p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs text-slate-300 space-y-1.5">
              <div className="font-bold text-white">
                📐 Possible Points Math (Accounting for Head-to-Head Collisions):
              </div>
              <p>
                • When two teams owned by the <strong>same player</strong> play each other, it is mathematically impossible for both teams to win that game (1 Win + 1 Loss max).
              </p>
              <p>
                • <strong>Possible Points (To Date)</strong> = Total games played by a player&apos;s teams minus estimated internal head-to-head games already played between their own teams.
              </p>
              <p>
                • <strong>Max Season Ceiling</strong> = Current Wins + Remaining scheduled games minus remaining internal head-to-head collisions (Division rivals play 4×/yr, Conference rivals ~3.6×/yr, Cross-conference 2×/yr).
              </p>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-3">Rank</th>
                  <th className="py-3 px-3">Player</th>
                  <th className="py-3 px-3 text-center">Total Wins (Pts)</th>
                  <th className="py-3 px-3 text-center">Combined Record</th>
                  <th className="py-3 px-3 text-center">Win %</th>
                  <th
                    className="py-3 px-3 text-center"
                    title="Max points possible from games played so far after deducting internal H2H losses"
                  >
                    Possible Pts (To Date)
                  </th>
                  <th
                    className="py-3 px-3 text-center"
                    title="Maximum theoretical points by end of regular season"
                  >
                    Max Season Ceiling
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {leaderboard.map((row, idx) => {
                  const leaderWins = leaderboard[0]?.totalWins || 0;
                  const gamesBack = leaderWins - row.totalWins;
                  return (
                    <tr key={row.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-3 font-black text-base">
                        {idx === 0 ? '👑 1' : `#${idx + 1}`}
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-3 h-3 rounded-full bg-gradient-to-br ${row.color.bg}`}
                          />
                          <div>
                            <div className="font-bold text-white">{row.name}</div>
                            <div className="text-[11px] text-slate-400">
                              {idx === 0 ? 'League Leader' : `${gamesBack} pts behind leader`} ·{' '}
                              {row.totalInternalSeasonGames} internal H2H games/yr
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span className="inline-block px-3 py-1 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-300 font-black text-base">
                          {row.totalWins}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-center font-semibold text-slate-200">
                        {row.totalWins}–{row.totalLosses}
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono text-slate-300">
                        {(row.winPct * 100).toFixed(1)}%
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <div className="font-bold text-sky-300">
                          {row.totalWins}{' '}
                          <span className="text-slate-500 font-normal">/</span>{' '}
                          {row.possiblePointsToDate}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          from {row.totalGamesPlayed} team GP
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span className="font-bold text-emerald-400">
                          {row.maxPossibleSeasonPoints}
                        </span>
                        <span className="text-[11px] text-slate-500 block">max pts</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 2: DETAILED PLAYER ROSTERS & INDIVIDUAL TEAM BREAKDOWN */}
        <div>
          <h2 className="text-lg md:text-xl font-black text-white mb-4">
            📋 Player Team Breakdown
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {leaderboard.map((player) => {
              const playerTeams = player.teamIds
                .map((id) => {
                  const meta = NBA_TEAMS.find((t) => t.id === id);
                  if (!meta) return null;
                  const rec = standings[id] || {
                    wins: 0,
                    losses: 0,
                    gamesPlayed: 0,
                    winPct: 0,
                  };
                  return { ...meta, ...rec };
                })
                .filter((t): t is NbaTeam & TeamStanding => Boolean(t))
                .sort((a, b) => b.wins - a.wins || b.winPct - a.winPct);

              return (
                <div
                  key={player.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                      <div>
                        <h3 className={`text-lg font-black ${player.color.text}`}>
                          {player.name}
                        </h3>
                        <div className="text-xs text-slate-400">
                          Combined: {player.totalWins}-{player.totalLosses} (
                          {(player.winPct * 100).toFixed(1)}%)
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-white">
                          {player.totalWins}
                        </div>
                        <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                          Total Wins
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {playerTeams.map((t) => (
                        <div
                          key={t.id}
                          onClick={() => {
                            setHistoryTeamFilter(String(t.id));
                            setShowHistoricalSection(true);
                          }}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800/80 transition cursor-pointer"
                          title={`Click to filter historical games for ${t.name}`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={getLogoUrl(t.abbr)}
                              alt={t.abbr}
                              className="w-7 h-7 object-contain shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="font-bold text-xs text-white truncate">
                                {t.name}
                              </div>
                              <div className="text-[10px] text-slate-500">
                                {t.conf} · {t.div}
                              </div>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="font-extrabold text-xs text-white">
                              {t.wins}W – {t.losses}L
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {(t.winPct * 100).toFixed(0)}% · {t.gamesPlayed} GP
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span>Possible Pts To Date:</span>
                    <span className="font-bold text-slate-200">
                      {player.totalWins} / {player.possiblePointsToDate} pts
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 3: NEXT 3 DAYS SCHEDULE SNEAK PEEK */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl">
          <div className="mb-5">
            <h2 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-400" />
              <span>Next 3 Days Schedule Sneak Peek</span>
            </h2>
            <p className="text-xs text-slate-400">
              See which players have teams in action over the next 3 days. Games highlighted with{' '}
              <span className="text-amber-300 font-semibold">⚡ Internal Clash</span> mean the same player owns both teams!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {upcomingGames.map((day) => (
              <div
                key={day.dateCode}
                className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4"
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-700/70">
                  <span className="font-black text-sm text-white uppercase tracking-wider">
                    {day.dateLabel}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">
                    {day.games.length} Games
                  </span>
                </div>

                {day.games.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-500">
                    No NBA games scheduled on this date.
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                    {day.games.map((game) => {
                      const awayOwner = teamOwnerMap[game.awayTeam.id];
                      const homeOwner = teamOwnerMap[game.homeTeam.id];
                      const isInternalClash =
                        awayOwner && homeOwner && awayOwner.id === homeOwner.id;

                      return (
                        <div
                          key={game.id}
                          className={`p-3 rounded-xl border transition ${
                            isInternalClash
                              ? 'bg-amber-500/10 border-amber-500/40'
                              : 'bg-slate-900/80 border-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                            <span className="font-semibold">{game.status}</span>
                            {isInternalClash && (
                              <span className="text-[10px] font-bold text-amber-300">
                                ⚡ {awayOwner.name} Internal Clash
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between py-1">
                            <div className="flex items-center gap-2">
                              <img
                                src={getLogoUrl(game.awayTeam.abbr)}
                                alt={game.awayTeam.abbr}
                                className="w-5 h-5 object-contain"
                              />
                              <span className="font-bold text-sm text-white">
                                {game.awayTeam.abbr}
                              </span>
                              {awayOwner && (
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md bg-gradient-to-r ${awayOwner.colorClass} text-slate-950`}
                                >
                                  {awayOwner.name}
                                </span>
                              )}
                            </div>
                            <span className="font-mono font-bold text-sm text-slate-200">
                              {game.awayScore ?? ''}
                            </span>
                          </div>

                          <div className="flex items-center justify-between py-1 mt-1">
                            <div className="flex items-center gap-2">
                              <img
                                src={getLogoUrl(game.homeTeam.abbr)}
                                alt={game.homeTeam.abbr}
                                className="w-5 h-5 object-contain"
                              />
                              <span className="font-bold text-sm text-white">
                                {game.homeTeam.abbr}
                              </span>
                              {homeOwner && (
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md bg-gradient-to-r ${homeOwner.colorClass} text-slate-950`}
                                >
                                  {homeOwner.name}
                                </span>
                              )}
                            </div>
                            <span className="font-mono font-bold text-sm text-slate-200">
                              {game.homeScore ?? ''}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: ALL HISTORICAL SEASON GAMES LOG WITH OWNER ATTRIBUTION, SCORE, OUTCOME & NOTES */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
                <History className="w-5 h-5 text-orange-400" />
                <span>
                  All Historical Season Games ({filteredHistoricalGames.length} of{' '}
                  {historicalGames.length})
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Complete regular-season game log showing date, away &amp; home team owners, final score, winning outcome (+1 pt attribution), and custom game notes.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowHistoricalSection((prev) => !prev)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition cursor-pointer"
            >
              {showHistoricalSection ? 'Collapse Game Log' : 'Expand Game Log'}
            </button>
          </div>

          {showHistoricalSection && (
            <>
              {/* Filter Controls Bar */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 mb-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <Filter className="w-3.5 h-3.5 text-orange-400" />
                  <span>Filter Historical Games</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {/* Player Filter */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                      Player Owner
                    </label>
                    <select
                      value={historyPlayerFilter}
                      onChange={(e) => {
                        setHistoryPlayerFilter(e.target.value);
                        setHistoryVisibleCount(30);
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="ALL">All Players ({league.numPlayers})</option>
                      {league.players.map((p, idx) => (
                        <option key={p.id} value={String(idx)}>
                          {p.name}&apos;s Teams
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Team Filter */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                      NBA Team
                    </label>
                    <select
                      value={historyTeamFilter}
                      onChange={(e) => {
                        setHistoryTeamFilter(e.target.value);
                        setHistoryVisibleCount(30);
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="ALL">All 30 NBA Franchises</option>
                      {NBA_TEAMS.slice()
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((t) => {
                          const owner = teamOwnerMap[t.id];
                          return (
                            <option key={t.id} value={String(t.id)}>
                              {t.abbr} — {t.name} {owner ? `(${owner.name})` : ''}
                            </option>
                          );
                        })}
                    </select>
                  </div>

                  {/* Matchup Type Filter */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                      Matchup Type / Notes
                    </label>
                    <select
                      value={historyMatchupType}
                      onChange={(e) => {
                        setHistoryMatchupType(
                          e.target.value as 'ALL' | 'PVP' | 'INTERNAL' | 'NOTES'
                        );
                        setHistoryVisibleCount(30);
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="ALL">All Matchups</option>
                      <option value="PVP">⚔️ Player vs. Player Only</option>
                      <option value="INTERNAL">⚡ Internal Clashes Only</option>
                      <option value="NOTES">📝 Games With Custom Notes</option>
                    </select>
                  </div>

                  {/* Date Sort Order */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                      Sort Order
                    </label>
                    <select
                      value={historySortOrder}
                      onChange={(e) => setHistorySortOrder(e.target.value as 'DESC' | 'ASC')}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="DESC">Newest Games First</option>
                      <option value="ASC">Oldest Games First</option>
                    </select>
                  </div>

                  {/* Search Input */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                      Search Team, Owner, Date, Note
                    </label>
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={historySearch}
                        onChange={(e) => {
                          setHistorySearch(e.target.value);
                          setHistoryVisibleCount(30);
                        }}
                        placeholder="e.g. BOS, Oct 24, OT..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Extra quick toggles */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs">
                  <div className="flex flex-wrap items-center gap-3">
                    {historyPlayerFilter !== 'ALL' && (
                      <label className="inline-flex items-center gap-2 text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={historyWinnerOnly}
                          onChange={(e) => setHistoryWinnerOnly(e.target.checked)}
                          className="rounded border-slate-700 text-orange-500 focus:ring-0"
                        />
                        <span>
                          Show only games <strong>won</strong> by{' '}
                          {league.players[Number(historyPlayerFilter)]?.name}
                        </span>
                      </label>
                    )}
                  </div>

                  {(historyPlayerFilter !== 'ALL' ||
                    historyTeamFilter !== 'ALL' ||
                    historyMatchupType !== 'ALL' ||
                    historySearch.trim() !== '') && (
                    <button
                      type="button"
                      onClick={() => {
                        setHistoryPlayerFilter('ALL');
                        setHistoryWinnerOnly(false);
                        setHistoryTeamFilter('ALL');
                        setHistoryMatchupType('ALL');
                        setHistorySearch('');
                      }}
                      className="text-xs font-bold text-orange-400 hover:text-orange-300 cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              </div>

              {/* Historical Games Table / List */}
              {loadingHistory ? (
                <div className="text-center py-12 text-slate-400 text-sm">
                  Loading season game history from ESPN...
                </div>
              ) : filteredHistoricalGames.length === 0 ? (
                <div className="text-center py-12 bg-slate-950/50 border border-slate-800 rounded-2xl p-6 text-slate-400 text-xs">
                  No completed historical games match your current filter criteria.
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          <th className="py-3 px-3">Date</th>
                          <th className="py-3 px-3">Away Team &amp; Owner</th>
                          <th className="py-3 px-3 text-center">Final Score</th>
                          <th className="py-3 px-3">Home Team &amp; Owner</th>
                          <th className="py-3 px-3">Outcome (+1 Win Point)</th>
                          <th className="py-3 px-3">Matchup &amp; Custom Notes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-xs sm:text-sm">
                        {filteredHistoricalGames
                          .slice(0, historyVisibleCount)
                          .map((game) => {
                            const awayOwner = teamOwnerMap[game.awayTeam.id];
                            const homeOwner = teamOwnerMap[game.homeTeam.id];
                            const winnerOwner = teamOwnerMap[game.winnerTeam.id];
                            const loserOwner = teamOwnerMap[game.loserTeam.id];
                            const isInternalClash =
                              awayOwner && homeOwner && awayOwner.id === homeOwner.id;
                            const awayWon = game.winnerTeam.id === game.awayTeam.id;
                            const homeWon = game.winnerTeam.id === game.homeTeam.id;
                            const margin = game.winnerScore - game.loserScore;
                            const savedNote = league.gameNotes?.[game.id] || '';
                            const isEditingThisNote = editingNoteGameId === game.id;

                            const autoNote = isInternalClash
                              ? `⚡ Internal Clash: ${awayOwner.name} owns both ${game.awayTeam.abbr} & ${game.homeTeam.abbr} (Guaranteed +1W / +1L)`
                              : winnerOwner && loserOwner
                              ? `⚔️ ${winnerOwner.name}'s ${game.winnerTeam.abbr} def. ${loserOwner.name}'s ${game.loserTeam.abbr} by ${margin} pts`
                              : `${game.winnerTeam.name} defeated ${game.loserTeam.name} by ${margin} pts`;

                            return (
                              <tr
                                key={game.id}
                                className={`transition ${
                                  isInternalClash
                                    ? 'bg-amber-500/5 hover:bg-amber-500/10'
                                    : 'hover:bg-slate-800/40'
                                }`}
                              >
                                {/* Date */}
                                <td className="py-3.5 px-3 whitespace-nowrap">
                                  <div className="font-bold text-white text-xs">
                                    {game.dateFormatted}
                                  </div>
                                  <div className="text-[10px] text-slate-500">
                                    {game.statusDetail}
                                  </div>
                                </td>

                                {/* Away Team & Owner */}
                                <td className="py-3.5 px-3">
                                  <div className="flex items-center gap-2">
                                    <img
                                      src={getLogoUrl(game.awayTeam.abbr)}
                                      alt={game.awayTeam.abbr}
                                      className="w-6 h-6 object-contain shrink-0"
                                    />
                                    <div>
                                      <div className="flex items-center gap-1.5">
                                        <span
                                          className={`font-bold text-xs ${
                                            awayWon ? 'text-white' : 'text-slate-400'
                                          }`}
                                        >
                                          {game.awayTeam.name}
                                        </span>
                                        {awayWon && (
                                          <span className="text-[10px] text-emerald-400 font-black">
                                            ✓
                                          </span>
                                        )}
                                      </div>
                                      {awayOwner && (
                                        <span
                                          className={`inline-block mt-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-gradient-to-r ${awayOwner.colorClass} text-slate-950`}
                                        >
                                          {awayOwner.name}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </td>

                                {/* Score */}
                                <td className="py-3.5 px-3 text-center whitespace-nowrap">
                                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm">
                                    <span
                                      className={
                                        awayWon
                                          ? 'font-black text-emerald-400'
                                          : 'text-slate-400'
                                      }
                                    >
                                      {game.awayScore}
                                    </span>
                                    <span className="text-slate-600">–</span>
                                    <span
                                      className={
                                        homeWon
                                          ? 'font-black text-emerald-400'
                                          : 'text-slate-400'
                                      }
                                    >
                                      {game.homeScore}
                                    </span>
                                  </div>
                                </td>

                                {/* Home Team & Owner */}
                                <td className="py-3.5 px-3">
                                  <div className="flex items-center gap-2">
                                    <img
                                      src={getLogoUrl(game.homeTeam.abbr)}
                                      alt={game.homeTeam.abbr}
                                      className="w-6 h-6 object-contain shrink-0"
                                    />
                                    <div>
                                      <div className="flex items-center gap-1.5">
                                        <span
                                          className={`font-bold text-xs ${
                                            homeWon ? 'text-white' : 'text-slate-400'
                                          }`}
                                        >
                                          {game.homeTeam.name}
                                        </span>
                                        {homeWon && (
                                          <span className="text-[10px] text-emerald-400 font-black">
                                            ✓
                                          </span>
                                        )}
                                      </div>
                                      {homeOwner && (
                                        <span
                                          className={`inline-block mt-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-gradient-to-r ${homeOwner.colorClass} text-slate-950`}
                                        >
                                          {homeOwner.name}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </td>

                                {/* Outcome */}
                                <td className="py-3.5 px-3">
                                  <div className="flex flex-col gap-0.5">
                                    <div className="flex items-center gap-1.5">
                                      <img
                                        src={getLogoUrl(game.winnerTeam.abbr)}
                                        alt={game.winnerTeam.abbr}
                                        className="w-4 h-4 object-contain"
                                      />
                                      <span className="font-black text-xs text-emerald-400">
                                        {game.winnerTeam.abbr} Won ({game.winnerScore}–
                                        {game.loserScore})
                                      </span>
                                    </div>
                                    {winnerOwner && (
                                      <div className="text-[11px] font-bold text-slate-200">
                                        +1 Win Pt →{' '}
                                        <span className={winnerOwner.textClass}>
                                          {winnerOwner.name}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </td>

                                {/* Notes (Auto Matchup Note + Editable Custom Note) */}
                                <td className="py-3.5 px-3 min-w-[230px]">
                                  <div className="text-[11px] text-slate-400">
                                    {autoNote}
                                  </div>

                                  {isEditingThisNote ? (
                                    <div className="mt-1.5 flex items-center gap-1.5">
                                      <input
                                        type="text"
                                        value={editingNoteText}
                                        onChange={(e) => setEditingNoteText(e.target.value)}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                            handleSaveGameNote(game.id, editingNoteText);
                                          }
                                          if (e.key === 'Escape') {
                                            setEditingNoteGameId(null);
                                          }
                                        }}
                                        placeholder="Add note (e.g. OT thriller, side bet)..."
                                        autoFocus
                                        className="bg-slate-950 border border-orange-500 rounded-lg px-2 py-1 text-xs text-white w-full focus:outline-none"
                                      />
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleSaveGameNote(game.id, editingNoteText)
                                        }
                                        className="px-2 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold text-[11px] shrink-0 cursor-pointer"
                                      >
                                        Save
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setEditingNoteGameId(null)}
                                        className="px-2 py-1 rounded-lg bg-slate-800 text-slate-400 text-[11px] shrink-0 cursor-pointer"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="mt-1 flex items-center gap-2">
                                      {savedNote ? (
                                        <div className="inline-flex items-center gap-1.5 bg-orange-500/15 border border-orange-500/30 text-orange-200 px-2 py-0.5 rounded-md text-[11px]">
                                          <span>📝 {savedNote}</span>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setEditingNoteGameId(game.id);
                                              setEditingNoteText(savedNote);
                                            }}
                                            className="text-orange-400 hover:text-white ml-1"
                                            title="Edit note"
                                          >
                                            <Edit3 className="w-3 h-3" />
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setEditingNoteGameId(game.id);
                                            setEditingNoteText('');
                                          }}
                                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-orange-400 transition cursor-pointer"
                                        >
                                          <MessageSquarePlus className="w-3 h-3" />
                                          <span>Add Note</span>
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination / Load More Controls */}
                  {filteredHistoricalGames.length > historyVisibleCount && (
                    <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => setHistoryVisibleCount((prev) => prev + 50)}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700 transition cursor-pointer"
                      >
                        Show Next 50 Games ({historyVisibleCount} of{' '}
                        {filteredHistoricalGames.length} shown)
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setHistoryVisibleCount(filteredHistoricalGames.length)
                        }
                        className="px-4 py-2 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-xs font-bold text-orange-300 border border-orange-500/30 transition cursor-pointer"
                      >
                        Show All {filteredHistoricalGames.length} Games
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>

        {/* FULL SNAKE DRAFT RECAP MODAL */}
        {showDraftRecap && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 shadow-2xl max-h-[85vh] flex flex-col">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-lg font-black text-white">
                    Snake Draft Pick History (Picks 1–30)
                  </h3>
                  <p className="text-xs text-slate-400">{league.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDraftRecap(false);
                      handleUndoLastPick();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-orange-300 border border-slate-700 cursor-pointer"
                  >
                    Re-open Draft (Undo #30)
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDraftRecap(false)}
                    className="text-slate-400 hover:text-white font-bold p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 overflow-y-auto pr-1">
                {league.picks.map((pick) => {
                  const player = league.players[pick.playerIndex];
                  const team = NBA_TEAMS.find((t) => t.id === pick.teamId);
                  return (
                    <div
                      key={pick.pickNumber}
                      className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/70 flex items-center justify-between"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="text-[10px] font-bold text-slate-400">
                          Pick #{pick.pickNumber} · R
                          {Math.floor((pick.pickNumber - 1) / league.numPlayers) + 1}
                        </div>
                        <div className="text-xs font-bold text-white truncate">
                          {player?.name}
                        </div>
                        <div className="text-xs font-extrabold text-orange-400 mt-0.5 truncate">
                          {team?.name}
                        </div>
                      </div>
                      {team && (
                        <img
                          src={getLogoUrl(team.abbr)}
                          alt={team.abbr}
                          className="w-8 h-8 object-contain shrink-0"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
