// Database types for Supabase
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type QRType = 'gpay' | 'website'

export type SubscriptionTier = 'free' | 'pro' | 'ultimate'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password_hash: string
          name: string | null
          subscription_tier: SubscriptionTier
          pending_upgrade: SubscriptionTier | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          name?: string | null
          subscription_tier?: SubscriptionTier
          pending_upgrade?: SubscriptionTier | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          name?: string | null
          subscription_tier?: SubscriptionTier
          pending_upgrade?: SubscriptionTier | null
          created_at?: string
          updated_at?: string
        }
      }
      qr_redirects: {
        Row: {
          id: string
          user_id: string
          qr_code_id: string
          qr_type: QRType
          name: string
          target_url: string
          upi_id: string | null
          merchant_name: string | null
          amount: number | null
          description: string | null
          is_active: boolean
          scan_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          qr_code_id: string
          qr_type?: QRType
          name: string
          target_url: string
          upi_id?: string | null
          merchant_name?: string | null
          amount?: number | null
          description?: string | null
          is_active?: boolean
          scan_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          qr_code_id?: string
          qr_type?: QRType
          name?: string
          target_url?: string
          upi_id?: string | null
          merchant_name?: string | null
          amount?: number | null
          description?: string | null
          is_active?: boolean
          scan_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      scan_analytics: {
        Row: {
          id: string
          qr_redirect_id: string
          scanned_at: string
          user_agent: string | null
          ip_hash: string | null
          referrer: string | null
        }
        Insert: {
          id?: string
          qr_redirect_id: string
          scanned_at?: string
          user_agent?: string | null
          ip_hash?: string | null
          referrer?: string | null
        }
        Update: {
          id?: string
          qr_redirect_id?: string
          scanned_at?: string
          user_agent?: string | null
          ip_hash?: string | null
          referrer?: string | null
        }
      }
    }
  }
}

export type User = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']

export type QRRedirect = Database['public']['Tables']['qr_redirects']['Row']
export type QRRedirectInsert = Database['public']['Tables']['qr_redirects']['Insert']
export type QRRedirectUpdate = Database['public']['Tables']['qr_redirects']['Update']

export type ScanAnalytics = Database['public']['Tables']['scan_analytics']['Row']
export type ScanAnalyticsInsert = Database['public']['Tables']['scan_analytics']['Insert']
