import { useCallback, useEffect, useState } from "react";
import { api } from "../utils/api";
import { io } from "socket.io-client";

const productRoute = `${api}/api/products`;
const socket = io(api); // 👈 Connect to backend

export const useProducts = (token) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await fetch(productRoute, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.log("error fetching products: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProducts(); // Initial fetch

    // 💡 Handle real-time updates
    socket.on("product:new", (newProduct) => {
      setProducts((prev) => {
        const exists = prev.some((p) => p.id === newProduct.id);
        return exists ? prev : [newProduct, ...prev];
      });
    });

    socket.on("product:update", (updatedProduct) => {
      setProducts((prev) =>
        prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      );
    });

    socket.on("product:delete", (deletedId) => {
      setProducts((prev) => prev.filter((p) => p.id !== Number(deletedId)));
    });

    // Cleanup on unmount
    return () => {
      socket.off("product:created");
      socket.off("product:updated");
      socket.off("product:deleted");
    };
  }, [fetchProducts]);

  return { products, isLoading, fetchProducts };
};
