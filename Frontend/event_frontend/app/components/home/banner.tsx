"use client";

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
      <div className="absolute inset-0"></div>

      <div className="fixed top-0 left-0 right-0 z-50">
        <HomePage />
      </div>

      <section className="bg-black dark:bg-gray-900">
        <div className="grid max-w-screen-xl px-8  pb-4 mx-auto lg:gap-8 xl:gap-0 lg:py-10 lg:grid-cols-12 pt-20 lg:pt-28">
          <div className="mr-auto place-self-center lg:col-span-7">
            <h1 className="max-w-2xl mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl text-white">
              Eazydiner Events <br />
              Booking
            </h1>

            <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
              Now you can book your favourite upcoming events in advance. Start
              your Booking now and enjoy the momemt without any hustle.
            </p>

            <div className="space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
              <a
                href=""
                target="_blank"
                className="inline-flex items-center justify-center w-full px-5 py-3 text-sm font-medium text-center text-white border border-gray-200 rounded-lg sm:w-auto hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
              >
                View Events
              </a>

              <a
                href=""
                target="_blank"
                className="inline-flex items-center justify-center w-full px-5 py-3 mb-2 mr-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:w-auto focus:outline-none hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                Book Now
              </a>
            </div>
          </div>

          <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
            <img src="/images/events2.png" alt="hero image" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Image;
