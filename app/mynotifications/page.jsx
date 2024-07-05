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
      const response = await axios.post(`/api/getnotifdata/${notifId}`);
      setNotifications(notifications.filter((notif) => notif._id !== notifId));
    } catch (error) {
      console.error('Error declining notification:', error);
    }
  };

  return (
    <div className="container mx-auto p-4" style={{ backgroundColor: '#141d26', minHeight: '100vh' }}>
      <h1 className="text-2xl font-bold mb-4" style={{ color: '#fff' }}>Notifications</h1>
      {notifications.length === 0 ? (
        <p style={{ color: '#b0b3b8' }}>No notifications found.</p>
      ) : (
        <ul>
          {notifications.map((notif) => (
            <li
              key={notif._id}
              className="mb-4 p-4 rounded-lg flex justify-between items-center"
              style={{ backgroundColor: '#2b3e50', color: '#fff', width: '550px' }}
            >
              <div className="flex items-center">
                <img src={notif.chatwithimage} alt={notif.chatwithname} className="rounded-full mr-4" style={{ width: 50, height: 50 }} />
                <div className='mr-2'>
                  <p>{notif.message}</p>
                  <span className="text-gray-500 text-sm">{new Date(notif.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  className="text-green-500 hover:text-green-600"
                  onClick={() => handleAccept(notif._id)}
                >
                  <CheckCircleIcon style={{ color: 'white', fontSize: '35px' }} />
                </button>
                <button
                  className="text-red-500 hover:text-red-600"
                  onClick={() => handleDecline(notif._id)}
                >
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
