import { View, Text, Image, StyleSheet, TextInput } from "react-native";
import React from "react";
import { useUser } from "@clerk/clerk-expo";
import Color from "../../Utils/Color";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function Header() {
  const { user, isLoading } = useUser();
  return (
    user && (
      <View style={styles.container}>
        {/* Profile Section */}
        <View style={styles.profileMainContainer}>
          <View style={styles.profileContainer}>
            <Image source={{ uri: user?.imageUrl }} style={styles.userImage} />
            <View>
              <Text style={{ color: Color.WHITE }}>Welcome,</Text>
              <Text style={{ color: Color.WHITE, fontSize: 20 }}>
                {user?.fullName}
              </Text>
            </View>
          </View>
          <FontAwesome name="bookmark-o" size={27} color="white" />
        </View>
        {/* Search Section */}
        <View style={styles.searchBarContainer}>
            <TextInput placeholder='Search'
            style={styles.textInput}/>
            <FontAwesome name="search" 
            style={styles.searchbtn}
            size={27} color="black" />
        </View>
      </View>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: Color.PRIMARY,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  profileContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  profileMainContainer: {
    display: "flex",
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
    padding:7,
    paddingHorizontal:16,
    backgroundColor:Color.WHITE,
    borderRadius:8,
    width:'85%',
    fontSize:16
  },
  searchBarContainer: {
    marginTop: 15,
    display:'flex',
    flexDirection:'row',
    gap:10,
    marginBottom:10
  },
  searchbtn:{
    backgroundColor:Color.WHITE,
    padding:10,
    borderRadius:8
  }
});
