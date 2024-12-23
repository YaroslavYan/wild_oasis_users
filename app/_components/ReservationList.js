"use client";

import { useOptimistic } from "react";

import ReservationCard from "./ReservationCard";
import { deleteReservation } from "../_lib/actions";

function ReservationsList({ bookings }) {
  //useOptimistic видалення буде відбуватись моментально для ui а потім для сервера
  const [optimiscitBookings, optimisticDelete] = useOptimistic(
    bookings,
    (curBookings, bookingId) => {
      return curBookings.filter((booking) => booking.id !== bookingId);
    }
  );

  async function handleDelete(bookingId) {
    optimisticDelete(bookingId);
    await deleteReservation(bookingId);
  }

  return (
    <ul className="space-y-6">
      {optimiscitBookings.map((booking) => (
        <ReservationCard
          booking={booking}
          onDelete={handleDelete}
          key={booking.id}
        />
      ))}
    </ul>
  );
}

export default ReservationsList;
