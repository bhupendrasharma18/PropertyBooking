import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';

type Booking = {
  id: string;
  propertyId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  status: 'confirmed' | 'pending' | 'cancelled';
};

export function useProperties() {
  return useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const res = await api.get('/properties');
      return res.data;
    },
  });
}

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await api.get('/profile');
      return res.data;
    },
  });
}

export function useBookings() {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const res = await api.get('/bookings');
      return res.data;
    },
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation<Booking, Error, Booking>({
    mutationFn: async (newBooking: Booking) => {
      const res = await api.post('/bookings', newBooking);
      return res.data;
    },
    onSuccess: () => {
      // queryClient.invalidateQueries(['bookings']);
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}