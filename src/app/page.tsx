'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { QrCode, ArrowRight, Sparkles, Zap, Shield, BarChart3 } from 'lucide-react'

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      setMousePosition({ x, y })
    }

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Volumetric Fog Effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(ellipse at ${50 + mousePosition.x * 10}% ${40 + mousePosition.y * 10}%, rgba(148, 163, 184, 0.15) 0%, transparent 50%)`,
            transform: `translateY(${scrollY * 0.1}px)`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/50" />
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-8 md:py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 md:gap-3 group">
            <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-all duration-500">
              <QrCode className="w-5 h-5 md:w-6 md:h-6 text-white/80 group-hover:text-white transition-colors" />
              <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
            </div>
            <span className="text-lg md:text-xl font-light text-white/80 tracking-wide group-hover:text-white transition-colors">
              QRLink
            </span>
          </Link>

          <div className="flex items-center gap-3 md:gap-6">
            <Link
              href="/login"
              className="text-sm md:text-base text-white/60 hover:text-white font-light tracking-wide transition-colors duration-300"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="group relative px-4 py-2 md:px-6 md:py-3 rounded-full overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-full group-hover:border-white/40 transition-all duration-500" />
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
              <span className="relative text-sm md:text-base text-white/80 group-hover:text-white font-light tracking-wide transition-colors">
                Get Started
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-4">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Cinematic Light Rays */}
          <div
            className="absolute w-[800px] h-[800px] opacity-20"
            style={{
              background: 'conic-gradient(from 0deg, transparent, rgba(255,255,255,0.1) 10%, transparent 20%)',
              transform: `rotate(${scrollY * 0.05}deg)`
            }}
          />
        </div>

        {/* Hero Text - Top */}
        <div
          className="relative z-10 text-center mb-12"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        >
          <h1 className="text-5xl md:text-8xl font-extralight text-white tracking-tight mb-6 drop-shadow-2xl">
            Dynamic <span className="font-normal text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-white to-slate-200">QR Codes</span>
          </h1>
          <p className="text-lg md:text-2xl text-white/60 font-light tracking-wide max-w-2xl mx-auto">
            Update your links anytime. Your QR code stays the same.
          </p>
        </div>

        {/* 3D Hero Element - Middle */}
        <div
          ref={heroRef}
          className="relative z-20 mb-12"
          style={{
            transform: `perspective(1000px) rotateX(${mousePosition.y * 5}deg) rotateY(${mousePosition.x * 5}deg)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          {/* Outer Glow Ring */}
          <div className="absolute -inset-20 rounded-full bg-gradient-to-r from-slate-400/10 via-white/5 to-slate-400/10 blur-3xl animate-pulse-slow" />

          {/* Main 3D QR Element */}
          <div className="relative w-64 h-64 md:w-[350px] md:h-[350px]">
            {/* Glass Container */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 shadow-2xl">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent" />
            </div>

            {/* Inner Glow */}
            <div className="absolute inset-8 rounded-2xl bg-gradient-to-br from-slate-300/20 to-slate-500/10 backdrop-blur-xl">
              <div className="absolute inset-0 flex items-center justify-center">
                <QrCode className="w-32 h-32 md:w-44 md:h-44 text-white/90" strokeWidth={1} />
              </div>
            </div>

            {/* Reflection */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent"
                style={{
                  transform: `translateX(${mousePosition.x * 20}px) translateY(${mousePosition.y * 20}px)`
                }}
              />
            </div>

            {/* Floating Elements */}
            <div
              className="absolute -top-8 -right-8 w-16 h-16 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform"
              style={{
                transform: `translateY(${Math.sin(Date.now() / 1000) * 10}px) rotate(${mousePosition.x * 10}deg)`
              }}
            >
              <Sparkles className="w-8 h-8 text-yellow-200" />
            </div>
            <div
              className="absolute -bottom-6 -left-6 w-14 h-14 rounded-xl bg-slate-900/50 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform"
              style={{
                transform: `translateY(${Math.cos(Date.now() / 1000) * 8}px) rotate(${-mousePosition.x * 8}deg)`
              }}
            >
              <Zap className="w-6 h-6 text-blue-200" />
            </div>
          </div>
        </div>

        {/* CTA Button - Bottom */}
        <div
          className="relative z-20"
          style={{ transform: `translateY(${-scrollY * 0.2}px)` }}
        >
          {/* CTA Button with Micro-interactions */}
          <Link href="/register" className="group inline-block">
            <div className="relative px-12 py-5 rounded-full overflow-hidden cursor-pointer shadow-2xl shadow-white/10 hover:shadow-white/20 transition-all duration-500">
              {/* Background */}
              <div className="absolute inset-0 bg-white rounded-full transition-transform duration-500 group-hover:scale-105" />

              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

              {/* Content */}
              <span className="relative flex items-center gap-3 text-slate-900 font-bold text-lg tracking-wide">
                Start Creating
                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>
        </div>

        {/* Scroll Indicator */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          style={{ opacity: Math.max(0, 1 - scrollY / 200) }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white/40 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Features Section with Parallax */}
      <section
        className="relative py-32 px-8"
        style={{ transform: `translateY(${Math.max(0, (scrollY - 400) * -0.1)}px)` }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extralight text-white tracking-tight mb-6">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-white">QRLink</span>
            </h2>
            <p className="text-white/40 font-light tracking-wide max-w-lg mx-auto">
              The most elegant solution for dynamic QR code management
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: 'Instant Updates', desc: 'Change your destination URL anytime without reprinting' },
              { icon: BarChart3, title: 'Analytics', desc: 'Track every scan with detailed real-time analytics' },
              { icon: Shield, title: 'Secure & Reliable', desc: '99.9% uptime with enterprise-grade security' }
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative p-8 rounded-3xl overflow-hidden cursor-pointer"
                style={{
                  transform: `translateY(${Math.max(0, (scrollY - 600 - i * 50) * -0.05)}px)`
                }}
              >
                {/* Card Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-3xl group-hover:border-white/30 transition-all duration-500" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />

                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <feature.icon className="w-7 h-7 text-white/70 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-light text-white mb-3 tracking-wide">{feature.title}</h3>
                  <p className="text-white/40 font-light leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative inline-block mb-10">
            <div className="absolute -inset-10 bg-gradient-to-r from-slate-400/20 via-white/10 to-slate-400/20 blur-3xl opacity-50" />
            <h2 className="relative text-4xl md:text-6xl font-extralight text-white tracking-tight">
              Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-white">Transform</span>
              <br />Your QR Experience?
            </h2>
          </div>

          <Link href="/register" className="group inline-block">
            <div className="relative px-12 py-5 rounded-full overflow-hidden cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-200 to-white rounded-full transition-all duration-500 group-hover:shadow-[0_0_60px_rgba(255,255,255,0.3)]" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative flex items-center gap-3 text-slate-900 font-medium text-lg tracking-wide">
                Create Free Account
                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-8 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <QrCode className="w-5 h-5 text-white/60" />
            </div>
            <span className="text-white/60 font-light">QRLink</span>
          </div>
          <p className="text-white/30 font-light text-sm tracking-wide">
            © 2026 QRLink. Crafted with precision.
          </p>
        </div>
      </footer>
    </div>
  )
}
