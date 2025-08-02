import Background from "@/components/Background";
import FavoriteMovieCard from "@/components/FavoriteMovieCard";
import { MovieCardProps } from "@/components/MovieCard";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { useFocusEffect } from "@react-navigation/native";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useCallback, useState } from "react";
import { Alert, Dimensions, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Favorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<MovieCardProps[]>([]);

  const fetchFavorites = async () => {
    if (!user) return;

    try {
      const snapshot = await getDocs(
        collection(db, "users", user.uid, "favorites")
      );

      const rawData = snapshot.docs.map((doc) => doc.data() as MovieCardProps);

      const uniqueMoviesMap = new Map<string, MovieCardProps>();
      rawData.forEach((movie) => {
        if (!uniqueMoviesMap.has(movie.title)) {
          uniqueMoviesMap.set(movie.title, movie);
        }
      });
      const data = Array.from(uniqueMoviesMap.values());

      setFavorites(data);
    } catch (err) {
      console.error("❌ Failed to fetch favorites:", err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, [user])
  );

  const handleDelete = async (title: string) => {
    if (!user) return;

    try {
      const favRef = collection(db, "users", user.uid, "favorites");
      const q = query(favRef, where("title", "==", title));
      const snapshot = await getDocs(q);

      snapshot.forEach(async (docItem) => {
        await deleteDoc(doc(db, "users", user.uid, "favorites", docItem.id));
      });

      fetchFavorites();
    } catch (err) {
      console.error("❌ Failed to delete favorite:", err);
    }
  };

  const confirmDelete = (title: string) => {
    Alert.alert(
      "Remove Favorite",
      "Are you sure you want to remove this movie from favorites?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: () => handleDelete(title),
        },
      ]
    );
  };

  const screenWidth = Dimensions.get("window").width;
  const cardWidth = screenWidth / 2 - 24;

  return (
    <Background>
      <SafeAreaView className="flex-1 w-[360px]">
        {favorites.length === 0 ? (
          <Text className="text-white text-3xl text-center mt-20">No favorites yet</Text>
        ) : (
          <FlatList
            data={favorites}
            keyExtractor={(item) => item.title}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: "space-between",
              marginVertical: 16,
            }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={{ width: cardWidth }}>
                <FavoriteMovieCard {...item} onDelete={confirmDelete} />
              </View>
            )}
          />
        )}
      </SafeAreaView>
    </Background>
  );
}
