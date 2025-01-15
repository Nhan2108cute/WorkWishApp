import { View, Text, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';

export default function BookingScreen() {
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Hàm tải dữ liệu
    const fetchAppliedJobs = () => {
        setLoading(true); // Hiển thị trạng thái đang tải
        fetch("http://192.168.110.65:8000/api/applied-jobs")
            .then((response) => response.json())
            .then((data) => {
                setAppliedJobs(data); // Cập nhật dữ liệu
                setLoading(false); // Tắt trạng thái tải
            })
            .catch((error) => {
                console.error("Lỗi khi lấy dữ liệu:", error);
                setLoading(false); // Tắt trạng thái tải
            });
    };

    // Gọi fetch khi component được mount
    useEffect(() => {
        fetchAppliedJobs();
    }, []);

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontFamily: 'outfit-medium', fontSize: 26 }}>My Applied Jobs</Text>
            <View>
                <FlatList
                    data={appliedJobs} // Dữ liệu
                    keyExtractor={(item, index) => index.toString()} // Khóa duy nhất cho mỗi item
                    onRefresh={fetchAppliedJobs} // Gọi lại API khi làm mới
                    refreshing={loading} // Trạng thái loading
                    renderItem={({ item, index }) => (
                        <BusinessListItem business={item?.businessList} booking={item} />
                    )}
                />
            </View>
        </View>
    );
}
