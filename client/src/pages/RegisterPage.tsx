import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../app/router/routes";
import { useRegisterMutation } from "../features/auth/hooks/useAuthMutations";

const RegisterPage = () => {
  const navigate = useNavigate();
  const registerMutation = useRegisterMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.reset();

    try {
      await registerMutation.mutateAsync({ name, email, password, confirmPassword });

      navigate(ROUTES.root, { replace: true });
    } catch {
    }
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <h1 className="text-lg font-semibold text-text-primary">Register</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Create an account to submit and track reports.
      </p>

      {registerMutation.error ? (
        <div className="mt-4 rounded-lg border border-danger bg-danger-light p-3 text-sm text-danger">
          {registerMutation.error.message}
        </div>
      ) : null}

      <form className="mt-6 space-y-3" onSubmit={onSubmit}>
        <div>
          <label className="text-sm text-text-secondary">Name</label>
          <input
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        </div>

        <div>
          <label className="text-sm text-text-secondary">Email</label>
          <input
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        <div>
          <label className="text-sm text-text-secondary">Password</label>
          <input
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete="new-password"
          />
        </div>

        <div>
          <label className="text-sm text-text-secondary">Confirm Password</label>
          <input
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            autoComplete="new-password"
          />
        </div>

        <button
          className="w-full rounded-lg bg-primary px-3 py-2 text-sm font-medium text-surface hover:bg-primary-dark disabled:opacity-60"
          type="submit"
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? "Creating…" : "Create account"}
        </button>

        <div className="text-sm text-text-secondary">
          Already have an account?{" "}
          <Link className="text-primary hover:text-primary-dark" to={ROUTES.login}>
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;