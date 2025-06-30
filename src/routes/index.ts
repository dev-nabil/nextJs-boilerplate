type NavLink = any

import { getUserLocationName } from '@/lib/utils'

export const sideBarLinks: NavLink[] = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: 'dashboard'
  },
  // {
  //   title: 'Requests',
  //   href: '/requests',
  //   icon: 'trophy',
  //   sub: [
  //     {
  //       title: 'Profile',
  //       href: '/admin/requests/profiles',
  //       icon: 'dot'
  //     },
  //     {
  //       title: 'Payments',
  //       href: '/admin/requests/payments',
  //       icon: 'dot'
  //     },
  //     {
  //       title: 'Dispute',
  //       href: '/admin/requests/disputes',
  //       icon: 'dot'
  //     }
  //   ]
  // },
  {
    title: 'Category',
    href: '/admin/categories',
    icon: 'kanban'
  },
  {
    title: 'Banners',
    href: '/admin/banners',
    icon: 'gallery'
  },
  {
    title: 'User',
    href: '/admin/users',
    icon: 'user'
  },
  {
    title: 'Bill',
    href: '/admin/bill',
    icon: 'billing'
  },
  {
    title: 'Withdraw Proposal',
    href: '/admin/withdraw-proposal',
    icon: 'SwitchCamera'
  },
  {
    title: 'Admins',
    href: '/admin/admins',
    icon: 'admin'
  },
  {
    title: 'Contacts',
    href: '/admin/contacts',
    icon: 'mail'
  },
  {
    title: 'Dispute',
    href: '/admin/disputes',
    icon: 'handShake'
  },
  {
    title: 'Blog',
    href: '/admin/blog',
    icon: 'MessageSquareText'
  },
  {
    title: 'Subscriptions',
    href: '/admin/subscription',
    icon: 'Boxes'
  },
  {
    title: 'FAQ',
    href: '/admin/faq',
    icon: 'TableOfContents'
  },
  {
    title: 'General Settings',
    href: '/admin/settings',
    icon: 'settings'
  }
]

export const clientNavLinks: NavLink[] = [
  {
    title: 'Home',
    href: '/',
    icon: 'dashboard'
  },
  {
    title: 'Service',
    href: '/services',
    icon: 'dashboard'
  },
  {
    title: 'About Us',
    href: '/about-us',
    icon: 'dashboard'
  },
  {
    title: 'Contact Us',
    href: '/contact-us',
    icon: 'dashboard'
  }
]

export const sellerNavLinks: NavLink[] = [
  {
    title: 'Find Work',
    href: '/seller/find-work',
    icon: 'TextSearch',
    sub: [
      {
        title: 'Invitations',
        href: '/seller/profile?t=workHistory&ac=invitation',
        icon: 'GitPullRequestArrow'
      },
      {
        title: 'Contracts',
        href: '/seller/profile?t=workHistory&ac=contracts',
        icon: 'dot'
      },
      {
        title: 'Proposals',
        href: '/seller/profile?t=workHistory&ac=proposals',
        icon: 'dot'
      }
    ]
  },
  {
    title: 'Talent',
    // href: '/seller/talent',
    href: `/seller/talent${getUserLocationName() ? `?location=${getUserLocationName()}` : ``}`,
    icon: 'ContactRound'
  },
  {
    title: 'Subscription',
    href: '/subscription',
    icon: 'Box'
  }
]

export const buyerNavLinks: NavLink[] = [
  {
    title: 'Job Post',
    href: '/buyer/job-post',
    icon: 'dashboard'
  },
  {
    title: 'Talent',
    href: `/buyer/talent${getUserLocationName() ? `?location=${getUserLocationName()}` : ``}`,
    icon: 'dashboard'
  }
]
