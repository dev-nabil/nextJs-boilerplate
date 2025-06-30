import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { buyerRoutes } from '@/routes/routes'
import { SellerDataProps } from '@/types'
import { Briefcase, Star } from 'lucide-react'
import Link from 'next/link'

export default function SellerCard({ data }: { data: SellerDataProps }) {
  const {
    user: { name, avatar, address, rating },
    title,
    description,
    rate,
    _count,
    id
  } = data
  return (
    <Card className="h-full p-6 shadow-none">
      <CardContent className="flex h-full flex-col justify-between p-0">
        <div className="h-full">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={avatar || ''} alt={name} />
              <AvatarFallback className="text-white">{name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            {/* <Image
              src={avatar || 'https://placehold.co/100.png'}
              alt="Profile"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            /> */}
            <div>
              <Link href={buyerRoutes.profileView(id)}>
                <h3 className="text-md font-semibold">{name}</h3>
              </Link>
              <p className="text-sm text-gray-500">{address?.country || 'N/A'}</p>
            </div>
          </div>
          <h4 className="text-md mt-2 font-semibold">{title}</h4>
          <p className="mt-1 flex items-center justify-between gap-1 text-sm text-gray-500">
            <span>NPR {rate}</span>
            <span className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              {rating?.toFixed(2) || '0.00'}
            </span>
            <span className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              {_count?.contract || 0}
            </span>
          </p>
          {description && <p className="mt-2 line-clamp-3 text-sm text-gray-500">{description}</p>}
        </div>
        <Link href={buyerRoutes.profileView(id)} className="mt-4 w-full">
          <Button variant="outline" className="mt-4 w-full">
            View Profile
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
