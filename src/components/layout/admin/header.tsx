'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { userLogout } from '@/store/features/auth/authSlice'
import { useLogoutMutation } from '@/store/features/user/userApi'
import { Bell, Mail, Menu } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import AdminSidebar from './admin-nav' // Import AdminSidebar for mobile

interface AdminHeaderProps {
  user: {
    name: string
    email: string
    avatar: string
  }
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const pathname = usePathname()
  const [logout, { isLoading }] = useLogoutMutation()
  const dispatch = useDispatch()
  const { replace } = useRouter()

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

  return (
    <header
      className={cn(
        'fixed top-0 right-0 left-0 z-40 m-3 mx-5 flex h-20 items-center gap-4 rounded-2xl bg-[#F7F7F7] px-4 md:px-6 lg:left-64',
        pathname.includes('chat') && 'relative mx-auto max-w-7xl bg-white lg:left-0'
      )}
    >
      <div className="flex flex-1 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 lg:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col p-0">
            <AdminSidebar />
          </SheetContent>
        </Sheet>
        <div className="hidden lg:block">
          <h1 className="text-brand-dark-text text-lg font-semibold">Welcome {user?.name?.split(' ')[0]}</h1>
          <p className="text-brand-muted-text text-sm">Here's what's happening with your store today.</p>
        </div>
      </div>
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
    </header>
  )
}
