import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

export const Train = () => {
  const navigation = useNavigation();
  const isDarkTheme = useSelector((state) => state.auth.theme);
  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDarkTheme ? "#67104c" : "white" },
      ]}
    >
      <TouchableOpacity
        onPress={() => navigation.navigate("LearnOrTrainTopic")}
      >
        <AntDesign
          name="arrowleft"
          size={24}
          color={isDarkTheme ? "white" : "#67104c"}
        />
      </TouchableOpacity>

      <View style={styles.linkContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isDarkTheme ? "white" : "#67104c" },
          ]}
          onPress={() => handlePress()}
        >
          <Text
            style={{
              color: isDarkTheme ? "#67104c" : "white",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Train
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  linkContainer: {
    justifyContent: "center", // Вирівнює кнопки по вертикалі по центру
    alignItems: "center", // Вирівнює кнопки по горизонталі по центру
  },
  button: {
    marginTop: 18,
    marginBottom: 4,
    borderRadius: 100,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: 343,
    height: 51,
  },
});
