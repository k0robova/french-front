import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { defaultStyles } from "./defaultStyles";
import { useDispatch, useSelector } from "react-redux";
import { updaterProgressUserThunk } from "../store/auth/authThunks";
import { LevelComponent } from "./LevelComponent";

export const SecondLevel = ({ level, progress, topicName }) => {
  // const [choices, setChoices] = useState([]);
  // const [currentImage, setCurrentImage] = useState(null);
  // const [wordStats, setWordStats] = useState([]);
  // const [totalCorrectAnswers, setTotalCorrectAnswers] = useState(0); // Загальна кількість правильних відповідей
  // const navigation = useNavigation();
  // const dispatch = useDispatch();
  // const isDarkTheme = useSelector((state) => state.auth.theme);

  // const setRandomImage = (stats) => {
  //   const remainingWords = stats.filter((stat) => stat.correctCount < 3);
  //   if (remainingWords.length === 0) {
  //     alert("Вітаю! Ви виконали всі завдання.");
  //     navigation.navigate("Train", { topicName });
  //     return;
  //   }
  //   const randomWord =
  //     remainingWords[Math.floor(Math.random() * remainingWords.length)];
  //   setCurrentImage(randomWord.word);
  //   generateChoices(randomWord.word);
  // };

  // const generateChoices = (correctWord) => {
  //   const wrongChoices = [];
  //   while (wrongChoices.length < 3) {
  //     const randomIndex = Math.floor(Math.random() * progress.length);
  //     const wrongChoice = progress[randomIndex];
  //     if (
  //       wrongChoice._id !== correctWord._id &&
  //       !wrongChoices.some((choice) => choice._id === wrongChoice._id)
  //     ) {
  //       wrongChoices.push(wrongChoice);
  //     }
  //   }

  //   const allChoices = [...wrongChoices, correctWord];

  //   setChoices(allChoices.sort(() => Math.random() - 0.5));
  // };

  // const markCurrentWordsAsCompleted = async () => {
  //   try {
  //     const updatedProgress = progress.map((word) => {
  //       if (wordStats.some((stat) => stat.word._id === word._id)) {
  //         return {
  //           ...word,
  //           completed: word.completed.includes(level)
  //             ? word.completed
  //             : [...word.completed, level],
  //         };
  //       }
  //       return word;
  //     });

  //     await AsyncStorage.setItem(
  //       `progress_${topicName}`,
  //       JSON.stringify(updatedProgress)
  //     );
  //   } catch (error) {
  //     console.error("Помилка оновлення прогресу:", error);
  //   }
  // };

  // const handleChoice = async (chosenWord) => {
  //   if (chosenWord._id === currentImage._id) {
  //     const updatedStats = wordStats.map((stat) =>
  //       stat.word._id === currentImage._id
  //         ? { ...stat, correctCount: stat.correctCount + 1 }
  //         : stat
  //     );
  //     setWordStats(updatedStats);
  //     const updatedTotalCorrectAnswers = totalCorrectAnswers + 1;
  //     setTotalCorrectAnswers(updatedTotalCorrectAnswers);

  //     if (updatedTotalCorrectAnswers === 15) {
  //       await markCurrentWordsAsCompleted();
  //       await dispatch(updaterProgressUserThunk());
  //       alert("Вітаю! Ви виконали всі завдання. Ви отримуєте 1 круасан");
  //       navigation.navigate("Train", { topicName });
  //     } else {
  //       setRandomImage(updatedStats);
  //     }
  //   } else {
  //     alert("Спробуйте ще раз!");
  //   }
  // };

  // const initializeWordStats = () => {
  //   const unfinishedWords = progress.filter(
  //     (word) => !word.completed.includes(level)
  //   );
  //   if (unfinishedWords.length === 0) return;
  //   const initialStats = unfinishedWords.slice(0, 5).map((word) => ({
  //     word,
  //     correctCount: 0,
  //   }));
  //   setWordStats(initialStats);
  //   setRandomImage(initialStats);
  // };

  // useEffect(() => {
  //   initializeWordStats();
  // }, [progress]);

  // const renderProgress = () => {
  //   const totalExercises = 15; // Загальна кількість завдань
  //   return (
  //     <View style={{ flexDirection: "row", justifyContent: "center" }}>
  //       {[...Array(totalExercises)].map((_, i) => (
  //         <View
  //           key={i}
  //           style={{
  //             width: 20,
  //             height: 20,
  //             borderRadius: 10,
  //             backgroundColor:
  //               i < totalCorrectAnswers
  //                 ? isDarkTheme
  //                   ? "white"
  //                   : "#67104c" // Для темної теми: білий, для світлої: червоний
  //                 : "#A9A9A9", // Для неправильних: сірий в обох темах
  //             margin: 3,
  //           }}
  //         />
  //       ))}
  //     </View>
  //   );
  // };

  const renderContent = (currentImage) => (
    <View style={{ alignItems: "center", marginVertical: 20 }}>
      {currentImage && (
        <Image
          source={{ uri: currentImage.image }}
          style={{ width: 200, height: 200, borderRadius: 10 }}
        />
      )}
    </View>
  );

  const renderChoices = (choices, handleChoice, isDarkTheme) => (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around",
        paddingHorizontal: 20,
      }}
    >
      {choices.map((choice) => (
        <TouchableOpacity
          key={choice._id}
          onPress={() => handleChoice(choice)}
          style={{
            backgroundColor: isDarkTheme ? "white" : "#67104c",
            padding: 15,
            margin: 10,
            borderRadius: 10,
            width: "40%",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: isDarkTheme ? "#67104c" : "white",
            }}
          >
            {choice.world}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <LevelComponent
      level={level}
      progress={progress}
      topicName={topicName}
      renderChoices={renderChoices}
      renderContent={renderContent}
    />
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
        {currentImage && (
          <Image
            source={{ uri: currentImage.image }}
            style={{ width: 200, height: 200, borderRadius: 10 }}
          />
        )}
      </View>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-around",
          paddingHorizontal: 20,
        }}
      >
        {choices.map((choice) => (
          <TouchableOpacity
            key={choice._id}
            onPress={() => handleChoice(choice)}
            style={{
              backgroundColor: isDarkTheme ? "white" : "#67104c",
              padding: 15,
              margin: 10,
              borderRadius: 10,
              width: "40%",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: isDarkTheme ? "#67104c" : "white",
              }}
            >
              {choice.world}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};
