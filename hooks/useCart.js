import { useCallback, useEffect, useState } from "react";
import { api } from "../utils/api";
import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

const fetchRoute = `${api}/api/cart`;
const socket = io(api, { transports: ["websocket"], autoConnect: false }); // Don't auto-connect until userId is set

export const useCart = (token) => {
  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Fetch Cart Items
  const fetchCart = useCallback(async () => {
    if (!token) return;
    setCartLoading(true);
    try {
      const res = await fetch(fetchRoute, {
        headers: {
          Authorization: token,
        },
      });
      const data = await res.json();
      setCart(data);
    } catch (err) {
      console.log("❌ Error fetching cart:", err);
    } finally {
      setCartLoading(false);
    }
  }, [token]);

  // ✅ Add Item to Cart
  const addToCart = useCallback(
    async (productId, quantity = 1) => {
      if (!token || !productId) return;
      setCartLoading(true);
      try {
        const res = await fetch(`${fetchRoute}/add`, {
          method: "POST",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId, quantity }),
        });
        const data = await res.json();
        setMessage(data.message || "");
        await fetchCart();
      } catch (err) {
        console.log("❌ Error adding to cart:", err);
      } finally {
        setCartLoading(false);
      }
    },
    [token, fetchCart]
  );

  // ✅ Update Item Quantity
  const updateCartItem = useCallback(
    async (id, quantity) => {
      if (!token || !id) return;
      try {
        await fetch(`${fetchRoute}/update`, {
          method: "PUT",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, quantity }),
        });
        await fetchCart();
      } catch (err) {
        console.log("❌ Error updating item:", err);
      }
    },
    [token, fetchCart]
  );

  // ✅ Delete One Item
  const deleteCartItem = useCallback(
    async (id) => {
      if (!token || !id) return;
      try {
        await fetch(`${fetchRoute}/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: token,
          },
        });
        await fetchCart();
      } catch (err) {
        console.log("❌ Error deleting item:", err);
      }
    },
    [token, fetchCart]
  );

  // ✅ Clear Entire Cart
  const clearCart = useCallback(async () => {
    if (!token) return;
    try {
      await fetch(`${fetchRoute}/clear/all`, {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      });
      await fetchCart();
    } catch (err) {
      console.log("❌ Error clearing cart:", err);
    }
  }, [token, fetchCart]);

  // ✅ Setup WebSocket and Listen for Cart Events
  useEffect(() => {
    const setupSocket = async () => {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId || !token) return;

      socket.auth = { userId }; // ⬅️ Send Clerk ID to backend
      socket.connect();

      socket.on("cart:updated", (data) => {
        console.log("🟢 Cart updated via socket:", data);
        fetchCart(); // Refresh cart when notified
      });

      socket.on("connect_error", (err) => {
        console.error("❌ Socket connect error:", err.message);
      });

      return () => {
        socket.off("cart:updated");
        socket.disconnect();
      };
    };

    setupSocket();
  }, [token, fetchCart]);

  return {
    cart,
    message,
    cartLoading,
    fetchCart,
    addToCart,
    updateCartItem,
    deleteCartItem,
    clearCart,
  };
};
