import { useNavigation } from "@react-navigation/native";
import React from "react";
import { useTranslation } from "react-i18next";

import { Pressable, SafeAreaView, Text, View } from "react-native";

import { useSelector } from "react-redux";
import { defaultStyles } from "./defaultStyles";

export const Verbs = () => {
  const { t } = useTranslation();
  const isDarkTheme = useSelector((state) => state.auth.theme);
  const navigation = useNavigation();

  return (
    <SafeAreaView
      style={[
        defaultStyles.container,
        { backgroundColor: isDarkTheme ? "#67104c" : "white" },
      ]}
    >
      <View style={defaultStyles.btnContainer}>
        <Pressable
          style={[
            defaultStyles.button,
            { backgroundColor: isDarkTheme ? "white" : "#67104c" },
          ]}
          onPress={() => navigation.navigate("StudyAndTrain")}
        >
          <Text
            style={[
              defaultStyles.btnText,
              {
                color: isDarkTheme ? "#67104c" : "white",
              },
            ]}
          >
            {t("LAT.verbs")}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};
