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
  
  const [copied, setCopied] = useState("");

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
        className='px-4 py-2 text-sm text-white bg-green-500 rounded hover:bg-green-600 ml-4'
        onClick={ () => {
          console.log("sus", post.userId.username);
          console.log(session?.user.name);
          
          session.user.chatwithid = post.userId._id;
          session.user.chatwithname = post.userId.username;
          session.user.chatwithimage = post.userId.image;
          router.push(`/req-rideshare`);
          
        }}
      >
        Request Rideshare
      </button>
      )}
      
    </div>
  )
}

export default PromptCard;