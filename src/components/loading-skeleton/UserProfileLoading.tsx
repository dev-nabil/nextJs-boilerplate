import { cn } from '@/lib/utils';

export default function UserProfileLoading() {
  return (
    <>
      {[...Array(6)].map((_, index) => (
        <div key={index} className={cn('h-full w-full rounded-xl cursor-pointer relative animate-pulse bg-gray-200')}>
          {/* Image Section */}
          <div className="w-full h-[200px] sm:h-[237px] rounded-lg bg-gray-300" />

          {/* Content Overlay */}
          <div className={cn('absolute top-0 right-0 w-full h-full text-white')}>
            <div className="flex justify-between items-end h-full py-6 font-semibold text-[12px] sm:text-sm">
              {/* Title */}
              <div className="flex items-center gap-2">
                <div className="h-4 w-24 bg-gray-300 rounded-md"></div>
              </div>

              {/* View Count */}
              <div className="h-4 w-12 bg-gray-300 rounded-md"></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
