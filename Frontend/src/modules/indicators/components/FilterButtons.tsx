import { Category } from "../types/category";

type FilterButtonsProps = {
    categories: Category[];
    categoryFilter: number;
    setCategoryFilter: (categoryId: number) => void;
};

export const FilterButtons = ({ categories, categoryFilter, setCategoryFilter }: FilterButtonsProps) => {
    return (
        <div className="flex justify-center">
            <div className="flex gap-x-2 overflow-x-auto scrollbar-hide sm:px-0 whitespace-nowrap">
                {categories
                    .sort((a, b) => a.order - b.order)
                    .map((category) => (
                        <button
                        key={category.id}
                        onClick={() => setCategoryFilter(category.id)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-75 ${
                            categoryFilter === category.id
                                ? "bg-gray-800 text-white"
                                : "border border-gray-800 hover:bg-gray-800 hover:text-white text-gray-800"
                        }`}
                    >
                        {category.name}
                    </button>
                    ))}
            </div>
        </div>
    );
};
