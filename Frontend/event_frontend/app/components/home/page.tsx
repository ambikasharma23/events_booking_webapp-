"use client";

import { useEffect, useState } from 'react';
import titleImage from './title.png';

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
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          fetchCityName(position.coords.latitude, position.coords.longitude);
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
      <header className="flex justify-between items-center p-8 bg-gradient-to-r from-gray-800 to-olive border-b border-gray-300">
        <div className="text-sm text-white">
          {location.latitude !== null && location.longitude !== null
            ? (
              <div className="flex items-center bg-transparent border-2 border-white text-white p-2 rounded-lg">
                <span className="mr-2">City:</span>
                <span>{city || 'Fetching city...'}</span>
              </div>
            )
            : <div className="bg-transparent text-white p-2 rounded-lg">{locationError || 'Fetching location...'}</div>
          }
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
      <main className="p-4">
        <h1 className="text-2xl font-bold">Welcome to the Events App</h1>
      </main>
    </div>
  );
}
