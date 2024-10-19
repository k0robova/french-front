import React, { useCallback, useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  View,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Audio } from "expo-av";
import Icon from "react-native-vector-icons/AntDesign";
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
  const { t, i18n } = useTranslation();
  const vocabData = useSelector(selectVocab); // Слова по темі
  const navigation = useNavigation();
  const [selectedWords, setSelectedWords] = useState([]); // Початкові слова
  const currentLanguage = i18n.language;
  const id = useSelector((state) => state.vocab.themeId);
  const [sound, setSound] = useState(); // Стейт для зберігання звуку
  const [isPlaying, setIsPlaying] = useState(false); // Стейт для відстеження, чи грає аудіо

  // Стан для відстеження завершення сесії
  const [sessionComplete, setSessionComplete] = useState(false);

  // Стан для відстеження, чи всі слова пройдені
  const [allWordsCompleted, setAllWordsCompleted] = useState(false);

  // Фільтрування слів за темою
  const filteredWords = vocabData.filter((word) => word.themeId === id);

  // Завантаження прогресу з AsyncStorage при завантаженні компоненту
  useEffect(() => {
    const loadProgress = async () => {
      const savedProgress = await AsyncStorage.getItem(`progress_${topicName}`);
      if (savedProgress) {
        setTotalShown(parseInt(savedProgress, 10));
      }
      setSelectedWords(filteredWords.slice(totalShown, totalShown + count)); // Вибираємо слова з урахуванням прогресу
    };
    loadProgress();
  }, [totalShown]);

  // Збереження прогресу в AsyncStorage
  const saveProgress = async (newTotalShown) => {
    await AsyncStorage.setItem(
      `progress_${topicName}`,
      newTotalShown.toString()
    );
  };

  // Перевірка, чи всі слова пройдені
  useEffect(() => {
    if (totalShown >= filteredWords.length) {
      setAllWordsCompleted(true);
    }
  }, [totalShown, filteredWords.length]);

  // Переходимо до наступного слова або завершення
  const handleNextWord = () => {
    if (currentIndex < selectedWords.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      const newTotalShown = totalShown + selectedWords.length;
      setSessionComplete(true); // Встановлюємо стан завершення сесії
      setTotalShown(newTotalShown); // Оновлюємо загальну кількість показаних слів
      saveProgress(newTotalShown); // Зберігаємо прогрес

      // Перевіряємо, чи всі слова за темою вже пройдені
      if (newTotalShown >= filteredWords.length) {
        setAllWordsCompleted(true); // Якщо всі слова пройдені, встановлюємо цей стан
      }
    }
  };

  // Обробники кнопок
  const handleRepeatSameCount = () => {
    const nextStartIndex = totalShown; // Початок для наступних слів
    const nextEndIndex = Math.min(totalShown + count, filteredWords.length); // Перевіряємо, чи не виходимо за межі масиву

    if (nextEndIndex > nextStartIndex) {
      setSelectedWords(filteredWords.slice(nextStartIndex, nextEndIndex)); // Вибираємо наступні слова
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
    setTotalShown(0); // Обнуляємо загальну кількість показаних слів
    navigation.navigate("Learn", { topicName }); // Повернення на екран вибору кількості слів
  };

  const onRepeat = async () => {
    // Скидаємо прогрес для поточної теми в AsyncStorage
    await AsyncStorage.removeItem(`progress_${topicName}`);

    // Скидаємо поточні стани
    setCurrentIndex(0); // Повертаємось до першого слова
    // setTotalShown(0); // Обнуляємо загальну кількість показаних слів
    setSessionComplete(false); // Відміняємо стан завершення сесії
    setAllWordsCompleted(false); // Відміняємо стан, що всі слова пройдені

    // Вибираємо слова спочатку
    setSelectedWords(filteredWords.slice(0, count));
  };

  const playSound = async () => {
    if (isPlaying) {
      return; // Якщо звук вже грає, не дозволяємо повторно запускати
    }

    try {
      const audioUri = selectedWords[currentIndex]?.audio; // Отримуємо аудіо для поточного слова
      console.log("Audio URI:", audioUri);
      if (!audioUri) {
        console.log("No audio available for this word."); // Якщо аудіо немає, виводимо попередження
        return;
      }

      setIsPlaying(true); // Встановлюємо стан, що звук грає

      // Завантажуємо звук
      const { sound: newSound } = await Audio.Sound.createAsync({
        uri: audioUri, // Використовуємо аудіо для поточного слова
      });

      setSound(newSound); // Зберігаємо новий звук

      // Програємо звук
      await newSound.playAsync();

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false); // Звук завершився
        }
      });
    } catch (error) {
      console.error("Error playing sound:", error);
      setIsPlaying(false); // У разі помилки дозволяємо натискати знову
    }
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync(); // Вивільняємо звук при розмонтуванні компонента
      }
    };
  }, [sound]);

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      {!sessionComplete ? (
        <>
          {!allWordsCompleted ? (
            <>
              <Image
                source={{ uri: selectedWords[currentIndex]?.image }} // Припускаємо, що у вас є поле `image` в об'єкті слова
                style={styles.image}
              />
              <TouchableOpacity onPress={playSound} disabled={isPlaying}>
                <Icon
                  name="sound"
                  size={30}
                  color={isPlaying ? "gray" : "black"}
                />
              </TouchableOpacity>
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
              <Text>Слово: {currentIndex + 1}</Text>
              <Button title="Next" onPress={handleNextWord} />
            </>
          ) : (
            <View>
              <Text style={{ fontSize: 24, marginBottom: 20 }}>
                All words have been completed for this topic!
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Vocab")}>
                <Icon
                  name="home"
                  size={30}
                  // color={isDarkTheme ? "white" : "#67104c"}
                  style={{ marginLeft: 5 }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={onRepeat}>
                <Icon
                  name="retweet"
                  size={30}
                  // color={isDarkTheme ? "white" : "#67104c"}
                  style={{ marginLeft: 5 }}
                />
              </TouchableOpacity>
            </View>
          )}
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
