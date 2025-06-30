export default function JobCardShimmer() {
  return (
    <div className="space-y-2 p-7 bg-white rounded-lg">
      <div className="w-56 h-5 bg-gray-300 shimmer rounded"></div>
      <div className="space-y-2 sm:grid sm:grid-cols-12">
        <div className="space-y-2 col-span-7">
          <div className="w-48 h-4 bg-gray-300 shimmer rounded"></div>
          <div className="w-40 h-4 bg-gray-300 shimmer rounded"></div>
        </div>
        <div className=" text-sm col-span-4 flex justify-start items-center h-full">
          <div className="space-y-2">
            <div className="w-48 h-4 bg-gray-300 shimmer rounded"></div>
            <div className="w-40 h-4 bg-gray-300 shimmer rounded"></div>
          </div>
        </div>
        <div className="col-span-1 hidden sm:flex justify-end">
          <div className="w-10 h-4 bg-gray-300 shimmer rounded "></div>
        </div>
      </div>
    </div>
  );
}
