'use client';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface Event {
    id: number;
    name: string;
    date: string;
    location: string;
    description: string;
}

const Events = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const { id } = useParams();

    useEffect(() => {
        if (!id) return;

        const fetchEvents = async () => {
            try {
                const response = await fetch(`http://localhost:3001/allevents?category_id=${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch events');
                }
                const data: Event[] = await response.json();
                setEvents(data);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, [id]);

    return (
        <div className="container mx-auto">
            <h1 className="text-white mx-20 font-bold">Events for Category {id}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {events.map(event => (
                    <div key={event.id} className="p-4 border border-gray-200 rounded-lg">
                        <h2 className="text-lg font-bold text-gray-900">{event.name}</h2>
                        <p className="text-gray-600">{event.date}</p>
                        <p className="text-gray-600">{event.location}</p>
                        <p className="text-gray-600">{event.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Events;
