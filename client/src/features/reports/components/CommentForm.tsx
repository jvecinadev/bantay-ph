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

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5">
        <div>
          <div className="text-sm font-semibold text-text-primary">Add a comment</div>
          <div className="mt-0.5 text-xs text-text-secondary">
            Be specific and respectful. Comments are public to authorized users.
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-4">
        <textarea
          className="min-h-24 w-full resize-y rounded-xl border border-border-strong bg-surface px-3.5 py-2.5 text-sm leading-relaxed text-text-primary placeholder:text-text-secondary/60 transition-colors focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:text-text-secondary"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            canComment
              ? "Write your comment…"
              : "You don't have permission to comment."
          }
          disabled={!canComment || !!isPending}
          maxLength={MAX_LENGTH}
        />
      </div>

      {/* Footer: hint + counter + submit */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-surface-sunken/50 px-5 py-3.5">
        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-text-secondary sm:inline">
            Press{" "}
            <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px] text-text-secondary">
              ⌘
            </kbd>
            <span className="mx-0.5">+</span>
            <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px] text-text-secondary">
              Enter
            </kbd>{" "}
            to post
          </span>

          {length > 0 ? (
            <span
              className={`text-xs ${
                nearLimit ? "font-medium text-danger" : "text-text-secondary"
              }`}
            >
              {length} / {MAX_LENGTH}
            </span>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={!canSend}
          className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-surface shadow-card transition-all hover:bg-primary-dark hover:shadow-card-hover focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          {isPending ? "Posting…" : "Post comment"}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;