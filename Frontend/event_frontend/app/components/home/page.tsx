"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import titlelogo from './logo1.gif';

type Location = {
  latitude: number | null;
  longitude: number | null;
};

export default function HomePage() {
  const [location, setLocation] = useState<Location>({ latitude: null, longitude: null });
  const [locationError, setLocationError] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          fetchCityName(latitude, longitude);
          setLocationError(null);
        },
        (error) => {
          setLocationError(error.message);
        }
      );
    } else {
      setLocationError('Geolocation is not supported by this browser.');
    }
  }, []);

  const fetchCityName = async (lat: number, lon: number) => {
    try {
      const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
      const data = await response.json();
      setCity(data.city);
    } catch (error) {
      console.error('Error fetching city:', error);
    }
  };

  return (
    <div className="font-sans">
      <header className="flex justify-between items-center p-8 bg-gradient-to-r from-gray-800 to-black border-b border-gray-300">
        <div className="flex items-center space-x-8">

        <div className="flex items-center space-x-0">
        <img src={titlelogo.src} alt="Logo" className="h-13 w-14 mr-0" />
        <div className="text-3xl font-bold text-white">eazyEvents</div>
        </div>

          <div className="text-sm text-white">
            {location.latitude !== null && location.longitude !== null ? (
              <div className="flex items-center bg-transparent border-2 border-white text-white p-2 rounded-lg">
                <span className="mr-2">City:</span>
                <span>{city || 'Fetching city...'}</span>
              </div>
            ) : (
              <div className="bg-transparent border-2 border-white text-white p-2 rounded-lg">
                {locationError || 'Fetching location...'}
              </div>
            )}
          </div>
        </div>
        <div className="w-1/3 flex justify-center">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-3 py-1 rounded-lg bg-gray-200 text-gray-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-gray-300"
          />
        </div>
        <div className="text-xl cursor-pointer">👤</div>
      </header>
      
    </div>
  );
}
