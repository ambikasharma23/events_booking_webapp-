"use client";
import React, { useEffect, useState } from "react";
interface MusicCat {
  id: number;
  event_image: string;
  event_name: string;
}
export default function Music() {
  const [events, setEvents] = useState<MusicCat[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await fetch(
          "http://localhost:3001/allevents?event_category=music"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data: MusicCat[] = await response.json();
        console.log(data);
        setEvents(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <h1 className="text-white mx-20 my-1 font-bold p-5">Music Shows</h1>

      <section className="text-gray-100 body-font">
        <div className="container mx-auto">
          <div className="grid grid-cols-5 md:grid-cols-6 gap-4">
            {events.map((events) => (
              <div className="p-1 md:p-4 w-full" key={events.id}>
                <div className="h-full border-2 border-gray-200 border-opacity-10 rounded-lg overflow-hidden">
                  <img
                    className="h-10 md:h-full w-full object-cover object-center"
                    src={events.event_image}
                  />
                </div>
                <h4 className="title-font text-sm font-medium text-gray-900 text-white text-center">
                  {events.event_name}
                </h4>
              </div>
            ))}
            
          </div>
          
        </div>
      </section>
    </>
  );
}
