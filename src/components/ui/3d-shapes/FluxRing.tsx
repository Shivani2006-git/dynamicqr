export default function FluxRing({
    size = 200,
    color = 'border-violet-500',
    duration = 15,
    delay = 0,
    x = 50,
    y = 50,
    className = ''
}: {
    size?: number
    color?: string
    duration?: number
    delay?: number
    x?: number
    y?: number
    className?: string
}) {
    return (
        <div
            className={`absolute transform-style-3d pointer-events-none ${className}`}
            style={{
                left: `${x}%`,
                top: `${y}%`,
                width: `${size}px`,
                height: `${size}px`,
                marginLeft: `-${size / 2}px`,
                marginTop: `-${size / 2}px`,
                transform: `rotateX(60deg) rotateZ(45deg) translate(calc(var(--mouse-x-norm) * 40px), calc(var(--mouse-y-norm) * 40px))`
            }}
        >
            <div
                className={`absolute inset-0 rounded-full border-2 ${color}/30 box-shadow-glow animate-[spin-slow_10s_linear_infinite]`}
                style={{
                    animationDuration: `${duration}s`,
                    animationDelay: `${delay}s`
                }}
            />
            <div
                className={`absolute inset-4 rounded-full border ${color}/20 animate-[spin-slow_12s_linear_infinite_reverse]`}
            />
            <div
                className={`absolute inset-8 rounded-full border ${color}/10 animate-[spin-slow_15s_linear_infinite]`}
            />
        </div>
    )
}
