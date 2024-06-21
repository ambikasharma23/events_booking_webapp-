"use client";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface MusicCat {
  id: number;
  event_image: string;
  event_name: string;
}

export default function Music() {
  const [events, setEvents] = useState<MusicCat[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await fetch(
          "http://localhost:3001/allevents?event_category=music"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data: MusicCat[] = await response.json();
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
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <>
      <h1 className="text-white mx-2 my-1 font-bold p-5">Music Shows</h1>

      <section className="text-gray-100 body-font">
        <div className="container mx-auto">

          <Slider {...settings}>

            {events.map((event) => (
              <div className="p-1 md:p-1 w-full" key={event.id}>
                <div className="h-30 md:h-full border-2 border-gray-200 border-opacity-10 rounded-lg overflow-hidden">
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
