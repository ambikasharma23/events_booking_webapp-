import React from 'react';
import image1 from "./display.gif";

const Image = () => {
  return (
    <div className="flex items-center justify-center md:h-screen lg:h-auto bg-gradient-to-r from-gray-800 to-black">
      <img
        src={image1.src}
        alt="Summer GIF"
        className="max-w-full max-h-full object-cover"
      />
    </div>
  );
}

export default Image;
