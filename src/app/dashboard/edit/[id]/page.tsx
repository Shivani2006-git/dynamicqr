'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { QrCode, ArrowLeft, CheckCircle, Trash2 } from 'lucide-react'
import { QRCodeDisplay } from '@/components/qr'
import { Card, Button, Input } from '@/components/ui'
import { QRRedirect } from '@/types/database'
import { getRedirectUrl, formatDate, formatNumber } from '@/lib/utils'

export default function EditQRPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const [qrCode, setQrCode] = useState<QRRedirect | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [success, setSuccess] = useState(false)

    // Form state
    const [name, setName] = useState('')
    const [targetUrl, setTargetUrl] = useState('')

    useEffect(() => {
        fetchQRCode()
    }, [id])

    const fetchQRCode = async () => {
        try {
            const res = await fetch('/api/qr')
            if (res.ok) {
                const data = await res.json()
                const found = data.find((q: QRRedirect) => q.id === id)
                if (found) {
                    setQrCode(found)
                    setName(found.name)
                    setTargetUrl(found.target_url)
                } else {
                    router.push('/dashboard')
                }
            }
        } catch (error) {
            console.error('Error fetching QR code:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async () => {
        if (!name.trim() || !targetUrl.trim()) {
            alert('Please fill in all fields')
            return
        }

        setIsSaving(true)

        try {
            const res = await fetch('/api/qr', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: qrCode?.id,
                    name: name.trim(),
                    targetUrl: targetUrl.trim(),
                }),
            })

            if (res.ok) {
                setSuccess(true)
                setTimeout(() => {
                    router.push('/dashboard')
                }, 1500)
            } else {
                const error = await res.json()
                alert(error.error || 'Failed to update QR code')
            }
        } catch (error) {
            console.error('Error updating QR:', error)
            alert('Failed to update QR code. Please try again.')
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this QR code? This action cannot be undone.')) {
            return
        }

        try {
            const res = await fetch(`/api/qr?id=${qrCode?.id}`, { method: 'DELETE' })

            if (res.ok) {
                router.push('/dashboard')
            } else {
                alert('Failed to delete QR code')
            }
        } catch (error) {
            console.error('Error deleting QR:', error)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center">
                <div className="animate-pulse text-gray-500">Loading...</div>
            </div>
        )
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center px-6">
                <Card className="max-w-md w-full text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Changes Saved!
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        Your QR code has been updated. The same QR code will now redirect to your new link.
                    </p>
                    <p className="text-sm text-gray-400">
                        Redirecting to dashboard...
                    </p>
                </Card>
            </div>
        )
    }

    if (!qrCode) {
        return null
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
            {/* Header */}
            <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-10">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/dashboard"
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </Link>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center">
                                    <QrCode className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-semibold text-gray-900 dark:text-white">Edit QR Code</span>
                            </div>
                        </div>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleDelete}
                            className="gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-6 md:px-6 md:py-10 max-w-6xl">
                <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-2">
                        <div className="mb-6 lg:mb-8">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Edit: {qrCode.name}
                            </h1>
                            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
                                Update the destination URL. The QR code stays the same!
                            </p>
                        </div>

                        <Card gradient className="p-4 md:p-6 mb-6 lg:mb-0">
                            <div className="space-y-4 md:space-y-5">
                                <Input
                                    label="QR Code Name"
                                    placeholder="e.g., My Website"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />

                                <Input
                                    label="Destination URL"
                                    type="url"
                                    placeholder="https://example.com"
                                    value={targetUrl}
                                    onChange={(e) => setTargetUrl(e.target.value)}
                                    hint="The link that opens when someone scans this QR code"
                                />

                                <Button
                                    onClick={handleSubmit}
                                    className="w-full"
                                    size="lg"
                                    isLoading={isSaving}
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </Card>
                    </div>

                    {/* Info Sidebar */}
                    <div className="space-y-4 md:space-y-6">
                        <Card className="p-6">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-center lg:text-left">
                                Your Static QR Code
                            </h3>
                            <div className="flex justify-center mb-6">
                                <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
                                    <QRCodeDisplay
                                        value={getRedirectUrl(qrCode.qr_code_id)}
                                        size={180}
                                        name={qrCode.name}
                                        showActions={true}
                                    />
                                </div>
                            </div>
                            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                                <p className="mb-1">This QR code never changes.</p>
                                <p>Print it once, update the link anytime.</p>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                                Statistics
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-800 last:border-0">
                                    <span className="text-gray-500 dark:text-gray-400">Total Scans</span>
                                    <span className="font-bold text-gray-900 dark:text-white text-lg">
                                        {formatNumber(qrCode.scan_count)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-800 last:border-0">
                                    <span className="text-gray-500 dark:text-gray-400">Created</span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {formatDate(qrCode.created_at)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-800 last:border-0">
                                    <span className="text-gray-500 dark:text-gray-400">Last Updated</span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {formatDate(qrCode.updated_at)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-1 last:border-0">
                                    <span className="text-gray-500 dark:text-gray-400">Status</span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${qrCode.is_active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                        {qrCode.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                        </Card>

                        <Card className="bg-violet-50 dark:bg-violet-900/20 border-violet-200/50 dark:border-violet-800/50 p-4">
                            <h3 className="font-semibold text-violet-900 dark:text-violet-100 mb-2 flex items-center gap-2">
                                <span className="text-xl">💡</span> Pro Tip
                            </h3>
                            <p className="text-sm text-violet-700 dark:text-violet-300 leading-relaxed">
                                Change the destination URL anytime. Anyone who scans the existing QR code will be redirected to your new link.
                            </p>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}
