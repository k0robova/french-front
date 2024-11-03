import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useTranslation } from "react-i18next";
import "../i18n";
import {
  SafeAreaView,
  Text,
  TextInput,
  Alert,
  Pressable,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  View,
  StyleSheet,
} from "react-native";
import PasswordForm from "../components/PasswordForm";
import { logoutThunk, updaterUserDataThunk } from "../store/auth/authThunks";
import { selectUser } from "../store/auth/selector";
import { setTheme } from "../store/auth/authSlice";
import { defaultStyles } from "../components/defaultStyles";

export const Profile = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userData = useSelector(selectUser);

  const [user, setUser] = useState({ name: "", email: "" });
  const [userInfo, setUserInfo] = useState({
    name: user.name || "",
    email: user.email || "",
  });

  const { t, i18n } = useTranslation();

  const isDarkTheme = useSelector((state) => state.auth.theme);

  const getUserInfo = async () => {
    if (userData) {
      setUser((prevNote) => ({
        ...prevNote,
        name: userData.name,
        email: userData.email,
      }));
      setUserInfo({ name: userData.name, email: userData.email });
    }
  };

  const handleSave = async () => {
    const updatedUser = {
      ...user,
      name: userInfo.name,
      email: userInfo.email,
    };
    setUser(updatedUser);
    setUserInfo(updatedUser);
    try {
      const resultAction = await dispatch(updaterUserDataThunk(updatedUser));
      if (updaterUserDataThunk.fulfilled.match(resultAction)) {
        // await SecureStore.setItemAsync("user", JSON.stringify(updatedUser));
        Alert.alert("", t("alert.dataChanged"), [{ text: t("alert.close") }]);
      } else {
        Alert.alert("Error", resultAction.error.message);
      }
    } catch (error) {
      console.log("Changes failed:", error);
      Alert.alert("Error", error.message);
    }
  };
  const toggleTheme = async () => {
    const newTheme = !isDarkTheme; // Інвертуємо булеве значення теми

    try {
      // Зберігаємо нову тему як рядок (булеве значення) в SecureStore
      await SecureStore.setItemAsync("theme", JSON.stringify(newTheme));
      // Оновлюємо тему в Redux-стані
      dispatch(setTheme(newTheme));
    } catch (error) {
      console.error("Failed to update theme:", error);
    }
  };

  useEffect(() => {
    getUserInfo();
    const loadTheme = async () => {
      try {
        const storedTheme = await SecureStore.getItemAsync("theme");
        if (storedTheme !== null) {
          const parsedTheme = JSON.parse(storedTheme); // Конвертуємо з рядка в булеве значення
          dispatch(setTheme(parsedTheme)); // Оновлюємо тему у Redux-стані
        }
      } catch (error) {
        console.error("Failed to load theme:", error);
      }
    };

    loadTheme();
  }, [dispatch]);

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

  return (
    <TouchableOpacity
      style={{ flex: 1 }}
      onPress={Keyboard.dismiss}
      activeOpacity={1}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        keyboardVerticalOffset={
          Platform.OS === "android" ? 35 : Platform.OS === "ios" ? 95 : 0
        }
        style={{ flex: 1 }}
      >
        <SafeAreaView
          style={[
            defaultStyles.container,
            { backgroundColor: isDarkTheme ? "#67104c" : "white" },
          ]}
        >
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => navigation.navigate("Home")}>
              <AntDesign
                name="arrowleft"
                size={24}
                color={isDarkTheme ? "white" : "#67104c"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                changeLanguage(i18n.language === "en" ? "uk" : "en")
              }
            >
              <MaterialIcons
                name="language"
                size={24}
                color={isDarkTheme ? "white" : "#67104c"}
              />
            </TouchableOpacity>

            <Pressable onPress={toggleTheme}>
              <MaterialIcons
                name="light-mode"
                size={26}
                color={isDarkTheme ? "white" : "#67104c"}
              />
            </Pressable>
            <Pressable onPress={handleLogout}>
              <Ionicons
                name="log-out"
                size={24}
                color={isDarkTheme ? "white" : "#67104c"}
              />
            </Pressable>
          </View>
          <Text
            style={[
              styles.textName,
              {
                color: isDarkTheme ? "white" : "black",
              },
            ]}
          >
            {t("rg.hello")} {userInfo.name ? userInfo.name : "Guest !"}
          </Text>

          <View style={defaultStyles.boxForm}>
            <Text
              style={[
                defaultStyles.labelText,
                {
                  color: isDarkTheme ? "white" : "black",
                },
              ]}
            >
              {t("rg.name")}
            </Text>
            <View
              style={[
                defaultStyles.boxInput,
                {
                  borderColor: isDarkTheme ? "white" : "#67104c",
                },
              ]}
            >
              <TextInput
                placeholder={t("rg.name")}
                color={isDarkTheme ? "white" : "black"}
                placeholderTextColor={isDarkTheme ? "white" : undefined}
                keyboardType="default"
                value={userInfo.name}
                style={{ width: "100%" }}
                onChangeText={(text) =>
                  setUserInfo((prevInfo) => ({ ...prevInfo, name: text }))
                }
              />
            </View>
          </View>

          <View style={defaultStyles.boxForm}>
            <Text
              style={[
                defaultStyles.labelText,
                {
                  color: isDarkTheme ? "white" : "black",
                },
              ]}
            >
              {t("rg.email")}
            </Text>
            <View
              style={[
                defaultStyles.boxInput,
                {
                  borderColor: isDarkTheme ? "white" : "#67104c",
                },
              ]}
            >
              <TextInput
                placeholder={t("rg.placeNewEmail")}
                color={isDarkTheme ? "white" : "black"}
                placeholderTextColor={isDarkTheme ? "white" : undefined}
                value={userInfo.email}
                keyboardType="email-address"
                style={{ width: "100%" }}
                onChangeText={(text) =>
                  setUserInfo((prevInfo) => ({ ...prevInfo, email: text }))
                }
              />
            </View>
          </View>

          <Pressable
            title="Save Changes"
            color={isDarkTheme ? "black" : "white"}
            onPress={handleSave}
            style={[
              defaultStyles.button,
              {
                backgroundColor: isDarkTheme ? "white" : "#67104c",
              },
            ]}
          >
            <Text
              style={[
                defaultStyles.btnText,
                {
                  color: isDarkTheme ? "black" : "white",
                },
              ]}
            >
              {t("rg.saveChanges")}
            </Text>
          </Pressable>
          <PasswordForm theme={isDarkTheme ? "dark" : "light"} />
        </SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableOpacity>
  );
};

export const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textName: {
    fontSize: 24,
    marginBottom: 20,
    padding: 10,
  },
});
