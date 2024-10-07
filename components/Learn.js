import { useNavigation } from "@react-navigation/native";
import React from "react";
import { useTranslation } from "react-i18next";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";

import { useSelector } from "react-redux";

export const Learn = () => {
  const { t } = useTranslation();
  const isDarkTheme = useSelector((state) => state.auth.theme);
  const navigation = useNavigation();

  const handlePress = () => {
    console.log("Button  pressed");
  };

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
      <Text style={{ fontWeight: "bold", fontSize: 30 }}>Learn</Text>
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
            5 words
          </Text>
        </TouchableOpacity>
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
            10 words
          </Text>
        </TouchableOpacity>
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
            15 words
          </Text>
        </TouchableOpacity>
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
            20 words
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
