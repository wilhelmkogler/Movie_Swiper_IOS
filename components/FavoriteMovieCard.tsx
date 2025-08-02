import { MovieCardProps } from "@/components/MovieCard";
import { Trash2 } from "lucide-react-native";
import { useRef, useState } from "react";
import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface FavoriteMovieCardProps extends MovieCardProps {
  onDelete?: (title: string) => void;
}

export default function FavoriteMovieCard({
  title,
  year,
  poster,
  genre,
  runtime,
  imdbRating,
  plot,
  onDelete,
}: FavoriteMovieCardProps) {
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

  const handleCardPress = (event: any) => {
    if (
      event?.target?._internalFiberInstanceHandleDEV?.memoizedProps?.onPress ===
      confirmDelete
    ) {
      return;
    }
    togglePlot();
  };

  const confirmDelete = () => {
    if (onDelete) onDelete(title);
  };

  return (
    <Pressable
      onPress={handleCardPress}
      className="h-[350px] bg-white rounded-xl overflow-hidden shadow-md mb-2 mr-[10px]"
      style={{ marginBottom: -16 }}
    >
      <Image
        source={{ uri: poster }}
        className="w-full h-full absolute"
        resizeMode="cover"
      />

      {onDelete && (
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            confirmDelete();
          }}
          className="absolute top-2 right-2 p-1 rounded-full"
        >
          <Trash2 color="white" size={20} />
        </TouchableOpacity>
      )}

      <View className="absolute bottom-0 w-full bg-black/80 px-3 py-3">
        <Text
          className="text-white font-semibold text-lg mb-1"
          numberOfLines={1}
        >
          {title}
        </Text>
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
            padding: 12,
          }}
        >
          <ScrollView>
            <View className="mb-4 flex flex-row justify-between items-center">
              <Text className="text-white text-sm">Year</Text>
              <Text className="text-white text-sm">{year}</Text>
            </View>
            <View className="mb-4 flex flex-row justify-between items-center">
              <Text className="text-white text-sm">Duration</Text>
              <Text className="text-white text-sm">{runtime}</Text>
            </View>
            <View className="flex flex-row justify-between items-center">
              <Text className="text-white text-sm">Rating</Text>
              <Text className="text-white text-sm">{imdbRating} ⭐</Text>
            </View>

            <Text className="my-5 text-white text-sm text-justify">{plot}</Text>

            <Text className="text-white text-sm text-center">{genre}</Text>
          </ScrollView>
        </Animated.View>
      )}
    </Pressable>
  );
}
