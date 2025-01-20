import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  Image,
  TextInput,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { defaultStyles } from "./defaultStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const FifthLevel = ({ progress, level, topicName }) => {
  const [word, setWord] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [wordWithBlanks, setWordWithBlanks] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [correctLetters, setCorrectLetters] = useState([]);
  const [totalCorrectAnswers, setTotalCorrectAnswers] = useState(0);
  const [iteration, setIteration] = useState(0); // Лічильник ітерацій
  const [wordStats, setWordStats] = useState([]);

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isDarkTheme = useSelector((state) => state.auth.theme);

  const initializeWordStats = () => {
    const unfinishedWords = progress.filter(
      (word) => !word.completed.includes(level)
    );
    if (unfinishedWords.length === 0) return;
    setWordStats(
      unfinishedWords.slice(0, 5).map((word) => ({ word, correctCount: 0 }))
    );
  };

  useEffect(() => {
    initializeWordStats();
  }, [progress]);

  // useEffect(() => {
  //   if (wordStats.length > 0 && iteration < wordStats.length) {
  //     const currentWord = wordStats[iteration];
  //     setWord(currentWord.word.world);
  //     setImageUrl(currentWord.word.image);
  //     generateWordWithBlanks(currentWord.word.world);

  //     // Ініціалізуємо userInput тільки для пропусків
  //     setUserInput(
  //       new Array(currentWord.word.world.length)
  //         .fill("")
  //         .map((_, idx) =>
  //           wordWithBlanks[idx] === "_" ? "" : wordWithBlanks[idx]
  //         )
  //     );
  //   }
  // }, [iteration, wordStats]);

  useEffect(() => {
    if (wordStats.length > 0 && iteration < wordStats.length) {
      const currentWord = wordStats[iteration];
      setWord(currentWord.word.world);
      setImageUrl(currentWord.word.image);

      // Генеруємо слово з пропусками і зберігаємо його в змінну
      const blanks = generateWordWithBlanks(currentWord.word.world);

      // Ініціалізуємо userInput тільки для пропусків
      setUserInput(blanks.map((char) => (char === "_" ? "" : char)));

      setWordWithBlanks(blanks); // Оновлюємо стан wordWithBlanks
    }
  }, [iteration, wordStats]);

  // Функція генерації пропусків
  // const generateWordWithBlanks = (word) => {
  //   const lowerCaseWord = word.toLowerCase();

  //   const wordArray = lowerCaseWord.split("");
  //   const wordLength = wordArray.length;

  //   let numBlanks = 0;
  //   if (wordLength <= 3) {
  //     numBlanks = 1;
  //   } else if (wordLength >= 4 && wordLength <= 6) {
  //     numBlanks = 2;
  //   } else if (wordLength >= 7) {
  //     numBlanks = 3;
  //   }

  //   const indices = [];
  //   while (indices.length < numBlanks) {
  //     const randomIndex = Math.floor(Math.random() * wordArray.length);
  //     if (!indices.includes(randomIndex)) {
  //       indices.push(randomIndex);
  //     }
  //   }

  //   const wordWithBlanks = wordArray.map((char, index) => {
  //     if (indices.includes(index)) {
  //       return "_";
  //     } else {
  //       return char;
  //     }
  //   });

  //   // якщо тестити return wordWithBlanks.join("");

  //   // Повертаємо об'єкт з новим словом і правильними буквами
  //   const correctLetters = indices.map((index) => wordArray[index]);

  //   setWordWithBlanks(wordWithBlanks);
  //   setCorrectLetters(correctLetters);
  // };
  const generateWordWithBlanks = (word) => {
    const wordArray = word.split("").map((char) => char.toLowerCase());
    const wordLength = wordArray.length;

    let numBlanks = 0;
    if (wordLength <= 3) {
      numBlanks = 1;
    } else if (wordLength >= 4 && wordLength <= 6) {
      numBlanks = 2;
    } else if (wordLength >= 7) {
      numBlanks = 3;
    }

    const indices = [];
    while (indices.length < numBlanks) {
      const randomIndex = Math.floor(Math.random() * wordArray.length);
      if (!indices.includes(randomIndex)) {
        indices.push(randomIndex);
      }
    }

    return wordArray.map((char, index) =>
      indices.includes(index) ? "_" : char
    );
  };

  // Обробка введених букв
  const handleInputChange = (index, value) => {
    // Перевірка, щоб введено лише один символ і це літера
    if (value && /^[a-zA-Z]$/.test(value)) {
      const newUserInput = [...userInput];
      console.log("====================================");
      console.log(userInput, "!!!");
      console.log("====================================");
      newUserInput[index] = value.toLowerCase(); // Приводимо до нижнього регістру
      setUserInput(newUserInput);
    } else if (value === "") {
      // Якщо введено порожнє значення, дозволяємо видаляти символ
      const newUserInput = [...userInput];
      newUserInput[index] = "";
      setUserInput(newUserInput);
    }
  };

  const checkAnswer = async () => {
    console.log("====================================");
    console.log(userInput);
    console.log("====================================");
    // Перевірка довжини введених і правильних літер
    if (userInput.length !== correctLetters.length) {
      alert("Кількість введених літер не співпадає з кількістю пропусків.");
      return;
    }

    // Перевірка на порожні значення
    if (userInput.some((input) => !input)) {
      alert("Всі поля повинні бути заповнені!");
      return;
    }

    // Перевірка, чи правильні введені букви
    let isCorrect = true;
    for (let i = 0; i < correctLetters.length; i++) {
      if (userInput[i] !== correctLetters[i]) {
        isCorrect = false;
        break;
      }
    }
    if (isCorrect) {
      setTotalCorrectAnswers((prev) => {
        const updatedTotalCorrectAnswers = prev + 1;
        if (updatedTotalCorrectAnswers === 15) {
          alert("Вітаю! Ви виконали всі завдання. Ви отримуєте 1 круасан");
          navigation.navigate("Train", { topicName });
        }
        return updatedTotalCorrectAnswers;
      });
      handleNextIteration();
    } else {
      Alert.alert("Неправильно", "Спробуйте ще раз.");
    }
  };

  const handleNextIteration = () => {
    setIteration((prev) => prev + 1);
  };

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

      {/* Виводимо слово з пропусками */}
      {/* {word && (
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          {wordWithBlanks.join(" ")}
        </Text>
      )} */}

      {/* Виводимо поля для введення літер */}
      {wordWithBlanks.map((char, index) =>
        char === "_" ? (
          <TextInput
            key={`${index}-input`} // Унікальний ключ для кожного пропуску
            style={{
              fontSize: 24,
              textAlign: "center",
              margin: 5,
              backgroundColor: "red",
            }}
            maxLength={1} // Тільки один символ
            value={userInput[index] || ""} // Значення для кожного пропуску
            onChangeText={(value) => handleInputChange(index, value)} // Обробка введеного символу
            keyboardType="default" // Дозволяємо тільки букви
          />
        ) : (
          <Text
            key={`${index}-text`}
            style={{ fontSize: 24, textAlign: "center", margin: 5 }}
          >
            {char}
          </Text>
        )
      )}

      <Text
        onPress={checkAnswer}
        style={{ fontSize: 18, color: "blue", marginTop: 20 }}
      >
        Перевірити
      </Text>
    </SafeAreaView>
  );
};
