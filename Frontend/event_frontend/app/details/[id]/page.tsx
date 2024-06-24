"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Event {
  id: number;
  event_name: string;
  start_date: string;
  event_description: string;
  event_image: string;
  starting_price: number;
}

interface Session {
  id: number;
  event_id: number;
  session: string;
  start_time: number;
  end_time: number;
  new_description: string;
}

interface Ticket {
  id: number;
  session_id: number;
  ticket_name: string;
}

const EventDetails = () => {
  const [event, setEvent] = useState<Event | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(
    null
  );
  const { id } = useParams();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:3001/allevents/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch event");
        }
        const data: Event = await response.json();
        console.log("Event fetched:", data);
        setEvent(data);
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };

    const fetchSessions = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/session/event/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch sessions");
        }
        const data: Session[] = await response.json();
        console.log("Sessions fetched:", data);
        setSessions(data);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    if (id) {
      fetchEvent();
      fetchSessions();
    }
  }, [id]);

  useEffect(() => {
    const fetchTickets = async () => {
      if (selectedSessionId !== null) {
        try {
          const response = await fetch(
            `http://localhost:3001/ticket?session_id=${selectedSessionId}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch tickets");
          }
          const data: Ticket[] = await response.json();
          console.log("Tickets fetched:", data);
          setTickets(data);
        } catch (error) {
          console.error("Error fetching tickets:", error);
          setTickets([]); // Handle error by setting tickets to an empty array
        }
      }
    };

    fetchTickets();
  }, [selectedSessionId]);

  const handleSessionClick = (sessionId: number) => {
    setSelectedSessionId(sessionId);
  };

  if (!event) {
    return <div>Loading event...</div>;
  }

  return (
    <div className="container mx-auto">
      <div className="w-full flex">
        <div className="w-8/12 p-8">
          <div className="rounded-lg h-64 overflow-hidden">
            <img
              alt="Event"
              className="object-cover object-center h-full w-full"
              src={event.event_image}
            />
          </div>
          <div className="text-white">{event.event_name}</div>
          <div className="text-white">{event.starting_price}</div>
          <div className="text-white">{event.start_date}</div>
          <div className="bg-white rounded-md p-6">
            <h1 className="items-center text-xl font-extrabold dark:text-white">
              About Event
            </h1>
            <p className="text-sm">{event.event_description}</p>
          </div>
        </div>
        <div className="w-5/12 p-8">
          <div className="max-w-sm mx-auto bg-white p-8 rounded">
            <h1 className="items-center text-xl font-extrabold dark:text-white">
              Sessions
            </h1>
            <ul className="text-sm text-gray-700 dark:text-white">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="bg-gray-800 p-4 rounded-md my-2 text-white"
                >
                  <div className="flex justify-between">
                    <div>{session.session}</div>
                    <div>
                      {session.start_time} - {session.end_time}
                    </div>
                  </div>
                  <div>{session.new_description}</div>
                  <button
                    onClick={() => handleSessionClick(session.id)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                  >
                    View Tickets
                  </button>

                  {selectedSessionId === session.id && (
                    <div>
                      <h1 className="items-center text-xl font-extrabold dark:text-white">
                        Tickets
                      </h1>
                      {tickets.length > 0 ? (
                        tickets.map((ticket) => <div>{ticket.ticket_name}</div>)
                      ) : (
                        <p>No tickets available for this session.</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
