interface CommunicationTableSkeletonProps {
    columns?: number;
    rows?: number;
  }
  
  export default function CommunicationTableSkeleton({ columns = 8, rows = 5 }: CommunicationTableSkeletonProps) {
    return (
      <div className="overflow-x-auto bg-gray-900 shadow-md rounded-lg p-6 animate-pulse">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-900 text-gray-400 text-sm uppercase tracking-wider border-b border-gray-800">
              {[...Array(columns)].map((_, i) => (
                <th key={i} className="p-4 text-left">
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(rows)].map((_, rowIdx) => (
              <tr key={rowIdx} className="border-b border-gray-800">
                {[...Array(columns)].map((_, colIdx) => (
                  <td key={colIdx} className="py-4 px-4">
                    <div className="h-4 bg-gray-700 rounded w-full"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }