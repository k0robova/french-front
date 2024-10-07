import React, { useCallback, useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  View,
  Button,
  Image,
  StyleSheet,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { selectVocab } from "../store/vocab/selectors";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const WordLearningScreen = () => {
  const route = useRoute(); // Отримуємо параметри з попереднього екрану
  const { count, topicName } = route.params; // Дістаємо кількість слів
  const [currentIndex, setCurrentIndex] = useState(0); // Поточний індекс слова
  const [totalShown, setTotalShown] = useState(0); // Для відстеження загальної кількості показаних слів
  const [completedWords, setCompletedWords] = useState([]); // Для збереження індексів пройдених слів
  const { t, i18n } = useTranslation();
  const vocabData = useSelector(selectVocab); // Слова по темі
  const navigation = useNavigation();
  const [selectedWords, setSelectedWords] = useState([]); // Початкові слова
  const currentLanguage = i18n.language;

  // Стан для відстеження завершення сесії
  const [sessionComplete, setSessionComplete] = useState(false);

  // Завантаження прогресу з AsyncStorage при завантаженні компоненту
  useEffect(() => {
    const loadProgress = async () => {
      const savedProgress = await AsyncStorage.getItem(`progress_${topicName}`);
      if (savedProgress) {
        setTotalShown(parseInt(savedProgress, 10));
      }
      setSelectedWords(vocabData.slice(totalShown, totalShown + count)); // Вибираємо слова з урахуванням прогресу
    };
    loadProgress();
  }, [vocabData, totalShown]);

  // Збереження прогресу в AsyncStorage
  const saveProgress = async (newTotalShown) => {
    await AsyncStorage.setItem(
      `progress_${topicName}`,
      newTotalShown.toString()
    );
  };

  // Переходимо до наступного слова або завершення
  const handleNextWord = () => {
    if (currentIndex < selectedWords.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      const newTotalShown = totalShown + selectedWords.length;
      setSessionComplete(true); // Встановлюємо стан завершення сесії
      setTotalShown(newTotalShown); // Оновлюємо загальну кількість показаних слів
      saveProgress(newTotalShown); // Зберігаємо прогрес
    }
  };

  // Обробники кнопок
  const handleRepeatSameCount = () => {
    const nextStartIndex = totalShown; // Початок для наступних слів
    const nextEndIndex = Math.min(totalShown + count, vocabData.length); // Перевіряємо, чи не виходимо за межі масиву

    if (nextEndIndex > nextStartIndex) {
      setSelectedWords(vocabData.slice(nextStartIndex, nextEndIndex)); // Вибираємо наступні слова
      setCurrentIndex(0); // Скидаємо індекс
      setSessionComplete(false); // Повертаємо стан сесії
    } else {
      alert("No more new words to show!"); // Якщо немає нових слів
    }
  };

  const handleTrainWords = () => {
    alert("Training words...");
  };

  const handleChooseDifferentCount = () => {
    navigation.navigate("Learn", { topicName }); // Повернення на екран вибору кількості слів
  };

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      {!sessionComplete ? (
        <>
          <Image
            source={{ uri: selectedWords[currentIndex]?.image }} // Припускаємо, що у вас є поле `image` в об'єкті слова
            style={styles.image}
          />
          <Text style={{ fontSize: 30, fontWeight: "bold" }}>
            {selectedWords[currentIndex]?.world}{" "}
            {/* Відображаємо поточне слово */}
          </Text>
          <Text style={{ fontSize: 20, marginTop: 20 }}>
            {currentLanguage === "uk"
              ? selectedWords[currentIndex]?.translationUK
              : selectedWords[currentIndex]?.translationEN}{" "}
            {/* Відображаємо переклад */}
          </Text>
          <Button title="Next" onPress={handleNextWord} />
        </>
      ) : (
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 24, marginBottom: 20 }}>
            You have completed the session!
          </Text>
          <Button title="Repeat Same Count" onPress={handleRepeatSameCount} />
          <Button title="Train Words" onPress={handleTrainWords} />
          <Button
            title="Choose Different Count"
            onPress={handleChooseDifferentCount}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 200, // Ширина зображення
    height: 200, // Висота зображення
    marginBottom: 20, // Відстань між зображенням та текстом
    borderRadius: 10, // Закруглення країв зображення (за бажанням)
  },
});
