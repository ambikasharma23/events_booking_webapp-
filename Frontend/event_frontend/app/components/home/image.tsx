import React from 'react';
import image1 from "./Summerimage.gif";

const Image = () => {
  return (
    <div className="relative flex items-center justify-center md:h-screen lg:h-auto bg-black">
      <img
        src={image1.src}
        alt="Summer GIF"
        className="max-w-full max-h-full object-cover"
      />
      <button 
        type="button" 
        className="absolute text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-transform duration-300 ease-in-out transform hover:scale-110"
        style={{ bottom: '20px' }}
      >
        Book now
      </button>
    </div>
  );
}

export default Image;
