import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { customAlphabet } from 'nanoid'

// Utility for merging Tailwind classes
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// Generate unique QR code IDs (URL-safe, 10 characters)
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 10)
export function generateQRCodeId(): string {
    return nanoid()
}

// Format date for display
export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

// Format number with commas
export function formatNumber(num: number): string {
    return num.toLocaleString()
}

// Get the app URL
export function getAppUrl(): string {
    if (typeof window !== 'undefined') return window.location.origin
    return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
}

// Generate the redirect URL for a QR code
export function getRedirectUrl(qrCodeId: string): string {
    return `${getAppUrl()}/pay/${qrCodeId}`
}
