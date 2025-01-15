import {View, Text, FlatList} from 'react-native'
import React, {useEffect} from 'react'
export default function BookingScreen() {
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://192.168.110.65:8000/api/applied-jobs")
            .then(response => response.json())
            .then(data => {
                setAppliedJobs(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Lỗi khi lấy dữ liệu:", error);
                setLoading(false);
            });
    }, []);
    return (
    <View style={{padding:20}}>
        <Text style={{fontFamily:'outfit-medium', fontSize:26}}>My Applied Jobs</Text>
        <View>
<FlatList data={setAppliedJobs} renderItem={({item,index})=>(
<BusinessListItem business={item?.businessList}
status={{item?.applicationStatus}}/>
)}/>
        </View>
    </View>

  )
}