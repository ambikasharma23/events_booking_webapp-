"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import HomePage from "../../components/home/page";
import { format } from 'date-fns';
import Footer from "@/app/components/footer";

interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  description: string;
  icon: string;
  event_image: string;
  event_name: string;
  start_date: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, "do MMMM");
};

const Events = () => {
  const [loading, setLoading] = useState(true); // Add a loading state
  const [events, setEvents] = useState<Event[]>([]);
  const { id } = useParams();
  const router = useRouter();
  const [categoryIcon, setCategoryIcon] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState<string>("");

  useEffect(() => {
    if (id) {
      const fetchCategoryAndEvents = async () => {
        try {
          // Fetch category details to get the icon and name
          const categoryResponse = await fetch(
            `http://localhost:3001/getcategory/${id}`
          );
          if (!categoryResponse.ok) {
            throw new Error("Failed to fetch category");
          }
          const categoryData = await categoryResponse.json();
          setCategoryIcon(categoryData.icon);
          setCategoryName(categoryData.name); // Assuming category name is in `name` field

          // Fetch events based on category_id
          const eventsResponse = await fetch(
            `http://localhost:3001/allevents?category_id=${id}`
          );
          if (!eventsResponse.ok) {
            throw new Error("Failed to fetch events");
          }
          const eventData: Event[] = await eventsResponse.json();
          setEvents(eventData);
          setLoading(false); // Set loading to false once data is fetched
        } catch (error) {
          console.error("Error fetching data:", error);
          setLoading(false); // Set loading to false even if there's an error
        }
      };

      fetchCategoryAndEvents();
    }
  }, [id]);

  if (!id) {
    return <div>Loading...</div>;
  }

  const handleEventClick = (eventId: number) => {
    router.push(`/details/${eventId}`);
  };

  const handleClick = (id: number) => {
    router.push(`/details/${id}`);
  };

  return (
    <>
      <div>
        <div className="fixed top-0 left-0 right-0 z-50">
          <HomePage />
        </div>

        {categoryIcon && (
          <div className="flex flex-col items-center justify-center mb-50 relative z-10">
            <div className="w-full md:max-w-full h-40 bg-gradient-to-b flex items-center justify-center">
              <span className="text-xl font-bold text-white">{categoryName}</span>
            </div>
          </div>
        )}

        <section className="text-gray-100 body-font">
          <div className="container mx-auto">
            {!loading && events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {events.map((event) => (
                  <div
                    className="p-1 md:p-1 w-full cursor-pointer relative"
                    key={event.id}
                    onClick={() => handleClick(event.id)}
                  >
                    <div className="h-44 md:h-full border-2 border-gray-200 border-opacity-10 rounded-lg overflow-hidden">
                      <div className="relative">
                        <img
                          className="h-44 md:h-40 w-full object-cover object-center"
                          src={event.event_image}
                          alt={event.event_name}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                      </div>
                      <div className="absolute bottom-0 w-full text-white p-4 ">
                        <div>
                          <h4 className="text-sm font-medium">{event.event_name}</h4>
                        </div>
                        <div className="flex justify-between">
                          <div className="text-xs font-medium text-gray-400 mt-1">{formatDate(event.start_date)}</div>
                          <button type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-red-300 font-medium rounded-sm text-xs p-1 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Book Tickets</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>Loading events...</p>
            )}
          </div>
        </section>
      </div>
      <Footer/>

    </>
  );
};

export default Events;
