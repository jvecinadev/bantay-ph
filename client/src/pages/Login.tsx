import { useMemo, useState, useEffect } from "react";
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

  useEffect(() => {
    if (user) {
      navigate(ROUTES.root, { replace: true });
    }
  }, [user, navigate]);

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
      <div className="min-h-dvh bg-background lg:grid lg:grid-cols-2">
        {/* LEFT: Brand panel (lg+) */}
        <aside className="relative hidden overflow-hidden bg-primary p-12 lg:flex lg:flex-col lg:justify-between">
          {/* Decorative sun rays */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full border-40 border-accent/20" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />

          {/* Logo */}
          <div className="relative flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface">
              <div className="h-4 w-4 rounded-full bg-accent" />
            </div>
            <div className="text-surface">
              <div className="text-sm font-bold tracking-tight">Bantay PH</div>
              <div className="text-xs text-surface/70">Community Issue Reporting</div>
            </div>
          </div>

          {/* Hero text */}
          <div className="relative max-w-md text-surface">
            <h2 className="text-3xl font-bold leading-tight lg:text-4xl">
              Report. Verify. <span className="text-accent">Resolve.</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-surface/80">
              A community-powered platform for reporting and tracking issues in your barangay — transparent, verified, and fast.
            </p>

            {/* Feature pills */}
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full border border-surface/20 bg-surface/10 px-3 py-1 text-xs font-medium text-surface">Verified reports</span>
              <span className="rounded-full border border-surface/20 bg-surface/10 px-3 py-1 text-xs font-medium text-surface">Live tracking</span>
              <span className="rounded-full border border-surface/20 bg-surface/10 px-3 py-1 text-xs font-medium text-surface">Community-driven</span>
            </div>
          </div>

          {/* Bottom credit */}
          <div className="relative text-xs text-surface/60">
            © {new Date().getFullYear()} Bantay PH
          </div>
        </aside>

        {/* RIGHT: Form */}
        <main className="flex min-h-dvh items-center justify-center px-4 py-8 sm:px-6 lg:px-12">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <div className="h-4 w-4 rounded-full bg-accent" />
              </div>
              <div>
                <div className="text-sm font-bold text-text-primary">Bantay PH</div>
                <div className="text-xs text-text-secondary">Community Issue Reporting</div>
              </div>
            </div>

            {/* Card */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-card lg:p-8">
              {/* existing heading */}
              <h1 className="text-2xl font-bold tracking-tight text-text-primary">Welcome back</h1>
              <p className="mt-1 text-sm text-text-secondary">Sign in to continue to Bantay PH.</p>

              {/* error - styled better */}
              {loginMutation.error ? (
                <div className="mt-5 flex items-start gap-3 rounded-xl border border-danger/30 bg-danger-light px-4 py-3 text-sm text-danger">
                  <span className="mt-0.5 inline-block h-4 w-4 shrink-0 rounded-full bg-danger/20" />
                  <span>{loginMutation.error.message}</span>
                </div>
              ) : null}

              <form className="mt-6 space-y-4" onSubmit={onSubmit}>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary" htmlFor="email">Email</label>
                  <input
                    id="email"
                    className="mt-2 w-full rounded-xl border border-border-strong bg-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 transition-colors focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    autoComplete="email"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary" htmlFor="password">Password</label>
                  </div>
                  <input
                    id="password"
                    className="mt-2 w-full rounded-xl border border-border-strong bg-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 transition-colors focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    type="password"
                    autoComplete="current-password"
                  />
                </div>

                <button
                  className="group relative w-full overflow-hidden rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-surface shadow-card transition-all hover:bg-primary-dark hover:shadow-card-hover focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                  type="submit"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Logging in…" : "Login"}
                </button>

                <p className="text-center text-sm text-text-secondary">
                  No account?{" "}
                  <Link className="font-semibold text-primary hover:text-primary-dark" to={ROUTES.register}>
                    Register
                  </Link>
                </p>
              </form>
            </div>

            <p className="mt-6 text-center text-xs text-text-secondary lg:hidden">
              © {new Date().getFullYear()} Bantay PH
            </p>
          </div>
        </main>
      </div>
    );
};

export default LoginPage;