import Background from "@/components/Background";
import { db } from "@/lib/firebase";
import { useFocusEffect } from "@react-navigation/native";
import { collection, getDocs } from "firebase/firestore";
import { useCallback } from "react";

import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { useRouter } from "expo-router";
import { signOut, updateProfile } from "firebase/auth";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const { user } = useAuth();
  const router = useRouter();
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [topGenre, setTopGenre] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState<number | null>(null);

  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || "");

  useFocusEffect(
    useCallback(() => {
      const fetchStats = async () => {
        if (!user) return;

        try {
          const snapshot = await getDocs(
            collection(db, "users", user.uid, "favorites")
          );
          const favorites = snapshot.docs.map((doc) => doc.data());

          setFavoriteCount(favorites.length);

          const genreCount: Record<string, number> = {};
          favorites.forEach((fav) => {
            if (fav.genre) {
              const genres = fav.genre.split(",").map((g: string) => g.trim());
              genres.forEach((g: string) => {
                genreCount[g] = (genreCount[g] || 0) + 1;
              });
            }
          });
          const validRatings = favorites
            .map((fav) => parseFloat(fav.imdbRating))
            .filter((n) => !isNaN(n));

          if (validRatings.length > 0) {
            const sum = validRatings.reduce((acc, curr) => acc + curr, 0);
            const avg = sum / validRatings.length;
            setAverageRating(parseFloat(avg.toFixed(1)));
          } else {
            setAverageRating(null);
          }

          const top = Object.entries(genreCount).sort((a, b) => b[1] - a[1])[0];
          setTopGenre(top ? top[0] : null);
        } catch (err) {
          console.error("❌ Failed to fetch favorites stats:", err);
        }
      };

      fetchStats();
    }, [user])
  );

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/login");
  };

  const handleSave = async () => {
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName,
        });
        Alert.alert("Success", "Profile updated successfully!");
        setEditing(false);
      }
    } catch (err) {
      console.error("❌ Failed to update profile:", err);
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  return (
    <Background>
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1 justify-between px-4 pb-6"
        >
          <View className="items-center mt-24">
            <Image
              source={require("@/assets/images/avatar.png")}
              className="w-40 h-40 rounded-full mb-4 border-4 border-white"
            />

            {editing ? (
              <>
                <TextInput
                  value={displayName}
                  onChangeText={setDisplayName}
                  className="bg-white w-64 px-4 py-2 rounded-xl text-black mb-3"
                  placeholder="Your name"
                />
                <View className="flex-row space-x-4 mb-4">
                  <TouchableOpacity
                    onPress={handleSave}
                    className="bg-green-600 px-4 py-2 rounded-xl"
                  >
                    <Text className="text-white font-semibold">Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setEditing(false);
                      setDisplayName(user?.displayName || "");
                    }}
                    className="bg-gray-500 px-4 py-2 rounded-xl"
                  >
                    <Text className="text-white font-semibold">Cancel</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Text className="text-white text-3xl font-bold mb-24">
                  {user?.displayName || "User"}
                </Text>
                <View className="flex-col gap-4 mb-10 bg-white/10 w-full rounded-xl p-4">
                  <View className="flex-row justify-between">
                    <Text className="text-gray-300 mb-4">Email:</Text>
                    <Text className="text-white mb-4">{user?.email}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-gray-300 mb-0">Password:</Text>
                    <Text className="text-white mb-0">*************</Text>
                  </View>
                </View>
                <View className="w-full rounded-xl p-4 mb-4">
                  <View className="flex-row justify-around gap-10">
                    <View className="flex-col-reverse justify-center items-center gap-4">
                      <Text className="text-white text-xl">Total Films</Text>
                      <Text className="text-gray-400 text-xl">
                        {favoriteCount}
                      </Text>
                    </View>
                    <View className="flex-col-reverse justify-center items-center gap-4">
                      <Text className="text-white text-xl">Top Genre</Text>
                      <Text className="text-gray-400 text-xl">
                        {topGenre || "N/A"}
                      </Text>
                    </View>
                    <View className="flex-col-reverse justify-center items-center gap-4">
                      <Text className="text-white text-xl">Avg. Rating</Text>
                      <Text className="text-gray-400 text-xl">
                        {averageRating !== null ? `${averageRating} ` : "0.0"}
                      </Text>
                    </View>
                  </View>
                </View>
              </>
            )}
          </View>

          {!editing && (
            <View className=" w-[360px] flex-row justify-between ">
              <TouchableOpacity
                onPress={() => setEditing(true)}
                className="bg-white flex-1 py-3 mr-2 rounded-xl items-center"
              >
                <Text className="text-xl text-black font-semibold">
                  Edit Profile
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleLogout}
                className="bg-red-600 flex-1 py-3 ml-2 rounded-xl items-center"
              >
                <Text className="text-xl text-white font-semibold">
                  Log Out
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Background>
  );
}
