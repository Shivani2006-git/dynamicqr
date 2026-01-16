export default function FloatingCube({
    size = 100,
    color = 'bg-indigo-500',
    duration = 20,
    delay = 0,
    x = 0,
    y = 0
}: {
    size?: number
    color?: string
    duration?: number
    delay?: number
    x?: number
    y?: number
}) {
    return (
        <div
            className="absolute transform-style-3d pointer-events-none z-0"
            style={{
                left: `${x}%`,
                top: `${y}%`,
                width: `${size}px`,
                height: `${size}px`,
                animation: `float-slow ${duration}s ease-in-out infinite`,
                animationDelay: `${delay}s`,
                transform: `translate(calc(var(--mouse-x-norm) * 20px), calc(var(--mouse-y-norm) * 20px))`
            }}
        >
            <div className="relative w-full h-full transform-style-3d animate-[rotate-3d-slow_20s_linear_infinite]">
                {/* Front */}
                <div className={`absolute inset-0 ${color}/10 border border-white/20 backdrop-blur-sm`} style={{ transform: `translateZ(${size / 2}px)` }} />
                {/* Back */}
                <div className={`absolute inset-0 ${color}/10 border border-white/20 backdrop-blur-sm`} style={{ transform: `rotateY(180deg) translateZ(${size / 2}px)` }} />
                {/* Right */}
                <div className={`absolute inset-0 ${color}/10 border border-white/20 backdrop-blur-sm`} style={{ transform: `rotateY(90deg) translateZ(${size / 2}px)` }} />
                {/* Left */}
                <div className={`absolute inset-0 ${color}/10 border border-white/20 backdrop-blur-sm`} style={{ transform: `rotateY(-90deg) translateZ(${size / 2}px)` }} />
                {/* Top */}
                <div className={`absolute inset-0 ${color}/10 border border-white/20 backdrop-blur-sm`} style={{ transform: `rotateX(90deg) translateZ(${size / 2}px)` }} />
                {/* Bottom */}
                <div className={`absolute inset-0 ${color}/10 border border-white/20 backdrop-blur-sm`} style={{ transform: `rotateX(-90deg) translateZ(${size / 2}px)` }} />
            </div>
        </div>
    )
}
