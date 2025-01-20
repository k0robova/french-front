import React from "react";
import { FirstLevel } from "./FirstLevel";
import { useRoute } from "@react-navigation/native";
import { SafeAreaView, Text } from "react-native";
import { SecondLevel } from "./SecondLevel";
import { FourthLevel } from "./FourtLevel";
import { ThirdLevel } from "./ThirdLevel";
import { FifthLevel } from "./FifthLevel";

export const TrainingLevel = () => {
  const route = useRoute();
  const { level, topicName, progress } = route.params;

  const renderLevelComponent = () => {
    switch (level) {
      case 1:
        return (
          <FirstLevel level={level} progress={progress} topicName={topicName} />
        );
      case 2:
        return (
          <SecondLevel
            level={level}
            progress={progress}
            topicName={topicName}
          />
        );
      case 3:
        return (
          <ThirdLevel level={level} progress={progress} topicName={topicName} />
        );
      case 4:
        return (
          <FourthLevel
            level={level}
            progress={progress}
            topicName={topicName}
          />
        );
      case 5:
        return (
          <FifthLevel level={level} progress={progress} topicName={topicName} />
        );
      // Додайте інші рівні за потреби
      default:
        return <Text>Невідомий рівень</Text>;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>{renderLevelComponent()}</SafeAreaView>
  );
};
