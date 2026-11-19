"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute";

const PRESET_AVATARS = [
  "https://api.dicebear.com/10.x/adventurer/svg?backgroundColor=ece7de&hairColor=6b705c,a5a58d,b98b73,7c9082,8e9aaf,9c6b58&seed=13oryqzy",
  "https://api.dicebear.com/10.x/adventurer/svg?backgroundColor=ece7de&hairColor=6b705c,a5a58d,b98b73,7c9082,8e9aaf,9c6b58&seed=xyp2zys4",
  "https://api.dicebear.com/10.x/adventurer/svg?backgroundColor=ece7de&hairColor=6b705c,a5a58d,b98b73,7c9082,8e9aaf,9c6b58&seed=66z2odnp",
  "https://api.dicebear.com/10.x/adventurer/svg?backgroundColor=ece7de&hairColor=6b705c,a5a58d,b98b73,7c9082,8e9aaf,9c6b58&seed=6w4yv33g",
];

export default function Dashboard() {
  const [userData, setUserData] = useState<any>(null);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [todayStr, setTodayStr] = useState("");

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingForm, setOnboardingForm] = useState({
    age: "",
    height: "",
    weight: "",
    goal: "fat_loss",
    avatarUrl: PRESET_AVATARS[0],
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ sets: 0, reps: 0, weight: 0 });

  const [addingToWorkoutId, setAddingToWorkoutId] = useState<string | null>(
    null,
  );
  const [newExerciseForm, setNewExerciseForm] = useState({
    name: "",
    sets: 0,
    reps: 0,
    weight: 0,
  });

  useEffect(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    setTodayStr(`${year}-${month}-${day}`);

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const [profileRes, workoutsRes] = await Promise.all([
        fetch("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/workouts", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (profileRes.ok && workoutsRes.ok) {
        const profileData = await profileRes.json();
        setUserData(profileData);
        setWorkouts(await workoutsRes.json());

        if (!profileData.profile?.age) {
          setShowOnboarding(true);
        }
      } else {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    } catch (err) {
      setError("Failed to load dashboard data.");
    }
  };

  const handleSaveOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          age: Number(onboardingForm.age),
          height: Number(onboardingForm.height),
          weight: Number(onboardingForm.weight),
          goal: onboardingForm.goal,
          avatarUrl: onboardingForm.avatarUrl,
        }),
      });
      if (res.ok) {
        setShowOnboarding(false);
        fetchDashboardData();
      }
    } catch (error) {
      alert("Server error");
    }
  };

  const handleDeleteWorkout = async (workoutId: string) => {
    if (!window.confirm("Delete this entire workout?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:5000/api/workouts/${workoutId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) fetchDashboardData();
    } catch (error) {
      alert("Server error");
    }
  };

  const handleEditClick = (exercise: any) => {
    setEditingId(exercise.id);
    setEditForm({
      sets: exercise.sets,
      reps: exercise.reps,
      weight: exercise.weight,
    });
  };

  const handleSaveEdit = async (exerciseId: string) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:5000/api/exercises/${exerciseId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editForm),
        },
      );
      if (res.ok) {
        setEditingId(null);
        fetchDashboardData();
      }
    } catch (error) {
      alert("Server error");
    }
  };

  const handleSaveNewExercise = async (workoutId: string) => {
    if (!newExerciseForm.name) return alert("Exercise name is required.");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:5000/api/workouts/${workoutId}/exercises`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newExerciseForm),
        },
      );

      if (res.ok) {
        setAddingToWorkoutId(null);
        setNewExerciseForm({ name: "", sets: 0, reps: 0, weight: 0 });
        fetchDashboardData();
      } else {
        alert("Failed to save exercise.");
      }
    } catch (error) {
      alert("Server error");
    }
  };

  const getLocalDateString = (dateInput: string | Date) => {
    const d = new Date(dateInput);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 bg-cover bg-center bg-[url('/bg-light.png')] dark:bg-[url('/bg-dark.png')]">
        <div className="bg-white/80 dark:bg-black/80 backdrop-blur-md p-6 rounded-2xl">
          {error}
        </div>
      </div>
    );
  if (!userData || !todayStr)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-800 dark:text-gray-200 bg-cover bg-center bg-[url('/bg-light.png')] dark:bg-[url('/bg-dark.png')]">
        <div className="bg-white/80 dark:bg-black/80 backdrop-blur-md p-6 rounded-2xl font-semibold">
          Loading dashboard...
        </div>
      </div>
    );

  const todaysWorkouts = workouts.filter(
    (w) => getLocalDateString(w.date) === todayStr,
  );
  const todaysTotalWorkouts = todaysWorkouts.length;
  const todaysTotalVolume = todaysWorkouts.reduce((total, workout) => {
    return (
      total +
      workout.exercises.reduce(
        (exTotal: number, ex: any) => exTotal + ex.sets * ex.reps * ex.weight,
        0,
      )
    );
  }, 0);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-cover bg-fixed bg-center bg-no-repeat transition-all duration-700 bg-[url('/bg-light.png')] dark:bg-[url('/bg-dark.png')] pt-28 pb-12 px-4 text-black dark:text-white relative">
        {/* ONBOARDING MODAL */}
        {showOnboarding && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/90 dark:bg-[#050505]/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-lg w-full border border-white/50 dark:border-white/10">
              <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
                Welcome, {userData.firstName}!
              </h2>
              <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                Let's set up your athlete profile.
              </p>
              <form onSubmit={handleSaveOnboarding} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    1. Pick Your Avatar
                  </label>
                  <div className="flex gap-4 justify-center">
                    {PRESET_AVATARS.map((imgUrl, idx) => (
                      <img
                        key={idx}
                        src={imgUrl}
                        alt="Avatar"
                        onClick={() =>
                          setOnboardingForm({
                            ...onboardingForm,
                            avatarUrl: imgUrl,
                          })
                        }
                        className={`w-16 h-16 rounded-full cursor-pointer border-4 transition-all ${
                          onboardingForm.avatarUrl === imgUrl
                            ? "border-[#3A0CA3] scale-110 shadow-md"
                            : "border-transparent hover:scale-105 opacity-60 hover:opacity-100"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Age *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={onboardingForm.age}
                      onChange={(e) =>
                        setOnboardingForm({
                          ...onboardingForm,
                          age: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-white/50 dark:border-white/10 rounded-lg bg-white/50 dark:bg-black/40 dark:text-white focus:ring-2 focus:ring-[#3A0CA3] outline-none backdrop-blur-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Goal *
                    </label>
                    <select
                      value={onboardingForm.goal}
                      onChange={(e) =>
                        setOnboardingForm({
                          ...onboardingForm,
                          goal: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-white/50 dark:border-white/10 rounded-lg bg-white/50 dark:bg-black/40 dark:text-white focus:ring-2 focus:ring-[#3A0CA3] outline-none backdrop-blur-sm"
                    >
                      <option value="fat_loss" className="dark:bg-gray-800">
                        Fat Loss
                      </option>
                      <option value="muscle_gain" className="dark:bg-gray-800">
                        Muscle Gain
                      </option>
                      <option value="maintenance" className="dark:bg-gray-800">
                        Maintenance
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Height (cm) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={onboardingForm.height}
                      onChange={(e) =>
                        setOnboardingForm({
                          ...onboardingForm,
                          height: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-white/50 dark:border-white/10 rounded-lg bg-white/50 dark:bg-black/40 dark:text-white focus:ring-2 focus:ring-[#3A0CA3] outline-none backdrop-blur-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Weight (kg) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={onboardingForm.weight}
                      onChange={(e) =>
                        setOnboardingForm({
                          ...onboardingForm,
                          weight: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-white/50 dark:border-white/10 rounded-lg bg-white/50 dark:bg-black/40 dark:text-white focus:ring-2 focus:ring-[#3A0CA3] outline-none backdrop-blur-sm"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#3A0CA3] text-white font-bold py-3 rounded-lg hover:brightness-110 shadow-lg shadow-[#3A0CA3]/25 transition mt-4"
                >
                  Complete Setup
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MAIN DASHBOARD */}
        <div
          className={`max-w-4xl mx-auto bg-white/40 dark:bg-[#050505]/60 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/50 dark:border-white/10 transition-all ${
            showOnboarding ? "blur-md opacity-50" : ""
          }`}
        >
          <div className="mb-8 border-b border-gray-300/50 dark:border-white/10 pb-6 flex justify-between items-end">
            <div>
              <p className="text-gray-700 dark:text-gray-300 mb-1 font-medium">
                Welcome back, {userData.firstName}.
              </p>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Your Dashboard
              </h1>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold uppercase tracking-wider text-[#3A0CA3] dark:text-[#9b7bff] bg-white/60 dark:bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/50 dark:border-white/10 shadow-sm">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          {todaysWorkouts.length === 0 && (
            <div className="mb-8 bg-[#3A0CA3]/90 backdrop-blur-md text-white p-6 rounded-2xl shadow-lg border border-white/20">
              <h2 className="text-xl font-black mb-1">
                Let's start building! 🚀
              </h2>
              <p className="text-white/80 text-sm">
                You haven't logged a workout for today yet. Use the button below
                to add your session!
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-white/50 dark:bg-black/40 backdrop-blur-sm border border-white/40 dark:border-white/10 p-6 rounded-2xl shadow-sm text-center hover:shadow-md transition">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">
                Today's Workouts Logged
              </p>
              <p className="text-4xl font-black text-[#3A0CA3] dark:text-[#9b7bff]">
                {todaysTotalWorkouts}
              </p>
            </div>
            <div className="bg-white/50 dark:bg-black/40 backdrop-blur-sm border border-white/40 dark:border-white/10 p-6 rounded-2xl shadow-sm text-center hover:shadow-md transition">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">
                Today's Volume Lifted (kg)
              </p>
              <p className="text-4xl font-black text-green-600 dark:text-green-400">
                {todaysTotalVolume.toLocaleString()}
              </p>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Today's Workout Log
              </h2>
              <Link
                href="/log-workout"
                className="bg-[#3A0CA3] text-white px-5 py-2.5 rounded-lg hover:brightness-110 transition shadow-lg shadow-[#3A0CA3]/25 text-sm font-bold uppercase tracking-wide"
              >
                + Log Workout
              </Link>
            </div>

            {todaysWorkouts.length === 0 ? (
              <div className="bg-white/40 dark:bg-black/30 backdrop-blur-sm p-8 rounded-2xl border border-white/40 dark:border-white/10 text-center">
                <p className="text-gray-600 dark:text-gray-400 italic">
                  No workouts logged for today yet. Click the button above to
                  get started!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {todaysWorkouts.map((workout: any) => (
                  <div
                    key={workout.id}
                    className="bg-white/60 dark:bg-black/50 backdrop-blur-sm border border-white/50 dark:border-white/10 p-5 rounded-2xl shadow-sm"
                  >
                    <div className="flex justify-between items-center border-b border-gray-300/50 dark:border-white/10 pb-3 mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                          {workout.name}
                        </h3>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          {new Date(workout.date).toLocaleDateString()}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteWorkout(workout.id)}
                        className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-bold transition"
                      >
                        Delete Workout
                      </button>
                    </div>
                    <ul className="space-y-3">
                      {workout.exercises.map((ex: any) => (
                        <li
                          key={ex.id}
                          className="flex justify-between items-center bg-white/40 dark:bg-white/5 px-4 py-3 rounded-xl border border-white/40 dark:border-white/10 shadow-sm"
                        >
                          <span className="font-semibold text-gray-800 dark:text-gray-200 w-1/3">
                            {ex.name}
                          </span>
                          {editingId === ex.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={editForm.sets}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    sets: Number(e.target.value),
                                  })
                                }
                                className="w-16 px-2 py-1 border border-white/50 dark:border-white/10 rounded-lg bg-white/80 dark:bg-black/60 dark:text-white text-sm outline-none focus:ring-2 focus:ring-[#3A0CA3]"
                              />{" "}
                              <span className="text-gray-600 dark:text-gray-400">
                                ×
                              </span>
                              <input
                                type="number"
                                value={editForm.reps}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    reps: Number(e.target.value),
                                  })
                                }
                                className="w-16 px-2 py-1 border border-white/50 dark:border-white/10 rounded-lg bg-white/80 dark:bg-black/60 dark:text-white text-sm outline-none focus:ring-2 focus:ring-[#3A0CA3]"
                              />{" "}
                              <span className="text-gray-600 dark:text-gray-400">
                                @
                              </span>
                              <input
                                type="number"
                                value={editForm.weight}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    weight: Number(e.target.value),
                                  })
                                }
                                className="w-16 px-2 py-1 border border-white/50 dark:border-white/10 rounded-lg bg-white/80 dark:bg-black/60 dark:text-white text-sm outline-none focus:ring-2 focus:ring-[#3A0CA3]"
                              />{" "}
                              <span className="text-gray-600 dark:text-gray-400">
                                kg
                              </span>
                              <button
                                onClick={() => handleSaveEdit(ex.id)}
                                className="ml-2 bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-600 transition shadow-sm"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-400 dark:hover:bg-gray-600 transition shadow-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-4">
                              <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                                {ex.sets} sets × {ex.reps} reps @ {ex.weight}kg
                              </span>
                              <button
                                onClick={() => handleEditClick(ex)}
                                className="text-[#3A0CA3] dark:text-[#9b7bff] hover:brightness-125 text-xs font-bold underline"
                              >
                                Edit
                              </button>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                    {addingToWorkoutId === workout.id ? (
                      <div className="mt-5 p-4 bg-white/50 dark:bg-black/40 backdrop-blur-sm rounded-xl border border-white/50 dark:border-white/10 flex flex-col gap-3 shadow-inner">
                        <input
                          type="text"
                          placeholder="Exercise Name (e.g., Tricep Extensions)"
                          value={newExerciseForm.name}
                          onChange={(e) =>
                            setNewExerciseForm({
                              ...newExerciseForm,
                              name: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-white/50 dark:border-white/10 rounded-lg bg-white/80 dark:bg-black/60 dark:text-white text-sm outline-none transition focus:ring-2 focus:ring-[#3A0CA3]"
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            placeholder="Sets"
                            value={newExerciseForm.sets || ""}
                            onChange={(e) =>
                              setNewExerciseForm({
                                ...newExerciseForm,
                                sets: Number(e.target.value),
                              })
                            }
                            className="w-20 px-3 py-2 border border-white/50 dark:border-white/10 rounded-lg bg-white/80 dark:bg-black/60 dark:text-white text-sm outline-none transition focus:ring-2 focus:ring-[#3A0CA3]"
                          />{" "}
                          <span className="text-gray-600 dark:text-gray-400">
                            ×
                          </span>
                          <input
                            type="number"
                            placeholder="Reps"
                            value={newExerciseForm.reps || ""}
                            onChange={(e) =>
                              setNewExerciseForm({
                                ...newExerciseForm,
                                reps: Number(e.target.value),
                              })
                            }
                            className="w-20 px-3 py-2 border border-white/50 dark:border-white/10 rounded-lg bg-white/80 dark:bg-black/60 dark:text-white text-sm outline-none transition focus:ring-2 focus:ring-[#3A0CA3]"
                          />{" "}
                          <span className="text-gray-600 dark:text-gray-400">
                            @
                          </span>
                          <input
                            type="number"
                            placeholder="kg"
                            value={newExerciseForm.weight || ""}
                            onChange={(e) =>
                              setNewExerciseForm({
                                ...newExerciseForm,
                                weight: Number(e.target.value),
                              })
                            }
                            className="w-20 px-3 py-2 border border-white/50 dark:border-white/10 rounded-lg bg-white/80 dark:bg-black/60 dark:text-white text-sm outline-none transition focus:ring-2 focus:ring-[#3A0CA3]"
                          />{" "}
                          <span className="text-gray-600 dark:text-gray-400">
                            kg
                          </span>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleSaveNewExercise(workout.id)}
                            className="bg-[#3A0CA3] text-white px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:brightness-110 transition shadow-sm"
                          >
                            Save Exercise
                          </button>
                          <button
                            onClick={() => {
                              setAddingToWorkoutId(null);
                              setNewExerciseForm({
                                name: "",
                                sets: 0,
                                reps: 0,
                                weight: 0,
                              });
                            }}
                            className="bg-gray-300/80 dark:bg-gray-700/80 text-gray-800 dark:text-gray-200 px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-gray-400 dark:hover:bg-gray-600 transition shadow-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setAddingToWorkoutId(workout.id)}
                        className="mt-5 text-sm font-bold text-[#3A0CA3] dark:text-[#9b7bff] hover:brightness-125 transition flex items-center gap-1 uppercase tracking-wide"
                      >
                        + Add Exercise
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
