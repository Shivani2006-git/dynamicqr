-- Add QR type column to qr_redirects table
-- Run this in your Supabase SQL Editor

-- Add type column (gpay or website)
ALTER TABLE public.qr_redirects 
ADD COLUMN IF NOT EXISTS qr_type TEXT DEFAULT 'gpay' CHECK (qr_type IN ('gpay', 'website'));

-- Make UPI fields optional for website type
ALTER TABLE public.qr_redirects 
ALTER COLUMN upi_id DROP NOT NULL,
ALTER COLUMN merchant_name DROP NOT NULL;
