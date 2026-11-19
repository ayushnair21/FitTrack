"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus("Sending reset instructions...");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      const data = await res.json();

      if (res.ok) {
        setStatus(
          "If an account exists with that email, reset instructions have been sent.",
        );
      } else {
        setStatus(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setStatus("Server error. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat transition-all duration-700 bg-[url('/bg-light.png')] dark:bg-[url('/bg-dark.png')] px-4 pt-16">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl mx-auto p-8 shadow-2xl text-gray-900 bg-white/40 backdrop-blur-md border border-white/50 dark:text-white dark:bg-[#050505]/60 dark:backdrop-blur-lg dark:border-white/10 dark:shadow-black/60">
        <h1 className="text-2xl font-bold tracking-tight mb-2">
          Reset Password
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="reset-email"
              className="text-sm font-medium text-gray-800 dark:text-neutral-200"
            >
              Email
            </label>
            <input
              id="reset-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-200 bg-white/50 backdrop-blur-sm px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 transition-shadow focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#3A0CA3] dark:border-neutral-700 dark:bg-black/40 dark:text-white dark:placeholder:text-neutral-400"
            />
          </div>

          {status && (
            <p className="text-sm font-medium text-center text-blue-600 dark:text-blue-400">
              {status}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#3A0CA3] px-4 py-3 text-sm font-semibold uppercase tracking-wider text-white shadow-lg shadow-[#3A0CA3]/25 transition-all hover:brightness-110 active:scale-[0.98] focus-visible:outline-none disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-sm font-medium text-[#3A0CA3] hover:underline dark:text-[#9b7bff]"
          >
            &larr; Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
