import { AlertCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function Error({ error, reset }: { error?: Error & { digest?: string }; reset?: () => void }) {
  return (
    <div className="flex min-h-[400px] w-full flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
      <div className="relative mb-6 h-64 w-64">
        <Image src="/images/error-image.png" alt="Error illustration" fill className="object-contain" priority />
      </div>

      <div className="mb-2 flex items-center gap-2 text-red-500">
        <AlertCircle className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Oops! Something went wrong</h2>
      </div>

      <p className="mb-6 max-w-md text-gray-600">
        We couldn't load the data you requested. This might be due to a network issue or a problem with our servers.
      </p>

      {reset && (
        <Link href={'/'} className="flex items-center gap-2">
          Go To Home
        </Link>
      )}
    </div>
  )
}
