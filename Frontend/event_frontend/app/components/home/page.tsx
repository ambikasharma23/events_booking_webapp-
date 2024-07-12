"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Location = {
  latitude: number | null;
  longitude: number | null;
};

type Result = {
  id: number;
  event_name: string;
  event_image: string;
};

export default function HomePage() {
  const [location, setLocation] = useState<Location>({
    latitude: null,
    longitude: null,
  });
  const [locationError, setLocationError] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<string>("transparent");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchInitiated, setSearchInitiated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage hamburger menu visibility
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 0) {
        setBackgroundColor("rgba(0, 0, 0, 0.9)");
      } else {
        setBackgroundColor("transparent");
      }
    };
    window.addEventListener("scroll", handleScroll);
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

  const debounce = (func: (...args: any[]) => void, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const handleClick = (id: number) => {
    router.push(`/details/${id}`);
  };

  const fetchSearchResults = async (query: string) => {
    if (!query) {
      setResults([]);
      setSearchInitiated(false);
      return;
    }

    setSearchInitiated(true);

    const apiUrl = `http://localhost:3001/allevents?search=${query}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Result[] = await response.json();
      console.log("Fetched data:", data);
      setResults(data);
      setFetchError(null);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setFetchError("Error fetching search results");
      setResults([]);
    }
  };

  const debouncedFetchSearchResults = useCallback(
    debounce((query) => fetchSearchResults(query), 300),
    []
  );

  useEffect(() => {
    debouncedFetchSearchResults(query);
  }, [query]);

  const fetchCityName = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
      );
      const data = await response.json();
      setCity(data.city);

      // Send location to backend
      sendLocationToBackend(lat, lon);
    } catch (error) {
      console.error("Error fetching city:", error);
    }
  };

  const sendLocationToBackend = async (latitude: number, longitude: number) => {
    const apiUrl = `http://localhost:3001/updateLocation`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ latitude, longitude }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log("Location sent to backend successfully");
    } catch (error) {
      console.error("Error sending location to backend:", error);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setSearchInitiated(false);
  };

  return (
    <div>
      <div className="font-sans fixed w-full top-0" style={{ backgroundColor }}>
        <header className="flex justify-between items-center py-4 md:px-8">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-0">
              <img
                src={"/images/logo1.gif"}
                alt="Logo"
                className="h-12 w-12 mr-2"
              />
              <div className="text-sm md:text-3xl font-bold text-white px-2">
                <Link href="/">eazyEvents</Link>
              </div>
            </div>

            <div className="text-sm text-white">
              {location.latitude !== null && location.longitude !== null ? (
                <div className="flex items-center bg-transparent border-2 border-white text-white p-1 md:p-2 rounded-lg">
                  <span>{city || "Fetching city..."}</span>
                </div>
              ) : (
                <div className="bg-transparent border-2 border-white text-white p-2 rounded-lg">
                  {locationError || "Fetching location..."}
                </div>
              )}
            </div>
            <form
              className=" w-26 md:w-96 relative"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="w-full px-3 py-1 rounded-lg bg-gray-200 text-gray-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-gray-300"
              />
              {searchInitiated && (
                <button
                  type="button"
                  className="absolute right-0 top-0 h-full px-3 py-1 text-gray-500 focus:outline-none"
                  onClick={clearSearch}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </form>
          </div>
          <div className="block md:hidden relative">
            <button
              className="text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg">
                <div className="text-sm text-gray-800 px-3 py-1 font-bold border-b">
                  <Link href="/">Home</Link>
                </div>
                <div className="text-sm text-gray-800 px-3 py-1 font-bold border-b">
                  <Link href="/">Bookings</Link>
                </div>
                <div className="text-sm text-gray-800 px-3 py-1 font-bold border-b">
                  <Link href={`/register/login`}>Login</Link>
                </div>
                <div className="text-sm text-gray-800 px-3 py-1 font-bold">
                  <Link href={`/register/signin`}>Sign In</Link>
                </div>
              </div>
            )}
          </div>

          <div className="hidden md:flex justify-between items-center">
            <div className="text-sm text-white px-3 py-1">
              <Link href="/">Home</Link>
            </div>
            <div className="text-sm text-white px-3 py-1 ">
              <Link href="/">Bookings</Link>
            </div>
            <div className="text-sm text-white px-3 py-1 ">
              <Link href={`/register/login`}>Login</Link>
            </div>
            <div className="text-sm text-white px-3 py-1 ">
              <Link href={`/register/signin`}>Sign In</Link>
            </div>
          </div>
        </header>
      </div>

      {searchInitiated && (
        <main className="absolute top-20 left-1/2 transform -translate-x-1/2 p-4 bg-white md:w-46 w-64 max-h-96 overflow-y-scroll">
          <h1 className="md:text-2xl text-lg font-bold">Search Results</h1>
          {fetchError && <p className="text-red-500">{fetchError}</p>}
          <ul className="mt-4">
            {results.length > 0 ? (
              results.map((result) => (
                <li
                  key={result.id}
                  className="p-2 border-b border-gray-200 flex justify-between cursor-pointer"
                  onClick={() => handleClick(result.id)}
                >
                  <img className="w-20 p-1" src={result.event_image} />
                  {result.event_name}
                </li>
              ))
            ) : (
              <li className="text-red">No results found</li>
            )}
          </ul>
        </main>
      )}
    </div>
  );
}
