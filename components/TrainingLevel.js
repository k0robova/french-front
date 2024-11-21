import { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { defaultStyles } from "./defaultStyles";

export const TrainingLevel = () => {
  const route = useRoute();
  const { level, topicName, progress } = route.params;
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [choices, setChoices] = useState([]);
  const navigation = useNavigation();

  // Функція для генерації варіантів картинок
  const generateChoices = (correctWord) => {
    const wrongChoices = [];
    // Беремо випадкові картинки з прогресу, які не є правильними
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
    // Включаємо правильний варіант
    wrongChoices.push(correctWord);
    // Перемішуємо варіанти
    setChoices(wrongChoices.sort(() => Math.random() - 0.5));
  };

  // Вибираємо перші 5 слів для тренування
  const currentWords = progress.slice(0, 5);

  // Викликається при виборі картинки
  const handleChoice = (chosenWord) => {
    if (chosenWord._id === currentWords[currentWordIndex]._id) {
      // Якщо вибрана картинка правильна, переходимо до наступного слова
      if (currentWordIndex < currentWords.length - 1) {
        setCurrentWordIndex(currentWordIndex + 1);
        generateChoices(currentWords[currentWordIndex + 1]);
      } else {
        // Якщо слова закінчилися, перехід на наступний рівень або завершення
        navigation.navigate("Train", { topicName }); // Замість цього переходу можна відображати повідомлення про завершення
      }
    } else {
      // Якщо картинка неправильна, відображаємо повідомлення
      alert("Спробуйте ще раз");
    }
  };

  useEffect(() => {
    generateChoices(currentWords[currentWordIndex]);
  }, [currentWordIndex]);

  return (
    <SafeAreaView style={[defaultStyles.container]}>
      <View style={defaultStyles.btnContainer}>
        {/* Відображення картинок */}
        <View style={defaultStyles.btnContainer}>
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
                source={{ uri: choice.image }} // Припускаємо, що є поле imageUrl
                style={{ width: 70, height: 70, borderRadius: 10 }}
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
          {currentWords[currentWordIndex]?.world}
        </Text>
      </View>
    </SafeAreaView>
  );
};
