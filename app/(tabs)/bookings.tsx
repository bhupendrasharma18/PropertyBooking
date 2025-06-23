
import { View, Text, FlatList, Image } from 'react-native';
import tw from '../../twrnc';
import { useProperties, useBookings } from '../../hooks/useProperties';
import moment from 'moment';

interface BookingListItemProps {
  item: any;
  property: any;
}

export default function BookingsScreen() {
  const { data: bookings, isLoading: loadingBookings, error } = useBookings();
  const { data: properties, isLoading: loadingProperties } = useProperties();

  const getPropertyById = (id: string) =>
    properties?.find(p => p.id.toString() === id);

  const isLoading = loadingBookings || loadingProperties;

  const BookingListItem: React.FC<BookingListItemProps> = ({ item, property }) => {
    const image = property?.images?.[0];

    return (
      <View style={tw`mb-4 bg-white rounded-xl shadow border border-gray-200 overflow-hidden`}>
        {image && (
          <Image source={{ uri: image }} style={tw`w-full h-40`} resizeMode="cover" />
        )}
        <View style={tw`p-4`}>
          <Text style={tw`text-lg font-semibold text-gray-800`}>
            {property?.title ?? 'Property'}
          </Text>

          <Text style={tw`text-sm text-gray-600 mt-1`}>
            {property?.location?.address}, {property?.location?.city}, {property?.location?.state}
          </Text>

          <Text style={tw`text-sm text-gray-700 mt-2`}>
            Check-in:{' '}
            <Text style={tw`font-medium`}>
              {moment(item.checkIn).format('MMMM D, YYYY')}
            </Text>
          </Text>

          <Text style={tw`text-sm text-gray-700`}>
            Check-out:{' '}
            <Text style={tw`font-medium`}>
              {moment(item.checkOut).format('MMMM D, YYYY')}
            </Text>
          </Text>

          <Text style={tw`text-sm text-indigo-600 font-semibold mt-2`}>
            Status: {item.status}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      {isLoading ? (
        <Text style={tw`text-center mt-4 text-gray-600`}>
          Loading bookings...
        </Text>
      ) : error ? (
        <Text style={tw`text-center mt-4 text-red-500`}>
          Failed to load bookings
        </Text>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={tw`px-4 pt-4 pb-8`}
          ListEmptyComponent={
            <Text style={tw`text-center mt-10 text-gray-500`}>
              You haven’t booked any properties yet.
            </Text>
          }
          renderItem={({ item }) => {
            const property = getPropertyById(item.propertyId.toString());
            return <BookingListItem item={item} property={property} />;
          }}
        />
      )}
    </View>
  );
}