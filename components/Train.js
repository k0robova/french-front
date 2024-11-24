import { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import Icon from "react-native-vector-icons/AntDesign";
import { defaultStyles } from "./defaultStyles";

export const Train = () => {
  const navigation = useNavigation();
  const isDarkTheme = useSelector((state) => state.auth.theme);
  const route = useRoute();

  const { topicName } = route.params;

  const [progress, setProgress] = useState([]);

  // Функція для отримання прогресу
  const fetchProgress = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(`progress_${topicName}`);
      const storageProgress = jsonValue != null ? JSON.parse(jsonValue) : [];
      if (Array.isArray(storageProgress)) {
        setProgress(storageProgress); // Оновлюємо прогрес
      }
    } catch (error) {
      console.error("Error fetching progress from storage:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProgress();
    }, [topicName])
  );

  // Обробка переходу до рівнів
  const handlePress = (level) => {
    if (progress.length > 0) {
      console.log(progress);
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
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Icon
            name="home"
            size={30}
            color={isDarkTheme ? "white" : "#67104c"}
            style={{ marginLeft: 5 }}
          />
        </TouchableOpacity>
        {progress.length === 0 && ( // Якщо прогрес порожній, показуємо повідомлення
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
                  {
                    color: isDarkTheme ? "#67104c" : "white",
                  },
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
                opacity: progress.length > 0 ? 1 : 0.5, // Змінюємо прозорість кнопок
              },
            ]}
            onPress={() => handlePress(level)}
            disabled={progress.length === 0} // Відключаємо кнопки, якщо прогрес = 0
          >
            <Text
              style={[
                defaultStyles.btnText,
                {
                  color: isDarkTheme ? "#67104c" : "white",
                },
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
