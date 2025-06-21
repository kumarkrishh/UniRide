"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const NotificationsPage = () => {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState([]);
  const router = useRouter();

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
      const response = await axios.post(`/api/getnotifdata/${notifId}`);
      const notifdata = response.data;

      session.user.chatwithid = notifdata.senderId;
      session.user.chatwithname = notifdata.chatwithname;
      session.user.chatwithimage = notifdata.chatwithimage;

      setNotifications(notifications.filter((notif) => notif._id !== notifId));
      router.push('req-rideshare');
    } catch (error) {
      console.error('Error accepting notification:', error);
    }
  };

  const handleDecline = async (notifId) => {
    try {
      await axios.post(`/api/getnotifdata/${notifId}`);
      setNotifications(notifications.filter((notif) => notif._id !== notifId));
    } catch (error) {
      console.error('Error declining notification:', error);
    }
  };

  return (
    <div
      className="pt-32 px-4 min-h-screen flex flex-col items-center"
      style={{ backgroundColor: '#141d26' }}
    >
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600">
        Notifications
      </h1>

      {notifications.length === 0 ? (
        <p className="text-gray-400 text-lg text-center">No notifications found.</p>
      ) : (
        <ul className="space-y-4 w-full max-w-xl">
          {notifications.map((notif) => (
            <li
              key={notif._id}
              className="p-4 rounded-lg flex justify-between items-center"
              style={{ backgroundColor: '#2b3e50', color: '#fff' }}
            >
              <div className="flex items-center">
                <img
                  src={notif.chatwithimage}
                  alt={notif.chatwithname}
                  className="rounded-full mr-4"
                  style={{ width: 50, height: 50 }}
                />
                <div className='mr-2'>
                  <p>{notif.message}</p>
                  <span className="text-gray-400 text-sm">{new Date(notif.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => handleAccept(notif._id)}>
                  <CheckCircleIcon style={{ color: 'white', fontSize: '35px' }} />
                </button>
                <button onClick={() => handleDecline(notif._id)}>
                  <CancelIcon style={{ color: 'white', fontSize: '35px' }} />
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
