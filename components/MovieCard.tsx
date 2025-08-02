import { Info } from "lucide-react-native";
import { useRef, useState } from "react";
import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

export interface MovieCardProps {
  title: string;
  year: string;
  poster: string;
  genre?: string;
  runtime?: string;
  imdbRating?: string;
  plot?: string;
}

export default function MovieCard({
  title,
  year,
  poster,
  genre,
  runtime,
  imdbRating,
  plot,
}: MovieCardProps) {
  const [showPlot, setShowPlot] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const togglePlot = () => {
    if (!showPlot) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
    setShowPlot(!showPlot);
  };

  return (
    <View className="w-full h-[560px] bg-white rounded-xl overflow-hidden shadow-xl">
      <Image
        source={{ uri: poster }}
        className="w-full h-full absolute"
        resizeMode="cover"
      />
      <View className="absolute bottom-0 w-full bg-black/80 px-4 py-4">
        <Text className="text-white font-bold text-2xl mb-2">{title}</Text>
        <Text className="text-gray-300 text-lg">{year}</Text>
      </View>

      {plot && (
        <Animated.View
          style={{
            opacity: fadeAnim,
            position: "absolute",
            bottom: 0,
            height: "100%",
            width: "100%",
            backgroundColor: "rgba(0,0,0,0.85)",
            padding: 16,
          }}
        >
          <ScrollView>
            <View className="mb-4 flex flex-row justify-between items-center">
              <Text className="text-white text-xl">Genres</Text>
              <Text className="text-white text-xl">{genre}</Text>
            </View>
            <View className="mb-4 flex flex-row justify-between items-center">
              <Text className="text-white text-xl">Year</Text>
              <Text className="text-white text-xl">{year}</Text>
            </View>
            <View className="mb-4 flex flex-row justify-between items-center">
              <Text className="text-white text-xl">Duration</Text>
              <Text className="text-white text-xl">{runtime}</Text>
            </View>
            <View className="mb-10 flex flex-row justify-between items-center">
              <Text className="text-white text-xl">Rating</Text>
              <Text className="text-white text-xl">{imdbRating} ⭐</Text>
            </View>

            <Text className="text-white text-xl text-justify">{plot}</Text>
          </ScrollView>
        </Animated.View>
      )}

      <Pressable
        onPress={togglePlot}
        className="absolute bottom-7 right-3 bg-black/50 p-2 rounded-full"
      >
        <Info color="white" size={26} />
      </Pressable>
    </View>
  );
}
