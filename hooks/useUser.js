import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../utils/api";

const userRoute = `${api}/api/users`;

export const useUsers = () => {
  const [currentUser, setCurrentUser] = useState(null); // ✅ null instead of []
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");

  // Load token and trigger user fetch
  useEffect(() => {
    const loadToken = async () => {
      try {
        const value = await AsyncStorage.getItem("token");
        if (value) {
          setToken(value);
        }
      } catch (e) {
        console.log("Error getting token: ", e);
      }
    };
    loadToken();
  }, []);

  useEffect(() => {
    if (token) {
      getCurrentUser(); // ✅ only after token is available
    }
  }, [token]);

  const getCurrentUser = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${userRoute}/me`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ fixed
        },
      });
      const data = await response.json();

      setCurrentUser(data);
    } catch (error) {
      console.log("Error getting user:", error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const registerUser = async (email, name, phone) => {
    if (!token || !email || !name || !phone) return;
    setIsLoading(true);
    try {
      await fetch(userRoute, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, name, phone }),
      });
    } catch (error) {
      console.log("Error registering user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (name, phone) => {
    if (!token || !name || !phone) return;
    setIsLoading(true);
    try {
      const response = await fetch(userRoute, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ fixed
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phone }),
      });
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.log("Error updating user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    currentUser,
    getCurrentUser,
    isLoading,
    registerUser,
    updateUser,
    message,
  };
};
