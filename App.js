import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import Login from "./App/Screens/LoginScreen/Login";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import TabNavigation from "./App/Navigations/TabNavigation";
import ProfileScreen from "./App/Screens/ProfileScreen/ProfileScreen";
import BusinessDetails from "./App/Screens/BusinessDetailsScreen/BusinessDetailsScreen"; // Đường dẫn đến màn hình BusinessDetails
const Stack = createStackNavigator();
<Stack.Navigator screenOptions={{ headerShown: false }}>
  {/* Các màn hình khác */}
  <Stack.Screen name="business-details" component={BusinessDetails} />
</Stack.Navigator>



const tokenCache = {
  async getToken(key) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      console.error("Error getting token:", err);
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      console.error("Error saving token:", err);
    }
  },
  async clearToken(key) {
    try {
      return SecureStore.deleteItemAsync(key);
    } catch (err) {
      console.error("Error clearing token:", err);
    }
  },
};

export default function App() {
  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey="pk_test_ZHluYW1pYy1idXJyby05My5jbGVyay5hY2NvdW50cy5kZXYk"
    >
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* If user is signed out, show Login screen */}
          <Stack.Screen name="Login" component={Login} />
          {/* If user is signed in, show the TabNavigation */}
          <Stack.Screen name="TabNavigation" component={TabNavigation} />
        </Stack.Navigator>
      </NavigationContainer>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Đảm bảo bố cục chiếm toàn bộ màn hình
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
