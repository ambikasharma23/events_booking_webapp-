'use client';
import React from 'react';

const Today = () => {
  return (
    <div className="container mx-auto">
      <div className="mt-10 flex justify-left space-x-10">
        <div>
          <img src="/images/TodayF.png" alt="Today's Events" className="h-50 w-50" />
        </div>
        <div>
          <img src="/images/weekly.png" alt="Weekly Events" className="h-50 w-50" />
        </div>
      </div>
    </div>
  );
};

export default Today;
