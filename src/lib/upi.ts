// UPI URL utilities for Google Pay and other UPI apps

export interface UPIParams {
    upiId: string
    merchantName: string
    amount?: number
    transactionNote?: string
    transactionId?: string
    currency?: string
}

/**
 * Build a UPI payment URL from parameters
 * Format: upi://pay?pa=UPI_ID&pn=NAME&am=AMOUNT&tn=NOTE&tr=TXN_ID&cu=CURRENCY
 */
export function buildUpiUrl(params: UPIParams): string {
    const { upiId, merchantName, amount, transactionNote, transactionId, currency = 'INR' } = params

    const url = new URL('upi://pay')

    // Required parameters
    url.searchParams.set('pa', upiId) // Payee Address (UPI ID)
    url.searchParams.set('pn', merchantName) // Payee Name

    // Optional parameters
    if (amount && amount > 0) {
        url.searchParams.set('am', amount.toFixed(2)) // Amount
    }

    if (transactionNote) {
        url.searchParams.set('tn', transactionNote) // Transaction Note
    }

    if (transactionId) {
        url.searchParams.set('tr', transactionId) // Transaction Reference
    }

    url.searchParams.set('cu', currency) // Currency

    return url.toString()
}

/**
 * Parse a UPI URL into its components
 */
export function parseUpiUrl(upiUrl: string): UPIParams | null {
    try {
        // Handle both upi:// and upi:/ formats
        const cleanUrl = upiUrl.replace('upi://pay?', 'https://upi.parse/?').replace('upi:/pay?', 'https://upi.parse/?')
        const url = new URL(cleanUrl)

        const upiId = url.searchParams.get('pa')
        const merchantName = url.searchParams.get('pn')

        if (!upiId || !merchantName) {
            return null
        }

        return {
            upiId,
            merchantName,
            amount: url.searchParams.get('am') ? parseFloat(url.searchParams.get('am')!) : undefined,
            transactionNote: url.searchParams.get('tn') || undefined,
            transactionId: url.searchParams.get('tr') || undefined,
            currency: url.searchParams.get('cu') || 'INR',
        }
    } catch {
        return null
    }
}

/**
 * Validate a UPI ID format
 * Valid formats: username@bankhandle, phone@upi, etc.
 */
export function validateUpiId(upiId: string): boolean {
    // Basic UPI ID validation: should be in format something@something
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/
    return upiRegex.test(upiId)
}

/**
 * Common UPI bank handles for reference
 */
export const commonUPIHandles = [
    'oksbi',
    'okhdfc',
    'okicici',
    'okaxis',
    'okhdfcbank',
    'ybl', // PhonePe
    'paytm',
    'apl', // Amazon Pay
    'upi',
    'gpay', // Google Pay
    'ibl', // ICICI Bank
    'sbi',
    'axisbank',
    'hdfcbank',
]
