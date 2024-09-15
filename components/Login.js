import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";

import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { logIn } from "../services/authService";

export const Login = () => {
  const navigation = useNavigation();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [isFormValid, setIsFormValid] = useState(false);

  const validateForm = () => {
    setIsFormValid(email.trim().length > 0 && password.trim().length > 0);
  };

  const login = async () => {
    const dataUser = { email, password };
    try {
      const data = await logIn(dataUser);
      console.log(data);
      await SecureStore.setItemAsync("token", data.token);
      const userString = JSON.stringify(data.user);
      await SecureStore.setItemAsync("user", userString);
      navigation.navigate("Home");
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const handleRegister = () => {
    login();
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
    console.log(text);
    setPassword(text.trim());
    if (text.trim().length === 0) {
      setIsFormValid(false);
    } else {
      validateForm();
    }
  };

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
            Hey Welcome back !
          </Text>
          <Text style={{ fontSize: 16, color: "black" }}>
            Let's get acquinted!
          </Text>
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
              placeholderTextColor="f89fa1"
              keyboardType="email-address"
              style={{ width: "100%" }}
              onChangeText={handleEmailChange}
            />
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
              placeholderTextColor="f89fa1"
              secureTextEntry={!isPasswordVisible}
              style={{ width: "100%" }}
              onChangeText={handlePasswordChange}
            />
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
          //   onPress={handleRegister}
          //   disabled={!isFormValid}
        >
          <Text
            style={{ color: "white", fontWeight: "bold", textAlign: "center" }}
          >
            Login
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
            Don't have an account ?
          </Text>
          <Pressable onPress={() => navigation.navigate("Registration")}>
            <Text
              style={{
                fontSize: 16,
                color: "#67104c",
                fontWeight: "bold",
                marginLeft: 6,
              }}
            >
              Registration
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};
