import React from "react";
import { View, StyleSheet } from "react-native";

export const MessageSkeleton = () => {
  return (
    <View style={styles.container}>
      <View style={styles.avatar} />
      <View style={styles.messageContent}>
        <View style={styles.messageBubble}>
          <View style={styles.messageText} />
          <View style={styles.messageText} />
        </View>
        <View style={styles.timestamp} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "flex-end",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
    marginRight: 10,
  },
  messageContent: {
    flex: 1,
  },
  messageBubble: {
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
    padding: 10,
    maxWidth: "80%",
  },
  messageText: {
    height: 16,
    width: "100%",
    backgroundColor: "#d0d0d0",
    marginBottom: 5,
  },
  timestamp: {
    height: 12,
    width: 50,
    backgroundColor: "#e0e0e0",
    alignSelf: "flex-end",
    marginTop: 5,
  },
});

export default MessageSkeleton;
