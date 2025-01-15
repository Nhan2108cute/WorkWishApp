import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Color from "../../Utils/Color";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null); // State để lưu thông tin người dùng
  const [loading, setLoading] = useState(true); // State để hiển thị trạng thái tải

  // Gọi API để lấy thông tin người dùng
  useEffect(() => {
    fetch("http://192.168.110.223:8000/api/login")
      .then((response) => response.json())
      .then((data) => {
        setUser(data); // Cập nhật dữ liệu người dùng
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
        setLoading(false);
      });
  }, []);

  // Hàm xử lý logout
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () =>
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }], // Điều hướng về Login
          }),
      },
    ]);
  };

  // Menu danh sách các tùy chọn
  const profileMenu = [
    {
      id: 1,
      name: "Home",
      icon: "home",
      action: () => navigation.navigate("Home"), // Điều hướng đến Home
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
      action: handleLogout, // Gọi hàm logout
    },
  ];

  // Hiển thị màn hình khi đang tải
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Color.PRIMARY} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Phần đầu hiển thị thông tin người dùng */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Profile</Text>
        <View style={styles.profileInfo}>
          {/* Hiển thị tên và email */}
          <Text style={styles.name}>{user?.name || "N/A"}</Text>
          <Text style={styles.email}>{user?.email || "N/A"}</Text>
        </View>
      </View>

      {/* Menu tùy chọn */}
      <View style={styles.menuContainer}>
        <FlatList
          data={profileMenu}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={item.action} // Gọi hàm action
            >
              <Ionicons name={item.icon} size={35} color={Color.PRIMARY} />
              <Text style={styles.menuText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.BACKGROUND,
  },
  header: {
    padding: 20,
    backgroundColor: Color.PRIMARY,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerText: {
    fontSize: 30,
    fontFamily: "outfit-bold",
    color: Color.WHITE,
    textAlign: "center",
  },
  profileInfo: {
    alignItems: "center",
    marginTop: 20,
  },
  name: {
    fontSize: 26,
    marginTop: 10,
    fontFamily: "outfit-medium",
    color: Color.WHITE,
  },
  email: {
    fontSize: 18,
    marginTop: 5,
    fontFamily: "outfit-medium",
    color: Color.WHITE,
  },
  menuContainer: {
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  menuText: {
    marginLeft: 15,
    fontSize: 18,
    fontFamily: "outfit-medium",
    color: Color.BLACK,
  },
});
