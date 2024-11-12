import { useState, useCallback } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useSelector } from "react-redux";
import { selectVocab } from "../store/vocab/selectors";
import { useFocusEffect } from "@react-navigation/native";
import { defaultStyles } from "./defaultStyles";

export const Learn = () => {
  const { t, i18n } = useTranslation();
  const route = useRoute();
  const { topicName, allWordsCompleted: initialAllWordsCompleted } =
    route.params;
  const isDarkTheme = useSelector((state) => state.auth.theme);
  const navigation = useNavigation();
  const vocabData = useSelector(selectVocab);
  const [progress, setProgress] = useState(0);
  const [allWordsCompleted, setAllWordsCompleted] = useState(
    initialAllWordsCompleted
  );

  const currentLanguage = i18n.language;

  // Функція для отримання кількості пройдених слів з AsyncStorage
  const fetchProgress = async () => {
    try {
      const storedProgress = await AsyncStorage.getItem(
        `progress_${topicName}`
      );
      if (storedProgress) {
        setProgress(parseInt(storedProgress, 10));
      }
    } catch (error) {
      console.error("Error fetching progress from storage:", error);
    }
  };

  // Використовуємо useFocusEffect для оновлення при кожному поверненні на цей екран
  useFocusEffect(
    useCallback(() => {
      fetchProgress();
    }, [topicName])
  );

  // Обробка вибору кількості слів
  const handlePress = (count, wordItem = null) => {
    navigation.navigate("WordLearningScreen", { count, topicName, wordItem });
  };

  const deleteStore = async () => {
    try {
      await AsyncStorage.removeItem(`progress_${topicName}`);
      setProgress(0);
      setAllWordsCompleted(false); // Оновлюємо стан, щоб повернутися до вибору слів
      console.log(`Progress for topic ${topicName} has been deleted.`);
    } catch (error) {
      console.error("Error removing progress from storage:", error);
    }
  };

  const renderTopicsItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={[
          defaultStyles.button,
          { backgroundColor: isDarkTheme ? "white" : "#67104c" },
        ]}
        onPress={() => handlePress(1, item)}
      >
        <Text
          style={[
            defaultStyles.btnText,
            {
              color: isDarkTheme ? "#67104c" : "white",
            },
          ]}
        >
          {item.world} /{" "}
          {currentLanguage === "uk" ? item.translationUK : item.translationEN}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={[
        defaultStyles.container,
        { backgroundColor: isDarkTheme ? "#67104c" : "white" },
      ]}
    >
      {progress >= vocabData.length ? (
        <View style={defaultStyles.btnContainer}>
          <Text
            style={{
              fontSize: 18,
              marginBottom: 20,
              color: isDarkTheme ? "white" : "#67104c",
            }}
          >
            {progress}/{vocabData.length} {t("LAT.completedWords")}
          </Text>
          <TouchableOpacity
            style={[
              defaultStyles.button,
              { backgroundColor: isDarkTheme ? "white" : "#67104c" },
            ]}
            onPress={deleteStore}
          >
            <Text
              style={[
                defaultStyles.btnText,
                {
                  color: isDarkTheme ? "#67104c" : "white",
                },
              ]}
            >
              StoreDelete
            </Text>
          </TouchableOpacity>
          <FlatList
            style={{ width: "100%" }}
            data={vocabData}
            keyExtractor={(item) => item._id}
            renderItem={renderTopicsItem}
            contentContainerStyle={{ alignItems: "center" }}
          />
        </View>
      ) : (
        <View
          style={[
            defaultStyles.btnContainer,
            {
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <Text
            style={{
              fontSize: 18,
              marginBottom: 20,
              color: isDarkTheme ? "white" : "#67104c",
            }}
          >
            {progress}/{vocabData.length} {t("LAT.completedWords")}
          </Text>

          {[5, 10, 15, 20].map((count) => (
            <TouchableOpacity
              key={count}
              style={[
                defaultStyles.button,
                { backgroundColor: isDarkTheme ? "white" : "#67104c" },
              ]}
              onPress={() => handlePress(count)}
            >
              <Text
                style={[
                  defaultStyles.btnText,
                  {
                    color: isDarkTheme ? "#67104c" : "white",
                  },
                ]}
              >
                {count} {t("LAT.words")}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
};
