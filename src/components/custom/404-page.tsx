'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft, Home, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function NotFoundPage() {
  const router = useRouter()

  return (
    <div className="from-primary to-secondary flex min-h-screen flex-col items-center justify-center bg-gradient-to-b px-4 py-12 sm:py-16 md:py-20">
      {/* Animated stars background */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="stars-container">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                animation: `twinkle ${Math.random() * 5 + 3}s infinite ${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center text-center">
        {/* 404 Text */}
        <h1 className="mb-2 bg-gradient-to-r from-blue-300 to-blue-900 bg-clip-text text-7xl font-bold text-transparent sm:mb-4 sm:text-8xl md:text-9xl">
          404
        </h1>

        {/* Message */}
        <h2 className="mb-3 text-2xl font-bold text-white sm:mb-4 sm:text-3xl md:text-4xl">Houston, we have a problem!</h2>
        <p className="mb-8 max-w-md text-base text-slate-300 sm:text-lg">
          The page you're looking for has drifted off into space or never existed in the first place.
        </p>

        {/* Search suggestion */}
        <div className="mb-8 w-full max-w-md rounded-lg border border-slate-700 bg-slate-800/50 p-4 backdrop-blur-sm">
          <p className="mb-2 flex items-center text-sm text-slate-300">
            <Search size={16} className="mr-2 text-slate-400" />
            Try searching for what you're looking for or use the navigation below
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row sm:gap-4">
          <Button onClick={() => router.back()} variant="outline" size="lg" className="flex-1 border-purple-700 text-white">
            <ArrowLeft size={18} className="mr-2" />
            Go Back
          </Button>

          <Button
            onClick={() => router.replace('/')}
            variant="default"
            size="lg"
            className="from-primary to-secondary flex-1 bg-gradient-to-r text-white"
          >
            <Home size={18} className="mr-2" />
            Back to Home
          </Button>
        </div>
      </div>

      {/* Planets decoration */}
      <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 opacity-20 blur-2xl md:h-32 md:w-32"></div>
      <div className="absolute top-20 right-10 h-16 w-16 rounded-full bg-gradient-to-tr from-pink-500 to-orange-500 opacity-20 blur-xl md:h-24 md:w-24"></div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
