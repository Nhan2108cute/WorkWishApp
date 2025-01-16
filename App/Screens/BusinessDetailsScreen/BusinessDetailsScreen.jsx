import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Color from "../../Utils/Color";

export default function BusinessDetailsScreen({ route, navigation }) {
    const { jobId } = route.params; // Lấy jobId từ route
    const [jobDetails, setJobDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false); // Quản lý trạng thái Apply
    const [resumes, setResumes] = useState([]); // Danh sách resume
    const [selectedResumeId, setSelectedResumeId] = useState(null); // Resume được chọn

    // Lấy chi tiết công việc và danh sách resume
    useEffect(() => {
        async function fetchData() {
            try {
                const token = await AsyncStorage.getItem("access_token");
                if (!token) {
                    throw new Error("No access token found.");
                }

                // Lấy chi tiết công việc
                const jobResponse = await fetch(
                    `http://192.168.110.72:8000/api/jobs/${jobId}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const jobData = await jobResponse.json();
                setJobDetails(jobData);

                // Lấy danh sách resume
                const resumeResponse = await fetch(
                    "http://192.168.110.72:8000/api/resumes",
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const resumeData = await resumeResponse.json();
                setResumes(resumeData.resumes || []);
            } catch (error) {
                console.error("Fetch error:", error.message);
                Alert.alert("Error", "Unable to fetch data. Please log in again.");
                navigation.reset({ index: 0, routes: [{ name: "Login" }] });
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [jobId, navigation]);

    // Hàm xử lý Apply Job
    const handleApplyJob = async () => {
        if (!selectedResumeId) {
            Alert.alert("Error", "Please select a resume.");
            return;
        }

        try {
            setApplying(true);
            const token = await AsyncStorage.getItem("access_token");
            if (!token) {
                throw new Error("No access token found.");
            }

            const response = await fetch("http://192.168.110.72:8000/api/job-apply", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    job_listing_id: jobId, // jobId từ route
                    resume_id: selectedResumeId, // Resume được chọn
                }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert("Success", data.message || "Job applied successfully!");
            } else {
                throw new Error(data.message || "Failed to apply for the job.");
            }
        } catch (error) {
            console.error("Apply error:", error.message);
            Alert.alert("Error", error.message || "Unable to apply for the job.");
        } finally {
            setApplying(false);
        }
    };

    // Hiển thị loading
    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    // Hiển thị lỗi nếu không có chi tiết công việc
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

            {/* Danh sách Resume */}
            <View style={{ marginVertical: 20 }}>
                <Text style={styles.sectionTitle}>Chọn Resume:</Text>
                {resumes.map((resume) => (
                    <TouchableOpacity
                        key={resume.id}
                        style={[
                            styles.resumeItem,
                            selectedResumeId === resume.id && styles.selectedResumeItem,
                        ]}
                        onPress={() => setSelectedResumeId(resume.id)} // Chọn resume
                    >
                        <Text style={styles.resumeLabel}>{resume.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Nút Apply */}
            <View style={{ display: "flex", flexDirection: "row", margin: 8, gap: 8 }}>
                <TouchableOpacity style={styles.messagebtn}>
                    <Text
                        style={{
                            textAlign: "center",
                            fontFamily: "outfit-medium",
                            color: Color.PRIMARY,
                            fontSize: 18,
                        }}
                    >
                        Message
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.applybtn}
                    onPress={handleApplyJob}
                    disabled={applying}
                >
                    <Text
                        style={{
                            textAlign: "center",
                            fontFamily: "outfit-medium",
                            color: Color.WHITE,
                            fontSize: 18,
                        }}
                    >
                        {applying ? "Applying..." : "Apply Now"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#fff" },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
    sectionTitle: { fontSize: 16, fontWeight: "bold", marginVertical: 10 },
    messagebtn: {
        padding: 10,
        backgroundColor: Color.WHITE,
        borderWidth: 1,
        borderColor: Color.PRIMARY,
        borderRadius: 99,
        flex: 1,
    },
    applybtn: {
        padding: 10,
        backgroundColor: Color.PRIMARY,
        borderWidth: 1,
        borderColor: Color.WHITE,
        borderRadius: 99,
        flex: 1,
    },
    resumeItem: {
        padding: 10,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        backgroundColor: "#f9f9f9",
    },
    selectedResumeItem: {
        borderColor: Color.PRIMARY,
        backgroundColor: "#e0f7fa",
    },
    resumeLabel: {
        fontSize: 16,
    },
});
