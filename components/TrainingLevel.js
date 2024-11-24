import { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/AntDesign";
import { Audio } from "expo-av";
import { defaultStyles } from "./defaultStyles";
import { useSelector } from "react-redux";

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

  // Обробка вибору
  const handleChoice = (chosenWord) => {
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
                i < totalCorrectAnswers ? "#67104c" : "lightgray",
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

  const handleGoHome = () => {
    Alert.alert(
      "Попередження",
      "Якщо ви вийдете, ваш прогрес буде втрачено. Ви впевнені, що хочете вийти?",
      [
        {
          text: "Залишитись",
          onPress: () => console.log("Залишаємося на ст"),
          style: "cancel",
        },
        {
          text: "Вийти",
          onPress: () => navigation.navigate("Home"),
          style: "destructive",
        },
      ]
    );
  };

  useEffect(() => {
    if (progress.length === 0) return; // Якщо немає даних
    const initialStats = progress.slice(0, 5).map((word) => ({
      word,
      correctCount: 0,
    }));
    setWordStats(initialStats);
    setRandomWord(initialStats);
  }, [progress]);

  return (
    <SafeAreaView style={[defaultStyles.container]}>
      {renderProgress()}
      <View>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 100,
            padding: 40,
          }}
        >
          {choices.map((choice) => (
            <TouchableOpacity
              key={choice._id}
              onPress={() => handleChoice(choice)}
              style={{
                width: 70,
                height: 70,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Image
                source={{ uri: choice.image }}
                style={{ width: 100, height: 100, borderRadius: 10 }}
              />
            </TouchableOpacity>
          ))}
        </View>
        <Text
          style={{
            fontSize: 20,
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          {currentWord?.world}
        </Text>

        <TouchableOpacity onPress={playSound} disabled={isPlaying}>
          <Icon name="sound" size={30} color={isPlaying ? "gray" : "black"} />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleGoHome}>
          <Icon
            name="home"
            size={30}
            color={isDarkTheme ? "black" : "#67104c"}
            style={{ marginLeft: 5 }}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// import { useEffect, useState } from "react";
// import {
//   SafeAreaView,
//   Text,
//   TouchableOpacity,
//   View,
//   Image,
// } from "react-native";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import { defaultStyles } from "./defaultStyles";

// export const TrainingLevel = () => {
//   const route = useRoute();
//   const { level, topicName, progress } = route.params;
//   const [currentWordIndex, setCurrentWordIndex] = useState(0);
//   const [choices, setChoices] = useState([]);
//   const navigation = useNavigation();

//   // Функція для генерації варіантів картинок
//   const generateChoices = (correctWord) => {
//     const wrongChoices = [];
//     // Беремо випадкові картинки з прогресу, які не є правильними
//     while (wrongChoices.length < 3) {
//       const randomIndex = Math.floor(Math.random() * progress.length);
//       const wrongChoice = progress[randomIndex];
//       if (
//         wrongChoice._id !== correctWord._id &&
//         !wrongChoices.includes(wrongChoice)
//       ) {
//         wrongChoices.push(wrongChoice);
//       }
//     }
//     // Включаємо правильний варіант
//     wrongChoices.push(correctWord);
//     // Перемішуємо варіанти
//     return setChoices(wrongChoices.sort(() => Math.random() - 0.5));
//   };

//   // Вибираємо перші 5 слів для тренування
//   const currentWords = progress.slice(0, 5);

//   // Викликається при виборі картинки
//   const handleChoice = (chosenWord) => {
//     if (chosenWord._id === currentWords[currentWordIndex]._id) {
//       // Якщо вибрана картинка правильна, переходимо до наступного слова
//       if (currentWordIndex < currentWords.length - 1) {
//         setCurrentWordIndex(currentWordIndex + 1);
//         generateChoices(currentWords[currentWordIndex + 1]);
//       } else {
//         alert("Вітаю! Ви пройшли левел");
//         // Якщо слова закінчилися, перехід на наступний рівень або завершення
//         // дати круасан і повідомити про успішне проходження левелу. Перекинути на строінку левелів
//         navigation.navigate("Train", { topicName }); // Замість цього переходу можна відображати повідомлення про завершення
//       }
//     } else {
//       // Якщо картинка неправильна, відображаємо повідомлення
//       alert("Спробуйте ще раз");
//     }
//   };

//   const renderProgress = () => {
//     const circles = [];
//     // має бути 15
//     const totalExercises = 15;
//     for (let i = 0; i < totalExercises; i++) {
//       circles.push(
//         <View
//           key={i}
//           style={{
//             width: 20,
//             height: 20,
//             borderRadius: 10,
//             backgroundColor: i < currentWordIndex ? "green" : "lightgray", // Зелені кружечки для виконаних вправ
//             margin: 3,
//           }}
//         />
//       );
//     }
//     return (
//       <View style={{ flexDirection: "row", justifyContent: "center" }}>
//         {circles}
//       </View>
//     );
//   };

//   // функція на перезапуск три рази

//   useEffect(() => {
//     // виклкик функції
//     generateChoices(currentWords[currentWordIndex]);
//   }, [currentWordIndex]);

//   return (
//     <SafeAreaView style={[defaultStyles.container]}>
//       {renderProgress()}
//       <View style={defaultStyles.btnContainer}>
//         {/* Відображення картинок */}
//         <View style={defaultStyles.btnContainer}>
//           {choices.map((choice) => (
//             <TouchableOpacity
//               key={choice._id}
//               onPress={() => handleChoice(choice)}
//               style={{
//                 width: 70,
//                 height: 70,
//                 justifyContent: "center",
//                 alignItems: "center",
//                 marginBottom: 20,
//               }}
//             >
//               <Image
//                 source={{ uri: choice.image }} // Припускаємо, що є поле imageUrl
//                 style={{ width: 70, height: 70, borderRadius: 10 }}
//               />
//             </TouchableOpacity>
//           ))}
//         </View>
//         <Text
//           style={{
//             fontSize: 20,
//             marginBottom: 20,
//             textAlign: "center",
//           }}
//         >
//           {currentWords[currentWordIndex]?.world}
//         </Text>
//       </View>
//     </SafeAreaView>
//   );
// };
