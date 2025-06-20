import { useCallback, useEffect, useState } from "react";
import { api } from "../utils/api";
import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

const fetchRoute = `${api}/api/wishlist`;
const socket = io(api); // Connect to backend

export const useWishList = () => {
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");

  // Fetch token once
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

  // Fetch wishlist for this user
  const fetchWishlist = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await fetch(fetchRoute, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const data = await response.json();
      setWishlist(data);
    } catch (error) {
      console.log("error fetching wishlist: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // Toggle wishlist item
  const createWishList = useCallback(
    async (productId) => {
      if (!token) return;
      setIsLoading(true);
      try {
        const response = await fetch(`${fetchRoute}/toggle`, {
          method: "POST",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId }),
        });
        const data = await response.json();
        setMessage(data?.message || "");
        await fetchWishlist(); // 💡 Refresh list after toggle
      } catch (error) {
        console.log("error creating wishlist", error);
      } finally {
        setIsLoading(false);
      }
    },
    [token, fetchWishlist]
  );

  // Listen to Socket.io for real-time wishlist changes
  useEffect(() => {
    if (!token) return;

    const handleWishlistUpdate = ({ userId }) => {
      AsyncStorage.getItem("userId").then((currentUserId) => {
        if (currentUserId === userId) {
          fetchWishlist(); // Only refresh if it’s this user's wishlist
        }
      });
    };

    socket.on("wishlist:update", handleWishlistUpdate);

    return () => {
      socket.off("wishlist:update", handleWishlistUpdate);
    };
  }, [token, fetchWishlist]);

  return { createWishList, fetchWishlist, message, isLoading, wishlist };
};
