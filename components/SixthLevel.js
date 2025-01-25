import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  Image,
  TextInput,
  Alert,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { defaultStyles } from "./defaultStyles";
import { updaterProgressUserThunk } from "../store/auth/authThunks";

export const SixthLevel = ({ progress, level, topicName }) => {
  const [word, setWord] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [totalCorrectAnswers, setTotalCorrectAnswers] = useState(0);
  const [iteration, setIteration] = useState(0); // Лічильник ітерацій
  const [wordStats, setWordStats] = useState([]);
  const [userInput, setUserInput] = useState(""); // Змінено для цілих слів

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isDarkTheme = useSelector((state) => state.auth.theme);

  // Ініціалізація слів з прогресу
  const initializeWordStats = () => {
    const unfinishedWords = progress.filter(
      (word) => !word.completed.includes(level)
    );
    if (unfinishedWords.length === 0) return;

    const selectedWords = unfinishedWords.slice(0, 5);
    const repeatedWords = [];
    for (let i = 0; i < 3; i++) {
      repeatedWords.push(...selectedWords);
    }
    setWordStats(repeatedWords.map((word) => ({ word, correctCount: 0 })));
  };

  useEffect(() => {
    initializeWordStats();
  }, [progress]);

  useEffect(() => {
    if (wordStats.length > 0 && iteration < wordStats.length) {
      const currentWord = wordStats[iteration];
      console.log("Правильне слово:", currentWord.word.world);
      setWord(currentWord.word.world);
      setImageUrl(currentWord.word.image);
    }
  }, [iteration, wordStats]);

  // Обробка введення користувача
  const handleUserInputChange = (value) => {
    setUserInput(value);
  };

  // Перевірка введеного слова
  const checkAnswer = async () => {
    // console.log("Перевірка відповіді почалась");
    if (!userInput) {
      Alert.alert("Помилка", "Поле не може бути порожнім!");
      return;
    }

    const normalizedUserInput = userInput.trim().toLowerCase();
    const normalizedCorrectWord = word.trim().toLowerCase();

    if (normalizedUserInput === normalizedCorrectWord) {
      console.log("Вірно! Слово співпало.");
      const updatedTotalCorrectAnswers = totalCorrectAnswers + 1;
      setTotalCorrectAnswers(updatedTotalCorrectAnswers);

      if (updatedTotalCorrectAnswers === 15) {
        await markCurrentWordsAsCompleted();
        await dispatch(updaterProgressUserThunk());
        alert("Вітаю! Ви виконали всі завдання.");
        navigation.navigate("Train", { topicName });
        return;
      }

      handleNextIteration();
    } else {
      Alert.alert("Неправильно", "Спробуйте ще раз.");
    }
  };

  // Оновлення прогресу для поточного слова
  const markCurrentWordsAsCompleted = async () => {
    try {
      const updatedProgress = progress.map((wordItem) => {
        if (wordItem.word === word) {
          return {
            ...wordItem,
            completed: wordItem.completed.includes(level)
              ? wordItem.completed
              : [...wordItem.completed, level],
          };
        }
        return wordItem;
      });

      await AsyncStorage.setItem(
        `progress_${topicName}`,
        JSON.stringify(updatedProgress)
      );
    } catch (error) {
      console.error("Помилка оновлення прогресу:", error);
    }
  };

  // Перехід до наступного слова
  const handleNextIteration = () => {
    setIteration((prev) => prev + 1);
    setUserInput(""); // Очистити введення
  };

  // Виведення прогресу
  const renderProgress = () => (
    <View style={{ flexDirection: "row", justifyContent: "center" }}>
      {[...Array(15)].map((_, i) => (
        <View
          key={i}
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor:
              i < totalCorrectAnswers
                ? isDarkTheme
                  ? "white"
                  : "#67104c"
                : "#A9A9A9",
            margin: 3,
          }}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView
      style={[
        defaultStyles.container,
        { backgroundColor: isDarkTheme ? "#67104c" : "white" },
      ]}
    >
      {renderProgress()}

      <View style={{ alignItems: "center", marginVertical: 20 }}>
        {imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            style={{ width: 200, height: 200, borderRadius: 10 }}
          />
        )}
      </View>

      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          color: isDarkTheme ? "white" : "#67104c",
        }}
      >
        Напишіть правильне слово:
      </Text>

      <TextInput
        style={{
          fontSize: 24,
          textAlign: "center",
          borderWidth: 1,
          borderColor: isDarkTheme ? "white" : "#67104c",
          borderRadius: 10,
          padding: 10,
          marginHorizontal: 20,
          marginVertical: 20,
          color: isDarkTheme ? "white" : "#67104c",
        }}
        placeholder="Введіть слово"
        placeholderTextColor={isDarkTheme ? "white" : "#67104c"}
        value={userInput}
        onChangeText={handleUserInputChange}
        autoCapitalize="none"
        keyboardType="default"
      />

      <Pressable
        style={[
          defaultStyles.button,
          { backgroundColor: isDarkTheme ? "white" : "#67104c" },
        ]}
        onPress={checkAnswer}
      >
        <Text
          style={[
            defaultStyles.btnText,
            { color: isDarkTheme ? "#67104c" : "white" },
          ]}
        >
          Перевірити
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};
