interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PaginationControls({ currentPage, totalPages, onPageChange }: Props) {
  return (
    <div className="flex justify-end mt-4 mb-2 space-x-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="text-gray-400 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        &laquo; Anterior
      </button>
      <span className="text-white font-medium">
        Página {currentPage} / {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="text-gray-400 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Siguiente &raquo;
      </button>
    </div>
  );
}
