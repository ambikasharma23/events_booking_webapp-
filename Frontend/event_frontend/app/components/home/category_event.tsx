'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface CategoryEventProps {
    categoryId: number;
}

const CategoryEvent: React.FC<CategoryEventProps> = ({ categoryId }) => {
    const [events, setEvents] = useState<any[]>([]);
    const router = useRouter();
    

    useEffect(() => {
        const fetchEvents = async () => {
            if (categoryId !== null) {
                try {
                    let response = await fetch(`http://localhost:3001/allevents?category_id=${categoryId}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch events');
                    }
                    let data = await response.json();
                    setEvents(data); 
                } catch (error) {
                    console.error('Error fetching events:', error);
                }
            }
        };

        fetchEvents();
    }, [categoryId]); 

    return (
        <section className="text-gray-100 body-font">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {events.map((event) => (
                        <div className="p-4" key={event.id}>
                            <div className="h-full border-2 border-gray-200 border-opacity-10 rounded-lg overflow-hidden">
                                <img
                                    className="h-40 w-full object-cover object-center"
                                    src={event.image}
                                    alt={`Event ${event.name}`}
                                />
                                <div className="p-6">
                                    <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
                                        {event.category_name}
                                    </h2>
                                    <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                                        {event.name}
                                    </h1>
                                    <p className="leading-relaxed mb-3">{event.description}</p>
                                    <div className="flex items-center flex-wrap">
                                        <a className="text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0">
                                            Learn More
                                        </a>
                                        <span className="text-gray-400 mr-2 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-sm py-1">
                                            <svg
                                                className="w-4 h-4 mr-1"
                                                stroke="currentColor"
                                                fill="none"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M5 12h14M12 5l7 7-7 7"></path>
                                            </svg>
                                            {event.date}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryEvent;
