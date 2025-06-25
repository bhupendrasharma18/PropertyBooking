import React, { useState } from 'react';
import { ScrollView, View, Image, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import tw from '../../twrnc';

const { width } = Dimensions.get('window');

type ImageCarouselProps = {
  images: string[];
  height: number;
};

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, height = 250 }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(slide);
  };

  return (
    <>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={{ width, height }}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {images?.map((img, idx) => (
          <Image
            key={idx}
            source={{ uri: img }}
            style={{ width, height }}
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
              { backgroundColor: idx === activeIndex ? '#4F46E5' : '#D1D5DB' },
            ]}
          />
        ))}
      </View>
    </>
  );
};

export default ImageCarousel;