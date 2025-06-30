import { cn } from '@/lib/utils';

export default function PhotoGrapherCardLoading() {
  return (
    <div className="w-full h-full bg-white rounded-lg shadow-md relative animate-pulse">
      {/* Group Images Skeleton */}
      <div className="grid grid-cols-3 gap-1.5 justify-center relative w-full p-1">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className={cn(
              'w-full h-[120px] bg-gray-200',
              index === 0 ? 'rounded-tl-lg' : index === 2 ? 'rounded-tr-lg' : '',
            )}
          ></div>
        ))}
      </div>

      {/* User Image Skeleton */}
      <div className="bg-gray-200 w-[144px] h-[144px] rounded-full border-4 border-gray-300 absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"></div>

      {/* Rating Badge Skeleton */}
      {/* <div className="w-12 h-6 bg-gray-200 shadow-md absolute top-[70%] -right-8 transform -translate-x-1/2 -translate-y-1/2 z-40 rounded-md"></div> */}

      {/* User Details Skeleton */}
      <div className="text-center mt-[90px]">
        <div className="flex items-center justify-center gap-3">
          <div className="bg-gray-200 h-6 w-32 rounded"></div>
        </div>
        <p className="text-xs my-2 flex text-gray-400 justify-center items-center">
          <div className="bg-gray-200 w-24 h-4 rounded"></div>
        </p>
        <p className="bg-gray-200 w-[180px] rounded-md mx-auto p-1 text-xs mb-4"></p>
      </div>
    </div>
  );
}
