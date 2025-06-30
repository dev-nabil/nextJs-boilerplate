'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useAllLogoutMutation, useSingleLogoutMutation } from '@/store/features/deviceManagement/deviceManagementApi'
import { Clock, Laptop, LogOut, MapPin, Monitor, Shield, Smartphone, Tablet, Wifi } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const DeviceManagementSkeleton = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-64 animate-pulse rounded bg-gray-200"></div>
          <div className="h-4 w-96 animate-pulse rounded bg-gray-200"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 animate-pulse rounded bg-gray-200"></div>
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
        </div>
      </div>

      <Separator />

      {/* Action Bar Skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-4 w-48 animate-pulse rounded bg-gray-200"></div>
        <div className="h-8 w-32 animate-pulse rounded bg-gray-200"></div>
      </div>

      {/* Device Cards Skeleton */}
      <div className="grid gap-4">
        {[1, 2, 3].map(index => (
          <Card key={index} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* Device Icon Skeleton */}
                  <div className="h-10 w-10 animate-pulse rounded-lg bg-gray-200"></div>
                  <div className="space-y-2">
                    {/* Device Name Skeleton */}
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-24 animate-pulse rounded bg-gray-200"></div>
                      {index === 1 && <div className="h-5 w-20 animate-pulse rounded-full bg-gray-200"></div>}
                    </div>
                    {/* Browser Info Skeleton */}
                    <div className="h-4 w-40 animate-pulse rounded bg-gray-200"></div>
                  </div>
                </div>
                {/* Logout Button Skeleton */}
                {index !== 1 && <div className="h-8 w-20 animate-pulse rounded bg-gray-200"></div>}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {/* Location Info Skeleton */}
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 animate-pulse rounded bg-gray-200"></div>
                  <div className="space-y-1">
                    <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
                    <div className="h-3 w-20 animate-pulse rounded bg-gray-200"></div>
                  </div>
                </div>
                {/* Device Vendor Skeleton */}
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 animate-pulse rounded bg-gray-200"></div>
                  <div className="space-y-1">
                    <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
                    <div className="h-3 w-16 animate-pulse rounded bg-gray-200"></div>
                  </div>
                </div>
                {/* Last Active Skeleton */}
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 animate-pulse rounded bg-gray-200"></div>
                  <div className="space-y-1">
                    <div className="h-4 w-18 animate-pulse rounded bg-gray-200"></div>
                    <div className="h-3 w-24 animate-pulse rounded bg-gray-200"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Security Tip Skeleton */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <div className="mt-0.5 h-5 w-5 animate-pulse rounded bg-gray-200"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
              <div className="space-y-1">
                <div className="h-3 w-full animate-pulse rounded bg-gray-200"></div>
                <div className="h-3 w-3/4 animate-pulse rounded bg-gray-200"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface Device {
  id: string
  name: string
  deviceToken: string
  browser: string
  deviceType: 'desktop' | 'mobile' | 'tablet' | 'laptop'
  deviceVendor: string
  platform: string
  geolocation: {
    country: string
    city: string
    latitude: number
    longitude: number
  }
  updatedAt: string
  isCurrentDevice: boolean
}

const getDeviceIcon = (type: Device['deviceType']) => {
  switch (type) {
    case 'desktop':
      return <Monitor className="h-5 w-5" />
    case 'laptop':
      return <Laptop className="h-5 w-5" />
    case 'mobile':
      return <Smartphone className="h-5 w-5" />
    case 'tablet':
      return <Tablet className="h-5 w-5" />
    default:
      return <Monitor className="h-5 w-5" />
  }
}

const getOperatingSystem = (platform: string): string => {
  if (platform.includes('Windows NT 10.0')) return 'Windows 10/11'
  if (platform.includes('Windows NT')) return 'Windows'
  if (platform.includes('Mac OS X')) return 'macOS'
  if (platform.includes('Linux')) return 'Linux'
  if (platform.includes('Android')) return 'Android'
  if (platform.includes('iPhone') || platform.includes('iPad')) return 'iOS'
  return 'Unknown OS'
}

const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`
  return date.toLocaleDateString()
}

const formatLocation = (geolocation: Device['geolocation']): string => {
  if (geolocation.city && geolocation.city !== geolocation.country) {
    return `${geolocation.city}, ${geolocation.country}`
  }
  return geolocation.country
}

export default function DeviceManagement({ devicesData, isLoading }: any) {
  const [devices, setDevices] = useState<Device[]>(devicesData)
  const [singleLogout] = useSingleLogoutMutation()
  const [allLogout] = useAllLogoutMutation()
  useEffect(() => {
    if (devicesData && devicesData.length > 0) {
      setDevices(devicesData)
    }
  }, [devicesData])
  if (isLoading) {
    return <DeviceManagementSkeleton />
  }
  const handleLogoutDevice = async (deviceId: string, deviceToken: string) => {
    try {
      // Here you would make an API call to logout the specific device
      await singleLogout({ deviceToken: deviceToken }).unwrap()
      toast.success('Device logged out successfully')
      setDevices(devices.filter(device => device.id !== deviceId))
    } catch (error) {
      toast.error('Failed to logout device')
      console.error('Failed to logout device:', error)
    }
  }

  const handleLogoutAllDevices = async () => {
    try {
      // Here you would make an API call to logout the specific device
      await allLogout({}).unwrap()
      toast.success('All device logged out successfully')
    } catch (error) {
      toast.error('Failed to logout device')
      console.error('Failed to logout device:', error)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Device Management</h1>
          <p className="text-muted-foreground mt-2">Manage your active sessions and logged-in devices</p>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-600" />
          <span className="text-sm font-medium text-green-600">
            {devices?.length} Active Session{devices?.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <Separator />

      {devices?.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            You're currently signed in to {devices?.length} device{devices?.length !== 1 ? 's' : ''}
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                Logout All Devices
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Logout from all devices?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will sign you out from all devices and you'll need to sign in again on each device. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLogoutAllDevices}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Logout All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      <div className="grid gap-4">
        {devices?.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-muted rounded-full p-4">
                <Wifi className="text-muted-foreground h-8 w-8" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">No Active Sessions</h3>
                <p className="text-muted-foreground">You're not currently signed in to any devices.</p>
              </div>
            </div>
          </Card>
        ) : (
          devices?.map(device => (
            <Card
              key={device.id}
              className={`transition-all hover:shadow-md ${device.isCurrentDevice ? 'ring-primary ring-opacity-20 bg-primary/5 ring-2' : ''}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/20 flex h-10 w-10 items-center justify-center rounded-lg">
                      {getDeviceIcon(device.deviceType)}
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        {device.name}
                        {device.isCurrentDevice && (
                          <Badge variant="secondary" className="text-xs">
                            Current Device
                          </Badge>
                        )}
                      </CardTitle>
                      <p className="text-muted-foreground text-sm">
                        {device.browser} • {getOperatingSystem(device.platform)}
                      </p>
                    </div>
                  </div>
                  {!device?.isCurrentDevice && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Logout from {device?.name}?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will sign you out from this device. You'll need to sign in again to access your account on this device.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleLogoutDevice(device?.id, device?.deviceToken)}>Logout</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                  <div className="flex items-center space-x-2">
                    <MapPin className="text-muted-foreground h-4 w-4" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-muted-foreground">{formatLocation(device?.geolocation)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Clock className="text-muted-foreground h-4 w-4" />
                    <div>
                      <p className="font-medium">Last Active</p>
                      <p className="text-muted-foreground">{getRelativeTime(device?.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {devices?.length > 0 && (
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Shield className="mt-0.5 h-5 w-5 text-blue-600" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-100">Security Tip</p>
                <p className="text-sm text-white/80">
                  If you notice any unfamiliar devices or locations, logout from those devices immediately and consider changing your
                  password.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
