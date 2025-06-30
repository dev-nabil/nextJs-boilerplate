import { decodeBase64 } from '@/lib/utils'

export function getSubscriptionAccess(subscription?: Subscription): SubscriptionAccess | null {
  const savedDataLocal = localStorage.getItem('usp') // usp user subscription packeg
  const decodedData = subscription ? subscription : decodeBase64(savedDataLocal)

  // If decodedData is not valid or empty
  if (!Array.isArray(decodedData) || decodedData.length === 0) {
    return null
  }

  // Filter out expired subscriptions (subscriptions that are still valid)
  const activeSubscription = decodedData
    .filter(sub => new Date() < new Date(sub.expiryDate)) // Fix to check for active (non-expired) subscriptions
    .sort((a, b) => (b.subscription.price || 0) - (a.subscription.price || 0))[0] // Sort based on price

  // If no valid subscription is found, return null
  if (!activeSubscription) return null

  // Extract subscription data
  const sub = activeSubscription.subscription
  return {
    userId: activeSubscription.userId,
    subscriptionTitle: sub.title,
    isFree: sub.free,
    proBadge: sub.proBadge,
    features: {
      socialExploreViews: sub.socialExploreViews,
      socialExploreInteractionViews: sub.socialExploreInteractionViews,
      socialExplorePerformanceTrends: sub.socialExplorePerformanceTrends,
      proposalShortlistStatus: sub.proposalShortlistStatus,
      postNumberOfApplicants: sub.postNumberOfApplicants,
      postBiddingInsights: sub.postBiddingInsights,
      postTrends: sub.postTrends,
      customAlerts: sub.customAlerts,
      buyerResponseTime: sub.buyerResponseTime,
      advancedProfileAnalytics: sub.advancedProfileAnalytics,
      jobAlerts: sub.jobAlerts
    },
    usageLimits: {
      connects: activeSubscription.connects,
      portfolioProjects: sub.portfolioProjects,
      serviceLimit: sub.serviceLimit,
      postNumberOfApplicants: sub.postNumberOfApplicants
    },
    expiryDate: activeSubscription.expiryDate
  }
}

interface Subscription {
  id: string
  sellerId: string
  subscriptionId: string
  connects: number
  visible: boolean
  expiryDate: string
  createdAt: string
  subscription: {
    id: string
    title: string
    price: number
    salePrice: number | null
    discount: number
    discountType: string
    currency: string
    serviceLimit: number
    free: boolean
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
  }
  userId: string
}

interface SubscriptionAccess {
  userId: string
  subscriptionTitle: string
  isFree: boolean
  proBadge: boolean
  features: {
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
  }
  usageLimits: {
    connects: number
    portfolioProjects: number
    serviceLimit: number
    postNumberOfApplicants: boolean
  }
  expiryDate: string
}
