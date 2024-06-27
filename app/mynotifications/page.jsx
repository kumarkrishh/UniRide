"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const NotificationsPage = () => {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (session?.user.id) {
      fetchNotifications(session.user.id);
    }
  }, [session]);

  const fetchNotifications = async (userId) => {
    try {
      const response = await axios.get(`/api/getnotifs/${userId}`);
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleAccept = async (notifId) => {
    try {
      await axios.post(`/api/notifications/accept`, { notifId });
      setNotifications(notifications.filter((notif) => notif._id !== notifId));
    } catch (error) {
      console.error('Error accepting notification:', error);
    }
  };

  const handleDecline = async (notifId) => {
    try {
      await axios.post(`/api/notifications/decline`, { notifId });
      setNotifications(notifications.filter((notif) => notif._id !== notifId));
    } catch (error) {
      console.error('Error declining notification:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      {notifications.length === 0 ? (
        <p>No notifications found.</p>
      ) : (
        <ul>
          {notifications.map((notif) => (
            <li
              key={notif._id}
              className="mb-4 p-4 border border-gray-200 rounded flex justify-between items-center"
              style={{ width: '550px' }} // Set the fixed width here
            >
              <div>
                <p>{notif.message}</p>
                <span className="text-gray-500 text-sm">{new Date(notif.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex gap-4">
                <button
                  className="text-green-500 hover:text-green-600"
                  onClick={() => handleAccept(notif._id)}
                >
                  <img src="/assets/images/acceptIcon.svg" alt="Accept" width={30} height={30} />
                </button>
                <button
                  className="text-red-500 hover:text-red-600"
                  onClick={() => handleDecline(notif._id)}
                >
                  <img src="/assets/images/rejectIcon.svg" alt="Decline" width={30} height={30} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsPage;
