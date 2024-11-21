import { useTranslation } from "react-i18next";
import { Pressable, SafeAreaView, Text, View, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { selectTopic } from "../store/topic/selectors";
import { getVocab } from "../store/vocab/vocabThunks";
import { selectVocab } from "../store/vocab/selectors";
import { setThemeId } from "../store/vocab/vocabSlice";
import { defaultStyles } from "./defaultStyles";

export const Vocab = () => {
  const { i18n } = useTranslation();
  const isDarkTheme = useSelector((state) => state.auth.theme);
  const navigation = useNavigation();
  const vocabData = useSelector(selectVocab);
  const topicsData = useSelector(selectTopic);
  const dispatch = useDispatch();
  const currentLanguage = i18n.language;

  const handleGetWorlds = async (id, name) => {
    try {
      const existingData = vocabData.find((item) => item.themeId === id);

      dispatch(setThemeId(id));

      if (existingData) {
        navigation.navigate("LearnOrTrainTopic", {
          topicName: name,
        });
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

  const renderTopicsItem = ({ item }) => {
    return (
      <Pressable
        style={[
          defaultStyles.button,
          { backgroundColor: isDarkTheme ? "white" : "#67104c" },
        ]}
        onPress={() => handleGetWorlds(item._id, item.name)}
      >
        <Text
          style={[
            defaultStyles.btnText,
            {
              color: isDarkTheme ? "#67104c" : "white",
            },
          ]}
        >
          {item.name} /{" "}
          {currentLanguage === "uk" ? item.translationUK : item.translationEN}
        </Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView
      style={[
        defaultStyles.container,
        { backgroundColor: isDarkTheme ? "#67104c" : "white" },
      ]}
    >
      <View>
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
