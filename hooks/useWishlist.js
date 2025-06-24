import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../utils/api";
import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

const fetchRoute = `${api}/api/wishlist`;

export const useWishList = (token) => {
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const socketRef = useRef(null);

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
      console.log("Error fetching wishlist:", error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

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
        await fetchWishlist();
      } catch (error) {
        console.log("Error creating wishlist:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [token, fetchWishlist]
  );

  // ✅ Setup socket connection
  useEffect(() => {
    const setupSocket = async () => {
      if (!token) return;

      const userId = await AsyncStorage.getItem("userId");
      if (!userId) return;

      if (socketRef.current) {
        socketRef.current.disconnect();
      }

      const socket = io(api, {
        auth: { userId },
        transports: ["websocket"],
      });

      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("✅ Socket connected:", socket.id);
      });

      socket.on("wishlist:update", (data) => {
        if (data.userId === userId) {
          console.log("🔁 Received wishlist:update for current user");
          fetchWishlist();
        }
      });

      socket.on("disconnect", () => {
        console.log("❌ Socket disconnected");
      });
    };

    setupSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [token, fetchWishlist]);

  return { createWishList, fetchWishlist, message, isLoading, wishlist };
};
