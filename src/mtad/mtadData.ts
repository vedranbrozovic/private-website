export interface StoryChapter {
  id: string;
  date: string;
  location: string;
  title: string;
  body: string;
  image: string;
  imageAlt: string;
  caption: string;
}

export interface PioneerPlayer {
  id: string;
  name: string;
  olympicNumber: string;
  nbaNumber: string;
  moniker: string;
  position: string;
  nbaTeams: string;
  headline: string;
  bio: string;
  highlights: string[];
  image: string;
  imageAlt: string;
}

export interface FilmCredit {
  title: string;
  role: string;
  recognition: string;
  description: string;
}

export const INSTAGRAM_URL = 'https://www.instagram.com/croatiandreamteam/';
export const INSTAGRAM_HANDLE = '@croatiandreamteam';

// LA28 Waterfront Premiere target: Eve of the LA28 Opening Ceremony (July 13, 2028, 7:00 PM PDT)
export const PREMIERE_TARGET_ISO = '2028-07-13T19:00:00-07:00';

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 'war',
    date: '1991 — 1992',
    location: 'Croatia',
    title: 'A Nation Under Siege',
    body: 'Months after declaring independence, Croatia is thrust into a devastating war for survival. Cities are shelled, historic coastlines burn, and families are displaced—while a generation of young basketball icons watches from arenas across Europe and the NBA, determined to give their people a voice on the world stage.',
    image: '/assets/mtad/wartime-croatia.jpg',
    imageAlt: 'Archival wartime view of Croatia during the 1991-1992 struggle for independence',
    caption: 'Homeland under fire · 1991–1992',
  },
  {
    id: 'recognition',
    date: 'April 7, 1992',
    location: 'Washington, D.C. & Barcelona',
    title: 'A Flag Recognized',
    body: 'International recognition arrives just months before the Summer Games. For the very first time in Olympic history, Croatia earns the right to march under its own red-and-white checkerboard flag—turning a basketball tournament into a defining moment of national identity.',
    image: '/assets/mtad/kukoc-olympics.jpg',
    imageAlt: 'Toni Kukoč wearing number 7 for Croatia competing against Chris Mullin at the 1992 Barcelona Olympics',
    caption: 'Toni Kukoč (#7) representing newly independent Croatia in Barcelona',
  },
  {
    id: 'semifinal',
    date: 'August 6, 1992',
    location: 'Palau Municipal d’Esports de Badalona',
    title: 'The Semifinal Comeback',
    body: 'Trailing the Unified Team deep in the Olympic semifinal, Croatia refuses to fold. Fueled by Dražen Petrović, Toni Kukoč, Dino Rađa, and Stojko Vranković, the team storms back to stun the favorites 75–74 in the final seconds—securing Croatia’s first-ever Olympic medal.',
    image: '/assets/mtad/barcelona-tipoff.jpg',
    imageAlt: 'Opening tip-off between Croatia and the USA Dream Team at the 1992 Barcelona Olympics',
    caption: 'Tip-off on basketball’s grandest Olympic stage · August 1992',
  },
  {
    id: 'gold-medal-game',
    date: 'August 8, 1992',
    location: 'Barcelona, Spain',
    title: 'Facing the Dream Team',
    body: 'In the gold medal game against Michael Jordan, Magic Johnson, Larry Bird, and the greatest roster ever assembled, Croatia does the unthinkable: they lead early, play fearlessly, and claim Olympic Silver. Watching from bomb shelters and living rooms back home, an entire nation dares to dream again.',
    image: '/assets/mtad/hero-poster.jpg',
    imageAlt: 'Official key art for More Than a Dream depicting Croatia’s 1992 Olympic basketball legends',
    caption: 'Olympic Silver Medalists · Barcelona 1992',
  },
];

export const FOUR_PIONEERS: PioneerPlayer[] = [
  {
    id: 'petrovic',
    name: 'Dražen Petrović',
    olympicNumber: '04',
    nbaNumber: '3',
    moniker: 'The Mozart of Basketball',
    position: 'Shooting Guard',
    nbaTeams: 'Portland Trail Blazers · New Jersey Nets',
    headline: 'The fearless captain who opened the NBA door for European basketball.',
    bio: 'A relentless scorer and national icon, Dražen Petrović carried Croatia’s hopes in Barcelona with unforgettable poise. Entering the NBA in 1989 and earning All-NBA Third Team honors in 1993, his tragic passing later that year cemented his place forever in the hearts of fans worldwide. In More Than a Dream, his teammates and closest voices bring his legacy vividly to life.',
    highlights: [
      'Naismith Memorial Basketball Hall of Fame',
      '2× Mr. Europa · All-NBA Third Team (1993)',
      '24 points in the 1992 Olympic Gold Medal Game',
    ],
    image: '/assets/mtad/player-petrovic.jpg',
    imageAlt: 'Dražen Petrović playing for the New Jersey Nets wearing number 3',
  },
  {
    id: 'kukoc',
    name: 'Toni Kukoč',
    olympicNumber: '07',
    nbaNumber: '7',
    moniker: 'The Croatian Sensation',
    position: 'Forward',
    nbaTeams: 'Chicago Bulls · 76ers · Hawks · Bucks',
    headline: 'A 6-foot-10 playmaker who redefined versatility in world basketball.',
    bio: 'Already a European legend before stepping onto an NBA court, Toni Kukoč showcased his brilliance in Barcelona under intense spotlight before joining Michael Jordan and Scottie Pippen in Chicago. Over a 13-year NBA career, he captured three NBA championships and the 1996 NBA Sixth Man of the Year award.',
    highlights: [
      'Naismith Memorial Basketball Hall of Fame',
      '3× NBA Champion with the Chicago Bulls',
      '1996 NBA Sixth Man of the Year · 3× EuroLeague Final Four MVP',
    ],
    image: '/assets/mtad/player-kukoc.jpg',
    imageAlt: 'Toni Kukoč playing for the Chicago Bulls wearing number 7',
  },
  {
    id: 'radja',
    name: 'Dino Rađa',
    olympicNumber: '14',
    nbaNumber: '40',
    moniker: 'The Anchor in the Paint',
    position: 'Power Forward · Center',
    nbaTeams: 'Boston Celtics',
    headline: 'Graceful footwork and relentless heart against basketball’s tallest giants.',
    bio: 'A two-time European Champion and 1989 EuroLeague Final Four MVP, Dino Rađa anchored Croatia’s frontcourt in Barcelona with skill and toughness. He went on to star for four seasons with the Boston Celtics, earning NBA All-Rookie Second Team honors and later taking his rightful place in the Basketball Hall of Fame.',
    highlights: [
      'Naismith Memorial Basketball Hall of Fame',
      '2× European Champion · 1989 EuroLeague Final Four MVP',
      '1994 NBA All-Rookie Second Team (Boston Celtics)',
    ],
    image: '/assets/mtad/player-radja.jpg?v=2',
    imageAlt: 'Dino Rađa in 1990s basketball action wearing jersey number 14',
  },
  {
    id: 'vrankovic',
    name: 'Stojko Vranković',
    olympicNumber: '11',
    nbaNumber: '52',
    moniker: 'The Rim Protector & Patriot',
    position: 'Center',
    nbaTeams: 'Boston Celtics · Timberwolves · Clippers',
    headline: 'Towering presence on the court and unwavering advocate for his homeland.',
    bio: 'Before taking the floor in Barcelona, Stojko Vranković stood shoulder-to-shoulder with Dražen Petrović outside the United Nations in New York in a peaceful protest calling for peace and recognition for Croatia. A EuroLeague champion and five-year NBA veteran, his defensive dominance helped propel Croatia to Olympic history.',
    highlights: [
      'EuroLeague Champion & All-Star Center',
      '5 NBA Seasons (Celtics, Timberwolves, Clippers)',
      'Key defensive anchor of Croatia’s 1992 Olympic Silver run',
    ],
    image: '/assets/mtad/player-vrankovic.jpg',
    imageAlt: 'Stojko Vranković playing for the Boston Celtics wearing number 52',
  },
];

export const PRESS_OUTLETS: string[] = [
  'Deadline',
  'Yahoo Sports',
  'Bleacher Nation',
  'Ministry of Sport',
  'Večernji List',
];

export const FILMMAKER_CREDITS: FilmCredit[] = [
  {
    title: 'Bloody Thursday',
    role: 'Director & Producer',
    recognition: 'Los Angeles Area Emmy Award Winner · PBS',
    description:
      'Chronicled the 1934 West Coast maritime strike and the dockworkers who stood together during the Great Depression to win their union.',
  },
  {
    title: 'A City Divided',
    role: 'Director & Producer',
    recognition: 'Feature Documentary · Rivals United for a Kure',
    description:
      'Explored the storied USC–UCLA football rivalry while uniting two passionate fanbases behind cancer research fundraising.',
  },
  {
    title: 'Searching for a Storm',
    role: 'Director & Producer',
    recognition: 'Official Selection · ZagrebDox',
    description:
      'Examined the human stories, complexity, and aftermath of Croatia’s 1995 Operation Storm through firsthand voices.',
  },
];

export const LA28_PILLARS = [
  {
    step: '01',
    title: 'Historic Movie Palace Screening',
    detail:
      'An unforgettable premiere screening in a landmark Los Angeles theater, celebrating the 1992 team on the big screen.',
  },
  {
    step: '02',
    title: 'Red Carpet & Olympic Reunion',
    detail:
      'Bringing together basketball legends, filmmakers, diplomats, and fans from Los Angeles, Croatia, and the global diaspora.',
  },
  {
    step: '03',
    title: 'LA Waterfront Celebration',
    detail:
      'A post-screening harbor celebration with live music on the Los Angeles Waterfront—held on the eve of the 2028 Olympic Games.',
  },
];
