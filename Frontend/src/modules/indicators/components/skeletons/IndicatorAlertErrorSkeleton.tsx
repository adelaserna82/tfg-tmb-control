export default function  IndicatorAlertErrorSkeleton  () {
    return (
        <div className="animate-pulse">
        <div className="mb-6">
          <div className="bg-gray-200 dark:bg-gray-700 h-6 w-1/3 rounded mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 h-24 rounded"></div>
            ))}
          </div>
        </div>
        <div>
          <div className="bg-gray-200 dark:bg-gray-700 h-6 w-1/3 rounded mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 h-24 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
}

