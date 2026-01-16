'use client'

import { useState } from 'react'
import Link from 'next/link'
import { QrCode, Plus, BarChart3, LogOut, FileText, User, CreditCard, Menu, X } from 'lucide-react'
import { logout } from '../(auth)/actions'
import DashboardBackground from '@/components/ui/3d-shapes/DashboardBackground'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white selection:bg-white/20 relative overflow-hidden">
            {/* 3D Background Effects */}
            <DashboardBackground />



            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center">
                        <QrCode className="w-4 h-4 text-white/90" />
                    </div>
                    <span className="font-bold text-lg tracking-tight text-white/90">
                        QRLink
                    </span>
                </Link>
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 lg:hidden animate-in fade-in duration-200"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 h-full w-64 bg-slate-950/90 backdrop-blur-xl border-r border-white/5 z-50 
                transform transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:flex flex-col
            `}>
                <div className="p-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center group-hover:border-white/20 transition-all">
                            <QrCode className="w-5 h-5 text-white/90" />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-white/90 group-hover:text-white transition-colors">
                            QRLink
                        </span>
                    </Link>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <NavItem href="/dashboard" icon={FileText} label="My QR Codes" onClick={() => setIsSidebarOpen(false)} />
                    <NavItem href="/dashboard/create" icon={Plus} label="Create New" onClick={() => setIsSidebarOpen(false)} />
                    <NavItem href="/dashboard/analytics" icon={BarChart3} label="Analytics" onClick={() => setIsSidebarOpen(false)} />
                    <NavItem href="/dashboard/pricing" icon={CreditCard} label="Upgrade Plan" onClick={() => setIsSidebarOpen(false)} />
                </nav>

                <div className="p-4 space-y-2 border-t border-white/5">
                    <NavItem href="/dashboard/profile" icon={User} label="My Profile" onClick={() => setIsSidebarOpen(false)} />

                    <form action={logout}>
                        <button
                            type="submit"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all w-full text-sm font-medium group"
                        >
                            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            Sign Out
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="relative lg:ml-64 min-h-screen z-10 pt-20 lg:pt-0">
                {children}
            </main>
        </div>
    )
}

function NavItem({ href, icon: Icon, label, onClick }: { href: string; icon: any; label: string; onClick?: () => void }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all group"
        >
            <Icon className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
            <span className="text-sm font-medium">{label}</span>
        </Link>
    )
}
