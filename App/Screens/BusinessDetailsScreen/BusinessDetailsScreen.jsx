import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Alert } from "react-native";
import Color from "../../Utils/Color";

export default function BusinessDetailsScreen({ route }) {
    const { jobId } = route.params; // Lấy jobId từ route
    const [jobDetails, setJobDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false); // Quản lý trạng thái Apply
    const [resumes, setResumes] = useState([]); // Danh sách resume
    const [selectedResumeId, setSelectedResumeId] = useState(null); // Resume được chọn

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

    const handleApplyJob = () => {
        if (!selectedResumeId) {
            alert("Vui lòng chọn một resume.");
            return;
        }

        setApplying(true); // Đang apply
        fetch("http://192.168.110.72:8000/api/job-apply", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                job_listing_id: jobId, // jobId từ route
                resume_id: selectedResumeId, // Resume được chọn
            }),
        })
            .then(response => response.json())
            .then(data => {
                setApplying(false); // Kết thúc apply
                alert(data.message || "Job applied successfully!");
            })
            .catch(error => {
                setApplying(false);
                console.error("Lỗi khi apply job:", error);
                alert("Đã xảy ra lỗi khi apply job.");
            });
    };

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

            <View style={{ marginVertical: 20 }}>
                <Text style={styles.sectionTitle}>Chọn Resume:</Text>
                {resumes.map((resume) => (
                    <TouchableOpacity
                        key={resume.id}
                        style={[
                            styles.resumeItem,
                            selectedResumeId === resume.id && styles.selectedResumeItem,
                        ]}
                        onPress={() => setSelectedResumeId(resume.id)}
                    >
                        <Text style={styles.resumeLabel}>{resume.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={{ display: 'flex', flexDirection: 'row', margin: 8, gap: 8 }}>
                <TouchableOpacity style={styles.messagebtn}>
                    <Text style={{ textAlign: 'center', fontFamily: 'outfit-medium', color: Color.PRIMARY, fontSize: 18 }}>Message</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.applybtn}
                    onPress={handleApplyJob}
                    disabled={applying}
                >
                    <Text style={{ textAlign: 'center', fontFamily: 'outfit-medium', color: Color.WHITE, fontSize: 18 }}>
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
