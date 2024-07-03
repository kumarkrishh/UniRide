"use client"
import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import ChatsPage from '@components/ChatsPage';
import { useSession } from 'next-auth/react';


const ridesharereq = (request, {params}) => {

  const { data: session } = useSession();





  

  return (
    <div className='background '>
      <ChatsPage otheruserId={session?.user.chatwithid} />
      
    </div>
    
  )

}

export default ridesharereq