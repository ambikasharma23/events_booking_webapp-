"use client";
import React, { useEffect, useState } from "react";
import TicketQuantity from "@/app/components/ticketquantity";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useParams } from "next/navigation";
import Footer from "@/app/components/footer";
import HomePage from "@/app/components/home/page";

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
  ticket_date: string;
  display_price: number;
}

interface Gallery {
  id: number;
  path: string;
}

const EventDetails = () => {
  const [event, setEvent] = useState<Event | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [ticketsBySession, setTicketsBySession] = useState<{
    [key: number]: Ticket[];
  }>({});
  const [gallery, setGallery] = useState<Gallery[]>([]);
  const [openSessions, setOpenSessions] = useState<number[]>([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:3001/allevents/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch event");
        }
        const data: Event = await response.json();
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
        setSessions(data);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };
    const fetchGallery = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/eventgallery/event/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch Gallery");
        }
        const data: Gallery[] = await response.json();
        setGallery(data);
      } catch (error) {
        console.error("Error fetching Gallery:", error);
      }
    };

    if (id) {
      fetchEvent();
      fetchSessions();
      fetchGallery();
    }
  }, [id]);

  const fetchTickets = async (sessionId: number) => {
    try {
      const response = await fetch(
        `http://localhost:3001/ticket?session_id=${sessionId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch tickets");
      }
      const data: Ticket[] = await response.json();
      setTicketsBySession((prevTicketsBySession) => ({
        ...prevTicketsBySession,
        [sessionId]: data,
      }));
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const handleSessionClick = (sessionId: number) => {
    setOpenSessions((prevOpenSessions) =>
      prevOpenSessions.includes(sessionId)
        ? prevOpenSessions.filter((id) => id !== sessionId)
        : [...prevOpenSessions, sessionId]
    );

    if (!ticketsBySession[sessionId]) {
      fetchTickets(sessionId);
    }
  };

  if (!event) {
    return <div>Loading event...</div>;
  }

  const CustomPrevArrow = (props: any) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} custom-prev-arrow`}
        style={{ ...style, display: "block" }}
        onClick={onClick}
      />
    );
  };

  const CustomNextArrow = (props: any) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} custom-next-arrow`}
        style={{ ...style, display: "block" }}
        onClick={onClick}
      />
    );
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
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
          initialSlide: 1,
        },
      },
    ],
  };

  return (
    <>
    <HomePage />
    
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

          <div className="bg-white rounded-md p-6">
            <div>{event.event_name}</div>
            <div>{event.starting_price}</div>
            <div>{event.start_date}</div>
            <h1 className="items-center text-xl font-extrabold dark:text-white">
              About Event
            </h1>
            <p className="text-sm">{event.event_description}</p>
          </div>
          <div className="bg-white mt-4 rounded-sm">
            <h1 className="items-center text-xl font-extrabold p-6">
              Highlights
            </h1>
            <Slider {...settings}>
              {gallery.map((galleryItem) => (
                <div key={galleryItem.id} className="p-2">
                  <div className="rounded-lg overflow-hidden">
                    <img className="h-36" src={galleryItem.path} alt="Gallery Image" />
                  </div>
                </div>
              ))}
            </Slider>
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
                    {openSessions.includes(session.id)
                      ? "Hide Tickets"
                      : "View Tickets"}
                  </button>

                  {openSessions.includes(session.id) && (
                    <div>
                      <h1 className="items-center text-xl font-extrabold dark:text-white">
                        Tickets
                      </h1>
                      {ticketsBySession[session.id] &&
                      ticketsBySession[session.id].length > 0 ? (
                        ticketsBySession[session.id].map((ticket) => (
                          <div key={ticket.id}>
                            <div className="flex justify-between">
                              <div>{ticket.ticket_name}</div>
                              <div>{ticket.ticket_date}</div>
                            </div>
                            <div className="flex justify-between">
                              ₹{ticket.display_price}
                              <TicketQuantity ticket={ticket} />
                            </div>
                          </div>
                        ))
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
      <Footer />
    </div>
    </>
  );
};

export default EventDetails;
