import { create } from 'zustand';

type Booking = {
  id: number;
  propertyId: number;
  date: string;
};

type BookingState = {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  removeBooking: (id: number) => void;
};

export const useBookingStore = create<BookingState>((set) => ({
  bookings: [],
  addBooking: (booking) =>
    set((state) => ({ bookings: [...state.bookings, booking] })),
  removeBooking: (id) =>
    set((state) => ({
      bookings: state.bookings.filter((b) => b.id !== id),
    })),
}));