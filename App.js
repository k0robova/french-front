import { NavigationContainer } from "@react-navigation/native";
import { Suspense } from "react";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { StyleSheet, Text, View } from "react-native";

import { persistor, store } from "./store/store";
import { AppNavigator } from "./components/AppNavigator";

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Suspense
            fallback={
              <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
              </View>
            }
          >
            <AppNavigator />
          </Suspense>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
