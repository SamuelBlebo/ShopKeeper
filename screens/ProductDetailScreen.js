import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";

const ProductDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { product } = route.params;

  const [editing, setEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState({ ...product });

  const handleSave = async () => {
    try {
      const products = JSON.parse(await AsyncStorage.getItem("products")) || [];
      const updatedProducts = products.map((p) =>
        p.id === editedProduct.id ? editedProduct : p
      );
      await AsyncStorage.setItem("products", JSON.stringify(updatedProducts));

      Alert.alert("Saved", "Product updated successfully");
      setEditing(false);
    } catch (error) {
      Alert.alert("Error", "Failed to save the product");
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this product?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const products =
                JSON.parse(await AsyncStorage.getItem("products")) || [];
              const updatedProducts = products.filter(
                (p) => p.id !== product.id
              );
              await AsyncStorage.setItem(
                "products",
                JSON.stringify(updatedProducts)
              );

              Alert.alert("Deleted", "Product deleted successfully");
              navigation.goBack();
            } catch (error) {
              Alert.alert("Error", "Failed to delete the product");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.productImage} />

      {!editing ? (
        <>
          <Text style={styles.productName}>{product.name}</Text>

          <View style={styles.infoContainer}>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Price</Text>
              <Text style={styles.infoValue}>GHS {product.price}</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Quantity</Text>
              <Text style={styles.infoValue}>{product.quantity}</Text>
            </View>
          </View>

          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.detailsText}>
              {product.description || "No description provided."}
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.editButton]}
              onPress={() => setEditing(true)}
            >
              <Ionicons name="create-outline" size={20} color="#fff" />
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={handleDelete}
            >
              <Ionicons name="trash-outline" size={20} color="#fff" />
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            value={editedProduct.name}
            onChangeText={(text) =>
              setEditedProduct({ ...editedProduct, name: text })
            }
            placeholder="Product Name"
          />

          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              value={editedProduct.price}
              onChangeText={(text) =>
                setEditedProduct({ ...editedProduct, price: text })
              }
              placeholder="Price"
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              value={editedProduct.quantity}
              onChangeText={(text) =>
                setEditedProduct({ ...editedProduct, quantity: text })
              }
              placeholder="Quantity"
              keyboardType="numeric"
            />
          </View>

          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={editedProduct.description}
            onChangeText={(text) =>
              setEditedProduct({ ...editedProduct, description: text })
            }
            placeholder="Description"
            multiline
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Ionicons name="save-outline" size={20} color="#fff" />
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setEditing(false)}
            >
              <Ionicons name="close-circle-outline" size={20} color="#fff" />
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F9F9F9",
  },
  productImage: {
    width: 120,
    height: 120,
    borderRadius: 20,
    backgroundColor: "#EDEDED",
    alignSelf: "center",
    marginBottom: 20,
    resizeMode: "contain",
  },
  productName: {
    fontSize: 18,
    fontWeight: "600",
    backgroundColor: "#EDEDED",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    textAlign: "center",
  },
  infoContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
    justifyContent: "space-between",
  },
  infoBox: {
    backgroundColor: "#EDEDED",
    padding: 12,
    borderRadius: 12,
    flex: 1,
    minWidth: "45%",
  },
  infoLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  detailsSection: {
    backgroundColor: "#F3F7FF",
    borderColor: "#2196F3",
    borderWidth: 1,
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  detailsText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  input: {
    backgroundColor: "#EDEDED",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  halfInput: {
    flex: 1,
  },
  multilineInput: {
    height: 120,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 10,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 16,
  },
  editButton: {
    backgroundColor: "#4CAF50",
  },
  deleteButton: {
    backgroundColor: "#f44336",
  },
  saveButton: {
    backgroundColor: "#2196F3",
  },
  cancelButton: {
    backgroundColor: "#9E9E9E",
  },
});
