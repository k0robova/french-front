import { NavigationContainer } from "@react-navigation/native";
import { Suspense } from "react";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { StyleSheet, Text, View } from "react-native";

import { persistor, store } from "./store/store";
import { AppNavigator } from "./components/AppNavigator";

export default function App() {
  // const [isToken, setIsToken] = useState(null);

  // const checkToken = async () => {
  //   try {
  //     const storedToken = await SecureStore.getItemAsync("token");
  //     if (storedToken) {
  //       await fetchAndStoreUserProfile(storedToken);
  //       setIsToken(true);
  //     } else {
  //       setIsToken(false);
  //     }
  //   } catch (error) {
  //     setIsToken(false);
  //     console.log("Error checking token:", error);
  //   }
  // };

  // const loadAppData = async () => {
  //   try {
  //     await checkToken();
  //   } catch (error) {
  //     console.log("Error loading app data:", error);
  //   }
  // };

  // if (isToken === null) {
  //   return (
  //     <View style={styles.loadingContainer}>
  //       <Text>Loading...</Text>
  //     </View>
  //   );
  // }

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
