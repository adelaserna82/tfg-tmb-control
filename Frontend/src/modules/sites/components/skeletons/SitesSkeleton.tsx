export default function SitesSkeleton() {
    return (
        <>
            {[...Array(6)].map((_, i) => (
                <div
                    key={i}
                    className="w-full p-4 rounded-lg bg-gray-800 animate-pulse flex justify-between items-center"
                >
                    <div className="flex-grow">
                        <div className="h-5 w-1/2 bg-gray-700 rounded mb-2"></div>
                        <div className="h-4 w-3/4 bg-gray-700 rounded"></div>
                    </div>
                    <div className="flex gap-2 ml-2">
                        <div className="h-5 w-5 bg-gray-700 rounded"></div>
                        <div className="h-5 w-5 bg-gray-700 rounded"></div>
                    </div>
                </div>
            ))}</>
    );
}