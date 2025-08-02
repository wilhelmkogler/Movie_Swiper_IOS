import Background from "@/components/Background";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { auth, db } from "../../lib/firebase";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: fullName });

      await setDoc(doc(db, "users", user.uid), {
        fullName,
        email,
        likedMovies: [],
        likedSeries: [],
      });

      router.replace("/");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Registration failed");
    }
  };

  return (
    <Background>
      <View className=" flex-1 justify-center items-center gap-4 px-4">
        <Text className="text-4xl text-white font-semibold">Sign Up</Text>

        <TextInput
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
          className="border bg-white/80 border-white w-[250px] h-[50px] px-4 py-2 rounded-lg text-black"
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          className="border bg-white/80 border-white w-[250px] h-[50px] px-4 py-2 rounded-lg text-black"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          className="border bg-white/80 border-white w-[250px] h-[50px] px-4 py-2 rounded-lg text-black"
        />

        {error && <Text className="text-red-500">{error}</Text>}

        <Button title="Register" color={"red"} onPress={handleRegister} />

        <Text className="text-white mt-4">
          Already have an account?{" "}
          <Text
            onPress={() => router.push("/login")}
            className="text-white underline"
          >
            Login
          </Text>
        </Text>
      </View>
    </Background>
  );
}
