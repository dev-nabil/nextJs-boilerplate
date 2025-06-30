'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { cn } from '@/lib/utils'
import { AppDispatch } from '@/store'
import { setCredentials } from '@/store/features/auth/authSlice'
import { useSignupWithOtpMutation, useVerifyOtpMutation } from '@/store/features/user/userApi'
import { AlertCircle, CheckCircle, Loader2, Mail, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'

type VerificationState = 'idle' | 'verifying' | 'success' | 'error'

interface OtpVerificationModalProps {
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  user: {
    name: string
    email: string
    password: string
    role: 'buyer' | 'seller'
  }
}

export default function OtpVerificationModal({
  isOpen: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  user: user
}: OtpVerificationModalProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [otp, setOtp] = useState('')
  const [verificationState, setVerificationState] = useState<VerificationState>('idle')
  const [countdown, setCountdown] = useState(120)
  const [resend, setResend] = useState(false)
  const [verifyOtp, { isLoading: verifyOtpLoading }] = useVerifyOtpMutation()
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setIsOpen = controlledOnOpenChange || setInternalOpen
  const { push } = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const [signupWihOtp, { isLoading: signUpWithOtpLoading }] = useSignupWithOtpMutation()
  const handleVerify = async () => {
    if (otp.length !== 6) return

    setVerificationState('verifying')

    try {
      const response = await verifyOtp({ otp: otp }).unwrap()

      if (response.user.role.name === 'seller') {
        toast.success('Welcome! You are successfully registered.')
        setVerificationState('success')
        setIsOpen(false)
        dispatch(setCredentials({ user: response }))
        push('/seller/find-work')
      } else {
        toast.success('Welcome! You are successfully registered.')
        setVerificationState('success')
        setIsOpen(false)
        dispatch(setCredentials({ user: response }))
        push('/buyer/welcome')
      }
    } catch (error) {
      setVerificationState('error')
    }
  }

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [countdown])

  const handleResend = async () => {
    setResend(true)
    try {
      const response = await signupWihOtp({ ...user }).unwrap()
      if (response.message) {
        setCountdown(120)
        toast.success('OTP resent successfully! Please check your email')
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Something went wrong! Please try again.'
      toast.error(errorMessage)
      console.error('Resend OTP failed:', error)
    }
  }

  const resetModal = () => {
    setOtp('')
    setVerificationState('idle')
    setCountdown(0)
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    // if (!open) {
    //   resetModal()
    // }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent
          hideCloseBtn={true}
          className="overflow-hidden border-0 bg-gradient-to-br from-slate-50 to-white p-0 shadow-2xl sm:max-w-[480px]"
        >
          {/* Header Section */}
          <div className="from-primary to-primary/60 bg-gradient-to-r px-6 py-8 text-white">
            <DialogHeader className="space-y-3">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                {verificationState === 'success' ? (
                  <CheckCircle className="h-8 w-8 text-green-300" />
                ) : verificationState === 'error' ? (
                  <AlertCircle className="h-8 w-8 text-red-300" />
                ) : (
                  <Mail className="h-8 w-8" />
                )}
              </div>
              <DialogTitle className="text-center text-2xl font-bold">
                {verificationState === 'success' ? 'Verification Successful!' : 'Verify Your Identity'}
              </DialogTitle>
              <DialogDescription className="text-center text-base text-blue-100">
                {verificationState === 'success'
                  ? 'Your account has been successfully verified.'
                  : `We've sent a 6-digit verification code to your email and phone.`}
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Content Section */}
          <div className="space-y-6 px-6 py-8">
            {verificationState !== 'success' && (
              <>
                {/* Contact Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                    <Mail className="h-5 w-5 text-slate-600" />
                    <span className="text-sm font-medium text-slate-700">{user?.email}</span>
                  </div>
                </div>

                {/* OTP Input */}
                <div className="space-y-4">
                  <div className="flex flex-col items-center justify-center text-center">
                    <label className="mb-4 block text-sm font-semibold text-slate-700">Enter Verification Code</label>
                    <InputOTP maxLength={6} value={otp} onChange={value => setOtp(value)} disabled={verificationState === 'verifying'}>
                      <InputOTPGroup className="gap-3">
                        {[0, 1, 2, 3, 4, 5].map(index => (
                          <InputOTPSlot
                            key={index}
                            index={index}
                            className={cn(
                              'h-12 w-12 rounded-xl border-2 text-lg font-bold transition-all duration-200',
                              verificationState === 'error' && 'border-red-300 bg-red-50',
                              'focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                            )}
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  {/* Error Message */}
                  {verificationState === 'error' && (
                    <div className="flex items-center justify-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span>Invalid verification code. Please try again.</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <Button
                    onClick={handleVerify}
                    disabled={otp.length !== 6 || verificationState === 'verifying'}
                    className="h-12 w-full rounded-xl"
                  >
                    {verificationState === 'verifying' ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Verify Code'
                    )}
                  </Button>

                  {/* Resend Button */}
                  <div className="flex items-center justify-center gap-2 text-center">
                    <span className="text-sm text-slate-600">Didn't receive the code? </span>
                    <Button
                      variant="ghost"
                      onClick={handleResend}
                      disabled={countdown > 0}
                      className="h-auto p-0 font-semibold text-blue-600 hover:bg-transparent hover:text-blue-700"
                    >
                      {countdown > 0 ? (
                        <span className="flex items-center gap-1 text-sm">
                          <RefreshCw className="h-3 w-3" />
                          Resend in {countdown}s
                        </span>
                      ) : (
                        'Resend Code'
                      )}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
