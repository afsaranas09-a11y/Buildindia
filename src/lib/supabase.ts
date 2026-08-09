import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Professional = {
  id: string;
  name: string;
  phone: string;
  category: string;
  experience_years: number;
  bio: string | null;
  city: string;
  area: string;
  pincode: string;
  lat: number | null;
  lng: number | null;
  rating: number;
  total_ratings: number;
  available: boolean;
  starting_price: number;
  created_at: string;
};

export type WorkPhoto = {
  id: string;
  professional_id: string;
  image_url: string;
  caption: string | null;
  created_at: string;
};

export type Booking = {
  id: string;
  professional_id: string;
  customer_name: string;
  customer_phone: string;
  service_needed: string;
  address: string;
  pincode: string;
  scheduled_date: string | null;
  notes: string | null;
  status: string;
  created_at: string;
};

export type Review = {
  id: string;
  professional_id: string;
  reviewer_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
};

export const CATEGORIES = [
  { key: 'mason', icon: 'Hammer' },
  { key: 'plumber', icon: 'Wrench' },
  { key: 'electrician', icon: 'Zap' },
  { key: 'carpenter', icon: 'TreePine' },
  { key: 'painter', icon: 'PaintRoller' },
  { key: 'tile_layer', icon: 'Grid3x3' },
  { key: 'contractor', icon: 'HardHat' },
] as const;
