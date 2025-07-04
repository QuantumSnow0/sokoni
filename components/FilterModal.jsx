import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import Slider from "@react-native-community/slider";

const { height } = Dimensions.get("window");

export default function FilterModal({
  visible,
  onClose,
  categories,
  selectedCategory,
  setSelectedCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  selectedSort,
  setSelectedSort,
  onReset,
  fetchProducts, // ✅ now passed directly for API call
  setVisible, // ✅ to close the modal after applying
}) {
  const sortOptions = [
    { label: "Newest", value: "newest" },
    { label: "Price: Low to High", value: "priceAsc" },
    { label: "Price: High to Low", value: "priceDesc" },
  ];

  const handleApply = () => {
    fetchProducts({
      minPrice,
      maxPrice,
      category: selectedCategory || "",
      sort: selectedSort || "",
    });

    setVisible(false); // ✅ Close modal after applying
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>Filter Products</Text>

          {/* Categories */}
          <Text style={styles.subtitle}>Category</Text>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.label;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() =>
                  setSelectedCategory((prev) =>
                    prev === cat.label ? null : cat.label
                  )
                }
                style={[
                  styles.option,
                  { backgroundColor: isSelected ? "#6CC51D" : "#eee" },
                ]}
              >
                <Text
                  style={{
                    color: isSelected ? "#fff" : "#333",
                    fontWeight: "600",
                  }}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}

          {/* Price */}
          <Text style={styles.subtitle}>
            Price Range: Ksh {minPrice} - {maxPrice}
          </Text>
          <Slider
            style={{ width: "100%", height: 40 }}
            minimumValue={0}
            maximumValue={5000}
            step={100}
            value={maxPrice}
            onValueChange={setMaxPrice}
            minimumTrackTintColor="#6CC51D"
            maximumTrackTintColor="#ccc"
          />

          {/* Sort */}
          <Text style={styles.subtitle}>Sort By</Text>
          {sortOptions.map((opt) => {
            const isSelected = selectedSort === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                onPress={() =>
                  setSelectedSort((prev) =>
                    prev === opt.value ? null : opt.value
                  )
                }
                style={[
                  styles.option,
                  { backgroundColor: isSelected ? "#6CC51D" : "#eee" },
                ]}
              >
                <Text
                  style={{
                    color: isSelected ? "#fff" : "#333",
                    fontWeight: "600",
                  }}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}

          {/* Buttons */}
          <View style={styles.buttons}>
            <TouchableOpacity
              onPress={() => {
                onReset();
                setVisible(false); // close modal after reset
              }}
              style={[styles.btn, { backgroundColor: "#ccc" }]}
            >
              <Text style={{ fontWeight: "bold" }}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleApply}
              style={[styles.btn, { backgroundColor: "#6CC51D" }]}
            >
              <Text style={{ fontWeight: "bold", color: "#fff" }}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  content: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: height * 0.8,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 5,
  },
  option: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  btn: {
    flex: 1,
    marginHorizontal: 5,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
});
