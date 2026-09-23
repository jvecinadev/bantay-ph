import { useMemo, useState } from "react";

type Props = {
  onSubmit: (comment: string) => Promise<void>;
  isPending?: boolean;
  canComment?: boolean;
};

const MAX_LENGTH = 1000;

const CommentForm = ({ onSubmit, isPending, canComment = true }: Props) => {
  const [comment, setComment] = useState("");

  const trimmed = comment.trim();
  const length = comment.length;

  const canSend = useMemo(() => {
    return canComment && trimmed.length >= 1 && !isPending && length <= MAX_LENGTH;
  }, [canComment, trimmed, isPending, length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSend) return;

    const text = trimmed;
    await onSubmit(text);
    setComment("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && canSend) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const nearLimit = length > MAX_LENGTH * 0.9;

  if (!canComment) return null;

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        className="block min-h-20 w-full resize-y rounded-xl border border-border-strong bg-surface px-3.5 py-2.5 text-sm leading-relaxed text-text-primary placeholder:text-text-secondary/60 transition-colors focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:text-text-secondary"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Write a comment…"
        disabled={!!isPending}
        maxLength={MAX_LENGTH}
      />

      <div className="mt-2 flex items-center justify-between gap-3">
        <div className="min-w-0 text-xs text-text-secondary">
          {length > 0 ? (
            <span className={nearLimit ? "font-medium text-danger" : ""}>
              {length} / {MAX_LENGTH}
            </span>
          ) : (
            <span className="hidden sm:inline">
              <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px]">
                ⌘
              </kbd>
              <span className="mx-0.5">+</span>
              <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px]">
                Enter
              </kbd>{" "}
              to post
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={!canSend}
          className="inline-flex shrink-0 items-center justify-center rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-surface transition-colors hover:bg-primary-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Posting…" : "Post"}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;