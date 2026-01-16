'use client'

import { useEffect, useRef } from 'react'
import FloatingCube from './FloatingCube'
import FluxRing from './FluxRing'

export default function DashboardBackground() {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        let rafId: number

        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return

            // Normalize mouse position from -1 to 1
            const x = (e.clientX / window.innerWidth) * 2 - 1
            const y = (e.clientY / window.innerHeight) * 2 - 1

            // Use requestAnimationFrame to avoid thrashing
            cancelAnimationFrame(rafId)
            rafId = requestAnimationFrame(() => {
                if (containerRef.current) {
                    containerRef.current.style.setProperty('--mouse-x-norm', x.toFixed(4))
                    containerRef.current.style.setProperty('--mouse-y-norm', y.toFixed(4))
                }
            })
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            cancelAnimationFrame(rafId)
        }
    }, [])

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 overflow-hidden pointer-events-none perspective-1000 z-0 bg-transparent"
            style={{
                '--mouse-x-norm': '0',
                '--mouse-y-norm': '0'
            } as React.CSSProperties}
        >
            {/* Volumetric Fog / Glows - Updated to match Landing Page Slate Theme */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-slate-500/10 rounded-full blur-[120px] animate-[pulse-glow_8s_ease-in-out_infinite]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-slate-400/5 rounded-full blur-[100px] animate-[pulse-glow_10s_ease-in-out_infinite_reverse]" />
            <div className="absolute top-[40%] left-[30%] w-[400px] h-[400px] bg-white/5 rounded-full blur-[90px] animate-[float_20s_ease-in-out_infinite]" />

            {/* 3D Shapes */}

            {/* Top Right Cluster */}
            <FloatingCube size={80} x={85} y={15} color="bg-indigo-500" duration={25} delay={0} />
            {/* FluxRing removed as per user request */}

            {/* Bottom Left Cluster */}
            <FloatingCube size={120} x={10} y={75} color="bg-violet-500" duration={20} delay={5} />

            {/* Mid Floaters */}
            <FloatingCube size={60} x={30} y={40} color="bg-sky-500" duration={18} delay={2} />
            <FluxRing size={200} x={50} y={50} color="border-slate-400" duration={40} delay={10} className="hidden md:block" />

            {/* Distant Small Cubes */}
            <FloatingCube size={40} x={70} y={60} color="bg-indigo-300" duration={15} delay={8} />
            <FloatingCube size={30} x={20} y={20} color="bg-violet-300" duration={22} delay={12} />
        </div>
    )
}
