import {Text, TouchableOpacity} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import React from "react";
import {useNavigation} from "@react-navigation/native";
export default function PageHeading({title}){
    const navigation=useNavigation();
    return (
        <TouchableOpacity style={{display:'flex',flexDirection:'row',gap:10, alignItems:'center'}}
                          onPress={()=>navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={30} color="black"></Ionicons>
            <Text style={{fontSize:25, fontFamily:'outfit-medium'}}>
                {title}</Text>
        </TouchableOpacity>
    )
}