// components/ReviewCard.tsx
import { FC } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

interface ReviewCardProps {
  name: string;
  rating: number;
  date: string;
  review: string;
  avatarUrl?: string;
}

const ReviewCard: FC<ReviewCardProps> = ({ name, rating, date, review, avatarUrl }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full">
      <div className="flex items-center gap-4 mb-4">
        <Avatar>
          <AvatarImage src={avatarUrl || ''} alt={`${name} avatar`} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="text-lg font-semibold">{name}</h4>
          <div className="flex items-center">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} />
            ))}
          </div>
        </div>
        <span className="ml-auto text-sm text-gray-500">{date}</span>
      </div>
      <p className="text-gray-600">{review}</p>
    </div>
  );
};

export default ReviewCard;
