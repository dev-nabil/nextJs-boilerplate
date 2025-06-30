import { Dialog, DialogContent, DialogDescription, DialogHeader } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { CustomModalProps } from '@/types'
import { DialogTitle } from '@radix-ui/react-dialog'

export default function CustomModal({ open, setOpen, className, children, title = '', description }: CustomModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className={cn(`max-w-lg rounded-lg bg-white`, className)}>
        {title || description ? (
          <>
            <DialogHeader className="h-auto font-bold">
              {title ? <DialogTitle className="text-lg font-bold sm:text-xl">{title}</DialogTitle> : null}
              {description ? <DialogDescription>{description}</DialogDescription> : null}
            </DialogHeader>
            <br />
          </>
        ) : null}

        {children}
      </DialogContent>
    </Dialog>
  )
}
