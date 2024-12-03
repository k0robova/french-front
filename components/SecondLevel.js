import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  PanResponder,
  Animated,
} from "react-native";

export const SecondLevel = ({ progress }) => {
  // Дані для рівня
  const [images, setImages] = useState([]);
  const [words, setWords] = useState([]);
  const [matches, setMatches] = useState({});
  const [wordPositions, setWordPositions] = useState([]); // Для зберігання позицій слів

  useEffect(() => {
    // Фільтруємо слова, де в масиві completed немає цифри 2
    const filteredProgress = progress.filter(
      (item) => !item.completed.includes(2)
    );

    // Вибираємо лише перші 5 слів з фільтрованого масиву
    const limitedProgress = filteredProgress.slice(0, 5);

    // Розділяємо слова та картинки у випадковому порядку
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

  useEffect(() => {
    // Записуємо початкові позиції слів після того, як вони з'являться в DOM
    setWordPositions(
      words.map((word, index) => {
        // Початкові координати слів на екрані (наприклад, розміщуємо їх по вертикалі)
        return { id: word.id, x: 0, y: index * 50 }; // Ініціалізація на базі індексу (ви можете налаштувати це)
      })
    );
  }, [words]);

  const createPanResponder = (wordId, pan, initialPosition) => {
    return PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({ x: initialPosition.x, y: initialPosition.y });
      },
      onPanResponderMove: (event, gestureState) => {
        pan.setValue({
          x: gestureState.moveX - initialPosition.x,
          y: gestureState.moveY - initialPosition.y,
        });
      },
      onPanResponderRelease: (event, gestureState) => {
        const droppedImage = images.find(
          (img) =>
            Math.abs(gestureState.moveX - img.id.x) < 50 &&
            Math.abs(gestureState.moveY - img.id.y) < 50
        );

        if (droppedImage) {
          handleDrop(wordId, droppedImage.id); // Оновлюємо відповідність
        }

        // Повернення слова в початкову позицію
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
        }).start();
      },
    });
  };

  const handleDrop = (wordId, imageId) => {
    setMatches((prev) => ({
      ...prev,
      [imageId]: wordId,
    }));
  };

  const checkMatches = () => {
    const isCorrect = images.every((img) => matches[img.id] === img.id);
    alert(isCorrect ? "Все правильно!" : "Спробуйте ще раз.");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Відповідність слів до картинок</Text>
      <View style={styles.gameContainer}>
        {/* Картинки */}
        <View style={styles.imagesContainer}>
          {images.map((image) => (
            <View key={image.id} style={styles.imageBox}>
              <Image source={{ uri: image.uri }} style={styles.image} />
              <Text>
                {matches[image.id]
                  ? `З'єднано з: ${matches[image.id]}`
                  : "Перетягніть слово"}
              </Text>
            </View>
          ))}
        </View>

        {/* Слова (праворуч) */}
        <View style={styles.wordsContainer}>
          {words.map((word, index) => {
            const pan = new Animated.ValueXY(); // Окремі координати для кожного слова
            const initialPosition = wordPositions[index]; // Початкові координати

            return (
              <Animated.View
                key={word.id}
                style={[
                  styles.wordBox,
                  {
                    transform: pan.getTranslateTransform(), // Додаємо анімацію для кожного слова
                  },
                ]}
                {...createPanResponder(word.id, pan, initialPosition)
                  .panHandlers} // Додаємо PanResponder
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
