import { useAuth } from '@/hooks/use-auth'
import { useUpdateOwnProfileMutation } from '@/store/features/user/userApi'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Switch } from '../ui/switch'

export default function Authentication() {
  const {
    user: {
      user: { TwoFA }
    }
  } = useAuth()

  const [is2FAEnabled, setIs2FAEnabled] = useState(TwoFA || false)

  const [updateUser] = useUpdateOwnProfileMutation()

  // handle form authentication
  const onSubmitAuthentication = async (isEnabled: boolean) => {
    const res = await updateUser({
      TwoFA: isEnabled
    })
      .unwrap()
      .then(res => {
        toast.success('Authentication has been updated successfully')
      })
  }

  const handleToggle = (checked: boolean) => {
    setIs2FAEnabled(checked)
    onSubmitAuthentication(checked)
  }

  return (
    <div>
      <div className="mt-6 space-y-2 rounded-lg bg-white p-2 sm:p-5">
        <div className="w-full xl:w-1/2">
          <h1 className="mb-6 text-xl font-medium text-gray-800">2 Factor Authentication</h1>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h2 className="text-base font-medium text-gray-800">Email Passcode</h2>
              <p className="text-sm text-gray-600">Receive a passcode from your email to confirm it's you.</p>
            </div>
            <Switch
              id="2FactorAuthentication"
              name="authentication"
              checked={is2FAEnabled}
              onCheckedChange={handleToggle}
              className="data-[state=unchecked]:bg-gray-500"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
