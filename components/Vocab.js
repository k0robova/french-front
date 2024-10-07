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
import { useDispatch, useSelector } from "react-redux";
import { selectTopic } from "../store/topic/selectors";
import { getVocab } from "../store/vocab/vocabThunks";
import { selectVocab } from "../store/vocab/selectors";

export const Vocab = () => {
  const { t } = useTranslation();
  const isDarkTheme = useSelector((state) => state.auth.theme);
  const navigation = useNavigation();
  const vocabData = useSelector(selectVocab);
  const topicsData = useSelector(selectTopic);
  const dispatch = useDispatch();

  const handleGetWorlds = async (id, name) => {
    try {
      if (vocabData && vocabData.length > 0) {
        navigation.navigate("LearnOrTrainTopic", { topicName: name });
        return;
      }

      const resultAction = await dispatch(getVocab(id));
      if (getVocab.fulfilled.match(resultAction)) {
        navigation.navigate("LearnOrTrainTopic", { topicName: name });
      }
      return;
    } catch (error) {
      console.log(error);
    }
  };

  // const getTopics = async () => {
  //   try {
  //     const data = await fetchTopic();
  //     setTopicsData(data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   getTopics();
  // }, []);

  const renderTopicsItem = ({ item }) => {
    return (
      <Pressable
        style={[
          styles.button,
          { backgroundColor: isDarkTheme ? "white" : "#67104c" },
        ]}
        onPress={() => handleGetWorlds(item._id, item.name)}
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
