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

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadProducts();
    });

    return unsubscribe;
  }, [navigation]);

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

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("ProductDetail", { product: item })}
    >
      <View style={styles.productCard}>
        <Text style={styles.productName}>{item.name}</Text>
        <View style={styles.infoContainer}>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Price</Text>
            <Text style={styles.infoValue}>₵{item.price}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Qty</Text>
            <Text style={styles.infoValue}>{item.quantity}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.plusButton}>
          <Text style={styles.plusButtonText}>+</Text>
        </TouchableOpacity>
      </View>
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
  productCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  productName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
  },
  infoContainer: {
    flexDirection: "row",
    marginRight: 10,
  },
  infoBox: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 10,
    color: "#555",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "bold",
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
});

export default HomeScreen;
