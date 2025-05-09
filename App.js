import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./screens/HomeScreen";
import AddProductScreen from "./screens/AddProductScreen";
import ProductDetailScreen from "./screens/ProductDetailScreen";
import SaleScreen from "./screens/SaleScreen"; // Import SaleScreen

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Product Manager" }}
        />
        <Stack.Screen
          name="AddProduct"
          component={AddProductScreen}
          options={{ title: "Add Product" }}
        />
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={{ title: "Product Details" }}
        />
        <Stack.Screen
          name="SaleScreen"
          component={SaleScreen}
          options={{ title: "Sale Modal" }} // Add SaleScreen here
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
