import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

export default function BusinessDetailsScreen({ route }) {
  const { jobId } = route.params; // Lấy jobId từ route
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://192.168.110.72:8000/api/jobs/${jobId}`)
            .then(response => response.json())
            .then(data => {
                setJobDetails(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Lỗi khi lấy chi tiết công việc:", error);
                setLoading(false);
            });

        // Lấy danh sách resume
        fetch("http://192.168.110.72:8000/api/resumes", {
            method: "GET",
        })
            .then(response => response.json())
            .then(data => {
                setResumes(data.resumes || []);
            })
            .catch(error => {
                console.error("Lỗi khi lấy danh sách resume:", error);
            });
    }, [jobId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!jobDetails) {
    return (
      <View style={styles.container}>
        <Text>Không tìm thấy thông tin công việc.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{jobDetails.title}</Text>
      <Text style={styles.sectionTitle}>Mô tả công việc:</Text>
      <Text>{jobDetails.description}</Text>
      <Text style={styles.sectionTitle}>Chi tiết:</Text>
      <Text>Lương: {jobDetails.salary} VND</Text>
      <Text>Ngày tạo: {jobDetails.created_at}</Text>
      <Text>Trạng thái: {jobDetails.status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginVertical: 10 },
});
