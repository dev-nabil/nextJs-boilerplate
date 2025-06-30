'use client'

import Loader from '@/components/custom/loader'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/use-auth'
import { userLogout } from '@/store/features/auth/authSlice'
import { useLogoutMutation } from '@/store/features/user/userApi'
import { LogOut, Settings, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { useDispatch } from 'react-redux'

export function NavUser() {
  const { user } = useAuth()
  const { replace } = useRouter()
  const [isPending, startTransition] = useTransition()
  const [logout, { isLoading }] = useLogoutMutation()
  const dispatch = useDispatch()

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

      // // Finally navigate after both operations are complete
      // startTransition(() => {
      //   replace("/auth/login")
      // })
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="hover:bg-accent relative flex items-center gap-2 rounded-full px-2 py-1.5">
            <Avatar className="h-7 w-7">
              <AvatarImage src={user?.avatar || user?.user?.avatar || ''} alt={user?.name || user?.user?.name || ''} />
              <AvatarFallback className="bg-primary/10 text-xs text-white">
                {user?.user?.name ? user?.user?.name.charAt(0).toUpperCase() : 'A'}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{user?.user?.name || 'Admin'}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="flex items-center gap-2 p-2">
            <div className="flex flex-col space-y-0.5">
              <p className="text-sm font-medium">{user?.user?.name || 'Admin'}</p>
              <p className="text-muted-foreground text-xs">{user?.user?.email || ''}</p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Change Password</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={isLoading || isPending}
            className="text-destructive focus:text-destructive cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>{isLoading || isPending ? 'Logging out...' : 'Log out'}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
