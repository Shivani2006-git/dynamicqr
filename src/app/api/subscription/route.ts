import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { User, SubscriptionTier } from '@/types/database'

// Helper to get current user ID from cookie
async function getCurrentUserId() {
    const cookieStore = await cookies()
    return cookieStore.get('user_id')?.value || null
}

// Subscription limits
const TIER_LIMITS: Record<SubscriptionTier, number> = {
    free: 5,
    pro: 100,
    ultimate: -1 // Unlimited
}

// GET - Get current subscription info
export async function GET() {
    try {
        const userId = await getCurrentUserId()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const supabase = await createClient()

        // Get user's subscription tier
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('subscription_tier, pending_upgrade')
            .eq('id', userId)
            .single()

        if (userError || !userData) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const user = userData as unknown as Pick<User, 'subscription_tier' | 'pending_upgrade'>
        const tier = user.subscription_tier || 'free'

        // Get QR code count
        const { count } = await supabase
            .from('qr_redirects')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)

        const limit = TIER_LIMITS[tier]
        const qrCount = count || 0

        return NextResponse.json({
            tier,
            pending_upgrade: user.pending_upgrade,
            qr_count: qrCount,
            qr_limit: limit,
            can_create: limit === -1 || qrCount < limit,
            remaining: limit === -1 ? 'Unlimited' : Math.max(0, limit - qrCount)
        })
    } catch (err) {
        console.error('Error fetching subscription:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST - Upgrade subscription
export async function POST(request: Request) {
    try {
        const userId = await getCurrentUserId()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const supabase = await createClient()
        const body = await request.json()
        const { action, tier } = body

        if (action === 'upgrade' && tier) {
            // Validate tier
            if (!['pro', 'ultimate'].includes(tier)) {
                return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
            }

            // Update user's subscription tier
            const { error } = await supabase
                .from('users')
                .update({
                    subscription_tier: tier,
                    pending_upgrade: null,
                    updated_at: new Date().toISOString()
                } as never)
                .eq('id', userId)

            if (error) {
                console.error('Upgrade error:', error)
                return NextResponse.json({ error: error.message }, { status: 500 })
            }

            return NextResponse.json({ success: true, tier })
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    } catch (err) {
        console.error('Error updating subscription:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
