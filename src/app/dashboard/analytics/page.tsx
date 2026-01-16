'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { QrCode, Plus, BarChart3, LogOut, ArrowLeft, TrendingUp, Smartphone, Calendar } from 'lucide-react'
import { Card } from '@/components/ui'
import { logout } from '../../(auth)/actions'
import { formatNumber } from '@/lib/utils'

interface AnalyticsData {
    totalQRCodes: number
    totalScans: number
    topQRCodes: Array<{
        id: string
        name: string
        scan_count: number
        qr_code_id: string
    }>
}

export default function AnalyticsPage() {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchAnalytics()
    }, [])

    const fetchAnalytics = async () => {
        try {
            const res = await fetch('/api/analytics')
            if (res.ok) {
                const data = await res.json()
                setAnalytics(data)
            }
        } catch (error) {
            console.error('Error fetching analytics:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="p-6 lg:p-10 max-w-6xl mx-auto">
            {/* Mobile Back Button */}
            <Link
                href="/dashboard"
                className="lg:hidden inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
            </Link>

            {/* Header */}
            <div className="mb-10">
                <h1 className="text-3xl font-light text-white mb-2 tracking-tight">
                    Analytics <span className="font-normal text-indigo-400">Overview</span>
                </h1>
                <p className="text-slate-400">
                    Track your QR code performance and engagement
                </p>
            </div>

            {/* Overview Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card className="p-6 bg-slate-900/40 backdrop-blur-xl border-white/5 shadow-xl hover:bg-slate-900/50 transition-colors group">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                            <QrCode className="w-7 h-7 text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Total QR Codes</p>
                            <p className="text-3xl font-bold text-white mt-1">
                                {isLoading ? '-' : analytics?.totalQRCodes || 0}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 bg-slate-900/40 backdrop-blur-xl border-white/5 shadow-xl hover:bg-slate-900/50 transition-colors group">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                            <TrendingUp className="w-7 h-7 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Total Scans</p>
                            <p className="text-3xl font-bold text-white mt-1">
                                {isLoading ? '-' : formatNumber(analytics?.totalScans || 0)}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 bg-slate-900/40 backdrop-blur-xl border-white/5 shadow-xl hover:bg-slate-900/50 transition-colors group">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                            <Smartphone className="w-7 h-7 text-cyan-400" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Avg. Scans/QR</p>
                            <p className="text-3xl font-bold text-white mt-1">
                                {isLoading
                                    ? '-'
                                    : analytics?.totalQRCodes
                                        ? Math.round((analytics.totalScans || 0) / analytics.totalQRCodes)
                                        : 0
                                }
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Top QR Codes */}
            <Card className="mb-8 bg-slate-900/40 backdrop-blur-xl border-white/5 shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-xl font-medium text-white">
                        Top Performing QR Codes
                    </h2>
                    <Calendar className="w-5 h-5 text-slate-500" />
                </div>

                <div className="p-6">
                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="animate-pulse flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-800 rounded-full" />
                                    <div className="flex-1">
                                        <div className="h-4 bg-slate-800 rounded w-1/3 mb-2" />
                                        <div className="h-3 bg-slate-800 rounded w-1/4" />
                                    </div>
                                    <div className="h-6 bg-slate-800 rounded w-16" />
                                </div>
                            ))}
                        </div>
                    ) : analytics?.topQRCodes && analytics.topQRCodes.length > 0 ? (
                        <div className="space-y-3">
                            {analytics.topQRCodes.map((qr, index) => (
                                <div
                                    key={qr.id}
                                    className="flex items-center gap-4 p-4 rounded-xl bg-slate-950/30 border border-white/5 hover:bg-slate-950/50 transition-colors group"
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg ${index === 0 ? 'bg-gradient-to-br from-yellow-500 to-amber-600' :
                                        index === 1 ? 'bg-gradient-to-br from-slate-400 to-slate-500' :
                                            index === 2 ? 'bg-gradient-to-br from-orange-700 to-amber-800' :
                                                'bg-slate-800'
                                        }`}>
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-white group-hover:text-indigo-300 transition-colors">
                                            {qr.name}
                                        </p>
                                        <p className="text-sm text-slate-500 font-mono">
                                            ID: <span className="text-slate-400">{qr.qr_code_id}</span>
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-white">
                                            {formatNumber(qr.scan_count)}
                                        </p>
                                        <p className="text-xs text-slate-500 uppercase tracking-wide">scans</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <BarChart3 className="w-8 h-8 text-slate-600" />
                            </div>
                            <h3 className="text-white font-medium mb-1">No data available</h3>
                            <p className="text-slate-500">
                                Create and share QR codes to see analytics.
                            </p>
                        </div>
                    )}
                </div>
            </Card>

            {/* Info Card */}
            <Card className="p-6 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 backdrop-blur-xl border-indigo-500/20 shadow-xl">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                        <BarChart3 className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-white mb-1">
                            Detailed Analytics Coming Soon
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            We&apos;re working on advanced analytics including scan trends over time,
                            device breakdown, geographic distribution, and more. Stay tuned!
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    )
}
