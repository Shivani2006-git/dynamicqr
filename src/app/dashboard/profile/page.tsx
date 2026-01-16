'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { User, Mail, Calendar, Crown, Zap, Infinity, ArrowLeft, QrCode } from 'lucide-react'
import { Button, Card } from '@/components/ui'

interface UserProfile {
    email: string
    name: string | null
    subscription_tier: 'free' | 'pro' | 'ultimate'
    created_at: string
}

interface SubscriptionInfo {
    tier: string
    qr_count: number
    qr_limit: number
    remaining: number | string
}

export default function ProfilePage() {
    const [user, setUser] = useState<UserProfile | null>(null)
    const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchProfile()
        fetchSubscription()
    }, [])

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/profile')
            if (res.ok) {
                const data = await res.json()
                setUser(data)
            }
        } catch (error) {
            console.error('Error fetching profile:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const fetchSubscription = async () => {
        try {
            const res = await fetch('/api/subscription')
            if (res.ok) {
                const data = await res.json()
                setSubscription(data)
            }
        } catch (error) {
            console.error('Error fetching subscription:', error)
        }
    }

    const getTierIcon = (tier: string) => {
        switch (tier) {
            case 'ultimate': return <Infinity className="w-6 h-6" />
            case 'pro': return <Crown className="w-6 h-6" />
            default: return <Zap className="w-6 h-6" />
        }
    }

    const getTierColor = (tier: string) => {
        switch (tier) {
            case 'ultimate': return 'from-purple-500 to-pink-500'
            case 'pro': return 'from-yellow-500 to-orange-500'
            default: return 'from-gray-400 to-gray-500'
        }
    }

    const getTierName = (tier: string) => {
        switch (tier) {
            case 'ultimate': return 'Ultimate'
            case 'pro': return 'Pro'
            default: return 'Free'
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center">
                <div className="animate-pulse text-gray-500">Loading...</div>
            </div>
        )
    }

    return (
        <div className="p-6 lg:p-10 max-w-4xl mx-auto">
            <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
            </Link>

            <h1 className="text-3xl font-light text-white mb-8 tracking-tight">
                My <span className="font-normal text-indigo-400">Profile</span>
            </h1>

            <div className="space-y-6">
                {/* User Info Card */}
                <Card className="p-8 bg-slate-900/40 backdrop-blur-xl border-white/5 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700" />

                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-indigo-500/20">
                            {user?.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                            <h2 className="text-2xl font-bold text-white mb-2">
                                {user?.name || 'User'}
                            </h2>
                            <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-400 mb-3">
                                <Mail className="w-4 h-4" />
                                <span>{user?.email}</span>
                            </div>
                            <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-500 text-sm bg-white/5 px-3 py-1 rounded-full inline-flex">
                                <Calendar className="w-3 h-3" />
                                <span>Member since {user?.created_at ? formatDate(user.created_at) : 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Subscription Card */}
                <Card className="p-8 bg-slate-900/40 backdrop-blur-xl border-white/5 shadow-2xl overflow-hidden relative group">
                    <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${getTierColor(subscription?.tier || 'free')} opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity duration-700`} />

                    <h3 className="text-lg font-medium text-slate-400 mb-6 uppercase tracking-wider text-sm">
                        Current Plan
                    </h3>

                    <div className="flex items-center gap-6 mb-8 relative z-10">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getTierColor(subscription?.tier || 'free')} flex items-center justify-center text-white shadow-lg`}>
                            {getTierIcon(subscription?.tier || 'free')}
                        </div>
                        <div>
                            <h4 className="text-3xl font-bold text-white mb-1">
                                {getTierName(subscription?.tier || 'free')} <span className="font-light text-slate-400">Plan</span>
                            </h4>
                            <p className="text-slate-400">
                                {subscription?.tier === 'ultimate'
                                    ? 'Unlimited access to all features'
                                    : `${subscription?.qr_limit || 5} active QR codes limit`
                                }
                            </p>
                        </div>
                    </div>

                    {/* Usage Stats */}
                    <div className="bg-slate-950/50 rounded-2xl p-6 mb-8 border border-white/5 relative z-10">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-slate-400 font-medium">QR Codes Used</span>
                            <span className="font-bold text-white">
                                <span className="text-indigo-400">{subscription?.qr_count || 0}</span>
                                <span className="text-slate-600 mx-1">/</span>
                                {subscription?.qr_limit === -1 ? '∞' : subscription?.qr_limit || 5}
                            </span>
                        </div>
                        {subscription?.qr_limit !== -1 && (
                            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-indigo-500 to-violet-500 h-2 rounded-full transition-all duration-1000 ease-out"
                                    style={{
                                        width: `${Math.min(100, ((subscription?.qr_count || 0) / (subscription?.qr_limit || 5)) * 100)}%`
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Upgrade Button */}
                    {subscription?.tier !== 'ultimate' && (
                        <Link
                            href="/dashboard/pricing"
                            className="inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 px-4 py-2 w-full gap-2 bg-white text-slate-950 hover:bg-indigo-50 shadow-lg shadow-white/5 border-none h-12 text-lg"
                        >
                            <Crown className="w-5 h-5 text-indigo-600" />
                            Upgrade Plan
                        </Link>
                    )}
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-6">
                    <Card className="p-6 text-center bg-slate-900/40 backdrop-blur-xl border-white/5 shadow-xl hover:bg-slate-900/50 transition-colors">
                        <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mx-auto mb-4">
                            <QrCode className="w-6 h-6 text-violet-400" />
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">
                            {subscription?.qr_count || 0}
                        </p>
                        <p className="text-sm text-slate-400 font-medium">Total QR Codes</p>
                    </Card>
                    <Card className="p-6 text-center bg-slate-900/40 backdrop-blur-xl border-white/5 shadow-xl hover:bg-slate-900/50 transition-colors">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getTierColor(subscription?.tier || 'free')} opacity-80 mx-auto mb-4 flex items-center justify-center text-white`}>
                            {getTierIcon(subscription?.tier || 'free')}
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">
                            {typeof subscription?.remaining === 'string'
                                ? '∞'
                                : subscription?.remaining || 5
                            }
                        </p>
                        <p className="text-sm text-slate-400 font-medium">Remaining Slots</p>
                    </Card>
                </div>
            </div>
        </div>
    )
}
