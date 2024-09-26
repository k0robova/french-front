import React, { useState } from "react";
import IconSetting from "react-native-vector-icons/Ionicons";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
  Text,
} from "react-native";
import { updatePassword } from "../services/authService";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import "../i18n";

const PasswordForm = ({ theme, buttonSave }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [userPass, setUserPass] = useState({
    password: "",
    newPassword: "",
  });
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  const updateUserPass = async () => {
    try {
      await updatePassword(userPass);
      setUserPass({ password: "", newPassword: "" });
      console.log("пароль обновлено");
    } catch (error) {
      console.log(error);
    }
  };

  const handlePress = () => {
    setIsPasswordVisible(!isPasswordVisible);

    updateUserPass();
  };
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
            borderColor: theme === "dark" ? "white" : "black",
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
            keyboardType="email-address"
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
                color={theme === "dark" ? "white" : "black"}
              />
            ) : (
              <Ionicons
                name="eye-off"
                size={24}
                color={theme === "dark" ? "white" : "black"}
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
            borderColor: theme === "dark" ? "white" : "black",
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
                color={theme === "dark" ? "white" : "black"}
              />
            ) : (
              <Ionicons
                name="eye-off"
                size={24}
                color={theme === "dark" ? "white" : "black"}
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
