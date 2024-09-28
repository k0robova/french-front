import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import "../i18n";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { updatePassword } from "../services/authService";
import { updaterPasswordThunk } from "../store/auth/authThunks";

const PasswordForm = ({ theme, buttonSave }) => {
  const dispatch = useDispatch();

  const [userPass, setUserPass] = useState({
    password: "",
    newPassword: "",
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { t, i18n } = useTranslation();

  const updateUserPass = async () => {
    try {
      const resultAction = await dispatch(updaterPasswordThunk(userPass));
      if (updaterPasswordThunk.fulfilled.match(resultAction)) {
        setUserPass({ password: "", newPassword: "" });
        Alert.alert("", t("alert.passwordChanged"), [
          { text: t("alert.close") },
        ]);
        console.log("Пароль успішно змінено");
      } else {
        Alert.alert("Error", resultAction.error.message);
      }
    } catch (error) {
      console.log("Changes password failed:", error);
      Alert.alert("Error", error.message);
    }
  };

  // const updateUserPass = async () => {
  //   try {
  //     await updatePassword(userPass);
  //     setUserPass({ password: "", newPassword: "" });
  //     console.log("Пароль успішно змінено");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <SafeAreaView>
      <View style={{ marginBottom: 12, padding: 10 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: 400,
            marginVertical: 8,
            color: theme === "dark" ? "white" : "black",
          }}
        >
          {t("rg.password")}
        </Text>
        <View
          style={{
            width: "100 %",
            height: 48,
            borderColor: theme === "dark" ? "white" : "#67104c",
            borderWidth: 1,
            borderRadius: 8,
            alignItems: "center",
            justifyContent: "center",
            paddingLeft: 22,
          }}
        >
          <TextInput
            placeholder={t("rg.placePass")}
            secureTextEntry={!isPasswordVisible}
            placeholderTextColor={theme === "dark" ? "white" : undefined}
            keyboardType="default"
            value={userPass.password}
            style={{ width: "100%" }}
            onChangeText={(text) =>
              setUserPass((prevNote) => ({ ...prevNote, password: text }))
            }
          />
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={{ position: "absolute", right: 12 }}
          >
            {isPasswordVisible === true ? (
              <Ionicons
                name="eye"
                size={24}
                color={theme === "dark" ? "white" : "#67104c"}
              />
            ) : (
              <Ionicons
                name="eye-off"
                size={24}
                color={theme === "dark" ? "white" : "#67104c"}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ marginBottom: 12, padding: 10 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: 400,
            marginVertical: 8,
            color: theme === "dark" ? "white" : "black",
          }}
        >
          {t("rg.newPassword")}
        </Text>
        <View
          style={{
            width: "100 %",
            height: 48,
            borderColor: theme === "dark" ? "white" : "#67104c",
            borderWidth: 1,
            borderRadius: 8,
            alignItems: "center",
            justifyContent: "center",
            paddingLeft: 22,
          }}
        >
          <TextInput
            placeholder={t("rg.placeNewPassword")}
            placeholderTextColor={theme === "dark" ? "white" : undefined}
            keyboardType="default"
            value={userPass.newPassword}
            secureTextEntry={!isPasswordVisible}
            style={{ width: "100%" }}
            onChangeText={(text) =>
              setUserPass((prevNote) => ({ ...prevNote, newPassword: text }))
            }
          />
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={{ position: "absolute", right: 12 }}
          >
            {isPasswordVisible === true ? (
              <Ionicons
                name="eye"
                size={24}
                color={theme === "dark" ? "white" : "#67104c"}
              />
            ) : (
              <Ionicons
                name="eye-off"
                size={24}
                color={theme === "dark" ? "white" : "#67104c"}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <Pressable
        title="Save Changes"
        color={theme ? "black" : "white"}
        onPress={updateUserPass}
        style={{
          marginTop: 18,
          marginBottom: 4,
          borderRadius: 100,
          marginLeft: "auto",
          marginRight: "auto",
          paddingVertical: 16,
          paddingHorizontal: 32,
          width: 343,
          height: 51,
          backgroundColor: theme === "dark" ? "white" : "#67104c",
        }}
      >
        <Text
          style={{
            color: theme === "dark" ? "black" : "white",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {t("rg.saveChanges")}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignContent: "center",
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },
  passInput: {
    fontFamily: "Montserrat-Regular",
    width: "60%",
    backgroundColor: "#F6F6F6",
    borderColor: "#E8E8E8",
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 5,
    padding: 7,
  },
  submitBtn: {
    position: "absolute",
    right: 25,
    top: 22,
  },
});

export default PasswordForm;
