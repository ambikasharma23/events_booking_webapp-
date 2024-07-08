"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import HomePage from "../components/home/page";

interface BookingDetails {
  id: number;
  name: string;
  contact: number;
  ticket_id: number;
  no_of_persons: number;
  // Add other booking details if necessary
}

const ConfirmPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookings, setBookings] = useState<BookingDetails[]>([]);
  const searchParams = useSearchParams() ;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingIdsParam = searchParams.get("bookingIds");
        if (!bookingIdsParam) {
          throw new Error("No booking IDs found in query parameters.");
        }
        const ids = JSON.parse(bookingIdsParam as string);

        const bookingPromises = ids.map(async (id: number) => {
          const response = await fetch(
            `http://localhost:3001/booking/id/${id}`
          );
          if (!response.ok) {
            throw new Error(`Failed to fetch booking with ID ${id}`);
          }
          return response.json();
        });
        const results = await Promise.all(bookingPromises);
        const bookingsData = results.map((result) => result.booking);
        setBookings(bookingsData);
      } catch (error) {
        setError(`Error fetching booking details`);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [searchParams]);

  if (loading) {
    return <div>Loading booking details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <HomePage />
      <div className="container mx-auto pt-12">
        <div className="container mx-auto flex justify-center items-center pt-12 h-9">
          <img
            className="h-12"
            src="https://cdn-icons-png.freepik.com/256/14025/14025690.png"
          />
        </div>
        <div className="container mx-auto pt-12 flex justify-center bg-white w-2/5">
          {bookings.map((booking) => (
            <div key={booking.id} className="mb-4">
              <div>
                <h2 className="font-bold text-lg text-center">Thank You for Booking with Us!!</h2>
                <h3 className="text-sm text-center">You booking is confirmed</h3>
                <p className="text-sm text-center ">Booking Id: {booking.id}</p>

                <h2 className="text-sm font-bold pt-3">Booking Details</h2>
                <div className="text-sm">
                <p>Name: {booking.name}</p>
                <p>Contact: {booking.contact}</p>


                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ConfirmPage;
