'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface Event {
  id: number;
  event_name: string;
  event_image: string;
}

const EventExplorer: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get<Event[]>('http://localhost:3001/allevents');
        if (response.data && response.data.length > 0) {
          setEvents(response.data);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
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
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const handleClick = (eventId: number) => {
    console.log(`Clicked event id: ${eventId}`);
    // Implement your logic for handling click on event
  };

  const handleViewAllClick = (category: string) => {
    console.log(`View all ${category}`);
    // Implement your logic for handling click on "View All"
  };

  return (
    <>
      <div className="flex justify-between items-center p-5">
        <h1 className="text-white font-bold">Explore All Events</h1>
        <p className="text-white cursor-pointer" onClick={() => handleViewAllClick('all')}>
          View All
        </p>
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
};

export default EventExplorer;
