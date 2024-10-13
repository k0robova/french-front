import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { CheckBox } from "react-native-btr";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import "../i18n";
import {
  StyleSheet,
  Alert,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  SafeAreaView,
} from "react-native";
import * as Validate from "../helpers/validationInput";
import { handleChange } from "../helpers/handleChangeInput";
import { getProfileThunk, registerThunk } from "../store/auth/authThunks";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/uk"; // імпорт української локалі
import "dayjs/locale/en"; // англійська локаль

dayjs.extend(localizedFormat);
dayjs.locale("en"); // встановлення локалі за замовчуванням

export const Registration = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    nameError: "",
    birthDateError: "",
    emailError: "",
    passwordError: "",
  });
  const [date, setDate] = useState(new Date());

  const [showPicker, setShowPiker] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const { t, i18n } = useTranslation();

  const handleRegister = async () => {
    try {
      const resultAction = await dispatch(registerThunk(formData));
      if (registerThunk.fulfilled.match(resultAction)) {
        // setFormData({ name: "", birthDate: "", email: "", password: "" });
        navigation.navigate("Home");
        Alert.alert("", t("alert.welcome"), [{ text: t("alert.close") }]);
      } else {
        Alert.alert("Error", resultAction.error.message);
      }
    } catch (error) {
      console.log("Registration failed:", error);
      Alert.alert("Error", error.message);
    }
  };

  const handleNameChange = handleChange(
    setFormData,
    "name",
    Validate.validateName,
    setFormErrors,
    "nameError",
    t("validation.name")
  );

  const handleBirthDateChange = handleChange(
    setFormData,
    "birthDate",
    Validate.validateBirthDate,
    setFormErrors,
    "birthDateError",
    t("validation.birthDate")
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

  const validateForm = () => {
    const isNameValid = formData.name && !formErrors.nameError;
    const isDateOfBirthValid = formData.birthDate && !formErrors.birthDateError;
    const isEmailValid = formData.email && !formErrors.emailError;
    const isPasswordValid = formData.password && !formErrors.passwordError;

    setIsFormValid(
      isNameValid && isDateOfBirthValid && isEmailValid && isPasswordValid
    );
  };

  useEffect(() => {
    validateForm();
  }, [formData, formErrors]);

  const changeLanguage = (lang) => {
    // i18n.changeLanguage(lang);
    // dispatch(getProfileThunk());
    i18n.changeLanguage(lang); // змінюємо мову для i18next
    dayjs.locale(lang); // змінюємо локаль для dayjs
    dispatch(getProfileThunk()); // при необхідності, повторно отримуємо дані проs
  };

  const renderError = (error, errorMessage) => {
    return error ? <Text style={errorMessage}>{error}</Text> : null;
  };

  const toggleCheckBox = () => {
    setIsChecked(!isChecked);
  };

  const toggleDatePicker = () => {
    setShowPiker(!showPicker);
  };

  const onChange = ({ type }, selectedDate) => {
    if (type === "set") {
      const currentDate = selectedDate;
      setDate(currentDate);
      if (Platform.OS === "android") {
        toggleDatePicker();
        setFormData((prevState) => ({
          ...prevState,
          birthDate: formatDate(currentDate),
        }));
      }
    } else {
      toggleDatePicker();
    }
  };

  const confirmIOSDate = () => {
    setFormData((prevState) => ({
      ...prevState,
      birthDate: formatDate(date),
    }));
    toggleDatePicker();
  };

  const formatDate = (rawDate) => {
    let date = new Date(rawDate);

    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    return `${day}-${month}-${year}`;
    // return dayjs(rawDate).format("LL");
  };

  useEffect(() => {
    console.log("Current locale:", dayjs.locale());
  }, [i18n.language]);

  return (
    <TouchableOpacity
      style={{ flex: 1 }}
      onPress={Keyboard.dismiss}
      activeOpacity={1}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, justifyContent: "flex-end" }}
        // keyboardVerticalOffset={
        //   Platform.OS === "android" ? 35 : Platform.OS === "ios" ? 50 : 0
        // }
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
          <View style={{ flex: 1, marginHorizontal: 22 }}>
            <View style={{ marginVertical: 22 }}>
              <View>
                <Pressable
                  onPress={() =>
                    changeLanguage(i18n.language === "en" ? "uk" : "en")
                  }
                >
                  <MaterialIcons name="language" size={26} color="#67104c" />
                </Pressable>
              </View>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  marginVertical: 12,
                  color: "black",
                }}
              >
                {t("rg.register")}
              </Text>
              <Text style={{ fontSize: 16, color: "black" }}>
                {t("rg.letsAcq")}
              </Text>
            </View>
            <View style={{ marginBottom: 12 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 400,
                  marginVertical: 8,
                  marginBottom: 10,
                }}
              >
                {t("rg.name")}
              </Text>
              <View
                style={{
                  width: "100 %",
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
                  placeholder={t("rg.placeName")}
                  // placeholderTextColor="#f89fa1"
                  keyboardType="default"
                  value={formData.name}
                  style={{ width: "100%" }}
                  onChangeText={handleNameChange}
                />
                {renderError(formErrors.nameError, [styles.errorMessage])}
              </View>
            </View>

            <View style={{ marginBottom: 12 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 400,
                  marginVertical: 8,
                  marginBottom: 10,
                }}
              >
                {t("rg.dateOfBirth")}
              </Text>

              {showPicker && (
                <DateTimePicker
                  mode="date"
                  display="spinner"
                  value={date}
                  onChange={onChange}
                  locale={i18n.language}
                  style={styles.datePicker}
                  maximumDate={new Date()}
                  minimumDate={new Date("1950-1-1")}
                />
              )}
              {showPicker && Platform.OS === "ios" && (
                <View style={styles.pickerButtonContainer}>
                  <TouchableOpacity
                    style={[styles.pickerButton, styles.cancelButton]}
                    onPress={toggleDatePicker}
                  >
                    <Text style={styles.buttonText}>{t("btn.cancel")}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.pickerButton, styles.confirmButton]}
                    onPress={confirmIOSDate}
                  >
                    <Text style={styles.buttonText}>{t("btn.confirm")}</Text>
                  </TouchableOpacity>
                </View>
              )}
              {/* 
              <View
                style={{
                  width: "100 %",
                  height: 48,
                  borderColor: "#67104c",
                  borderWidth: 1,
                  borderRadius: 8,
                  // alignItems: "center",
                  justifyContent: "center",
                  paddingLeft: 22,
                }}
              > */}
              {!showPicker && (
                <Pressable onPress={toggleDatePicker}>
                  <TextInput
                    placeholder={t("rg.placeDoB")}
                    // placeholderTextColor="#f89fa1"
                    // keyboardType="numeric"
                    value={formData.birthDate}
                    style={{
                      // width: "100%",
                      textAlign: "left",
                      width: "100 %",
                      height: 48,
                      borderColor: "#67104c",
                      borderWidth: 1,
                      borderRadius: 8,
                      // alignItems: "center",
                      justifyContent: "center",
                      paddingLeft: 22,
                    }}
                    onChangeText={handleBirthDateChange}
                    editable={false}
                    onPressIn={toggleDatePicker}
                  />
                </Pressable>
              )}
              {renderError(formErrors.birthDateError, [styles.errorMessage])}
              {/* </View> */}
            </View>

            <View style={{ marginBottom: 12 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 400,
                  marginVertical: 8,
                  marginBottom: 10,
                }}
              >
                {t("rg.email")}
              </Text>
              <View
                style={{
                  width: "100 %",
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
                  // placeholderTextColor="#f89fa1"
                  keyboardType="email-address"
                  value={formData.email}
                  style={{ width: "100%" }}
                  onChangeText={handleEmailChange}
                />
                {renderError(formErrors.emailError, [styles.errorMessage])}
              </View>
            </View>

            <View style={{ marginBottom: 12 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 400,
                  marginVertical: 8,
                  marginBottom: 10,
                }}
              >
                {t("rg.password")}
              </Text>
              <View
                style={{
                  width: "100 %",
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
                  placeholder={t("rg.placePass")}
                  // placeholderTextColor="#f89fa1"
                  secureTextEntry={!isPasswordVisible}
                  value={formData.password}
                  style={{ width: "100%" }}
                  onChangeText={handlePasswordChange}
                />
                {renderError(formErrors.passwordError, [styles.errorMessage])}
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

            <View style={{ flexDirection: "row", marginVertical: 6 }}>
              <CheckBox
                style={{ marginRight: 8 }}
                checked={isChecked}
                onPress={toggleCheckBox}
                color={isChecked ? "#67104c" : "#67104c"}
              />
              <Text style={{ marginLeft: 5 }}>{t("rg.agreeTerms")}</Text>
            </View>
            <Pressable
              style={[
                styles.button,
                { alignSelf: "center" },
                (!isFormValid || !isChecked) && styles.buttonDisabled,
              ]}
              title="Register"
              onPress={handleRegister}
              disabled={!isFormValid}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {t("rg.createAcc")}
              </Text>
            </Pressable>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginVertical: 22,
              }}
            >
              <Text style={{ fontSize: 16, color: "black" }}>
                {t("rg.alreadyAccount")}
              </Text>
              <Pressable onPress={() => navigation.navigate("Login")}>
                <Text
                  style={{
                    fontSize: 16,
                    color: "#67104c",
                    fontWeight: "bold",
                    marginLeft: 6,
                  }}
                >
                  {t("rg.login")}
                </Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableOpacity>
  );
};

export const styles = StyleSheet.create({
  errorMessage: {
    fontFamily: "Montserrat-Regular",
    position: "absolute",
    fontSize: 10,
    color: "red",
    left: 0,
    top: -13,
  },
  button: {
    marginTop: 18,
    marginBottom: 4,
    borderRadius: 100,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: 343,
    height: 51,
    backgroundColor: "#67104c",
  },
  buttonDisabled: { backgroundColor: "#CCCCCC", pointerEvents: "none" },
  datePicker: {
    height: 120,
    marginTop: -10,
  },
  pickerButton: {
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    height: 51,
    width: 150,
    backgroundColor: "gray",
  },
  pickerButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10, // Відступ між кнопками і вибором дати
    marginBottom: 10, // Відступ знизу
  },
  pickerButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    elevation: 2, // Тінь для Android
    shadowColor: "#000", // Тінь для iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#555555", // Червоний колір для кнопки скасування
  },
  confirmButton: {
    backgroundColor: "#67104c", // Зелений колір для кнопки підтвердження
  },
  buttonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
});
