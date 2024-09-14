import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Suspense } from "react";
import { StyleSheet, Text, View } from "react-native";
import { IntroScreen } from "./screens/IntroScreen";
import { Registration } from "./components/Registration";
import { Login } from "./components/Login";

export default function App() {
  const MainStack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Suspense
        fallback={
          <View style={styles.loadingContainer}>
            <Text>Loading...</Text>
          </View>
        }
      >
        <MainStack.Navigator>
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
          {/* <MainStack.Screen
            name="Home"
            component={TabNavigate}
            options={{ headerShown: false }}
          /> */}
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
