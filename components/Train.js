import { useCallback, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { defaultStyles } from "./defaultStyles";

export const Train = () => {
  const navigation = useNavigation();
  const isDarkTheme = useSelector((state) => state.auth.theme);
  const route = useRoute();

  const { topicName } = route.params;
  const [progress, setProgress] = useState([]);
  const [isLevel1Completed, setIsLevel1Completed] = useState(false);

  // Оновлюємо прогрес після того, як ви закінчите навчання або повернетеся на екран
  const updateProgress = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(`progress_${topicName}`);
      const storageProgress = jsonValue != null ? JSON.parse(jsonValue) : [];
      setProgress(storageProgress);

      // Перевірка завершення всіх слів
      const isAllWordsCompleted = storageProgress.every(
        (word) => word.completed
      );
      if (isAllWordsCompleted) {
        alert("Вітаю! Ви завершили всі слова першого рівня.");
        setIsLevel1Completed(true);
      } else {
        setIsLevel1Completed(false);
      }
    } catch (error) {
      console.error("Error fetching progress from storage:", error);
    }
  };

  // Викликаємо `updateProgress` при фокусуванні на екрані Train
  useFocusEffect(
    useCallback(() => {
      updateProgress(); // Оновлюємо прогрес
    }, [topicName])
  );

  // Оновлення прогресу в AsyncStorage після змін (наприклад, при завершенні рівня)
  useEffect(() => {
    const saveProgressToStorage = async () => {
      try {
        await AsyncStorage.setItem(
          `progress_${topicName}`,
          JSON.stringify(progress)
        );
      } catch (error) {
        console.error("Error saving progress:", error);
      }
    };

    if (progress.length > 0) {
      saveProgressToStorage(); // Записуємо новий прогрес після кожної зміни
    }
  }, [progress, topicName]);

  // Обробка переходу до рівнів
  const handlePress = (level) => {
    if (progress.length > 0 && (level !== 1 || !isLevel1Completed)) {
      navigation.navigate("TrainingLevel", { level, topicName, progress });
    }
  };

  // Обробка переходу до вивчення слів
  const goToLearn = () => {
    navigation.navigate("Learn", { topicName });
  };

  return (
    <SafeAreaView
      style={[
        defaultStyles.container,
        { backgroundColor: isDarkTheme ? "#67104c" : "white" },
      ]}
    >
      <View style={defaultStyles.btnContainer}>
        {progress.length === 0 && (
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 18,
                color: isDarkTheme ? "white" : "#67104c",
                textAlign: "center",
              }}
            >
              Щоб відкрилось тренування, вам потрібно вивчити хоча б декілька
              слів.
            </Text>
            <TouchableOpacity
              style={[
                defaultStyles.button,
                {
                  backgroundColor: isDarkTheme ? "white" : "#67104c",
                  marginTop: 20,
                },
              ]}
              onPress={goToLearn}
            >
              <Text
                style={[
                  defaultStyles.btnText,
                  { color: isDarkTheme ? "#67104c" : "white" },
                ]}
              >
                Вивчити слова
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {[1, 2, 3, 4, 5, 6, 7].map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              defaultStyles.button,
              {
                backgroundColor: isDarkTheme ? "white" : "#67104c",
                opacity:
                  progress.length > 0 &&
                  (level === 1 ? !isLevel1Completed : true)
                    ? 1
                    : 0.5,
              },
            ]}
            onPress={() => handlePress(level)}
            disabled={
              progress.length === 0 || (level === 1 && isLevel1Completed)
            }
          >
            <Text
              style={[
                defaultStyles.btnText,
                { color: isDarkTheme ? "#67104c" : "white" },
              ]}
            >
              Level {level}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};
