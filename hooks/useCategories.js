import { useEffect, useState, useCallback } from "react";
import { api } from "../utils/api";
import { io } from "socket.io-client";

// Create and reuse one socket instance
const socket = io(api, { transports: ["websocket"], autoConnect: true });

export const useCategories = () => {
  const [categories, setCategories] = useState([]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(`${api}/api/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Fetch categories failed", err);
    }
  }, []);

  useEffect(() => {
    fetchCategories();

    // 🔥 Handle live updates
    socket.on("category:new", (cat) => {
      setCategories((prev) => [cat, ...prev]);
    });

    socket.on("category:update", (updated) => {
      setCategories((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );
    });

    socket.on("category:delete", (deletedId) => {
      setCategories((prev) => prev.filter((c) => c.id !== deletedId));
    });

    return () => {
      socket.off("category:new");
      socket.off("category:update");
      socket.off("category:delete");
    };
  }, [fetchCategories]);

  return { categories, fetchCategories };
};
