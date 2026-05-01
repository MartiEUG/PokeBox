-- PokeBox Database Schema
-- Run this in your Supabase SQL Editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  balance DECIMAL(10, 2) DEFAULT 1000.00,
  level INTEGER DEFAULT 1,
  avatar_url TEXT,
  CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 20)
);

-- Inventory table
CREATE TABLE IF NOT EXISTS public.inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  item_name TEXT NOT NULL,
  rarity TEXT NOT NULL CHECK (rarity IN ('Common', 'Rare', 'Epic', 'Legendary', 'Mythic')),
  value DECIMAL(10, 2) NOT NULL,
  case_id INTEGER NOT NULL,
  obtained_at TIMESTAMPTZ DEFAULT NOW(),
  is_listed BOOLEAN DEFAULT FALSE,
  CONSTRAINT value_positive CHECK (value > 0)
);

-- Case openings history
CREATE TABLE IF NOT EXISTS public.case_openings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  case_id INTEGER NOT NULL,
  case_name TEXT NOT NULL,
  item_name TEXT NOT NULL,
  rarity TEXT NOT NULL,
  value DECIMAL(10, 2) NOT NULL,
  opened_at TIMESTAMPTZ DEFAULT NOW()
);

-- Marketplace listings
CREATE TABLE IF NOT EXISTS public.marketplace_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  inventory_id UUID REFERENCES public.inventory(id) ON DELETE CASCADE NOT NULL,
  item_name TEXT NOT NULL,
  rarity TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'cancelled')),
  CONSTRAINT price_positive CHECK (price > 0)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_inventory_user_id ON public.inventory(user_id);
CREATE INDEX IF NOT EXISTS idx_inventory_is_listed ON public.inventory(is_listed);
CREATE INDEX IF NOT EXISTS idx_case_openings_user_id ON public.case_openings(user_id);
CREATE INDEX IF NOT EXISTS idx_case_openings_opened_at ON public.case_openings(opened_at DESC);
CREATE INDEX IF NOT EXISTS idx_marketplace_status ON public.marketplace_listings(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_created_at ON public.marketplace_listings(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_openings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for inventory table
CREATE POLICY "Users can view their own inventory"
  ON public.inventory FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert to their own inventory"
  ON public.inventory FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own inventory"
  ON public.inventory FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own inventory"
  ON public.inventory FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for case_openings table
CREATE POLICY "Users can view their own case openings"
  ON public.case_openings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own case openings"
  ON public.case_openings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for marketplace_listings table
CREATE POLICY "Everyone can view active listings"
  ON public.marketplace_listings FOR SELECT
  USING (status = 'active' OR auth.uid() = seller_id);

CREATE POLICY "Users can create their own listings"
  ON public.marketplace_listings FOR INSERT
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can update their own listings"
  ON public.marketplace_listings FOR UPDATE
  USING (auth.uid() = seller_id);

CREATE POLICY "Users can delete their own listings"
  ON public.marketplace_listings FOR DELETE
  USING (auth.uid() = seller_id);

-- Trigger to create user profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, username, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to get user inventory with total value
CREATE OR REPLACE FUNCTION get_user_inventory_value(p_user_id UUID)
RETURNS DECIMAL AS $$
  SELECT COALESCE(SUM(value), 0)
  FROM public.inventory
  WHERE user_id = p_user_id AND is_listed = FALSE;
$$ LANGUAGE SQL STABLE;

-- Function to get recent case openings (for live feed)
CREATE OR REPLACE FUNCTION get_recent_case_openings(limit_count INTEGER DEFAULT 20)
RETURNS TABLE (
  username TEXT,
  case_name TEXT,
  item_name TEXT,
  rarity TEXT,
  value DECIMAL,
  opened_at TIMESTAMPTZ
) AS $$
  SELECT 
    u.username,
    co.case_name,
    co.item_name,
    co.rarity,
    co.value,
    co.opened_at
  FROM public.case_openings co
  JOIN public.users u ON co.user_id = u.id
  ORDER BY co.opened_at DESC
  LIMIT limit_count;
$$ LANGUAGE SQL STABLE;
