'use client';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import HomePage from '../../components/home/page';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

const Events = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const { id } = useParams();
    const [categoryIcon, setCategoryIcon] = useState<string | null>(null);
    const [categoryName, setCategoryName] = useState<string>("");

    useEffect(() => {
        if (id) {
            const fetchCategoryAndEvents = async () => {
                try {
                    // Fetch category details to get the icon and name
                    const categoryResponse = await fetch(`http://localhost:3001/getcategory/${id}`);
                    if (!categoryResponse.ok) {
                        throw new Error('Failed to fetch category');
                    }
                    const categoryData = await categoryResponse.json();
                    setCategoryIcon(categoryData.icon);
                    setCategoryName(categoryData.name); // Assuming category name is in `name` field

                    // Fetch events based on category_id
                    const eventsResponse = await fetch(`http://localhost:3001/allevents?category_id=${id}`);
                    if (!eventsResponse.ok) {
                        throw new Error('Failed to fetch events');
                    }
                    const eventData: Event[] = await eventsResponse.json();
                    setEvents(eventData);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };

            fetchCategoryAndEvents();
        }
    }, [id]);

    if (!id) {
        return <div>Loading...</div>;
    }

    const sliderSettings = {
        infinite: true,
        slidesToShow: 4, // Display 4 slides at a time
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: '0',
        focusOnSelect: true,
        speed: 500,
        adaptiveHeight: true,
    };

    return (
        <div>
            <div className="fixed top-0 left-0 right-0 z-50">
                <HomePage />
            </div>

            {categoryIcon && (
                <div className="flex flex-col items-center justify-center mb-50 relative z-10">
                    <div className="w-full md:max-w-full h-40 bg-gradient-to-b from-gray-400 to-black flex items-center justify-center">
                        <span className="text-xl font-bold text-white">{categoryName}</span>
                    </div>
                </div>
            )}

            <div className="mt-20 p-4 flex justify-center">
                <div className="max-w-5xl w-full">
                    {events.length > 0 ? (
                        <Slider {...sliderSettings}>
                            {events.map((event) => (
                                <div key={event.id} className="p-4">
                                    <div className="bg-black rounded-lg shadow-md p-6">
                                        {event.event_image && (
                                            <img src={event.event_image} alt={event.event_name} className="w-full h-full mb-4" />
                                        )}
                                        <h1 className="text-lg text-white font-bold">{event.event_name}</h1>
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
        </div>
    );
};

export default Events;
