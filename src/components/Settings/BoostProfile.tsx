'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'
import { useProfileBoostMutation } from '@/store/features/payment-option/khalti/boost/boostApi'
import { addDays, addMonths, addWeeks, format } from 'date-fns'
import { InfoIcon as InfoCircle } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

export default function BoostProfile() {
  const { user } = useAuth()
  const [boostAmount, setBoostAmount] = useState<number>(1000)
  const [duration, setDuration] = useState<string>('1 Day')
  const [isBoostActive, setIsBoostActive] = useState<boolean>(false)
  const [profileBoost, { isLoading }] = useProfileBoostMutation()
  // Calculate dates based on selected duration
  const startDate = new Date()
  let endDate = new Date()
  switch (duration) {
    case '1 Day':
      endDate = addDays(startDate, 1)
      break
    case '3 Day':
      endDate = addDays(startDate, 3)
      break
    case '1 Week':
      endDate = addWeeks(startDate, 1)
      break
    case '1 Month':
      endDate = addMonths(startDate, 1)
      break
  }

  const formattedStartDate = format(startDate, 'dd/MM/yyyy')
  const formattedEndDate = format(endDate, 'dd/MM/yyyy')

  const handleBoostProfile = async () => {
    try {
      const res = await profileBoost({
        amount: boostAmount,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }).unwrap()
      setIsBoostActive(true)
      if (res.paid === false) {
        window.location.href = `/pay-now/boost/${res.id}`
      }
    } catch (error) {
      toast.error('Failed to boost profile. Please try again.')
      console.error(error)
    }
  }
  const disable = user?.boosts?.find((boost: any) => boost.status === 'active')
  return (
    <div className="w-full">
      {/* Active Boosts Section */}
      {disable ? (
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Active Boost</h2>
          <div className="grid gap-4">
            {user?.boosts
              ?.filter((boost: any) => boost.status === 'active')
              .map((boost: any) => (
                <Card key={boost.id} className="border-primary flex flex-col gap-2 border-l-4 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-semibold">Active</span>
                    <span className="text-primary rounded bg-teal-100 px-2 py-1 text-xs font-medium">{boost.paid ? 'Paid' : 'Unpaid'}</span>
                  </div>
                  <div className="mt-2 flex flex-col gap-1 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <span>Boost Amount</span>
                      <span className="font-medium">NPR {Number(boost.amount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Per Day</span>
                      <span>NPR {Number(boost.amountPerDay).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration</span>
                      <span>{boost.duration} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Start</span>
                      <span>{format(new Date(boost.startDate), 'dd MMM yyyy')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>End</span>
                      <span>{format(new Date(boost.endDate), 'dd MMM yyyy')}</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                    <InfoCircle className="h-4 w-4" />
                    <span>Your profile is currently boosted and visible at the top of search results.</span>
                  </div>
                </Card>
              ))}
            {(!user?.boosts || user.boosts.filter((boost: any) => boost.status === 'active').length === 0) && (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                <InfoCircle className="mb-2 h-8 w-8" />
                <span>No active boost data found.</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className="my-5 grid gap-8 p-2 md:grid-cols-2">
        {/* Left Column - Boost Settings */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Boost Settings</h2>
          <div className="space-y-2">
            <label htmlFor="boostAmount" className="block font-medium">
              Boost Amount (minimum NPR 1,000)
            </label>
            <Input
              disabled={disable}
              id="boostAmount"
              type="number"
              defaultValue={1000}
              // value={boostAmount || 0}
              onChange={e => setBoostAmount(Number(e.target.value))}
              className="w-full"
              placeholder="1000"
            />
            {boostAmount < 1000 && <p className="text-sm text-red-500">Amount must be at least NPR 1,000.</p>}
          </div>

          <div className="space-y-2">
            <label className="block font-medium">Boost Duration</label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Button
                variant={duration === '1 Day' ? 'default' : 'outline'}
                onClick={() => setDuration('1 Day')}
                className="w-full"
                disabled={disable}
              >
                1 Day
              </Button>
              <Button
                variant={duration === '3 Day' ? 'default' : 'outline'}
                onClick={() => setDuration('3 Day')}
                className="w-full"
                disabled={disable}
              >
                3 Day
              </Button>
              <Button
                variant={duration === '1 Week' ? 'default' : 'outline'}
                onClick={() => setDuration('1 Week')}
                className="w-full"
                disabled={disable}
              >
                1 Week
              </Button>
              <Button
                variant={duration === '1 Month' ? 'default' : 'outline'}
                onClick={() => setDuration('1 Month')}
                className="w-full"
                disabled={disable}
              >
                1 Month
              </Button>
            </div>
          </div>

          <Button onClick={handleBoostProfile} className="w-full" size="lg" disabled={disable}>
            Boost My Profile
          </Button>

          <Card className="rounded-lg border p-6">
            <h3 className="mb-4 text-xl font-semibold text-gray-800">Boost Benefits</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="mr-2 text-teal-500">•</span>
                <span className="text-primary">Appear at the top of search result</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-teal-500">•</span>
                <span className="text-primary">Get Highlighted in the user recommendations</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-teal-500">•</span>
                <span className="text-primary">Increase profile visits by up to 5x</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-teal-500">•</span>
                <span className="text-primary">Boost Engagement with your content</span>
              </li>
            </ul>
          </Card>
        </div>

        {/* Right Column - Boost Preview */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Your Boost</h2>

          <Card className="rounded-lg border p-4">
            <h3 className="mb-4 text-xl font-semibold">Boost Preview</h3>

            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.user?.avatar || ''} alt={user?.user?.name || ''} className="object-cover" />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {user?.user?.name ? user?.user?.name.charAt(0).toUpperCase() : ''}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{user?.user?.name}</span>
              </div>

              <div className="bg-primary rounded-full px-4 py-1 text-sm text-white">{isBoostActive ? 'Boosted' : 'Preview'}</div>
            </div>

            <div className="space-y-3 border-t border-b py-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Start Date</span>
                <span className="font-medium">{formattedStartDate}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">End Date</span>
                <span className="font-medium">{formattedEndDate}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Duration</span>
                <span className="font-medium">{duration}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Boost Amount</span>
                <span className="max-w-[100px] font-medium">NPR {boostAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-2 text-gray-600">
              <InfoCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
              <p>Your Profile will appear at the top of search results and receive increased visibility for the selected duration.</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
