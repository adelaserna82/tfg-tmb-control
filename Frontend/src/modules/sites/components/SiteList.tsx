import { PencilIcon } from "@heroicons/react/24/outline";
import { Site } from "../types/site";

interface Props {
  sites: Site[];
  onEdit: (site: Site) => void;
}

export default function SiteList({ sites, onEdit }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sites.map((site) => (
        <div
          key={site.id}
          className="p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition flex justify-between items-center"
        >
          <a href={site.href} target="_blank" rel="noopener noreferrer" className="flex-grow">
            <h3 className="font-semibold">{site.name}</h3>
            <p className="text-gray-400 text-sm">{site.description}</p>
          </a>
          <button onClick={() => onEdit(site)} className="text-gray-400 hover:text-blue-400 ml-2">
            <PencilIcon className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
}