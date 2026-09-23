import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../app/router/routes";
import { useRegisterMutation } from "../features/auth/hooks/useAuthMutations";
import Logo from "../assets/logo.png";

import Modal from "../shared/ui/Modal";
import TermsContent from "./legal/TermsContent";
import PrivacyContent from "./legal/PrivacyContent";

const RegisterPage = () => {
  const navigate = useNavigate();
  const registerMutation = useRegisterMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [agree, setAgree] = useState(false);
  const [agreeTouched, setAgreeTouched] = useState(false);

  const [legalOpen, setLegalOpen] = useState<null | "terms" | "privacy">(null);

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
      // handled by registerMutation.error
    }
  };

  const showAgreeError = agreeTouched && !agree;

  return (
    <div className="min-h-dvh bg-background lg:grid lg:grid-cols-2">
      {/* ============ LEFT: BRAND PANEL (desktop only) ============ */}
      <aside className="relative hidden overflow-hidden bg-primary lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute -right-32 -top-32 h-112 w-md rounded-full border-[3rem] border-accent/20" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-[20rem] rounded-full border-[1.5rem] border-accent/10" />
        <div className="pointer-events-none absolute -bottom-40 -left-24 h-104 w-104 rounded-full bg-accent/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-32 right-12 h-2 w-2 rounded-full bg-accent/60" />
        <div className="pointer-events-none absolute right-24 top-1/2 h-1.5 w-1.5 rounded-full bg-accent/40" />

        <div className="flex items-center gap-3">
          <img src={Logo} alt="Bantay PH" className="h-9 w-9 object-contain" />
        </div>

        <div className="relative max-w-md text-surface">
          <h2 className="text-3xl font-bold leading-tight tracking-tight lg:text-4xl">
            Be part of the <span className="text-accent">solution.</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-surface/80">
            Join a growing community of citizens working together to make every barangay safer,
            cleaner, and better served.
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            <span className="rounded-full border border-surface/20 bg-surface/10 px-3 py-1 text-xs font-medium text-surface backdrop-blur-sm">
              Free to join
            </span>
            <span className="rounded-full border border-surface/20 bg-surface/10 px-3 py-1 text-xs font-medium text-surface backdrop-blur-sm">
              Submit reports
            </span>
            <span className="rounded-full border border-surface/20 bg-surface/10 px-3 py-1 text-xs font-medium text-surface backdrop-blur-sm">
              Track progress
            </span>
          </div>
        </div>

        <div className="relative text-xs text-surface/60">
          © {new Date().getFullYear()} Bantay PH — Serving communities nationwide
        </div>
      </aside>

      {/* ============ RIGHT: FORM PANEL ============ */}
      <main className="flex min-h-dvh items-center justify-center px-4 py-8 sm:px-6 lg:px-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary shadow-card">
              <div className="relative h-4 w-4 rounded-full bg-accent">
                <span className="absolute inset-0 -m-1 rounded-full border border-accent/40" />
              </div>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-bold tracking-tight text-text-primary">Bantay PH</div>
              <div className="text-xs text-text-secondary">Community Issue Reporting</div>
            </div>
          </div>

          {/* Form card */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-card lg:p-8">
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">Create account</h1>
            <p className="mt-1 text-sm text-text-secondary">
              Create an account to submit and track reports.
            </p>

            {registerMutation.error ? (
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-danger/30 bg-danger-light px-4 py-3 text-sm text-danger">
                <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-danger/20 text-[10px] font-bold">
                  !
                </span>
                <span className="leading-relaxed">{registerMutation.error.message}</span>
              </div>
            ) : null}

            <form className="mt-6 space-y-4" onSubmit={onSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="text-xs font-semibold uppercase tracking-wider text-text-secondary"
                >
                  Name
                </label>
                <input
                  id="name"
                  className="mt-2 w-full rounded-xl border border-border-strong bg-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 transition-colors focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="text-xs font-semibold uppercase tracking-wider text-text-secondary"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="mt-2 w-full rounded-xl border border-border-strong bg-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 transition-colors focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="password"
                    className="text-xs font-semibold uppercase tracking-wider text-text-secondary"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    className="mt-2 w-full rounded-xl border border-border-strong bg-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 transition-colors focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    autoComplete="new-password"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="text-xs font-semibold uppercase tracking-wider text-text-secondary"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    className="mt-2 w-full rounded-xl border border-border-strong bg-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 transition-colors focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type="password"
                    autoComplete="new-password"
                  />
                </div>
              </div>

              {/* REQUIRED TERMS CHECKBOX (modal) */}
              <div
                className={[
                  "rounded-xl border bg-surface p-4",
                  showAgreeError ? "border-danger/40" : "border-border",
                ].join(" ")}
              >
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => {
                      setAgree(e.target.checked);
                      setAgreeTouched(true);
                    }}
                    onBlur={() => setAgreeTouched(true)}
                    className="mt-1 h-4 w-4 rounded border border-border-strong bg-surface accent-primary"
                  />

                  <span className="text-sm leading-relaxed text-text-secondary">
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
                  <div className="mt-2 text-xs text-danger">You must agree before creating an account.</div>
                ) : null}
              </div>

              <button
                className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-surface shadow-card transition-all hover:bg-primary-dark hover:shadow-card-hover focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                type="submit"
                disabled={registerMutation.isPending || !agree}
                onClick={() => setAgreeTouched(true)}
              >
                {registerMutation.isPending ? "Creating…" : "Create account"}
              </button>

              <p className="pt-1 text-center text-sm text-text-secondary">
                Already have an account?{" "}
                <Link
                  className="font-semibold text-primary transition-colors hover:text-primary-dark"
                  to={ROUTES.login}
                >
                  Login
                </Link>
              </p>
            </form>
          </div>

          {/* Mobile footer */}
          <p className="mt-6 text-center text-xs text-text-secondary lg:hidden">
            © {new Date().getFullYear()} Bantay PH
          </p>
        </div>
      </main>

      {/* Legal modal */}
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