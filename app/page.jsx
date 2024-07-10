"use client"

import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import PromptCard from '@components/PromptCard';

const Home = () => {
  const controls = useAnimation();
  const [carpoolData, setCarpoolData] = useState([]);
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  const fetchCarpoolData = async () => {
    const response = await fetch('/api/findcarpools/drivers', {
      method: 'GET', // Changed to GET as we're not sending any data
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      setCarpoolData(data);
      
    } else {
      console.error('Failed to fetch carpool data');
    }
  };

  useEffect(() => {
    fetchCarpoolData();
  }, []);

  const cardWidth = 400;  // Fixed width for each card
  const cardHeight = 200; // Fixed height for each card

  return (
  <div className="w-full z-0" style={{ marginTop: '-70px' }}>
    
    {/* Hero Section */}
    <section className="relative text-white overflow-hidden">
      <img className="w-full absolute inset-0" src="/assets/images/hero1final.png" alt="Campus View"
           style={{ height: '100vh', width: '100vw', opacity: '0.3' }} />
      <div className="relative z-10 p-10 flex flex-col justify-center items-center" style={{ height: '100vh' }}>
        <h1 className="text-6xl font-bold mb-6" style={{marginTop: '-250px'}}>Connect & Commute</h1>
        <p className="text-2xl max-w-4xl text-center mt-6">
        Expand your college experience with UniRide, your go-to carpool network. Whether it's a ride to campus, a weekend escape, or a trip to the city, connect with fellow students and travel smarter together.
        </p>
        <button className="mt-10 bg-blue-600 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg text-lg">
          Get Started
        </button>
      </div>
    </section>

   
    <div className="relative my-4 mx-auto px-4 max-w-full">
        <h2 className="text-2xl text-white font-bold mb-4">Available Rides</h2>
        <button className="absolute left-0 z-10 text-white bg-blue-500 hover:bg-blue-700 rounded-full p-2" onClick={scrollLeft} style={{ top: '50%', transform: 'translateY(-10%)', marginLeft: '10px' }}>&lt;</button>
        <div className="overflow-hidden" style={{ paddingLeft: '40px', paddingRight: '40px' }}>
          <div className="flex overflow-x-auto py-4" ref={scrollRef}>
            {carpoolData.map((post) => (
              <div key={post._id} style={{ marginRight: "10px", width: `${cardWidth}px`, minHeight: '400px', maxHeight: `400px`, flex: '0 0 auto' }}>
                <PromptCard post={post}/>
              </div>
            ))}
          </div>
        </div>
        <button className="absolute right-0 z-10 text-white bg-blue-500 hover:bg-blue-700 rounded-full p-2" onClick={scrollRight} style={{ top: '50%', transform: 'translateY(-10%)', marginRight: '10px' }}>&gt;</button>
      </div>

      <style jsx>{`
        .overflow-hidden .flex {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }

        .overflow-hidden .flex::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
        button {
          background: #333;
          color: white;
          border: none;
          padding: 10px;
          cursor: pointer;
          opacity: 0.6;
          transition: opacity 0.3s;
        }
        button:hover {
          opacity: 1;
        }
      `}</style>
    

      

    {/* How It Works Section */}
    
    <section className="my-12 text-gray-300">
  <div className="container mx-auto px-6">
    <h2 className="text-6xl font-semibold text-center mb-10">How It Works</h2>
    <div className="flex flex-col items-center mt-8 space-y-10 rounded-full">
      {/* Each motion.div represents a step in the process */}
      <motion.div 
        className="flex flex-col md:flex-row items-center justify-center text-center p-8 w-full text-white rounded-xl overflow-hidden "
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <img src="/assets/images/form1.png" alt="Fill Form" style={{ height: '350px' }} className=" rounded-lg"/>
        <div className="text-left max-w-md ml-8 mr-10" style={{marginTop: '-100px'}}>
          <span className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600">Find</span>
          <p className="mt-5 text-xl leading-relaxed tracking-wide">Fill out a simple form to tell us your travel details and preferences. Our system is designed to connect you with other students who share similar routes and schedules, making every commute efficient and environmentally friendly.</p>
        </div>
      </motion.div>

      <motion.div 
        className="flex flex-col md:flex-row-reverse items-center justify-center text-center p-8 w-full text-white rounded-xl overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <img src="/assets/images/results1.png" alt="View Matches" style={{ height: '270px' }} className="rounded-lg"/>
        <div className="text-left max-w-md mr-20" style={{marginTop: '-50px'}}>
          <span className="text-left text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600">Request</span>
          <p className="mt-5 text-xl leading-relaxed tracking-wide">See a list of potential ride matches based on your route and schedule. Our platform ensures that all matches are verified students for safety and reliability.</p>
        </div>
      </motion.div>

      <motion.div 
        className="flex flex-col md:flex-row items-center justify-center text-center p-8 w-full text-white rounded-xl overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <img src="/assets/images/chatpic.png" alt="Message" style={{ height: '300px' }} className=" rounded-lg"/>
        <div className="text-left max-w-md ml-8 mr-8" style={{marginTop: '-50px'}}>
          <span className="text-left text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600">Connect</span>
          <p className="mt-5 text-xl leading-relaxed tracking-wide">Use our built-in messaging system to connect with your matches. Arrange specifics like pickup points, times, and shared costs directly through the platform. Commuting together not only saves you money but also reduces your carbon footprint.</p>
        </div>
      </motion.div>
    </div>
  </div>
</section>

    

    {/* Call to Action Section */}
    <section className="cta text-center my-12 bg-gray-800 text-white py-10 shadow-xl">
      <h2 className="text-4xl font-bold">Ready to Reduce Your Travel Costs?</h2>
      <p className="text-2xl my-4">Sign up today and start connecting with fellow students on your route.</p>
      <button className="mt-4 bg-blue-600 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg text-lg">
        Join Now
      </button>
    </section>
  </div>
);
};


export default Home;











