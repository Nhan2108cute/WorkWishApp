import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";

import * as SecureStore from "expo-secure-store";

export default function BusinessDetailsScreen({ route }) {
  const { jobId, applied } = route.params; // Lấy jobId và trạng thái applied
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0"); // Thêm số 0 nếu phút < 10
    return `${day}/${month}/${year} ${hours}:${minutes}`; // Định dạng DD/MM/YYYY HH:mm
  };
  

  useEffect(() => {
    fetch(`http://192.168.110.72:8000/api/jobs/${jobId}`)
      .then((response) => response.json())
      .then((data) => {
        setJobDetails(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy chi tiết công việc:", error);
        setLoading(false);
      });
  }, [jobId]);

  const handleApplyJob = async () => {
    try {
      // Lấy token từ SecureStore
      const token = await SecureStore.getItemAsync("accessToken");
  
      if (!token) {
        Alert.alert("Lỗi", "Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");
        return;
      }
  
      // Gửi yêu cầu ứng tuyển công việc
      const response = await fetch("http://192.168.110.72:8000/api/job-apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
        body: JSON.stringify({ job_id: jobId }),
      });
  
      const responseText = await response.text();
      console.log("Response Text:", responseText);
  
      // Xử lý nếu server trả về HTML
      if (!response.ok || responseText.startsWith("<")) {
        Alert.alert("Lỗi", `Server trả về lỗi: ${response.status}`);
        return;
      }
  
      const data = JSON.parse(responseText); // Parse JSON khi phản hồi hợp lệ
      Alert.alert("Thành công", "Bạn đã nộp đơn ứng tuyển thành công!");
    } catch (error) {
      console.error("Lỗi khi ứng tuyển công việc:", error);
      Alert.alert("Lỗi", "Không thể kết nối đến máy chủ.");
    }
  };
  

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!jobDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Không tìm thấy thông tin công việc.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Tên công ty</Text>
        <Text style={styles.title}>{jobDetails.company_name || "Không rõ công ty"}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Vị trí công việc</Text>
        <Text style={styles.detail}>{jobDetails.title}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mô tả công việc</Text>
        <Text style={styles.description}>{jobDetails.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chi tiết công việc</Text>
        <Text style={styles.detail}>💰 Lương: {jobDetails.salary} VND</Text>
        <Text style={styles.detail}>📅 Ngày tạo: {formatDateTime(jobDetails.created_at)}</Text>
        <Text style={styles.detail}>📍 Địa chỉ: {jobDetails.location}</Text>
      </View>

      {/* Nút Apply Job, chỉ hiển thị nếu chưa applied */}
      {!applied && (
        <TouchableOpacity style={styles.applyButton} onPress={handleApplyJob}>
          <Text style={styles.applyButtonText}>Ứng tuyển công việc</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
  },
  detail: {
    fontSize: 16,
    color: "#555",
    marginVertical: 5,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
  applyButton: {
    backgroundColor: "#007bff",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
