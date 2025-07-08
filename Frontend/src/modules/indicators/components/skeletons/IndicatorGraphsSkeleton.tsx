export default function IndicatorGraphsSkeleton() {
    return (
      <div className="grid lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-64 bg-gray-300/60 animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }
  