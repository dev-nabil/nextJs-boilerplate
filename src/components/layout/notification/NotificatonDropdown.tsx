'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAuth } from '@/hooks/use-auth'
import { buyerRoutes, sellerRoutes } from '@/routes/routes'
import {
  useGetNotificationsQuery,
  useReadAllNotificationMutation,
  useReadNotificationMutation
} from '@/store/features/notification/notificationApi'
import { useSocketRevalidate } from '@/store/socketConectApi'
import { INotificationProps, IProposalData, notificationCategoryProps, notificationType } from '@/types'
import { DropdownMenu } from '@radix-ui/react-dropdown-menu'
import {
  ArrowDownCircle,
  Bell,
  CheckCircle,
  Coins,
  CreditCard,
  Crown,
  DollarSign,
  Mail,
  MessageSquare,
  Shield,
  User,
  UserCheck,
  XCircle
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'

const NotificationDropdown = () => {
  const fetchedNotificationIds = useRef<Set<string>>(new Set())
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [page, setPage] = useState(1)
  const [allNotifications, setAllNotifications] = useState<INotificationProps[]>([])
  const { user } = useAuth()
  const { data: notificationsData, isLoading, isFetching, refetch } = useGetNotificationsQuery({ page, limit: 10 })
  const [readNotification] = useReadNotificationMutation()
  const [readAllNotification] = useReadAllNotificationMutation()

  useSocketRevalidate(refetch)
  const unreadCount = notificationsData?.totalUnread || 0
  const { ref, inView } = useInView({
    threshold: 1,
    triggerOnce: false
  })

  // Append new notifications to the list
  useEffect(() => {
    if (notificationsData?.docs.length > 0) {
      // setAllNotifications(prev => [...notifications, ...prev])
      const newItems = notificationsData.docs.filter((n: INotificationProps) => !fetchedNotificationIds.current.has(n.id))

      // Add new IDs to the Set
      newItems.forEach((n: INotificationProps) => fetchedNotificationIds.current.add(n.id))

      setAllNotifications(prev => [...newItems, ...prev])
    }
  }, [notificationsData])

  // When inView, go to next page
  useEffect(() => {
    if (inView && !isFetching && notificationsData.hasNextPage) {
      setPage(prev => prev + 1)
    }
  }, [inView])

  const handleMarkAsRead = (id: string) => {
    setAllNotifications(prev => prev.map(notification => (notification.id === id ? { ...notification, read: true } : notification)))
    readNotification({ id })
      .unwrap()
      .then(() => {
        // Optionally, you can update the local state to reflect the change
        // setIsOpen(false)
      })
      .catch(error => {
        console.error('Failed to mark notification as read:', error)
      })
  }

  const handleMarkAllAsRead = async () => {
    setAllNotifications(prev => prev.map(notification => ({ ...notification, read: true })))
    await readAllNotification({})
  }

  return (
    <div className="sm:relative" ref={dropdownRef}>
      {/* Notification Bell Icon */}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="relative cursor-pointer p-2" onClick={() => setIsOpen(!isOpen)}>
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-80">
          <div className="mt-2 !h-[calc(100vh-65px)] rounded-lg sm:!h-[calc(100vh-300px)]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <h3 className="font-semibold text-gray-900">Notifications</h3>
              </div>
              {unreadCount > 0 && (
                <Button
                  variant="default"
                  size="sm"
                  className="cursor-pointer border-none bg-transparent text-sm text-blue-500 shadow-none hover:bg-transparent hover:text-blue-600"
                  onClick={handleMarkAllAsRead}
                >
                  Mark all as read
                </Button>
              )}
            </div>

            {/* Notifications List */}
            <ScrollArea className="!h-[calc(100%-65px)] overflow-y-auto">
              <div className="p-2">
                {isLoading ? (
                  <div className="space-y-1">
                    {Array.from({ length: 10 }).map((_, index) => (
                      <NotificationShimmer key={index} />
                    ))}
                  </div>
                ) : allNotifications.length > 0 ? (
                  <div className="space-y-2">
                    {allNotifications.map((notification, index) => {
                      let data: IProposalData | undefined

                      if (notification.data && typeof notification.data === 'string') {
                        try {
                          data = JSON.parse(notification.data) as IProposalData
                        } catch {
                          data = undefined
                        }
                      } else {
                        data = notification.data as IProposalData | undefined
                      }

                      const url = redirectToUrl(notification.category, data, user?.user?.role?.name)

                      return url !== false ? (
                        <Link href={url || ''} key={index} onClick={() => setIsOpen(prev => !prev)} className="block">
                          <NotificationItem notification={notification} onMarkAsRead={handleMarkAsRead} />
                        </Link>
                      ) : (
                        <NotificationItem key={index} notification={notification} onMarkAsRead={handleMarkAsRead} />
                      )
                    })}

                    {/* This div is the trigger for loading next page */}
                    <div className={`relative ${!notificationsData.hasNextPage && 'hidden'}`}>
                      <div ref={ref} className="h-5" />
                      {(isFetching || isLoading) && (
                        <div className="absolute inset-0 mt-4 flex items-center justify-center">
                          <Bell className="text-primary animate-bounce" />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    <Bell className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                    <p>No notifications</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Notification Dropdown */}
    </div>
  )
}

export default NotificationDropdown

const NotificationItem = ({ notification, onMarkAsRead }: { notification: INotificationProps; onMarkAsRead: (id: string) => void }) => {
  const styling = getTypeBasedStyling(notification.type, notification.read)

  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id)
    }
  }

  return (
    <div className={`flex cursor-pointer items-start gap-3 rounded-lg p-3 ${styling.container}`} onClick={handleClick}>
      {/* Icon */}
      <div className="mt-0.5 flex-shrink-0">{getNotificationIcon(notification.category)}</div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            {/* Title */}
            <p className={`text-sm leading-tight font-semibold ${styling.titleColor}`}>{notification.title}</p>

            {/* Message */}
            {notification.message && (
              <p className={`line-clamp-2 text-xs leading-relaxed ${styling.messageColor}`}>{notification.message}</p>
            )}

            {/* Meta information */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">{formatRelativeTime(notification.createdAt)}</span>
              <span className="text-xs text-gray-300">•</span>
              <Badge
                variant="outline"
                className={`text-xs font-medium ${(notification.category === 'waiting_for_payment' || notification.category === 'admin_release_payment' || notification.category === 'project_complete_confirmation') && '!text-[10px]'} ${getCategoryColor(notification.category)}`}
              >
                {notification.category
                  .split('_')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}
              </Badge>
            </div>
          </div>

          {/* Unread indicator */}
          {!notification.read && (
            <div className="mt-1 flex-shrink-0">
              <div className={`h-2.5 w-2.5 rounded-full ${styling.unreadDot} animate-pulse`}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const NotificationShimmer = () => (
  <div className="flex animate-pulse items-start gap-2 rounded-lg p-2 sm:gap-3 sm:p-3">
    <div className="mt-0.5 flex-shrink-0 sm:mt-1">
      <div className="h-4 w-4 rounded bg-gray-300"></div>
    </div>
    <div className="min-w-0 flex-1">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="mb-2 h-4 w-3/4 rounded bg-gray-300"></div>
          <div className="mb-2 h-3 w-full rounded bg-gray-200"></div>
          <div className="mt-1 flex items-center gap-1 sm:mt-2 sm:gap-2">
            <div className="h-3 w-12 rounded bg-gray-200"></div>
            <div className="h-3 w-16 rounded bg-gray-200"></div>
          </div>
        </div>
        <div className="mt-1 flex-shrink-0">
          <div className="h-2 w-2 rounded-full bg-gray-300"></div>
        </div>
      </div>
    </div>
  </div>
)

// Function to format the date into a human-readable relative time
// use in a blog page
export const formatRelativeTime = (dateString: string): string => {
  const now = new Date()
  const date = new Date(dateString) // Convert string to Date object

  const diffInMilliseconds = now.getTime() - date.getTime()

  const seconds = Math.floor(diffInMilliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30) // Approximate months
  const years = Math.floor(days / 365) // Approximate years

  if (seconds < 60) {
    return `just now`
  } else if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
  } else if (hours < 24) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`
  } else if (days < 30) {
    return `${days} day${days !== 1 ? 's' : ''} ago`
  } else if (months < 12) {
    return `${months} month${months !== 1 ? 's' : ''} ago`
  } else {
    return `${years} year${years !== 1 ? 's' : ''} ago`
  }
}

const getTypeBasedStyling = (type: notificationType, read: boolean) => {
  const baseStyles = 'transition-all duration-200 ease-in-out'

  switch (type) {
    case 'success':
      return {
        container: `${baseStyles}  ${read ? 'bg-green-50/50 hover:bg-green-50' : 'bg-green-50 hover:bg-green-100 shadow-sm'}`,
        unreadDot: 'bg-green-500',
        titleColor: 'text-green-900',
        messageColor: 'text-green-700'
      }
    case 'warning':
      return {
        container: `${baseStyles}  ${read ? 'bg-amber-50/50 hover:bg-amber-50' : 'bg-amber-50 hover:bg-amber-100 shadow-sm'}`,
        unreadDot: 'bg-amber-500',
        titleColor: 'text-amber-900',
        messageColor: 'text-amber-700'
      }
    case 'error':
      return {
        container: `${baseStyles} ${read ? 'bg-red-50/50 hover:bg-red-50' : 'bg-red-50 hover:bg-red-100 shadow-sm'}`,
        unreadDot: 'bg-red-500',
        titleColor: 'text-red-900',
        messageColor: 'text-red-700'
      }
    default:
      return {
        container: `${baseStyles} shadow ${read ? 'bg-gray-50/50 hover:bg-gray-50' : 'bg-blue-50 hover:bg-blue-100 shadow-sm'}`,
        unreadDot: 'bg-blue-500',
        titleColor: 'text-gray-900',
        messageColor: 'text-gray-700'
      }
  }
}

const getNotificationIcon = (type: notificationCategoryProps) => {
  switch (type) {
    case 'subscription':
      return <Crown className="h-4 w-4 text-purple-500" />
    case 'boost':
      return <Crown className="h-4 w-4 text-green-500" />
    case 'connect':
      return <Coins className="h-4 w-4 text-yellow-500" />
    case 'waiting_for_payment':
      return <CreditCard className="h-4 w-4 text-blue-500" />
    case 'payment_complete':
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case 'system':
    case 'admin_release_payment':
      return <Shield className="h-4 w-4 text-gray-500" />
    case 'proposal':
      return <MessageSquare className="h-4 w-4 text-blue-500" />
    case 'decline':
    case 'cancel_project':
    case 'decline_contract':
      return <XCircle className="h-4 w-4 text-red-500" />
    case 'accept_contract':
      return <UserCheck className="h-4 w-4 text-blue-500" />
    case 'payment_request':
      return <DollarSign className="h-4 w-4 text-blue-500" />
    case 'payment_release':
      return <DollarSign className="h-4 w-4 text-green-500" />
    case 'invite':
      return <Mail className="h-4 w-4 text-purple-500" />
    case 'hire':
      return <User className="h-4 w-4 text-green-500" />
    case 'payment_success':
      return <CheckCircle className="h-4 w-4 text-blue-500" />
    case 'bid':
      return <CreditCard className="h-4 w-4 text-gray-500" />
    case 'withdrawal':
      return <ArrowDownCircle className="h-4 w-4 text-blue-500" />
    case 'project_complete_confirmation':
      return <CheckCircle className="h-4 w-4 text-green-500" />
    default:
      return <Bell className="h-4 w-4 text-gray-500" />
  }
}

const getCategoryColor = (category: notificationCategoryProps) => {
  switch (category) {
    case 'subscription':
      return 'bg-purple-100 text-purple-700'
    case 'boost':
      return 'bg-green-100 text-green-700'
    case 'connect':
      return 'bg-yellow-100 text-yellow-700'
    case 'waiting_for_payment':
      return 'bg-blue-100 text-blue-700'
    case 'payment_complete':
      return 'bg-green-100 text-green-700'
    case 'system':
    case 'admin_release_payment':
      return 'bg-green-100 text-gray-700'
    case 'proposal':
      return 'bg-blue-100 text-blue-700'
    case 'decline':
    case 'cancel_project':
    case 'decline_contract':
      return 'bg-red-100 text-red-700'
    case 'accept_contract':
      return 'bg-blue-100 text-blue-700'
    case 'payment_request':
      return 'bg-blue-100 text-blue-700'
    case 'payment_release':
      return 'bg-green-100 text-green-700'
    case 'invite':
      return 'bg-purple-100 text-purple-700'
    case 'hire':
      return 'bg-green-100 text-green-700'
    case 'payment_success':
      return 'bg-blue-100 text-blue-700'
    case 'bid':
      return 'bg-green-100 text-gray-700'
    case 'withdrawal':
      return 'bg-blue-100 text-blue-700'
    case 'project_complete_confirmation':
      return 'bg-green-100 text-green-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

const redirectToUrl = (
  category: notificationCategoryProps,
  data?: IProposalData | undefined,
  userRole?: 'buyer' | 'seller' | 'no-user'
) => {
  switch (category) {
    case 'subscription':
      return false
    case 'boost':
      return false
    case 'connect':
      return null
    case 'waiting_for_payment':
      return buyerRoutes.contractDetails(data?.contractId || '', category)
    case 'payment_complete':
      return false
    case 'system':
      return false
    case 'admin_release_payment':
      if (userRole === 'buyer') {
        return buyerRoutes.contractDetails(data?.contractId || '', 'release-payment')
      } else if (userRole === 'seller') {
        return sellerRoutes.inProgressJob(data?.contractId || '')
      } else {
        return false
      }
    case 'proposal':
      if (userRole === 'buyer') {
        return buyerRoutes.proposalView(data?.proposalId || '')
      } else if (userRole === 'seller') {
        return false
      } else {
        return false
      }
    case 'decline':
    case 'cancel_project':
    case 'decline_contract':
      if (userRole === 'buyer') {
        return buyerRoutes.contractDetails(data?.contractId || '', category)
      } else if (userRole === 'seller') {
        return sellerRoutes.contract(data?.contractId || '')
      } else {
        return false
      }
    case 'accept_contract':
      return false
    case 'payment_request':
      return buyerRoutes.contractDetails(data?.contractId || '', category)
    case 'payment_release':
      return sellerRoutes.inProgressJob(data?.contractId || '')
    case 'invite':
      return sellerRoutes.invitation(data?.projectId || '')
    case 'hire':
      return sellerRoutes.contract(data?.contractId || '')
    case 'payment_success':
      if (userRole === 'buyer') {
        return buyerRoutes.contractDetails(data?.contractId || '', category)
      } else if (userRole === 'seller') {
        return sellerRoutes.inProgressJob(data?.contractId || '')
      } else {
        return false
      }
    case 'bid':
      return false
    case 'withdrawal':
      return false

    case 'project_complete_confirmation':
    case 'review':
      if (userRole === 'buyer') {
        return buyerRoutes.contractDetails(data?.contractId || '', category)
      } else if (userRole === 'seller') {
        return sellerRoutes.completed(data?.contractId || '')
      } else {
        return false
      }
    default:
      return false
  }
}

// working code

// 'use client'
// import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'
// import { ScrollArea } from '@/components/ui/scroll-area'
// import { useAuth } from '@/hooks/use-auth'
// import { buyerRoutes, sellerRoutes } from '@/routes/routes'
// import {
//   useGetNotificationsQuery,
//   useReadAllNotificationMutation,
//   useReadNotificationMutation
// } from '@/store/features/notification/notificationApi'
// import { useSocketRevalidate } from '@/store/socketConectApi'
// import { INotificationProps, IProposalData, notificationCategoryProps, notificationType } from '@/types'
// import {
//   ArrowDownCircle,
//   Bell,
//   CheckCircle,
//   Coins,
//   CreditCard,
//   Crown,
//   DollarSign,
//   Mail,
//   MessageSquare,
//   Shield,
//   User,
//   UserCheck,
//   XCircle
// } from 'lucide-react'
// import Link from 'next/link'
// import { useEffect, useRef, useState } from 'react'

// export default function NotificationDropdown() {
//   const [page, setPage] = useState(1)
//   const [allNotifications, setAllNotifications] = useState<INotificationProps[]>([])
//   // ============= notification data form rtk query============
//   const { data: notificationsData, isLoading: notificationLoading, refetch } = useGetNotificationsQuery({ page })
//   useSocketRevalidate(refetch)
//   const { user } = useAuth()
//   console.log(user.user, 'user in notification dropdown')
// const [readNotification] = useReadNotificationMutation()
// const [readAllNotification] = useReadAllNotificationMutation()
//   //==============  notification data form rtk query==============

//   console.log(notificationsData, 'notificationsData')

//   const [isOpen, setIsOpen] = useState(false)
//   // const [notifications, setNotifications] = useState(notificationJsonData)
//   const notifications = notificationsData?.docs as INotificationProps[]

//   const dropdownRef = useRef<HTMLDivElement>(null)

//   const unreadCount = notifications?.filter(n => !n.read).length

// const handleMarkAsRead = (id: string) => {
//   console.log(id, 'red id')
//   readNotification({ id })
//     .unwrap()
//     .then(() => {
//       // Optionally, you can update the local state to reflect the change
//       // setIsOpen(false)
//     })
//     .catch(error => {
//       console.error('Failed to mark notification as read:', error)
//     })
// }

// const handleMarkAllAsRead = async () => {
//   await readAllNotification({})
// }

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setIsOpen(false)
//       }
//     }

//     document.addEventListener('mousedown', handleClickOutside)
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside)
//     }
//   }, [])

//   return (
//     <div className="sm:relative" ref={dropdownRef}>
//       {/* Notification Bell Icon */}
//       <div className="relative cursor-pointer p-2" onClick={() => setIsOpen(!isOpen)}>
//         <Bell className="h-5 w-5" />
//         {unreadCount > 0 && (
//           <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
//             {unreadCount > 9 ? '9+' : unreadCount}
//           </span>
//         )}
//       </div>

//       {/* Notification Dropdown */}
//       {isOpen && (
//         <div className="absolute top-full right-0 z-50 mt-2 !h-[calc(100vh-100px)] w-80 rounded-lg border border-gray-200 bg-white shadow-lg">
//           {/* Header */}
//           <div className="flex items-center justify-between border-b border-gray-200 p-4">
//             <div className="flex items-center gap-2">
//               <Bell className="h-5 w-5" />
//               <h3 className="font-semibold text-gray-900">Notifications</h3>
//             </div>
//             {unreadCount > 0 && (
//               <Button
//                 variant="default"
//                 size="sm"
//                 className="cursor-pointer border-none bg-transparent text-sm text-blue-500 shadow-none hover:bg-transparent hover:text-blue-600"
//                 onClick={handleMarkAllAsRead}
//               >
//                 Mark all as read
//               </Button>
//             )}
//           </div>

//           {/* Notifications List */}
//           <ScrollArea className="!h-[calc(100%-80px)] overflow-y-auto">
//             <div className="p-2">
//               {notificationLoading ? (
//                 <div className="space-y-1">
//                   {Array.from({ length: 10 }).map((_, index) => (
//                     <NotificationShimmer key={index} />
//                   ))}
//                 </div>
//               ) : notifications.length > 0 ? (
//                 <div className="space-y-2">
//                   {notifications.map((notification: INotificationProps) => {
//                     let data: IProposalData | undefined = undefined
//                     if (notification.data && typeof notification.data === 'string') {
//                       try {
//                         data = JSON.parse(notification.data) as IProposalData
//                       } catch (e) {
//                         data = undefined
//                       }
//                     } else {
//                       data = notification.data as IProposalData | undefined
//                     }
//                     console.log(data, 'this is data *********')
//                     return redirectToUrl(notification.category, data, user?.user?.role?.name) !== false ? (
//                       <Link
//                         href={`${redirectToUrl(notification.category, data, user?.user?.role?.name)}`}
//                         key={notification.id}
//                         onClick={() => setIsOpen(!isOpen)}
//                         className="block"
//                       >
//                         <NotificationItem key={notification.id} notification={notification} onMarkAsRead={handleMarkAsRead} />
//                       </Link>
//                     ) : (
//                       <NotificationItem key={notification.id} notification={notification} onMarkAsRead={handleMarkAsRead} />
//                     )
//                   })}
//                 </div>
//               ) : (
//                 <div className="py-8 text-center text-gray-500">
//                   <Bell className="mx-auto mb-2 h-8 w-8 text-gray-300" />
//                   <p>No notifications</p>
//                 </div>
//               )}
//             </div>
//           </ScrollArea>
//         </div>
//       )}
//     </div>
//   )
// }

// const NotificationItem = ({ notification, onMarkAsRead }: { notification: INotificationProps; onMarkAsRead: (id: string) => void }) => {
//   const styling = getTypeBasedStyling(notification.type, notification.read)

//   const handleClick = () => {
//     if (!notification.read) {
//       onMarkAsRead(notification.id)
//     }
//   }

//   return (
//     <div className={`flex cursor-pointer items-start gap-3 rounded-lg p-3 ${styling.container}`} onClick={handleClick}>
//       {/* Icon */}
//       <div className="mt-0.5 flex-shrink-0">{getNotificationIcon(notification.category)}</div>

//       {/* Content */}
//       <div className="min-w-0 flex-1">
//         <div className="flex items-start justify-between gap-3">
//           <div className="flex-1 space-y-2">
//             {/* Title */}
//             <p className={`text-sm leading-tight font-semibold ${styling.titleColor}`}>{notification.title}</p>

//             {/* Message */}
//             {notification.message && (
//               <p className={`line-clamp-2 text-xs leading-relaxed ${styling.messageColor}`}>{notification.message}</p>
//             )}

//             {/* Meta information */}
//             <div className="flex items-center gap-2">
//               <span className="text-xs font-medium text-gray-500">{formatRelativeTime(notification.createdAt)}</span>
//               <span className="text-xs text-gray-300">•</span>
//               <Badge
//                 variant="outline"
//                 className={`text-xs font-medium ${(notification.category === 'waiting_for_payment' || notification.category === 'admin_release_payment' || notification.category === 'project_complete_confirmation') && '!text-[10px]'} ${getCategoryColor(notification.category)}`}
//               >
//                 {notification.category
//                   .split('_')
//                   .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//                   .join(' ')}
//               </Badge>
//             </div>
//           </div>

//           {/* Unread indicator */}
//           {!notification.read && (
//             <div className="mt-1 flex-shrink-0">
//               <div className={`h-2.5 w-2.5 rounded-full ${styling.unreadDot} animate-pulse`}></div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// const NotificationShimmer = () => (
//   <div className="flex animate-pulse items-start gap-2 rounded-lg p-2 sm:gap-3 sm:p-3">
//     <div className="mt-0.5 flex-shrink-0 sm:mt-1">
//       <div className="h-4 w-4 rounded bg-gray-300"></div>
//     </div>
//     <div className="min-w-0 flex-1">
//       <div className="flex items-start justify-between gap-2">
//         <div className="min-w-0 flex-1">
//           <div className="mb-2 h-4 w-3/4 rounded bg-gray-300"></div>
//           <div className="mb-2 h-3 w-full rounded bg-gray-200"></div>
//           <div className="mt-1 flex items-center gap-1 sm:mt-2 sm:gap-2">
//             <div className="h-3 w-12 rounded bg-gray-200"></div>
//             <div className="h-3 w-16 rounded bg-gray-200"></div>
//           </div>
//         </div>
//         <div className="mt-1 flex-shrink-0">
//           <div className="h-2 w-2 rounded-full bg-gray-300"></div>
//         </div>
//       </div>
//     </div>
//   </div>
// )

// // Function to format the date into a human-readable relative time
// const formatRelativeTime = (dateString: string): string => {
//   const now = new Date()
//   const date = new Date(dateString) // Convert string to Date object

//   const diffInMilliseconds = now.getTime() - date.getTime()

//   const seconds = Math.floor(diffInMilliseconds / 1000)
//   const minutes = Math.floor(seconds / 60)
//   const hours = Math.floor(minutes / 60)
//   const days = Math.floor(hours / 24)
//   const months = Math.floor(days / 30) // Approximate months
//   const years = Math.floor(days / 365) // Approximate years

//   if (seconds < 60) {
//     return `just now`
//   } else if (minutes < 60) {
//     return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
//   } else if (hours < 24) {
//     return `${hours} hour${hours !== 1 ? 's' : ''} ago`
//   } else if (days < 30) {
//     return `${days} day${days !== 1 ? 's' : ''} ago`
//   } else if (months < 12) {
//     return `${months} month${months !== 1 ? 's' : ''} ago`
//   } else {
//     return `${years} year${years !== 1 ? 's' : ''} ago`
//   }
// }

// const getTypeBasedStyling = (type: notificationType, read: boolean) => {
//   const baseStyles = 'transition-all duration-200 ease-in-out'

//   switch (type) {
//     case 'success':
//       return {
//         container: `${baseStyles}  ${read ? 'bg-green-50/50 hover:bg-green-50' : 'bg-green-50 hover:bg-green-100 shadow-sm'}`,
//         unreadDot: 'bg-green-500',
//         titleColor: 'text-green-900',
//         messageColor: 'text-green-700'
//       }
//     case 'warning':
//       return {
//         container: `${baseStyles}  ${read ? 'bg-amber-50/50 hover:bg-amber-50' : 'bg-amber-50 hover:bg-amber-100 shadow-sm'}`,
//         unreadDot: 'bg-amber-500',
//         titleColor: 'text-amber-900',
//         messageColor: 'text-amber-700'
//       }
//     case 'error':
//       return {
//         container: `${baseStyles} ${read ? 'bg-red-50/50 hover:bg-red-50' : 'bg-red-50 hover:bg-red-100 shadow-sm'}`,
//         unreadDot: 'bg-red-500',
//         titleColor: 'text-red-900',
//         messageColor: 'text-red-700'
//       }
//     default:
//       return {
//         container: `${baseStyles} shadow ${read ? 'bg-gray-50/50 hover:bg-gray-50' : 'bg-blue-50 hover:bg-blue-100 shadow-sm'}`,
//         unreadDot: 'bg-blue-500',
//         titleColor: 'text-gray-900',
//         messageColor: 'text-gray-700'
//       }
//   }
// }

// const getNotificationIcon = (type: notificationCategoryProps) => {
//   switch (type) {
//     case 'subscription':
//       return <Crown className="h-4 w-4 text-purple-500" />
//     case 'boost':
//       return <Crown className="h-4 w-4 text-green-500" />
//     case 'connect':
//       return <Coins className="h-4 w-4 text-yellow-500" />
//     case 'waiting_for_payment':
//       return <CreditCard className="h-4 w-4 text-blue-500" />
//     case 'payment_complete':
//       return <CheckCircle className="h-4 w-4 text-green-500" />
//     case 'system':
//     case 'admin_release_payment':
//       return <Shield className="h-4 w-4 text-gray-500" />
//     case 'proposal':
//       return <MessageSquare className="h-4 w-4 text-blue-500" />
//     case 'decline':
//     case 'cancel_project':
//     case 'decline_contract':
//       return <XCircle className="h-4 w-4 text-red-500" />
//     case 'accept_contract':
//       return <UserCheck className="h-4 w-4 text-blue-500" />
//     case 'payment_request':
//       return <DollarSign className="h-4 w-4 text-blue-500" />
//     case 'payment_release':
//       return <DollarSign className="h-4 w-4 text-green-500" />
//     case 'invite':
//       return <Mail className="h-4 w-4 text-purple-500" />
//     case 'hire':
//       return <User className="h-4 w-4 text-green-500" />
//     case 'payment_success':
//       return <CheckCircle className="h-4 w-4 text-blue-500" />
//     case 'bid':
//       return <CreditCard className="h-4 w-4 text-gray-500" />
//     case 'withdrawal':
//       return <ArrowDownCircle className="h-4 w-4 text-blue-500" />
//     case 'project_complete_confirmation':
//       return <CheckCircle className="h-4 w-4 text-green-500" />
//     default:
//       return <Bell className="h-4 w-4 text-gray-500" />
//   }
// }

// const getCategoryColor = (category: notificationCategoryProps) => {
//   switch (category) {
//     case 'subscription':
//       return 'bg-purple-100 text-purple-700'
//     case 'boost':
//       return 'bg-green-100 text-green-700'
//     case 'connect':
//       return 'bg-yellow-100 text-yellow-700'
//     case 'waiting_for_payment':
//       return 'bg-blue-100 text-blue-700'
//     case 'payment_complete':
//       return 'bg-green-100 text-green-700'
//     case 'system':
//     case 'admin_release_payment':
//       return 'bg-green-100 text-gray-700'
//     case 'proposal':
//       return 'bg-blue-100 text-blue-700'
//     case 'decline':
//     case 'cancel_project':
//     case 'decline_contract':
//       return 'bg-red-100 text-red-700'
//     case 'accept_contract':
//       return 'bg-blue-100 text-blue-700'
//     case 'payment_request':
//       return 'bg-blue-100 text-blue-700'
//     case 'payment_release':
//       return 'bg-green-100 text-green-700'
//     case 'invite':
//       return 'bg-purple-100 text-purple-700'
//     case 'hire':
//       return 'bg-green-100 text-green-700'
//     case 'payment_success':
//       return 'bg-blue-100 text-blue-700'
//     case 'bid':
//       return 'bg-green-100 text-gray-700'
//     case 'withdrawal':
//       return 'bg-blue-100 text-blue-700'
//     case 'project_complete_confirmation':
//       return 'bg-green-100 text-green-700'
//     default:
//       return 'bg-gray-100 text-gray-700'
//   }
// }

// const redirectToUrl = (
//   category: notificationCategoryProps,
//   data?: IProposalData | undefined,
//   userRole?: 'buyer' | 'seller' | 'no-user'
// ) => {
//   console.log({ category, data, userRole }, 'redirectToUrl')

//   switch (category) {
//     case 'subscription':
//       return false
//     case 'boost':
//       return false
//     case 'connect':
//       return null
//     case 'waiting_for_payment':
//       return buyerRoutes.contractDetails(data?.contractId || '', category)
//     case 'payment_complete':
//       return false
//     case 'system':
//     case 'admin_release_payment':
//       if (userRole === 'buyer') {
//         return buyerRoutes.contractDetails(data?.contractId || '', 'release-payment')
//       } else if (userRole === 'seller') {
//         return sellerRoutes.inProgressJob(data?.contractId || '')
//       } else {
//         return false
//       }
//     case 'proposal':
//       if (userRole === 'buyer') {
//         return buyerRoutes.proposalView(data?.proposalId || '')
//       } else if (userRole === 'seller') {
//         return false
//       } else {
//         return false
//       }
//     case 'decline':
//     case 'cancel_project':
//     case 'decline_contract':
//       if (userRole === 'buyer') {
//         return buyerRoutes.contractDetails(data?.contractId || '', category)
//       } else if (userRole === 'seller') {
//         return sellerRoutes.contract(data?.contractId || '')
//       } else {
//         return false
//       }
//     case 'accept_contract':
//       return false
//     case 'payment_request':
//       return buyerRoutes.contractDetails(data?.contractId || '', category)
//     case 'payment_release':
//       return sellerRoutes.inProgressJob(data?.contractId || '')
//     case 'invite':
//       return sellerRoutes.invitation(data?.contractId || '')
//     case 'hire':
//       return sellerRoutes.contract(data?.contractId || '')
//     case 'payment_success':
//       if (userRole === 'buyer') {
//         return buyerRoutes.contractDetails(data?.contractId || '', category)
//       } else if (userRole === 'seller') {
//         return sellerRoutes.inProgressJob(data?.contractId || '')
//       } else {
//         return false
//       }
//     case 'bid':
//       return false
//     case 'withdrawal':
//       return false

//     case 'project_complete_confirmation':
//     case 'review':
//       if (userRole === 'buyer') {
//         return buyerRoutes.contractDetails(data?.contractId || '', category)
//       } else if (userRole === 'seller') {
//         return sellerRoutes.completed(data?.contractId || '')
//       } else {
//         return false
//       }
//     default:
//       return false
//   }
// }
