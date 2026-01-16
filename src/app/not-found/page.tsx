import Link from 'next/link'
import { QrCode, AlertCircle } from 'lucide-react'

export default function NotFoundPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 px-4">
            <div className="text-center">
                <div className="w-24 h-24 rounded-3xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-6">
                    <QrCode className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                </div>

                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    QR Code Not Found
                </h1>

                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
                    This QR code doesn&apos;t exist or may have been deleted.
                    Please check if you have the correct link.
                </p>

                <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium hover:from-violet-700 hover:to-indigo-700 transition-all shadow-lg shadow-violet-500/25"
                >
                    Return Home
                </Link>
            </div>
        </div>
    )
}
