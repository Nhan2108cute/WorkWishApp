import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import Color from "../../Utils/Color";
import * as WebBrowser from "expo-web-browser";
import { useWarmUpBrowser } from "../../warmUpBrowser";
import { useOAuth } from "@clerk/clerk-expo";

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  useWarmUpBrowser();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow();

      if (createdSessionId) {
        setActive({ session: createdSessionId });
      } else {
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);
  return (
    <View style={{ alignItems: "center" }}>
      <Image
        source={require("./../../../assets/images/login.png")}
        style={styles.loginImage}
      />
      <View style={styles.subContainer}>
        <Text style={{ fontSize: 27, color: Color.WHITE, textAlign: "center" }}>
          Let's Find
          <Text style={{ fontWeight: "bold" }}>
            Professianal Cleaning and repair
          </Text>{" "}
          Service
        </Text>
        <Text
          style={{
            fontSize: 17,
            color: Color.WHITE,
            textAlign: "center",
            marginTop: 20,
          }}
        >
          Best App to find service near you which deliver you a professional
          service
        </Text>

        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Text
            style={{ textAlign: "center", fontSize: 17, color: Color.PRIMARY }}
          >
            Let's Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  loginImage: {
    width: 230,
    height: 450,
    marginTop: 70,
    borderWidth: 4,
    borderColor: Color.BALCK,
    borderRadius: 15,
  },
  subContainer: {
    width: "100%",
    backgroundColor: Color.PRIMARY,
    height: "70%",
    marginTop: -20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  button: {
    padding: 15,
    backgroundColor: Color.WHITE,
    borderRadius: 99,
    marginTop: 40,
  },
});
