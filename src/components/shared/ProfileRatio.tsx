export default function ProfileRatio({ completeRate, isValueShow = true }: { completeRate: string | number; isValueShow?: boolean }) {
  if (Number(completeRate) > 100) {
    completeRate = 100
  }
  return (
    <div>
      <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${completeRate}%` }}></div>
      </div>
      <div className="relative mb-1 flex justify-between text-xs text-[#18181B]">
        {isValueShow && (
          <span style={{ left: `${Number(completeRate === 100 ? completeRate - 15 : completeRate)}%` }} className="absolute">
            {completeRate}%
          </span>
        )}
        {/* {Number(completeRate) < 80 && <span className="absolute right-0">100%</span>} */}
      </div>
    </div>
  )
}
