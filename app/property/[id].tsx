
import { useLocalSearchParams, Stack } from 'expo-router';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';
import tw from '../../twrnc';
import { useBookingStore } from '../../store/bookingStore';
import MapView, { Marker } from 'react-native-maps';
import { useRef, useState } from 'react';

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
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    setActiveIndex(index);
  };

  if (isLoading)
    return <Text style={tw`mt-4 text-center text-gray-600`}>Loading property details...</Text>;
  if (error || !property)
    return <Text style={tw`mt-4 text-center text-red-500`}>Property not found</Text>;

  const { title, location, features, images, price } = property;
  const { coordinates } = location;

  const alreadyBooked = bookings.some(
    b => b.propertyId.toString() === property.id.toString()
  );

  const handleBooking = () => {
    if (alreadyBooked) return;
    addBooking({
      id: Date.now(),
      propertyId: property.id,
      date: new Date().toISOString(),
    });
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Property Details', headerShown: true }} />
      <ScrollView style={tw`flex-1 bg-white`}>
        {/* Image carousel with pagination */}
        <View>
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
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

          {/* Pagination dots */}
          <View style={tw`flex-row justify-center mt-2`}>
            {images?.map((_, idx) => (
              <View
                key={idx}
                style={[
                  tw`w-2 h-2 rounded-full mx-1`,
                  {
                    backgroundColor: idx === activeIndex ? '#4F46E5' : '#D1D5DB',
                  },
                ]}
              />
            ))}
          </View>
        </View>

        {/* Info container */}
        <View style={tw`p-4`}>
          <Text style={tw`text-2xl font-bold text-gray-900`}>{title}</Text>
          <Text style={tw`text-gray-600 mt-1`}>
            {location.address}, {location.city}, {location.state}
          </Text>

          <Text style={tw`text-xl text-indigo-600 font-semibold mt-2`}>
            ${price.toLocaleString()} / month
          </Text>

          {/* Features */}
          <Text style={tw`text-lg font-bold mt-6 mb-2`}>Features:</Text>
          {features.map((feature, idx) => (
            <Text key={idx} style={tw`text-gray-700 mb-1`}>• {feature}</Text>
          ))}

          {/* Map */}
          <Text style={tw`text-lg font-bold mt-6 mb-2`}>Location</Text>
          <View style={tw`overflow-hidden rounded-lg mb-4`}>
            <MapView
              style={{ width: '100%', height: 200 }}
              initialRegion={{
                latitude: coordinates.latitude,
                longitude: coordinates.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude: coordinates.latitude,
                  longitude: coordinates.longitude,
                }}
                title={title}
              />
            </MapView>
          </View>

          {/* Booking button */}
          <TouchableOpacity
            style={tw.style(
              `py-3 rounded-lg mt-4`,
              alreadyBooked ? `bg-gray-400` : `bg-indigo-600`
            )}
            disabled={alreadyBooked}
            onPress={handleBooking}
          >
            <Text style={tw`text-white text-center text-lg font-semibold`}>
              {alreadyBooked ? 'Already Booked' : 'Book this property'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}