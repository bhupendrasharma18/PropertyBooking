import React, { useState } from 'react';
import { useLocalSearchParams, Stack } from 'expo-router';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../api/client';
import tw from '../../twrnc';
import { useBookingStore } from '../../store/bookingStore';
import BookingModal from '../components/BookingModal';
import PropertyMap from '../components/PropertyMap';
import ImageCarousel from '../components/ImageCarousel';
import { useCreateBooking } from '../../hooks/useProperties';
import type { Booking, PropertyProps } from '../../types/booking';

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams();
  const { data: property, isLoading, error } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const res = await api.get(`/properties/${id}`);
      return res.data;
    },
  });

  const bookings = useBookingStore(s => s.bookings);
  const addBooking = useBookingStore(s => s.addBooking);

  const queryClient = useQueryClient();
  const { mutate: createBooking } = useCreateBooking();

  // Modal and date picker states
  const [modalVisible, setModalVisible] = useState(false);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [pickerMode, setPickerMode] = useState<'checkin' | 'checkout' | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (isLoading)
    return <Text style={tw`mt-4 text-center text-gray-600`}>Loading property details...</Text>;
  if (error || !property)
    return <Text style={tw`mt-4 text-center text-red-500`}>Property not found</Text>;

  const { title, location, features, images, price, id: propertyId } = property;
  const { coordinates } = location;

  // Open modal and start with check-in picker
  const openBookingModal = () => {
    setErrorMsg('');
    setCheckIn(null);
    setCheckOut(null);
    setPickerMode(null);
    setShowPicker(false);
    setModalVisible(true);
  };

  // Confirm booking action
  const confirmBooking = () => {
    if (!checkIn || !checkOut) {
      setErrorMsg('Please select both check-in and check-out dates');
      return;
    }

    const hasConflict = bookings.some(
      (b) =>
        b.propertyId.toString() === property.id.toString() &&
        new Date(checkIn) <= new Date(b.checkOut) &&
        new Date(checkOut) >= new Date(b.checkIn)
    );

    if (hasConflict) {
      setErrorMsg('Selected dates overlap with an existing booking.');
      return;
    }

    const newBooking: Booking = {
      id: Date.now().toString(), // optimistic ID
      propertyId: property.id.toString(),
      userId: 'user1', // hardcoded or from auth
      checkIn: checkIn.toISOString().split('T')[0],
      checkOut: checkOut.toISOString().split('T')[0],
      status: 'confirmed',
    };

    console.log('newBooking==>', newBooking);
    
    // Optimistically update local Zustand store
    addBooking(newBooking);

    // Call the mutation to persist it on the server
    createBooking(newBooking, {
      onError: (error) => {
        console.error('Booking failed', error);
      },
      onSuccess: () => {
        console.log('Booking synced with server');
        queryClient.invalidateQueries({ queryKey: ['bookings'] });
      },
    });

    setModalVisible(false);
  };

  const PropertyHeader = ({ title, location, price }: PropertyProps) => (
    <>
      <Text style={tw`text-2xl font-bold text-gray-900`}>{title}</Text>
      <Text style={tw`text-gray-600 mt-1`}>
        {location.address}, {location.city}, {location.state}
      </Text>
      <Text style={tw`text-xl text-indigo-600 font-semibold mt-2`}>
        ${price.toLocaleString()} / month
      </Text>
    </>
  );

  const FeaturesList = ({ features }: { features: string[] }) => (
    <>
      <Text style={tw`text-lg font-bold mt-6 mb-2`}>Features:</Text>
      {features.map((feature, idx) => (
        <Text key={idx} style={tw`text-gray-700 mb-1`}>
          • {feature}
        </Text>
      ))}
    </>
  );

  const BookingButton = ({ onPress }: { onPress: () => void; }) => (
    <TouchableOpacity
      style={tw.style(
        `py-3 rounded-lg mt-4`,
        `bg-indigo-600`
      )}
      onPress={onPress}
    >
      <Text style={tw`text-white text-center text-lg font-semibold`}>
        {'Book this property'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1, backgroundColor: 'white' }}>
      <Stack.Screen options={{ title: 'Property Details', headerShown: true }} />
      <ScrollView style={tw`flex-1 bg-white`}>
        <ImageCarousel images={images} height={250} />

        <View style={tw`p-4`}>
          <PropertyHeader title={title} location={location} price={price} id={propertyId} />
          <FeaturesList features={features} />
          <PropertyMap coordinates={coordinates} title={title} />
          <BookingButton onPress={openBookingModal} />
        </View>
      </ScrollView>

      <BookingModal
        modalState={{
          modalVisible,
          setModalVisible,
          checkIn,
          checkOut,
          showPicker,
          pickerMode,
          errorMsg,
          setPickerMode,
          setShowPicker,
          setCheckIn,
          setCheckOut,
          setErrorMsg,
        }}
        bookingActions={{
          confirmBooking,
        }}
      />
    </SafeAreaView>
  );
}