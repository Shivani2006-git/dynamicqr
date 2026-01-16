'use client'

import { useState, useEffect } from 'react'
import { Input, Button, Card } from '@/components/ui'
import { buildUpiUrl, validateUpiId, UPIParams } from '@/lib/upi'
import { QRCodeDisplay } from './QRCodeDisplay'
import { getRedirectUrl } from '@/lib/utils'

interface UPIFormProps {
    onSubmit: (params: UPIParams & { name: string }) => Promise<void>
    isLoading?: boolean
    initialData?: Partial<UPIParams & { name: string }>
    qrCodeId?: string
    mode?: 'create' | 'edit'
}

export function UPIForm({
    onSubmit,
    isLoading,
    initialData,
    qrCodeId,
    mode = 'create'
}: UPIFormProps) {
    const [name, setName] = useState(initialData?.name || '')
    const [upiId, setUpiId] = useState(initialData?.upiId || '')
    const [merchantName, setMerchantName] = useState(initialData?.merchantName || '')
    const [amount, setAmount] = useState(initialData?.amount?.toString() || '')
    const [transactionNote, setTransactionNote] = useState(initialData?.transactionNote || '')

    const [errors, setErrors] = useState<Record<string, string>>({})
    const [previewUrl, setPreviewUrl] = useState('')

    // Update preview whenever fields change
    useEffect(() => {
        if (upiId && merchantName) {
            const url = buildUpiUrl({
                upiId,
                merchantName,
                amount: amount ? parseFloat(amount) : undefined,
                transactionNote: transactionNote || undefined,
            })
            setPreviewUrl(url)
        } else {
            setPreviewUrl('')
        }
    }, [upiId, merchantName, amount, transactionNote])

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {}

        if (!name.trim()) {
            newErrors.name = 'Please enter a name for this QR code'
        }

        if (!upiId.trim()) {
            newErrors.upiId = 'UPI ID is required'
        } else if (!validateUpiId(upiId)) {
            newErrors.upiId = 'Invalid UPI ID format (e.g., yourname@paytm)'
        }

        if (!merchantName.trim()) {
            newErrors.merchantName = 'Merchant name is required'
        }

        if (amount && (isNaN(parseFloat(amount)) || parseFloat(amount) < 0)) {
            newErrors.amount = 'Please enter a valid amount'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validate()) return

        await onSubmit({
            name,
            upiId,
            merchantName,
            amount: amount ? parseFloat(amount) : undefined,
            transactionNote: transactionNote || undefined,
        })
    }

    return (
        <div className="grid md:grid-cols-2 gap-8">
            {/* Form Section */}
            <Card gradient>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {mode === 'create' ? 'Create New QR Code' : 'Edit QR Code'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Configure your UPI payment details below
                        </p>
                    </div>

                    <Input
                        label="QR Code Name"
                        placeholder="e.g., Store Counter 1, Event Payment"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={errors.name}
                        hint="A friendly name to identify this QR code"
                    />

                    <Input
                        label="UPI ID"
                        placeholder="yourname@paytm"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        error={errors.upiId}
                        hint="Your Google Pay, PhonePe, or any UPI ID"
                    />

                    <Input
                        label="Merchant/Receiver Name"
                        placeholder="Your Business Name"
                        value={merchantName}
                        onChange={(e) => setMerchantName(e.target.value)}
                        error={errors.merchantName}
                        hint="Name shown to the payer"
                    />

                    <Input
                        label="Amount (Optional)"
                        type="number"
                        placeholder="Leave empty for variable amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        error={errors.amount}
                        hint="Fixed amount in INR, or leave empty to let payer enter"
                    />

                    <Input
                        label="Transaction Note (Optional)"
                        placeholder="e.g., Payment for Order #123"
                        value={transactionNote}
                        onChange={(e) => setTransactionNote(e.target.value)}
                        hint="Default note shown in payment app"
                    />

                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        isLoading={isLoading}
                    >
                        {mode === 'create' ? 'Create QR Code' : 'Save Changes'}
                    </Button>
                </form>
            </Card>

            {/* Preview Section */}
            <Card className="flex flex-col items-center justify-center text-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Live Preview
                </h3>

                {previewUrl ? (
                    <>
                        <QRCodeDisplay
                            value={qrCodeId ? getRedirectUrl(qrCodeId) : previewUrl}
                            name={name || 'qr-code'}
                            size={180}
                            showActions={!!qrCodeId}
                        />

                        <div className="mt-4 w-full">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                {qrCodeId ? 'Redirect URL (never changes):' : 'UPI Payment URL:'}
                            </p>
                            <code className="block text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-gray-700 dark:text-gray-300 break-all">
                                {qrCodeId ? getRedirectUrl(qrCodeId) : previewUrl}
                            </code>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                        <div className="w-32 h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex items-center justify-center">
                            <span className="text-4xl">📱</span>
                        </div>
                        <p className="mt-4 text-sm">
                            Enter UPI details to see preview
                        </p>
                    </div>
                )}
            </Card>
        </div>
    )
}
