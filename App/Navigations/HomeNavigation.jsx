import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../Screens/HomeScreen/HomeScreen";
import BusinessDetailsScreen from "../Screens/BusinessDetailsScreen/BusinessDetailsScreen";
import { AntDesign } from "@expo/vector-icons";
import Header from "../Screens/HomeScreen/Header";
const Stack = createStackNavigator();

export default function HomeNavigation() {
  return (
    <Stack.Navigator>
      {/* Trang Home */}
      <Stack.Screen
        name="home"
        component={HomeScreen}
        options={{
          headerShown: false, // Ẩn header ở HomeScreen
        }}
      />

      {/* Trang Chi tiết Công việc */}
      <Stack.Screen
        name="business-details"
        component={BusinessDetailsScreen}
        options={({ navigation }) => ({
          headerShown: true,
          
          title: "Chi tiết Công việc", // Tiêu đề của BusinessDetailsScreen
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()} // Quay lại trang trước
              style={{ marginLeft: 10 }}
            >
              <AntDesign name="back" size={27} color="black" />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
}
