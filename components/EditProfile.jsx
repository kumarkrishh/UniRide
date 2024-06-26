"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const EditProfile = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    college: "",
    profilePicture: "",
    bio: "",
    carDetails: {
      make: "",
      model: "",
      year: ""
    },
    pickupLocation: "",
    dropoffLocation: "",
    availableDays: "",
    availableTimes: ""
  });

  useEffect(() => {
    if (session?.user) {
      setProfile((prevProfile) => ({
        ...prevProfile,
        name: session.user.name || "",
        email: session.user.email || ""
      }));
      fetchProfile();
    }
  }, [session?.user]);

  const fetchProfile = async () => {
    const response = await fetch(`/api/users/${session?.user.id}/profile`);
    const data = await response.json();
    setProfile(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [mainKey, subKey] = name.split('.');
    if (subKey) {
      setProfile((prevProfile) => ({
        ...prevProfile,
        [mainKey]: {
          ...prevProfile[mainKey],
          [subKey]: value
        }
      }));
    } else {
      setProfile((prevProfile) => ({
        ...prevProfile,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`/api/users/${session?.user.id}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(profile)
      });
      router.push("/my-profile");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={profile.phoneNumber}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">College/University</label>
            <input
              type="text"
              name="college"
              value={profile.college}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          ></textarea>
        </div>
        
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-6"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
