import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

const uuidv4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const AddProductScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [details, setDetails] = useState("");
  const [imageUri, setImageUri] = useState(null);

  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Sorry, we need camera roll permissions to make this work!"
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      setImageUri(result.assets[0].uri);
    }
  };

  const saveProduct = async () => {
    if (!name.trim() || !price.trim() || !quantity.trim()) {
      return Alert.alert("Error", "Name, Price, and Quantity are required");
    }

    const newProduct = {
      id: uuidv4(),
      name: name.trim(),
      price: parseFloat(price),
      quantity: parseInt(quantity),
      ...(category && { category: category.trim() }),
      ...(details && { details: details.trim() }),
      image: imageUri || null,
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = await AsyncStorage.getItem("products");
      const products = existing ? JSON.parse(existing) : [];

      products.push(newProduct);
      await AsyncStorage.setItem("products", JSON.stringify(products));

      Alert.alert("Success", "Product has been saved successfully");
      navigation.goBack();
    } catch (error) {
      console.error("Error saving product:", error);
      Alert.alert("Error", "Failed to save product");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageDouble}>
        <TouchableOpacity style={styles.imageContainer} onPress={selectImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <View style={styles.placeholderContainer}>
              <Ionicons name="image-outline" size={50} color="#ccc" />
              <Text style={styles.placeholderText}>Add product image</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Product Name *"
          />

          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              placeholder="Price *"
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              placeholder="Quantity *"
            />
          </View>

          <TextInput
            style={styles.input}
            value={category}
            onChangeText={setCategory}
            placeholder="Category"
          />
        </View>
      </View>

      <TextInput
        style={[styles.input, styles.multilineInput]}
        value={details}
        onChangeText={setDetails}
        placeholder="Product Description"
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity style={styles.saveButton} onPress={saveProduct}>
        <Text style={styles.saveButtonText}>Save Product</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  imageDouble: {
    flexDirection: "row",
    marginBottom: 20,
  },
  formContainer: {
    flex: 1,
    paddingLeft: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%",
  },
  multilineInput: {
    height: 120,
    textAlignVertical: "top",
  },
  imageContainer: {
    width: 150,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  placeholderContainer: {
    width: 150,
    height: 150,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  placeholderText: {
    color: "#888",
    marginTop: 10,
    textAlign: "center",
  },
  saveButton: {
    backgroundColor: "#ff6b6b",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default AddProductScreen;
