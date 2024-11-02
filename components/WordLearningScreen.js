import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  View,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Audio } from "expo-av";
import Icon from "react-native-vector-icons/AntDesign";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";
import { selectVocab } from "../store/vocab/selectors";

export const WordLearningScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allWordsCompleted, setAllWordsCompleted] = useState(false);
  const [totalShown, setTotalShown] = useState(0);
  const [sound, setSound] = useState();
  const [sessionComplete, setSessionComplete] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedWords, setSelectedWords] = useState([]);
  const isDarkTheme = useSelector((state) => state.auth.theme);
  const id = useSelector((state) => state.vocab.themeId);
  const vocabData = useSelector(selectVocab);
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();

  const route = useRoute();
  const { count, topicName } = route.params;

  const currentLanguage = i18n.language;

  const filteredWords = vocabData.filter((word) => word.themeId === id);

  const loadProgress = async () => {
    const savedProgress = await AsyncStorage.getItem(`progress_${topicName}`);
    if (savedProgress) {
      setTotalShown(parseInt(savedProgress, 10));
    }
    setSelectedWords(filteredWords.slice(totalShown, totalShown + count));
  };

  const saveProgress = async (newTotalShown) => {
    await AsyncStorage.setItem(
      `progress_${topicName}`,
      newTotalShown.toString()
    );
  };

  const checkCompletion = (totalShown) => {
    if (totalShown >= filteredWords.length) {
      setAllWordsCompleted(true);
    }
  };

  useEffect(() => {
    loadProgress();
    checkCompletion(totalShown);
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [totalShown, filteredWords.length]);

  const handleNextWord = () => {
    if (currentIndex < selectedWords.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      const newTotalShown = totalShown + selectedWords.length;
      setSessionComplete(true);
      setTotalShown(newTotalShown);
      saveProgress(newTotalShown);
      checkCompletion(newTotalShown);
    }
  };

  const handleRepeatSameCount = () => {
    const nextStartIndex = totalShown;
    const nextEndIndex = Math.min(totalShown + count, filteredWords.length);
    if (nextEndIndex > nextStartIndex) {
      setSelectedWords(filteredWords.slice(nextStartIndex, nextEndIndex));
      setCurrentIndex(0);
      setSessionComplete(false);
    } else {
      alert("No more new words to show!");
    }
  };

  // const onRepeat = async () => {
  //   await AsyncStorage.removeItem(`progress_${topicName}`);
  //   setCurrentIndex(0);
  //   setSessionComplete(false);
  //   setAllWordsCompleted(false);
  //   setSelectedWords(filteredWords.slice(0, count));
  // };

  const playSound = async () => {
    try {
      const audioUri = selectedWords[currentIndex]?.audio;
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
      setIsPlaying(false);
    }
  };

  const handleTrainWords = () => {
    // alert("Training words...");
    navigation.navigate("Train");
  };

  const handleChooseDifferentCount = () => {
    setTotalShown(0);
    navigation.navigate("Learn", { topicName, allWordsCompleted }); // передаємо стан
  };

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      {!sessionComplete ? (
        <>
          <Image
            source={{ uri: selectedWords[currentIndex]?.image }}
            style={styles.image}
          />
          <TouchableOpacity onPress={playSound} disabled={isPlaying}>
            <Icon name="sound" size={30} color={isPlaying ? "gray" : "black"} />
          </TouchableOpacity>
          <Text style={{ fontSize: 30, fontWeight: "bold" }}>
            {selectedWords[currentIndex]?.world}{" "}
          </Text>
          <Text style={{ fontSize: 20, marginTop: 20 }}>
            {currentLanguage === "uk"
              ? selectedWords[currentIndex]?.translationUK
              : selectedWords[currentIndex]?.translationEN}{" "}
          </Text>
          <Text>
            {t("LAT.word")}: {currentIndex + 1}
          </Text>
          {/* <Button title="Next" onPress={handleNextWord} /> */}
          <Pressable
            style={{
              marginTop: 18,
              marginBottom: 4,
              borderRadius: 100,
              paddingVertical: 16,
              paddingHorizontal: 32,
              width: 200,
              height: 51,
              // backgroundColor: isDarkTheme ? "white" : "#67104c",
              backgroundColor: "#67104c",
              alignSelf: "center",
            }}
            onPress={handleNextWord}
          >
            <Text
              style={{
                // color: isDarkTheme ? "#67104c" : "white",
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {t("btn.next")}
            </Text>
          </Pressable>
        </>
      ) : (
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 24, marginBottom: 20 }}>
            {t("LAT.sessionCompleted")}
          </Text>
          {!allWordsCompleted && (
            <TouchableOpacity
              // style={[
              //   styles.buttonMarg,
              //   { backgroundColor: isDarkTheme ? "white" : "#67104c" },
              // ]}
              style={{
                marginTop: 18,
                marginBottom: 4,
                borderRadius: 100,
                paddingVertical: 16,
                paddingHorizontal: 32,
                width: "100%",
                height: 51,
                // backgroundColor: isDarkTheme ? "white" : "#67104c",
                backgroundColor: "#67104c",
                alignSelf: "center",
              }}
              onPress={handleRepeatSameCount}
            >
              <Text
                // style={[
                //   styles.buttonsText,
                //   {
                //     color: isDarkTheme ? "#67104c" : "white",
                //   },
                // ]}
                style={{
                  // color: isDarkTheme ? "#67104c" : "white",
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {t("btn.repeat")}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            // style={[
            //   styles.buttonMarg,
            //   { backgroundColor: isDarkTheme ? "white" : "#67104c" },
            // ]}
            style={{
              marginTop: 18,
              marginBottom: 4,
              borderRadius: 100,
              paddingVertical: 16,
              paddingHorizontal: 32,
              width: "100%",
              height: 51,
              // backgroundColor: isDarkTheme ? "white" : "#67104c",
              backgroundColor: "#67104c",
              alignSelf: "center",
            }}
            onPress={handleTrainWords}
          >
            <Text
              // style={[
              //   styles.buttonsText,
              //   {
              //     color: isDarkTheme ? "#67104c" : "white",
              //   },
              // ]}
              style={{
                // color: isDarkTheme ? "#67104c" : "white",
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {t("btn.train")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            // style={{ backgroundColor: isDarkTheme ? "white" : "#67104c" }}
            style={{
              marginTop: 18,
              marginBottom: 4,
              borderRadius: 100,
              paddingVertical: 16,
              paddingHorizontal: 32,
              width: "100%",
              height: 51,
              // backgroundColor: isDarkTheme ? "white" : "#67104c",
              backgroundColor: "#67104c",
              alignSelf: "center",
            }}
            onPress={handleChooseDifferentCount}
          >
            <Text
              // style={[
              //   styles.buttonsText,
              //   {
              //     color: isDarkTheme ? "#67104c" : "white",
              //   },
              // ]}
              style={{
                color: isDarkTheme ? "#67104c" : "white",
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {allWordsCompleted ? t("btn.goBack") : t("btn.chooseCount")}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

// Стили для компонентов
const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  buttonMarg: {
    marginBottom: 20,
  },
  buttonsText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    padding: 10,
  },
});
