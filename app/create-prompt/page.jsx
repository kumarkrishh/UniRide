"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import AddressInput from "@components/AddressInput";


const CreatePrompt = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [submitting, setIsSubmitting] = useState(false);
  const [post, setPost] = useState({ prompt: "", tag: "" });

  const createPrompt = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/prompt/new", {
        method: "POST",
        body: JSON.stringify({
          prompt: post.prompt,
          userId: session?.user.id,
          tag: post.tag,
          userName: session?.user.name
        }),
      });

      if (response.ok) {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className='w-full max-w-full flex flex-col items-center px-6 md:px-20 min-h-screen bg-[#141d26] text-white'>
      <h1 className='text-4xl md:text-5xl font-bold text-center mt-10'>
        <span className='bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600'>Find Rideshares</span>
      </h1>
      <AddressInput />
    </section>
    
  );
};

export default CreatePrompt;