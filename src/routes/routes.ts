import { Edit, User } from 'lucide-react'

export const buyerRoutes = {
  profile: (id: string) => `/buyer/profile/${id}`,
  createPost: '/buyer/create-post',
  profileView: (id: string) => `/buyer/profile-view/${id}`,
  jobPostCreate: '/buyer/job-post-create',
  contractDetails: (contractId: string, status: string) => `/buyer/job-post/details/${status}/${contractId}`,
  jobPost: (queries?: string) => `/buyer/job-post${queries ? `?${queries}` : ''}`,
  proposalView: (proposalId: string) => `/buyer/job-post-details/proposal-view/${proposalId}`,
  jobPostDetails: (projectId: string) => `/buyer/job-post-details/${projectId}`,
  projectPayment: (projectType: 'milestone' | 'contract', id: string) => `/pay-now/${projectType}/${id}`
}

export const buyerAndSellerRoutes = {
  setting: (profile: 'seller' | 'buyer', queries?: string) => `/${profile}/settings${queries ? `?${queries}` : ''}`,
  chat: '/chat'
}

export const sellerRoutes = {
  profile: (title: string, id: string) => `/${title}/profile-view/${id}`,
  seller: `/seller`,
  createPost: '/seller/create-post',
  hirePost: '/seller/hire-post',
  shareProject: '/seller/share-project',
  profileInfo: (queries?: string) => `/seller/profile${queries ? `?${queries}` : ''}`,
  subscription: (id: string) => `/pay-now/subscription/${id}`,
  boostProfile: (id: string) => `/pay-now/boostProfile/${id}`,
  settings: (queries?: string) => `/seller/settings${queries ? `?${queries}` : ''}`,
  contract: (contractId: string) => `/seller/profile/contract-details/${contractId}`,
  inProgressJob: (contractId: string) => `/seller/profile/in-progress-job-details/${contractId}`,
  completed: (contractId: string) => `/seller/profile/completed-job-details/${contractId}`,
  invitation: (contractId: string) => `/seller/find-work/job-details/${contractId}`
}

// admin route start

export const adminRoute = {
  blogEdit: (id: string) => `/admin/blog/edit/${id}`,
  subscriptionEdit: (id: string) => `/admin/subscription/edit/${id}`,
  faqEdit: (id: string) => `/admin/faq/edit/${id}`,
  boostProfileView: (id: string) => `/admin/boost-profile/${id}`,
  bidPointView: (id: string) => `/admin/bid-points/${id}`
}
//admin route end
export const routes = [
  {
    path: buyerRoutes.profile,
    name: 'Profile',
    icon: User,
    profileType: 'buyer'
  },
  {
    path: buyerRoutes.createPost,
    name: 'Create Post',
    icon: Edit,
    profileType: 'buyer'
  },
  {
    path: sellerRoutes.profile,
    name: 'Profile',
    icon: User,
    profileType: 'seller'
  },

  {
    path: sellerRoutes.createPost,
    name: 'Create Post',
    icon: Edit,
    profileType: 'seller'
  },
  {
    path: sellerRoutes.shareProject,
    name: 'Share Project',
    icon: Edit,
    profileType: 'seller'
  }
]
