import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../utils/api";
const userRoute = `${api}/api/users`;
export const useUsers = () => {
  const [currentUser, setCurrentUser] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState("");
  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem("token");
        if (value !== null) {
          setToken(value);
        }
      } catch (e) {
        console.log("error getting token: ", e);
      }
    };
    getData();
  }, []);
  const getCurrentUser = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${userRoute}/me`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setCurrentUser(data);
    } catch (error) {
      console.log("error getting user: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);
  const registerUser = async (email, name, phone) => {
    if (!token) return;
    if ((!email, !name, !phone)) return;
    setIsLoading(true);
    try {
      const response = await fetch(userRoute, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email,
          name,
          phone,
        }),
      });
    } catch (error) {
      console.log("error registering user: ", error);
    } finally {
      setIsLoading(false);
    }
  };
  return { currentUser, getCurrentUser, isLoading, registerUser };
};
