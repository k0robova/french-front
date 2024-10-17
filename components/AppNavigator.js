import { useDispatch, useSelector } from "react-redux";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Registration } from "./Registration";
import { Login } from "./Login";
import { Home } from "../screens/Home";
import { LessonsBySubscription } from "./LessonsBySubscription";
import { StudyAndTrain } from "./StudyAndTrain";
import { useEffect } from "react";
import { getProfileThunk } from "../store/auth/authThunks";
import { Profile } from "../screens/Profile";
import { ForgotPassword } from "./ForgotPassword";
import { Support } from "./Support";
import { Vocab } from "./Vocab";
import { Phonetic } from "./Phonetic";
import { Verbs } from "./Verbs";
import { LearnOrTrainTopic } from "./LearnOrTrainTopic";
import { Learn } from "./Learn";
import { Train } from "./Train";
import { WordLearningScreen } from "./WordLearningScreen";

const MainStack = createNativeStackNavigator();

export const AppNavigator = () => {
  const isDarkTheme = useSelector((state) => state.auth.theme);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleGetProfile = async () => {
    try {
      const resultAction = await dispatch(getProfileThunk());
      if (getProfileThunk.fulfilled.match(resultAction)) {
        navigation.navigate("Home");
      }
      return;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetProfile();
  }, []);

  return (
    <MainStack.Navigator>
      <MainStack.Screen
        name="Registration"
        component={Registration}
        options={{ headerShown: false }}
      />
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
        options={({ navigation }) => ({
          title: ` ${t("LAT.lat")}`,
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: isDarkTheme ? "#67104c" : "white",
          },
          headerShadowVisible: false,
          headerTintColor: isDarkTheme ? "white" : "#67104c",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon
                name="arrowleft"
                size={30}
                color={isDarkTheme ? "white" : "#67104c"}
                style={{ marginLeft: 5 }}
              />
            </TouchableOpacity>
          ),
        })}
      />
      <MainStack.Screen
        name="LessonsBySubscription"
        component={LessonsBySubscription}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="Vocab"
        component={Vocab}
        options={({ navigation }) => ({
          title: ` ${t("LAT.vocab")}`,
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: isDarkTheme ? "#67104c" : "white",
          },
          headerShadowVisible: false,
          headerTintColor: isDarkTheme ? "white" : "#67104c",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon
                name="arrowleft"
                size={30}
                color={isDarkTheme ? "white" : "#67104c"}
                style={{ marginLeft: 5 }}
              />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate("Home")}>
              <Icon
                name="home"
                size={30}
                color={isDarkTheme ? "white" : "#67104c"}
                style={{ marginLeft: 5 }}
              />
            </TouchableOpacity>
          ),
        })}
      />
      <MainStack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="Support"
        component={Support}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="Phonetic"
        component={Phonetic}
        options={({ navigation }) => ({
          title: ` ${t("LAT.phonetic")}`,
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: isDarkTheme ? "#67104c" : "white",
          },
          headerShadowVisible: false,
          headerTintColor: isDarkTheme ? "white" : "#67104c",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon
                name="arrowleft"
                size={30}
                color={isDarkTheme ? "white" : "#67104c"}
                style={{ marginLeft: 5 }}
              />
            </TouchableOpacity>
          ),
        })}
      />
      <MainStack.Screen
        name="Verbs"
        component={Verbs}
        options={({ navigation }) => ({
          title: ` ${t("LAT.verbs")}`,
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: isDarkTheme ? "#67104c" : "white",
          },
          headerShadowVisible: false,
          headerTintColor: isDarkTheme ? "white" : "#67104c",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon
                name="arrowleft"
                size={30}
                color={isDarkTheme ? "white" : "#67104c"}
                style={{ marginLeft: 5 }}
              />
            </TouchableOpacity>
          ),
        })}
      />
      <MainStack.Screen
        name="LearnOrTrainTopic"
        component={LearnOrTrainTopic}
        options={({ navigation, route }) => {
          const { topicName } = route.params;
          return {
            title: topicName,
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: isDarkTheme ? "#67104c" : "white",
            },
            headerShadowVisible: false,
            headerTintColor: isDarkTheme ? "white" : "#67104c",
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon
                  name="arrowleft"
                  size={30}
                  color={isDarkTheme ? "white" : "#67104c"}
                  style={{ marginLeft: 5 }}
                />
              </TouchableOpacity>
            ),
          };
        }}
      />
      <MainStack.Screen
        name="Learn"
        component={Learn}
        options={({ navigation, route }) => {
          const { topicName } = route.params;
          return {
            title: topicName,
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: isDarkTheme ? "#67104c" : "white",
            },
            headerShadowVisible: false,
            headerTintColor: isDarkTheme ? "white" : "#67104c",
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon
                  name="arrowleft"
                  size={30}
                  color={isDarkTheme ? "white" : "#67104c"}
                  style={{ marginLeft: 5 }}
                />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate("Vocab")}>
                <Icon
                  name="home"
                  size={30}
                  color={isDarkTheme ? "white" : "#67104c"}
                  style={{ marginLeft: 5 }}
                />
              </TouchableOpacity>
            ),
          };
        }}
      />
      <MainStack.Screen
        name="Train"
        component={Train}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="WordLearningScreen"
        component={WordLearningScreen}
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
