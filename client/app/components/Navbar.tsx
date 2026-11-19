"use client";

import { Calendar as CalendarIcon, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [workouts, setWorkouts] = useState<any[]>([]);

  // Calendar State
  const [currentMonth, setCurrentMonth] = useState<Date | null>(null);
  const [selectedDateWorkouts, setSelectedDateWorkouts] = useState<
    any[] | null
  >(null);
  const [selectedDateStr, setSelectedDateStr] = useState("");

  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Set current month safely on client mount
    setCurrentMonth(new Date());

    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (token) {
      Promise.all([
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/users/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        ).then((res) => res.json()),
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/workouts`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        ).then((res) => res.json()),
      ])
        .then(([profileData, workoutsData]) => {
          if (profileData.profile?.avatarUrl) {
            setAvatarUrl(profileData.profile.avatarUrl);
          }
          if (Array.isArray(workoutsData)) {
            setWorkouts(workoutsData);
          }
        })
        .catch((err) => console.error("Failed to fetch navbar data", err));
    } else {
      setAvatarUrl(null);
    }
  }, [pathname, showCalendar]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (!currentMonth) return null;

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const getLocalDateString = (dateInput: string | Date) => {
    const d = new Date(dateInput);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const workoutDatesSet = new Set(
    workouts.map((w) => getLocalDateString(w.date)),
  );

  const handleDayClick = (day: number) => {
    const clickedDate = new Date(year, month, day);
    const dateStr = getLocalDateString(clickedDate);

    const matchedWorkouts = workouts.filter(
      (w) => getLocalDateString(w.date) === dateStr,
    );

    setSelectedDateStr(
      clickedDate.toLocaleDateString("default", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    );
    if (matchedWorkouts.length > 0) {
      setSelectedDateWorkouts(matchedWorkouts);
    } else {
      setSelectedDateWorkouts([]);
    }
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-white/40 backdrop-blur-md border-b border-white/50 text-gray-900 shadow-sm dark:bg-[#050505]/60 dark:backdrop-blur-lg dark:border-white/10 dark:text-white transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
          <Link
            href={isLoggedIn ? "/dashboard" : "/"}
            className="group flex items-center gap-2.5 select-none"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3A0CA3] text-white shadow-md shadow-[#3A0CA3]/30 transition-transform duration-300 group-hover:scale-105">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </span>
            <span className="text-xl sm:text-2xl font-black italic tracking-tighter text-gray-900 dark:text-white">
              FIT
              <span className="not-italic font-extrabold tracking-normal text-[#3A0CA3] dark:text-[#9b7bff]">
                TRACK
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-6 font-medium text-sm relative">
            {/* --- THEME TOGGLE BUTTON --- */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-gray-700 hover:text-[#3A0CA3] dark:text-gray-300 dark:hover:text-[#9b7bff] transition p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10"
                title="Toggle Theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
            )}

            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition"
                >
                  Dashboard
                </Link>

                <button
                  onClick={() => {
                    setShowCalendar(true);
                    setSelectedDateWorkouts(null);
                  }}
                  className="text-gray-700 hover:text-[#3A0CA3] dark:text-gray-300 dark:hover:text-[#9b7bff] transition p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10"
                  title="Workout Calendar"
                >
                  <CalendarIcon className="w-6 h-6" />
                </button>

                <div className="relative group py-2">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition border border-gray-300 dark:border-gray-500 overflow-hidden">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="User Avatar"
                        className="w-full h-full object-cover bg-gray-50"
                      />
                    ) : (
                      <span className="text-gray-700 dark:text-white font-bold text-lg">
                        U
                      </span>
                    )}
                  </div>

                  <div className="absolute right-0 top-12 mt-1 w-48 bg-white/90 backdrop-blur-md rounded-md shadow-xl hidden group-hover:block border border-gray-200 z-50 overflow-hidden text-black dark:bg-gray-800/90 dark:border-gray-700 dark:text-white">
                    <Link
                      href="/profile"
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 dark:border-gray-700 transition"
                    >
                      Profile View
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-medium dark:text-red-400 dark:hover:bg-gray-700 transition"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              </>
            ) : pathname !== "/login" ? (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition"
                >
                  Log In
                </Link>
                <Link
                  href="/login"
                  className="bg-[#3A0CA3] text-white px-4 py-2 rounded-lg hover:brightness-110 active:scale-[0.98] transition shadow-lg shadow-[#3A0CA3]/25 font-semibold"
                >
                  Sign Up
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </nav>

      {/* --- CALENDAR POPUP MODAL --- */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 text-black dark:text-white">
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-xl shadow-2xl p-6 max-w-md w-full relative max-h-[90vh] overflow-y-auto border border-white/20 dark:border-gray-800">
            <button
              onClick={() => setShowCalendar(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
            >
              <X className="w-6 h-6" />
            </button>

            {selectedDateWorkouts ? (
              <div>
                <button
                  onClick={() => setSelectedDateWorkouts(null)}
                  className="text-xs font-bold text-[#3A0CA3] dark:text-[#9b7bff] hover:underline mb-4 block transition"
                >
                  &larr; Back to Calendar
                </button>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                  Logs for {selectedDateStr}
                </h3>

                {selectedDateWorkouts.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 italic text-sm bg-gray-50/50 dark:bg-gray-800/50 p-4 rounded border dark:border-gray-700 text-center">
                    No workout recorded on this date.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {selectedDateWorkouts.map((w: any) => (
                      <div
                        key={w.id}
                        className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg bg-white/50 dark:bg-gray-800/50"
                      >
                        <h4 className="font-bold text-gray-800 dark:text-white text-base mb-2">
                          {w.name}
                        </h4>
                        <ul className="space-y-2">
                          {w.exercises.map((ex: any) => (
                            <li
                              key={ex.id}
                              className="text-xs bg-white/80 dark:bg-gray-900/80 p-2 rounded border border-gray-100 dark:border-gray-700 flex justify-between"
                            >
                              <span className="font-semibold text-gray-700 dark:text-gray-200">
                                {ex.name}
                              </span>
                              <span className="text-gray-500 dark:text-gray-400">
                                {ex.sets} sets × {ex.reps} reps @ {ex.weight}kg
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    {currentMonth.toLocaleString("default", {
                      month: "long",
                      year: "numeric",
                    })}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setCurrentMonth(new Date(year, month - 1, 1))
                      }
                      className="px-3 py-1 bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-700 rounded font-bold text-sm transition"
                    >
                      &larr;
                    </button>
                    <button
                      onClick={() =>
                        setCurrentMonth(new Date(year, month + 1, 1))
                      }
                      className="px-3 py-1 bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-700 rounded font-bold text-sm transition"
                    >
                      &rarr;
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-gray-400 mb-2">
                  <span>Su</span>
                  <span>Mo</span>
                  <span>Tu</span>
                  <span>We</span>
                  <span>Th</span>
                  <span>Fr</span>
                  <span>Sa</span>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center">
                  {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}

                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateToCheck = new Date(year, month, day);
                    const dateStr = getLocalDateString(dateToCheck);
                    const hasWorkout = workoutDatesSet.has(dateStr);

                    return (
                      <button
                        key={day}
                        onClick={() => handleDayClick(day)}
                        className={`h-10 rounded-lg flex flex-col items-center justify-center text-sm font-semibold transition relative ${
                          hasWorkout
                            ? "bg-[#3A0CA3] text-white shadow-md hover:brightness-110"
                            : "bg-gray-50/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-700/80"
                        }`}
                      >
                        {day}
                        {hasWorkout && (
                          <span className="absolute bottom-1 w-1 h-1 bg-white rounded-full shadow-sm" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <p className="text-xs text-gray-400 text-center mt-6">
                  💡 Highlighted dates contain completed workout logs. Click any
                  date to view them!
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
