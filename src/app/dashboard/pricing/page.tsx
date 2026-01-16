'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { QrCode, ArrowLeft, Check, Crown, Zap, Infinity } from 'lucide-react'
import { Button, Card } from '@/components/ui'

type Plan = 'pro' | 'ultimate'

export default function PricingPage() {
    const router = useRouter()
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
    const [showPaymentQR, setShowPaymentQR] = useState(false)
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // Check if returning from payment
    useEffect(() => {
        const pending = localStorage.getItem('pending_upgrade')
        if (pending) {
            setSelectedPlan(pending as Plan)
            setShowConfirmation(true)
        }
    }, [])

    const handleBuyClick = (plan: Plan) => {
        setSelectedPlan(plan)
        setShowPaymentQR(true)
        // Save to localStorage so we can check on return
        localStorage.setItem('pending_upgrade', plan)
    }

    const handlePaymentComplete = async () => {
        if (!selectedPlan) return

        setIsLoading(true)
        try {
            const res = await fetch('/api/subscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'upgrade',
                    tier: selectedPlan
                })
            })

            if (res.ok) {
                localStorage.removeItem('pending_upgrade')
                router.push('/dashboard')
            } else {
                alert('Failed to upgrade. Please contact support.')
            }
        } catch (error) {
            console.error('Upgrade error:', error)
            alert('An error occurred. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleNotPaid = () => {
        setShowConfirmation(false)
        setShowPaymentQR(true)
    }

    const plans = [
        {
            id: 'free',
            name: 'Free',
            price: '₹0',
            period: 'forever',
            icon: Zap,
            limit: 5,
            features: ['5 QR codes', 'Basic analytics', 'Standard support'],
            current: true
        },
        {
            id: 'pro',
            name: 'Pro',
            price: '₹299',
            period: '/month',
            icon: Crown,
            limit: 100,
            features: ['100 QR codes', 'Advanced analytics', 'Priority support', 'Custom branding'],
            popular: true
        },
        {
            id: 'ultimate',
            name: 'Ultimate',
            price: '₹999',
            period: '/month',
            icon: Infinity,
            limit: -1,
            features: ['Unlimited QR codes', 'Full analytics', 'Premium support', 'Custom branding', 'API access', 'Team collaboration'],
        }
    ]

    // Confirmation Modal - "Did you pay?"
    if (showConfirmation) {
        return (
            <div className="p-6 h-full flex items-center justify-center">
                <Card className="max-w-md w-full p-8 text-center bg-slate-900/40 backdrop-blur-xl border-white/10 shadow-2xl">
                    <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Crown className="w-10 h-10 text-yellow-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                        Welcome Back!
                    </h2>
                    <p className="text-slate-400 mb-8">
                        Did you complete the payment for <span className="font-semibold text-white">{selectedPlan?.toUpperCase()}</span> plan?
                    </p>
                    <div className="space-y-4">
                        <Button
                            onClick={handlePaymentComplete}
                            className="w-full bg-white text-slate-950 hover:bg-slate-200"
                            size="lg"
                            isLoading={isLoading}
                        >
                            Yes, I&apos;ve Paid!
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleNotPaid}
                            className="w-full border-white/10 text-slate-300 hover:text-white hover:bg-white/5"
                            size="lg"
                        >
                            No, Show Payment QR
                        </Button>
                        <button
                            onClick={() => {
                                localStorage.removeItem('pending_upgrade')
                                router.push('/dashboard')
                            }}
                            className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                        >
                            Cancel and go back
                        </button>
                    </div>
                </Card>
            </div>
        )
    }

    // Payment QR Modal
    if (showPaymentQR && selectedPlan) {
        const planDetails = plans.find(p => p.id === selectedPlan)

        return (
            <div className="p-6 h-full flex items-center justify-center">
                <Card className="max-w-md w-full p-8 text-center bg-slate-900/40 backdrop-blur-xl border-white/10 shadow-2xl">
                    <h2 className="text-2xl font-bold text-white mb-2">
                        Upgrade to {planDetails?.name}
                    </h2>
                    <p className="text-slate-400 mb-6">
                        Scan the QR code below to pay <span className="font-bold text-white">{planDetails?.price}</span>
                    </p>

                    <div className="bg-white rounded-2xl p-6 mb-6 inline-block shadow-inner">
                        <div className="w-48 h-48 bg-slate-100 rounded-xl flex items-center justify-center mx-auto overflow-hidden">
                            <img
                                src="/payment-qr.png"
                                alt="Payment QR Code"
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none'
                                    e.currentTarget.parentElement!.innerHTML = '<div class="text-center text-slate-400"><p class="text-4xl mb-2">📱</p><p class="text-sm">Payment QR</p></div>'
                                }}
                            />
                        </div>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-8 text-left">
                        <p className="text-sm text-yellow-200/80">
                            <strong className="text-yellow-200">Instructions:</strong><br />
                            1. Scan QR with any UPI app<br />
                            2. Pay {planDetails?.price}<br />
                            3. Click &quot;I&apos;ve Paid&quot; below
                        </p>
                    </div>

                    <div className="space-y-4">
                        <Button
                            onClick={handlePaymentComplete}
                            className="w-full bg-white text-slate-950 hover:bg-slate-200"
                            size="lg"
                            isLoading={isLoading}
                        >
                            I&apos;ve Paid - Activate {planDetails?.name}
                        </Button>
                        <button
                            onClick={() => {
                                setShowPaymentQR(false)
                                localStorage.removeItem('pending_upgrade')
                            }}
                            className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </Card>
            </div>
        )
    }

    // Main Pricing Page
    return (
        <div className="p-6 lg:p-10 max-w-6xl mx-auto">
            <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
            </Link>

            <div className="text-center mb-16">
                <h1 className="text-4xl font-light text-white mb-4 tracking-tight">
                    Choose Your <span className="font-normal text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">Plan</span>
                </h1>
                <p className="text-slate-400 max-w-xl mx-auto text-lg font-light">
                    Upgrade to create more QR codes and unlock premium features
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        onClick={() => !plan.current && handleBuyClick(plan.id as Plan)}
                        className={`relative p-8 rounded-3xl border transition-all duration-300 cursor-pointer group ${plan.popular
                            ? 'bg-slate-900/60 border-indigo-500/50 hover:border-indigo-400 hover:bg-slate-900/80 shadow-2xl shadow-indigo-500/10 scale-105 z-10'
                            : 'bg-slate-900/40 border-white/5 hover:border-white/10 hover:bg-slate-900/60 hover:-translate-y-1'
                            } backdrop-blur-xl`}
                    >
                        {plan.popular && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-semibold rounded-full shadow-lg">
                                Most Popular
                            </div>
                        )}

                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${plan.popular
                            ? 'bg-indigo-500/20 text-indigo-400'
                            : 'bg-white/5 text-slate-400 group-hover:text-white transition-colors'
                            }`}>
                            <plan.icon className="w-7 h-7" />
                        </div>

                        <h3 className="text-xl font-medium text-white mb-2">
                            {plan.name}
                        </h3>

                        <div className="mb-6 flex items-baseline gap-1">
                            <span className="text-4xl font-bold text-white">{plan.price}</span>
                            <span className="text-slate-500">
                                {plan.period}
                            </span>
                        </div>

                        <div className="text-sm mb-8 text-slate-400 font-medium">
                            {plan.limit === -1 ? 'Unlimited QR codes' : `Up to ${plan.limit} QR codes`}
                        </div>

                        <ul className="space-y-4 mb-8">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm">
                                    <Check className={`w-5 h-5 shrink-0 ${plan.popular ? 'text-indigo-400' : 'text-slate-600 group-hover:text-emerald-400'
                                        }`} />
                                    <span className="text-slate-300">
                                        {feature}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        {plan.current ? (
                            <button
                                disabled
                                className="w-full py-3 rounded-xl bg-white/5 text-slate-400 font-medium cursor-not-allowed border border-white/5"
                            >
                                Current Plan
                            </button>
                        ) : plan.popular ? (
                            <button
                                className="w-full py-3 rounded-xl bg-white text-slate-950 font-bold hover:bg-indigo-50 transition-all duration-200 shadow-lg shadow-white/5"
                            >
                                Upgrade to {plan.name}
                            </button>
                        ) : (
                            <Button
                                className="w-full bg-white/5 hover:bg-white/10 text-white border-white/5"
                                variant="outline"
                            >
                                Upgrade to {plan.name}
                            </Button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
