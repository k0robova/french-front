import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import "../i18n";
import {
  Alert,
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
import { handleChange } from "../helpers/handleChangeInput";
import { forgotPass, restorePassword } from "../services/authService";
import * as Validate from "../helpers/validationInput";

export const ForgotPassword = () => {
  const navigation = useNavigation();

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
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const { t, i18n } = useTranslation();

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
      Alert.alert("", t("alert.codeOnMail"), [{ text: t("alert.close") }]);
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
      Alert.alert("", t("alert.passwordChanged"), [{ text: t("alert.close") }]);
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
      email: formData.email,
    });
    setIsOtpCode(false);
    setIsPasswordValid(false);
  };

  const handleOtpChange = handleChange(
    setFormData,
    "otp",
    Validate.validateOtp,
    setFormErrors,
    "otpError",
    t("validation.code")
  );

  const handleEmailChange = handleChange(
    setFormData,
    "email",
    Validate.validateEmail,
    setFormErrors,
    "emailError",
    t("validation.email")
  );

  const handlePasswordChange = handleChange(
    setFormData,
    "password",
    Validate.validatePassword,
    setFormErrors,
    "passwordError",
    t("validation.password")
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

  useEffect(() => {
    validateForm();
  }, [formData, formErrors]);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
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
          }}
        >
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
                  <AntDesign name="arrowleft" size={24} color="#67104c" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    changeLanguage(i18n.language === "en" ? "ua" : "en")
                  }
                >
                  <MaterialIcons name="language" size={26} color="#67104c" />
                </TouchableOpacity>
              </View>
              <View style={{ marginBottom: 12 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 400,
                    marginVertical: 8,
                    color: "black",
                  }}
                >
                  {t("rg.code")}
                </Text>
                <View
                  style={{
                    width: "100%",
                    height: 48,
                    borderColor: "#67104c",
                    borderWidth: 1,
                    borderRadius: 8,
                    alignItems: "center",
                    justifyContent: "center",
                    paddingLeft: 22,
                  }}
                >
                  <TextInput
                    placeholder={t("rg.placeCode")}
                    keyboardType="default"
                    style={{
                      width: "100%",
                      color: "black",
                    }}
                    onChangeText={handleOtpChange}
                  />
                  {/* {renderError(formErrors.otpError, [
                    styles.errorMessage,
                    { top: 47 },
                  ])} */}
                </View>
              </View>

              <View style={{ marginBottom: 12 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 400,
                    marginVertical: 8,
                    color: "black",
                  }}
                >
                  {t("rg.newPassword")}
                </Text>
                <View
                  style={{
                    width: "100%",
                    height: 48,
                    borderColor: "#67104c",
                    borderWidth: 1,
                    borderRadius: 8,
                    alignItems: "center",
                    justifyContent: "center",
                    paddingLeft: 22,
                  }}
                >
                  <TextInput
                    placeholder={t("rg.placeNewPassword")}
                    secureTextEntry={!isPasswordVisible}
                    keyboardType="default"
                    value={formData.password}
                    style={{
                      width: "100%",
                      color: "black",
                    }}
                    onChangeText={handlePasswordChange}
                  />
                  {renderError(formErrors.passwordError, [
                    styles.errorMessage,
                    { top: -13 },
                  ])}
                  <TouchableOpacity
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    style={{ position: "absolute", right: 12 }}
                  >
                    {isPasswordVisible === true ? (
                      <Ionicons name="eye" size={24} color="#67104c" />
                    ) : (
                      <Ionicons name="eye-off" size={24} color="#67104c" />
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
                  backgroundColor: "#67104c",
                }}
                onPress={handleBackToEmail}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {t("rg.back")}
                </Text>
              </Pressable>
              <Pressable
                style={{
                  marginTop: 18,
                  marginBottom: 4,
                  borderRadius: 100,
                  paddingVertical: 16,
                  paddingHorizontal: 32,
                  width: 343,
                  height: 51,
                  backgroundColor: "#67104c",
                }}
                onPress={handleChangePassword}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {t("rg.saveChanges")}
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
                  <AntDesign name="arrowleft" size={24} color="#67104c" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    changeLanguage(i18n.language === "en" ? "ua" : "en")
                  }
                >
                  <MaterialIcons name="language" size={26} color="#67104c" />
                </TouchableOpacity>
              </View>
              <View style={{ marginVertical: 22 }}>
                <Text
                  style={{
                    fontSize: 16,
                    marginVertical: 12,
                    color: "black",
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
                    color: "black",
                  }}
                >
                  {t("rg.email")}
                </Text>
                <View
                  style={{
                    width: "100%",
                    height: 48,
                    borderColor: "#67104c",
                    borderWidth: 1,
                    borderRadius: 8,
                    alignItems: "center",
                    justifyContent: "center",
                    paddingLeft: 22,
                  }}
                >
                  <TextInput
                    placeholder={t("rg.placeEmail")}
                    keyboardType="email-address"
                    style={{
                      width: "100%",
                      color: "black",
                    }}
                    onChangeText={handleEmailChange}
                  />
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
                  backgroundColor: "#67104c",
                }}
                onPress={handleSendOtpCode}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {t("rg.send")}
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
                  style={{
                    fontSize: 16,
                    color: "#67104c",
                  }}
                >
                  {t("rg.techSupport")}
                </Text>
                <Pressable onPress={() => navigation.navigate("Support")}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#67104c",
                      fontWeight: "bold",
                      marginLeft: 6,
                    }}
                  >
                    {t("rg.clickHere")}
                  </Text>
                </Pressable>
              </View>
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
    fontSize: 10,
    color: "red",
    left: 0,
    top: -30,
  },
});
