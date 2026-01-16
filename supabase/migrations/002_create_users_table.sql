-- Custom Users Table for Manual Authentication
-- Run this in your Supabase SQL Editor

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public registration" ON public.users;
DROP POLICY IF EXISTS "Users can read own data" ON public.users;

-- Drop existing table if you want to recreate (optional, comment out if you have data)
-- DROP TABLE IF EXISTS public.users;

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- IMPORTANT: Disable RLS for users table to allow inserts from anon key
-- This is simpler for a custom auth system
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Grant full permissions to anon and authenticated roles
GRANT ALL ON public.users TO anon;
GRANT ALL ON public.users TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
