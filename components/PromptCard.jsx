"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
import { FiCalendar, FiClock, FiMessageCircle } from 'react-icons/fi';
import { FaCar } from 'react-icons/fa';
import DeleteIcon from '@mui/icons-material/Delete';

const PromptCard = ({ post, handleTagClick, handleEdit, handleDelete }) => {
  const { data: session } = useSession();
  const pathName = usePathname();
  const router = useRouter();

  // State to manage request and deletion statuses
  const [requestSent, setRequestSent] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle the request rideshare button click
  const handleButtonClick = async () => {
    if (!requestSent) {
      try {
        // Set session details for chat
        session.user.chatwithid = post.userId._id;
        session.user.chatwithname = post.userId.username;
        session.user.chatwithimage = post.userId.image;

        // Send notification
        const notificationMessage = `${session?.user.name} has requested a rideshare with you.`;
        const encodedChatWithImage = encodeURIComponent(session.user.image);
        await axios.post(`/api/addnotif/${session.user.chatwithid}/${session.user.id}/${notificationMessage}/${session.user.chatwithname}/${encodedChatWithImage}`);

        setRequestSent(true);
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    } else {
      setRequestSent(false);
    }
  };

  // Handle the message button click
  const handlemsgClick = async () => {
    if (post.userId._id == session.user.id)
      return;
    session.user.chatwithid = post.userId._id;
    session.user.chatwithname = post.userId.username;
    session.user.chatwithimage = post.userId.image;
    router.push(`/req-rideshare`);
  };

  // Handle the delete button click
  const handleDeleteClick = () => {
    setIsDeleting(true);
    setTimeout(() => {
      handleDelete(post);
    }, 500); // Duration of the animation
  };

  // Extract street and city from address
  const extractStreetAndCity = (address) => {
    const parts = address.split(',').map(part => part.trim());
    if (parts.length >= 3) {
      const street = `${parts[0]}, ${parts[1]}`;
      const city = parts[2];
      if (!/^[A-Z]{2}$/.test(city.split(' ')[0])) {
        return `${street}, ${city}`;
      }
      return street;
    }
    return address;
  };

  // Format date to a readable format
  const formatDate = (date) => {
    const localDate = new Date(date);
    localDate.setMinutes(localDate.getMinutes() + localDate.getTimezoneOffset());
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return localDate.toLocaleDateString(undefined, options);
  };

  // Format time to a readable format
  const formatTime = (time) => {
    let [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${period}`;
  };

  return (
    <div 
      className={`shadow-lg p-6 rounded-lg bg-[#1e2a38] text-white w-full max-w-4xl ${isDeleting ? 'deleting' : ''}`}
      style={{ breakInside: 'avoid' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="relative flex items-center gap-3 group" onClick={() => {
          session.user.viewuserid = post.userId._id;
        }}>
          <Image 
            src={post.userId.image}
            alt="user_image"
            width={40}
            height={40}
            className="rounded-full object-contain "
          />
          <div>
            <p className="text-white font-semibold ">{post.userId.username}</p>
            <p className="text-gray-300 text-sm ">{post.userId.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {((pathName === "/create-prompt" || pathName === "/available-rideshares") && session?.user.id !== post.userId._id) && (
            <button
              className="text-white hover:text-gray-300 relative"
              onClick={() => handlemsgClick(post)}
            >
              <div className="absolute inset-0 w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 opacity-50" style={{ top: '-5px', left: '-6px' }}></div>
              <FiMessageCircle size={28} className="relative z-10" />
            </button>
          )}
          {session?.user.id === post.userId._id && pathName === "/my-trips" && (
            <>
              <button 
                className="text-white hover:text-gray-300 relative"
                onClick={handleDeleteClick}
              >
                <DeleteIcon style={{ fontSize: 28 }} />
              </button>
            </>
          )}
        </div>
      </div>
      <div className="mb-4">
        <div className="flex items-center text-gray-300 mb-1">
          <FiCalendar className="mr-2" />
          <span>{formatDate(post.date)}</span>
          <FiClock className="ml-4 mr-2" />
          <span>{formatTime(post.time)}</span>
        </div>
        <p className="text-gray-300 mb-1">
          <span className="font-semibold">From: </span>{extractStreetAndCity(post.startAddress.address)}
        </p>
        <p className="text-gray-300 mb-1">
          <span className="font-semibold">To: </span>{extractStreetAndCity(post.destinationAddress.address)}
        </p>
      </div>
      <p className="text-white mb-4">
        {post.prompt}
      </p>
      {post.tag && (
        <p className="mt-2 text-blue-400 cursor-pointer" onClick={() => handleTagClick && handleTagClick(post.tag)}>
          #{post.tag}
        </p>
      )}
      {((pathName === "/create-prompt" || pathName === "/available-rideshares") && session?.user.id !== post.userId._id) && (
        <div className="flex items-center mt-4">
          <button
            className={`request-button ${requestSent ? 'bg-gray-400' : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700'}`}
            onClick={handleButtonClick}
          >
            <FaCar className="mr-2" />
            {requestSent ? 'Request Sent' : 'Request Rideshare'}
          </button>
        </div>
      )}
      <style jsx>{`
        .request-button {
          display: inline-flex;
          align-items: center;
          padding: 12px 24px;
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
          border: none;
          border-radius: 50px;
          transition: background 0.3s ease, transform 0.2s ease;
          cursor: pointer;
        }

        .request-button:hover {
          background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
          transform: translateY(-2px);
        }

        .request-button:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.6);
        }

        .deleting {
          animation: fadeOut 0.5s forwards;
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.8);
          }
        }
      `}</style>
    </div>
  );
};

export default PromptCard;
