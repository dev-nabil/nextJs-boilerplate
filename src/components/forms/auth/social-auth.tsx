'use client'
import { Button } from '@/components/ui/button'
import { setCredentials } from '@/store/features/auth/authSlice'
import { useLoginMutation, useSignupMutation } from '@/store/features/user/userApi'
import jwt, { type JwtPayload } from 'jsonwebtoken'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
interface SocialAuthProps {
  role?: 'buyer' | 'seller'
}
function GoogleButton({ role }: { role?: 'buyer' | 'seller' }) {
  const { replace } = useRouter()
  const [signup] = useSignupMutation()
  const [login] = useLoginMutation()
  const dispatch = useDispatch()
  const handleGoogleSignIn = async (response: { credential?: string }) => {
    if (!response.credential) {
      console.error('No credential received')
      toast.error('Could not sign in with Google')
      return
    }
    try {
      const decoded = jwt.decode(response.credential) as JwtPayload
      if (!decoded?.email || !decoded?.name) {
        throw new Error('Invalid token payload')
      }
      // Check if we're in registration flow (role is provided) or login flow
      let result
      if (role) {
        result = await signup({
          email: decoded.email,
          name: decoded.name,
          avatar: decoded.picture,
          role: role,
          provider: 'google'
        }).unwrap()
      } else {
        result = await login({
          email: decoded.email,
          name: decoded.name,
          provider: 'google'
        }).unwrap()
      }
      if (result.user.role.name === 'admin') {
        replace('/admin')
      } else if (result.user.role.name === 'seller') {
        replace('/seller')
      } else if (result.user.role.name === 'buyer') {
        replace('/buyer')
      } else {
        replace('/')
      }
      dispatch(setCredentials({ user: result }))
    } catch (error: any) {
      toast.error(error.data.message)
    }
  }
  useEffect(() => {
    if (typeof window === 'undefined' || !window.google) return
    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      callback: handleGoogleSignIn
    })
    window.google.accounts.id.renderButton(document.getElementById('google-signin-button')!, {
      size: 'large'
    })
  }, [])
  return <Button className="bg-primary mt-2 h-10 w-full text-sm text-white sm:h-11 sm:text-base" id="google-signin-button"></Button>
}
export default function SocialAuth({ role }: SocialAuthProps) {
  return (
    <div className="mx-auto mb-4 w-full max-w-md px-4 sm:px-6 md:px-4" id="google-signin-button">
      <GoogleButton role={role} />
    </div>
  )
}
