import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import Login from './App/Screens/LoginScreen/Login';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo';
import * as SecureStore from "expo-secure-store";
import { NavigationContainer } from '@react-navigation/native';
import TabNavigation from './App/Navigations/TabNavigation';

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
};

export default function App() {
  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey="pk_test_ZHluYW1pYy1idXJyby05My5jbGVyay5hY2NvdW50cy5kZXYk"
    >
      <StatusBar style="auto" />
      {/* Sign In Component */}
      <SignedIn>
        <NavigationContainer>
          <TabNavigation />
        </NavigationContainer>
      </SignedIn>
      {/* Sign Out */}
      <SignedOut>
        <Login />
      </SignedOut>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Đảm bảo bố cục chiếm toàn bộ màn hình
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
