import { SafeAreaView, Text, View, StyleSheet, Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useSelector } from "react-redux";
import { defaultStyles } from "../components/defaultStyles";

export const Home = () => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const isDarkTheme = useSelector((state) => state.auth.theme);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <SafeAreaView
      style={[
        defaultStyles.container,
        { backgroundColor: isDarkTheme ? "#67104c" : "white" },
      ]}
    >
      <View style={styles.header}>
        <Pressable
          onPress={() => changeLanguage(i18n.language === "en" ? "uk" : "en")}
        >
          <MaterialIcons
            name="language"
            size={26}
            color={isDarkTheme ? "white" : "#67104c"}
          />
        </Pressable>
        <Pressable onPress={() => navigation.navigate("Profile")}>
          <AntDesign
            name="setting"
            size={26}
            color={isDarkTheme ? "white" : "#67104c"}
          />
        </Pressable>
      </View>
      <Text
        style={[styles.welcomeText, { color: isDarkTheme ? "white" : "black" }]}
      >
        {t("hm.welcome")}
      </Text>

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
            { color: isDarkTheme ? "#67104c" : "white" },
          ]}
        >
          {t("rg.studyAndTrain")}
        </Text>
      </Pressable>

      <Pressable
        style={[
          defaultStyles.button,
          { backgroundColor: isDarkTheme ? "white" : "#67104c" },
        ]}
        onPress={() => navigation.navigate("LessonsBySubscription")}
      >
        <Text
          style={[
            defaultStyles.btnText,
            { color: isDarkTheme ? "#67104c" : "white" },
          ]}
        >
          {t("rg.lessonsBySubscr")}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  welcomeText: {
    marginTop: 20,
    fontSize: 25,
    textAlign: "center", // Центруємо текст
  },
});
