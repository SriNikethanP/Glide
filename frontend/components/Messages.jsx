import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getMessages } from "../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MessageScreen({ route, navigation }) {
  const { userId, username, userImage, lastSeen, isOnline } = route.params;
  const scrollViewRef = useRef();
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messages = await getMessages(userId);
        setChatMessages(messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [userId]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [chatMessages]);

  const formatDate = (dateString) => {
    const messageDate = new Date(dateString);

    // Check if the date is valid
    if (!messageDate) {
      console.error("Invalid date:", dateString);
      return "";
    }

    const today = new Date();

    // Reset the time part for comparison purposes (only date)
    today.setHours(0, 0, 0, 0);

    // Check if the message was sent today
    if (messageDate >= today) {
      return "Today";
    }

    // Check if the message was sent yesterday
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (messageDate >= yesterday && messageDate < today) {
      return "Yesterday";
    }

    // For older dates, format in the "Month Day, Year" format
    return messageDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const DateSeparator = ({ date }) => (
    <View style={styles.dateSeparatorContainer}>
      <Text style={styles.dateSeparatorText}>{formatDate(date)}</Text>
    </View>
  );
  function formatMessageTime(timestamp) {
    const date = new Date(timestamp);

    // Extract hours and minutes
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Format time as hh:mm (24-hour format)
    const formattedTime = `${hours}:${minutes.toString().padStart(2, "0")}`;

    return formattedTime;
  }
  const sendMessage = async () => {
    if (message.trim().length > 0) {
      try {
        const senderId = await AsyncStorage.getItem("senderId");
        if (!senderId) {
          console.log("SenderId not found in AsyncStorage");
          return;
        }

        const response = await fetch(
          `http://192.168.31.211:5000/api/messages/send/${userId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              senderId: senderId,
              receiverId: userId,
              text: message,
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          // Update the chat UI with the new message
          const newMessage = {
            ...data, // Use the data received from the backend
            // This will depend on your app's logic
            senderImage: userImage, // You can pass the user image if needed
          };

          setChatMessages((prevMessages) => [...prevMessages, newMessage]);
          setMessage(""); // Clear input field

          // Scroll to bottom after sending message
          setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }, 100);

          console.log("Message sent to backend:", data);
        } else {
          console.error("Error sending message:", data);
        }
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  };

  const MessageBubble = ({ message }) => {
    const isSender = message.senderId === userId;

    return (
      <View
        style={[
          styles.messageRow,
          isSender ? styles.senderRow : styles.receiverRow,
        ]}
      >
        {!isSender && (
          <Image
            source={{ uri: message.senderImage }}
            style={styles.messageAvatar}
          />
        )}

        <View
          style={[
            styles.messageContainer,
            isSender ? styles.senderContainer : styles.receiverContainer,
          ]}
        >
          <View style={styles.bubbleWrapper}>
            <View style={styles.messageMetadata}>
              {isSender && (
                <Text style={styles.seenStatus}>
                  {message.seen ? " " : "1"}
                </Text>
              )}
              <Text
                style={[
                  styles.timestamp,
                  isSender ? styles.senderTimestamp : styles.receiverTimestamp,
                ]}
              >
                {formatMessageTime(message.timestamp)}
              </Text>
            </View>

            <View
              style={[
                styles.messageBubble,
                isSender ? styles.senderBubble : styles.receiverBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  isSender ? styles.senderText : styles.receiverText,
                ]}
              >
                {message.text}
              </Text>
            </View>
          </View>
        </View>
        {isSender && (
          <Image
            source={{ uri: message.senderImage }}
            style={styles.messageAvatar}
          />
        )}
      </View>
    );
  };

  const OptionsModal = () => (
    <Modal
      transparent={true}
      visible={showOptions}
      onRequestClose={() => setShowOptions(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        onPress={() => setShowOptions(false)}
      >
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionItem}>
            <Text style={styles.optionText}>View Profile</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <Image source={{ uri: userImage }} style={styles.profileImage} />

        <View style={styles.headerInfo}>
          <Text style={styles.userName}>{username}</Text>
          <Text style={styles.lastSeen}>
            {isTyping
              ? "typing..."
              : isOnline
              ? "Online"
              : `Last seen ${lastSeen}`}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => setShowOptions(true)}
          style={styles.optionsButton}
        >
          <Ionicons name="ellipsis-vertical" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      >
        {chatMessages.map((chat, index) => {
          let showDate =
            index === 0 || chatMessages[index - 1].date !== chat.date;

          return (
            <View key={chat._id}>
              {showDate && <DateSeparator date={chat.timestamp} />}
              <MessageBubble message={chat} />
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          multiline
          maxHeight={100}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <OptionsModal />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#24B2FF",
    marginTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    padding: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    height: 80,
  },
  backButton: {
    padding: 5,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 40,
    marginLeft: 10,
  },
  bubbleWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    maxWidth: "80%",
  },
  messageText: {
    fontSize: 16,
  },
  messageMetadata: {
    flexDirection: "column",
    marginRight: 4,
    alignItems: "flex-end",
  },
  seenStatus: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#FFEA00",
  },
  timestamp: {
    fontSize: 8,
    color: "#8e8e8e",
  },
  headerInfo: {
    flex: 1,
    flexDirection: "column",
    gap: 3,
    marginLeft: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  lastSeen: {
    fontSize: 12,
    color: "#666",
  },
  optionsButton: {
    padding: 5,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: "#24B2FF",
  },
  chatContent: {
    paddingVertical: 10,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 4,
    paddingHorizontal: 8,
  },
  senderRow: {
    justifyContent: "flex-end",
  },
  receiverRow: {
    justifyContent: "flex-start",
  },
  messageContentContainer: {
    maxWidth: "70%",
    marginHorizontal: 8,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
    maxWidth: "100%",
  },
  senderBubble: {
    backgroundColor: "#FFEA00",
    borderBottomRightRadius: 4,
  },
  receiverBubble: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  senderText: {
    color: "#000000",
  },
  receiverText: {
    color: "#000000",
  },
  messageAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginBottom: 15,
  },
  timestamp: {
    fontSize: 11,
    color: "#fff",
    marginTop: 2,
  },
  senderTimestamp: {
    alignSelf: "flex-start",
    marginLeft: 4,
  },
  receiverTimestamp: {
    alignSelf: "flex-end",
    marginRight: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#FFEA00",
    marginTop: 2,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    maxHeight: 100, // This restricts max height
    overflow: "hidden",
  },
  input: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    fontSize: 16,
    overflow: "scroll",
    maxHeight: 80,
  },
  sendButton: {
    backgroundColor: "#24B2FF",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  dateSeparatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Centers content horizontally
    marginVertical: 10,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  dateSeparatorText: {
    fontSize: 12,
    color: "#fff",
    marginHorizontal: 10,
    fontSize: 12,
    color: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 3,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  optionsContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  optionItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  optionText: {
    fontSize: 16,
    color: "#000",
  },
});
