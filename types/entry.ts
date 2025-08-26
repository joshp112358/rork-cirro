export interface StrainInfo {
  name: string;
  type: 'Indica' | 'Sativa' | 'Hybrid' | 'CBD';
  thc?: number;
  cbd?: number;
  tac?: number;
  thca?: number;
  thcv?: number;
  cbg?: number;
  terpenes?: string[];
  brand?: string;
  dispensary?: string;
}

export interface MoodRating {
  overall: number; // 1-5
}

export interface Effect {
  name: string;
  intensity: number; // 1-5
}

export interface JournalEntry {
  id: string;
  timestamp: Date;
  strain: StrainInfo;
  amount: number; // in grams, puffs, or mg depending on method
  method: 'Flower' | 'Vape' | 'Edible' | 'Tincture' | 'Topical' | 'Other';
  mood: MoodRating;
  effects: Effect[];
  notes: string;
  imageUri?: string;
  rating: number; // 1-5 stars
}

export const POSITIVE_EFFECTS = [
  'Relaxed', 'Happy', 'Euphoric', 'Creative', 'Focused', 'Energetic',
  'Uplifted', 'Giggly', 'Talkative', 'Aroused', 'Pain Relief', 'Hungry', 'Munchies'
];

export const NEGATIVE_EFFECTS = [
  'Dry Mouth', 'Anxious', 'Tired', 'Dry Eyes', 'Paranoid', 'Dizzy',
  'Headache', 'Couch Lock', 'Sleepy', 'Nauseous'
];

export const EFFECTS = [...POSITIVE_EFFECTS, ...NEGATIVE_EFFECTS];

export const MOOD_LABELS = {
  1: 'Terrible',
  2: 'Bad',
  3: 'Okay',
  4: 'Good',
  5: 'Excellent'
};