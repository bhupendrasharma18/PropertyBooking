import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import tw from '../../twrnc';
import { useProfile } from '../../hooks/useProperties';

export default function ProfileScreen() {
  const { data: user, isLoading, error } = useProfile();

  if (isLoading) {
    return (
      <View style={tw.style('flex-1 justify-center items-center bg-white')}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={tw`mt-2 text-gray-600`}>Loading profile...</Text>
      </View>
    );
  }

  if (error || !user) {
    return (
      <View style={tw.style('flex-1 justify-center items-center bg-white')}>
        <Text style={tw`text-red-500 text-base`}>Failed to load profile.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={tw`flex-1 bg-white`}>
      <View style={tw.style('p-6 items-center')}>
        <View style={tw.style(
          'w-full rounded-xl bg-white shadow-md border border-gray-200 p-6'
        )}>
          <Text style={tw`text-2xl font-bold text-gray-900 mb-2`}>
            {user.name}
          </Text>

          <Text style={tw`text-base text-gray-600 mb-1`}>
            Email: <Text style={tw`text-gray-800`}>{user.email}</Text>
          </Text>

          <Text style={tw`text-base text-gray-600`}>
            Total Bookings:{' '}
            <Text style={tw`text-indigo-600 font-semibold`}>
              {user.bookings?.length || 0}
            </Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}