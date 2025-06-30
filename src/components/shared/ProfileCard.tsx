'use client'

import { calculateProfileCompletion, cn } from '@/lib/utils'
import type { RootState } from '@/store'
import type { ProfileCardProps } from '@/types'
import { BadgeCheck, MapPin, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { FC } from 'react'
import { useSelector } from 'react-redux'
import ProfileRatio from './ProfileRatio'

const ProfileCard: FC<ProfileCardProps> = ({ className }) => {
  const { user }: any = useSelector((state: RootState) => state?.auth)

  const completionRate = calculateProfileCompletion(user)

  const formatMemberSince = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className={cn('rounded-lg border bg-white p-4', className)}>
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="relative">
          <Image
            src={user?.user?.avatar || '/images/profile-avatar.webp'}
            alt={user?.user?.name || ''}
            width={48}
            height={48}
            className="h-12 w-12 rounded-lg object-cover"
          />
          {user?.verified && (
            <div className="absolute -top-1 -right-1 rounded-full bg-green-500 p-0.5">
              <BadgeCheck className="h-3 w-3 text-white" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-gray-900">{user?.user?.name}</h3>

          <div className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin className="h-3 w-3" />
            <span>
              {user?.user?.address?.city}, {user?.user?.address?.country}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        <div className="text-center">
          <div className="flex items-center justify-center gap-0.5">
            <span className="text-sm font-bold">{user?.user?.rating || 0}</span>
            <Star className="h-3 w-3 fill-current text-yellow-500" />
          </div>
          <p className="text-xs text-gray-500">Rating</p>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold">NPR {Number(user?.totalEarned)?.toLocaleString('en-US')}</div>
          <p className="text-xs text-gray-500">Earned</p>
        </div>

        <div className="text-center">
          <div className="text-sm font-bold">{user?.connects || 0}</div>
          <p className="text-xs text-gray-500">Bids</p>
        </div>
      </div>

      {/* Badges */}
      <div className="mb-4 flex flex-wrap gap-1">
        {user?.verified && (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">Verified</span>
        )}
        {user?.subscribed && (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">Premium</span>
        )}
      </div>

      {/* Profile Completion */}
      {user?.user?.role?.name === 'seller' && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">Profile Completion</span>
            <span className="text-sm font-bold">{completionRate}%</span>
          </div>

          <ProfileRatio completeRate={completionRate} isValueShow={false} />

          <div className="mt-3 flex items-center justify-between">
            {completionRate < 100 ? (
              <Link href={'/seller/profile'} className="text-xs text-blue-600 hover:underline">
                Complete Profile
              </Link>
            ) : (
              <span className="text-xs font-medium text-green-600">Profile Complete ✓</span>
            )}
            <Link href={'/seller/profile'} className="text-xs text-gray-500 hover:underline">
              Edit Profile
            </Link>
          </div>

          <p className="mt-2 text-xs text-gray-500">A complete profile helps you attract more clients and build trust.</p>
        </div>
      )}
    </div>
  )
}

export default ProfileCard
