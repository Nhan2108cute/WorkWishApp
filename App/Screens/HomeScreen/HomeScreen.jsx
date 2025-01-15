import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Color from "../../Utils/Color";

export default function HomeScreen() {
  const { user, isLoaded } = useUser(); // Lấy thông tin người dùng từ Clerk
  const [jobs, setJobs] = useState([]); // Danh sách công việc
  const [filteredJobs, setFilteredJobs] = useState([]); // Kết quả tìm kiếm
  const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // Lấy dữ liệu công việc từ API
  useEffect(() => {
    fetch("http://192.168.110.72:8000/api/jobs")
      .then((response) => response.json())
      .then((data) => {
        setJobs(data);
        setFilteredJobs(data); // Mặc định hiển thị tất cả công việc
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu:", error);
        setLoading(false);
      });
  }, []);

  // Hàm xử lý tìm kiếm
  const handleSearch = (text) => {
    setSearchTerm(text);
    if (text.trim() === "") {
      setFilteredJobs(jobs); // Nếu không có từ khóa, hiển thị toàn bộ danh sách
    } else {
      const filtered = jobs.filter((job) =>
        job.title.toLowerCase().includes(text.toLowerCase()) ||
        job.description.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredJobs(filtered);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        {/* Phần thông tin người dùng */}
        {isLoaded && user && (
          <View style={styles.profileMainContainer}>
            <View style={styles.profileContainer}>
              <Image source={{ uri: user.imageUrl }} style={styles.userImage} />
              <View>
                <Text style={{ color: Color.WHITE }}>Welcome,</Text>
                <Text style={{ color: Color.WHITE, fontSize: 20 }}>
                  {user.fullName}
                </Text>
              </View>
            </View>
            <FontAwesome name="bookmark-o" size={27} color="white" />
          </View>
        )}
        {/* Phần tìm kiếm */}
        <View style={styles.searchBarContainer}>
          <TextInput
            placeholder="Search"
            style={styles.textInput}
            value={searchTerm}
            onChangeText={handleSearch} // Gọi hàm xử lý tìm kiếm khi nhập liệu
          />
          <FontAwesome
            name="search"
            style={styles.searchbtn}
            size={27}
            color="black"
          />
        </View>
      </View>

      {/* Nội dung màn hình */}
      <Text style={styles.title}>Danh sách công việc</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={filteredJobs} // Hiển thị danh sách đã lọc
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.jobItem}
              onPress={() =>
                navigation.navigate("business-details", { jobId: item.id })
              }
            >
              <Text style={styles.jobTitle}>{item.title}</Text>
              <Text>{item.description}</Text>
              <Text style={styles.salary}>💰 Lương: {item.salary}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerContainer: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: Color.PRIMARY,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  profileMainContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userImage: {
    width: 45,
    height: 45,
    borderRadius: 99,
  },
  textInput: {
    padding: 7,
    paddingHorizontal: 16,
    backgroundColor: Color.WHITE,
    borderRadius: 8,
    width: "85%",
    fontSize: 16,
  },
  searchBarContainer: {
    marginTop: 15,
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  searchbtn: {
    backgroundColor: Color.WHITE,
    padding: 10,
    borderRadius: 8,
  },
  title: { fontSize: 20, fontWeight: "bold", margin: 20 },
  jobItem: { padding: 10, borderBottomWidth: 1, borderColor: "#ccc" },
  jobTitle: { fontSize: 18, fontWeight: "bold" },
  salary: { color: "green", fontWeight: "bold" },
});
