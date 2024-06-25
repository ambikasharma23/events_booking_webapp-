"use client"
import React, { useState } from "react";

// Define the Ticket interface
interface Ticket {
  id: number;
  session_id: number;
  ticket_name: string;
  ticket_date: string;
  display_price: number;
}

interface TicketQuantityProps {
  ticket: Ticket;
}

const TicketQuantity: React.FC<TicketQuantityProps> = ({ ticket }) => {
  const [quantity, setQuantity] = useState<number | null>(null);

  const increment = () => {
    setQuantity(prevQuantity =>
      prevQuantity === null ? 1 : Math.min(prevQuantity + 1, 10)
    );
  };

  const decrement = () => {
    if (quantity !== null) {
      setQuantity(prevQuantity =>
        prevQuantity && prevQuantity > 1 ? prevQuantity - 1 : null
      );
    }
  };

  return (
    <div className="flex items-center">
      {quantity === null ? (
        <button
          onClick={increment}
          className="bg-green-500 hover:bg-green-700 text-white font-bold px-2 rounded"
        >
          Add
        </button>
      ) : (
        <>
          <button
            onClick={decrement}
            className="bg-red-500 hover:bg-red-700 text-white font-bold px-2 rounded-l"
          >
            -
          </button>
          <span className="mx-2">{quantity}</span>
          <button
            onClick={increment}
            className="bg-green-500 hover:bg-green-700 text-white font-bold px-2 rounded-r"
          >
            +
          </button>
        </>
      )}
    </div>
  );
};

export default TicketQuantity;
