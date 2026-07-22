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

// Hand-tuned positions for exactly 20 flowers, spaced clearly apart
// (no overlaps) so each bloom stays individually identifiable in the
// garden bed instead of blending together.
const POSITIONS: Array<[number, number]> = [
  [10, 57], [30, 58], [50, 56], [70, 59], [90, 57],
  [18, 68], [38, 67], [58, 69], [78, 68],
  [8, 79], [26, 78], [44, 80], [62, 77], [80, 79],
  [16, 89], [36, 88], [56, 90], [76, 89], [94, 88],
  [50, 46], // Finale flower (day 20) at the top center
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
    type: 'tulip',
    kind: 'note',
    title: 'Day 1',
    body: 'Hi my love. Today is the first flower in your birthday garden. For the next 20 days, a new flower will bloom just for you. Think of each one as a tiny piece of my heart, sent to make you smile. 🌷',
  },
  {
    day: 2,
    type: 'daisy',
    kind: 'reason',
    title: 'Reason I love you #1',
    body: 'Your smile. No matter how bad my day is, one smile from you can instantly make everything feel okay again.',
  },
  {
    day: 3,
    type: 'cherry',
    kind: 'memory',
    title: 'A little memory',
    body: 'Remember when we first started talking and somehow one conversation turned into hours? I still smile thinking about how easily you became my favorite person.',
  },
  {
    day: 4,
    type: 'sunflower',
    kind: 'riddle',
    title: 'Riddle time!',
    riddle: "I don't have a key, but I unlock your smile.\nI don't have wings, but I make your heart flutter.\nWhat am I?",
    answer: 'my love',
    hint: 'It is what I feel for you. 💛',
    body: 'My love for you. 💛',
  },
  {
    day: 5,
    type: 'lily',
    kind: 'note',
    rare: true,
    title: 'A Rare Bloom',
    body: 'Out of all the people in this world, all the paths life could have taken, somehow it led me to you. And if I had to choose again, I would still choose you every single time.',
  },
  {
    day: 6,
    type: 'tulip',
    kind: 'reason',
    title: 'Reason I love you #2',
    body: 'The way you care for me, even in the smallest ways. The little things you do may seem ordinary to you, but they mean everything to me.',
  },
  {
    day: 7,
    type: 'daisy',
    kind: 'note',
    title: 'My favorite thing',
    body: "One of my favorite things about us is that even when we're doing absolutely nothing, it still feels special because I'm doing it with you.",
  },
  {
    day: 8,
    type: 'rose',
    kind: 'riddle',
    title: 'Riddle time!',
    riddle: "The more we share it, the stronger it becomes.\nThe more we protect it, the more beautiful it grows.\nWhat is it?",
    answer: 'us',
    hint: 'It is you and me together. 🌹',
    body: 'Us. 🌹',
  },
  {
    day: 9,
    type: 'sunflower',
    kind: 'note',
    title: 'A reminder',
    body: "If today feels difficult, let this flower remind you of something: you're stronger, kinder, and more amazing than you give yourself credit for. I'm always proud of you.",
  },
  {
    day: 10,
    type: 'poppy',
    kind: 'note',
    rare: true,
    title: 'Halfway There',
    body: "Ten flowers down, and I still haven't found enough words to explain how much you mean to me. You make ordinary moments feel magical, and that's one of my favorite things about loving you.",
  },
  {
    day: 11,
    type: 'tulip',
    kind: 'reason',
    title: 'Reason I love you #3',
    body: "The way you get excited about things you love. Watching you talk about something you're passionate about is one of the cutest things ever.",
  },
  {
    day: 12,
    type: 'daisy',
    kind: 'memory',
    title: 'If I could',
    body: 'If I could relive one random moment with you today, I would. Not because it was perfect, but because every memory with you becomes special somehow.',
  },
  {
    day: 13,
    type: 'cherry',
    kind: 'note',
    title: 'Just a reminder',
    body: 'No matter how busy life gets or how far apart we are, you are always the first person I think about and the last person I want to talk to before I sleep.',
  },
  {
    day: 14,
    type: 'sunflower',
    kind: 'riddle',
    title: 'Riddle time!',
    riddle: "I'm invisible, yet I follow you everywhere.\nYou can't touch me, but you feel me every day.\nWhat am I?",
    answer: 'my heart',
    hint: 'It belongs with you. ❤️',
    body: 'My heart, because it belongs with you. ❤️',
  },
  {
    day: 15,
    type: 'lily',
    kind: 'note',
    rare: true,
    title: 'Fifteen Blooms',
    body: 'Fifteen flowers have bloomed now, and every single one represents something I love about us. Thank you for loving me, supporting me, and making my life brighter just by being in it.',
  },
  {
    day: 16,
    type: 'tulip',
    kind: 'reason',
    title: 'Reason I love you #4',
    body: "You make me laugh even when I'm trying not to. Sometimes I think your secret talent is turning my worst moods into smiles.",
  },
  {
    day: 17,
    type: 'daisy',
    kind: 'memory',
    title: 'A little memory',
    body: "The first time I realized you weren't just someone I liked—you were someone I couldn't imagine my life without. That feeling has only grown stronger since.",
  },
  {
    day: 18,
    type: 'cherry',
    kind: 'note',
    title: 'I see you',
    body: "Whenever you doubt yourself, remember that I see the version of you that you're sometimes too hard on. And that version is incredible.",
  },
  {
    day: 19,
    type: 'sunflower',
    kind: 'note',
    title: 'Almost there',
    body: "We're almost at your birthday now. Just one flower left to bloom. I hope these little messages have reminded you how loved you are, because you deserve to feel that every single day.",
  },
  {
    day: 20,
    type: 'rose',
    kind: 'note',
    title: 'Finale',
    body: "Happy Birthday, my love. 💛\n\nTwenty flowers. Twenty little reminders of how much you mean to me.\n\nThank you for every laugh, every late-night conversation, every memory, every moment you've made my life better simply by being in it.\n\nYou are my comfort, my favorite notification, my safe place, and one of the best things that has ever happened to me.\n\nI love you more than these flowers, more than these words, and more than I could ever fully explain.\n\nHappy Birthday, my cutie patootie. Here's to many more birthdays, memories, and flowers together. 🌷❤️",
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
