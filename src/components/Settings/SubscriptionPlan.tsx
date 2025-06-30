// import ComingSoonNotice from '@/app/ComingSoonNotice'
// import { Button } from '@/components/ui/button'
// import { useAuth } from '@/hooks/use-auth'
// import { differenceInDays, format, isValid } from 'date-fns'
// import { Check, CheckCheck, Crown } from 'lucide-react'
// import Link from 'next/link'
// import { useState } from 'react'
// import CustomModal from '../custom/CustomModal'

// export default function SubscriptionPlan() {
//   const [soon, setSoon] = useState(false)
//   const { user } = useAuth()
//   console.log(user?.sellerSubscriptions, 'user?.sellerSubscriptions')

//   // If no subscription, show fallback view
//   if (!user.subscribed) {
//     return (
//       <div className="mx-auto max-w-md py-10 text-center">
//         <h2 className="mb-4 text-2xl font-semibold text-gray-800">No Active Subscription</h2>
//         <p className="mb-6 text-gray-600">
//           You are currently not subscribed to any plan. Upgrade to unlock advanced features and maximize your experience.
//         </p>
//         <Link href="/seller/subscription">
//           <Button className="bg-teal-600 text-white hover:bg-teal-700">Explore Plans</Button>
//         </Link>
//       </div>
//     )
//   }

//   const subscription = user?.subscription
//   const subsEndDate = new Date(user?.subsEndDate)
//   const createdAt = new Date(subscription?.createdAt)

//   const formattedStartDate = isValid(createdAt) ? format(createdAt, 'dd.MM.yy') : 'N/A'
//   const formattedEndDate = isValid(subsEndDate) ? format(subsEndDate, 'dd.MM.yy') : 'N/A'
//   const remainingDays = isValid(subsEndDate) ? Math.max(differenceInDays(subsEndDate, new Date()), 0) : 0

//   const showBidPoints = subscription?.bidPoints && subscription.bidPoints > 0

//   const features = [
//     subscription?.serviceLimit > 0 && `${subscription.serviceLimit} Service Limit`,
//     subscription?.proBadge && 'Pro Badge',
//     subscription?.profileViewsDays && `Profile Views (${subscription.profileViewsDays})`,
//     subscription?.socialExploreViews && 'Social Explore Views',
//     subscription?.socialExploreInteractionViews && 'Social Explore Interaction Views',
//     subscription?.socialExplorePerformanceTrends && 'Social Explore Performance Trends',
//     subscription?.proposalShortlistStatus && 'Proposal Shortlist Status',
//     subscription?.postNumberOfApplicants && 'Post Number of Applicants',
//     subscription?.postBiddingInsights && 'Post Bidding Insights',
//     subscription?.postTrends && 'Post Trends',
//     subscription?.customAlerts && 'Custom Alerts',
//     subscription?.buyerResponseTime && 'Buyer Response Time',
//     subscription?.advancedProfileAnalytics && 'Advanced Profile Analytics',
//     subscription?.jobAlerts && 'Job Alerts',
//     subscription?.portfolioProjects > 0 && `${subscription.portfolioProjects} Portfolio Projects`,
//     subscription?.bidPoints > 0 && `${subscription.bidPoints} Bid Points`
//   ].filter(Boolean)

//   return (
//     <div className="mx-auto w-full">
//       <div className="mb-6 flex items-center justify-between gap-2">
//         <h2 className="text-sm font-bold capitalize sm:text-xl">You Are Using {subscription?.durationType || 'N/A'} Plan</h2>
//         <Button className="bg-teal-500 hover:bg-teal-600" onClick={() => setSoon(true)}>
//           Suspend
//         </Button>
//       </div>

//       <div className="mb-8 flex flex-wrap gap-3">
//         <div className="rounded-full border bg-white px-4 py-2 text-sm">Plan Activate Date : {formattedStartDate}</div>
//         <div className="rounded-full border bg-white px-4 py-2 text-sm">Plan Validity Date : {formattedEndDate}</div>
//         <div className="rounded-full border bg-white px-4 py-2 text-sm">
//           Price Cost : {subscription?.salePrice ?? subscription?.price} {subscription?.currency || 'N/A'}
//         </div>
//         <div className={`rounded-full border bg-white px-4 py-2 text-sm ${remainingDays <= 10 ? 'text-red-500' : 'text-black'}`}>
//           Remaining Days : {remainingDays} Days
//         </div>
//         {showBidPoints && <div className="rounded-full border bg-white px-4 py-2 text-sm">Remaining Bids : {user.connects}</div>}
//       </div>

//       <h3 className="mb-4 text-lg font-semibold">Features</h3>

//       <div className="mb-8 flex flex-wrap gap-3">
//         {features.map((feature, index) => (
//           <div key={index} className="flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm">
//             <Check className="h-5 w-5 text-green-600" />
//             <span>{feature}</span>
//           </div>
//         ))}
//       </div>

//       <div className="max-w-xs rounded-lg border p-6">
//         <div className="mb-4 flex items-center gap-2">
//           <Crown className="h-5 w-5 fill-purple-600 text-purple-600" />
//           <span className="font-medium text-purple-600">{subscription?.title || 'N/A'}</span>
//         </div>

//         <div className="mb-4 flex items-baseline">
//           <span className="mr-1 text-gray-700">{subscription?.currency || 'NPR'}</span>
//           <span className="text-4xl font-bold">{subscription?.salePrice ?? subscription?.price ?? '--'}</span>
//           <span className="ml-1 text-gray-500">/{subscription?.durationType || 'month'}</span>
//         </div>

//         <div className="space-y-3">
//           {features.map((feature, index) => (
//             <div key={index} className="flex items-center gap-2">
//               <CheckCheck className="h-5 w-5 text-yellow-400" />
//               <span>{feature}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//       <CustomModal open={soon} setOpen={setSoon}>
//         <ComingSoonNotice />
//       </CustomModal>
//     </div>
//   )
// }

'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'
import { differenceInDays, format, isValid } from 'date-fns'
import { AlertCircle, Bitcoin, Calendar, Check, CheckCheck, Clock, Crown, Star, Zap } from 'lucide-react'
import Link from 'next/link'

export interface SubscriptionPlanProps {
  id: string
  sellerId: string
  subscriptionId: string
  connects: number
  visible: boolean
  expiryDate: string
  createdAt: string
  subscription: Subscription
}

export interface Subscription {
  id: string
  title: string
  price: number
  salePrice: number
  discount: number
  discountType: string
  currency: string
  serviceLimit: number
  proBadge: boolean
  profileViewsDays: string
  socialExploreViews: boolean
  socialExploreInteractionViews: boolean
  socialExplorePerformanceTrends: boolean
  proposalShortlistStatus: boolean
  postNumberOfApplicants: boolean
  postBiddingInsights: boolean
  postTrends: boolean
  customAlerts: boolean
  buyerResponseTime: boolean
  advancedProfileAnalytics: boolean
  jobAlerts: boolean
  portfolioProjects: number
  connectsGranted: number
  duration: number
  durationType: string
  visible: boolean
  createdAt: string
  free: boolean
}

export default function SubscriptionPlan() {
  const { user } = useAuth()
  const subscription: SubscriptionPlanProps[] = user?.sellerSubscriptions || []

  // If no subscriptions, show fallback view
  if (!subscription || subscription.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-8 text-center sm:py-10">
        <div className="mb-4 sm:mb-6">
          <Crown className="mx-auto h-12 w-12 text-gray-300 sm:h-16 sm:w-16" />
        </div>
        <h2 className="mb-3 text-xl font-semibold text-gray-800 sm:mb-4 sm:text-2xl">No Subscriptions Found</h2>
        <p className="mb-4 text-sm text-gray-600 sm:mb-6 sm:text-base">
          You don't have any subscriptions yet. Upgrade to unlock advanced features and maximize your experience.
        </p>
        <Link href="/seller/subscription">
          <Button className="w-full bg-teal-600 text-white hover:bg-teal-700 sm:w-auto">
            <Crown className="mr-2 h-4 w-4" />
            Explore Plans
          </Button>
        </Link>
      </div>
    )
  }

  const getSubscriptionStatus = (expiryDate: string, visible: boolean) => {
    const expiry = new Date(expiryDate)
    const now = new Date()
    const remainingDays = isValid(expiry) ? Math.max(differenceInDays(expiry, now), 0) : 0

    if (!visible) return { status: 'Suspended', color: 'secondary', days: remainingDays }
    if (remainingDays <= 0) return { status: 'Expired', color: 'destructive', days: remainingDays }
    if (remainingDays <= 3) return { status: 'Expiring Soon', color: 'destructive', days: remainingDays }
    if (remainingDays <= 10) return { status: 'Active', color: 'secondary', days: remainingDays }
    return { status: 'Active', color: 'default', days: remainingDays }
  }

  const getFeatures = (subscription: any) => {
    return [
      subscription?.serviceLimit > 0 && `${subscription.serviceLimit} Service Limit`,
      subscription?.proBadge && 'Pro Badge',
      subscription?.profileViewsDays && `Profile Views (${subscription.profileViewsDays})`,
      subscription?.socialExploreViews && 'Social Explore Views',
      subscription?.socialExploreInteractionViews && 'Social Explore Interaction Views',
      subscription?.socialExplorePerformanceTrends && 'Social Explore Performance Trends',
      subscription?.proposalShortlistStatus && 'Proposal Shortlist Status',
      subscription?.postNumberOfApplicants && 'Post Number of Applicants',
      subscription?.postBiddingInsights && 'Post Bidding Insights',
      subscription?.postTrends && 'Post Trends',
      subscription?.customAlerts && 'Custom Alerts',
      subscription?.buyerResponseTime && 'Buyer Response Time',
      subscription?.advancedProfileAnalytics && 'Advanced Profile Analytics',
      subscription?.jobAlerts && 'Job Alerts',
      subscription?.portfolioProjects > 0 && `${subscription.portfolioProjects} Portfolio Projects`,
      subscription?.connectsGranted > 0 && `${subscription.connectsGranted} Connects Granted`
    ].filter(Boolean)
  }

  // Sort subscriptions: active first, then by creation date (newest first)
  const sortedSubscriptions = [...subscription].sort((a, b) => {
    const aStatus = getSubscriptionStatus(a.expiryDate, a.visible)
    const bStatus = getSubscriptionStatus(b.expiryDate, b.visible)

    // Active subscriptions first
    if (aStatus.status === 'Active' && bStatus.status !== 'Active') return -1
    if (bStatus.status === 'Active' && aStatus.status !== 'Active') return 1

    // Then by creation date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  return (
    <div className="mx-auto w-full space-y-4 px-4 sm:space-y-6 sm:px-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <Crown className="h-5 w-5 fill-yellow-500 text-yellow-500 sm:h-6 sm:w-6" />
          <h2 className="text-xl font-bold sm:text-2xl">My Subscriptions</h2>
          <Badge variant="outline" className="text-xs sm:text-sm">
            {subscription.length} Total
          </Badge>
        </div>
        <Link href="/subscription" className="w-full sm:w-auto">
          <Button className="w-full bg-teal-600 text-white hover:bg-teal-700 sm:w-auto">
            <Crown className="mr-2 h-4 w-4" />
            Upgrade Plan
          </Button>
        </Link>
      </div>

      {/* Subscriptions List */}
      <div className="space-y-4 sm:space-y-6">
        {sortedSubscriptions.map((sellerSubscription, index) => {
          const subscription = sellerSubscription.subscription
          const expiryDate = new Date(sellerSubscription.expiryDate)
          const createdAt = new Date(sellerSubscription.createdAt)
          const statusInfo = getSubscriptionStatus(sellerSubscription.expiryDate, sellerSubscription.visible)
          const features = getFeatures(subscription)

          const formattedStartDate = isValid(createdAt) ? format(createdAt, 'MMM dd, yyyy') : 'N/A'
          const formattedEndDate = isValid(expiryDate) ? format(expiryDate, 'MMM dd, yyyy') : 'N/A'

          const isActive = statusInfo.status === 'Active'
          const isExpiringSoon = statusInfo.status === 'Expiring Soon'

          return (
            <Card
              key={sellerSubscription.id}
              className={`relative ${isActive ? 'border-green-200 bg-green-50/50' : ''} ${isExpiringSoon ? 'border-orange-200 bg-orange-50/50' : ''}`}
            >
              {/* Active Badge */}
              {isActive && (
                <div className="absolute -top-2 left-2 sm:left-4">
                  <Badge className="bg-green-600 text-white">
                    <Star className="mr-1 h-3 w-3" />
                    <span className="hidden sm:inline">Current Plan</span>
                    <span className="sm:hidden">Active</span>
                  </Badge>
                </div>
              )}

              <CardHeader className="pt-6 pb-3 sm:pt-6 sm:pb-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Crown className="h-4 w-4 fill-purple-600 text-purple-600 sm:h-5 sm:w-5" />
                      <CardTitle className="text-lg sm:text-xl">{subscription?.title || 'Unknown Plan'}</CardTitle>
                    </div>
                    <Badge variant={statusInfo.color as any} className="w-fit text-xs sm:text-sm">
                      {statusInfo.status}
                    </Badge>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold sm:text-2xl">
                      {subscription?.currency || 'NPR'} {subscription?.salePrice ?? subscription?.price ?? '--'}
                    </span>
                    <span className="text-sm text-gray-500 sm:text-base">/{subscription?.durationType || 'month'}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 sm:space-y-6">
                {/* Subscription Details Grid */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
                  <div className="flex items-center gap-2 rounded-lg border bg-white p-3">
                    <Calendar className="h-4 w-4 flex-shrink-0 text-blue-500" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-600 sm:text-sm">Start Date</p>
                      <p className="truncate text-sm font-medium sm:text-base">{formattedStartDate}</p>
                    </div>
                  </div>

                  {!subscription.free ? (
                    <>
                      <div className="flex items-center gap-2 rounded-lg border bg-white p-3">
                        <Clock className="h-4 w-4 flex-shrink-0 text-orange-500" />
                        <div className="min-w-0">
                          <p className="text-xs text-gray-600 sm:text-sm">Expires On</p>
                          <p className="truncate text-sm font-medium sm:text-base">{formattedEndDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg border bg-white p-3">
                        <Zap className="h-4 w-4 flex-shrink-0 text-purple-500" />
                        <div className="min-w-0">
                          <p className="text-xs text-gray-600 sm:text-sm">Days Remaining</p>
                          <p
                            className={`truncate text-sm font-medium sm:text-base ${statusInfo.days <= 10 ? 'text-red-500' : 'text-green-600'}`}
                          >
                            {statusInfo.days} days
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                  <div className="flex items-center gap-2 rounded-lg border bg-white p-3">
                    <Bitcoin className="h-4 w-4 flex-shrink-0 text-green-500" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-600 sm:text-sm">Bids</p>
                      <p className="truncate text-sm font-medium sm:text-base">{sellerSubscription.connects || 0} remaining</p>
                    </div>
                  </div>
                </div>

                {/* Warning for expiring subscriptions */}
                {isExpiringSoon && (
                  <div className="flex items-start gap-2 rounded-lg border border-orange-200 bg-orange-50 p-3">
                    <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-600" />
                    <span className="text-xs font-medium text-orange-800 sm:text-sm">
                      This subscription expires in {statusInfo.days} day{statusInfo.days !== 1 ? 's' : ''}. Consider renewing to avoid
                      service interruption.
                    </span>
                  </div>
                )}

                {/* Features */}
                <div>
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold sm:text-base">
                    <Check className="h-4 w-4 text-green-600" />
                    Plan Features ({features.length})
                  </h4>
                  <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                    {features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-2 rounded-md border bg-white p-2 sm:p-3">
                        <CheckCheck className="mt-0.5 h-3 w-3 flex-shrink-0 text-green-600" />
                        <span className="text-xs leading-relaxed sm:text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 border-t pt-4 sm:flex-row sm:gap-3">
                  <Link href="/subscription" className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full sm:w-auto">
                      {isActive ? 'Upgrade Plan' : 'Renew Plan'}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Summary Stats */}
      <Card className="bg-gray-50">
        <CardContent className="p-4 sm:p-6">
          <h3 className="mb-3 text-sm font-semibold sm:mb-4 sm:text-base">Subscription Summary</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border bg-white p-4 text-center">
              <p className="text-xl font-bold text-green-600 sm:text-2xl">
                {subscription.filter(sub => getSubscriptionStatus(sub.expiryDate, sub.visible).status === 'Active').length}
              </p>
              <p className="text-xs text-gray-600 sm:text-sm">Active Plans</p>
            </div>
            <div className="rounded-lg border bg-white p-4 text-center">
              <p className="text-xl font-bold text-orange-600 sm:text-2xl">
                {subscription.filter(sub => getSubscriptionStatus(sub.expiryDate, sub.visible).status === 'Expiring Soon').length}
              </p>
              <p className="text-xs text-gray-600 sm:text-sm">Expiring Soon</p>
            </div>
            <div className="rounded-lg border bg-white p-4 text-center">
              <p className="text-xl font-bold text-gray-600 sm:text-2xl">{user?.connects || 0}</p>
              <p className="text-xs text-gray-600 sm:text-sm">Total Bids</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
