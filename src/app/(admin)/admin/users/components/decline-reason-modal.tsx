"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

interface DeclineReasonModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (reason: string) => Promise<void>
  sellerName: string
}

export default function DeclineReasonModal({ isOpen, onClose, onSubmit, sellerName }: DeclineReasonModalProps) {
  const [reason, setReason] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    // Validate reason
    if (!reason.trim()) {
      setError("Please provide a reason for declining verification")
      return
    }

    try {
      setIsSubmitting(true)
      setError("")
      await onSubmit(reason)
      // Reset form after successful submission
      setReason("")
    } catch (error) {
      // Error handling is done in the parent component
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setReason("")
    setError("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Decline Verification</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <p className="text-sm text-muted-foreground">
            Please provide a reason for declining the verification request for {sellerName}. This reason will be visible
            to the seller.
          </p>

          <div className="space-y-2">
            <Label htmlFor="decline-reason">Reason for declining</Label>
            <Textarea
              id="decline-reason"
              placeholder="Enter the reason for declining verification..."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value)
                if (e.target.value.trim()) setError("")
              }}
              className={error ? "border-red-500" : ""}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row">
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} variant="destructive">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
