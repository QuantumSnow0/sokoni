import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import OrderStatusTracker from "../components/OrderStatusTracker";

// Define status steps in correct flow
const statusSteps = [
  "placed",
  "confirmed",
  "out_for_delivery",
  "shipped",
  "delivered",
  "cancelled",
  "rejected",
];

const OrdersItem = ({ data }) => {
  const [isDisplayed, setIsDisplayed] = useState(false);

  const itemCount = data.items?.reduce((sum, item) => sum + item.quantity, 0);
  const createdDate = new Date(data.created_at).toDateString();

  const currentStatus = data.status?.toLowerCase();
  const currentStatusIndex = statusSteps.indexOf(currentStatus);

  const isFinalFailure =
    currentStatus === "cancelled" || currentStatus === "rejected";

  const steps = statusSteps.map((label, index) => {
    let stepStatus = "pending";
    if (index < currentStatusIndex) {
      stepStatus = "done";
    } else if (index === currentStatusIndex) {
      stepStatus = isFinalFailure ? "failed" : "done";
    } else if (isFinalFailure) {
      stepStatus = "failed";
    }

    return {
      label: label.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      date: index <= currentStatusIndex ? createdDate : "Pending",
      status: stepStatus,
    };
  });

  return (
    <View style={{ paddingTop: 30, paddingHorizontal: 15 }}>
      <View style={styles.defaultV}>
        <View style={styles.defaultContainer}>
          <View style={styles.leftSection}>
            <View style={styles.iconWrapper}>
              <Ionicons
                name="cart-outline"
                size={40}
                color="#6cc51d"
                style={{ margin: 10, padding: 5 }}
              />
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.orderTitle}>Order #{data.id}</Text>
              <Text style={styles.orderDate}>Placed on {createdDate}</Text>
              <View style={styles.row}>
                <Text style={styles.secondaryText}>Items: {itemCount}</Text>
                <Text style={styles.price}>Total: ksh {data.total_amount}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={() => setIsDisplayed(!isDisplayed)}>
            <Ionicons
              name={
                isDisplayed
                  ? "caret-up-circle-outline"
                  : "caret-down-circle-outline"
              }
              size={24}
              color="#6cc51d"
            />
          </TouchableOpacity>
        </View>
      </View>
      {isDisplayed && (
        <View style={styles.inputField}>
          <OrderStatusTracker steps={steps} />
        </View>
      )}
    </View>
  );
};

export default OrdersItem;

const styles = StyleSheet.create({
  defaultContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },
  defaultV: {
    backgroundColor: "#fff",
  },
  inputField: {
    backgroundColor: "#fff",
    marginTop: 5,
  },
  iconWrapper: {
    backgroundColor: "rgba(108, 197, 29, 0.1)",
    borderRadius: 999,
  },
  leftSection: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  textWrapper: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 2,
  },
  orderTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  orderDate: {
    fontSize: 15,
    color: "#868889",
  },
  row: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
  },
  secondaryText: {
    fontSize: 15,
    color: "#868889",
  },
  price: {
    fontSize: 15,
    fontWeight: "700",
  },
});
