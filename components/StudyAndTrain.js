import { useTranslation } from "react-i18next";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { getTopic } from "../store/topic/topicThunk";
import { selectTopic } from "../store/topic/selectors";

export const StudyAndTrain = () => {
  const { t } = useTranslation();
  const isDarkTheme = useSelector((state) => state.auth.theme);
  const topicsData = useSelector(selectTopic);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleGetTheme = async () => {
    try {
      if (topicsData && topicsData.length > 0) {
        navigation.navigate("Vocab");
        return;
      }

      const resultAction = await dispatch(getTopic());
      if (getTopic.fulfilled.match(resultAction)) {
        navigation.navigate("Vocab");
      }
      return;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDarkTheme ? "#67104c" : "white" },
      ]}
    >
      <View style={styles.linkContainer}>
        <Pressable
          style={[
            styles.button,
            { backgroundColor: isDarkTheme ? "white" : "#67104c" },
          ]}

          onPress={() => handleGetTheme()}

        >
          <Text
            // style={[
            //   styles.linkText,
            //   styles.boldText,
            //   {
            //     backgroundColor: isDarkTheme ? "white" : "#67104c",
            //     color: isDarkTheme ? "#67104c" : "white",
            //   },
            // ]}
            style={{
              color: isDarkTheme ? "#67104c" : "white",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {t("LAT.vocab")}
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.button,
            { backgroundColor: isDarkTheme ? "white" : "#67104c" },
          ]}
          onPress={() => navigation.navigate("Phonetic")}
        >
          <Text
            style={{
              color: isDarkTheme ? "#67104c" : "white",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {t("LAT.phonetic")}
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.button,
            { backgroundColor: isDarkTheme ? "white" : "#67104c" },
          ]}
          onPress={() => navigation.navigate("Verbs")}
        >
          <Text
            style={{
              color: isDarkTheme ? "#67104c" : "white",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {t("LAT.verbs")}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  themeButtonContainer: {
    padding: 20,
  },
  welcomeText: {
    fontSize: 25,
    textAlign: "center",
  },
  linkContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  linkText: {
    fontSize: 24,
    padding: 15,
    borderRadius: 35,
    fontWeight: "bold",
  },
  boldText: {
    marginBottom: 10,
  },
  button: {
    marginTop: 18,
    marginBottom: 4,
    borderRadius: 100,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: 343,
    height: 51,
  },
});
