import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn, userInitials } from '@/lib/utils'

export default function AvatarWithInfo({
  name,
  title,
  details,
  image,
  className,
  imageClass,
  active
}: {
  name: string
  title: string
  details?: string
  className?: string
  image?: string
  imageClass?: string
  active: boolean
}) {
  return (
    <div className={cn('my-4 flex items-center gap-1', className)}>
      <Avatar className={cn('h-[36px] w-[36px] rounded-full', imageClass)}>
        <AvatarImage width={400} height={400} src={image} alt="Profile Image" />
        <AvatarFallback className="text-white">{userInitials(name)}</AvatarFallback>
      </Avatar>
      <div className={cn('text-sm', active === true && 'text-[#71717A]')}>
        <h2 className={'font-bold'}>{title}</h2>
        <p className={'text-xs'}>{details}</p>
      </div>
    </div>
  )
}
