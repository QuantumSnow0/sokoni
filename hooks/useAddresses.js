import { useState, useCallback } from "react";
import { api } from "../utils/api";

export const useAddresses = (token) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAddresses = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${api}/api/addresses`, {
        headers: { Authorization: token },
      });
      const data = await res.json();
      setAddresses(data);
    } catch (err) {
      console.log("Error fetching addresses:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const createAddress = async (address) => {
    try {
      const res = await fetch(`${api}/api/addresses`, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(address),
      });
      const data = await res.json();
      fetchAddresses();
      return data;
    } catch (e) {
      console.error("Create address error:", e);
    }
  };

  const updateAddress = async (id, address) => {
    try {
      const res = await fetch(`${api}/api/addresses/${id}`, {
        method: "PUT",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(address),
      });
      await res.json();
      fetchAddresses();
    } catch (e) {
      console.error("Update address error:", e);
    }
  };

  const deleteAddress = async (id) => {
    try {
      await fetch(`${api}/api/addresses/${id}`, {
        method: "DELETE",
        headers: { Authorization: token },
      });
      fetchAddresses();
    } catch (e) {
      console.error("Delete address error:", e);
    }
  };

  return {
    addresses,
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    loading,
  };
};
