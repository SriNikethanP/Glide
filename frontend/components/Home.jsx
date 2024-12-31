import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { formatTime } from "../utils/utils";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

export default function Home() {
  const navigation = useNavigation();
  const [showOptions, setShowOptions] = useState(false);
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const { logout, authUser } = useAuthStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  const handleChatPress = (chat) => {
    navigation.navigate("Messages", {
      userId: chat._id,
      username: chat.fullName,
      userImage: chat.profilePic,
      lastSeen: formatTime(chat.lastActive),
      isOnline: chat.onlineStatus,
    });
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
            <Text style={styles.optionText}>Your Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionItem}>
            <Text style={styles.optionText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => {
              navigation.push("Login");
              logout();
            }}
          >
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 32 }}>
            Glide
          </Text>
          <TouchableOpacity onPress={() => setShowOptions(true)}>
            <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.chatListContainer}>
        <Text style={styles.recentHeader}>Contacts</Text>
        {users && users.length > 0 ? (
          users.map((user) => (
            <TouchableOpacity
              key={user._id}
              onPress={() => {
                setSelectedUser(user);
                handleChatPress(user);
              }}
            >
              <View style={styles.chatItem}>
                <View style={styles.avatarContainer}>
                  <Image
                    source={{ uri: user.profilePic }}
                    style={styles.chatImage}
                  />
                  {onlineUsers.includes(user._id) && (
                    <View style={styles.onlineIndicator} />
                  )}
                </View>
                <View style={styles.chatDetails}>
                  <Text style={styles.username}>{user.fullName}</Text>
                </View>
                <View style={styles.chatTimeContainer}>
                  <Text style={styles.timestamp}>
                    {formatTime(user.lastActive)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={"center"}>No chats available</Text>
        )}
      </ScrollView>

      <View style={styles.bottomnavbar}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Image
            source={require("../assets/home_icon.png")}
            style={{ width: 30, height: 30 }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          // onPress={() => navigation.navigate("ContactList")}
        >
          <Image
            source={require("../assets/User_icon.png")}
            style={{ width: 30, height: 30 }}
          />
        </TouchableOpacity>
      </View>

      <OptionsModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    marginTop: 20,
  },
  header: {
    height: 100,
    flexDirection: "column",
    paddingHorizontal: 18,
    backgroundColor: "#24B2FF",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    borderBottomEndRadius: 20,
    gap: 15,
    borderBottomLeftRadius: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
  },
  searchbar: {
    flexDirection: "row",
  },
  searchInput: {
    flex: 1,
    height: 42,
    marginHorizontal: 5,
    paddingHorizontal: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    fontSize: 15,
  },
  chatListContainer: {
    padding: 10,
    paddingBottom: 60,
  },
  recentHeader: {
    margin: 7,
    marginBottom: 5,
    fontSize: 24,
    fontWeight: "bold",
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatarContainer: {
    position: "relative",
  },
  chatImage: {
    width: 75,
    height: 75,
    borderRadius: 50,
    marginRight: 10,
  },
  onlineIndicator: {
    position: "absolute",
    right: 12,
    bottom: 5,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: "#fff",
  },
  chatDetails: {
    flex: 1,
  },
  username: {
    fontSize: 19,
    fontWeight: "bold",
  },
  chatText: {
    fontSize: 14,
    color: "#555",
  },
  chatTimeContainer: {
    alignItems: "flex-end",
    marginRight: 5,
  },
  timestamp: {
    fontSize: 12,
    color: "#aaa",
    marginBottom: 5,
  },
  starIcon: {
    marginTop: 2,
  },
  bottomnavbar: {
    position: "absolute",
    width: "100%",
    height: 60,
    bottom: 0,
    backgroundColor: "#24B2FF",
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    justifyContent: "space-around",
    alignItems: "center",
  },
  navButton: {
    margin: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  optionsContainer: {
    position: "absolute",
    right: 10,
    top: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 5,
    width: 200,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  optionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  logoutText: {
    fontSize: 16,
    color: "red",
  },
});
