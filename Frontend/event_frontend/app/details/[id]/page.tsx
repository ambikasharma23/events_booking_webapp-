'use client';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface Event {
  id: number;
  event_name: string;
  start_date: string;
  event_description: string;
}

const EventDetails = () => {
  const [event, setEvent] = useState<Event | null>(null);
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:3001/allevents/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch event');
        }
        const data: Event = await response.json();
        console.log('Fetched data:', data);
        setEvent(data);
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };

    fetchEvent();
  }, [id]);

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-white mx-20 font-bold">Event Details</h1>
      <div className="p-4 border border-gray-200 rounded-lg">
        <h2 className="text-lg font-bold text-gray-900">{event.event_name}</h2>
        <p className="text-gray-600">{event.start_date}</p>
        <p className="text-gray-600">{event.event_description}</p>
      </div>
    </div>
  );
};

export default EventDetails;
