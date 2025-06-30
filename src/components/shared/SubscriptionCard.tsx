'use client'

import { sellerRoutes } from '@/routes/routes'
import { SubscriptionPlan } from '@/types'
import { CheckCheck, Crown, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type React from 'react'
import { useState } from 'react'

type SubscriptionCardProps = {
  plan: SubscriptionPlan
  buttonLabel?: string
  index?: number
  subscriptionId: string
  // onClick?: () => void;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ plan, buttonLabel, index, subscriptionId }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false) // wait flag

  const isSubscription = subscriptionId == plan.id
  // Generate features list from the plan properties
  const getFeatures = () => {
    const features = [
      { name: `${plan.serviceLimit} Service Limit`, enabled: plan.serviceLimit > 0 },
      { name: 'Pro Badge', enabled: plan.proBadge },
      { name: `Profile Views (${plan.profileViewsDays})`, enabled: !!plan.profileViewsDays },
      { name: 'Social Explore Views', enabled: plan.socialExploreViews },
      { name: 'Social Explore Interaction Views', enabled: plan.socialExploreInteractionViews },
      { name: 'Social Explore Performance Trends', enabled: plan.socialExplorePerformanceTrends },
      { name: 'Proposal Shortlist Status', enabled: plan.proposalShortlistStatus },
      { name: 'Post Number of Applicants', enabled: plan.postNumberOfApplicants },
      { name: 'Post Bidding Insights', enabled: plan.postBiddingInsights },
      { name: 'Post Trends', enabled: plan.postTrends },
      { name: 'Custom Alerts', enabled: plan.customAlerts },
      { name: 'Buyer Response Time', enabled: plan.buyerResponseTime },
      { name: 'Advanced Profile Analytics', enabled: plan.advancedProfileAnalytics },
      { name: 'Job Alerts', enabled: plan.jobAlerts },
      { name: `${plan.portfolioProjects} Portfolio Projects`, enabled: plan.portfolioProjects > 0 },
      { name: `${plan.connectsGranted} Bid Points`, enabled: plan.connectsGranted > 0 }
    ]

    return features
  }

  const getDurationLabel = () => {
    switch (plan.durationType) {
      case 'day':
        return plan.duration > 1 ? `${plan.duration} days` : 'day'
      case 'week':
        return plan.duration > 1 ? `${plan.duration} weeks` : 'week'
      case 'month':
        return plan.duration > 1 ? `${plan.duration} months` : 'month'
      case 'year':
        return plan.duration > 1 ? `${plan.duration} years` : 'year'
      case 'offer':
        return 'offer'
      default:
        return plan.durationType
    }
  }

  return (
    <div key={index} className="flex w-[315px] flex-col gap-5 rounded-lg border bg-white p-6 shadow-md">
      <div className="mb-4 flex items-center space-x-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full text-blue-600">
          <Crown />
        </div>
        <h3 className="text-lg font-semibold text-blue-600 capitalize">{plan.title}</h3>
      </div>

      {/* Price */}
      <div className="mb-6 text-3xl font-bold">
        <span className="mr-1 text-sm text-gray-800">{plan.currency}</span>
        {plan.salePrice && plan.salePrice < plan.price && <span className="mr-2 text-sm text-gray-900 line-through">{plan.price}</span>}
        <span className="text-gray-900">{plan.salePrice && plan.salePrice < plan.price ? plan.salePrice : plan.price}</span>
        <span className="text-base font-normal text-gray-500">/{getDurationLabel()}</span>
      </div>

      {/* Features */}
      <ul className="mb-6 space-y-2">
        {getFeatures().map((feature, index) => (
          <li key={index} className="flex items-center space-x-2 text-gray-600">
            {feature.enabled ? <CheckCheck color="#EFCD18" size={18} /> : <X color="#9CA3AF" size={18} />}
            <span className={!feature.enabled ? 'text-gray-400' : ''}>{feature.name}</span>
          </li>
        ))}
      </ul>

      {/* Button */}
      {isSubscription ? (
        <span
          className="text-primary-150 border-primary-150 cursor-not-allowed rounded-md border px-4 py-2 text-center font-semibold opacity-50 select-none"
          aria-disabled="true"
        >
          {buttonLabel}
        </span>
      ) : (
        <Link
          href={sellerRoutes.subscription(plan.id)}
          className="text-primary-150 border-primary-150 hover:bg-primary transform rounded-md border px-4 py-2 text-center font-semibold transition duration-300 hover:text-white"
        >
          {buttonLabel}
        </Link>
      )}
    </div>
  )
}

export default SubscriptionCard
