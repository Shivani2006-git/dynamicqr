'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { QrCode, Plus, BarChart3, LogOut, Search, ToggleLeft, ToggleRight, Trash2, Edit, ExternalLink } from 'lucide-react'
import { Button, Card } from '@/components/ui'
import { QRCodeDisplay } from '@/components/qr'
import { QRRedirect } from '@/types/database'
import { getRedirectUrl, formatDate, formatNumber } from '@/lib/utils'
import { logout } from '../(auth)/actions'

export default function DashboardPage() {
    const [qrCodes, setQrCodes] = useState<(QRRedirect & { redirect_url: string })[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [stats, setStats] = useState({ totalQRCodes: 0, totalScans: 0 })

    useEffect(() => {
        fetchQRCodes()
        fetchStats()
    }, [])

    const fetchQRCodes = async () => {
        try {
            const res = await fetch('/api/qr')
            if (res.ok) {
                const data = await res.json()
                setQrCodes(data)
            }
        } catch (error) {
            console.error('Error fetching QR codes:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/analytics')
            if (res.ok) {
                const data = await res.json()
                setStats(data)
            }
        } catch (error) {
            console.error('Error fetching stats:', error)
        }
    }

    const toggleActive = async (qr: QRRedirect) => {
        try {
            const res = await fetch('/api/qr', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: qr.id, isActive: !qr.is_active })
            })

            if (res.ok) {
                setQrCodes(prev => prev.map(q =>
                    q.id === qr.id ? { ...q, is_active: !q.is_active } : q
                ))
            }
        } catch (error) {
            console.error('Error toggling QR:', error)
        }
    }

    const deleteQR = async (id: string) => {
        if (!confirm('Are you sure you want to delete this QR code?')) return

        try {
            const res = await fetch(`/api/qr?id=${id}`, { method: 'DELETE' })

            if (res.ok) {
                setQrCodes(prev => prev.filter(q => q.id !== id))
            }
        } catch (error) {
            console.error('Error deleting QR:', error)
        }
    }

    const filteredQRCodes = qrCodes.filter(qr =>
        qr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        qr.target_url.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-light text-white tracking-tight">
                        My <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-white font-normal">QR Codes</span>
                    </h1>
                    <p className="text-slate-400 mt-2 font-light">
                        Manage and track your dynamic QR codes
                    </p>
                </div>
                <Link
                    href="/dashboard/create"
                    className="inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 px-4 py-2 text-sm gap-2 bg-white text-slate-950 hover:bg-slate-200 border-none shadow-lg shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Plus className="w-4 h-4" />
                    Create New QR
                </Link>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
                <Card className="flex items-center gap-6 p-6 bg-slate-900/40 backdrop-blur-xl border-white/5 hover:border-white/10 transition-colors">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 border border-indigo-500/10 flex items-center justify-center">
                        <QrCode className="w-7 h-7 text-indigo-400" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Total QR Codes</p>
                        <p className="text-3xl font-light text-white mt-1">{stats.totalQRCodes}</p>
                    </div>
                </Card>
                <Card className="flex items-center gap-6 p-6 bg-slate-900/40 backdrop-blur-xl border-white/5 hover:border-white/10 transition-colors">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/10 flex items-center justify-center">
                        <BarChart3 className="w-7 h-7 text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Total Scans</p>
                        <p className="text-3xl font-light text-white mt-1">{formatNumber(stats.totalScans)}</p>
                    </div>
                </Card>
                <Card className="flex items-center gap-6 p-6 bg-slate-900/40 backdrop-blur-xl border-white/5 hover:border-white/10 transition-colors">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/10 flex items-center justify-center">
                        <ToggleRight className="w-7 h-7 text-blue-400" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Active QR Codes</p>
                        <p className="text-3xl font-light text-white mt-1">
                            {qrCodes.filter(q => q.is_active).length}
                        </p>
                    </div>
                </Card>
            </div>

            {/* Search */}
            <div className="mb-8">
                <div className="relative max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search QR codes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/10 bg-slate-950/50 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-white/10 focus:border-white/20 transition-all outline-none"
                    />
                </div>
            </div>

            {/* QR Code Grid */}
            {isLoading ? (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <Card key={i} className="animate-pulse bg-slate-900/20 border-white/5 p-6 h-[400px]">
                            <div className="h-6 bg-slate-800 rounded w-3/4 mb-8" />
                            <div className="h-48 bg-slate-800 rounded mb-8" />
                            <div className="h-4 bg-slate-800 rounded w-1/2" />
                        </Card>
                    ))}
                </div>
            ) : filteredQRCodes.length === 0 ? (
                <Card className="text-center py-20 bg-slate-900/40 backdrop-blur-xl border-white/5 border-dashed">
                    <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center mx-auto mb-6">
                        <QrCode className="w-10 h-10 text-slate-600" />
                    </div>
                    <h3 className="text-xl font-medium text-white mb-2">
                        {searchQuery ? 'No QR codes found' : 'No QR codes yet'}
                    </h3>
                    <p className="text-slate-400 mb-8 max-w-sm mx-auto">
                        {searchQuery
                            ? 'Try searching with a different keyword'
                            : 'Create your first dynamic QR code to start tracking scans and managing your links.'
                        }
                    </p>
                    {searchQuery ? (
                        null
                    ) : (
                        <Link
                            href="/dashboard/create"
                            className="inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 px-4 py-2 text-sm gap-2 bg-white text-slate-950 hover:bg-slate-200 border-none shadow-lg shadow-white/5"
                        >
                            <Plus className="w-4 h-4" />
                            Create Your First QR
                        </Link>
                    )}
                </Card>
            ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredQRCodes.map((qr) => (
                        <Card key={qr.id} className="group p-6 bg-slate-900/40 backdrop-blur-xl border-white/5 hover:border-white/10 hover:bg-slate-900/60 transition-all duration-300">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h3 className="font-medium text-lg text-white group-hover:text-blue-200 transition-colors">
                                        {qr.name}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className={`w-1.5 h-1.5 rounded-full ${qr.is_active ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-slate-600'}`} />
                                        <p className="text-xs text-slate-500 font-mono truncate max-w-[180px]">
                                            {qr.target_url}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleActive(qr)}
                                    className="text-slate-600 hover:text-white transition-colors"
                                >
                                    {qr.is_active ? (
                                        <ToggleRight className="w-8 h-8 text-emerald-500/80 hover:text-emerald-400 transition-colors" />
                                    ) : (
                                        <ToggleLeft className="w-8 h-8 text-slate-600 hover:text-slate-400 transition-colors" />
                                    )}
                                </button>
                            </div>

                            <div className="flex justify-center mb-8 p-6 bg-white rounded-xl transform group-hover:scale-105 transition-transform duration-500 shadow-xl">
                                <QRCodeDisplay
                                    value={getRedirectUrl(qr.qr_code_id)}
                                    size={140}
                                    name={qr.name}
                                    showActions={false}
                                />
                            </div>

                            <div className="flex items-center justify-between text-xs text-slate-500 border-t border-white/5 pt-4">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1.5">
                                        <BarChart3 className="w-3 h-3" />
                                        {formatNumber(qr.scan_count)} scans
                                    </span>
                                    <span>{formatDate(qr.created_at)}</span>
                                </div>

                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                                    <Link href={`/dashboard/edit/${qr.id}`} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white" title="Edit">
                                        <Edit className="w-4 h-4" />
                                    </Link>
                                    <a
                                        href={getRedirectUrl(qr.qr_code_id)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                                        title="Open Link"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                    <button
                                        onClick={() => deleteQR(qr.id)}
                                        className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors text-slate-400"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
