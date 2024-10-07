import { useTranslation } from "react-i18next";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { fetchTopic } from "../services/themeService";
import { useEffect, useState } from "react";

export const Vocab = () => {
  const { t } = useTranslation();
  const isDarkTheme = useSelector((state) => state.auth.theme);
  const navigation = useNavigation();

  const [topicsData, setTopicsData] = useState(null);

  const getTopics = async () => {
    try {
      const data = await fetchTopic();
      setTopicsData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTopics();
  }, []);

  const renderTopicsItem = ({ item }) => {
    return (
      <Pressable
        style={[
          styles.button,
          { backgroundColor: isDarkTheme ? "white" : "#67104c" },
        ]}
        onPress={() => navigation.navigate("LearnOrTrainTopic")}
      >
        <Text
          style={{
            color: isDarkTheme ? "#67104c" : "white",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {item.name}
        </Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDarkTheme ? "#67104c" : "white" },
      ]}
    >
      {/* <Pressable onPress={() => navigation.navigate("StudyAndTrain")}>
        <Text
          style={{
            backgroundColor: isDarkTheme ? "white" : "#67104c",
            color: isDarkTheme ? "#67104c" : "white",
          }}
        >
          {t("LAT.vocab")}
        </Text>
      </Pressable> */}
      <View style={{ padding: 20 }}>
        <FlatList
          style={{ width: "100%" }}
          data={topicsData}
          keyExtractor={(item) => item._id}
          renderItem={renderTopicsItem}
          contentContainerStyle={{ alignItems: "center" }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  linkText: {
    fontSize: 24,
    padding: 15,
    borderRadius: 35,
    fontWeight: "bold",
  },
  boldText: {
    marginBottom: 10,
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
