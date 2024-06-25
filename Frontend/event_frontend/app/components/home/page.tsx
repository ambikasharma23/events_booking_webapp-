"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Location = {
  latitude: number | null;
  longitude: number | null;
};

export default function HomePage() {
  const [location, setLocation] = useState<Location>({
    latitude: null,
    longitude: null,
  });
  const [locationError, setLocationError] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<string>("transparent"); // Initialize with transparent

  useEffect(() => {
    // Add event listener for scroll
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Set background color based on scroll position
      if (scrollY > 0) {
        setBackgroundColor("rgba(0, 0, 0, 0.9)"); // Transparent black color
      } else {
        setBackgroundColor("transparent");
      }
    };

    // Attach scroll event listener when component mounts
    window.addEventListener("scroll", handleScroll);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
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
      setLocationError("Geolocation is not supported by this browser.");
    }
  }, []);

  const fetchCityName = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
      );
      const data = await response.json();
      setCity(data.city);
    } catch (error) {
      console.error("Error fetching city:", error);
    }
  };

  return (
    <div className="font-sans fixed w-full" style={{ backgroundColor }}>
      <header className="flex justify-between items-center p-2 md:px-8 md:py-5">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-0">
            <img
              src={"/images/logo1.gif"}
              alt="Logo"
              className="h-12 w-12 mr-2"
            />
            <div className="text-sm md:text-3xl font-bold text-white">
              <Link href="/">eazyEvents</Link>
            </div>{" "}
          </div>

          <div className="text-sm text-white">
            {location.latitude !== null && location.longitude !== null ? (
              <div className="flex items-center bg-transparent border-2 border-white text-white p-1 md:p-2 rounded-lg">
                {/* <span className="mr-2">City:</span> */}
                <span>{city || "Fetching city..."}</span>
              </div>
            ) : (
              <div className="bg-transparent border-2 border-white text-white p-2 rounded-lg">
                {locationError || "Fetching location..."}
              </div>
            )}
          </div>
        </div>

        <div className="w-20 md:w-1/6 flex justify-end">
          {" "}
          {/* Adjusted input field alignment */}
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-3 py-1 rounded-lg bg-gray-200 text-gray-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-gray-300"
          />
        </div>
      </header>
    </div>
  );
}
