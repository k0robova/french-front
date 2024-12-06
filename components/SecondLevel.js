import { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  PanResponder,
  Animated,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export const SecondLevel = ({ progress, level, topicName }) => {
  const [images, setImages] = useState([]);
  const [words, setWords] = useState([]);
  const [matches, setMatches] = useState({});
  const [wordStats, setWordStats] = useState([]);
  const imageRefs = useRef({}); // Координати картинок
  const panRefs = useRef({}); // Координати для слів
  const navigation = useNavigation();

  useEffect(() => {
    const filteredProgress = progress.filter(
      (item) => !item.completed.includes(2)
    );
    const limitedProgress = filteredProgress.slice(0, 5);
    setWordStats(limitedProgress);
    const shuffledProgress = [...limitedProgress].sort(
      () => Math.random() - 0.5
    );

    setImages(
      shuffledProgress.map((item) => ({
        id: item.world,
        uri: item.image,
      }))
    );

    setWords(
      shuffledProgress.map((item) => ({
        id: item.world,
        text: item.world,
      }))
    );
  }, [progress]);

  const createPanResponder = (wordId, pan) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gestureState) => {
        const droppedImage = detectDropArea(
          gestureState.moveX,
          gestureState.moveY
        );
        if (droppedImage) {
          handleDrop(wordId, droppedImage.id);
        }

        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    });
  };

  const markCurrentWordsAsCompleted = async () => {
    try {
      const updatedProgress = progress.map((word) => {
        if (wordStats.some((stat) => stat._id === word._id)) {
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

  const detectDropArea = (x, y) => {
    console.log(x, y, "x - y");
    for (const [id, bounds] of Object.entries(imageRefs.current)) {
      console.log(
        bounds.left,
        bounds.right,
        bounds.top,
        bounds.bottom,
        "--Bounds--"
      );
      if (
        x >= bounds.left &&
        x <= bounds.right &&
        y >= bounds.top &&
        y <= bounds.bottom
      ) {
        return { id }; // Повертаємо ID картинки, якщо слово в межах зони
      }
    }
    return null;
  };

  const handleDrop = (wordId, imageId) => {
    setMatches((prev) => ({
      ...prev,
      [imageId]: wordId,
    }));
  };

  const checkMatches = async () => {
    try {
      const isCorrect = images.every((img) => matches[img.id] === img.id);
      if (isCorrect) {
        await markCurrentWordsAsCompleted();
        Alert.alert("Все правильно!");
        navigation.navigate("Train", { topicName });
        return;
      }
      Alert.alert("Спробуйте ще раз.");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Відповідність слів до картинок</Text>
      <View style={styles.gameContainer}>
        {/* Картинки */}
        <View style={styles.imagesContainer}>
          {images.map((image) => (
            <View
              key={image.id}
              style={styles.imageBox}
              onLayout={(event) => {
                const { x, y, width, height } = event.nativeEvent.layout;
                imageRefs.current[image.id] = {
                  left: x,
                  top: y,
                  right: x + width,
                  bottom: y + height,
                };
              }}
            >
              <Image source={{ uri: image.uri }} style={styles.image} />
              {/* Відображення слова під картинкою */}
              {matches[image.id] && (
                <Text style={styles.wordUnderImage}>{matches[image.id]}</Text>
              )}
            </View>
          ))}
        </View>

        {/* Слова */}
        <View style={styles.wordsContainer}>
          {words.map((word) => {
            // Якщо для слова ще немає значення, створюємо нове
            if (!panRefs.current[word.id]) {
              panRefs.current[word.id] = new Animated.ValueXY();
            }
            const pan = panRefs.current[word.id];

            return (
              <Animated.View
                key={word.id}
                style={[
                  styles.wordBox,
                  { transform: pan.getTranslateTransform() },
                ]}
                {...createPanResponder(word.id, pan).panHandlers}
              >
                <Text style={styles.word}>{word.text}</Text>
              </Animated.View>
            );
          })}
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Text style={styles.checkButton} onPress={checkMatches}>
          Перевірити
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  gameContainer: {
    flex: 1,
    flexDirection: "row",
  },
  imagesContainer: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
  },
  imageBox: {
    marginBottom: 20,
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  wordsContainer: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
  },
  wordBox: {
    backgroundColor: "#e0e0e0",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  wordUnderImage: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  word: {
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  checkButton: {
    padding: 10,
    backgroundColor: "#67104c",
    color: "white",
    fontSize: 18,
    borderRadius: 5,
    textAlign: "center",
  },
});
