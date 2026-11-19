"use client";

import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import Link from "next/link";
import { useState } from "react";

function RegisterForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Creating your account...");

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        window.location.href = "/dashboard";
      } else {
        setStatus(data.error || "Registration failed.");
      }
    } catch (error) {
      setStatus("Server error. Is the backend running?");
    }
  };

  const handleGoogleRegister = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setStatus("Verifying with Google...");
      try {
        const res = await fetch("http://localhost:5000/api/users/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: tokenResponse.access_token }),
        });

        const data = await res.json();

        if (res.ok) {
          localStorage.setItem("token", data.token);
          window.location.href = "/dashboard";
        } else {
          setStatus(data.error || "Google registration failed.");
        }
      } catch (error) {
        setStatus("Server error during Google registration.");
      }
    },
    onError: () => setStatus("Google popup closed or failed."),
  });

  return (
    <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 border dark:border-gray-700">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Join FitTrack
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Start your fitness journey today.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              First Name *
            </label>
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2 border dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Tony"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2 border dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Stark (Optional)"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email *
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="athlete@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password *
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition mt-2"
        >
          Create Account
        </button>
      </form>

      {status && (
        <div className="mt-4 p-3 rounded-md text-center font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm">
          {status}
        </div>
      )}

      {/* --- GOOGLE SIGNUP SECTION --- */}
      <div className="mt-6 relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
            Or sign up with
          </span>
        </div>
      </div>

      <button
        onClick={() => handleGoogleRegister()}
        type="button"
        className="mt-6 w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-bold py-3 px-4 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition shadow-sm"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Google
      </button>

      <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
        >
          Log in here
        </Link>
      </div>
    </div>
  );
}

export default function Register() {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-black dark:text-white px-4 transition-colors duration-200">
        <RegisterForm />
      </div>
    </GoogleOAuthProvider>
  );
}
