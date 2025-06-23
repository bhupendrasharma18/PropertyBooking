import React, { useState } from 'react';
import { useLocalSearchParams, Stack } from 'expo-router';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';
import tw from '../../twrnc';
import { useBookingStore } from '../../store/bookingStore';
import BookingModal from '../components/BookingModal';
import PropertyMap from '../components/PropertyMap';

const { width } = Dimensions.get('window');

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

  const { title, location, features, images, price } = property;
  const { coordinates } = location;

  const alreadyBooked = bookings.some(b => b.propertyId.toString() === property.id.toString());

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

    // addBooking({
    //   id: Date.now().toString(),
    //   propertyId: property.id.toString(),
    //   userId: 'user1', // hardcoded or from auth
    //   checkIn: checkIn.toISOString().split('T')[0],
    //   checkOut: checkOut.toISOString().split('T')[0],
    //   status: 'confirmed',
    // });

    setModalVisible(false);
  };

  const ImageCarousel = ({ images }) => (
    <>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={{ width, height: 250 }}
      >
        {images?.map((img, idx) => (
          <Image
            key={idx}
            source={{ uri: img }}
            style={{ width, height: 250 }}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      <View style={tw`flex-row justify-center mt-2`}>
        {images?.map((_, idx) => (
          <View
            key={idx}
            style={[
              tw`w-2 h-2 rounded-full mx-1`,
              { backgroundColor: idx === 0 ? '#4F46E5' : '#D1D5DB' },
            ]}
          />
        ))}
      </View>
    </>
  );

  const PropertyHeader = ({ title, location, price }) => (
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

  const FeaturesList = ({ features }) => (
    <>
      <Text style={tw`text-lg font-bold mt-6 mb-2`}>Features:</Text>
      {features.map((feature, idx) => (
        <Text key={idx} style={tw`text-gray-700 mb-1`}>
          • {feature}
        </Text>
      ))}
    </>
  );

  const BookingButton = ({ alreadyBooked, onPress }) => (
    <TouchableOpacity
      style={tw.style(
        `py-3 rounded-lg mt-4`,
        alreadyBooked ? `bg-gray-400` : `bg-indigo-600`
      )}
      disabled={alreadyBooked}
      onPress={onPress}
    >
      <Text style={tw`text-white text-center text-lg font-semibold`}>
        {alreadyBooked ? 'Already Booked' : 'Book this property'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen options={{ title: 'Property Details', headerShown: true }} />
      <ScrollView style={tw`flex-1 bg-white`}>
        <ImageCarousel images={images} />

        <View style={tw`p-4`}>
          <PropertyHeader title={title} location={location} price={price} />
          <FeaturesList features={features} />
          <PropertyMap coordinates={coordinates} title={title} />
          <BookingButton alreadyBooked={alreadyBooked} onPress={openBookingModal} />
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
    </>
  );
}