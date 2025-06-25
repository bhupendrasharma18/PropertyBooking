export type Booking = {
  id: string;
  propertyId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  status: 'confirmed' | 'pending' | 'cancelled';
};

export type PropertyProps = {
  id: string;
  title: string;
  location: {
    address: string;
    city: string;
    state: string;
  };
  price: number;
};