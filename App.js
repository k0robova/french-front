import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Suspense, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { StyleSheet, Text, View } from "react-native";
import { IntroScreen } from "./screens/IntroScreen";
import { Registration } from "./components/Registration";
import { Login } from "./components/Login";
import { Home } from "./screens/Home";
import { getProfile } from "./services/authService";

const fetchAndStoreUserProfile = async (token) => {
  try {
    const data = await getProfile(token);
    await SecureStore.setItemAsync("user", JSON.stringify(data));
  } catch (error) {
    console.log("Error fetching and storing user profile:", error);
    throw error;
  }
};

export default function App() {
  const MainStack = createNativeStackNavigator();

  const [isToken, setIsToken] = useState(null);

  const checkToken = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync("token");
      if (storedToken) {
        await fetchAndStoreUserProfile(storedToken);
        setIsToken(true);
      } else {
        setIsToken(false);
      }
    } catch (error) {
      setIsToken(false);
      console.log("Error checking token:", error);
    }
  };

  const loadAppData = async () => {
    try {
      await checkToken();
    } catch (error) {
      console.log("Error loading app data:", error);
    }
  };

  useEffect(() => {
    loadAppData();
  }, []);

  if (isToken === null) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Suspense
        fallback={
          <View style={styles.loadingContainer}>
            <Text>Loading...</Text>
          </View>
        }
      >
        <MainStack.Navigator
          initialRouteName={isToken ? "Home" : "IntroScreen"}
        >
          <MainStack.Screen
            name="IntroScreen"
            component={IntroScreen}
            options={{ headerShown: false }}
          />
          <MainStack.Screen
            name="Registration"
            component={Registration}
            options={{ headerShown: false }}
          />
          {/* <MainStack.Screen
            name="ResetPassword"
            component={ResetPassword}
            options={({ navigation }) => ({
              title: "Reset password",
              headerTitleAlign: "center",
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Icon
                    name="arrowleft"
                    size={30}
                    color="black"
                    style={{ marginLeft: 10 }}
                  />
                </TouchableOpacity>
              ),
            })}
          /> */}
          <MainStack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <MainStack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
        </MainStack.Navigator>
      </Suspense>
    </NavigationContainer>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
