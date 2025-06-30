import { cn } from '@/lib/utils';
import { TIconCard } from '@/types';
import Image from 'next/image';

export default function IconCard({
  title = 'Card Title',
  lastIndex,
  index,
  type = 'primary',
  description = 'Card Description',
  svg = '',
  imgSrc = '/image/Icon/homeHerobtnIcon2.png',
  customClass,
}: TIconCard) {
  return (
    <div
      className={cn(
        'w-full md:w-[310px]  p-4 mx-2 lg:mx-0  ',
        type === 'primary' ? 'rounded-lg shadow-md bg-white' : '',
      )}
    >
      <div
        className={cn(
          '',
          type === 'primary' ? '' : 'border-r-0 lg:border-r-2  border-[#CBCBCB] border-opacity-30',
          lastIndex === index && 'border-none',
        )}
      >
        <div className={customClass}>
          {!svg && <Image width={100} height={100} src={imgSrc} alt="Card-Icon" className="w-8 h-8 my-2" />}
          {svg && svg}
          <h2 className="text-xl">{title}</h2>
        </div>
        <p className="text-sm">{description}</p>
      </div>
    </div>
  );
}
