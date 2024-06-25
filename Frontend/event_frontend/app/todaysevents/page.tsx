'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import HomePage from '../components/home/page';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Footer from '../components/footer';

interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  description: string;
  icon: string;
  event_image: string;
  event_name: string;
}

const TodayEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await fetch('http://localhost:3001/allevents/todayEvent');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data: Event[] = await response.json();
        console.log('Fetched events:', data); // Debugging line
        setEvents(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const sliderSettings = {
    infinite: true,
    slidesToShow: 4, // Display 4 slides at a time
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '0',
    focusOnSelect: true,
    speed: 500,
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
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

  const handleEventClick = (eventId: number) => {
    router.push(`/details/${eventId}`);
  };

  return (
    <div>
      <div className="fixed top-0 left-0 right-0 z-50">
        <HomePage />
      </div>


      <div className="flex flex-col items-center justify-center mb-50 relative z-10">
          <div className="w-full md:max-w-full h-40 bg-gradient-to-b from-gray-400 to-black flex items-center justify-center">
            <span className="text-xl font-bold text-white">Today Events</span>
          </div>
        </div>

      <div className="mt-20 p-4 flex justify-center">
        <div className="max-w-5xl w-full">
          {events.length > 0 ? (
            <Slider {...sliderSettings}>
              {events.map((event) => (
                <div key={event.id} onClick={() => handleEventClick(event.id)} className="cursor-pointer">
                  <div className="bg-black rounded-lg shadow-md p-6">
                    {event.event_image && (
                      <img
                        src={event.event_image}
                        alt={event.event_name}
                        className="w-full h-auto md:h-36 mb-4"
                      />
                    )}
                    <h1 className="text-lg text-white font-bold">
                      {event.event_name}
                    </h1>
                    <p className="text-gray-400">{event.date}</p>
                    <p className="text-gray-400">{event.location}</p>
                    <p className="text-gray-400">{event.description}</p>
                  </div>
                </div>
              ))}
            </Slider>
          ) : (
            <div className="text-center">No events found</div>
          )}
        </div>
      </div>
      <Footer />
    </div>
    
  );
};

export default TodayEvents;
