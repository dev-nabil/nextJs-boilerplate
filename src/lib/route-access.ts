import { UserRole } from '@/types'

export const PUBLIC_ROUTES = [
  '/',
  '/auth/login',
  '/auth/register',
  '/about-us',
  '/services',
  '/privacy-policy',
  '/terms-and-conditions',
  '/refund-policy',
  '/contact-us',
  '/blog'
]

// Auth routes accessible only to unauthenticated users
export const AUTH_ROUTES = ['/auth/login', '/auth/register']

// Routes accessible by both buyer and seller roles
export const SHARED_ROUTES = [
  '/settings',
  '/profile',
  '/notifications',
  '/chat',
  '/privacy-policy',
  '/terms-and-conditions',
  '/refund-policy',
  '/contact-us',
  '/pay-now',
  '/subscription',
  '/payment'
]

export const ROLE_BASE_ROUTES: Record<UserRole, string[]> = {
  [UserRole.Buyer]: ['/buyer'],
  [UserRole.Seller]: ['/seller'], // ✅ This allows ALL seller routes like /seller/find-work
  [UserRole.Admin]: ['/admin']
}

export function isRouteMatch(path: string, routes: string[]): boolean {
  return routes.some(route => path === route || (route !== '/' && path.startsWith(route)))
}

export function getRedirectForRole(role: string, baseUrl: string): URL {
  switch (role) {
    case UserRole.Buyer:
      return new URL('/buyer', baseUrl)
    case UserRole.Seller:
      return new URL('/seller/find-work', baseUrl)
    case UserRole.Admin:
      return new URL('/admin/dashboard', baseUrl)
    default:
      return new URL('/', baseUrl)
  }
}
