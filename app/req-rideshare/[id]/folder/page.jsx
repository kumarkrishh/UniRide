"use client"
import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import ChatsPage from '@components/ChatsPage';
import { useSession } from 'next-auth/react';


const ridesharereq = (request, {params}) => {
  console.log("reached");
  //console.log("params here:", params.id);
  //const [id, setId] = useState(null);
  const { data: session } = useSession();
  const router = useRouter;
  const [showChat, setShowChat] = useState(false);
  //setId(params.id);

  useEffect(() => {
    if (router.isReady) {
        console.log("Query ID:", this.props.router.query.id);  // Accessing the query parameter
    }
}, [router.isReady, router.query.id]);

  if (!showChat) return <div />;

  return (
    <div className='background w-full'>
      <ChatsPage otheruserId={"id"} />
      
    </div>
    
  )

}

export default ridesharereq