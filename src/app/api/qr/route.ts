import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { generateQRCodeId, getRedirectUrl } from '@/lib/utils'
import { QRRedirect, QRRedirectInsert } from '@/types/database'

// Helper to get current user ID from cookie
async function getCurrentUserId() {
    const cookieStore = await cookies()
    return cookieStore.get('user_id')?.value || null
}

// GET - List all QR codes for the authenticated user
export async function GET() {
    try {
        const userId = await getCurrentUserId()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const supabase = await createClient()

        const { data, error } = await supabase
            .from('qr_redirects')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Type assertion and add redirect URL to each QR code
        const qrData = data as unknown as QRRedirect[] | null
        const qrCodes = (qrData || []).map(qr => ({
            ...qr,
            redirect_url: getRedirectUrl(qr.qr_code_id)
        }))

        return NextResponse.json(qrCodes)
    } catch (err) {
        console.error('Error fetching QR codes:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST - Create a new QR code
export async function POST(request: Request) {
    try {
        const userId = await getCurrentUserId()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const supabase = await createClient()

        // Check subscription limits
        const { data: userData } = await supabase
            .from('users')
            .select('subscription_tier')
            .eq('id', userId)
            .single()

        const tier = (userData as unknown as { subscription_tier?: string })?.subscription_tier || 'free'

        // Get current QR count
        const { count } = await supabase
            .from('qr_redirects')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)

        const qrCount = count || 0
        const limits: Record<string, number> = { free: 5, pro: 100, ultimate: -1 }
        const limit = limits[tier] ?? 5

        if (limit !== -1 && qrCount >= limit) {
            return NextResponse.json({
                error: `You've reached your limit of ${limit} QR codes. Please upgrade your plan.`,
                limit_reached: true
            }, { status: 403 })
        }

        const body = await request.json()
        const { name, targetUrl } = body

        // Validate required fields
        if (!name || !targetUrl) {
            return NextResponse.json({ error: 'Name and URL are required' }, { status: 400 })
        }

        // Generate unique QR code ID
        const qrCodeId = generateQRCodeId()

        // Prepare insert data
        const insertData: QRRedirectInsert = {
            user_id: userId,
            qr_code_id: qrCodeId,
            qr_type: 'website',
            name,
            target_url: targetUrl,
        }

        // Insert into database
        const { data, error } = await supabase
            .from('qr_redirects')
            .insert(insertData as never)
            .select()
            .single()

        if (error) {
            console.error('Database error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        const insertedData = data as unknown as QRRedirect

        return NextResponse.json({
            ...insertedData,
            redirect_url: getRedirectUrl(qrCodeId)
        }, { status: 201 })
    } catch (err) {
        console.error('Error creating QR code:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// PATCH - Update an existing QR code
export async function PATCH(request: Request) {
    try {
        const userId = await getCurrentUserId()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const supabase = await createClient()

        const body = await request.json()
        const { id, name, targetUrl, isActive } = body

        if (!id) {
            return NextResponse.json({ error: 'QR code ID is required' }, { status: 400 })
        }

        // Build update object
        const updates: Record<string, unknown> = {
            updated_at: new Date().toISOString()
        }

        if (name !== undefined) updates.name = name
        if (targetUrl !== undefined) updates.target_url = targetUrl
        if (isActive !== undefined) updates.is_active = isActive

        // Update in database
        const { data, error } = await supabase
            .from('qr_redirects')
            .update(updates as never)
            .eq('id', id)
            .eq('user_id', userId)
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        if (!data) {
            return NextResponse.json({ error: 'QR code not found' }, { status: 404 })
        }

        const updatedData = data as unknown as QRRedirect

        return NextResponse.json({
            ...updatedData,
            redirect_url: getRedirectUrl(updatedData.qr_code_id)
        })
    } catch (err) {
        console.error('Error updating QR code:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// DELETE - Delete a QR code
export async function DELETE(request: Request) {
    try {
        const userId = await getCurrentUserId()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const supabase = await createClient()

        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'QR code ID is required' }, { status: 400 })
        }

        // Delete the QR code
        const { error } = await supabase
            .from('qr_redirects')
            .delete()
            .eq('id', id)
            .eq('user_id', userId)

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error('Error deleting QR code:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
