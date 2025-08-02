import Background from "@/components/Background";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { auth } from "../../lib/firebase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <Background>
    <View className="flex justify-center items-center gap-4">
      <Text className="text-4xl text-white font-semibold">Sign In</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        className="border bg-white/80 border-white w-[250px] h-[50px] px-4 py-2 rounded-lg text-black"
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="border bg-white/80 border-white w-[250px] h-[50px] px-4 py-2 rounded-lg text-black"
      />

      {error && <Text className="text-white">{error}</Text>}

      <Button title="Login" color={"red"} onPress={handleLogin} />

      <Text className="text-white mt-4">
        Don't have an account?{" "}
        <Text
          onPress={() => router.push("/register")}
          className="text-white underline"
        >
          Register
        </Text>
      </Text>
    </View>
    </Background>
  );
}
