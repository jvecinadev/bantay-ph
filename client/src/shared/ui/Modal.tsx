import { useEffect } from "react";

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

const Modal = ({ open, title, onClose, children }: ModalProps) => {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* overlay */}
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
      />

      {/* panel */}
      <div className="absolute inset-x-0 bottom-0 sm:inset-0 sm:flex sm:items-center sm:justify-center sm:p-4">
        <div className="relative w-full sm:max-w-3xl overflow-hidden rounded-t-2xl sm:rounded-2xl border border-border bg-surface shadow-card">
          <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-6">
            <h2 className="text-base font-semibold text-text-primary">{title}</h2>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-xl border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary hover:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
            >
              Close
            </button>
          </div>

          <div className="max-h-[70vh] overflow-y-auto px-5 py-4 sm:px-6 sm:py-5 text-sm leading-relaxed text-text-secondary">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;