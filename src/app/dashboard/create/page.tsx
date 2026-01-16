'use client'

import { useState } from 'react'
import { Button, Input, Card } from '@/components/ui'
import { QRCodeDisplay } from '@/components/qr'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Globe, CheckCircle } from 'lucide-react'
import { getRedirectUrl } from '@/lib/utils'

export default function CreateQRPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<{ qrCodeId: string; name: string; targetUrl: string } | null>(null)

    // Form state
    const [name, setName] = useState('')
    const [url, setUrl] = useState('')

    async function handleSubmit() {
        if (!name.trim() || !url.trim()) {
            setError('Please fill in all fields')
            return
        }

        // Basic URL validation
        let finalUrl = url.trim()
        if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
            finalUrl = 'https://' + finalUrl
        }

        try {
            new URL(finalUrl)
        } catch {
            setError('Please enter a valid URL')
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/qr', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name.trim(),
                    targetUrl: finalUrl
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create QR code')
            }

            setSuccess({ qrCodeId: data.qr_code_id, name: data.name, targetUrl: data.target_url })
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    // Success state
    if (success) {
        return (
            <div className="p-6 lg:p-10 max-w-2xl mx-auto h-full flex items-center justify-center">
                <Card className="p-8 text-center bg-slate-900/40 backdrop-blur-xl border-white/10 shadow-2xl w-full">
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-400" />
                    </div>
                    <h1 className="text-3xl font-light text-white mb-2 tracking-tight">
                        QR Code <span className="font-normal text-emerald-400">Created!</span>
                    </h1>
                    <p className="text-slate-400 mb-8">
                        Your QR code &quot;<span className="text-white">{success.name}</span>&quot; is ready to deploy.
                    </p>

                    <div className="bg-white rounded-2xl p-6 mb-8 shadow-inner inline-block">
                        <QRCodeDisplay
                            value={success.targetUrl}
                            size={200}
                            name={success.name}
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSuccess(null)
                                setName('')
                                setUrl('')
                            }}
                            className="bg-transparent border-white/10 text-white hover:bg-white/5 hover:border-white/20"
                        >
                            Create Another
                        </Button>
                        <Button
                            onClick={() => router.push('/dashboard')}
                            className="bg-white text-slate-950 hover:bg-slate-200"
                        >
                            Go to Dashboard
                        </Button>
                    </div>
                </Card>
            </div>
        )
    }

    // Create form
    return (
        <div className="p-6 lg:p-10 max-w-3xl mx-auto">
            <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
            </Link>

            <div className="flex items-center gap-4 mb-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-indigo-500/10 border border-indigo-500/20 flex items-center justify-center backdrop-blur-sm">
                    <Globe className="w-7 h-7 text-indigo-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-light text-white tracking-tight">
                        Create <span className="font-normal text-indigo-400">QR Code</span>
                    </h1>
                    <p className="text-slate-400">
                        Generate a dynamic QR code for any link
                    </p>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-950/30 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    {error}
                </div>
            )}

            <Card className="p-8 bg-slate-900/40 backdrop-blur-xl border-white/5 shadow-2xl">
                <div className="space-y-8">
                    <Input
                        label="QR Code Name"
                        placeholder="e.g., My Website, Portfolio, Menu"
                        value={name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                        hint="A friendly name to identify this QR code"
                        className="bg-slate-950/50 border-white/10 focus:border-white/20 text-white placeholder:text-slate-600"
                    />

                    <Input
                        label="Destination URL"
                        type="url"
                        placeholder="example.com or https://example.com"
                        value={url}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
                        hint="The link that opens when someone scans this QR code"
                        className="bg-slate-950/50 border-white/10 focus:border-white/20 text-white placeholder:text-slate-600"
                    />

                    {url && (
                        <div className="bg-slate-950/30 border border-white/5 rounded-2xl p-8 text-center animate-in fade-in duration-500">
                            <p className="text-sm text-slate-400 mb-6 uppercase tracking-wider font-medium">
                                Live Preview
                            </p>
                            <div className="bg-white p-4 rounded-xl inline-block shadow-lg">
                                <QRCodeDisplay
                                    value={url.startsWith('http') ? url : `https://${url}`}
                                    size={180}
                                    name="Preview"
                                    showActions={false}
                                />
                            </div>
                        </div>
                    )}

                    <Button
                        onClick={handleSubmit}
                        className="w-full bg-white text-slate-950 hover:bg-slate-200 border-none h-12 text-lg font-medium shadow-lg shadow-white/5"
                        size="lg"
                        isLoading={isLoading}
                    >
                        Generate QR Code
                    </Button>
                </div>
            </Card>
        </div>
    )
}
