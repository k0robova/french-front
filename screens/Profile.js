import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
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
import { updaterUserDataThunk } from "../store/auth/authThunks";
import { selectUser } from "../store/auth/selector";
import { defaultStyles } from "../components/defaultStyles";
import ProgressBar from "../components/ProgressBar";

export const Profile = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userData = useSelector(selectUser);

  const [user, setUser] = useState({ name: "", email: "" });
  const [userInfo, setUserInfo] = useState({
    name: user.name || "",
    email: user.email || "",
  });

  const { t } = useTranslation();

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
        Alert.alert("", t("alert.dataChanged"), [{ text: t("alert.close") }]);
      } else {
        Alert.alert("Error", resultAction.error.message);
      }
    } catch (error) {
      console.log("Changes failed:", error);
      Alert.alert("Error", error.message);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, [dispatch]);

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
          style={{
            flex: 1,
            backgroundColor: isDarkTheme ? "#67104c" : "white",
          }}
        >
          <View style={defaultStyles.container}>
            <Text
              style={[
                styles.textName,
                {
                  color: isDarkTheme ? "white" : "black",
                },
              ]}
            >
              {t("rg.hello")}, {userInfo.name ? userInfo.name : "Guest"} !
            </Text>
            <ProgressBar
              croissants={userData.croissants}
              maxCroissants={100}
              theme={isDarkTheme}
            />

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
              onPress={handleSave}
              style={[
                defaultStyles.button,
                {
                  backgroundColor: isDarkTheme ? "white" : "#67104c",
                  marginBottom: 30,
                },
              ]}
            >
              <Text
                style={[
                  defaultStyles.btnText,
                  {
                    color: isDarkTheme ? "#67104c" : "white",
                  },
                ]}
              >
                {t("rg.saveChanges")}
              </Text>
            </Pressable>
            <PasswordForm theme={isDarkTheme ? "dark" : "light"} />
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableOpacity>
  );
};

export const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  textName: {
    fontSize: 24,
    marginBottom: 20,
    padding: 10,
  },
});
