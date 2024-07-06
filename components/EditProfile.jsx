"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const EditProfile = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [profile, setProfile] = useState({
    username: "",
    email: "",
    number: "",
    college: "",
    image: "",
    bio: "",
  });

  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetchProfile();
    }
  }, [session?.user]);

  const fetchProfile = async () => {
    const response = await fetch(`/api/fetchprofile/${session?.user.id}`);
    const data = await response.json();
    setProfile({
      username: data.username || "",
      email: data.email || "",
      number: data.number || "",
      college: data.college || "",
      image: data.image || "",
      bio: data.bio || ""
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/fetchprofile/${session?.user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(profile)
      });
      if (response.ok) {
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000); // Hide the message after 3 seconds
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-gray-800 shadow-xl rounded-2xl text-gray-200 mt-5">
      <h2 className="text-3xl font-bold mb-8 text-gray-100">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-400">Username</label>
            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-gray-200 transition ease-in-out duration-150"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-gray-200 transition ease-in-out duration-150"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400">Phone Number</label>
            <input
              type="text"
              name="number"
              value={profile.number}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-gray-200 transition ease-in-out duration-150"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400">College/University</label>
            <input
              type="text"
              name="college"
              value={profile.college}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-gray-200 transition ease-in-out duration-150"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-400">Bio</label>
          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-gray-200 transition ease-in-out duration-150"
          ></textarea>
        </div>
        
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-6 border border-transparent text-lg font-semibold rounded-lg text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ease-in-out duration-300 mt-8"
        >
          Save
        </button>
      </form>

      {showMessage && (
        <div className="fixed bottom-4 right-4 p-4 bg-green-500 text-white rounded-lg shadow-xl transition-transform transform-gpu ease-in-out duration-300">
          Profile Updated Successfully!
        </div>
      )}
    </div>
  );
};

export default EditProfile;
