'use client';

import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRouter } from "next/navigation";
import Tags from "../tags";

interface AllEvents {
  id: number;
  event_image: string;
  event_name: string;
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
  const router = useRouter();

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const fetchData = async (sortOption?: string) => {
    try {
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
            url = "http://localhost:3001/Eventdistance?sort=asc";
            break;
          case "Date":
            url = "http://localhost:3001/eventDate";
            break;
          default:
            break;
        }
      }
      let response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data: AllEvents[] = await response.json();
      console.log(data);
      setEvents(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchEventsByTag = async (tag: string) => {
    try {
      const url = `http://localhost:3001/events-by-tag?tags=${encodeURIComponent(tag)}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data: AllEvents[] = await response.json();
      console.log(data);
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events by tag:", error);
    }
  };

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setShowDropdown(false);
    fetchData(option);
  };

  // Reset selected option and fetch all events
  const resetSelection = () => {
    setSelectedOption(null);
    fetchData(); // Fetch all events
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

  const handleClick = (id: number) => {
    router.push(`/details/${id}`);
  };

  return (
    <>
      <div className="flex justify-between items-center p-5">
        <h1 className="text-white font-bold">Explore All Events</h1>
      </div>

      <div className="mb-8">
        <Tags
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          toggleDropdown={toggleDropdown}
          handleOptionClick={handleOptionClick}
          resetSelection={resetSelection}
          showDropdown={showDropdown}
          handleTagClick={fetchEventsByTag} // Pass fetchEventsByTag function
        />
      </div>

      <section className="text-gray-100 body-font">
        <div className="container mx-auto">
          <Slider {...settings}>
            {events.map((event) => (
              <div
                className="p-1 md:p-1 w-full cursor-pointer"
                key={event.id}
                onClick={() => handleClick(event.id)}
              >
                <div className="relative group h-full border-2 border-gray-200 border-opacity-10 rounded-lg overflow-hidden">
                  <img
                    className="h-28 md:h-40 w-full object-cover object-center"
                    src={event.event_image}
                    alt={event.event_name}
                  />
                  <div className="absolute inset-0 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <CustomPrevArrow />
                    <CustomNextArrow />
                  </div>
                </div>
                <h4 className="title-font text-sm font-medium text-white text-center">
                  {event.event_name}
                </h4>
              </div>
            ))}
          </Slider>
        </div>
      </section>
    </>
  );
}
