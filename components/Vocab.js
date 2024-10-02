import { useTranslation } from "react-i18next";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

export const Vocab = () => {
  const { t } = useTranslation();
  const isDarkTheme = useSelector((state) => state.auth.theme);
  const navigation = useNavigation();

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDarkTheme ? "#67104c" : "white" },
      ]}
    >
      <View style={styles.linkContainer}>
        <Pressable onPress={() => navigation.navigate("Home")}>
          <Text
            style={[
              styles.linkText,
              styles.boldText,
              {
                backgroundColor: isDarkTheme ? "white" : "#67104c",
                color: isDarkTheme ? "#67104c" : "white",
              },
            ]}
          >
            {t("LAT.vocab")}
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
});
