import { useEffect, useState, useCallback } from "react";
import { api } from "../utils/api";
import { io } from "socket.io-client";

const ordersRoute = `${api}/api/orders`;
const socket = io(ordersRoute, {
  transports: ["websocket"],
  autoConnect: true,
});

export const useOrder = (token) => {
  const [orders, setOrders] = useState([]);
  const [singleOrder, setSingleOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // ⚡ Fetch all orders
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setOrderError("");
    try {
      const res = await fetch(ordersRoute, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch orders");

      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setOrderError("Failed to fetch orders");
      console.error("fetchOrders error:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // 🔍 Fetch a single order (memoized)
  const fetchOrderById = useCallback(
    async (id) => {
      setLoading(true);
      setOrderError("");
      try {
        const res = await fetch(`${ordersRoute}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch order");

        const data = await res.json();
        setSingleOrder(data);
      } catch (err) {
        setOrderError("Could not fetch order");
        console.error("fetchOrderById error:", err);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  // 🧾 Create Order (Checkout)
  const createOrder = useCallback(
    async ({ shipping_address, shipping_fee = 0, payment_method = "cash" }) => {
      setLoading(true);
      setOrderError("");
      setCheckoutSuccess(false);

      try {
        const res = await fetch(`${ordersRoute}/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            shipping_address,
            shipping_fee,
            payment_method,
          }),
        });

        if (!res.ok) {
          const errText = await res.text();
          console.log("Checkout error response:", errText);
          throw new Error("Checkout failed");
        }

        const data = await res.json();
        console.log("✅ Order created:", data); // <--- ADD THIS FOR DEBUGGING
        setCheckoutSuccess(true);
        fetchOrders(); // Optional refresh
        return data;
      } catch (err) {
        setOrderError("Checkout failed");
        console.error("createOrder error:", err);
        return null; // prevent undefined return
      } finally {
        setLoading(false);
      }
    },
    [token, fetchOrders]
  );

  // 🔔 Socket listener for live updates
  useEffect(() => {
    if (!token) return;

    const onOrderCreated = (data) => {
      console.log("Order created via socket:", data);
      fetchOrders();
    };

    socket.on("order:created", onOrderCreated);

    return () => {
      socket.off("order:created", onOrderCreated);
    };
  }, [token, fetchOrders]);

  return {
    orders,
    singleOrder,
    fetchOrders,
    fetchOrderById,
    createOrder,
    loading,
    orderError,
    checkoutSuccess,
  };
};
