import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { userLogout } from '@/store/features/auth/authSlice'
import { useLogoutMutation } from '@/store/features/user/userApi'
import { Bell, Mail } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'

interface AdminHeaderProps {
  user: {
    name: string
    email: string
    avatar: string
  }
}
export function SiteHeader({ user }: AdminHeaderProps) {
  const [logout, { isLoading }] = useLogoutMutation()
  const dispatch = useDispatch()
  const { replace } = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    try {
      // Then call the logout API
      await logout(null)
        .unwrap()
        .then(() => {
          dispatch(userLogout())
          replace('/')
          window.location.reload()
        })
    } catch (err) {
      console.error('Logout error:', err)
    }
  }
  const { toggleSidebar, isMobile, state, openMobile, setOpenMobile } = useSidebar()
  console.log({ toggleSidebar, isMobile, state, openMobile, setOpenMobile, check: state == 'expanded' }, 'check sidebar state ')
  return (
    <header
      className={cn(
        'sticky top-4 z-40 flex h-20 gap-4 rounded-2xl bg-[#F7F7F7] transition-all duration-300',
        state == 'expanded' ? '' : '',
        isMobile ? '' : '',
        pathname.includes('chat') && 'relative mx-auto max-w-7xl bg-white lg:left-0'
      )}
      style={{
        transitionProperty: 'margin-left,left,right,width,background-color',
        transitionDuration: '250ms',
        transitionTimingFunction: 'ease'
      }}
    >
      <div className="flex w-full items-center justify-between gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center gap-3 md:gap-4">
          <Link href={'/chat'} className="text-brand-muted-text hover:text-brand-teal rounded-full">
            <Mail className="h-5 w-5" />
            <span className="sr-only">Messages</span>
          </Link>
          <Button variant="ghost" size="icon" className="text-brand-muted-text hover:text-brand-teal rounded-full">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.avatar || '/placeholder.svg'} alt={user?.name} />
                  <AvatarFallback>{user?.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm leading-none font-medium">{user?.name}</p>
                  <p className="text-muted-foreground text-xs leading-none">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled={isLoading} onClick={handleLogout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
