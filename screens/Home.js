import * as SecureStore from "expo-secure-store";

import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Button,
  Pressable,
  Alert,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { logoutThunk, updaterUserThemeThunk } from "../store/auth/authThunks";
import { selectUser } from "../store/auth/selector";
import { setTheme } from "../store/auth/authSlice";

export const Home = () => {
  const { t, i18n } = useTranslation();
  const userData = useSelector(selectUser);
  // const [isDarkTheme, setIsDarkTheme] = useState(true);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isDarkTheme = useSelector((state) => state.auth.theme);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  const handleLogout = async () => {
    try {
      const resultAction = await dispatch(logoutThunk());
      if (logoutThunk.fulfilled.match(resultAction)) {
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", resultAction.error.message);
      }
    } catch (error) {
      console.log("Registration failed:", error);
      Alert.alert("Error", error.message);
    }
  };

  // useEffect(() => {
  //   const loadTheme = async () => {
  //     try {
  //       const storedTheme = await SecureStore.getItemAsync("theme");
  //       if (storedTheme) {
  //         dispatch(setTheme(storedTheme)); // Встановлюємо тему з SecureStore у Redux
  //       }
  //     } catch (error) {
  //       console.error("Failed to load theme:", error);
  //     }
  //   };

  //   loadTheme();
  // }, [dispatch]);

  // const toggleTheme = async () => {
  //   if (isDarkTheme) {
  //     setIsDarkTheme(false);
  //     await dispatch(updaterUserThemeThunk({ theme: isDarkTheme }));
  //   } else {
  //     setIsDarkTheme(true);
  //     await dispatch(updaterUserThemeThunk({ theme: isDarkTheme }));
  //   }
  // };

  // const getUserInfo = () => {
  //   setIsDarkTheme(userData.theme);
  // };

  // useFocusEffect(
  //   useCallback(() => {
  //     getUserInfo();
  //   }, [])
  // );

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDarkTheme ? "#67104c" : "white" },
      ]}
    >
      <View style={styles.header}>
        <Pressable
          onPress={() => changeLanguage(i18n.language === "en" ? "ua" : "en")}
        >
          <MaterialIcons
            name="language"
            size={28}
            color={isDarkTheme ? "white" : "#67104c"}
          />
        </Pressable>
        <Pressable onPress={handleLogout}>
          <Ionicons
            name="log-out"
            size={28}
            color={isDarkTheme ? "white" : "#67104c"}
          />
        </Pressable>
      </View>

      {/* <View style={styles.themeButtonContainer}>
        <Button
          title={isDarkTheme ? "Switch to Light Theme" : "Switch to Dark Theme"}
          onPress={toggleTheme}
        />
      </View> */}

      <Text
        style={[styles.welcomeText, { color: isDarkTheme ? "white" : "black" }]}
      >
        {t("hm.welcome")}
      </Text>

      <View style={styles.linkContainer}>
        <Text
          style={[styles.linkText, { color: isDarkTheme ? "white" : "black" }]}
        >
          {t("rg.try")}
        </Text>
        <Pressable onPress={() => navigation.navigate("StudyAndTrain")}>
          <Text
            style={[
              styles.linkText,
              styles.boldText,
              { color: isDarkTheme ? "white" : "#67104c" },
            ]}
          >
            {t("rg.studyAndTrain")}
          </Text>
        </Pressable>
      </View>

      <View style={styles.linkContainer}>
        <Text
          style={[styles.linkText, { color: isDarkTheme ? "white" : "black" }]}
        >
          {t("rg.try")}
        </Text>
        <Pressable onPress={() => navigation.navigate("LessonsBySubscription")}>
          <Text
            style={[
              styles.linkText,
              styles.boldText,
              { color: isDarkTheme ? "white" : "#67104c" },
            ]}
          >
            {t("rg.lessonsBySubscr")}
          </Text>
        </Pressable>
      </View>

      <View style={styles.linkContainer}>
        <Text
          style={[styles.linkText, { color: isDarkTheme ? "white" : "black" }]}
        >
          {t("rg.changeInfo")}
        </Text>
        <Pressable onPress={() => navigation.navigate("Profile")}>
          <Text
            style={[
              styles.linkText,
              styles.boldText,
              { color: isDarkTheme ? "white" : "#67104c" },
            ]}
          >
            {t("rg.profile")}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    padding: 20,
  },
  themeButtonContainer: {
    padding: 20,
  },
  welcomeText: {
    fontSize: 25,
    textAlign: "center", // Центруємо текст
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 22,
  },
  linkText: {
    fontSize: 16,
    color: "black", // Колір тексту буде переоприділено в залежності від теми
  },
  boldText: {
    fontWeight: "bold",
    marginLeft: 6,
  },
});
