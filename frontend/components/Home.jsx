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
import { getContacts } from "../utils/api";

export default function Home() {
  const navigation = useNavigation();
  const [showOptions, setShowOptions] = useState(false);
  const [starredChats, setStarredChats] = useState([]);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Show loading state
      const chats = await getContacts(); // Call the API function
      setChats(chats);
      setLoading(false);
      // console.log("chats:", chats);
    };
    fetchData();
  }, []);

  const handleChatPress = (chat) => {
    navigation.navigate("Messages", {
      userId: chat._id,
      username: chat.fullName,
      userImage: chat.profilePic,
      lastSeen: formatLastActiveTime(chat.lastActive),
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
        </View>
      </TouchableOpacity>
    </Modal>
  );
  function formatLastActiveTime(lastActive) {
    const date = new Date(lastActive);

    // Extract hours and minutes
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Format time as hh:mm (24-hour format)
    const formattedTime = `${hours}:${minutes.toString().padStart(2, "0")}`;

    return formattedTime;
  }
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
        <View style={styles.searchbar}>
          <TextInput
            placeholder="Search..."
            style={styles.searchInput}
            placeholderTextColor="#666"
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.chatListContainer}>
        <Text style={styles.recentHeader}>Recent Messages</Text>
        {chats && chats.length > 0 ? (
          chats.map((chat) => (
            <TouchableOpacity
              key={chat._id}
              onPress={() => handleChatPress(chat)}
            >
              <View style={styles.chatItem}>
                <View style={styles.avatarContainer}>
                  <Image
                    source={{ uri: chat.profilePic }}
                    style={styles.chatImage}
                  />
                  {chat.onlineStatus && <View style={styles.onlineIndicator} />}
                </View>
                <View style={styles.chatDetails}>
                  <Text style={styles.username}>{chat.fullName}</Text>
                  {/* <Text style={styles.chatText}>{chat.text}</Text> */}
                </View>
                <View style={styles.chatTimeContainer}>
                  <Text style={styles.timestamp}>
                    {formatLastActiveTime(chat.lastActive)}
                  </Text>
                  {starredChats.includes(chat.id) && (
                    <Ionicons
                      name="star"
                      size={16}
                      color="#FFD700"
                      style={styles.starIcon}
                    />
                  )}
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
          onPress={() => navigation.navigate("ContactList")}
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
    height: 150,
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
    marginTop: 30,
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
    fontSize: 16,
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
});
