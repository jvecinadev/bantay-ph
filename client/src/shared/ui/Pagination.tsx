type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({ page, totalPages, onPageChange }: Props) => {
  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  return (
    <div className="mt-4 flex items-center justify-between gap-2">
      <button
        type="button"
        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary disabled:opacity-60"
        onClick={() => onPageChange(page - 1)}
        disabled={prevDisabled}
      >
        Prev
      </button>

      <div className="text-sm text-text-secondary">
        Page <span className="text-text-primary">{page}</span> of{" "}
        <span className="text-text-primary">{totalPages || 1}</span>
      </div>

      <button
        type="button"
        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary disabled:opacity-60"
        onClick={() => onPageChange(page + 1)}
        disabled={nextDisabled}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;