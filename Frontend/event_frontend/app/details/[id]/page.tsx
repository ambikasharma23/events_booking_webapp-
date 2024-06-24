"use client";
import HomePage from "@/app/components/home/page";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

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
interface Ticket{
  id: number;
  ticket_name:string;
}

const EventDetails = () => {
  const [event, setEvent] = useState<Event | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [tickets, setTicket] = useState<Ticket[]>([]);

  const { id } = useParams();

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:3001/allevents/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch event");
        }
        const data: Event = await response.json();
        console.log("Fetched event data:", data);
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
        console.log("Fetched sessions data:", data);
        setSessions(data);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };
    const fetchTickets = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/ticket?session_id={sessionId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch sessions");
        }
        const data: Ticket[] = await response.json();
        console.log("Fetched ticket data:", data);
        setTicket(data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchEvent();
    fetchSessions();
    fetchTickets();
  }, [id]);

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <>
    {/* <div className="bg-white">
    <HomePage/>
    </div> */}
    <div className="container mx-auto">
      <div className="w-full flex">
        <div className="w-8/12 p-8">
          <div className="rounded-lg h-64 overflow-hidden">
            <img
              alt="content"
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

            <p className="text-sm ">{event.event_description}</p>
            
          </div>
        </div>
        <div className="w-5/12 p-8">
          <form className="max-w-sm mx-auto bg-white p-8 rounded">
          <h1 className="items-center text-xl font-extrabold dark:text-white">
              Sessions
            </h1>
            <ul className="text-sm text-gray-700 dark:text-white">
              {sessions.map((session) => (
                <div key={session.id} className=" bg-gray-800 p-4 rounded-md my-2 text-white">
                  <div className="flex justify-between">
                  <div>{session.session}</div>
                  <div>
                    {session.start_time} - {session.end_time}
                  </div>
                  </div>
                  <div>
                    {session.new_description}
                    <h1 className="items-center text-xl font-extrabold dark:text-white">
              Tickets
            </h1>
            {tickets.map((tickets) => (
              <div>{tickets.ticket_name}</div>

              
            ))}
                  </div>
                  
                </div>
              ))}
            </ul>
            
          </form>
        </div>
      </div>
    </div>
    </>
  );
};


export default EventDetails;
