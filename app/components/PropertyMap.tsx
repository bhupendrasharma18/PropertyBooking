import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import { ViewStyle } from 'react-native';

interface Props {
  coordinates: { latitude: number; longitude: number };
  title: string;
  style?: ViewStyle;
}

const PropertyMap: React.FC<Props> = ({ coordinates, title, style }) => {
  return (
    <MapView
      style={style || { width: '100%', height: 200 }}
      initialRegion={{
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
    >
      <Marker coordinate={coordinates} title={title} />
    </MapView>
  );
};

export default React.memo(PropertyMap);