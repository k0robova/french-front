import { useDispatch } from "react-redux";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { IntroScreen } from "../screens/IntroScreen";
import { Registration } from "./Registration";
import { Login } from "./Login";
import { Home } from "../screens/Home";
import { LessonsBySubscription } from "./LessonsBySubscription";
import { StudyAndTrain } from "./StudyAndTrain";
import { useEffect } from "react";
import { getProfileThunk } from "../store/auth/authThunks";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const MainStack = createNativeStackNavigator();

export const AppNavigator = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleGetProfile = async () => {
    try {
      const resultAction = await dispatch(getProfileThunk());
      if (getProfileThunk.fulfilled.match(resultAction)) {
        navigation.navigate("Home");
      }
      return;
    } catch (error) {}
  };

  useEffect(() => {
    handleGetProfile();
  }, []);

  return (
    <MainStack.Navigator initialRouteName={isToken ? "Home" : "IntroScreen"}>
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
      <MainStack.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="StudyAndTrain"
        component={StudyAndTrain}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="LessonsBySubscription"
        component={LessonsBySubscription}
        options={{ headerShown: false }}
      />
    </MainStack.Navigator>
  );
};

// Стилі для лоадера
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
