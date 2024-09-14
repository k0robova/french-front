import React, { useEffect } from "react";
import { Image } from "expo-image";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export const IntroScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("Registration");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../images/2024-09-14 13.37.15.jpg")}
        style={styles.imageIntro}
        contentFit="cover"
        shouldPlay
        isLooping={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageIntro: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
