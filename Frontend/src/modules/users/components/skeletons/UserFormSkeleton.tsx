export default function UserFormSkeleton() {
    return (
      <div className="animate-pulse">
        <div className="h-6 w-1/2 bg-gray-700 rounded mb-4"></div>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-9 w-full bg-gray-700 rounded mb-3"></div>
        ))}
        <div className="h-6 w-1/3 bg-gray-700 rounded mb-2"></div>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-4 w-full bg-gray-700 rounded mb-1"></div>
        ))}
        <div className="h-10 w-full bg-gray-700 rounded mt-4"></div>
      </div>
    );
  }
      