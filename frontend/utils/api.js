import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://192.168.31.211:5000/api/messages";

export const getMessages = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

// export const getContacts = async () => {
//   try {
//     const response = await axios.get(`${BASE_URL}/users`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching contacts:", error);
//     throw error;
//   }
// };
export const getContacts = async () => {
  try {
    // const response = await fetch(`${BASE_URL}/users`, {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      console.error("No token found in AsyncStorage");
      return [];
    }
    // console.log("Token:", token);
    const response = await fetch(
      "http://192.168.31.211:5000/api/messages/users",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Response Status:", response.status);
    // const text = await response.text(); // Log the raw response
    // console.log("Response Text:", text);

    if (!response.ok) {
      throw new Error("Failed to fetch contacts");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return [];
  }
};
{
  /* chats.map((chat) => (
            <TouchableOpacity
              key={chat.id}
              onPress={() => handleChatPress(chat)}
            >
              <View style={styles.chatItem}>
                <View style={styles.avatarContainer}>
                  <Image
                    source={{ uri: chat.image }}
                    style={styles.chatImage}
                  />
                  {chat.isOnline && <View style={styles.onlineIndicator} />}
                </View>
                <View style={styles.chatDetails}>
                  <Text style={styles.username}>{chat.username}</Text>
                  <Text style={styles.chatText}>{chat.text}</Text>
                </View>
                <View style={styles.chatTimeContainer}>
                  <Text style={styles.timestamp}>{chat.timestamp}</Text>
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
          )) */
}
