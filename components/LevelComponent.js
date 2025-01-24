import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { updaterProgressUserThunk } from "../store/auth/authThunks";
import { defaultStyles } from "./defaultStyles";

export const LevelComponent = ({
  level,
  progress,
  topicName,
  renderContent,
  renderChoices,
}) => {
  const [choices, setChoices] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [wordStats, setWordStats] = useState([]);
  const [totalCorrectAnswers, setTotalCorrectAnswers] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isDarkTheme = useSelector((state) => state.auth.theme);

  const setRandomItem = (stats) => {
    const remainingItems = stats.filter((stat) => stat.correctCount < 3);
    if (remainingItems.length === 0) {
      alert("Вітаю! Ви виконали всі завдання.");
      navigation.navigate("Train", { topicName });
      return;
    }
    const randomItem =
      remainingItems[Math.floor(Math.random() * remainingItems.length)];
    setCurrentItem(randomItem.word);
    generateChoices(randomItem.word);
  };

  const generateChoices = (correctItem) => {
    const wrongChoices = [];
    while (wrongChoices.length < 3) {
      const randomIndex = Math.floor(Math.random() * progress.length);
      const wrongChoice = progress[randomIndex];
      if (
        wrongChoice._id !== correctItem._id &&
        !wrongChoices.some((choice) => choice._id === wrongChoice._id)
      ) {
        wrongChoices.push(wrongChoice);
      }
    }
    setChoices([...wrongChoices, correctItem].sort(() => Math.random() - 0.5));
  };

  const handleChoice = async (chosenItem) => {
    if (chosenItem._id === currentItem._id) {
      const updatedStats = wordStats.map((stat) =>
        stat.word._id === currentItem._id
          ? { ...stat, correctCount: stat.correctCount + 1 }
          : stat
      );
      setWordStats(updatedStats);
      const updatedTotalCorrectAnswers = totalCorrectAnswers + 1;
      setTotalCorrectAnswers(updatedTotalCorrectAnswers);

      if (updatedTotalCorrectAnswers === 15) {
        await markCurrentWordsAsCompleted();
        await dispatch(updaterProgressUserThunk());
        alert("Вітаю! Ви виконали всі завдання. Ви отримуєте 1 круасан");
        navigation.navigate("Train", { topicName });
      } else {
        setRandomItem(updatedStats);
      }
    } else {
      alert("Спробуйте ще раз!");
    }
  };

  const markCurrentWordsAsCompleted = async () => {
    try {
      const updatedProgress = progress.map((word) => {
        if (wordStats.some((stat) => stat.word._id === word._id)) {
          return {
            ...word,
            completed: word.completed.includes(level)
              ? word.completed
              : [...word.completed, level],
          };
        }
        return word;
      });

      await AsyncStorage.setItem(
        `progress_${topicName}`,
        JSON.stringify(updatedProgress)
      );
    } catch (error) {
      console.error("Помилка оновлення прогресу:", error);
    }
  };

  const playSound = async () => {
    if (!currentItem?.audio || isPlaying) return;

    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: currentItem.audio },
        {},
        (status) => {
          if (status.didJustFinish) {
            sound.unloadAsync();
            setIsPlaying(false);
          }
        }
      );
      setSound(sound);
      setIsPlaying(true);
      await sound.playAsync();
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  const initializeWordStats = () => {
    const unfinishedWords = progress.filter(
      (word) => !word.completed.includes(level)
    );
    if (unfinishedWords.length === 0) return;
    setWordStats(
      unfinishedWords.slice(0, 5).map((word) => ({ word, correctCount: 0 }))
    );
    setRandomItem(
      unfinishedWords.slice(0, 5).map((word) => ({ word, correctCount: 0 }))
    );
  };

  useEffect(() => {
    initializeWordStats();
  }, [progress]);

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

  if (level === 2) {
    return (
      <SafeAreaView
        style={[
          defaultStyles.container,
          { backgroundColor: isDarkTheme ? "#67104c" : "white" },
        ]}
      >
        {renderProgress()}
        {renderContent(currentItem, playSound, isDarkTheme, isPlaying)}
        {renderChoices(choices, handleChoice, isDarkTheme)}
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView
        style={[
          defaultStyles.container,
          { backgroundColor: isDarkTheme ? "#67104c" : "white" },
        ]}
      >
        {renderProgress()}
        {renderChoices(choices, handleChoice, isDarkTheme)}
        {renderContent(currentItem, playSound, isDarkTheme, isPlaying)}
      </SafeAreaView>
    );
  }
};
