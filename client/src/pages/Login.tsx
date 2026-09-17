import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../app/router/routes";
import { useLoginMutation } from "../features/auth/hooks/useAuthMutations";
import useAuthStore from "../stores/authStore";

type LocationState = {
  from?: string;
};

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useLoginMutation();

  const from = useMemo(() => {
    const state = location.state as LocationState | null;
    return state?.from ?? ROUTES.root;
  }, [location.state]);

  if (user) navigate(ROUTES.root, { replace: true });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.reset();

    try {
      await loginMutation.mutateAsync({ email, password });
      navigate(from, { replace: true });
    } catch {
    }
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <h1 className="text-lg font-semibold text-text-primary">Login</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Sign in to Bantay PH using your email and password.
      </p>

      {loginMutation.error ? (
        <div className="mt-4 rounded-lg border border-danger bg-danger-light p-3 text-sm text-danger">
          {loginMutation.error.message}
        </div>
      ) : null}

      <form className="mt-6 space-y-3" onSubmit={onSubmit}>
        <div>
          <label className="text-sm text-text-secondary">Email</label>
          <input
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            autoComplete="email"
          />
        </div>

        <div>
          <label className="text-sm text-text-secondary">Password</label>
          <input
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            type="password"
            autoComplete="current-password"
          />
        </div>

        <button
          className="w-full rounded-lg bg-primary px-3 py-2 text-sm font-medium text-surface hover:bg-primary-dark disabled:opacity-60"
          type="submit"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Logging in…" : "Login"}
        </button>

        <div className="text-sm text-text-secondary">
          No account?{" "}
          <Link className="text-primary hover:text-primary-dark" to={ROUTES.register}>
            Register
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;