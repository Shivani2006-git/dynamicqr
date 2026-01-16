-- Add subscription tier to users table
-- Run this in your Supabase SQL Editor

-- Add subscription_tier column
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'ultimate'));

-- Add pending_upgrade column to track payment confirmation
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS pending_upgrade TEXT DEFAULT NULL CHECK (pending_upgrade IN ('pro', 'ultimate', NULL));
