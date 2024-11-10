import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { useTranslation } from "react-i18next";

import { Pressable, SafeAreaView, Text, View } from "react-native";

import { useSelector } from "react-redux";
import { defaultStyles } from "./defaultStyles";

export const LearnOrTrainTopic = () => {
  const { t } = useTranslation();
  const isDarkTheme = useSelector((state) => state.auth.theme);
  const navigation = useNavigation();
  const route = useRoute();
  const topicName = route.params?.topicName ?? "";

  return (
    <SafeAreaView
      style={[
        defaultStyles.container,
        { backgroundColor: isDarkTheme ? "#67104c" : "white" },
      ]}
    >
      <View
        style={[
          defaultStyles.btnContainer,
          {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <Pressable
          style={[
            defaultStyles.button,
            { backgroundColor: isDarkTheme ? "white" : "#67104c" },
          ]}
          onPress={() => navigation.navigate("Learn", { topicName })}
        >
          <Text
            style={[
              defaultStyles.btnText,
              {
                color: isDarkTheme ? "#67104c" : "white",
              },
            ]}
          >
            {t("LAT.learn")}
          </Text>
        </Pressable>
        <Pressable
          style={[
            defaultStyles.button,
            { backgroundColor: isDarkTheme ? "white" : "#67104c" },
          ]}
          onPress={() => navigation.navigate("Train")}
        >
          <Text
            style={[
              defaultStyles.btnText,
              {
                color: isDarkTheme ? "#67104c" : "white",
              },
            ]}
          >
            {t("LAT.train")}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};
