import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Signup() {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setfullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    try {
      // Make the POST request to the backend API
      const response = await axios.post(
        "http://192.168.31.211:5000/api/auth/signup",
        {
          fullName,
          email,
          password,
        }
      );

      // console.log("User registered successfully:", response.data);
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Signup Error:", errorData.message);
        throw new Error(errorData.message || "Signup failed");
      }
      const data = await response.json();
      await AsyncStorage.setItem("senderId", data._id);
      setfullName("");
      setEmail("");
      setPassword("");
      setError("");
      navigation.push("Home");
    } catch (err) {
      console.error("Error during signup:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false); // Hide loading
    }
  };

  return (
    <SafeAreaView style={[styles.safearea, styles.container]}>
      <KeyboardAvoidingView>
        <View>
          <Text style={[styles.welcome, { color: "#FFEA00" }]}>
            Create an Account
          </Text>
          <Text style={styles.textcontent}>
            Experience a new world of chatting with{" "}
            <Text style={{ fontWeight: "bold" }}>Glide</Text>
          </Text>
        </View>
        <View style={styles.box}>
          <View style={styles.logincredentials}>
            <Text
              style={{
                color: "#fff",
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 15,
                paddingHorizontal: 15,
                textAlign: "left",
              }}
            >
              Full Name
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your Full Name"
              value={fullName}
              onChangeText={setfullName}
            />
            <Text style={styles.textlabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <Text style={styles.textlabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View>
            <TouchableOpacity
              style={styles.loginbutton}
              onPress={() => handleSignup()}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 20,
                }}
              >
                Signup
              </Text>
            </TouchableOpacity>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ color: "#fff" }}>Already have an account ?</Text>
              <TouchableOpacity onPress={() => navigation.push("Login")}>
                <Text style={{ color: "#FFEA00", fontWeight: "bold" }}>
                  {" "}
                  Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <StatusBar style="light" backgroundColor="#000" />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#24B2FF",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  welcome: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 30,
    marginBottom: 10,
    textAlign: "center",
  },
  textcontent: {
    color: "#fff",
    textAlign: "center",
    fontSize: 15,
    marginBottom: 20,
  },
  logincredentials: {
    width: 300,
    justifyContent: "center",
    // alignItems:'center',
  },
  textlabel: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  input: {
    width: "100%",
    backgroundColor: "#f5f5f5",
    borderColor: "#1c1c1c",
    borderWidth: 1,
    borderRadius: 20,
    padding: 15,
    marginBottom: 25,
  },
  box: {
    justifyContent: "center",
    alignItems: "center",
  },
  loginbutton: {
    backgroundColor: "#FFEA00",
    height: 42,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderColor: "#fff",
    borderRadius: 20,
    marginTop: 20,
  },
});
