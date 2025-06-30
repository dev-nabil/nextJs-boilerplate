import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface ErrorPageProps {
  message: string
  backPage: string
  backRoute: string
  reset: () => void
}

export default function ErrorPage({ message, backPage, backRoute = '/', reset }: ErrorPageProps) {
  const router = useRouter()

  return (
    <div className="">
      <p>{message}</p>

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        <Button onClick={() => router.back()} variant="outline" size="lg">
          Go back
        </Button>

        <Button onClick={() => router.push(backRoute)} variant="outline" size="lg">
          Back to {backPage}
        </Button>

        <Button onClick={reset} variant="outline" size="lg">
          Try Again
        </Button>
      </div>
    </div>
  )
}
