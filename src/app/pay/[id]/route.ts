import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { Database, QRRedirect, ScanAnalyticsInsert } from '@/types/database'
import crypto from 'crypto'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const qrCodeId = id

    try {
        const cookieStore = await cookies()

        // Create Supabase client
        const supabase = createServerClient<Database>(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll() { },
                },
            }
        )

        // Query the database for this QR code
        const { data, error } = await supabase
            .from('qr_redirects')
            .select('*')
            .eq('qr_code_id', qrCodeId)
            .single()

        // Type assertion
        const qrRedirect = data as unknown as QRRedirect | null

        if (error || !qrRedirect) {
            // QR code not found
            return NextResponse.redirect(new URL('/not-found', request.url))
        }

        if (!qrRedirect.is_active) {
            // QR code is disabled
            return NextResponse.redirect(new URL('/inactive', request.url))
        }

        // Log scan analytics (non-blocking)
        const userAgent = request.headers.get('user-agent') || ''
        const forwarded = request.headers.get('x-forwarded-for')
        const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
        const ipHash = crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16)
        const referrer = request.headers.get('referer') || ''

        // Prepare analytics insert data
        const analyticsData: ScanAnalyticsInsert = {
            qr_redirect_id: qrRedirect.id,
            user_agent: userAgent,
            ip_hash: ipHash,
            referrer: referrer,
        }

        // Insert analytics asynchronously (fire and forget)
        void supabase
            .from('scan_analytics')
            .insert(analyticsData as never)
            .then(() => {
                // Also increment scan count
                void supabase
                    .from('qr_redirects')
                    .update({ scan_count: qrRedirect.scan_count + 1 } as never)
                    .eq('id', qrRedirect.id)
            })

        // Redirect to the target UPI URL
        return NextResponse.redirect(qrRedirect.target_url)

    } catch (err) {
        console.error('Redirect error:', err)
        return NextResponse.redirect(new URL('/error', request.url))
    }
}
