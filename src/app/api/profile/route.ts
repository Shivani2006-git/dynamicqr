import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// Helper to get current user ID from cookie
async function getCurrentUserId() {
    const cookieStore = await cookies()
    return cookieStore.get('user_id')?.value || null
}

// GET - Get current user profile
export async function GET() {
    try {
        const userId = await getCurrentUserId()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const supabase = await createClient()

        const { data, error } = await supabase
            .from('users')
            .select('email, name, subscription_tier, created_at')
            .eq('id', userId)
            .single()

        if (error || !data) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json(data)
    } catch (err) {
        console.error('Error fetching profile:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
