import { Link } from "react-router-dom";
import { ROUTES } from "../app/router/routes";

const LoginPage = () => {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <h1 className="text-lg font-semibold text-text-primary">Login</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Sign in to Bantay PH using your email and password.
      </p>

      <div className="mt-6 space-y-3">
        <div>
          <label className="text-sm text-text-secondary">Email</label>
          <input
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
            placeholder="you@email.com"
          />
        </div>
        <div>
          <label className="text-sm text-text-secondary">Password</label>
          <input
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
            placeholder="••••••••"
            type="password"
          />
        </div>

        <button
          className="w-full rounded-lg bg-primary px-3 py-2 text-sm font-medium text-surface hover:bg-primary-dark"
          type="button"
        >
          Login
        </button>

        <div className="text-sm text-text-secondary">
          No account?{" "}
          <Link className="text-primary hover:text-primary-dark" to={ROUTES.register}>
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;