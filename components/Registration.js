import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { StyleSheet } from "react-native";
import {
  Alert,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { CheckBox } from "react-native-btr";
import * as Validate from "../helpers/validationInput";
import { singUp } from "../services/authService";
// import { createFormDataRegister } from "../helpers/createFormDataRegister";
import { handleChange } from "../helpers/handleChangeInput";

export const Registration = () => {
  const navigation = useNavigation();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

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

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    validateForm();
  }, [formData, formErrors]);

  const register = async () => {
    newUser = {
      name: formData.name,
      birthDate: formData.birthDate,
      email: formData.email,
      password: formData.password,
    };

    try {
      setIsFormValid(false);
      const data = await singUp(newUser);
      await SecureStore.setItemAsync("token", data.token);
      await SecureStore.setItemAsync("user", JSON.stringify(data.user));
      setIsFormValid(true);
      navigation.navigate("Home");
      Alert.alert(
        "",
        "Your registration has been successful! Welcome on board!",
        [{ text: "Close" }]
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleRegister = async () => {
    await register();
    return;
  };

  const handleNameChange = handleChange(
    setFormData,
    "name",
    Validate.validateName,
    setFormErrors,
    "nameError",
    "Start with a capital letter and a minimum of 3 letters"
  );

  const handleBirthDateChange = handleChange(
    setFormData,
    "birthDate",
    Validate.validateBirthDate,
    setFormErrors,
    "birthDateError",
    "User must be at least 14 years old"
  );

  const handleEmailChange = handleChange(
    setFormData,
    "email",
    Validate.validateEmail,
    setFormErrors,
    "emailError",
    "Enter a valid email address"
  );

  const handlePasswordChange = handleChange(
    setFormData,
    "password",
    Validate.validatePassword,
    setFormErrors,
    "passwordError",
    "The password must contain at least 6 characters"
  );

  const validateForm = () => {
    const isNameValid = formData.name && !formErrors.nameError;
    const isDateOfBirthValid =
      formData.dateOfBirth && !formErrors.dateOfBirthError;
    const isEmailValid = formData.email && !formErrors.emailError;
    const isPasswordValid = formData.password && !formErrors.passwordError;

    setIsFormValid(
      isNameValid && isDateOfBirthValid && isEmailValid && isPasswordValid
    );
  };

  const renderError = (error, errorMessage) => {
    return error ? <Text style={errorMessage}>{error}</Text> : null;
  };

  // const toggleCheckBox = () => {
  //   setIsChecked(!isChecked);
  // };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flex: 1, marginHorizontal: 22 }}>
        <View style={{ marginVertical: 22 }}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              marginVertical: 12,
              color: "black",
            }}
          >
            Create your account
          </Text>
          <Text style={{ fontSize: 16, color: "black" }}>
            Let's get acquinted!
          </Text>
        </View>
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: 400, marginVertical: 8 }}>
            Name
          </Text>
          <View
            style={{
              width: "100 %",
              height: 48,
              borderColor: "black",
              borderWidth: 1,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
              paddingLeft: 22,
            }}
          >
            <TextInput
              placeholder="Enter your name"
              placeholderTextColor="#f89fa1"
              keyboardType="default"
              style={{ width: "100%" }}
              onChangeText={handleNameChange}
            />
            {renderError(formErrors.nameError, [
              styles.errorMessage,
              { top: -20 },
            ])}
          </View>
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: 400, marginVertical: 8 }}>
            Date of birth
          </Text>
          <View
            style={{
              width: "100 %",
              height: 48,
              borderColor: "black",
              borderWidth: 1,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
              paddingLeft: 22,
            }}
          >
            <TextInput
              placeholder="Enter your date of birth"
              placeholderTextColor="#f89fa1"
              keyboardType="numeric"
              style={{ width: "100%" }}
              onChangeText={handleBirthDateChange}
            />
            {renderError(formErrors.birthDateError, [
              styles.errorMessage,
              { top: -20 },
            ])}
          </View>
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: 400, marginVertical: 8 }}>
            Email
          </Text>
          <View
            style={{
              width: "100 %",
              height: 48,
              borderColor: "black",
              borderWidth: 1,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
              paddingLeft: 22,
            }}
          >
            <TextInput
              placeholder="Enter your email "
              placeholderTextColor="#f89fa1"
              keyboardType="email-address"
              style={{ width: "100%" }}
              onChangeText={handleEmailChange}
            />
            {renderError(formErrors.emailError, [
              styles.errorMessage,
              { top: 38 },
            ])}
          </View>
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: 400, marginVertical: 8 }}>
            Password
          </Text>
          <View
            style={{
              width: "100 %",
              height: 48,
              borderColor: "black",
              borderWidth: 1,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
              paddingLeft: 22,
            }}
          >
            <TextInput
              placeholder="Enter your password "
              placeholderTextColor="#f89fa1"
              secureTextEntry={!isPasswordVisible}
              style={{ width: "100%" }}
              onChangeText={handlePasswordChange}
            />
            {renderError(formErrors.passwordError, [
              styles.errorMessage,
              { bottom: 40 },
            ])}
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              style={{ position: "absolute", right: 12 }}
            >
              {isPasswordVisible === true ? (
                <Ionicons name="eye" size={24} color="black" />
              ) : (
                <Ionicons name="eye-off" size={24} color="black" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ flexDirection: "row", marginVertical: 6 }}>
          <CheckBox
            style={{ marginRight: 8 }}
            checked={isChecked}
            // onValueChange={setIsChecked}
            onPress={() => setIsChecked(!isChecked)}
            color={isChecked ? "#67104c" : "black"}
          />
          <Text style={{ marginLeft: 5 }}>
            I agree to the terms and conditions
          </Text>
        </View>
        <Pressable
          //   style={[
          //     styles.button,
          //     (!isFormValid || !isChecked) && styles.buttonDisabled,
          //   ]}
          title="Register"
          color="white"
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
          onPress={handleRegister}
          //   disabled={!isFormValid}
        >
          <Text
            style={{ color: "white", fontWeight: "bold", textAlign: "center" }}
          >
            Create an account
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
            Already have an account
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
              Login
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export const styles = StyleSheet.create({
  errorMessage: {
    fontFamily: "Montserrat-Regular",
    position: "absolute",
    fontSize: 12,
    color: "red",
    left: 0,
  },
});
