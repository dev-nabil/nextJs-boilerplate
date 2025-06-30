import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Loader } from 'lucide-react'

export default function SubmitButton({
  text = 'Save',
  isLoading = false,
  className,
  disabled = false,
  loadingClassName,
  size = 'lg',
  type = 'button'
}: {
  text?: string
  isLoading?: boolean
  className?: string
  disabled?: boolean
  loadingClassName?: string
  size?: 'lg' | 'sm' | 'md'
  type?: 'submit' | 'button' | 'reset'
}) {
  return (
    <>
      <Button
        size={size as any}
        type={type}
        className={cn('bg-primary flex items-center justify-center gap-2 text-white', className)}
        disabled={isLoading || disabled}
      >
        {text}
        {isLoading && <Loader className={cn('animate-spin text-[100px] text-white', loadingClassName)} />}
      </Button>
    </>
  )
}
