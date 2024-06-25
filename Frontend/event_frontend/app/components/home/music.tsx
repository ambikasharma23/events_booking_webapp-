"use client";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { format } from 'date-fns';
import { useRouter } from "next/navigation";

interface MusicCat {
  id: number;
  event_image: string;
  event_name: string;
  start_date: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, "do MMMM");
};

export default function Music() {
  const [events, setEvents] = useState<MusicCat[]>([]);
  const [loading, setLoading] = useState(true); // Add a loading state
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await fetch(
          "http://localhost:3001/allevents?event_category=music&limit=10"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data: MusicCat[] = await response.json();
        console.log("Fetched data:", data);
        setEvents(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchData();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
          centerMode: true,
          centerPadding: "10px",
          initialSlide: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: "20px",
          initialSlide: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: "20px",
          initialSlide: 1,
        },
      },
    ],
  };

  const handleClick = (id: number) => {
    router.push(`/details/${id}`);
  };

  const handleViewAllClick = (category: string) => {
    router.push(`/category/${category}`);
  };

  return (
    <>
      <div className="flex justify-between items-center p-5">
        <h1 className="text-white font-bold">Music Shows</h1>
        <p className="text-white cursor-pointer" onClick={() => handleViewAllClick('dance')}>
          View All
        </p>
      </div>

      <section className="text-gray-100 body-font">
        <div className="container mx-auto">
          {!loading && events.length > 0 ? (
            <Slider {...settings}>
              {events.map((event) => (
                <div
                  className="p-1 md:p-1 w-full cursor-pointer relative"
                  key={event.id}
                  onClick={() => handleClick(event.id)}
                >
                  <div className="h-44 md:h-full border-2 border-gray-200 border-opacity-10 rounded-lg overflow-hidden">
                    <div className="relative">
                      <img
                        className="h-44 md:h-40 w-full object-cover object-center"
                        src={event.event_image}
                        alt={event.event_name}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                    </div>
                    <div className="absolute bottom-0 w-full text-white p-4 ">
                      <div>
                        <h4 className="text-sm font-medium">{event.event_name}</h4>
                      </div>
                      <div className="flex justify-between">
                        <div className="text-xs font-medium text-gray-400 mt-1">{formatDate(event.start_date)}</div>
                        <button type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-red-300 font-medium rounded-sm text-xs p-1 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Book Tickets</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          ) : (
            <p>Loading events...</p>
          )}
        </div>
      </section>
    </>
  );
}
