import { useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { api } from "../utils/api";

const productRoute = `${api}/api/products`;

// ✅ Singleton socket instance
const socket = io(api, { transports: ["websocket"], autoConnect: true });

export const useProducts = (token) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = useCallback(
    async ({
      minPrice = 0,
      maxPrice = 999999,
      category = "",
      sort = "",
    } = {}) => {
      if (!token) return;
      setIsLoading(true);
      try {
        const query = new URLSearchParams();

        query.append("minPrice", minPrice);
        query.append("maxPrice", maxPrice);

        if (category) query.append("category", category);
        if (sort) query.append("sort", sort);

        const url = `${productRoute}?${query.toString()}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.log("Error fetching filtered products:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    fetchProducts(); // ✅ Initial fetch with default filters

    const handleNew = (newProduct) => {
      setProducts((prev) => {
        const exists = prev.some((p) => p.id === newProduct.id);
        return exists ? prev : [newProduct, ...prev];
      });
    };

    const handleUpdate = (updatedProduct) => {
      setProducts((prev) =>
        prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      );
    };

    const handleDelete = (deletedId) => {
      setProducts((prev) => prev.filter((p) => p.id !== Number(deletedId)));
    };

    socket.on("product:new", handleNew);
    socket.on("product:update", handleUpdate);
    socket.on("product:delete", handleDelete);

    return () => {
      socket.off("product:new", handleNew);
      socket.off("product:update", handleUpdate);
      socket.off("product:delete", handleDelete);
    };
  }, [fetchProducts]);

  return {
    products,
    isLoading,
    fetchProducts,
  };
};
