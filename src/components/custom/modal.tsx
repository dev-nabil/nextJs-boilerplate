import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

type Props = {
  isOpen: boolean
  onClose: () => void
  header: string
  children: ReactNode
  contentClass?: string
}

export default function Modal({ isOpen, onClose, header, children, contentClass }: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn('', contentClass)}>
        <DialogHeader>
          <DialogTitle className="text-primary max-w-[28rem] break-words">{header}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}
