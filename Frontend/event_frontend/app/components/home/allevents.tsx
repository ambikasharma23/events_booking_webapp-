"use client";

import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRouter } from "next/navigation";
import Tags from "../tags";
import Link from "next/link";
import { format, parseISO } from "date-fns";

interface AllEvents {
  id: number;
  event_image: string;
  event_name: string;
  start_date: string;
}

const CustomPrevArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-prev-arrow`}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    />
  );
};

const CustomNextArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-next-arrow`}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    />
  );
};

export default function EventExplorer() {
  const [events, setEvents] = useState<AllEvents[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const fetchData = async (sortOption?: string) => {
    try {
      setLoading(true); // Start loading
      let url = "http://localhost:3001/allevents";

      if (sortOption) {
        switch (sortOption) {
          case "Cost: low to high":
            url = "http://localhost:3001/Eventcost?sort=asc";
            break;
          case "Cost: high to low":
            url = "http://localhost:3001/Eventcost?sort=desc";
            break;
          case "Distance: low to high":
            url = "http://localhost:3001/events/sortedByDistance";
            break;
          case "Date":
            url = "http://localhost:3001/eventDate";
            break;
          default:
            break;
        }
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data: AllEvents[] = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  const fetchEventsByTag = async (tag: string) => {
    try {
      setLoading(true); // Start loading
      const url = `http://localhost:3001/events-by-tag?tags=${encodeURIComponent(tag)}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data: AllEvents[] = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events by tag:", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  const fetchEventsUnder10Km = async () => {
    try {
      setLoading(true); // Start loading
      const url = `http://localhost:3001/under10km`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch events under 10 km");
      }
      const data: AllEvents[] = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events under 10 km:", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setShowDropdown(false);
    fetchData(option);
  };

  const resetSelection = () => {
    setSelectedOption(null);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, "do MMMM");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  return (
    <>
      <div className="flex justify-between items-center p-5">
        <h1 className="text-white font-bold">Explore All Events</h1>
      </div>

      <div className="mb-8 px-10">
        <Tags
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          toggleDropdown={toggleDropdown}
          handleOptionClick={handleOptionClick}
          resetSelection={resetSelection}
          showDropdown={showDropdown}
          handleTagClick={fetchEventsByTag}
          handleUnder10KmClick={fetchEventsUnder10Km}
        />
      </div>

      <section className="text-gray-100 body-font">
        <div className="container mx-auto">
          {!loading && events.length > 0 ? (
            <Slider {...settings}>
              {events.map((event) => (
                <div className="p-1 md:p-1 w-full cursor-pointer relative" key={event.id}>
                  <Link href={`/details/${event.id}`} passHref>
                    <div className="p-1 md:p-1 w-full cursor-pointer relative">
                      <div className="h-44 md:h-full border-2 border-gray-200 border-opacity-10 rounded-lg overflow-hidden">
                        <div className="relative">
                          <img
                            className="h-44 md:h-40 w-full object-cover object-center"
                            src={event.event_image}
                            alt={event.event_name}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                        </div>
                        <div className="absolute bottom-0 w-full text-white p-4">
                          <div>
                            <h4 className="text-sm font-medium">{event.event_name}</h4>
                          </div>
                          <div className="flex justify-between">
                            <div className="text-xs font-medium text-gray-400 mt-1">
                              {formatDate(event.start_date)}
                            </div>
                            <button
                              type="button"
                              className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-red-300 font-medium rounded-sm text-xs p-1 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                            >
                              Book Tickets
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
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
