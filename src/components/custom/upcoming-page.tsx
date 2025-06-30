'use client'

import type React from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface UpcomingPageProps {
  title?: string
  description?: string
  launchDate?: Date
  showCountdown?: boolean
  showSubscribe?: boolean
  backUrl?: string
  backgroundImageUrl?: string
}

export default function UpcomingPage({
  title = 'Coming Soon',
  description = "We're working on something amazing. Stay tuned for updates!",
  launchDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days from now
  showCountdown = true,
  showSubscribe = true,
  backUrl = '/',
  backgroundImageUrl = '/placeholder.svg?height=1080&width=1920'
}: UpcomingPageProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [email, setEmail] = useState('')

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +launchDate - +new Date()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [launchDate])

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle subscription logic here
    setEmail('')
    // You could add a toast notification here
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden">
      {/* Background with overlay */}

      {/* Back button */}
      <Link href={backUrl} className="absolute top-6 left-6 z-10 flex items-center gap-2 text-white hover:text-gray-200">
        <ArrowLeft className="h-5 w-5" />
        <span>Back to home</span>
      </Link>

      {/* Main content */}
      <Card className="relative z-10 mx-4 w-full max-w-3xl bg-white/90 backdrop-blur-sm">
        <CardContent className="p-8 md:p-12">
          <div className="flex flex-col items-center space-y-8 text-center">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{title}</h1>
              <p className="max-w-xl text-lg text-gray-600">{description}</p>
            </div>

            {showCountdown && (
              <div className="w-full">
                <div className="mb-4 flex items-center justify-center gap-2">
                  <Calendar className="text-primary h-5 w-5" />
                  <span className="text-sm font-medium">Launch Date: {launchDate.toLocaleDateString()}</span>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  {Object.entries(timeLeft).map(([label, value]) => (
                    <div key={label} className="flex flex-col items-center">
                      <div className="bg-primary flex w-full items-center justify-center rounded-lg px-2 py-4 text-white">
                        <span className="text-2xl font-bold md:text-3xl">{value}</span>
                      </div>
                      <span className="mt-2 text-sm capitalize">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showSubscribe && (
              <div className="w-full max-w-md">
                <h3 className="mb-4 flex items-center justify-center gap-2 text-lg font-medium">
                  <Clock className="text-primary h-5 w-5" />
                  Get notified when we launch
                </h3>
                <form onSubmit={handleSubscribe} className="flex justify-center gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="flex-1"
                  />
                  <Button type="submit">Notify Me</Button>
                </form>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
