import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
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
import "../i18n";
import { handleChange } from "../helpers/handleChangeInput";
import { forgotPass, restorePassword } from "../services/authService";
import * as Validate from "../helpers/validationInput";
import { defaultStyles } from "./defaultStyles";

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
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isOtpCode, setIsOtpCode] = useState(false);
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
      await restorePassword(formData.otp, newPassword);
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
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={defaultStyles.container}>
            <View style={defaultStyles.headerBox}>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <AntDesign name="arrowleft" size={24} color="#67104c" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  changeLanguage(i18n.language === "en" ? "uk" : "en")
                }
              >
                <MaterialIcons name="language" size={26} color="#67104c" />
              </TouchableOpacity>
            </View>
            {isOtpCode ? (
              <>
                <View style={defaultStyles.boxForm}>
                  <Text style={defaultStyles.labelText}>{t("rg.code")}</Text>
                  <View
                    style={[
                      defaultStyles.boxInput,
                      {
                        borderColor: "#67104c",
                      },
                    ]}
                  >
                    <TextInput
                      placeholder={t("rg.placeCode")}
                      keyboardType="default"
                      style={styles.inputText}
                      onChangeText={handleOtpChange}
                    />
                  </View>
                </View>

                <View style={defaultStyles.boxForm}>
                  <Text style={defaultStyles.labelText}>
                    {t("rg.newPassword")}
                  </Text>
                  <View
                    style={[
                      defaultStyles.boxInput,
                      {
                        borderColor: "#67104c",
                      },
                    ]}
                  >
                    <TextInput
                      placeholder={t("rg.placeNewPassword")}
                      secureTextEntry={!isPasswordVisible}
                      keyboardType="default"
                      value={formData.password}
                      style={styles.inputText}
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
                  style={[defaultStyles.button, { backgroundColor: "#67104c" }]}
                  onPress={handleBackToEmail}
                >
                  <Text style={[defaultStyles.btnText, { color: "white" }]}>
                    {t("rg.back")}
                  </Text>
                </Pressable>
                <Pressable
                  style={[defaultStyles.button, { backgroundColor: "#67104c" }]}
                  onPress={handleChangePassword}
                >
                  <Text style={[defaultStyles.btnText, { color: "white" }]}>
                    {t("rg.saveChanges")}
                  </Text>
                </Pressable>
              </>
            ) : (
              <>
                <View style={[defaultStyles.boxForm, { padding: 0 }]}>
                  <Text
                    style={[
                      defaultStyles.headerText,
                      {
                        color: "black",
                      },
                    ]}
                  >
                    {t("rg.sendCode")}
                  </Text>
                </View>

                <View style={[defaultStyles.boxForm, { padding: 0 }]}>
                  <Text style={defaultStyles.labelText}>{t("rg.email")}</Text>
                  <View
                    style={[
                      defaultStyles.boxInput,
                      {
                        borderColor: "#67104c",
                      },
                    ]}
                  >
                    <TextInput
                      placeholder={t("rg.placeEmail")}
                      keyboardType="email-address"
                      style={styles.inputText}
                      onChangeText={handleEmailChange}
                    />
                  </View>
                </View>
                <Pressable
                  style={[defaultStyles.button, { backgroundColor: "#67104c" }]}
                  onPress={handleSendOtpCode}
                >
                  <Text style={[defaultStyles.btnText, { color: "white" }]}>
                    {t("rg.send")}
                  </Text>
                </Pressable>
                <View style={[defaultStyles.linkBox, { marginTop: 22 }]}>
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
                      style={[defaultStyles.linkText, { color: "#67104c" }]}
                    >
                      {t("rg.clickHere")}
                    </Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
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
  inputText: {
    width: "100%",
    color: "black",
  },
});
