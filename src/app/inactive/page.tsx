import Link from 'next/link'
import { QrCode, PauseCircle } from 'lucide-react'

export default function InactivePage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 px-4">
            <div className="text-center">
                <div className="w-24 h-24 rounded-3xl bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center mx-auto mb-6">
                    <PauseCircle className="w-12 h-12 text-yellow-500" />
                </div>

                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    QR Code Inactive
                </h1>

                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
                    This QR code has been temporarily disabled by its owner.
                    Please contact them for more information.
                </p>

                <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium hover:from-violet-700 hover:to-indigo-700 transition-all shadow-lg shadow-violet-500/25"
                >
                    Learn About QRPay Manager
                </Link>
            </div>
        </div>
    )
}
