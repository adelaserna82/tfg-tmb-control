interface CommunicationFiltersSkeletonProps {
    filtersCount?: number;
  }
  
  export default function CommunicationFiltersSkeleton({ filtersCount = 3 }: CommunicationFiltersSkeletonProps) {
    return (
      <div className="p-4 rounded-md w-full bg-gray-900 animate-pulse">
        <div className="h-6 w-1/3 bg-gray-700 rounded mb-6" />
        <div className="mb-4">
          <div className="h-4 w-1/4 bg-gray-700 rounded mb-2" />
          <div className="h-10 w-full bg-gray-800 rounded" />
        </div>
        <div className="mb-4">
          <div className="h-4 w-1/3 bg-gray-700 rounded mb-2" />
          <div className="h-10 w-full bg-gray-800 rounded" />
        </div>
        <div className="mb-4">
          <div className="h-4 w-1/4 bg-gray-700 rounded mb-2" />
          {[...Array(filtersCount)].map((_, i) => (
            <div key={i} className="flex items-center mb-2">
              <div className="h-4 w-4 bg-gray-800 rounded mr-3" />
              <div className="h-4 w-1/4 bg-gray-700 rounded" />
            </div>
          ))}
        </div>
        <div className="mb-2">
          <div className="h-4 w-1/4 bg-gray-700 rounded mb-2" />
          <div className="relative">
            <div className="absolute left-3 top-2 h-5 w-5 bg-gray-700 rounded-full" />
            <div className="h-10 w-full bg-gray-800 rounded pl-10" />
          </div>
        </div>
      </div>
    );
  }