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

export const getContacts = async () => {
  try {
    // const response = await fetch(, {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      console.error("No token found in AsyncStorage");
      return [];
    }
    const response = await fetch(`${BASE_URL}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch contacts");
    } else {
      return response.json();
    }
    
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return [];
  }
};

