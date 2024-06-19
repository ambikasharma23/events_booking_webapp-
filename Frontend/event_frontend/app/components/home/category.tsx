"use client";

import React from 'react';

const Category = () => {
  return (<>
      <h1 className="text-white mx-10">What are you looking at ?</h1>

    <section className="text-gray-100 body-font">
      <div className="container mx-auto">
        <div className="grid grid-cols-4 md:grid-cols-7 ">
          <div className="p-1 md:p-4 w-full ">
            <div className="h-full border-2 border-gray-200 border-opacity-10  rounded-lg overflow-hidden">
              <img className="h-10 md:h-20 w-full object-cover object-center" src="https://shorturl.at/fY6OZ" alt="blog" />
              <h4 className="title-font text-sm font-medium text-gray-900 text-white text-center">Music</h4>
            </div>
          </div>
          <div className="p-1 md:p-4 w-full">
            <div className="h-full border-2 border-gray-200 border-opacity-10 rounded-lg overflow-hidden">
              <img className="h-10 md:h-20 w-full object-cover object-center" src="https://shorturl.at/m0GoV" alt="blog" />
              <h4 className="title-font text-sm font-medium text-gray-900  text-white	text-center ">Dance</h4>
            </div>
          </div>
          <div className="p-1 md:p-4 w-full">
            <div className="h-full border-2 border-gray-200 border-opacity-10 rounded-lg overflow-hidden">
              <img className="h-10 md:h-20 w-full object-cover object-center" src="https://shorturl.at/uqJcJ" alt="blog" />
              <h4 className="title-font text-sm font-medium text-gray-900 text-white text-center">Food</h4>
            </div>
          </div>
          <div className="p-1 md:p-4 w-full">
            <div className="h-full border-2 border-gray-200 border-opacity-10 rounded-lg overflow-hidden">
              <img className="h-10 md:h-20 w-full object-cover object-center" src="https://shorturl.at/cRlL3" alt="blog" />
              <h4 className="title-font text-sm font-medium text-gray-900 text-white text-center">Night</h4>
            </div>
          </div>
          <div className="p-1 md:p-4 w-full">
            <div className="h-full border-2 border-gray-200 border-opacity-10 rounded-lg overflow-hidden">
              <img className="h-10 md:h-20 w-full object-cover object-center" src="https://shorturl.at/WBXbW" alt="blog" />
              <h4 className="title-font text-sm font-medium text-gray-900 text-white text-center">Cultural</h4>
            </div>
          </div>
          <div className="p-1 md:p-4 w-full">
            <div className="h-full border-2 border-gray-200 border-opacity-10 rounded-lg overflow-hidden">
              <img className="h-10 md:h-20 w-full object-cover object-center" src="https://shorturl.at/Zcha7" alt="blog" />
              <h4 className="title-font text-sm font-medium text-gray-900 text-white text-center">DJ</h4>
            </div>
          </div>
          <div className="p-1 md:p-4 w-full">
            <div className="h-full border-2 border-gray-200 border-opacity-10 rounded-lg overflow-hidden">
              <img className="h-10 md:h-20 w-full object-cover object-center" src="https://shorturl.at/CW83T" alt="blog" />
              <h4 className="title-font text-sm font-medium text-gray-900 text-white text-center">Live</h4>
            </div>
          </div>
        </div>
      </div>
    </section>
    
  </>
  );
}

export default Category;
