export const getErrorMessage = (err: unknown) => {
  if (!err) return "Something went wrong.";
  if (typeof err === "string") return err;
  if (typeof err === "object" && "message" in err) {
    const msg = (err as { message?: unknown }).message;
    if (typeof msg === "string" && msg.trim()) return msg;
  }
  return "Something went wrong.";
};