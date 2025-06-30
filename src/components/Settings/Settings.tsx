'use client'

import type { RootState } from '@/store'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import SettingsInformation from './SettingsInformation'
import SettingTab from './SettingTab'

export interface TabOption {
  label: string
  value: string
  details: string
}

export default function Settings() {
  const { user }: any = useSelector((state: RootState) => state?.auth)
  const route = useRouter()
  const searchParams = useSearchParams()

  const search = searchParams.get('active')
  const [activeTab, setActiveTab] = useState(search || 'password')

  useEffect(() => {
    if (activeTab) {
      route.push(`?active=${activeTab}`)
    }
  }, [activeTab, route])

  useEffect(() => {
    if (search) {
      setActiveTab(search || 'password')
    }
  }, [search])

  let tabOptions: any[] = []

  if (user?.user?.role?.name === 'seller') {
    tabOptions = [
      { label: 'Password & Security', value: 'password', details: 'Manage Password' },
      { label: 'Verification', value: 'verification', details: 'Verify your account' },
      { label: 'Transactions', value: 'transactions', details: 'Payout' },
      { label: 'Withdraw', value: 'withdraw', details: 'withdraw' },
      { label: 'Subscription Plan', value: 'subscriptions-plan', details: 'Subscription Plan' },
      { label: 'Boost Profile', value: 'boost-profile', details: 'Boost your profile visibility' },
      { label: 'Project History', value: 'project-history', details: 'Project History' },
      { label: 'Notifications', value: 'notifications', details: 'Notifications' },
      { label: 'Device Login', value: 'device-login', details: 'Device Login' }
    ]
  } else if (user?.user?.role?.name === 'buyer') {
    tabOptions = [
      { label: 'Password Change', value: 'password', details: 'Manage Your Password' },
      { label: 'Edit Profile', value: 'edit-profile', details: 'Edit profile' },
      { label: 'Wallet', value: 'wallet', details: 'Wallet ' },
      { label: 'Project History', value: 'project-history', details: 'Project History' },
      { label: 'Notifications', value: 'notifications', details: 'Notifications' },
      { label: 'Device Login', value: 'device-login', details: 'Device Login' }
    ]
  }
  return (
    <div>
      <SettingsInformation
        name={user?.user?.name || 'df'}
        image={user?.user?.avatar || ''}
        details={tabOptions.find(i => i.value == activeTab)?.details || 'Manage account'}
        tab={'Settings'}
      />
      <section className="px-1 2xl:px-0">
        <SettingTab activeTab={activeTab} setActiveTab={setActiveTab} tabOptions={tabOptions} userType={user?.user?.role?.name} />
      </section>
    </div>
  )
}
