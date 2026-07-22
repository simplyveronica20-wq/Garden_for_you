// ============================================================
//  OUR LITTLE GARDEN — Flower Messages
//  ------------------------------------------------------------
//  Edit everything below to fill the garden with your own
//  love notes, photos, memories, and riddles.
//
//  Each flower = one day. Day 1 blooms on the visitor's first
//  visit, Day 2 on the next calendar day, and so on.
//
//  `type`  : visual flower style — 'rose' | 'daisy' | 'tulip'
//            | 'sunflower' | 'lily' | 'cherry' | 'poppy'
//  `kind`  : what's inside — 'note' | 'photo' | 'memory'
//            | 'reason' | 'riddle'
//  `rare`  : true → golden glowing flower with extra flourish
//            (every 5th flower is rare by default)
//  `x`,`y` : position in the garden bed (percent of garden area)
// ============================================================

export type FlowerType = 'rose' | 'daisy' | 'tulip' | 'sunflower' | 'lily' | 'cherry' | 'poppy';
export type MessageKind = 'note' | 'photo' | 'memory' | 'reason' | 'riddle';

export interface FlowerMessage {
  /** Day number — day 1 blooms first, day 2 next, etc. */
  day: number;
  type: FlowerType;
  kind: MessageKind;
  /** Mark as a rare golden flower (extra sparkle + flourish). */
  rare?: boolean;
  /** Position in the garden bed, in percentages (0–100). Auto-assigned if omitted. */
  x?: number;
  y?: number;
  /** Main text shown on the scroll. */
  title?: string;
  /** Body text for note/memory/reason kinds. */
  body?: string;
  /** Image URL for the 'photo' kind (use a Pexels/stock URL). */
  photo?: string;
  /** Photo caption. */
  caption?: string;
  /** For 'riddle' kind: the question asked before revealing. */
  riddle?: string;
  /** For 'riddle' kind: the answer that unlocks the message. */
  answer?: string;
  /** Optional hint for the riddle. */
  hint?: string;
}

// Helper to scatter flowers naturally (not a grid).
// These positions are hand-tuned to look like a real garden bed.
const POSITIONS: Array<[number, number]> = [
  [22, 68], [48, 74], [70, 66], [34, 80], [58, 86],
  [16, 82], [82, 78], [40, 62], [64, 70], [28, 72],
  [52, 64], [76, 84], [44, 78], [20, 58], [66, 58],
  [38, 70], [88, 66], [50, 80], [30, 64], [72, 72],
  [46, 58], [18, 70], [84, 74], [56, 76], [36, 84],
  [62, 82], [26, 78], [78, 60], [42, 66], [54, 70],
];

const TYPES: FlowerType[] = ['rose', 'daisy', 'tulip', 'sunflower', 'lily', 'cherry', 'poppy'];

// Real photographic close-ups used to render each bloomed flower type
// realistically in the garden bed (see Flower.tsx).
export const FLOWER_PHOTOS: Record<FlowerType, string> = {
  rose: 'https://images.pexels.com/photos/65254/pexels-photo-65254.jpeg?auto=compress&cs=tinysrgb&w=300',
  daisy: 'https://images.pexels.com/photos/612331/pexels-photo-612331.jpeg?auto=compress&cs=tinysrgb&w=300',
  tulip: 'https://images.pexels.com/photos/46789/pexels-photo-46789.jpeg?auto=compress&cs=tinysrgb&w=300',
  sunflower: 'https://images.pexels.com/photos/1157890/pexels-photo-1157890.jpeg?auto=compress&cs=tinysrgb&w=300',
  lily: 'https://images.pexels.com/photos/1033141/pexels-photo-1033141.jpeg?auto=compress&cs=tinysrgb&w=300',
  cherry: 'https://images.pexels.com/photos/28582918/pexels-photo-28582918.jpeg?auto=compress&cs=tinysrgb&w=300',
  poppy: 'https://images.pexels.com/photos/24031981/pexels-photo-24031981.jpeg?auto=compress&cs=tinysrgb&w=300',
};

// Realistic meadow background photo for the garden scene (Scene 2).
export const GARDEN_BACKGROUND_PHOTO =
  'https://images.pexels.com/photos/33645312/pexels-photo-33645312.jpeg?auto=compress&cs=tinysrgb&w=1600';

// ---------------------------------------------------------------
//  THE GARDEN — swap these messages with your own.
//  Add or remove entries freely; positions auto-assign if you
//  keep the array order. Every 5th flower is "rare" by default.
// ---------------------------------------------------------------

export const FLOWERS: FlowerMessage[] = [
  {
    day: 1,
    type: 'rose',
    kind: 'note',
    title: 'Every story needs a beginning',
    body:
      'Every story needs a beginning — this is ours. Welcome to the first flower of our little garden.',
  },
  {
    day: 2,
    type: 'daisy',
    kind: 'reason',
    title: 'Reason #1',
    body:
      'I love the way you make ordinary days feel like something worth remembering.',
  },
  {
    day: 3,
    type: 'tulip',
    kind: 'memory',
    title: 'Remember when…',
    body:
      'Remember when we stayed up talking about nothing and everything, and somehow it was the best night?',
  },
  {
    day: 4,
    type: 'cherry',
    kind: 'note',
    title: 'A little truth',
    body:
      'You are my favorite kind of quiet — the kind that feels like peace, not silence.',
  },
  {
    day: 5,
    type: 'sunflower',
    kind: 'note',
    rare: true,
    title: 'A golden one for you',
    body:
      'Five days, five flowers, and still every single one of them is you. Thank you for being the reason this garden exists at all. 💛',
  },
  {
    day: 6,
    type: 'poppy',
    kind: 'riddle',
    title: 'A little riddle',
    riddle: 'I grow without soil, I glow without light — what am I?',
    answer: 'love',
    hint: 'It is the thing this whole garden is made of.',
    body:
      'It is love. The answer was always love — the way I feel about you.',
  },
  {
    day: 7,
    type: 'lily',
    kind: 'photo',
    title: 'Pressed into memory',
    photo:
      'https://images.pexels.com/photos/1033141/pexels-photo-1033141.jpeg?auto=compress&cs=tinysrgb&w=800',
    caption: 'This is the smile I think about on hard days.',
  },
  {
    day: 8,
    type: 'rose',
    kind: 'memory',
    title: 'Remember when…',
    body:
      'Remember when we got completely lost and ended up somewhere better than where we were headed? That is us, I think.',
  },
  {
    day: 9,
    type: 'daisy',
    kind: 'reason',
    title: 'Reason #2',
    body:
      'I love that you say what you mean, even when it is brave to say it.',
  },
  {
    day: 10,
    type: 'sunflower',
    kind: 'note',
    rare: true,
    title: 'Ten blooms',
    body:
      'Ten flowers bloomed, ten days of choosing you — and I would choose you again tomorrow, and the day after that. 🌻',
  },
  {
    day: 11,
    type: 'tulip',
    kind: 'note',
    title: 'A small truth',
    body:
      'You make small moments feel like they matter. That is a rare kind of magic.',
  },
  {
    day: 12,
    type: 'cherry',
    kind: 'memory',
    title: 'Remember when…',
    body:
      'Remember the first time I realized I was not just falling for you, I had already landed?',
  },
  {
    day: 13,
    type: 'lily',
    kind: 'reason',
    title: 'Reason #3',
    body:
      'I love how you listen — really listen — like what I say actually matters to you.',
  },
  {
    day: 14,
    type: 'poppy',
    kind: 'riddle',
    title: 'One more riddle',
    riddle: 'The more you give me, the more I grow — what am I?',
    answer: 'this garden',
    hint: 'It is something we are building together, one day at a time.',
    body: 'This garden. Us.',
  },
  {
    day: 15,
    type: 'sunflower',
    kind: 'note',
    rare: true,
    title: 'The rare one',
    body:
      'Fifteen flowers now, and this one glows the brightest — because loving you has only gotten easier, not harder. 💛',
  },
  {
    day: 16,
    type: 'rose',
    kind: 'photo',
    title: 'Kept this one too',
    photo:
      'https://images.pexels.com/photos/65254/pexels-photo-65254.jpeg?auto=compress&cs=tinysrgb&w=800',
    caption: 'Proof that some days really were as good as I remember them.',
  },
  {
    day: 17,
    type: 'daisy',
    kind: 'note',
    title: 'A small truth',
    body:
      'If this garden could talk, it would just keep saying your name.',
  },
  {
    day: 18,
    type: 'tulip',
    kind: 'memory',
    title: 'Remember when…',
    body:
      'Remember when we laughed so hard about something so small that neither of us can even explain it now?',
  },
  {
    day: 19,
    type: 'cherry',
    kind: 'note',
    title: 'Nineteen flowers',
    body:
      'Nineteen flowers, nineteen days, and not one of them made me love you any less. Here is to the ones still growing. 🌷💛',
  },
];

// Assign positions + auto-rare every 5th if not explicitly set.
FLOWERS.forEach((f, i) => {
  if (!f.x || !f.y) {
    const [x, y] = POSITIONS[i % POSITIONS.length];
    f.x = x;
    f.y = y;
  }
  if (f.rare === undefined) {
    f.rare = f.day % 5 === 0;
  }
  if (!f.type) {
    f.type = TYPES[i % TYPES.length];
  }
});

// Bonus easter-egg notes revealed by clicking the firefly.
export const FIREFLY_SURPRISES: string[] = [
  'Psst… the fireflies think you are the brightest thing in the garden. ✨',
  'A little bird told me you were here. It also told me you are loved. 🐦',
  'If you are reading this, it means you clicked a firefly. Curious and brave — just like you always are.',
  'The garden whispered something to me today. It said: "tell them." So… tell them. Always.',
  'You found a hidden petal. Tuck it somewhere safe. It is good luck, I promise.',
  'Fun fact: every flower here is secretly thinking about you right now. 🌸',
];

export const TOTAL_DAYS = FLOWERS.length;
