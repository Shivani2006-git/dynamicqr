import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// Helper to get current user ID from cookie
async function getCurrentUserId() {
    const cookieStore = await cookies()
    return cookieStore.get('user_id')?.value || null
}

// GET - Get analytics for a specific QR code or all QR codes
export async function GET(request: Request) {
    try {
        const userId = await getCurrentUserId()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const supabase = await createClient()

        const { searchParams } = new URL(request.url)
        const qrId = searchParams.get('qr_id')
        const days = parseInt(searchParams.get('days') || '30')

        // Calculate date range
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - days)

        if (qrId) {
            // Get analytics for specific QR code
            // First verify the QR belongs to this user
            const { data: qrCode } = await supabase
                .from('qr_redirects')
                .select('id')
                .eq('id', qrId)
                .eq('user_id', userId)
                .single()

            if (!qrCode) {
                return NextResponse.json({ error: 'QR code not found' }, { status: 404 })
            }

            const { data: analytics, error } = await supabase
                .from('scan_analytics')
                .select('*')
                .eq('qr_redirect_id', qrId)
                .gte('scanned_at', startDate.toISOString())
                .order('scanned_at', { ascending: false })

            if (error) {
                return NextResponse.json({ error: error.message }, { status: 500 })
            }

            // Type assertion for analytics data
            const scans = analytics as Array<{
                id: string
                qr_redirect_id: string
                scanned_at: string
                user_agent: string | null
                ip_hash: string | null
                referrer: string | null
            }> | null

            // Aggregate by day
            const dailyScans: Record<string, number> = {}
            scans?.forEach(scan => {
                const day = new Date(scan.scanned_at).toISOString().split('T')[0]
                dailyScans[day] = (dailyScans[day] || 0) + 1
            })

            // Device breakdown
            const devices: Record<string, number> = {}
            scans?.forEach(scan => {
                let device = 'Unknown'
                const ua = scan.user_agent?.toLowerCase() || ''
                if (ua.includes('android')) device = 'Android'
                else if (ua.includes('iphone') || ua.includes('ipad')) device = 'iOS'
                else if (ua.includes('mobile')) device = 'Mobile'
                else if (ua.includes('windows') || ua.includes('mac') || ua.includes('linux')) device = 'Desktop'
                devices[device] = (devices[device] || 0) + 1
            })

            return NextResponse.json({
                totalScans: scans?.length || 0,
                dailyScans,
                devices,
                recentScans: scans?.slice(0, 10)
            })
        } else {
            // Get aggregate analytics for all user's QR codes
            const { data: qrCodesData } = await supabase
                .from('qr_redirects')
                .select('id, name, scan_count, qr_code_id')
                .eq('user_id', userId)

            // Type assertion for qrCodes data
            const qrCodes = qrCodesData as Array<{
                id: string
                name: string
                scan_count: number
                qr_code_id: string
            }> | null

            if (!qrCodes || qrCodes.length === 0) {
                return NextResponse.json({
                    totalQRCodes: 0,
                    totalScans: 0,
                    topQRCodes: []
                })
            }

            const totalScans = qrCodes.reduce((sum, qr) => sum + qr.scan_count, 0)
            const topQRCodes = [...qrCodes]
                .sort((a, b) => b.scan_count - a.scan_count)
                .slice(0, 5)

            return NextResponse.json({
                totalQRCodes: qrCodes.length,
                totalScans,
                topQRCodes
            })
        }
    } catch (err) {
        console.error('Error fetching analytics:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
