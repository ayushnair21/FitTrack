"use client";

import Link from "next/link";
import { useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute";

export default function LogWorkout() {
  const [workoutName, setWorkoutName] = useState("");
  const [exercises, setExercises] = useState([
    { name: "", sets: "", reps: "", weight: "" },
  ]);
  const [status, setStatus] = useState("");

  const handleAddExercise = () => {
    setExercises([...exercises, { name: "", sets: "", reps: "", weight: "" }]);
  };

  const handleRemoveExercise = (indexToRemove: number) => {
    setExercises(exercises.filter((_, index) => index !== indexToRemove));
  };

  const handleExerciseChange = (
    index: number,
    field: string,
    value: string,
  ) => {
    const updatedExercises = [...exercises];
    updatedExercises[index] = { ...updatedExercises[index], [field]: value };
    setExercises(updatedExercises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Saving workout...");
    const token = localStorage.getItem("token");

    const formattedExercises = exercises.map((ex) => ({
      name: ex.name,
      sets: Number(ex.sets),
      reps: Number(ex.reps),
      weight: Number(ex.weight),
    }));

    try {
      const res = await fetch("http://localhost:5000/api/workouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: workoutName,
          exercises: formattedExercises,
        }),
      });

      if (res.ok) {
        window.location.href = "/dashboard";
      } else {
        setStatus("Failed to save workout. Check backend.");
      }
    } catch (error) {
      setStatus("Server error.");
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-cover bg-fixed bg-center bg-no-repeat transition-all duration-700 bg-[url('/bg-light.png')] dark:bg-[url('/bg-dark.png')] pt-28 pb-12 px-4 text-black dark:text-white relative">
        <div className="max-w-3xl mx-auto bg-white/40 dark:bg-[#050505]/60 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/50 dark:border-white/10">
          <div className="flex justify-between items-center mb-8 border-b border-gray-300/50 dark:border-white/10 pb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Log New Workout
            </h1>
            <Link
              href="/dashboard"
              className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white font-semibold text-sm transition"
            >
              Cancel & Return
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white/50 dark:bg-black/40 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white/40 dark:border-white/10">
              <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">
                Workout Name (e.g. Chest Day)
              </label>
              <input
                type="text"
                required
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                className="w-full px-4 py-2.5 border border-white/50 dark:border-white/10 rounded-xl bg-white/80 dark:bg-black/60 dark:text-white focus:ring-2 focus:ring-[#3A0CA3] outline-none font-medium backdrop-blur-sm transition"
                placeholder="Enter workout name..."
              />
            </div>

            <div className="space-y-4">
              {exercises.map((ex, index) => (
                <div
                  key={index}
                  className="bg-white/50 dark:bg-black/40 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white/40 dark:border-white/10 relative"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-800 dark:text-gray-200">
                      Exercise {index + 1}
                    </h3>
                    {exercises.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveExercise(index)}
                        className="text-red-500 hover:text-red-700 dark:hover:text-red-400 text-sm font-bold transition"
                      >
                        ✕ Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-1">
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Exercise Name
                      </label>
                      <input
                        type="text"
                        required
                        value={ex.name}
                        onChange={(e) =>
                          handleExerciseChange(index, "name", e.target.value)
                        }
                        className="w-full px-3.5 py-2 border border-white/50 dark:border-white/10 rounded-xl bg-white/80 dark:bg-black/60 dark:text-white outline-none focus:ring-2 focus:ring-[#3A0CA3] backdrop-blur-sm transition text-sm"
                        placeholder="Squats"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Sets
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={ex.sets}
                        onChange={(e) =>
                          handleExerciseChange(index, "sets", e.target.value)
                        }
                        className="w-full px-3.5 py-2 border border-white/50 dark:border-white/10 rounded-xl bg-white/80 dark:bg-black/60 dark:text-white outline-none focus:ring-2 focus:ring-[#3A0CA3] backdrop-blur-sm transition text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Reps
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={ex.reps}
                        onChange={(e) =>
                          handleExerciseChange(index, "reps", e.target.value)
                        }
                        className="w-full px-3.5 py-2 border border-white/50 dark:border-white/10 rounded-xl bg-white/80 dark:bg-black/60 dark:text-white outline-none focus:ring-2 focus:ring-[#3A0CA3] backdrop-blur-sm transition text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={ex.weight}
                        onChange={(e) =>
                          handleExerciseChange(index, "weight", e.target.value)
                        }
                        className="w-full px-3.5 py-2 border border-white/50 dark:border-white/10 rounded-xl bg-white/80 dark:bg-black/60 dark:text-white outline-none focus:ring-2 focus:ring-[#3A0CA3] backdrop-blur-sm transition text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddExercise}
              className="w-full py-3.5 border-2 border-dashed border-gray-400/60 dark:border-white/20 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-white/40 dark:hover:bg-black/30 backdrop-blur-sm transition text-sm tracking-wide"
            >
              + Add Another Exercise
            </button>
            <button
              type="submit"
              className="w-full bg-[#3A0CA3] text-white font-semibold uppercase tracking-wider py-4 rounded-xl shadow-lg shadow-[#3A0CA3]/25 hover:brightness-110 active:scale-[0.98] transition text-sm"
            >
              Save Workout to Dashboard
            </button>
            {status && (
              <p className="text-center text-red-500 dark:text-red-400 font-medium text-sm">
                {status}
              </p>
            )}
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
