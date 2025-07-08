interface CommunicationFiltersSkeletonProps {
}

export default function ObjectivesFiltersSkeleton({ }: CommunicationFiltersSkeletonProps) {
  return (
    <div className="p-4 rounded-md w-full bg-gray-900 animate-pulse">
      <div className="h-6 w-1/3 bg-gray-700 rounded mb-6" />
      <div className="mb-4">
        <div className="h-4 w-1/3 bg-gray-700 rounded mb-2" />
        <div className="h-10 w-full bg-gray-800 rounded" />
      </div>
      <div className="mb-4">
        <div className="h-4 w-1/4 bg-gray-700 rounded mb-2" />
        <div className="h-10 w-full bg-gray-800 rounded" />
      </div>

    </div>
  );
}