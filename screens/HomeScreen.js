import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const HomeScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [saleProducts, setSaleProducts] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadProducts(); // Reload products when the screen regains focus
      updateSaleSummary(); // Update the sale summary
    });

    return unsubscribe;
  }, [navigation, saleProducts]);

  const loadProducts = async () => {
    try {
      const data = await AsyncStorage.getItem("products");
      if (data) {
        const parsedData = JSON.parse(data);
        const sortedProducts = parsedData.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setProducts(sortedProducts);
      }
    } catch (e) {
      console.error("Failed to load products", e);
      Alert.alert("Error", "Failed to load products");
    }
  };

  const addToSale = (product) => {
    const existingProduct = saleProducts.find((p) => p.id === product.id);
    if (existingProduct) {
      const updatedSaleProducts = saleProducts.map((p) =>
        p.id === product.id
          ? { ...p, quantity: p.quantity + 1, cost: p.cost + product.price }
          : p
      );
      setSaleProducts(updatedSaleProducts);
    } else {
      setSaleProducts([
        ...saleProducts,
        { ...product, quantity: 1, cost: product.price },
      ]);
    }

    updateSaleSummary();
  };

  const updateSaleSummary = () => {
    const totalQty = saleProducts.reduce(
      (sum, product) => sum + product.quantity,
      0
    );
    const totalCost = saleProducts.reduce(
      (sum, product) => sum + product.cost,
      0
    );

    setTotalQuantity(totalQty);
    setTotalCost(totalCost);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productRow}
      onPress={() => navigation.navigate("ProductDetail", { product: item })}
    >
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productInfo}>Qty: {item.quantity}</Text>
      <Text style={styles.productInfo}>₵{item.price}</Text>
      <TouchableOpacity
        style={styles.plusButton}
        onPress={() => addToSale(item)}
      >
        <Text style={styles.plusButtonText}>+</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search products..."
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.cardsContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sales</Text>
          <Text style={styles.cardAmount}>₵1,500.00</Text>
          <Text style={styles.cardSubtitle}>Today</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Products</Text>
          <Text style={styles.cardAmount}>{products.length}</Text>
          <Text style={styles.cardSubtitle}>Total</Text>
        </View>

        <TouchableOpacity
          style={[styles.card, styles.iconCard]}
          onPress={() => navigation.navigate("AddProduct")}
        >
          <Ionicons name="cube-outline" size={40} color="white" />
          <Ionicons
            name="add-circle"
            size={24}
            color="white"
            style={styles.addIcon}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No products found</Text>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <View style={styles.saleFooter}>
        <TouchableOpacity
          style={styles.saleButton}
          onPress={() =>
            navigation.navigate("SaleScreen", {
              saleProducts,
              setSaleProducts,
            })
          }
        >
          <Text style={styles.saleButtonText}>Sale</Text>
        </TouchableOpacity>
        <Text style={styles.totalQuantity}>{totalQuantity}</Text>
        <Text style={styles.totalCost}>₵{totalCost.toFixed(2)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: "#ff6b6b",
    padding: 10,
    borderRadius: 10,
  },
  cardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#ff6b6b",
    width: "30%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  cardTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cardAmount: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  cardSubtitle: {
    color: "#fff",
    fontSize: 14,
    marginTop: 5,
  },
  iconCard: {
    position: "relative",
    justifyContent: "center",
  },
  addIcon: {
    position: "absolute",
    bottom: 10,
    right: 10,
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
    flex: 2,
  },
  productInfo: {
    fontSize: 14,
    flex: 1,
    textAlign: "center",
  },
  plusButton: {
    backgroundColor: "#ff6b6b",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  plusButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
  saleFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#eee",
    borderRadius: 10,
    marginTop: 10,
  },
  totalQuantity: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
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
  totalCost: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});

export default HomeScreen;
