'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  loading?: boolean
  title?: string
  description?: any
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
}

export default function AlertModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmLabel = 'Continue',
  cancelLabel = 'Cancel',
  variant = 'destructive'
}: AlertModalProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button disabled={loading} variant="outline" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button disabled={loading} variant={variant} onClick={onConfirm}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              confirmLabel
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
