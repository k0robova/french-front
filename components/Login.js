import { useCallback, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import "../i18n";
import {
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Button,
  Alert,
} from "react-native";
import { loginThunk } from "../store/auth/authThunks";
import { selectUser } from "../store/auth/selector";
import { setTheme } from "../store/auth/authSlice";

export const Login = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  // const userData = useSelector(selectUser);
  const isDarkTheme = useSelector((state) => state.auth.theme);

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  // const [isDarkTheme, setIsDarkTheme] = useState(false);

  const { t, i18n } = useTranslation();

  const validateForm = () => {
    setIsFormValid(email.trim().length > 0 && password.trim().length > 0);
  };

  const handleRegister = async () => {
    try {
      const resultAction = await dispatch(loginThunk({ email, password }));
      // Якщо реєстрація була успішною, `resultAction` не буде помилкою
      if (loginThunk.fulfilled.match(resultAction)) {
        navigation.navigate("Home");
      } else {
        // Тут можна обробити помилку, якщо потрібно
        Alert.alert("Error", resultAction.error.message);
      }
    } catch (error) {
      console.log("Registration failed:", error);
      Alert.alert("Error", error.message);
    }
    return;
  };

  const handleEmailChange = (text) => {
    setEmail(text.trim());
    if (text.trim().length === 0) {
      setIsFormValid(false);
    } else {
      validateForm();
    }
  };

  const handlePasswordChange = (text) => {
    setPassword(text.trim());
    if (text.trim().length === 0) {
      setIsFormValid(false);
    } else {
      validateForm();
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
  });

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDarkTheme ? "#67104c" : "white",
      }}
    >
      <View style={{ flex: 1, marginHorizontal: 22 }}>
        <View style={{ paddingTop: 20 }}>
          <Pressable
            onPress={() => changeLanguage(i18n.language === "en" ? "uk" : "en")}
          >
            <MaterialIcons
              name="language"
              size={26}
              color={isDarkTheme ? "white" : "#67104c"}
            />
          </Pressable>
        </View>
        <View style={{ marginVertical: 22 }}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              marginVertical: 12,
              color: isDarkTheme ? "white" : "black",
            }}
          >
            {t("rg.welcomeBack")}
          </Text>
          {/* <Text
            style={{ fontSize: 16, color: isDarkTheme ? "white" : "black" }}
          >
            Введіть ваші дані
          </Text> */}
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 400,
              marginVertical: 8,
              color: isDarkTheme ? "white" : "black",
            }}
          >
            {t("rg.email")}
          </Text>
          <View
            style={{
              width: "100%",
              height: 48,
              borderColor: isDarkTheme ? "white" : "#67104c",
              borderWidth: 1,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
              paddingLeft: 22,
            }}
          >
            <TextInput
              placeholder={t("rg.placeEmail")}
              value={email}
              placeholderTextColor={isDarkTheme ? "lightgray" : undefined}
              keyboardType="email-address"
              style={{ width: "100%", color: isDarkTheme ? "white" : "black" }}
              onChangeText={handleEmailChange}
            />
          </View>
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 400,
              marginVertical: 8,
              color: isDarkTheme ? "white" : "black",
            }}
          >
            {t("rg.password")}
          </Text>
          <View
            style={{
              width: "100%",
              height: 48,
              borderColor: isDarkTheme ? "white" : "#67104c",
              borderWidth: 1,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
              paddingLeft: 22,
            }}
          >
            <TextInput
              placeholder={t("rg.placePass")}
              value={password}
              placeholderTextColor={isDarkTheme ? "lightgray" : undefined}
              secureTextEntry={!isPasswordVisible}
              style={{ width: "100%", color: isDarkTheme ? "white" : "black" }}
              onChangeText={handlePasswordChange}
            />
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              style={{ position: "absolute", right: 12 }}
            >
              {isPasswordVisible === true ? (
                <Ionicons
                  name="eye"
                  size={24}
                  color={isDarkTheme ? "white" : "#67104c"}
                />
              ) : (
                <Ionicons
                  name="eye-off"
                  size={24}
                  color={isDarkTheme ? "white" : "#67104c"}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <Pressable
          style={{
            marginTop: 18,
            marginBottom: 4,
            borderRadius: 100,
            paddingVertical: 16,
            paddingHorizontal: 32,
            width: 343,
            height: 51,
            backgroundColor: isDarkTheme ? "white" : "#67104c",
          }}
          onPress={handleRegister}
        >
          <Text
            style={{
              color: isDarkTheme ? "#67104c" : "white",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {t("rg.login")}
          </Text>
        </Pressable>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginVertical: 22,
          }}
        >
          <Text
            style={{ fontSize: 16, color: isDarkTheme ? "white" : "#67104c" }}
          >
            {t("rg.dontHaveAcc")}
          </Text>
          <Pressable onPress={() => navigation.navigate("Registration")}>
            <Text
              style={{
                fontSize: 16,
                color: isDarkTheme ? "white" : "#67104c",
                fontWeight: "bold",
                marginLeft: 6,
              }}
            >
              {t("rg.register")}
            </Text>
          </Pressable>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: isDarkTheme ? "white" : "#67104c",
            }}
          >
            {t("rg.haveAccButForgotPass")}
          </Text>
          <Pressable onPress={() => navigation.navigate("ForgotPassword")}>
            <Text
              style={{
                fontSize: 16,
                color: isDarkTheme ? "white" : "#67104c",
                fontWeight: "bold",
                marginLeft: 6,
              }}
            >
              {t("rg.resetPassHere")}
            </Text>
          </Pressable>
        </View>
        <Button
          title={isDarkTheme ? "Switch to Light Theme" : "Switch to Dark Theme"}
          onPress={toggleTheme}
        />
      </View>
    </SafeAreaView>
  );
};
