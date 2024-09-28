import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import "../i18n";
import { TouchableOpacity, View, SafeAreaView, Text } from "react-native";

export const Support = () => {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          paddingTop: 10,
          paddingRight: 18,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <AntDesign name="arrowleft" size={24} color="#67104c" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => changeLanguage(i18n.language === "en" ? "ua" : "en")}
        >
          <MaterialIcons name="language" size={26} color="#67104c" />
        </TouchableOpacity>
      </View>
      <View style={{ marginVertical: 22 }}>
        <Text
          style={{
            fontSize: 16,
            marginVertical: 12,
            color: "black",
          }}
        >
          {t("rg.support")}
        </Text>
      </View>
    </SafeAreaView>
  );
};
