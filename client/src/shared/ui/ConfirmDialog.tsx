import type { ReactNode } from "react";
import Modal from "./Modal";

type Tone = "danger" | "primary";

type Props = {
  open: boolean;
  title: string;
  headline: string;
  description?: string;
  confirmLabel: string;
  pendingLabel?: string;
  tone?: Tone;
  isPending?: boolean;
  errorMessage?: string;
  onConfirm: () => void;
  onClose: () => void;
  children?: ReactNode;
};

const TONE_HEADER: Record<Tone, string> = {
  danger: "border-danger/30 bg-danger-light text-danger",
  primary: "border-primary/30 bg-primary-light text-primary",
};

const TONE_ICON: Record<Tone, string> = {
  danger: "bg-danger/20 text-danger",
  primary: "bg-primary/20 text-primary",
};

const TONE_CONFIRM: Record<Tone, string> = {
  danger:
    "bg-danger text-surface shadow-card hover:brightness-95 hover:shadow-card-hover focus-visible:ring-danger/20",
  primary:
    "bg-primary text-surface shadow-card hover:bg-primary-dark hover:shadow-card-hover focus-visible:ring-primary/20",
};

const ConfirmDialog = ({
  open,
  title,
  headline,
  description,
  confirmLabel,
  pendingLabel,
  tone = "danger",
  isPending,
  errorMessage,
  onConfirm,
  onClose,
  children,
}: Props) => (
  <Modal
    open={open}
    title={title}
    onClose={() => {
      if (isPending) return;
      onClose();
    }}
  >
    <div className="space-y-5">
      <div
        className={[
          "flex items-start gap-3 rounded-xl border px-4 py-3",
          TONE_HEADER[tone],
        ].join(" ")}
      >
        <span
          className={[
            "mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
            TONE_ICON[tone],
          ].join(" ")}
        >
          !
        </span>
        <div className="min-w-0 space-y-1">
          <div className="text-sm font-semibold">{headline}</div>
          {description ? (
            <p className="text-xs leading-relaxed opacity-80">
              {description}
            </p>
          ) : null}
        </div>
      </div>

      {children}

      {errorMessage ? (
        <div className="flex items-start gap-3 rounded-xl border border-danger/30 bg-danger-light px-4 py-3 text-sm text-danger">
          <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-danger/20 text-[10px] font-bold">
            !
          </span>
          <span className="leading-relaxed">{errorMessage}</span>
        </div>
      ) : null}

      <div className="flex items-center justify-end gap-2.5 border-t border-border pt-5">
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="inline-flex items-center justify-center rounded-lg px-3.5 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-sunken hover:text-text-primary focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={isPending}
          className={[
            "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-all focus:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none",
            TONE_CONFIRM[tone],
          ].join(" ")}
        >
          {isPending ? (pendingLabel ?? "Working…") : confirmLabel}
        </button>
      </div>
    </div>
  </Modal>
);

export default ConfirmDialog;