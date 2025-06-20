
import { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native';
import { useProperties } from '../../hooks/useProperties';
import tw from '../../twrnc';
import { Link } from 'expo-router';

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const { data, isLoading, error } = useProperties();

  const filtered = data?.filter(item => {
    const name = item.title ?? '';
    const city = item.location?.city ?? '';
    const state = item.location?.state ?? '';
    const address = item.location?.address ?? '';
    const searchLower = search.toLowerCase();

    return (
      name.toLowerCase().includes(searchLower) ||
      city.toLowerCase().includes(searchLower) ||
      state.toLowerCase().includes(searchLower) ||
      address.toLowerCase().includes(searchLower)
    );
  });

  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={tw`mt-2 text-gray-600`}>Loading properties...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-red-500 text-lg`}>Error loading properties</Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-white`}>
      <TextInput
        style={tw`m-4 p-3 border border-gray-300 rounded-lg text-base`}
        placeholder="Search by name, city, state..."
        value={search}
        onChangeText={setSearch}
      />

      {filtered?.length === 0 ? (
        <Text style={tw`text-center text-gray-500 mt-8`}>No properties found.</Text>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={tw`px-4 pb-6`}
          renderItem={({ item }) => (
            <Link href={`/property/${item.id}`} asChild>
              <TouchableOpacity style={tw`mb-4 bg-white rounded-xl shadow-lg overflow-hidden`}>
                <Image
                  source={{ uri: item.images?.[0] }}
                  style={tw`w-full h-48`}
                  resizeMode="cover"
                />
                <View style={tw`p-4`}>
                  <Text style={tw`text-xl font-semibold text-gray-800`}>
                    {item.title}
                  </Text>
                  <Text style={tw`text-sm text-gray-500 mt-1`}>
                    {item.location?.address}, {item.location?.city}, {item.location?.state}
                  </Text>
                  <Text style={tw`text-indigo-600 text-lg mt-2 font-bold`}>
                    ${item.price.toLocaleString()}
                  </Text>
                  <Text style={tw`text-sm text-blue-500 mt-1`}>View Details</Text>
                </View>
              </TouchableOpacity>
            </Link>
          )}
        />
      )}
    </View>
  );
}