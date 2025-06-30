export default function SubscriptionLoading() {
  return (
    <div className="flex flex-col gap-5 w-[315px] p-6 bg-gray-200 animate-pulse border rounded-lg shadow-md">
      <div className="mb-4 flex items-center space-x-2">
        <div className="w-6 h-6 rounded-full bg-gray-300"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>

      <div className="mb-6 text-3xl font-bold">
        <div className="h-4 bg-gray-300 rounded w-1/6 mb-1"></div>
        <div className="h-6 bg-gray-300 rounded w-1/2 mb-1"></div>
      </div>

      <ul className="mb-6 space-y-2">
        <li className="flex items-center space-x-2 text-gray-600">
          <div className="h-4 w-4 bg-gray-300 rounded mr-2"></div>
          <div className="flex-grow h-4 bg-gray-300 rounded"></div>
        </li>
        <li className="flex items-center space-x-2 text-gray-600">
          <div className="h-4 w-4 bg-gray-300 rounded mr-2"></div>
          <div className="flex-grow h-4 bg-gray-300 rounded"></div>
        </li>
      </ul>

      <div className="h-8 bg-gray-300 rounded"></div>
    </div>
  );
}
