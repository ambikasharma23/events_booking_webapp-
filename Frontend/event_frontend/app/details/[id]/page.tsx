"use client";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useParams, useRouter } from "next/navigation";
import Footer from "@/app/components/footer";
import HomePage from "@/app/components/home/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";

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
  const [errorMessage, setErrorMessage] = useState("");
  const [event, setEvent] = useState<Event | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [ticketsBySession, setTicketsBySession] = useState<{
    [key: number]: Ticket[];
  }>({});
  const [gallery, setGallery] = useState<Gallery[]>([]);
  const [openSessions, setOpenSessions] = useState<number[]>([]);
  const [bookingInfo, setBookingInfo] = useState({
    name: "",
    phoneNumber: "",
    ticketId: -1,
    numberOfPersons: 0,
  });
  const [ticketQuantities, setTicketQuantities] = useState<{
    [key: number]: number;
  }>({});
  const { id } = useParams();
  const router = useRouter();

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBookingInfo((prevBookingInfo) => ({
      ...prevBookingInfo,
      [name]: value,
    }));
  };

  const handleQuantityChange = (ticketId: number, quantity: number) => {
    if (quantity < 0) {
      // Prevent decrementing below 0
      quantity = 0;
    }
    setTicketQuantities((prevTicketQuantities) => ({
      ...prevTicketQuantities,
      [ticketId]: quantity,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const selectedTickets = Object.keys(ticketQuantities).filter(
        (ticketId) => ticketQuantities[parseInt(ticketId, 10)] > 0
      );
      if (!selectedTickets || selectedTickets.length === 0) {
        setErrorMessage("Please select at least one ticket.");
        console.log(
          "No tickets selected or selectedTickets is null/undefined."
        );
        return;
      }

      const bookingPromises = selectedTickets.map(async (ticketIdStr) => {
        const ticketId = parseInt(ticketIdStr, 10);
        const response = await fetch("http://localhost:3001/booking/insert", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: bookingInfo.name,
            contact: bookingInfo.phoneNumber,
            ticket_id: ticketId,
            no_of_persons: ticketQuantities[ticketId] || 1,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to submit booking for ticket ID ${ticketId}`);
        }

        return await response.json();
      });

      const results = await Promise.all(bookingPromises);

      // Reset bookingInfo and ticketQuantities state after successful submission
      setBookingInfo({
        name: "",
        phoneNumber: "",
        ticketId: -1,
        numberOfPersons: 0,
      });
      setTicketQuantities({});
      setErrorMessage(""); // Clear any previous error message here

      router.push("/confirm");
    } catch (error) {
      console.error("Error submitting booking:", error);
      alert("Error submitting booking. Please try again.");
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
      <div className="container mx-auto pt-12">
        <div className="w-full flex flex-col lg:flex-row">
          <div className="w-full lg:w-8/12 md:p-8 md:mt-1 mt-12">
            <div className="rounded-lg h-64 overflow-hidden">
              <img
                alt="Event"
                className="object-cover object-center h-full w-full"
                src={event.event_image}
              />
            </div>

            <div className="bg-white rounded-md p-3 md:p-6">
              <div className="font-extrabold flex justify-between">
                {event.event_name}
                <div className="text-rose-600">
                  ₹{event.starting_price} Onwards
                </div>
              </div>
              <div className="text-sm">
                <FontAwesomeIcon icon={faCalendar} /> {event.start_date}
              </div>
              <h1 className="items-center text-xl font-extrabold dark:text-white mt-4">
                About Event
              </h1>
              <p className="text-sm bg-zinc-100 p-3">
                {event.event_description}
              </p>
            </div>
            <div className="bg-white mt-4 rounded-sm">
              <h1 className="items-center text-xl font-extrabold p-6">
                Highlights
              </h1>
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
                      <div className="text-yellow-500 font-bold">
                        {session.session}
                      </div>
                      <div>
                        {session.start_time}-{session.end_time}
                      </div>
                    </div>
                    {session.new_description}
                    <div>
                      <button
                        className="bg-sky-500	 text-white font-bold py-2 px-4 rounded mt-2 mb-2"
                        onClick={() => handleSessionClick(session.id)}
                      >
                        {openSessions.includes(session.id)
                          ? "Hide Tickets"
                          : "View Tickets"}
                      </button>
                    </div>
                    {openSessions.includes(session.id) && (
                      <div>
                        {ticketsBySession[session.id]?.map((ticket) => (
                          <div key={ticket.id} className="mb-4">
                            <div>
                              <div className="flex justify-between mb-1">
                                <div className="font-bold text-orange-500">
                                  {ticket.ticket_name}
                                </div>
                                <div>
                                  {new Date(
                                    ticket.ticket_date
                                  ).toLocaleDateString()}
                                </div>
                              </div>
                              <div className="flex justify-between">
                                <div className="text-white">
                                  Valid for 1 person | ₹{ticket.display_price}
                                </div>
                                <div className="flex items-center space-x-4">
                                  <button
                                    className="text-xs text-white focus:outline-none bg-green-600 px-1 py-1 "
                                    onClick={() =>
                                      handleQuantityChange(
                                        ticket.id,
                                        Math.max(
                                          0,
                                          ticketQuantities[ticket.id] - 1
                                        )
                                      )
                                    }
                                  >
                                    -
                                  </button>
                                  <span className="text-xs text-white">
                                    {ticketQuantities[ticket.id] || "Add"}
                                  </span>
                                  <button
                                    className="text-xs text-white focus:outline-none bg-rose-600 px-1 py-1 "
                                    onClick={() =>
                                      handleQuantityChange(
                                        ticket.id,
                                        (ticketQuantities[ticket.id] || 0) + 1
                                      )
                                    }
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </ul>
            </div>
            <div className="max-w-sm mx-auto mt-6 bg-white p-2 rounded">
              <h1 className="items-center text-xl font-extrabold dark:text-white">
                Enter Details
              </h1>
              <form onSubmit={handleSubmit} className="mt-4">
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={bookingInfo.name}
                      onChange={handleInputChange}
                      placeholder="Enter Your Name"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={bookingInfo.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="123-456-789"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                {errorMessage && (
                  <div className="text-red-600 font-bold ">{errorMessage}</div>
                )}

                <button
                  type="submit"
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded mt-4 w-full"
                >
                  Book Now
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EventDetails;
