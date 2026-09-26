import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../app/router/routes";
import { useRegisterMutation } from "../features/auth/hooks/useAuthMutations";
import Logo from "../assets/logo.png";

import Modal from "../shared/ui/Modal";
import TermsContent from "./legal/TermsContent";
import PrivacyContent from "./legal/PrivacyContent";

type ValidationDetail = {
  code?: string;
  path?: Array<string | number>;
  message?: string;
};

type ApiErrorShape = {
  message?: string;
  code?: string;
  details?: ValidationDetail[];
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const registerMutation = useRegisterMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [agree, setAgree] = useState(false);
  const [agreeTouched, setAgreeTouched] = useState(false);

  const [legalOpen, setLegalOpen] = useState<null | "terms" | "privacy">(null);

  const apiError = registerMutation.error as unknown as ApiErrorShape | null;
  const isValidationError = apiError?.code === "VALIDATION_ERROR";

  const fieldErrors = useMemo(() => {
    if (!apiError || apiError.code !== "VALIDATION_ERROR" || !Array.isArray(apiError.details)) {
      return {};
    }

    const map: Record<string, string> = {};

    for (const d of apiError.details) {
      const pathArr = Array.isArray(d.path) ? d.path : [];
      const bodyIdx = pathArr.indexOf("body");

      const field =
        bodyIdx >= 0 && typeof pathArr[bodyIdx + 1] === "string"
          ? String(pathArr[bodyIdx + 1])
          : typeof pathArr[pathArr.length - 1] === "string"
            ? String(pathArr[pathArr.length - 1])
            : null;

      if (!field) continue;
      if (!map[field]) map[field] = d.message ?? "Invalid value";
    }

    return map;
  }, [apiError]);

  const showAgreeError = agreeTouched && !agree;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    registerMutation.reset();

    if (!agree) {
      setAgreeTouched(true);
      return;
    }

    try {
      await registerMutation.mutateAsync({ name, email, password, confirmPassword });
      navigate(ROUTES.root, { replace: true });
    } catch {
    }
  };

  const inputClass = (hasError: boolean) =>
    [
      "mt-2 w-full rounded-xl border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/60 transition-colors focus:outline-none focus:ring-4",
      hasError
        ? "border-danger/40 focus:border-danger focus:ring-danger/10"
        : "border-border-strong focus:border-primary focus:ring-primary/10",
    ].join(" ");

  const inputClassWithToggle = (hasError: boolean) =>
    [
      "w-full rounded-xl border bg-surface py-3 pl-4 pr-16 text-sm text-text-primary placeholder:text-text-secondary/60 transition-colors focus:outline-none focus:ring-4",
      hasError
        ? "border-danger/40 focus:border-danger focus:ring-danger/10"
        : "border-border-strong focus:border-primary focus:ring-primary/10",
    ].join(" ");

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
              Join the community
            </span>
          </div>

          <h2 className="text-4xl font-bold leading-[1.05] tracking-tight text-white xl:text-5xl">
            Be part of
            <br />
            <span className="text-accent">the solution.</span>
          </h2>

          <p className="mt-6 max-w-md text-sm leading-relaxed text-white/70">
            Join a growing community of citizens working together to make
            every barangay safer, cleaner, and better served.
          </p>

          <div className="mt-12 grid grid-cols-3 gap-5 xl:gap-6">
            <div>
              <div className="text-[11px] font-bold tabular-nums tracking-wider text-accent">
                01
              </div>
              <div className="mt-2 h-px w-full bg-white/15" />
              <div className="mt-3 text-sm font-semibold text-white">
                Free to join
              </div>
              <div className="mt-1 text-xs leading-relaxed text-white/55">
                No fees, no barriers.
              </div>
            </div>
            <div>
              <div className="text-[11px] font-bold tabular-nums tracking-wider text-accent">
                02
              </div>
              <div className="mt-2 h-px w-full bg-white/15" />
              <div className="mt-3 text-sm font-semibold text-white">
                Submit reports
              </div>
              <div className="mt-1 text-xs leading-relaxed text-white/55">
                Flag issues in your barangay.
              </div>
            </div>
            <div>
              <div className="text-[11px] font-bold tabular-nums tracking-wider text-accent">
                03
              </div>
              <div className="mt-2 h-px w-full bg-white/15" />
              <div className="mt-3 text-sm font-semibold text-white">
                Track progress
              </div>
              <div className="mt-1 text-xs leading-relaxed text-white/55">
                Follow each report to resolution.
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
              Free to join
            </span>
          </div>

          <h1 className="mt-0 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl lg:mt-4">
            Create account
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Fill in your details to start reporting.
          </p>

          {registerMutation.error && !isValidationError ? (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-danger/30 bg-danger-light px-4 py-3 text-sm text-danger">
              <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-danger/20 text-[10px] font-bold">
                !
              </span>
              <span className="leading-relaxed">
                {registerMutation.error.message}
              </span>
            </div>
          ) : null}

          {isValidationError ? (
            <div className="mt-6 rounded-xl border border-border bg-surface-sunken px-4 py-3 text-sm text-text-secondary">
              Please fix the highlighted fields below.
            </div>
          ) : null}

          <form className="mt-8 space-y-5" onSubmit={onSubmit}>
            <div>
              <label
                htmlFor="name"
                className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
              >
                Name
              </label>
              <input
                id="name"
                className={inputClass(!!fieldErrors.name)}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                placeholder="Juan dela Cruz"
              />
              {fieldErrors.name ? (
                <div className="mt-1.5 text-xs text-danger">
                  {fieldErrors.name}
                </div>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="email"
                className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                className={inputClass(!!fieldErrors.email)}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="you@email.com"
              />
              {fieldErrors.email ? (
                <div className="mt-1.5 text-xs text-danger">
                  {fieldErrors.email}
                </div>
              ) : null}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="password"
                  className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    className={inputClassWithToggle(!!fieldErrors.password)}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••"
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
                {fieldErrors.password ? (
                  <div className="mt-1.5 text-xs text-danger">
                    {fieldErrors.password}
                  </div>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
                >
                  Confirm
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    className={inputClassWithToggle(!!fieldErrors.confirmPassword)}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-semibold text-text-secondary transition-colors hover:text-text-primary focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {fieldErrors.confirmPassword ? (
                  <div className="mt-1.5 text-xs text-danger">
                    {fieldErrors.confirmPassword}
                  </div>
                ) : null}
              </div>
            </div>

            <div>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => {
                    setAgree(e.target.checked);
                    setAgreeTouched(true);
                  }}
                  onBlur={() => setAgreeTouched(true)}
                  className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border border-border-strong bg-surface accent-primary"
                />

                <span className="text-xs leading-relaxed text-text-secondary">
                  I agree to the{" "}
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setLegalOpen("terms");
                    }}
                    className="font-semibold text-primary hover:underline"
                  >
                    Terms and Conditions
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setLegalOpen("privacy");
                    }}
                    className="font-semibold text-primary hover:underline"
                  >
                    Privacy Policy
                  </button>
                  .
                </span>
              </label>

              {showAgreeError ? (
                <div className="mt-2 flex items-center gap-2 text-xs text-danger">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-danger" />
                  You must agree before creating an account.
                </div>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={registerMutation.isPending || !agree}
              onClick={() => setAgreeTouched(true)}
              className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-surface shadow-card transition-all hover:bg-primary-dark hover:shadow-card-hover focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
            >
              {registerMutation.isPending ? "Creating…" : "Create account"}
            </button>
          </form>

          <div className="mt-8 border-t border-border pt-6">
            <p className="text-center text-sm text-text-secondary">
              Already have an account?{" "}
              <Link
                className="font-semibold text-primary transition-colors hover:text-primary-dark"
                to={ROUTES.login}
              >
                Sign in
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

export default RegisterPage;