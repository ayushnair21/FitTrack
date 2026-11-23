"use client";

import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import Link from "next/link";
import { useState, type FormEvent, type InputHTMLAttributes } from "react";

function AuthSlider() {
  const [isLogin, setIsLogin] = useState(true);

  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(isLogin ? "Logging in..." : "Creating your account...");

    const endpoint = isLogin ? "/api/users/login" : "/api/auth/register";
    const body = isLogin
      ? { email, password }
      : { firstName, lastName, email, password };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        window.location.href = "/dashboard";
      } else {
        setStatus(data.error || "Authentication failed.");
      }
    } catch (error) {
      setStatus("Server error. Is the backend running?");
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setStatus("Verifying with Google...");
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/users/google`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: tokenResponse.access_token }),
          },
        );

        const data = await res.json();

        if (res.ok) {
          localStorage.setItem("token", data.token);
          window.location.href = "/dashboard";
        } else {
          setStatus(data.error || "Google login failed.");
        }
      } catch (error) {
        setStatus("Server error during Google login.");
      }
    },
    onError: () => setStatus("Google popup closed or failed."),
  });

  const formBase =
    "absolute inset-y-0 left-0 flex w-full flex-col justify-center gap-5 px-8 py-10 transition-all duration-700 ease-in-out sm:px-12 md:w-1/2";

  return (
    <div className="relative min-h-[640px] w-full max-w-4xl overflow-hidden rounded-3xl mx-auto my-12 shadow-2xl text-gray-900 bg-white/40 backdrop-blur-md border border-white/50 dark:text-white dark:bg-[#050505]/60 dark:backdrop-blur-lg dark:border-white/10 dark:shadow-black/60">
      {/* SIGN IN FORM */}
      <form
        onSubmit={handleSubmit}
        aria-labelledby="sign-in-heading"
        inert={!isLogin ? true : undefined}
        className={`${formBase} ${
          isLogin
            ? "z-10 opacity-100 md:translate-x-0"
            : "z-0 opacity-0 md:translate-x-1/4"
        }`}
      >
        <h1
          id="sign-in-heading"
          className="text-3xl font-bold tracking-tight text-balance"
        >
          Login
        </h1>
        <GoogleButton onClick={() => handleGoogleLogin()} />
        <OrDivider />
        <Field
          id="signin-email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        <Field
          id="signin-password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
        <div className="flex justify-between items-center -mt-1">
          <span className="text-sm font-medium text-red-500">{status}</span>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-[#3A0CA3] hover:underline dark:text-[#9b7bff]"
          >
            Forgot Password?
          </Link>
        </div>
        <PrimaryButton>Sign In</PrimaryButton>
        <p className="text-center text-sm text-gray-600 md:hidden dark:text-neutral-400">
          {"Don't have an account? "}
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className="font-semibold text-[#3A0CA3] dark:text-[#9b7bff]"
          >
            Sign Up
          </button>
        </p>
      </form>

      {/* SIGN UP FORM */}
      <form
        onSubmit={handleSubmit}
        aria-labelledby="sign-up-heading"
        inert={isLogin ? true : undefined}
        className={`${formBase} ${
          isLogin
            ? "z-0 opacity-0 md:translate-x-[75%]"
            : "z-10 opacity-100 md:translate-x-full"
        }`}
      >
        <h2
          id="sign-up-heading"
          className="text-3xl font-bold tracking-tight text-balance"
        >
          Create Account
        </h2>
        <GoogleButton onClick={() => handleGoogleLogin()} />
        <OrDivider />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="signup-first-name"
            label="First Name"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Tony"
          />
          <Field
            id="signup-last-name"
            label="Last Name"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Stark (Optional)"
          />
        </div>
        <Field
          id="signup-email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        <Field
          id="signup-password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          minLength={8}
        />
        {status && (
          <span className="text-sm font-medium text-red-500 text-center">
            {status}
          </span>
        )}
        <PrimaryButton>Sign Up</PrimaryButton>
        <p className="text-center text-sm text-gray-600 md:hidden dark:text-neutral-400">
          {"Already have an account? "}
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className="font-semibold text-[#3A0CA3] dark:text-[#9b7bff]"
          >
            Sign In
          </button>
        </p>
      </form>

      {/* SLIDING OVERLAY PANEL */}
      <div
        className={`absolute inset-y-0 left-0 z-20 hidden w-1/2 overflow-hidden bg-[#3A0CA3] text-white transition-transform duration-700 ease-in-out md:block ${
          isLogin
            ? "translate-x-full rounded-l-[120px]"
            : "translate-x-0 rounded-r-[120px]"
        }`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-white/10 blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-20 size-80 rounded-full bg-black/20 blur-3xl"
        />

        <OverlayPanel
          visible={isLogin}
          title="Hello, Friend!"
          body="Enter your personal details to start your journey"
          cta="Sign Up"
          onClick={() => {
            setIsLogin(false);
            setStatus("");
          }}
          enterFrom="translate-x-8"
        />
        <OverlayPanel
          visible={!isLogin}
          title="Welcome Back!"
          body="Keep connected with us"
          cta="Sign In"
          onClick={() => {
            setIsLogin(true);
            setStatus("");
          }}
          enterFrom="-translate-x-8"
        />
      </div>
    </div>
  );
}

/* --- REUSABLE UI COMPONENTS (Extracted from v0 form-parts) --- */

function OverlayPanel({ visible, title, body, cta, onClick, enterFrom }: any) {
  return (
    <div
      inert={!visible ? true : undefined}
      className={`absolute inset-0 flex flex-col items-center justify-center gap-6 px-12 text-center transition-all duration-700 ease-in-out ${
        visible
          ? "translate-x-0 opacity-100 delay-150"
          : `${enterFrom} opacity-0`
      }`}
    >
      <h2 className="text-4xl font-bold tracking-tight text-balance">
        {title}
      </h2>
      <p className="max-w-xs leading-relaxed text-white/80 text-pretty">
        {body}
      </p>
      <button
        type="button"
        onClick={onClick}
        className="rounded-lg border-2 border-white px-10 py-2.5 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-[#3A0CA3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#3A0CA3]"
      >
        {cta}
      </button>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" className="size-5">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}

function GoogleButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white/70 backdrop-blur-sm px-4 py-2.5 text-sm font-medium text-gray-900 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3A0CA3] focus-visible:ring-offset-2 dark:border-neutral-700 dark:bg-black/40 dark:text-white dark:hover:bg-black/60 dark:focus-visible:ring-offset-[#050505]"
    >
      <GoogleIcon />
      Continue with Google
    </button>
  );
}

function OrDivider() {
  return (
    <div className="flex items-center gap-3" role="separator" aria-label="or">
      <span className="h-px flex-1 bg-gray-300 dark:bg-neutral-700" />
      <span className="text-xs font-medium tracking-widest text-gray-500 dark:text-neutral-400">
        OR
      </span>
      <span className="h-px flex-1 bg-gray-300 dark:bg-neutral-700" />
    </div>
  );
}

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  id: string;
};

function Field({ label, id, ...props }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-sm font-medium text-gray-800 dark:text-neutral-200"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        required
        className="w-full rounded-lg border border-gray-200 bg-white/50 backdrop-blur-sm px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 transition-shadow focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#3A0CA3] dark:border-neutral-700 dark:bg-black/40 dark:text-white dark:placeholder:text-neutral-400"
        {...props}
      />
    </div>
  );
}

function PrimaryButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="w-full rounded-lg bg-[#3A0CA3] px-4 py-3 text-sm font-semibold uppercase tracking-wider text-white shadow-lg shadow-[#3A0CA3]/25 transition-all hover:brightness-110 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3A0CA3] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#050505]"
    >
      {children}
    </button>
  );
}

export default function Login() {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat transition-all duration-700 bg-[url('/bg-light.png')] dark:bg-[url('/bg-dark.png')] px-4 pt-16">
        <AuthSlider />
      </div>
    </GoogleOAuthProvider>
  );
}
