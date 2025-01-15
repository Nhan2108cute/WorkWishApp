import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import Header from "./Header"; // Giữ nguyên Header
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetch("http://192.168.110.223:8000/api/jobs")
      .then(response => response.json())
      .then(data => {
        setJobs(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Lỗi khi lấy dữ liệu:", error);
        setLoading(false);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Header />

      <Text style={styles.title}>Danh sách công việc</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.jobItem}
              onPress={() => navigation.navigate("business-details", { jobId: item.id })}
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
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  jobItem: { padding: 10, borderBottomWidth: 1, borderColor: "#ccc" },
  jobTitle: { fontSize: 18, fontWeight: "bold" },
  salary: { color: "green", fontWeight: "bold" },
});
