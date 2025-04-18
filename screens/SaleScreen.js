import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";

const SaleScreen = ({ route, navigation }) => {
  const { saleProducts, setSaleProducts } = route.params;
  const [products, setProducts] = useState(saleProducts);

  const removeProduct = (id) => {
    const updatedProducts = products.filter((product) => product.id !== id);
    setProducts(updatedProducts);
    setSaleProducts(updatedProducts); // Update the saleProducts in HomeScreen
  };

  const calculateTotal = () => {
    return products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.productRow}>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productInfo}>Qty: {item.quantity}</Text>
      <Text style={styles.productInfo}>Cost: ₵{item.price}</Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => removeProduct(item.id)}
      >
        <Text style={styles.deleteButtonText}>X</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No products in the sale</Text>
        }
      />
      <View style={styles.totalContainer}>
        <TouchableOpacity
          style={styles.saleButton}
          onPress={() => {
            setSaleProducts([]); // Clear the saleProducts in HomeScreen
            navigation.goBack(); // Navigate back to HomeScreen
          }}
        >
          <Text style={styles.saleButtonText}>Sold</Text>
        </TouchableOpacity>
        <Text style={styles.totalText}>GH₵ {calculateTotal().toFixed(2)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  productInfo: {
    fontSize: 14,
    marginHorizontal: 10,
  },
  deleteButton: {
    backgroundColor: "#ff6b6b",
    borderRadius: 10,
    padding: 10,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  saleButton: {
    backgroundColor: "#ff6b6b",
    padding: 15,
    borderRadius: 10,
  },
  saleButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
});

export default SaleScreen;
