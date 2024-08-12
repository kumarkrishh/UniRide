"use client";

import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import PromptCard from '@components/PromptCard';
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";

const Home = () => {
  const controls = useAnimation();
  const router = useRouter();
  const [providers, setProviders] = useState(null);
  const { data: session } = useSession();

  useEffect(() => {
    (async () => {
      const res = await getProviders();
      setProviders(res);
    })();
  }, []);

  const handleGetStarted = () => {
    /*if (session) {
      // If the user is logged in, route to the desired page
      router.push('/available-rideshares'); 
    } else {
      // If the user is not logged in, proceed with the normal sign-in process
      if (providers) {
        Object.values(providers).forEach((provider) => {
          signIn(provider.id);
        });
      }
    }*/

      router.push('/available-rideshares'); 

  };

  return (
    <div className="w-full z-0" style={{ marginTop: '-75px' }}>
      {/* Hero Section */}
      <section className="relative text-white overflow-hidden">
        <img className="w-full h-auto absolute inset-0 object-contain" src="/assets/images/hero1final.png" alt="Campus View" style={{ opacity: '0.3' }} />
        <div className="relative z-10 p-10 flex flex-col justify-center items-center" style={{ height: '100vh' }}>
          <h1 className="text-6xl font-bold mb-6" style={{ marginTop: '-250px' }}>Connect & Commute</h1>
          <p className="text-2xl max-w-4xl text-center mt-6">
            Expand your college experience with UniRide, your go-to carpool network. Whether it's a ride to campus, a weekend escape, or a trip to the city, connect with fellow students and travel smarter together.
          </p>
          <button className="mt-10 bg-gradient-to-r from-blue-600 to-blue-600 text-white font-semibold py-3 px-8 rounded-full shadow-md hover:shadow-lg transform transition-all duration-300 ease-in-out text-lg hover:scale-105"
   onClick={handleGetStarted}>
            Get Started
          </button>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="my-12 text-gray-300">
        <div className="container mx-auto px-6">
          <h2 className="text-6xl font-semibold text-center mb-10">How It Works</h2>
          <div className="flex flex-col items-center mt-8 space-y-10 rounded-full">
            {/* Each motion.div represents a step in the process */}
            <motion.div
              className="flex flex-col md:flex-row items-center justify-center text-center p-8 w-full text-white rounded-xl overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <img src="/assets/images/form1.png" alt="Fill Form" className="rounded-lg object-contain" style={{ maxHeight: '350px' }} />
              <div className="text-left max-w-md ml-8 mr-10" style={{ marginTop: '-100px' }}>
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
              <img src="/assets/images/results1.png" alt="View Matches" className="rounded-lg object-contain" style={{ maxHeight: '270px' }} />
              <div className="text-left max-w-md mr-20" style={{ marginTop: '-50px' }}>
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
              <img src="/assets/images/chatpic.png" alt="Message" className="rounded-lg object-contain" style={{ maxHeight: '300px' }} />
              <div className="text-left max-w-md ml-8 mr-8" style={{ marginTop: '-50px' }}>
                <span className="text-left text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600">Connect</span>
                <p className="mt-5 text-xl leading-relaxed tracking-wide">Use our built-in messaging system to connect with your matches. Arrange specifics like pickup points, times, and shared costs directly through the platform. Commuting together not only saves you money but also reduces your carbon footprint.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
