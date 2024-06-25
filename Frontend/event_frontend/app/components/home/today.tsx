'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const Today = () => {
  const router = useRouter();

  const handleTodayClick = () => {
    router.push('/todaysevents');
  };

  const handleWeeklyClick = () => {
    router.push('/weeklyevents');
  };

  return (
    <div className="container mx-auto">
      <div className="mt-10 flex justify-left space-x-10">
        <div>
          <img
            src="/images/TodayF.png"
            alt="Today's Events"
            className="h-50 w-50 cursor-pointer"
            onClick={handleTodayClick}
          />
        </div>
        <div>
          <img
            src="/images/weekly.png"
            alt="Weekly Events"
            className="h-50 w-50 cursor-pointer"
            onClick={handleWeeklyClick}
          />
        </div>
      </div>
    </div>
  );
};

export default Today;
