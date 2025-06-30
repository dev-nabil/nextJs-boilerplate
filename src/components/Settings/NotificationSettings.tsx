'use client'

import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@/hooks/use-auth'
import { useUpdateOwnProfileMutation } from '@/store/features/user/userApi'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface NotifactionSettingsProps {
  emailNotification: boolean
  messageNotification: boolean
}
export default function NotificationSettings() {
  const {
    user: {
      user: { emailNotification, messageNotification }
    }
  } = useAuth()
  const [notificationSettings, setNotifactionSettings] = useState<NotifactionSettingsProps>({
    emailNotification: emailNotification || false,
    messageNotification: messageNotification || false
  })

  const [updateUser] = useUpdateOwnProfileMutation()
  // handle form authentication
  const onSubmitAuthentication = async (type: string, value: boolean) => {
    const sendInfo = {
      [type]: value
    }

    await updateUser(sendInfo)
      .unwrap()
      .then(res => {
        toast.success(`${type == 'emailNotification' ? 'Email' : 'Massage'} Notification ${value ? 'Enabled' : 'Desabled'} Successfully`)
      })
  }

  const handleToggle = (type: 'emailNotification' | 'messageNotification', value: boolean) => {
    setNotifactionSettings(prev => ({
      ...prev,
      [type]: value
    }))

    onSubmitAuthentication(type, value)
  }

  return (
    <div className="space-y-6 px-2 py-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Email Notification</h3>
        <div className="flex flex-col space-y-4">
          <p className="text-muted-foreground text-sm">you can turn off or on for any email notification from anyone</p>
          <div className="flex items-center space-x-2">
            <Label htmlFor="email-notifications" className="text-sm font-medium">
              Off
            </Label>
            <Switch
              id="email-notifications"
              checked={notificationSettings?.emailNotification || false}
              onCheckedChange={value => handleToggle('emailNotification', value)}
              defaultChecked
              className=""
            />
            <Label htmlFor="email-notifications" className="text-sm font-medium">
              On
            </Label>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">Message Notification</h3>
        <div className="flex flex-col space-y-4">
          <p className="text-muted-foreground text-sm">you can turn off or on for any message notification from anyone</p>
          <div className="flex items-center space-x-2">
            <Label htmlFor="message-notifications" className="text-sm font-medium">
              Off
            </Label>
            <Switch
              id="message-notifications"
              checked={notificationSettings?.messageNotification || false}
              onCheckedChange={value => handleToggle('messageNotification', value)}
              className=""
            />
            <Label htmlFor="message-notifications" className="text-sm font-medium">
              On
            </Label>
          </div>
        </div>
      </div>
    </div>
  )
}
