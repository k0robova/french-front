import { useEffect, useState, useCallback } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import { selectVocab } from "../store/vocab/selectors";
import { useFocusEffect } from "@react-navigation/native";

export const Learn = () => {
  const { t } = useTranslation();
  const route = useRoute();
  const { topicName, allWordsCompleted: initialAllWordsCompleted } =
    route.params;
  const isDarkTheme = useSelector((state) => state.auth.theme);
  const navigation = useNavigation();
  const vocabData = useSelector(selectVocab);
  const [progress, setProgress] = useState(0);
  const [allWordsCompleted, setAllWordsCompleted] = useState(
    initialAllWordsCompleted
  );

  // Функція для отримання кількості пройдених слів з AsyncStorage
  const fetchProgress = async () => {
    try {
      const storedProgress = await AsyncStorage.getItem(
        `progress_${topicName}`
      );
      if (storedProgress) {
        setProgress(parseInt(storedProgress, 10));
      }
    } catch (error) {
      console.error("Error fetching progress from storage:", error);
    }
  };

  // Використовуємо useFocusEffect для оновлення при кожному поверненні на цей екран
  useFocusEffect(
    useCallback(() => {
      fetchProgress();
    }, [topicName])
  );

  // Обробка вибору кількості слів
  const handlePress = (count) => {
    navigation.navigate("WordLearningScreen", { count, topicName });
  };

  const deleteStore = async () => {
    try {
      await AsyncStorage.removeItem(`progress_${topicName}`);
      setProgress(0);
      setAllWordsCompleted(false); // Оновлюємо стан, щоб повернутися до вибору слів
      console.log(`Progress for topic ${topicName} has been deleted.`);
    } catch (error) {
      console.error("Error removing progress from storage:", error);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDarkTheme ? "#67104c" : "white" },
      ]}
    >
      {progress >= vocabData.length ? (
        <View>
          <Text style={{ fontSize: 18, marginBottom: 20 }}>
            {progress}/{vocabData.length} {t("LAT.completedWords")}
          </Text>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: isDarkTheme ? "white" : "#67104c" },
            ]}
            onPress={deleteStore}
          >
            <Text
              style={{
                color: isDarkTheme ? "#67104c" : "white",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              StoreDelete
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.linkContainer}>
          <Text style={{ fontSize: 18, marginBottom: 20 }}>
            {progress}/{vocabData.length} {t("LAT.completedWords")}
          </Text>

          {[5, 10, 15, 20].map((count) => (
            <TouchableOpacity
              key={count}
              style={[
                styles.button,
                { backgroundColor: isDarkTheme ? "white" : "#67104c" },
              ]}
              onPress={() => handlePress(count)}
            >
              <Text
                style={{
                  color: isDarkTheme ? "#67104c" : "white",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {count} {t("LAT.words")}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  linkContainer: {
    justifyContent: "center",
    alignItems: "center",
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
