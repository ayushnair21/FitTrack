"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [targetHref, setTargetHref] = useState("/login");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setTargetHref("/dashboard");
    }
  }, []);

  return (
    <main className="min-h-screen bg-cover bg-fixed bg-center bg-no-repeat transition-all duration-700 bg-[url('/bg-light.png')] dark:bg-[url('/bg-dark.png')] pt-28 pb-16 px-4 text-gray-900 dark:text-white">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Hero Section with Single Primary Continue Button */}
        <section className="bg-white/40 dark:bg-[#050505]/60 backdrop-blur-md border border-white/50 dark:border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-[#3A0CA3] dark:text-[#9b7bff] mb-3">
            FitTrack Platform
          </p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Train Smarter. Track Every Rep.
          </h1>
          <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-2xl leading-relaxed mb-8">
            FitTrack is a workout tracking application built to help you log
            training sessions, monitor daily lifted volume, and keep your
            fitness goals and profile organized in one place.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={targetHref}
              className="rounded-xl bg-[#3A0CA3] px-7 py-3.5 text-sm font-semibold uppercase tracking-wider text-white shadow-lg shadow-[#3A0CA3]/25 transition-all hover:brightness-110 active:scale-[0.98]"
            >
              Continue to Website &rarr;
            </Link>
            <a
              href="#features"
              className="rounded-xl bg-white/60 dark:bg-black/40 border border-white/60 dark:border-white/15 px-6 py-3.5 text-sm font-semibold transition hover:bg-white/80 dark:hover:bg-black/60"
            >
              Explore Features
            </a>
          </div>
        </section>

        {/* Project Overview & Sample Session Snapshot */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white/40 dark:bg-[#050505]/60 backdrop-blur-md border border-white/50 dark:border-white/10 rounded-3xl p-8 shadow-xl flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-3">
              About the Project &amp; How It Helps
            </h2>
            <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Relying on scattered notes makes it easy to lose sight of weekly
              consistency or how much weight you actually moved. FitTrack gives
              you a clear daily workspace where you can record workouts, edit
              exercises on the fly, and review past sessions whenever you need.
            </p>
            <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              Whether you are focusing on fat loss, muscle gain, or maintenance,
              everything stays tied to your personal profile with light and dark
              glassmorphic themes.
            </p>
          </div>

          {/* Example Volume Calculation Card */}
          <div className="bg-white/40 dark:bg-[#050505]/60 backdrop-blur-md border border-white/50 dark:border-white/10 rounded-3xl p-7 shadow-xl">
            <p className="text-xs font-bold uppercase tracking-widest text-[#3A0CA3] dark:text-[#9b7bff] mb-2">
              Volume Formula
            </p>
            <h3 className="text-lg font-bold mb-3">How Volume Is Counted</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
              Every exercise contributes{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                Sets &times; Reps &times; Weight (kg)
              </span>{" "}
              to your daily total.
            </p>
            <div className="space-y-2.5 text-sm bg-white/50 dark:bg-black/40 rounded-2xl p-4 border border-white/50 dark:border-white/10">
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">
                  Barbell Bench Press
                </span>
                <span className="font-semibold">4&times;8&times;60kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">
                  Romanian Deadlift
                </span>
                <span className="font-semibold">3&times;10&times;80kg</span>
              </div>
              <div className="border-t border-gray-300/60 dark:border-white/10 pt-2.5 flex justify-between font-bold">
                <span>Sample Total</span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  4,320 kg
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* What It Can Do */}
        <section id="features" className="space-y-4">
          <div className="px-1">
            <h2 className="text-2xl md:text-3xl font-bold">
              What FitTrack Can Do
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
              Core tools designed for quick daily logging and easy progress
              tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/40 dark:bg-[#050505]/60 backdrop-blur-md border border-white/50 dark:border-white/10 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-bold mb-2">Multi-Exercise Logs</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                Log a named workout session with as many exercises as you need,
                complete with sets, reps, and weights.
              </p>
            </div>

            <div className="bg-white/40 dark:bg-[#050505]/60 backdrop-blur-md border border-white/50 dark:border-white/10 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-bold mb-2">Live Dashboard Edits</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                Adjust sets, reps, or weights inline, append new exercises to an
                existing workout, or delete sessions.
              </p>
            </div>

            <div className="bg-white/40 dark:bg-[#050505]/60 backdrop-blur-md border border-white/50 dark:border-white/10 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-bold mb-2">Workout Calendar</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                Open the calendar from the navbar to spot workout days and
                inspect logged exercises for any selected date.
              </p>
            </div>

            <div className="bg-white/40 dark:bg-[#050505]/60 backdrop-blur-md border border-white/50 dark:border-white/10 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-bold mb-2">Profile &amp; Goals</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                Customize your avatar, age, height, weight, and goal (fat loss,
                muscle gain, or maintenance) anytime.
              </p>
            </div>
          </div>
        </section>

        {/* How It's Used & Tech Stack */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/40 dark:bg-[#050505]/60 backdrop-blur-md border border-white/50 dark:border-white/10 rounded-3xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold mb-4">How It&apos;s Used</h2>
            <ol className="space-y-3.5 text-sm md:text-base text-gray-700 dark:text-gray-300">
              <li className="flex gap-3">
                <span className="font-bold text-[#3A0CA3] dark:text-[#9b7bff]">
                  01.
                </span>
                <span>
                  <strong className="text-gray-900 dark:text-white">
                    Sign In &amp; Onboard:
                  </strong>{" "}
                  Create an account or sign in, then fill in your profile
                  details and avatar on your first visit.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-[#3A0CA3] dark:text-[#9b7bff]">
                  02.
                </span>
                <span>
                  <strong className="text-gray-900 dark:text-white">
                    Log Your Session:
                  </strong>{" "}
                  Head to Log Workout, enter your session name, and add your
                  exercises with sets, reps, and weights.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-[#3A0CA3] dark:text-[#9b7bff]">
                  03.
                </span>
                <span>
                  <strong className="text-gray-900 dark:text-white">
                    Track &amp; Revisit:
                  </strong>{" "}
                  Watch today&apos;s workout count and lifted volume update on
                  the dashboard, and check past dates in the calendar.
                </span>
              </li>
            </ol>
          </div>

          <div className="bg-white/40 dark:bg-[#050505]/60 backdrop-blur-md border border-white/50 dark:border-white/10 rounded-3xl p-8 shadow-xl flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-3">Built With</h2>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-5">
                Structured with a responsive Next.js client and a Node/Express
                backend API supporting authenticated sessions.
              </p>
              <div className="flex flex-wrap gap-2.5">
                {[
                  "Next.js (App Router)",
                  "Tailwind CSS",
                  "Node.js & Express",
                  "JWT & Google Auth",
                  "Light / Dark Themes",
                ].map((item) => (
                  <span
                    key={item}
                    className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-white/60 dark:bg-black/40 border border-white/50 dark:border-white/10 text-gray-800 dark:text-gray-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Quick FAQ */}
        <section className="bg-white/40 dark:bg-[#050505]/60 backdrop-blur-md border border-white/50 dark:border-white/10 rounded-3xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold mb-6">Quick Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="space-y-1.5">
              <h3 className="font-bold text-gray-900 dark:text-white">
                Can I edit exercises after logging?
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Yes. From the dashboard, you can edit sets, reps, or weight on
                any exercise or add extra exercises to a workout.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-gray-900 dark:text-white">
                How do I check earlier workout days?
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Click the calendar icon in the top navigation bar to see
                highlighted workout dates and view their logged exercises.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-gray-900 dark:text-white">
                Can I switch themes anytime?
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Yes. Use the sun/moon toggle in the navbar to switch between
                light and dark mode across the entire app.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <footer className="bg-white/40 dark:bg-[#050505]/60 backdrop-blur-md border border-white/50 dark:border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-1">
              Ready to jump in?
            </h2>
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
              Start logging your workouts and tracking your progress today.
            </p>
          </div>

          <Link
            href={targetHref}
            className="rounded-xl bg-[#3A0CA3] px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white shadow-lg shadow-[#3A0CA3]/25 transition-all hover:brightness-110 active:scale-[0.98] shrink-0"
          >
            Continue to Website &rarr;
          </Link>
        </footer>
      </div>
    </main>
  );
}
