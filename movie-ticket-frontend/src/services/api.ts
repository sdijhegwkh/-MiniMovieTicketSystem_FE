import type { Booking } from "../types";

let bookings: Booking[] = [];

export const api = {
  // LOGIN
  login: async (email: string, password: string) => {
    console.log("API LOGIN", { email, password });

    return new Promise((resolve) =>
      setTimeout(() => resolve({ success: true }), 500)
    );
  },

  // REGISTER
  register: async (email: string, password: string) => {
    console.log("EVENT: USER_REGISTERED", { email });

    return new Promise((resolve) =>
      setTimeout(() => resolve({ success: true }), 500)
    );
  },

  // CREATE BOOKING
  createBooking: async (movieId: number, seats: number): Promise<Booking> => {
    const booking: Booking = {
      id: Date.now(),
      movieId,
      seats,
      status: "PENDING",
    };

    bookings.push(booking);

    console.log("EVENT: BOOKING_CREATED", booking);

    // giả lập async payment (event-driven)
    setTimeout(() => {
      const success = Math.random() > 0.5;

      const updated = bookings.find((b) => b.id === booking.id);
      if (updated) {
        updated.status = success ? "SUCCESS" : "FAILED";

        console.log(
          success
            ? "EVENT: PAYMENT_COMPLETED"
            : "EVENT: BOOKING_FAILED",
          updated
        );
      }
    }, 2000);

    return booking;
  },

  // GET BOOKINGS
  getBookings: async (): Promise<Booking[]> => {
    return new Promise((resolve) =>
      setTimeout(() => resolve(bookings), 300)
    );
  },
};