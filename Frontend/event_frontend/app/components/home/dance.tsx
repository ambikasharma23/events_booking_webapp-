"use client";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRouter } from "next/navigation";

interface DanceCat {
  id: number;
  event_image: string;
  event_name: string;
}

export default function Dance() {
  const [events, setEvents] = useState<DanceCat[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await fetch(
          "http://localhost:3001/allevents?event_category=dance"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data: DanceCat[] = await response.json();
        console.log(data);
        setEvents(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 2,
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
          slidesToScroll: 2,
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
        <h1 className="text-white font-bold">Dance Shows</h1>
        <p className="text-white cursor-pointer">View All</p>
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
                <div className="h-full border-2 border-gray-200 border-opacity-10 rounded-lg overflow-hidden">
                  <img
                    className="h-28 md:h-40 w-full object-cover object-center"
                    src={event.event_image}
                    alt={event.event_name}
                  />
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
