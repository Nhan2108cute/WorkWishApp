import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import Color from "./../../Utils/Color";
import { FlatList } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation

export default function ProfileScreen() {
  const { user } = useUser();
  const navigation = useNavigation(); // Hook for navigation

  const profileMenu = [
    {
      id: 1,
      name: "Home",
      icon: "home",
      action: () => navigation.navigate("home"), // Navigate to Home
    },
    {
      id: 2,
      name: "Job Applied",
      icon: "bookmark-sharp",
      action: () => alert("Job Applied clicked"), // Placeholder action
    },
    {
      id: 3,
      name: "Contact Us",
      icon: "mail",
      action: () => alert("Contact Us clicked"), // Placeholder action
    },
    {
      id: 4,
      name: "Logout",
      icon: "log-out",
      action: () => alert("Logout clicked"), // Placeholder action
    },
  ];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View>
        <View style={{ padding: 20, paddingTop: 30, backgroundColor: Color.PRIMARY }}>
          <Text style={{ fontSize: 30, fontFamily: "outfit-bold", color: Color.WHITE }}>
            Profile
          </Text>
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
            }}
          >
            <Image
              source={{ uri: user.imageUrl }}
              style={{ width: 90, height: 90, borderRadius: 99 }}
            />
            <Text
              style={{
                fontSize: 26,
                marginTop: 8,
                fontFamily: "outfit-medium",
                color: Color.WHITE,
              }}
            >
              {user.fullName}
            </Text>
            <Text
              style={{
                fontSize: 18,
                marginTop: 8,
                fontFamily: "outfit-medium",
                color: Color.WHITE,
              }}
            >
              {user?.primaryEmailAddress.emailAddress}
            </Text>
          </View>
        </View>
        <View style={{ paddingTop: 60 }}>
          <FlatList
            data={profileMenu}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 40,
                  paddingHorizontal: 80,
                }}
                onPress={item.action} // Execute the action for each menu item
              >
                <Ionicons name={item.icon} size={35} color={Color.PRIMARY} />
                <Text style={{ fontFamily: "outfit" }}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </GestureHandlerRootView>
  );
}
