import { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/AntDesign";
import { Audio } from "expo-av";
import { defaultStyles } from "./defaultStyles";
import { useDispatch, useSelector } from "react-redux";
import { updaterProgressUserThunk } from "../store/auth/authThunks";

export const TrainingLevel = () => {
  const route = useRoute();
  const { topicName, progress } = route.params;
  const [choices, setChoices] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [wordStats, setWordStats] = useState([]);
  const [totalCorrectAnswers, setTotalCorrectAnswers] = useState(0); // Загальна кількість правильних відповідей
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const isDarkTheme = useSelector((state) => state.auth.theme);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Встановити випадкове слово
  const setRandomWord = (stats) => {
    const remainingWords = stats.filter((stat) => stat.correctCount < 3);
    if (remainingWords.length === 0) {
      // Завершення тренування
      alert("Вітаю! Ви виконали всі завдання.");
      navigation.navigate("Train", { topicName });
      return;
    }
    const randomWord =
      remainingWords[Math.floor(Math.random() * remainingWords.length)];
    setCurrentWord(randomWord.word);
    generateChoices(randomWord.word);
  };

  // Генерація варіантів відповідей
  const generateChoices = (correctWord) => {
    const wrongChoices = [];
    while (wrongChoices.length < 3) {
      const randomIndex = Math.floor(Math.random() * progress.length);
      const wrongChoice = progress[randomIndex];
      if (
        wrongChoice._id !== correctWord._id &&
        !wrongChoices.includes(wrongChoice)
      ) {
        wrongChoices.push(wrongChoice);
      }
    }
    const allChoices = [...wrongChoices, correctWord];
    setChoices(allChoices.sort(() => Math.random() - 0.5));
  };

  const markCurrentWordsAsCompleted = async () => {
    try {
      const updatedProgress = progress.map((word) =>
        wordStats.some((stat) => stat.word._id === word._id)
          ? { ...word, completed: true }
          : word
      );

      // Зберігаємо оновлений прогрес
      await AsyncStorage.setItem(
        `progress_${topicName}`,
        JSON.stringify(updatedProgress)
      );
    } catch (error) {
      console.error("Помилка оновлення прогресу:", error);
    }
  };

  // Обробка вибору
  const handleChoice = async (chosenWord) => {
    if (chosenWord._id === currentWord._id) {
      // Якщо відповідь правильна
      setWordStats((prevStats) => {
        const updatedStats = prevStats.map((stat) =>
          stat.word._id === currentWord._id
            ? { ...stat, correctCount: stat.correctCount + 1 }
            : stat
        );
        return updatedStats;
      });

      setTotalCorrectAnswers((prev) => prev + 1); // Збільшуємо загальну кількість правильних відповідей

      // Переходимо до наступного завдання, якщо ще не виконано 15
      if (totalCorrectAnswers + 1 === 15) {
        markCurrentWordsAsCompleted();
        await dispatch(updaterProgressUserThunk());
        alert("Вітаю! Ви виконали всі завдання. Ви отримуєте 1 круасан");
        navigation.navigate("Train", { topicName });
      } else {
        setRandomWord(wordStats); // Вибір нового слова
      }
    } else {
      alert("Спробуйте ще раз!");
    }
  };

  // Відображення прогресу
  const renderProgress = () => {
    const totalExercises = 15; // Загальна кількість завдань
    return (
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        {[...Array(totalExercises)].map((_, i) => (
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
                    : "#67104c" // Для темної теми: білий, для світлої: червоний
                  : "#A9A9A9", // Для неправильних: сірий в обох темах
              margin: 3,
            }}
          />
        ))}
      </View>
    );
  };

  const playSound = async () => {
    try {
      if (isPlaying) return;
      const audioUri = currentWord?.audio;
      if (!audioUri) {
        console.log("No audio available for this word.");
        return;
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        {},
        onPlaybackStatusUpdate
      );
      setSound(sound);
      await sound.playAsync();
      setIsPlaying(true);
    } catch (error) {
      console.error("Error playing sound:", error);
      setIsPlaying(false);
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.didJustFinish) {
      sound.unloadAsync(); // Очищення звуку після завершення
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const unfinishedWords = progress.filter((word) => !word.completed);
    if (unfinishedWords.length === 0); // Якщо немає даних
    const initialStats = unfinishedWords.slice(0, 5).map((word) => ({
      word,
      correctCount: 0,
    }));
    setWordStats(initialStats);
    setRandomWord(initialStats);
  }, [progress]);

  return (
    <SafeAreaView
      style={[
        defaultStyles.container,
        { backgroundColor: isDarkTheme ? "#67104c" : "white" },
      ]}
    >
      {renderProgress()}
      <View>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 0,
            padding: 40,
            justifyContent: "space-around",
            alignItems: "center",
            paddingHorizontal: 20,
            marginTop: 20,
          }}
        >
          {choices.map((choice) => (
            <TouchableOpacity
              key={choice._id}
              onPress={() => handleChoice(choice)}
              style={{
                width: 140,
                height: 140,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Image
                source={{ uri: choice.image }}
                style={{
                  width: 140,
                  height: 140,
                  borderRadius: 10,
                  borderWidth: 1, // Тонкий бордер
                  borderColor: isDarkTheme ? "white" : "#67104c",
                }}
              />
            </TouchableOpacity>
          ))}
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 30,
              marginBottom: 20,
              textAlign: "center",
              fontWeight: "bold",
              color: isDarkTheme ? "white" : "black",
            }}
          >
            {currentWord?.world}
          </Text>

          <TouchableOpacity onPress={playSound} disabled={isPlaying}>
            <Icon name="sound" size={30} color={isPlaying ? "gray" : "black"} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};