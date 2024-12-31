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
import { ToastAndroid } from "react-native";
import { useAuthStore } from "../store/useAuthStore";

export default function Signup() {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const { signup } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim())
      return ToastAndroid.error("Full name is required");
    if (!formData.email.trim()) return ToastAndroid.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return ToastAndroid.error("Invalid email format");
    if (!formData.password) return ToastAndroid.error("Password is required");
    if (formData.password.length < 6)
      return ToastAndroid.error("Password must be at least 6 characters");

    return true;
  };
  const handleSubmit = () => {

    const success = validateForm();

    if (success === true) {
      signup(formData);
      navigation.push("Home");
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
              value={formData.fullName}
              onChangeText={(e) => setFormData({ ...formData, fullName: e })}
            />
            <Text style={styles.textlabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your Email"
              value={formData.email}
              onChangeText={(e) => setFormData({ ...formData, email: e })}
              keyboardType="email-address"
            />
            <Text style={styles.textlabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your Password"
              value={formData.password}
              onChangeText={(e) => setFormData({ ...formData, password: e })}
              secureTextEntry
            />
          </View>

          <View>
            <TouchableOpacity
              style={styles.loginbutton}
              onPress={() => handleSubmit()}
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
