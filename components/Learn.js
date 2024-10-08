import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";

export const Learn = () => {
  const { t } = useTranslation();
  const route = useRoute();
  const { topicName } = route.params;
  const isDarkTheme = useSelector((state) => state.auth.theme);
  const navigation = useNavigation();

  // Обробка вибору кількості слів
  const handlePress = (count) => {
    navigation.navigate("WordLearningScreen", { count, topicName });
  };

  const deleteStore = async () => {
    try {
      await AsyncStorage.removeItem(`progress_${topicName}`);
      console.log(`Progress for topic ${topicName} has been deleted.`);
    } catch (error) {
      console.error("Error removing progress from storage:", error);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDarkTheme ? "#67104c" : "white" },
      ]}
    >
      <View style={styles.linkContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isDarkTheme ? "white" : "#67104c" },
          ]}
          onPress={() => handlePress(5)}
        >
          <Text
            style={{
              color: isDarkTheme ? "#67104c" : "white",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            5 words
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isDarkTheme ? "white" : "#67104c" },
          ]}
          onPress={() => handlePress(10)}
        >
          <Text
            style={{
              color: isDarkTheme ? "#67104c" : "white",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            10 words
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isDarkTheme ? "white" : "#67104c" },
          ]}
          onPress={() => handlePress(15)}
        >
          <Text
            style={{
              color: isDarkTheme ? "#67104c" : "white",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            15 words
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isDarkTheme ? "white" : "#67104c" },
          ]}
          onPress={() => handlePress(20)}
        >
          <Text
            style={{
              color: isDarkTheme ? "#67104c" : "white",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            20 words
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isDarkTheme ? "white" : "#67104c" },
          ]}
          onPress={() => deleteStore()}
        >
          <Text
            style={{
              color: isDarkTheme ? "#67104c" : "white",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            StoreDelete
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  linkContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginTop: 18,
    marginBottom: 4,
    borderRadius: 100,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: 343,
    height: 51,
  },
});

// import { useNavigation } from "@react-navigation/native";
// import React from "react";
// import { useTranslation } from "react-i18next";
// import AntDesign from "@expo/vector-icons/AntDesign";
// import {
//   Pressable,
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
// } from "react-native";

// import { useSelector } from "react-redux";
// import { selectVocab } from "../store/vocab/selectors";

// export const Learn = () => {
//   const { t } = useTranslation();
//   const isDarkTheme = useSelector((state) => state.auth.theme);
//   const vocabData = useSelector(selectVocab);
//   const navigation = useNavigation();

//   const handlePress = () => {
//     console.log("Button  pressed");
//   };

//   return (
//     <SafeAreaView
//       style={[
//         styles.container,
//         { backgroundColor: isDarkTheme ? "#67104c" : "white" },
//       ]}
//     >
//       <View style={styles.linkContainer}>
//         <TouchableOpacity
//           style={[
//             styles.button,
//             { backgroundColor: isDarkTheme ? "white" : "#67104c" },
//           ]}
//           onPress={() => handlePress()}
//         >
//           <Text
//             style={{
//               color: isDarkTheme ? "#67104c" : "white",
//               fontWeight: "bold",
//               textAlign: "center",
//             }}
//           >
//             5 words
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[
//             styles.button,
//             { backgroundColor: isDarkTheme ? "white" : "#67104c" },
//           ]}
//           onPress={() => handlePress()}
//         >
//           <Text
//             style={{
//               color: isDarkTheme ? "#67104c" : "white",
//               fontWeight: "bold",
//               textAlign: "center",
//             }}
//           >
//             10 words
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[
//             styles.button,
//             { backgroundColor: isDarkTheme ? "white" : "#67104c" },
//           ]}
//           onPress={() => handlePress()}
//         >
//           <Text
//             style={{
//               color: isDarkTheme ? "#67104c" : "white",
//               fontWeight: "bold",
//               textAlign: "center",
//             }}
//           >
//             15 words
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[
//             styles.button,
//             { backgroundColor: isDarkTheme ? "white" : "#67104c" },
//           ]}
//           onPress={() => handlePress()}
//         >
//           <Text
//             style={{
//               color: isDarkTheme ? "#67104c" : "white",
//               fontWeight: "bold",
//               textAlign: "center",
//             }}
//           >
//             20 words
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     flex: 1,
//   },
//   linkContainer: {
//     justifyContent: "center", // Вирівнює кнопки по вертикалі по центру
//     alignItems: "center", // Вирівнює кнопки по горизонталі по центру
//   },
//   button: {
//     marginTop: 18,
//     marginBottom: 4,
//     borderRadius: 100,
//     paddingVertical: 16,
//     paddingHorizontal: 32,
//     width: 343,
//     height: 51,
//   },
// });
