type Props = {
  isDirty: boolean;
  isSaving: boolean;
  onReset: () => void;
  onSave: () => void;
};

const SaveBar = ({ isDirty, isSaving, onReset, onSave }: Props) => {
  return (
    <div className="mt-4 flex items-center justify-end gap-2">
      <button
        type="button"
        className="rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground disabled:opacity-50"
        disabled={!isDirty || isSaving}
        onClick={onReset}
      >
        Reset
      </button>
      <button
        type="button"
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
        disabled={!isDirty || isSaving}
        onClick={onSave}
      >
        {isSaving ? "Saving..." : "Save changes"}
      </button>
    </div>
  );
};

export default SaveBar;