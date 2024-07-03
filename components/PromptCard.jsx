"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
import { FiCalendar, FiClock } from 'react-icons/fi'; // Importing date and time icons
import { FaCar, FaHandshake, FaRoute } from 'react-icons/fa'; // Importing rideshare icons


const PromptCard = ({ post, handleTagClick, handleEdit, handleDelete }) => {
  const { data: session } = useSession();
  const pathName = usePathname();
  const router = useRouter();

  const [requestSent, setRequestSent] = useState(false);

  const handleButtonClick = async () => {
    if (!requestSent) {
      try {
        session.user.chatwithid = post.userId._id;
    session.user.chatwithname = post.userId.username;
    session.user.chatwithimage = post.userId.image;
        const notificationMessage = `${session?.user.name} has requested a rideshare with you.`;
        const encodedChatWithImage = encodeURIComponent(session.user.chatwithimage);
        await axios.post(`/api/addnotif/${session.user.chatwithid}/${session.user.id}/${notificationMessage}/${session.user.chatwithname}/${encodedChatWithImage}`);

        setRequestSent(true);
        
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    } else {
      setRequestSent(false);
    }
  };

  const handlemsgClick = async () => {
    session.user.chatwithid = post.userId._id;
    session.user.chatwithname = post.userId.username;
    session.user.chatwithimage = post.userId.image;
    router.push(`/req-rideshare`);
  };

  const extractStreetAndCity = (address) => {
    const parts = address.split(',').map(part => part.trim());
    if (parts.length >= 3) {
      const street = `${parts[0]}, ${parts[1]}`;
      const city = parts[2];
      // Check if the city part does not contain a 2-letter state code
      if (!/^[A-Z]{2}$/.test(city.split(' ')[0])) {
        return `${street}, ${city}`;
      }
      return street;
    }
    return address;
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const formatTime = (time) => {
    let [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${period}`;
  };

  return (
    <div className="shadow-lg p-6 rounded-lg bg-white w-3/4 max-w-4xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Image 
            src={post.userId.image}
            alt="user_image"
            width={40}
            height={40}
            className="rounded-full object-contain"
          />
          <div>
            <p className="text-gray-700 font-semibold">{post.userId.username}</p>
            <p className="text-gray-500 text-sm">{post.userId.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="text-red-500 hover:text-red-600"
            onClick={() => handlemsgClick(post)}
          >
            <img src="/assets/images/msgicon.svg" alt="Message" width={30} height={30} />
          </button>
          {session?.user.id === post.userId._id && pathName === "/my-trips" && (
            <>
              <button 
                className="px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                onClick={() => handleEdit(post)}
              >
                Edit
              </button>
              <button 
                className="px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                onClick={() => handleDelete(post)}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
      <div className="mb-4">
        <div className="flex items-center text-gray-700 mb-1">
          <FiCalendar className="mr-2" />
          <span>{formatDate(post.date)}</span>
          <FiClock className="ml-4 mr-2" />
          <span>{formatTime(post.time)}</span>
        </div>
        <p className="text-gray-700 mb-1">
          <span className="font-semibold">From: </span>{extractStreetAndCity(post.startAddress.address)}
        </p>
        <p className="text-gray-700 mb-1">
          <span className="font-semibold">To: </span>{extractStreetAndCity(post.destinationAddress.address)}
        </p>
      </div>
      <p className="font-medium text-gray-800 mb-4">
        {post.prompt}
      </p>
      {post.tag && (
        <p className="mt-2 text-sm text-blue-600 cursor-pointer" onClick={() => handleTagClick && handleTagClick(post.tag)}>
          #{post.tag}
        </p>
      )}
      {pathName === "/create-prompt" && (
        <div className="flex items-center mt-4">
          <button
            className={`px-4 py-2 text-sm text-white rounded flex items-center gap-2 ${requestSent ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}`}
            onClick={handleButtonClick}
          >
            <FaCar />
            {requestSent ? 'Request Sent' : 'Request Rideshare'}
          </button>
        </div>
      )}
    </div>
  );
}

export default PromptCard;
