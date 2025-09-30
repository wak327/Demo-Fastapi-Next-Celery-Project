import { FormEvent, useState } from "react";
import Link from "next/link";

import Layout from "../components/Layout";
import useAuth from "../hooks/useAuth";

const LoginPage = () => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login({ email, password });
    } catch (err) {
      setError((err as Error).message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Layout title="Log In">Loading...</Layout>;
  }

  return (
    <Layout title="Log In">
      <div className="mx-auto max-w-md rounded-lg bg-white p-8 shadow">
        <h1 className="text-2xl font-bold text-slate-800">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-500">
          Need an account? <Link href="/register" className="text-indigo-600">Create one</Link>
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Log in"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default LoginPage;
