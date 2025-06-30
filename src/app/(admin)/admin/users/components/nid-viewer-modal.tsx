'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, CheckCircle, CreditCard, Loader2, X } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import DeclineReasonModal from './decline-reason-modal'

interface NidViewerModalProps {
  isOpen: boolean
  onClose: () => void
  seller: any
  onVerify: (sellerId: string) => Promise<void>
  onDecline: (sellerId: string, reason: string) => Promise<void>
}

export default function NidViewerModal({ isOpen, onClose, seller, onVerify, onDecline }: NidViewerModalProps) {
  const [activeTab, setActiveTab] = useState('front')
  const [isVerifying, setIsVerifying] = useState(false)
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false)

  const hasNidNumber = !!seller?.nid
  const hasNidFront = !!seller?.nidFront
  const hasNidBack = !!seller?.nidBack

  const isVerified = seller?.verified === true
  const isFailed = seller?.verificationStatus === 'failed'

  const handleVerify = async () => {
    try {
      if (!seller?.id) return
      setIsVerifying(true)
      await onVerify(seller.id)
      onClose()
    } catch (error) {
      // Error is handled in the parent component
    } finally {
      setIsVerifying(false)
    }
  }

  const handleDeclineSubmit = async (reason: string) => {
    try {
      if (!seller?.id) return
      await onDecline(seller.id, reason)
      setIsDeclineModalOpen(false)
      onClose()
    } catch (error) {
      // Error is handled in the parent component
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              National ID Information
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Verification Status Badge */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Verification Status:</p>
              <div
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  isVerified ? 'bg-green-100 text-green-800' : isFailed ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {isVerified ? 'Verified' : isFailed ? 'Declined' : 'Pending'}
              </div>
            </div>

            {/* Seller Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="mb-1 text-sm font-medium">Seller Name:</p>
                <p className="text-sm">{seller?.user?.name ?? 'N/A'}</p>
              </div>
              {hasNidNumber && (
                <div>
                  <p className="mb-1 text-sm font-medium">NID Number:</p>
                  <p className="text-sm">{seller?.nid ?? 'N/A'}</p>
                </div>
              )}
            </div>

            {/* NID Images */}
            {hasNidFront || hasNidBack ? (
              <Tabs defaultValue="front" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="front" disabled={!hasNidFront}>
                    Front
                  </TabsTrigger>
                  <TabsTrigger value="back" disabled={!hasNidBack}>
                    Back
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="front">
                  {hasNidFront ? (
                    <Card>
                      <CardContent className="p-4">
                        <div className="relative aspect-[3/2] w-full overflow-hidden rounded-md">
                          <Image src={seller?.nidFront ?? '/placeholder.svg'} alt="NID Front" fill className="object-cover" />
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>Front side of NID not available</AlertDescription>
                    </Alert>
                  )}
                </TabsContent>

                <TabsContent value="back">
                  {hasNidBack ? (
                    <Card>
                      <CardContent className="p-4">
                        <div className="relative aspect-[3/2] w-full overflow-hidden rounded-md">
                          <Image src={seller?.nidBack ?? '/placeholder.svg'} alt="NID Back" fill className="object-cover" />
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>Back side of NID not available</AlertDescription>
                    </Alert>
                  )}
                </TabsContent>
              </Tabs>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>No NID documents available for this seller</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Action Buttons - Only show if not already verified and has NID documents */}
          {!isVerified && (hasNidFront || hasNidBack || hasNidNumber) && (
            <DialogFooter className="mt-2 flex flex-col sm:flex-row">
              <Button variant="outline" onClick={() => setIsDeclineModalOpen(true)} disabled={isVerifying} className="w-full sm:w-auto">
                <X className="mr-2 h-4 w-4" />
                Decline
              </Button>
              <Button onClick={handleVerify} disabled={isVerifying} className="w-full sm:w-auto">
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Verify Profile
                  </>
                )}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      <DeclineReasonModal
        isOpen={isDeclineModalOpen}
        onClose={() => setIsDeclineModalOpen(false)}
        onSubmit={handleDeclineSubmit}
        sellerName={seller?.user?.name ?? 'this seller'}
      />
    </>
  )
}
