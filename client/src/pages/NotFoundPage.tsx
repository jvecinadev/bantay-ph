import { Link } from "react-router-dom";
import { ROUTES } from "../app/router/routes";

const NotFoundPage = () => {
  return (
    <div className="min-h-dvh bg-background px-4 py-10 text-text-primary">
      <div className="mx-auto w-full max-w-lg rounded-xl border border-border bg-surface p-6">
        <h1 className="text-lg font-semibold text-text-primary">Page not found</h1>
        <p className="mt-1 text-sm text-text-secondary">
          The page you're looking for doesn't exist.
        </p>
        <Link
          className="mt-4 inline-flex rounded-lg bg-primary px-3 py-2 text-sm font-medium text-surface hover:bg-primary-dark"
          to={ROUTES.feed}
        >
          Go to Feed
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;