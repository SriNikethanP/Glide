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
import { formatDate, formatTime } from "../utils/utils";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

export default function MessageScreen({ route, navigation }) {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    setSelectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    sendMessage,
  } = useChatStore();
  const { authUser, onlineUsers } = useAuthStore();

  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const scrollViewRef = useRef();
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [
    selectedUser._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const DateSeparator = ({ date }) => (
    <View style={styles.dateSeparatorContainer}>
      <Text style={styles.dateSeparatorText}>{formatDate(date)}</Text>
    </View>
  );

  const handleImageChange = () => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async () => {
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const MessageBubble = ({ chat }) => {
    const isSender = chat.senderId === authUser._id;

    return (
      <View
        style={[
          styles.messageRow,
          isSender ? styles.senderRow : styles.receiverRow,
        ]}
      >
        {!isSender && (
          <Image
            source={{ uri: authUser.profilePic }}
            style={styles.messageAvatar}
          />
        )}

        <View
          style={[
            styles.messageContainer,
            isSender ? styles.senderContainer : styles.receiverContainer,
          ]}
        >
          {isSender && (
            <View style={styles.bubbleWrapper}>
              <View style={styles.messageMetadata}>
                {isSender && (
                  <Text style={styles.seenStatus}>{chat.seen ? " " : "1"}</Text>
                )}
                <Text
                  style={[
                    styles.timestamp,
                    isSender
                      ? styles.senderTimestamp
                      : styles.receiverTimestamp,
                  ]}
                >
                  {formatTime(chat.createdAt)}
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
                  {chat.text}
                </Text>
              </View>
            </View>
          )}
          {!isSender && (
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
                  {chat.text}
                </Text>
              </View>
              <View style={styles.messageMetadata}>
                {isSender && (
                  <Text style={styles.seenStatus}>{chat.seen ? " " : "1"}</Text>
                )}
                <Text
                  style={[
                    styles.timestamp,
                    isSender
                      ? styles.senderTimestamp
                      : styles.receiverTimestamp,
                  ]}
                >
                  {formatTime(chat.createdAt)}
                </Text>
              </View>
            </View>
          )}
        </View>
        {isSender && (
          <Image
            source={{ uri: selectedUser.profilePic }}
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
          onPress={() => {
            navigation.push("Home");
            // setSelectedUser(null);
          }}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <Image
          source={{ uri: selectedUser.profilePic }}
          style={styles.profileImage}
        />

        <View style={styles.headerInfo}>
          <Text style={styles.userName}>{selectedUser.fullName}</Text>
          <Text style={styles.lastSeen}>
            {onlineUsers.includes(selectedUser._id)
              ? "Online"
              : `Last seen ${formatTime(selectedUser.lastActive)}`}
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
        {messages && messages.length > 0 ? (
          messages.map((chat, index) => {
            const previousMessage = index > 0 ? messages[index - 1] : null;

            const currentMessageDate = formatDate(chat.createdAt);
            const previousMessageDate = previousMessage
              ? formatDate(previousMessage.createdAt)
              : null;

            // Compare the current message date with the previous message date
            const showDateSeparator =
              currentMessageDate !== previousMessageDate;
            return (
              <View key={chat._id}>
                {showDateSeparator && <DateSeparator date={chat.timestamp} />}
                <MessageBubble chat={chat} />
              </View>
            );
          })
        ) : (
          <View style={styles.dateSeparatorContainer}>
            <Text style={styles.dateSeparatorText}>
              Send a message to start conversation!
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Type a message..."
          multiline
          maxHeight={100}
        />

        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
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
  senderTimestamp: {
    textAlign: "right",
  },
  receiverTimestamp: {
    textAlign: "left",
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
  messageContainer: {
    flexDirection: "row",
    marginVertical: 4,
    paddingHorizontal: 8,
  },
  senderContainer: {
    justifyContent: "flex-end",
  },
  receiverContainer: {
    justifyContent: "flex-start",
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
    padding: 4,
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
