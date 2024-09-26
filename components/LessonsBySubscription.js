import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";

export const LessonsBySubscription = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView>
      <View>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text>LessonsBySubscription</Text>
      </View>
    </SafeAreaView>
  );
};
