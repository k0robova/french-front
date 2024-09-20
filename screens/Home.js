import { SafeAreaView, Text, View, StyleSheet, Button } from "react-native";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export const Home = () => {
  const { t, i18n } = useTranslation();
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang); // зміна мови в додатку
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ padding: 20 }}>
        <Button
          title={t("rg.changeLanguage")}
          onPress={() => changeLanguage(i18n.language === "en" ? "ua" : "en")}
        />
        <Button
          title={isDarkTheme ? "Switch to Light Theme" : "Switch to Dark Theme"}
          onPress={toggleTheme}
        />
      </View>
      <Text style={styles.text}>{t("hm.welcome")}</Text>
      <Text style={styles.text}>Study and train</Text>
      <Text style={styles.text}>Lessons by subscriptions</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Це дозволяє SafeAreaView займати весь доступний простір
    justifyContent: "center", // Центрує контент по вертикалі
    alignItems: "center", // Центрує контент по горизонталі
    backgroundColor: "white", // Додайте фон для видимості
  },
  text: {
    fontSize: 20,
    color: "black",
  },
});
