import { create } from 'zustand';
import type { Booking } from '../types/booking';

type BookingState = {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  removeBooking: (id: string) => void;
  setBookings: (bookings: Booking[]) => void;
};

export const useBookingStore = create<BookingState>((set) => ({
  bookings: [],
  addBooking: (booking) =>
    set((state) => ({ bookings: [...state.bookings, booking] })),
  removeBooking: (id) =>
    set((state) => ({
      bookings: state.bookings.filter((b) => b.id !== id),
    })),
    setBookings: (bookings) => set(() => ({ bookings })),
}));