import React, { useEffect, useState } from "react";
import {
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import "../i18n";
import AntDesign from "@expo/vector-icons/AntDesign";
import { handleChange } from "../helpers/handleChangeInput";
import { forgotPass, restorePassword } from "../services/authService";
import * as Validate from "../helpers/validationInput";

export const ForgotPassword = () => {
  const navigation = useNavigation();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const { t, i18n } = useTranslation();

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    otpError: "",
    emailError: "",
    passwordError: "",
  });

  const [isOtpCode, setIsOtpCode] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  //   const toggleTheme = () => {
  //     setIsDarkTheme(!isDarkTheme);
  //   };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  useEffect(() => {
    validateForm();
  }, [formData, formErrors]);

  const handleSendOtpCode = async () => {
    try {
      await forgotPass({ email: formData.email });

      setFormData({
        ...formData,
        otp: "",
        password: "",
      });
      setIsOtpCode(true);
      setIsPasswordValid(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangePassword = async () => {
    const newPassword = {
      email: formData.email,
      password: formData.password,
    };
    try {
      const data = await restorePassword(formData.otp, newPassword);
      navigation.navigate("Login");
    } catch (error) {
      console.log(error);
    }
  };

  const handleBackToEmail = () => {
    setFormData({
      ...formData,
      otp: "",
      password: "",
    });
    setIsOtpCode(false);
    setIsPasswordValid(false);
  };

  //   const toggleShowPassword = () => {
  //     setShowPassword(!showPassword);
  //     console.log(formData);
  //   };

  const handleOtpChange = handleChange(
    setFormData,
    "otp",
    Validate.validateOtp,
    setFormErrors,
    "otpError",
    "Введіть код який прийшов вам на пошту"
  );

  const handleEmailChange = handleChange(
    setFormData,
    "email",
    Validate.validateEmail,
    setFormErrors,
    "emailError",
    "Введіть коректну електронну пошту"
  );

  const handlePasswordChange = handleChange(
    setFormData,
    "password",
    Validate.validatePassword,
    setFormErrors,
    "passwordError",
    "Пароль повинен містити щонайменше 6 символів"
  );

  const renderError = (error, errorMessage) => {
    return error ? <Text style={errorMessage}>{error}</Text> : null;
  };

  const validateForm = () => {
    const isEmailValid = formData.email && !formErrors.emailError;
    const isPasswordValid = formData.password && !formErrors.passwordError;
    const isOtpValid = formData.otp && !formErrors.otpError;

    setIsEmailValid(isEmailValid);
    setIsPasswordValid(isOtpValid && isPasswordValid);
  };

  return (
    <TouchableOpacity
      style={{ flex: 1 }}
      onPress={Keyboard.dismiss}
      activeOpacity={1}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <SafeAreaView
          style={{
            flex: 1,
            // backgroundColor: isDarkTheme ? "#67104c" : "white",
          }}
        >
          {/* <View style={{ flex: 1, marginHorizontal: 22 }}> */}
          {isOtpCode ? (
            <View style={{ flex: 1 }}>
              <View
                style={{
                  paddingTop: 10,
                  paddingRight: 18,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <AntDesign
                    name="arrowleft"
                    size={24}
                    color={isDarkTheme ? "white" : "#67104c"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    changeLanguage(i18n.language === "en" ? "ua" : "en")
                  }
                >
                  <MaterialIcons
                    name="language"
                    size={26}
                    color={isDarkTheme ? "white" : "#67104c"}
                  />
                </TouchableOpacity>
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
                  {t("rg.code")}
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
                    placeholder={t("rg.placeCode")}
                    placeholderTextColor={isDarkTheme ? "lightgray" : undefined}
                    keyboardType="default"
                    style={{
                      width: "100%",
                      color: isDarkTheme ? "white" : "black",
                    }}
                    onChangeText={handleOtpChange}
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
                  {t("rg.newPassword")}
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
                    placeholder={t("rg.placeNewPassword")}
                    placeholderTextColor={isDarkTheme ? "lightgray" : undefined}
                    secureTextEntry={!isPasswordVisible}
                    keyboardType="default"
                    value={formData.password}
                    style={{
                      width: "100%",
                      color: isDarkTheme ? "white" : "black",
                    }}
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
                // title="Register"
                // color="white"
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
                onPress={handleChangePassword}
              >
                <Text
                  style={{
                    color: isDarkTheme ? "#67104c" : "white",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {t("rg.send")}
                </Text>
              </Pressable>
            </View>
          ) : (
            <View style={{ flex: 1, marginHorizontal: 22 }}>
              <View
                style={{
                  paddingTop: 10,
                  paddingRight: 18,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <AntDesign
                    name="arrowleft"
                    size={24}
                    color={isDarkTheme ? "white" : "#67104c"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    changeLanguage(i18n.language === "en" ? "ua" : "en")
                  }
                >
                  <MaterialIcons
                    name="language"
                    size={26}
                    color={isDarkTheme ? "white" : "#67104c"}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ marginVertical: 22 }}>
                <Text
                  style={{
                    fontSize: 16,
                    marginVertical: 12,
                    color: isDarkTheme ? "white" : "black",
                  }}
                >
                  {t("rg.sendCode")}
                </Text>
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
                    placeholderTextColor={isDarkTheme ? "lightgray" : undefined}
                    keyboardType="email-address"
                    style={{
                      width: "100%",
                      color: isDarkTheme ? "white" : "black",
                    }}
                    onChangeText={handleEmailChange}
                  />
                </View>
              </View>
              <Pressable
                // title="Register"
                // color="white"
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
                onPress={handleSendOtpCode}
              >
                <Text
                  style={{
                    color: isDarkTheme ? "#67104c" : "white",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {t("rg.send")}
                </Text>
              </Pressable>
            </View>
          )}
        </SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  errorMessage: {
    fontFamily: "Montserrat-Regular",
    position: "absolute",
    fontSize: 12,
    color: "red",
    left: 0,
    top: -30,
  },
});
