"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';

const PromptCard = ({ post, handleTagClick, handleEdit, handleDelete }) => {
  const { data: session } = useSession();
  const pathName = usePathname();
  const router = useRouter();

  const [requestSent, setRequestSent] = useState(false);

  const handleButtonClick = async () => {
    session.user.chatwithid = post.userId._id;
      session.user.chatwithname = post.userId.username;
      session.user.chatwithimage = post.userId.image;
    if (!requestSent) {
      

      try {
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

  return (
    <div className='prompt_card shadow-lg p-6 rounded-lg bg-white flex justify-between items-center'>
      <div className='flex-1'>
        <div className='flex justify-between items-center gap-5'>
          <div className='flex-1 flex justify-start items-center gap-3 cursor-pointer'>
            <Image 
              src={post.userId.image}
              alt="user_image"
              width={40}
              height={40}
              className='rounded-full object-contain'
            />
          </div>
          {session?.user.id === post.userId._id && pathName === "/my-trips" && (
            <div className='flex items-center gap-3'>
              <button 
                className='px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600'
                onClick={() => handleEdit(post)}
              >
                Edit
              </button>
              <button 
                className='px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600'
                onClick={() => handleDelete(post)}
              >
                Delete
              </button>
            </div>
          )}
        </div>
        <div className='mb-4'>
          <p className='text-gray-700'>
            <span className='font-semibold'>Date: </span>{post.date}
          </p>
          <p className='text-gray-700'>
            <span className='font-semibold'>Time: </span>{post.time}
          </p>
          <p>
            <span className='font-bold text-gray-900'>{post.startAddress.address}</span>
          </p>
          <p>
            <span className='font-bold text-gray-900'>{post.destinationAddress.address}</span>
          </p>
        </div>
        <p className='font-medium text-sm text-gray-800'>
          {post.prompt}
        </p>
        {post.tag && (
          <p className='mt-2 text-sm text-blue-600 cursor-pointer' onClick={() => handleTagClick && handleTagClick(post.tag)}>
            #{post.tag}
          </p>
        )}
      </div>
      { pathName === "/create-prompt" && (
        <button
          className={`px-4 py-2 text-sm text-white rounded ml-4 ${requestSent ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}`}
          onClick={handleButtonClick}
        >
          {requestSent ? 'Request Sent' : 'Request Rideshare'}
        </button>
      )}
    </div>
  );
}

export default PromptCard;
