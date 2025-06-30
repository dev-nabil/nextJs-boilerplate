import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Search } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../ui/button'

export default function JobNotFound() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="space-y-6 text-center">
            {/* Icon */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Search className="h-8 w-8 text-gray-400" />
            </div>

            {/* Heading */}
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-gray-900">Job Post Not Found</h1>
              <p className="leading-relaxed text-gray-600">
                This job posting is no longer available or may have been removed. Don't worry, there are plenty of other opportunities
                waiting for you.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button className="w-full">
                <Link className="flex items-center gap-1" href="/seller/find-work">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to home
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
