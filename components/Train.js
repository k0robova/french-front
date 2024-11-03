import React from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { defaultStyles } from "./defaultStyles";

export const Train = () => {
  const navigation = useNavigation();
  const isDarkTheme = useSelector((state) => state.auth.theme);
  return (
    <SafeAreaView
      style={[
        defaultStyles.container,
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

      <View style={defaultStyles.btnContainer}>
        <TouchableOpacity
          style={[
            defaultStyles.button,
            { backgroundColor: isDarkTheme ? "white" : "#67104c" },
          ]}
          onPress={() => handlePress()}
        >
          <Text
            style={[
              defaultStyles.btnText,
              {
                color: isDarkTheme ? "#67104c" : "white",
              },
            ]}
          >
            Train
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
