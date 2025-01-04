import { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  PanResponder,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export const FourtLevel = ({ progress, level, topicName }) => {
  const [images, setImages] = useState([]);
  const [words, setWords] = useState([]);
  const [matches, setMatches] = useState({});
  const [wordStats, setWordStats] = useState([]);
  const panRefs = useRef({});
  const imageRefs = useRef({});
  const wordRefs = useRef({});
  const navigation = useNavigation();

  useEffect(() => {
    if (!progress || progress.length === 0) return;
    const filteredProgress = progress.filter(
      (item) => !item.completed.includes(2)
    );
    const limitedProgress = filteredProgress.slice(0, 4);
    setWordStats(limitedProgress);

    const shuffledImages = limitedProgress
      .map((item) => ({ id: item.world, uri: item.image }))
      .sort(() => Math.random() - 0.5);

    const shuffledWords = limitedProgress
      .map((item) => ({ id: item.world, text: item.world }))
      .sort(() => Math.random() - 0.5);

    setImages(shuffledImages);
    setWords(shuffledWords);

    const initialMatches = {};
    shuffledWords.forEach((word) => {
      initialMatches[word.id] = null;
    });
    setMatches(initialMatches);

    // Ініціалізуємо координати для анімацій і позицій
    shuffledWords.forEach((word) => {
      panRefs.current[word.id] = new Animated.ValueXY();
      wordRefs.current[word.id] = { left: 0, top: 0, right: 0, bottom: 0 }; // Ініціалізація
    });

    shuffledImages.forEach((image) => {
      imageRefs.current[image.id] = null;
    });
  }, [progress]);

  const createPanResponder = (wordId, pan) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gestureState) => {
        const droppedWordId = detectDropArea(
          gestureState.moveX,
          gestureState.moveY
        );

        if (droppedWordId && droppedWordId !== wordId) {
          swapWords(wordId, droppedWordId); // Змінюємо місцями слова
        }

        // Повертає слово у вихідну позицію
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
        }).start();
      },
    });
  };

  const detectDropArea = (x, y) => {
    for (const word of words) {
      console.log(x, "- x", y, "- y");
      const bounds = wordRefs.current[word.id]; // Координати кожного слова
      if (!bounds) continue; // Пропускаємо, якщо bounds ще не встановлені
      if (
        x >= bounds.left &&
        x <= bounds.right &&
        y >= bounds.top &&
        y <= bounds.bottom
      ) {
        return word.id; // Повертає ID слова, на яке скинули
      }
    }
    return null; // Якщо слово не знайдено
  };

  const swapWords = (wordId1, wordId2) => {
    setWords((prevWords) => {
      const newWords = [...prevWords];
      const index1 = newWords.findIndex((word) => word.id === wordId1);
      const index2 = newWords.findIndex((word) => word.id === wordId2);

      if (index1 !== -1 && index2 !== -1) {
        // Зміна місцями
        const temp = newWords[index1];
        newWords[index1] = newWords[index2];
        newWords[index2] = temp;
      }

      return newWords; // Повертаємо оновлений масив
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

  useEffect(() => {
    words.forEach((word) => {
      setTimeout(() => {
        const view = wordRefs.current[word.id];
        if (view && view.measureInWindow) {
          view.measureInWindow((x, y, width, height) => {
            wordRefs.current[word.id] = {
              left: x,
              top: y,
              right: x + width,
              bottom: y + height,
            };
          });
        }
      }, 100);
    });
  }, [words]);

  const checkMatches = async () => {
    try {
      const isCorrect = words.every(
        (word, index) => word.id === images[index].id
      );
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
              ref={(ref) => {
                if (ref) imageRefs.current[image.id] = ref;
              }}
              onLayout={() => {
                setTimeout(() => {
                  const view = imageRefs.current[image.id];
                  if (view && view.measureInWindow) {
                    view.measureInWindow((x, y, width, height) => {
                      imageRefs.current[image.id] = {
                        left: x,
                        top: y,
                        right: x + width,
                        bottom: y + height,
                      };
                    });
                  }
                }, 100); // Затримка 100 мс для гарантії, що компоненти змонтовано
              }}
            >
              <Image source={{ uri: image.uri }} style={styles.image} />
              {matches[image.id] && (
                <Text style={styles.wordUnderImage}>{matches[image.id]}</Text>
              )}
            </View>
          ))}
        </View>

        {/* Слова */}
        <View style={styles.wordsContainer}>
          {words.map((word) => {
            const pan = panRefs.current[word.id];
            return (
              <Animated.View
                key={word.id}
                style={[
                  styles.wordBox,
                  { transform: pan.getTranslateTransform() },
                ]}
                {...createPanResponder(word.id, pan).panHandlers}
                ref={(ref) => {
                  if (ref) wordRefs.current[word.id] = ref;
                }}
                onLayout={() => {
                  setTimeout(() => {
                    const view = wordRefs.current[word.id];
                    if (view && view.measureInWindow) {
                      view.measureInWindow((x, y, width, height) => {
                        wordRefs.current[word.id] = {
                          left: x,
                          top: y,
                          right: x + width,
                          bottom: y + height,
                        };
                        console.log(
                          `Координати для слова ${word.id}:`,
                          wordRefs.current[word.id]
                        );
                      });
                    }
                  }, 100);
                }}
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

// import { useState, useEffect, useRef } from "react";
// import {
//   SafeAreaView,
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   PanResponder,
//   Animated,
//   Alert,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useNavigation } from "@react-navigation/native";

// export const FourtLevel = ({ progress, level, topicName }) => {
//   const [images, setImages] = useState([]);
//   const [words, setWords] = useState([]);
//   const [matches, setMatches] = useState({});
//   const [wordStats, setWordStats] = useState([]);
//   const imageRefs = useRef({}); // Координати картинок
//   const panRefs = useRef({}); // Координати для слів
//   const navigation = useNavigation();

//   useEffect(() => {
//     const filteredProgress = progress.filter(
//       (item) => !item.completed.includes(2)
//     );
//     const limitedProgress = filteredProgress.slice(0, 5);
//     setWordStats(limitedProgress);
//     const shuffledProgress = [...limitedProgress].sort(
//       () => Math.random() - 0.5
//     );

//     setImages(
//       shuffledProgress.map((item) => ({
//         id: item.world,
//         uri: item.image,
//       }))
//     );

//     setWords(
//       shuffledProgress.map((item) => ({
//         id: item.world,
//         text: item.world,
//       }))
//     );
//   }, [progress]);

//   const createPanResponder = (wordId, pan) => {
//     return PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
//         useNativeDriver: false,
//       }),
//       onPanResponderRelease: (_, gestureState) => {
//         const droppedImage = detectDropArea(
//           gestureState.moveX,
//           gestureState.moveY
//         );
//         if (droppedImage) {
//           handleDrop(wordId, droppedImage.id);
//         }

//         Animated.spring(pan, {
//           toValue: { x: 0, y: 0 },
//           useNativeDriver: false,
//         }).start();
//       },
//     });
//   };

//   const markCurrentWordsAsCompleted = async () => {
//     try {
//       const updatedProgress = progress.map((word) => {
//         if (wordStats.some((stat) => stat._id === word._id)) {
//           return {
//             ...word,
//             completed: word.completed.includes(level)
//               ? word.completed
//               : [...word.completed, level],
//           };
//         }
//         return word;
//       });

//       await AsyncStorage.setItem(
//         `progress_${topicName}`,
//         JSON.stringify(updatedProgress)
//       );
//     } catch (error) {
//       console.error("Помилка оновлення прогресу:", error);
//     }
//   };

//   const detectDropArea = (x, y) => {
//     console.log(x, y, "x - y");
//     for (const [id, bounds] of Object.entries(imageRefs.current)) {
//       console.log(
//         bounds.left,
//         bounds.right,
//         bounds.top,
//         bounds.bottom,
//         "--Bounds--"
//       );
//       if (
//         x >= bounds.left &&
//         x <= bounds.right &&
//         y >= bounds.top &&
//         y <= bounds.bottom
//       ) {
//         return { id }; // Повертаємо ID картинки, якщо слово в межах зони
//       }
//     }
//     return null;
//   };

//   const handleDrop = (wordId, imageId) => {
//     setMatches((prev) => ({
//       ...prev,
//       [imageId]: wordId,
//     }));
//   };

//   const checkMatches = async () => {
//     try {
//       const isCorrect = images.every((img) => matches[img.id] === img.id);
//       if (isCorrect) {
//         await markCurrentWordsAsCompleted();
//         Alert.alert("Все правильно!");
//         navigation.navigate("Train", { topicName });
//         return;
//       }
//       Alert.alert("Спробуйте ще раз.");
//     } catch (error) {
//       console.log(error.message);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.title}>Відповідність слів до картинок</Text>
//       <View style={styles.gameContainer}>
//         {/* Картинки */}
//         <View style={styles.imagesContainer}>
//           {images.map((image) => (
//             <View
//               key={image.id}
//               style={styles.imageBox}
//               onLayout={(event) => {
//                 const { x, y, width, height } = event.nativeEvent.layout;
//                 imageRefs.current[image.id] = {
//                   left: x,
//                   top: y,
//                   right: x + width,
//                   bottom: y + height,
//                 };
//               }}
//             >
//               <Image source={{ uri: image.uri }} style={styles.image} />
//               {/* Відображення слова під картинкою */}
//               {matches[image.id] && (
//                 <Text style={styles.wordUnderImage}>{matches[image.id]}</Text>
//               )}
//             </View>
//           ))}
//         </View>

//         {/* Слова */}
//         <View style={styles.wordsContainer}>
//           {words.map((word) => {
//             // Якщо для слова ще немає значення, створюємо нове
//             if (!panRefs.current[word.id]) {
//               panRefs.current[word.id] = new Animated.ValueXY();
//             }
//             const pan = panRefs.current[word.id];

//             return (
//               <Animated.View
//                 key={word.id}
//                 style={[
//                   styles.wordBox,
//                   { transform: pan.getTranslateTransform() },
//                 ]}
//                 {...createPanResponder(word.id, pan).panHandlers}
//               >
//                 <Text style={styles.word}>{word.text}</Text>
//               </Animated.View>
//             );
//           })}
//         </View>
//       </View>
//       <View style={styles.buttonContainer}>
//         <Text style={styles.checkButton} onPress={checkMatches}>
//           Перевірити
//         </Text>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//     backgroundColor: "#f4f4f4",
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginVertical: 10,
//   },
//   gameContainer: {
//     flex: 1,
//     flexDirection: "row",
//   },
//   imagesContainer: {
//     flex: 1,
//     justifyContent: "space-around",
//     alignItems: "center",
//   },
//   imageBox: {
//     marginBottom: 20,
//     alignItems: "center",
//   },
//   image: {
//     width: 100,
//     height: 100,
//     marginBottom: 10,
//   },
//   wordsContainer: {
//     flex: 1,
//     justifyContent: "space-around",
//     alignItems: "center",
//   },
//   wordBox: {
//     backgroundColor: "#e0e0e0",
//     padding: 10,
//     borderRadius: 5,
//     marginVertical: 5,
//   },
//   wordUnderImage: {
//     marginTop: 10,
//     fontSize: 16,
//     fontWeight: "bold",
//     textAlign: "center",
//     color: "#333",
//   },
//   word: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   buttonContainer: {
//     alignItems: "center",
//     marginVertical: 10,
//   },
//   checkButton: {
//     padding: 10,
//     backgroundColor: "#67104c",
//     color: "white",
//     fontSize: 18,
//     borderRadius: 5,
//     textAlign: "center",
//   },
// });
