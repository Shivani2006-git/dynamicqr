'use client'

import { useState } from 'react'
import { Button, Input, Card } from '@/components/ui'
import { login } from '../actions'
import Link from 'next/link'
import { QrCode, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        setError(null)

        const result = await login(formData)

        if (result?.error) {
            setError(result.error)
        }

        setIsLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden px-4">
            {/* Volumetric Fog Effect */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800/20 via-slate-950/20 to-transparent opacity-40"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-indigo-900/10 via-slate-950/20 to-transparent opacity-30"></div>
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(10)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white/10 rounded-full animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${10 + Math.random() * 10}s`
                        }}
                    />
                ))}
            </div>

            <div className="relative w-full max-w-md z-10">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <div className="relative">
                    {/* Card Glow */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-slate-700/50 via-white/10 to-slate-700/50 rounded-3xl blur opacity-30"></div>

                    <Card className="p-8 bg-slate-900/40 backdrop-blur-xl border-white/10 shadow-2xl">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 text-white mb-4 shadow-inner">
                                <QrCode className="w-8 h-8 text-white/90" />
                            </div>
                            <h1 className="text-2xl font-bold text-white tracking-tight">
                                Welcome Back
                            </h1>
                            <p className="text-slate-400 mt-2">
                                Sign in to manage your QR codes
                            </p>
                        </div>

                        <form action={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="p-4 bg-red-950/30 border border-red-500/20 rounded-xl text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            <Input
                                name="email"
                                type="email"
                                label="Email Address"
                                placeholder="you@example.com"
                                required
                                className="bg-slate-950/50 border-white/10 focus:border-white/20 text-white placeholder:text-slate-600"
                            />

                            <Input
                                name="password"
                                type="password"
                                label="Password"
                                placeholder="••••••••"
                                required
                                className="bg-slate-950/50 border-white/10 focus:border-white/20 text-white placeholder:text-slate-600"
                            />

                            <Button
                                type="submit"
                                className="w-full bg-white text-slate-950 hover:bg-slate-200 transition-all font-semibold"
                                size="lg"
                                isLoading={isLoading}
                            >
                                Sign In
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm">
                            <span className="text-slate-500">
                                Don&apos;t have an account?{' '}
                            </span>
                            <Link
                                href="/register"
                                className="text-white/80 hover:text-white font-medium hover:underline transition-colors"
                            >
                                Sign up
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
