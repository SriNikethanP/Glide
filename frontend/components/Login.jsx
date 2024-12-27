import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React from "react";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);


  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://192.168.31.211:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Login Error:", errorData.message);
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      console.log("Login successful:", data);

      // Save the token in AsyncStorage
      await AsyncStorage.setItem("token", data.token);

      console.log("Token saved to AsyncStorage");
      navigation.push("Home");
    } catch (error) {
      console.error("Error during login:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.safearea,
        styles.container,
        { paddingTop: StatusBar.currentHeight },
      ]}
    >
      <KeyboardAvoidingView>
        <View>
          <Text style={[styles.welcome, { color: "#FFEA00" }]}>
            Welcome Back
          </Text>
          <Text style={styles.textcontent}>Sign in to your Account</Text>
        </View>
        <View style={[styles.box, styles.logincontainer]}>
          <View style={styles.logincredentials}>
            <Text style={styles.textlabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
            />
            <Text style={styles.textlabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
          <View>
            <TouchableOpacity
              style={styles.loginbutton}
              onPress={() => handleLogin()}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 20,
                }}
              >
                Login
              </Text>
            </TouchableOpacity>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ color: "#fff" }}>Dont have an account ?</Text>
              <TouchableOpacity onPress={() => navigation.push("Signup")}>
                <Text style={{ color: "#FFEA00", fontWeight: "bold" }}>
                  {" "}
                  Signup
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <StatusBar style="light" backgroundColor="black" />
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
  logincontainer: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
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
    backgroundColor: "#fff",
    borderColor: "#1c1c1c",
    borderWidth: 1,
    borderRadius: 20,
    padding: 15,
    marginBottom: 25,
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
  logincredentials: {
    width: 300,
    justifyContent: "center",
    // alignItems:'center',
  },
  box: {
    justifyContent: "center",
    alignItems: "center",
  },
});
