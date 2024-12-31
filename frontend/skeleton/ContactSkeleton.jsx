import React from "react";
import { View, StyleSheet } from "react-native";

const ContactSkeleton = () => {
  return (
    <View style={styles.container}>
      <View style={styles.avatar} />
      <View style={styles.content}>
        <View style={styles.name} />
        <View style={styles.message} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e0e0e0",
  },
  content: {
    marginLeft: 10,
    flex: 1,
  },
  name: {
    height: 20,
    width: "60%",
    backgroundColor: "#e0e0e0",
    marginBottom: 5,
  },
  message: {
    height: 16,
    width: "80%",
    backgroundColor: "#e0e0e0",
  },
});

export default ContactSkeleton;
