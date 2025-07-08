import { useState, useEffect, useRef } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { Indicator } from "../types/indicator";
import { Category } from "../types/category";
import { IconButton } from "@/components/ui/IconButton";

interface SearchBarProps {
  indicators: Indicator[];
  categories: Category[];
  setCategoryFilter: (categoryId: number) => void;
}

export default function SearchBar({ indicators, setCategoryFilter }: SearchBarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const globalSearchResults = indicators.filter((indicator) =>
    indicator.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectIndicator = (indicator: Indicator) => {
    setCategoryFilter(indicator.category.id);
    setSearchOpen(false);
    setSearchQuery("");
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };

    if (searchOpen) {
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [searchOpen]);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [searchOpen]);

  return (
    <>
      <IconButton onClick={() => setSearchOpen(true)} aria-label="Abrir buscador">
        <FaSearch size={18} />
      </IconButton>

      {searchOpen && (
        <div
          className="fixed inset-0  bg-opacity-50 backdrop-blur-sm z-40"
          onClick={() => setSearchOpen(false)}
        ></div>
      )}

      <div
        className={`fixed top-1/4 left-1/2 transform -translate-x-1/2 w-3/5 bg-white shadow-xl rounded-lg transition-all z-50 ${searchOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
          }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-gray-700">
          <div className="flex items-center w-full">
            <FaSearch className="text-gray-800 mr-3" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 text-gray-800 outline-none bg-transparent"
              placeholder="Buscar indicador..."
            />
          </div>
          <button
            onClick={() => setSearchOpen(false)}
            className="text-gray-800 hover:text-gray-600 transition"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {searchOpen && searchQuery && (
          <div className="max-h-60 overflow-y-auto">
            {globalSearchResults.length === 0 ? (
              <p className="p-4 text-gray-400">No se encontraron resultados.</p>
            ) : (
              <ul className="divide-y">
                {globalSearchResults.map((indicator) => (
                  <li
                    key={indicator.id}
                    onClick={() => handleSelectIndicator(indicator)}
                    className="p-3 cursor-pointer hover:bg-gray-600 hover:text-gray-100 text-gray-600 transition"
                  >
                    {indicator.name} <span className="text-sm  ">({indicator.category.name})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </>
  );
}
