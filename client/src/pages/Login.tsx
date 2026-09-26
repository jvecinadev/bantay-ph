import { useMemo, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../app/router/routes";
import { useLoginMutation } from "../features/auth/hooks/useAuthMutations";
import useAuthStore from "../stores/authStore";
import Logo from "../assets/logo.png";

import Modal from "../shared/ui/Modal";
import TermsContent from "./legal/TermsContent";
import PrivacyContent from "./legal/PrivacyContent";

type LocationState = {
  from?: string;
};

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);

  const loginMutation = useLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [legalOpen, setLegalOpen] = useState<null | "terms" | "privacy">(null);

  const from = useMemo(() => {
    const state = location.state as LocationState | null;
    return state?.from ?? ROUTES.root;
  }, [location.state]);

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, from, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginMutation.mutateAsync({ email, password });
  };

  return (
    <div className="min-h-dvh bg-background lg:grid lg:grid-cols-[1.15fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-primary-dark lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16 dark:bg-primary-light">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12] dark:opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgb(255 255 255) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}
        />

        <div className="pointer-events-none absolute -right-40 -top-40 h-144 w-xl rounded-full border-[3rem] border-accent/15" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-[24rem] rounded-full border-[1.5rem] border-accent/20" />
        <div className="pointer-events-none absolute -bottom-40 -left-32 h-120 w-120 rounded-full bg-accent/10 blur-3xl" />

        <div className="pointer-events-none absolute bottom-24 right-10 h-1.5 w-1.5 rounded-full bg-accent/70" />
        <div className="pointer-events-none absolute bottom-40 right-20 h-1 w-1 rounded-full bg-accent/50" />
        <div className="pointer-events-none absolute top-1/3 right-8 h-1 w-1 rounded-full bg-accent/40" />

        <header className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface/95 p-1.5 shadow-card dark:bg-surface/90">
            <img
              src={Logo}
              alt="Bantay PH"
              className="h-full w-full object-contain"
              draggable={false}
            />
          </div>
          <span className="text-sm font-bold tracking-tight text-white">
            Bantay PH
          </span>
        </header>

        <div className="relative max-w-lg">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-white/90">
              Community Issue Reporting
            </span>
          </div>

          <h2 className="text-4xl font-bold leading-[1.05] tracking-tight text-white xl:text-5xl">
            Report.
            <br />
            Verify.
            <br />
            <span className="text-accent">Resolve.</span>
          </h2>

          <p className="mt-6 max-w-md text-sm leading-relaxed text-white/70">
            A community-powered platform for reporting and tracking issues in
            your barangay. Transparent, verified, and fast.
          </p>

          <div className="mt-12 grid grid-cols-3 gap-5 xl:gap-6">
            <div>
              <div className="text-[11px] font-bold tabular-nums tracking-wider text-accent">
                01
              </div>
              <div className="mt-2 h-px w-full bg-white/15" />
              <div className="mt-3 text-sm font-semibold text-white">
                Verified reports
              </div>
              <div className="mt-1 text-xs leading-relaxed text-white/55">
                Validators confirm every submission.
              </div>
            </div>
            <div>
              <div className="text-[11px] font-bold tabular-nums tracking-wider text-accent">
                02
              </div>
              <div className="mt-2 h-px w-full bg-white/15" />
              <div className="mt-3 text-sm font-semibold text-white">
                Live tracking
              </div>
              <div className="mt-1 text-xs leading-relaxed text-white/55">
                Follow status from report to resolve.
              </div>
            </div>
            <div>
              <div className="text-[11px] font-bold tabular-nums tracking-wider text-accent">
                03
              </div>
              <div className="mt-2 h-px w-full bg-white/15" />
              <div className="mt-3 text-sm font-semibold text-white">
                Community-driven
              </div>
              <div className="mt-1 text-xs leading-relaxed text-white/55">
                Built with and for your barangay.
              </div>
            </div>
          </div>
        </div>

        <footer className="relative flex items-center justify-between text-[11px] text-white/45">
          <span>© {new Date().getFullYear()} Bantay PH</span>
          <span>Made for Filipino communities</span>
        </footer>
      </aside>

      <main className="flex min-h-dvh items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
        <div className="w-full max-w-md">
          <div className="mb-10 flex flex-col items-center gap-3 lg:hidden">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary p-2.5 shadow-card">
              <img
                src={Logo}
                alt="Bantay PH"
                className="h-full w-full object-contain"
                draggable={false}
              />
            </div>
            <div className="text-center">
              <div className="text-base font-bold tracking-tight text-text-primary">
                Bantay PH
              </div>
              <div className="text-xs text-text-secondary">
                Community Issue Reporting
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
              Secure sign-in
            </span>
          </div>

          <h1 className="mt-0 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl lg:mt-4">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Sign in to continue to Bantay PH.
          </p>

          {loginMutation.error ? (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-danger/30 bg-danger-light px-4 py-3 text-sm text-danger">
              <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-danger/20 text-[10px] font-bold">
                !
              </span>
              <span className="leading-relaxed">
                {loginMutation.error.message}
              </span>
            </div>
          ) : null}

          <form className="mt-8 space-y-5" onSubmit={onSubmit}>
            <div>
              <label
                className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                className="mt-2 w-full rounded-xl border border-border-strong bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/60 transition-colors focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label
                className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative mt-2">
                <input
                  id="password"
                  className="w-full rounded-xl border border-border-strong bg-surface px-4 py-3 pr-16 text-sm text-text-primary placeholder:text-text-secondary/60 transition-colors focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-semibold text-text-secondary transition-colors hover:text-text-primary focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-surface shadow-card transition-all hover:bg-primary-dark hover:shadow-card-hover focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
              type="submit"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Logging in…" : "Login"}
            </button>

            <p className="text-center text-xs leading-relaxed text-text-secondary">
              By continuing, you agree to our{" "}
              <button
                type="button"
                onClick={() => setLegalOpen("terms")}
                className="font-semibold text-primary hover:underline"
              >
                Terms
              </button>{" "}
              and{" "}
              <button
                type="button"
                onClick={() => setLegalOpen("privacy")}
                className="font-semibold text-primary hover:underline"
              >
                Privacy Policy
              </button>
              .
            </p>
          </form>

          <div className="mt-8 border-t border-border pt-6">
            <p className="text-center text-sm text-text-secondary">
              No account?{" "}
              <Link
                className="font-semibold text-primary transition-colors hover:text-primary-dark"
                to={ROUTES.register}
              >
                Create one
              </Link>
            </p>
          </div>

          <p className="mt-8 text-center text-[11px] text-text-secondary lg:hidden">
            © {new Date().getFullYear()} Bantay PH
          </p>
        </div>
      </main>

      <Modal
        open={legalOpen !== null}
        title={legalOpen === "terms" ? "Terms and Conditions" : "Privacy Policy"}
        onClose={() => setLegalOpen(null)}
      >
        {legalOpen === "terms" ? <TermsContent /> : <PrivacyContent />}
      </Modal>
    </div>
  );
};

export default LoginPage;