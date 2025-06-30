import { cn } from '@/lib/utils'
import { TPhotoGrapherProps } from '@/types'
import { MapPin, Star } from 'lucide-react'
import Image from 'next/image'

export default function PhotographerCard({ coverImage, userImage, name, location, rating, project }: TPhotoGrapherProps) {
  return (
    <div className="relative h-full w-full rounded-lg bg-white shadow-md">
      {/* <div className="grid grid-cols-3 gap-1.5 justify-center relative w-full p-1">
        {groupImage?.map((image: string, index: number) => (
          <Image
            key={image}
            width={200}
            height={200}
            src={image}
            alt="Group Image"
            className={cn(
              'w-full h-[120px] object-cover',
              index === 0 ? 'rounded-tl-lg' : index === groupImage.length - 1 ? 'rounded-tr-lg' : '',
            )}
          />
        ))}
      </div> */}
      <div>
        <img src={coverImage} alt="cover-photo" className="h-[120px] w-full rounded-lg object-cover" />
      </div>

      <div className="absolute top-[40%] left-1/2 z-50 h-[144px] w-[144px] -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-white">
        <div className="relative z-30 h-full w-full">
          <Image width={200} height={200} src={userImage} alt="User Image" className={cn('h-full w-full rounded-full object-cover p-1')} />
          <div className="absolute top-[70%] -right-8 z-40 h-6 w-12 -translate-x-1/2 -translate-y-1/2 transform rounded-md bg-white shadow-md">
            <div className="flex items-center gap-1 px-1">
              {' '}
              <span className="text-xs">{rating || 0}</span> <Star fill="#EFCD18" color="#EFCD18" className="w-3.5" />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-[90px] text-center">
        <div className="flex items-center justify-center gap-3">
          <h2 className="text-lg font-semibold">{name || 'User Name'}</h2>
          <div className="bg-primary h-2.5 w-2.5 rounded-full" />
        </div>
        <p className="my-2 flex items-center justify-center text-xs text-[#A1A1AA]">
          <span className="mr-1">
            <MapPin size={16} color="#A1A1AA" />
          </span>
          <span>{location || 'User Location'}</span>
        </p>
        <p className="bg-background-secondary text-primary-150 mx-auto mb-4 w-[180px] rounded-md p-1 text-xs">
          <span>{project || 0}</span> project completed
        </p>
      </div>
    </div>
  )
}
