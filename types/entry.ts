export interface StrainInfo {
  name: string;
  type: 'Indica' | 'Sativa' | 'Hybrid' | 'CBD';
  thc?: number;
  cbd?: number;
  terpenes?: string[];
  brand?: string;
  dispensary?: string;
}

export interface MoodRating {
  before: number;
  during: number;
  after: number;
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

export const EFFECTS = [
  'Relaxed', 'Dry Mouth', 'Happy', 'Anxious', 'Euphoric', 'Tired', 
  'Creative', 'Hungry', 'Focused', 'Dry Eyes', 'Energetic', 'Paranoid',
  'Uplifted', 'Dizzy', 'Giggly', 'Headache', 'Talkative', 'Couch Lock',
  'Aroused', 'Sleepy', 'Pain Relief', 'Nauseous', 'Munchies'
];

export const MOOD_LABELS = {
  1: 'Terrible',
  2: 'Bad',
  3: 'Okay',
  4: 'Good',
  5: 'Excellent'
};