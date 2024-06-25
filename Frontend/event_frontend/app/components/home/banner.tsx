'use client';

import React from "react";
import HomePage from "./page";
import { useRouter } from "next/navigation";

const Image = () => {
  const router = useRouter();

  const handleBookNowClick = (categoryId: number) => {
    router.push(`/event/${categoryId}`);
  };

  return (
    <>
      <div className="relative w-full bg-cover bg-center" style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%), url('/images/events-background-1.jpg')`, height: '70vh' }}>
        <div className="absolute inset-0"></div>
        
        <div className="fixed top-0 left-0 right-0 z-50">
          <HomePage />
        </div>

        <div className="flex flex-col items-center justify-center h-full relative z-10">
          <img
            src={'/images/Summerimage.gif'}
            alt="Summer GIF"
            className="mt-8 max-w-full max-h-full object-cover"
            style={{ position: "relative", zIndex: 20 }}
          />
          <button
            type="button"
            className="mt-4 text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-transform duration-300 ease-in-out transform hover:scale-110"
            style={{ position: "relative", zIndex: 20 }}
            onClick={() => handleBookNowClick(1)} 
          >
            Book now
          </button>
        </div>
      </div>
    </>
  );
};

export default Image;
