import { useMemo, useState } from "react";

type Props = {
  onSubmit: (comment: string) => Promise<void>;
  isPending?: boolean;
  canComment?: boolean;
};

const CommentForm = ({ onSubmit, isPending, canComment = true }: Props) => {
  const [comment, setComment] = useState("");

  const canSend = useMemo(() => {
    return canComment && comment.trim().length >= 1 && !isPending;
  }, [canComment, comment, isPending]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSend) return;

    const text = comment.trim();
    await onSubmit(text);
    setComment("");
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-surface p-4">
      <div className="text-sm font-medium text-text-primary">Add a comment</div>
      <div className="mt-1 text-xs text-text-secondary">
        Be specific and respectful. Comments are public to authorized users.
      </div>

      <textarea
        className="mt-3 min-h-24 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary disabled:opacity-60"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={canComment ? "Write your comment…" : "You don’t have permission to comment."}
        disabled={!canComment || !!isPending}
      />

      <div className="mt-3 flex items-center justify-end">
        <button
          type="submit"
          disabled={!canSend}
          className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-surface hover:bg-primary-dark disabled:opacity-60"
        >
          {isPending ? "Posting…" : "Post comment"}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;