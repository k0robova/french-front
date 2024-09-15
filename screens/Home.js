import { SafeAreaView, Text, View, StyleSheet } from "react-native";

export const Home = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Welcome! This is your Home Page</Text>
      <Text style={styles.text}>Study and train</Text>
      <Text style={styles.text}>Lessons by subscriptions</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Це дозволяє SafeAreaView займати весь доступний простір
    justifyContent: "center", // Центрує контент по вертикалі
    alignItems: "center", // Центрує контент по горизонталі
    backgroundColor: "white", // Додайте фон для видимості
  },
  text: {
    fontSize: 20,
    color: "black",
  },
});
