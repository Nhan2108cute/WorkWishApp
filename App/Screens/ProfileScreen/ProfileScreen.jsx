import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen({ route, navigation }) {
  const [user, setUser] = useState(route.params?.user || null);
  const [loading, setLoading] = useState(!user);

  // Fetch user data if not available
  useEffect(() => {
    if (!user) {
      async function fetchUserData() {
        try {
          const token = await AsyncStorage.getItem("access_token");

          if (!token) {
            throw new Error("No access token found.");
          }

          const response = await fetch("http://192.168.110.65:8000/api/users", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json();

          if (response.ok && data.user_profile) {
            setUser(data.user_profile);
          } else {
            throw new Error("Failed to fetch user data.");
          }
        } catch (error) {
          console.error("Fetch error:", error.message);
          Alert.alert("Error", "Unable to fetch user data. Please log in again.");
          navigation.reset({ index: 0, routes: [{ name: "Login" }] });
        } finally {
          setLoading(false);
        }
      }

      fetchUserData();
    }
  }, [user, navigation]);

  // Logout handler
  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          await AsyncStorage.removeItem("access_token");
          navigation.reset({ index: 0, routes: [{ name: "Login" }] });
        },
      },
    ]);
  };

  // Menu options for navigation
  const menuOptions = [
    {
      id: 1,
      name: "Home",
      icon: "home",
      action: () => navigation.navigate("home"),
    },
    {
      id: 2,
      name: "Logout",
      icon: "log-out",
      action: handleLogout,
    },
  ];

  // Show loading indicator while fetching data
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>No user data available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Profile</Text>
      </View>

      {/* User Info */}
      <View style={styles.profileInfo}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <Text style={styles.phone}>{user.phone || "N/A"}</Text>
      </View>

      {/* Menu Options */}
      <FlatList
        data={menuOptions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.menuItem} onPress={item.action}>
            <Ionicons name={item.icon} size={24} color="#000" />
            <Text style={styles.menuText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  profileInfo: {
    marginVertical: 20,
    alignItems: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  email: {
    fontSize: 16,
    color: "#555",
  },
  phone: {
    fontSize: 16,
    color: "#555",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 1,
  },
  menuText: {
    marginLeft: 15,
    fontSize: 18,
    fontWeight: "500",
  },
});
