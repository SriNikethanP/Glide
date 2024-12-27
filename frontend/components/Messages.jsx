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
        console.error('Error fetching messages:', error);
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
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return "Today";
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return messageDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  const DateSeparator = ({ date }) => (
    <View style={styles.dateSeparatorContainer}>
      {/* <View style={styles.dateSeparatorLine} /> */}
      <Text style={styles.dateSeparatorText}>{formatDate(date)}</Text>
      {/* <View style={styles.dateSeparatorLine} /> */}
    </View>
  );

  const sendMessage = () => {
    if (message.trim().length > 0) {
      const newMessage = {
        id: chatMessages.length + 1,
        text: message,
        sender: true,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: new Date().toISOString().split("T")[0],
        seen: false,
        senderImage: userImage,
      };

      setChatMessages([...chatMessages, newMessage]);
      setMessage("");

      // Scroll to bottom after sending message
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const MessageBubble = ({ message }) => {
    const isSender = message.sender;

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

        <View style={styles.messageContentContainer}>
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
          {/* {isSender && (
            <Text style={styles.statusText}>{message.seen ? "" : "1"}</Text>
          )}
          <Text
            style={[
              styles.timestamp,
              isSender ? styles.senderTimestamp : styles.receiverTimestamp,
            ]}
          >
            {message.timestamp}
          </Text> */}

          <View
            style={[
              styles.messageContainer,
              isSender ? styles.senderContainer : styles.receiverContainer,
            ]}
          >
            <View style={styles.bubbleWrapper}>
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

              <View style={styles.messageMetadata}>
                {isSender && (
                  <Text style={styles.seenStatus}>
                    {message.seen ? " " : "1"}
                  </Text>
                )}
                <Text
                  style={[
                    styles.timestamp,
                    isSender
                      ? styles.senderTimestamp
                      : styles.receiverTimestamp,
                  ]}
                >
                  {message.timestamp}
                </Text>
              </View>
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
          {/* <TouchableOpacity style={styles.optionItem}>
            <Text style={styles.optionText}>Block</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionItem}>
            <Text style={styles.optionText}>Restrict</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionItem}>
            <Text style={styles.optionText}>Report</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionItem}>
            <Text style={styles.optionText}>Clear Chat</Text>
          </TouchableOpacity> */}
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
            <View key={chat.id}>
              {showDate && <DateSeparator date={chat.date} />}
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
  // messageContainer: {
  //   flexDirection: "row",
  //   marginVertical: 4,
  //   paddingHorizontal: 8,
  // },
  // senderContainer: {
  //   justifyContent: "flex-end",
  // },
  // receiverContainer: {
  //   justifyContent: "flex-start",
  // },
  bubbleWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    maxWidth: "80%",
  },
  // messageBubble: {
  //   padding: 8,
  //   borderRadius: 16,
  //   maxWidth: "80%",
  // },
  // senderBubble: {
  //   backgroundColor: "#0084ff",
  //   borderBottomRightRadius: 4,
  // },
  // receiverBubble: {
  //   backgroundColor: "#e4e6eb",
  //   borderBottomLeftRadius: 4,
  // },
  messageText: {
    fontSize: 16,
  },
  // senderText: {
  //   color: "#ffffff",
  // },
  // receiverText: {
  //   color: "#ffffff",
  // },
  messageMetadata: {
    flexDirection: "column",
    marginLeft: 4,
    alignItems: "flex-end",
  },
  seenStatus: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#FFEA00",
  },
  timestamp: {
    fontSize: 8,
    color: "#8e8e8e",
  },
  // senderTimestamp: {
  //   textAlign: "right",
  // },
  // receiverTimestamp: {
  //   textAlign: "left",
  // },
  headerInfo: {
    flex: 1,
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
    fontSize: 8,
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
  },
  input: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    fontSize: 16,
    maxHeight: 100,
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
    justifyContent: "center",
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  dateSeparatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#fff",
  },
  dateSeparatorText: {
    fontSize: 12,
    color: "#fff",
    marginHorizontal: 10,
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
