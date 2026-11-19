"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute";

const PRESET_AVATARS = [
  "https://api.dicebear.com/10.x/adventurer/svg?backgroundColor=ece7de&hairColor=6b705c,a5a58d,b98b73,7c9082,8e9aaf,9c6b58&seed=13oryqzy",
  "https://api.dicebear.com/10.x/adventurer/svg?backgroundColor=ece7de&hairColor=6b705c,a5a58d,b98b73,7c9082,8e9aaf,9c6b58&seed=xyp2zys4",
  "https://api.dicebear.com/10.x/adventurer/svg?backgroundColor=ece7de&hairColor=6b705c,a5a58d,b98b73,7c9082,8e9aaf,9c6b58&seed=66z2odnp",
  "https://api.dicebear.com/10.x/adventurer/svg?backgroundColor=ece7de&hairColor=6b705c,a5a58d,b98b73,7c9082,8e9aaf,9c6b58&seed=6w4yv33g",
];

export default function Profile() {
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    age: 0,
    height: 0,
    weight: 0,
    goal: "",
    avatarUrl: "",
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/users/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.ok) {
        const data = await res.json();
        setUserData(data);
        setProfileForm({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          age: data.profile?.age || 0,
          height: data.profile?.height || 0,
          weight: data.profile?.weight || 0,
          goal: data.profile?.goal || "maintenance",
          avatarUrl: data.profile?.avatarUrl || PRESET_AVATARS[0],
        });
      }
    } catch (err) {
      setError("Failed to load profile.");
    }
  };

  const handleSaveProfile = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/users/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(profileForm),
        },
      );
      if (res.ok) {
        setIsEditingProfile(false);
        fetchProfileData();
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      alert("Server error");
    }
  };

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 bg-cover bg-center bg-[url('/bg-light.png')] dark:bg-[url('/bg-dark.png')]">
        <div className="bg-white/80 dark:bg-black/80 backdrop-blur-md p-6 rounded-2xl">
          {error}
        </div>
      </div>
    );
  if (!userData)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-800 dark:text-gray-200 bg-cover bg-center bg-[url('/bg-light.png')] dark:bg-[url('/bg-dark.png')]">
        <div className="bg-white/80 dark:bg-black/80 backdrop-blur-md p-6 rounded-2xl font-semibold">
          Loading profile...
        </div>
      </div>
    );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-cover bg-fixed bg-center bg-no-repeat transition-all duration-700 bg-[url('/bg-light.png')] dark:bg-[url('/bg-dark.png')] pt-28 pb-12 px-4 text-black dark:text-white relative">
        <div className="max-w-3xl mx-auto bg-white/40 dark:bg-[#050505]/60 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/50 dark:border-white/10">
          <div className="flex items-center gap-6 mb-8 border-b border-gray-300/50 dark:border-white/10 pb-6">
            <img
              src={userData.profile?.avatarUrl || PRESET_AVATARS[0]}
              alt="Profile Avatar"
              className="w-24 h-24 rounded-full border-4 border-[#3A0CA3] shadow-md object-cover bg-white/50 dark:bg-gray-800"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white capitalize">
                {userData.firstName} {userData.lastName}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {userData.email}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-white/50 dark:bg-black/40 backdrop-blur-sm rounded-2xl border border-white/50 dark:border-white/10 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Fitness Profile
                </h2>
                {!isEditingProfile && (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="text-sm bg-white/80 dark:bg-black/60 border border-white/60 dark:border-white/20 px-4 py-2 rounded-xl text-gray-900 dark:text-white hover:bg-white dark:hover:bg-black transition font-semibold shadow-sm"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {isEditingProfile ? (
                <div className="space-y-6 bg-white/60 dark:bg-black/50 backdrop-blur-md p-6 rounded-2xl border border-white/50 dark:border-white/10 shadow-inner">
                  <div>
                    <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-3">
                      Choose an Avatar
                    </label>
                    <div className="flex gap-4">
                      {PRESET_AVATARS.map((imgUrl, idx) => (
                        <img
                          key={idx}
                          src={imgUrl}
                          onClick={() =>
                            setProfileForm({
                              ...profileForm,
                              avatarUrl: imgUrl,
                            })
                          }
                          className={`w-16 h-16 rounded-full cursor-pointer border-4 transition-all ${
                            profileForm.avatarUrl === imgUrl
                              ? "border-[#3A0CA3] scale-110 shadow-md"
                              : "border-transparent hover:scale-105 opacity-60 hover:opacity-100"
                          }`}
                          alt="Avatar Option"
                        />
                      ))}
                    </div>
                  </div>
                  <hr className="border-gray-300/50 dark:border-white/10" />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.firstName}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2 border border-white/50 dark:border-white/10 rounded-xl bg-white/80 dark:bg-black/60 dark:text-white outline-none focus:ring-2 focus:ring-[#3A0CA3] backdrop-blur-sm transition text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.lastName}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            lastName: e.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2 border border-white/50 dark:border-white/10 rounded-xl bg-white/80 dark:bg-black/60 dark:text-white outline-none focus:ring-2 focus:ring-[#3A0CA3] backdrop-blur-sm transition text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Age
                      </label>
                      <input
                        type="number"
                        value={profileForm.age}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            age: Number(e.target.value),
                          })
                        }
                        className="w-full px-3.5 py-2 border border-white/50 dark:border-white/10 rounded-xl bg-white/80 dark:bg-black/60 dark:text-white outline-none focus:ring-2 focus:ring-[#3A0CA3] backdrop-blur-sm transition text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        value={profileForm.weight}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            weight: Number(e.target.value),
                          })
                        }
                        className="w-full px-3.5 py-2 border border-white/50 dark:border-white/10 rounded-xl bg-white/80 dark:bg-black/60 dark:text-white outline-none focus:ring-2 focus:ring-[#3A0CA3] backdrop-blur-sm transition text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Height (cm)
                      </label>
                      <input
                        type="number"
                        value={profileForm.height}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            height: Number(e.target.value),
                          })
                        }
                        className="w-full px-3.5 py-2 border border-white/50 dark:border-white/10 rounded-xl bg-white/80 dark:bg-black/60 dark:text-white outline-none focus:ring-2 focus:ring-[#3A0CA3] backdrop-blur-sm transition text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Goal
                      </label>
                      <select
                        value={profileForm.goal}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            goal: e.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2 border border-white/50 dark:border-white/10 rounded-xl bg-white/80 dark:bg-black/60 dark:text-white outline-none focus:ring-2 focus:ring-[#3A0CA3] backdrop-blur-sm transition text-sm"
                      >
                        <option value="fat_loss" className="dark:bg-gray-800">
                          Fat Loss
                        </option>
                        <option
                          value="muscle_gain"
                          className="dark:bg-gray-800"
                        >
                          Muscle Gain
                        </option>
                        <option
                          value="maintenance"
                          className="dark:bg-gray-800"
                        >
                          Maintenance
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleSaveProfile}
                      className="bg-[#3A0CA3] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-[#3A0CA3]/25 hover:brightness-110 transition"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditingProfile(false)}
                      className="bg-gray-300/80 dark:bg-gray-700/80 text-gray-800 dark:text-gray-200 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-400 dark:hover:bg-gray-600 transition shadow-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 text-gray-800 dark:text-gray-200 font-medium">
                  <p className="bg-white/30 dark:bg-white/5 p-3.5 rounded-xl border border-white/30 dark:border-white/10">
                    <strong className="text-gray-500 dark:text-gray-400 block text-xs uppercase tracking-wider mb-0.5">
                      Age
                    </strong>{" "}
                    {userData.profile?.age || "Not set"}
                  </p>
                  <p className="bg-white/30 dark:bg-white/5 p-3.5 rounded-xl border border-white/30 dark:border-white/10">
                    <strong className="text-gray-500 dark:text-gray-400 block text-xs uppercase tracking-wider mb-0.5">
                      Weight
                    </strong>{" "}
                    {userData.profile?.weight
                      ? `${userData.profile.weight} kg`
                      : "Not set"}
                  </p>
                  <p className="bg-white/30 dark:bg-white/5 p-3.5 rounded-xl border border-white/30 dark:border-white/10">
                    <strong className="text-gray-500 dark:text-gray-400 block text-xs uppercase tracking-wider mb-0.5">
                      Height
                    </strong>{" "}
                    {userData.profile?.height
                      ? `${userData.profile.height} cm`
                      : "Not set"}
                  </p>
                  <p className="bg-white/30 dark:bg-white/5 p-3.5 rounded-xl border border-white/30 dark:border-white/10">
                    <strong className="text-gray-500 dark:text-gray-400 block text-xs uppercase tracking-wider mb-0.5">
                      Goal
                    </strong>{" "}
                    <span className="capitalize">
                      {(userData.profile?.goal || "Not set").replace("_", " ")}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
