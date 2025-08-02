import Background from "@/components/Background";
import MovieCard, { MovieCardProps } from "@/components/MovieCard";
import { useAuth } from "@/context/AuthContext";
import { fetchMovies } from "@/lib/fetchMovies";
import { db } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import Swiper from "react-native-deck-swiper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [movies, setMovies] = useState<MovieCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchMovies("Batman")
      .then(setMovies)
      .catch((err) => {
        console.error("❌ API error:", err.message);
        setMovies([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Background>
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="white" />
          <Text className="text-white mt-4">Loading...</Text>
        </View>
      ) : !movies.length ? (
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-yellow-400 text-lg text-center">
            Try again later.
          </Text>
        </View>
      ) : (
        <SafeAreaView className="flex-1 justify-center items-center">
          <View style={{ height: 600, width: 390 }}>
            <Swiper
              cards={movies}
              renderCard={(movie) => <MovieCard {...movie} />}
              backgroundColor="transparent"
              stackSize={3}
              stackSeparation={14}
              cardVerticalMargin={20}
              animateCardOpacity
              disableTopSwipe
              disableBottomSwipe
              onSwipedRight={async (index) => {
                const likedMovie = movies[index];
                console.log("✅ Liked:", likedMovie.title);
                console.log("👤 Current user UID:", user?.uid);

                if (user) {
                  const cleanMovie = {
                    title: likedMovie.title,
                    genre: likedMovie.genre,
                    year: likedMovie.year,
                    imdbRating: likedMovie.imdbRating,
                    runtime: likedMovie.runtime,
                    poster: likedMovie.poster,
                    plot: likedMovie.plot,
                  };

                  try {
                    await addDoc(
                      collection(db, "users", user.uid, "favorites"),
                      cleanMovie
                    );
                    console.log("🔥 Saved to Firestore");
                  } catch (err) {
                    console.error("❌ Firestore save failed:", err);
                  }
                }
              }}
              onSwipedLeft={(index) => {
                console.log("❌ Disliked:", movies[index].title);
              }}
            />
          </View>
        </SafeAreaView>
      )}
    </Background>
  );
}
