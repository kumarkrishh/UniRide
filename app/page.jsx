"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from "next/navigation";
import { signIn, useSession, getProviders } from "next-auth/react";

const Home = () => {
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
    router.push('/available-rideshares');
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative text-white overflow-hidden">
        {/* Background image */}
        <img
          className="w-full h-full absolute inset-0 object-cover"
          src="/assets/images/hero1final.png"
          alt="Campus View"
          style={{ opacity: '0.3' }}
        />

        {/* Centered content */}
        <div
          className="relative z-10 px-6 sm:px-10 flex flex-col justify-center items-center text-center"
          style={{ height: '100vh' }}
        >
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-4 mt-[-100px] sm:mt-[-200px] lg:mt-[-250px]">
            Connect & Commute
          </h1>
          <p className="text-base sm:text-xl max-w-2xl sm:max-w-3xl mt-4 sm:mt-6">
            Expand your college experience with UniRide, your go-to carpool network.
            Whether it's a ride to campus, a weekend escape, or a trip to the city,
            connect with fellow students and travel smarter together.
          </p>
          <button
            className="mt-8 sm:mt-10 bg-blue-600 text-white font-semibold py-2 px-6 sm:py-3 sm:px-8 rounded-full shadow-md hover:shadow-lg transform transition-all duration-300 ease-in-out text-base sm:text-lg hover:scale-105"
            onClick={handleGetStarted}
          >
            Get Started
          </button>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg
            viewBox="0 0 1440 320"
            className="w-full h-[80px] sm:h-[100px]"
            preserveAspectRatio="none"
          >
            <path
              fill="#141d26"
              fillOpacity="1"
              d="M0,256L80,240C160,224,320,192,480,197.3C640,203,800,245,960,240C1120,235,1280,181,1360,154.7L1440,128V320H0Z"
            />
          </svg>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-[#141d26] text-white py-24 px-6 sm:px-10 lg:px-16">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-center mb-20">How It Works</h2>

        <div className="space-y-16 max-w-6xl mx-auto">
          {/* Step: Find */}
          <motion.div
            className="bg-[#1b2635] rounded-2xl p-8 sm:p-12 shadow-lg flex flex-col lg:flex-row items-center gap-10"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex-1 text-center lg:text-left">
              <div className="mb-2 text-sm uppercase tracking-wider text-blue-400">Step 1</div>
              <h3 className="text-3xl sm:text-4xl font-bold text-blue-300 mb-4">Find</h3>
              <p className="text-lg leading-relaxed text-gray-200">
                Fill out a quick form with your travel plans. UniRide connects you with fellow students who are heading the same way.
              </p>
            </div>
            <img
              src="/assets/images/form1.png"
              alt="Fill Form"
              className="flex-1 max-w-sm w-full rounded-xl object-contain"
            />
          </motion.div>

          {/* Step: Request */}
          <motion.div
            className="bg-[#1b2635] rounded-2xl p-8 sm:p-12 shadow-lg flex flex-col lg:flex-row-reverse items-center gap-10"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex-1 text-center lg:text-left">
              <div className="mb-2 text-sm uppercase tracking-wider text-blue-400">Step 2</div>
              <h3 className="text-3xl sm:text-4xl font-bold text-blue-300 mb-4">Request</h3>
              <p className="text-lg leading-relaxed text-gray-200">
                Browse matching rides. View trusted student profiles and request a rideshare with a tap.
              </p>
            </div>
            <img
              src="/assets/images/results1.png"
              alt="View Matches"
              className="flex-1 max-w-sm w-full rounded-xl object-contain"
            />
          </motion.div>

          {/* Step: Connect */}
          <motion.div
            className="bg-[#1b2635] rounded-2xl p-8 sm:p-12 shadow-lg flex flex-col lg:flex-row items-center gap-10"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex-1 text-center lg:text-left">
              <div className="mb-2 text-sm uppercase tracking-wider text-blue-400">Step 3</div>
              <h3 className="text-3xl sm:text-4xl font-bold text-blue-300 mb-4">Connect</h3>
              <p className="text-lg leading-relaxed text-gray-200">
                Chat, coordinate pickup points and times, and hit the road. It's cheaper, greener, and more fun.
              </p>
            </div>
            <img
              src="/assets/images/chatpic.png"
              alt="Chat"
              className="flex-1 max-w-sm w-full rounded-xl object-contain"
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
