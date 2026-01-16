'use client'

import { QRCodeSVG } from 'qrcode.react'
import { Button } from '@/components/ui'
import { Download, Copy, Check } from 'lucide-react'
import { useState, useRef } from 'react'

interface QRCodeDisplayProps {
    value: string
    size?: number
    name?: string
    showActions?: boolean
    className?: string
}

export function QRCodeDisplay({
    value,
    size = 200,
    name = 'qr-code',
    showActions = true,
    className
}: QRCodeDisplayProps) {
    const [copied, setCopied] = useState(false)
    const qrRef = useRef<HTMLDivElement>(null)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    const handleDownload = () => {
        const svg = qrRef.current?.querySelector('svg')
        if (!svg) return

        // Create canvas from SVG
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()

        const svgData = new XMLSerializer().serializeToString(svg)
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
        const svgUrl = URL.createObjectURL(svgBlob)

        img.onload = () => {
            canvas.width = size * 2 // Higher resolution
            canvas.height = size * 2

            // White background
            ctx!.fillStyle = 'white'
            ctx!.fillRect(0, 0, canvas.width, canvas.height)

            // Draw QR
            ctx!.drawImage(img, 0, 0, canvas.width, canvas.height)

            // Download
            const pngUrl = canvas.toDataURL('image/png')
            const link = document.createElement('a')
            link.download = `${name}.png`
            link.href = pngUrl
            link.click()

            URL.revokeObjectURL(svgUrl)
        }

        img.src = svgUrl
    }

    return (
        <div className={className}>
            <div
                ref={qrRef}
                className="bg-white p-4 rounded-xl shadow-inner inline-block"
            >
                <QRCodeSVG
                    value={value}
                    size={size}
                    level="H"
                    includeMargin={false}
                    bgColor="#ffffff"
                    fgColor="#1a1a2e"
                />
            </div>

            {showActions && (
                <div className="flex gap-2 mt-4 justify-center">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownload}
                        className="gap-2"
                    >
                        <Download className="w-4 h-4" />
                        Download PNG
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopy}
                        className="gap-2"
                    >
                        {copied ? (
                            <>
                                <Check className="w-4 h-4 text-green-500" />
                                Copied!
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4" />
                                Copy Link
                            </>
                        )}
                    </Button>
                </div>
            )}
        </div>
    )
}
