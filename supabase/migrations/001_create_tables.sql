-- Supabase SQL Migration
-- Run this in your Supabase SQL Editor to create the required tables

-- Enable UUID extension (usually already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create qr_redirects table
CREATE TABLE IF NOT EXISTS public.qr_redirects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    qr_code_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    target_url TEXT NOT NULL,
    upi_id TEXT NOT NULL,
    merchant_name TEXT NOT NULL,
    amount DECIMAL(10, 2),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    scan_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster QR code lookups
CREATE INDEX IF NOT EXISTS idx_qr_redirects_qr_code_id ON public.qr_redirects(qr_code_id);
CREATE INDEX IF NOT EXISTS idx_qr_redirects_user_id ON public.qr_redirects(user_id);

-- Create scan_analytics table
CREATE TABLE IF NOT EXISTS public.scan_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    qr_redirect_id UUID NOT NULL REFERENCES public.qr_redirects(id) ON DELETE CASCADE,
    scanned_at TIMESTAMPTZ DEFAULT NOW(),
    user_agent TEXT,
    ip_hash TEXT,
    referrer TEXT
);

-- Create index for analytics queries
CREATE INDEX IF NOT EXISTS idx_scan_analytics_qr_redirect_id ON public.scan_analytics(qr_redirect_id);
CREATE INDEX IF NOT EXISTS idx_scan_analytics_scanned_at ON public.scan_analytics(scanned_at);

-- Enable Row Level Security
ALTER TABLE public.qr_redirects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for qr_redirects

-- Users can view their own QR codes
CREATE POLICY "Users can view own QR codes"
    ON public.qr_redirects
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own QR codes
CREATE POLICY "Users can insert own QR codes"
    ON public.qr_redirects
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own QR codes
CREATE POLICY "Users can update own QR codes"
    ON public.qr_redirects
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete their own QR codes
CREATE POLICY "Users can delete own QR codes"
    ON public.qr_redirects
    FOR DELETE
    USING (auth.uid() = user_id);

-- Allow public read access for redirect endpoint (only qr_code_id lookup)
CREATE POLICY "Public can read QR redirects by qr_code_id"
    ON public.qr_redirects
    FOR SELECT
    USING (true);

-- RLS Policies for scan_analytics

-- Users can view analytics for their own QR codes
CREATE POLICY "Users can view own analytics"
    ON public.scan_analytics
    FOR SELECT
    USING (
        qr_redirect_id IN (
            SELECT id FROM public.qr_redirects WHERE user_id = auth.uid()
        )
    );

-- Allow public insert for scan tracking (the redirect endpoint needs this)
CREATE POLICY "Public can insert scan analytics"
    ON public.scan_analytics
    FOR INSERT
    WITH CHECK (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on qr_redirects
DROP TRIGGER IF EXISTS update_qr_redirects_updated_at ON public.qr_redirects;
CREATE TRIGGER update_qr_redirects_updated_at
    BEFORE UPDATE ON public.qr_redirects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT ALL ON public.qr_redirects TO authenticated;
GRANT ALL ON public.scan_analytics TO authenticated;
GRANT SELECT, INSERT ON public.qr_redirects TO anon;
GRANT INSERT ON public.scan_analytics TO anon;
