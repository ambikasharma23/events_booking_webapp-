"use client"
import React, { useEffect, useState } from "react";
import TicketQuantity from "@/app/components/ticketquantity";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useParams } from "next/navigation";
import Footer from "@/app/components/footer";
import HomePage from "@/app/components/home/page";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';

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
      <div className="container mx-auto  pt-12">
        <div className="w-full flex flex-col lg:flex-row">
          <div className="w-full lg:w-8/12 md:p-8 md:mt-1 mt-12" >
            <div className="rounded-lg h-64 overflow-hidden">
              <img
                alt="Event"
                className="object-cover object-center h-full w-full"
                src={event.event_image}
              />
            </div>

            <div className="bg-white rounded-md p-3 md:p-6">
              <div className="font-extrabold flex justify-between">{event.event_name}
              <div className="text-rose-600	">₹{event.starting_price} Onwards</div>

              </div>
              <div className="text-sm">
              <FontAwesomeIcon icon={faCalendar}/> {event.start_date}</div>
              <h1 className="items-center text-xl font-extrabold dark:text-white mt-4">
                About Event
              </h1>
              <p className="text-sm bg-zinc-100	p-3">{event.event_description}</p>
            </div>
            <div className="bg-white mt-4 rounded-sm">
  <h1 className="items-center text-xl font-extrabold p-6">Highlights</h1>
  {gallery.length > 0 ? (
    <Slider {...settings}>
      {gallery.map((galleryItem) => (
        <div key={galleryItem.id} className="p-2 mb-4">
          <div className="rounded-lg overflow-hidden">
            <img
              className="w-full h-48 md:h-36"
              src={galleryItem.path}
              alt="Gallery Image"
            />
          </div>
        </div>
      ))}
    </Slider>
  ) : (
    <p className="text-center p-6">No highlights available.</p>
  )}
</div>

          </div>
          <div className="w-full lg:w-5/12 pt-8">
            <div className="max-w-sm mx-auto bg-white p-2 rounded">
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
                    <div className="text-yellow-500 font-bold">{session.session}</div>
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
                     
                      {ticketsBySession[session.id] &&
                      ticketsBySession[session.id].length > 0 ? (
                        ticketsBySession[session.id].map((ticket) => (
                          <div key={ticket.id}>
                            <div className="py-2">
                            <div className="flex justify-between">
                              <div className="text-orange-400 font-bold">{ticket.ticket_name}</div>
                              <div>{ticket.ticket_date}</div>
                              </div>
                            <div className="flex justify-between">
                             Valid for 1 person | ₹{ticket.display_price}
                              <TicketQuantity ticket={ticket} />
                            </div>
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
              <form>
              <div className="grid gap-6 mb-6 md:grid-cols-2">
              <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
            <input type="text" id="company" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter Your Name" required />
        </div>
        <div>
            <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone number</label>
            <input type="tel" id="phone" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="123-45-678" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" required />
        </div>
                </div>
                </form>
            </ul>
          </div>
          <div className="bg-red-600 text-white rounded-sm p-4 mt-1 text-center mx-2">Book Now</div>        </div>
      </div>
      <Footer />
    </div>
    </>
  );
};

export default EventDetails;
