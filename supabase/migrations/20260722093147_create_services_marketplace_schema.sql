/*
# Home Services Marketplace Schema (India)

1. Purpose
- Two-sided marketplace connecting customers with local home service professionals (Mestri/Contractors, Plumbers, Electricians, Carpenters, Painters, Tile Layers, etc.).
- Single-tenant (no auth) app: any visitor can browse professionals, and a professional can register themselves. Data is intentionally public/shared so the anon-key client can read/write.

2. New Tables
- `professionals`
  - id (uuid pk)
  - name (text)
  - phone (text)
  - category (text) — e.g. 'plumber', 'electrician', 'carpenter', 'mason', 'painter', 'tile_layer', 'contractor'
  - experience_years (int)
  - bio (text)
  - city (text)
  - area (text)
  - pincode (text)
  - lat (numeric, nullable)
  - lng (numeric, nullable)
  - rating (numeric, default 0)
  - total_ratings (int, default 0)
  - available (boolean, default true)
  - starting_price (int)
  - created_at (timestamptz)
- `work_photos`
  - id (uuid pk)
  - professional_id (uuid fk -> professionals.id on delete cascade)
  - image_url (text)
  - caption (text)
  - created_at (timestamptz)
- `bookings`
  - id (uuid pk)
  - professional_id (uuid fk -> professionals.id)
  - customer_name (text)
  - customer_phone (text)
  - service_needed (text)
  - address (text)
  - pincode (text)
  - scheduled_date (date)
  - notes (text)
  - status (text, default 'pending') — pending, confirmed, completed, cancelled
  - created_at (timestamptz)
- `reviews`
  - id (uuid pk)
  - professional_id (uuid fk -> professionals.id on delete cascade)
  - reviewer_name (text)
  - rating (int, 1-5)
  - comment (text)
  - created_at (timestamptz)

3. Security
- RLS enabled on all tables.
- All tables allow anon + authenticated CRUD (intentionally public/shared marketplace, no sign-in).
*/

CREATE TABLE IF NOT EXISTS professionals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  category text NOT NULL,
  experience_years int NOT NULL DEFAULT 1,
  bio text,
  city text NOT NULL,
  area text NOT NULL,
  pincode text NOT NULL,
  lat numeric,
  lng numeric,
  rating numeric NOT NULL DEFAULT 0,
  total_ratings int NOT NULL DEFAULT 0,
  available boolean NOT NULL DEFAULT true,
  starting_price int NOT NULL DEFAULT 200,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_professionals" ON professionals;
CREATE POLICY "anon_select_professionals" ON professionals FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_professionals" ON professionals;
CREATE POLICY "anon_insert_professionals" ON professionals FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_professionals" ON professionals;
CREATE POLICY "anon_update_professionals" ON professionals FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_professionals" ON professionals;
CREATE POLICY "anon_delete_professionals" ON professionals FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS work_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  caption text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE work_photos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_work_photos" ON work_photos;
CREATE POLICY "anon_select_work_photos" ON work_photos FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_work_photos" ON work_photos;
CREATE POLICY "anon_insert_work_photos" ON work_photos FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_work_photos" ON work_photos;
CREATE POLICY "anon_update_work_photos" ON work_photos FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_work_photos" ON work_photos;
CREATE POLICY "anon_delete_work_photos" ON work_photos FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  service_needed text NOT NULL,
  address text NOT NULL,
  pincode text NOT NULL,
  scheduled_date date,
  notes text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_bookings" ON bookings;
CREATE POLICY "anon_select_bookings" ON bookings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_bookings" ON bookings;
CREATE POLICY "anon_insert_bookings" ON bookings FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_bookings" ON bookings;
CREATE POLICY "anon_update_bookings" ON bookings FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_bookings" ON bookings;
CREATE POLICY "anon_delete_bookings" ON bookings FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  reviewer_name text NOT NULL,
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_reviews" ON reviews;
CREATE POLICY "anon_select_reviews" ON reviews FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_reviews" ON reviews;
CREATE POLICY "anon_insert_reviews" ON reviews FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_reviews" ON reviews;
CREATE POLICY "anon_update_reviews" ON reviews FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_reviews" ON reviews;
CREATE POLICY "anon_delete_reviews" ON reviews FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_professionals_category ON professionals(category);
CREATE INDEX IF NOT EXISTS idx_professionals_pincode ON professionals(pincode);
CREATE INDEX IF NOT EXISTS idx_professionals_city ON professionals(city);
CREATE INDEX IF NOT EXISTS idx_work_photos_professional ON work_photos(professional_id);
CREATE INDEX IF NOT EXISTS idx_bookings_professional ON bookings(professional_id);
CREATE INDEX IF NOT EXISTS idx_reviews_professional ON reviews(professional_id);
