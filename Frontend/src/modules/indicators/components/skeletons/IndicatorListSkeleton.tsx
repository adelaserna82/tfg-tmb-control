export default function IndicatorListSkeleton() {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 ">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="h-40 bg-gray-300/60 animate-pulse rounded-md"
          />
        ))}
      </div>
    );
  }
