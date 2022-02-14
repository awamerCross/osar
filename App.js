import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
// import { AsyncStorage } from "react-native";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import AppNavigator from "./src/routes";
import { Root } from "native-base";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistedStore } from "./src/store";
import "./ReactotronConfig";
import * as Notifications from "expo-notifications";

function App({ navigation }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // I18nManager.forceRTL(true);
    // AsyncStorage.clear();

    if (Platform.OS === "android") {
      // Notifications.createChannelAndroidAsync('orders', {
      //   name: 'Chat messages',
      //   sound: true,
      // });

      Notifications.setNotificationChannelAsync("orders", {
        name: "Chat messages",
        importance: Notifications.AndroidImportance.HIGH,
        sound: "email-sound.wav", // <- for Android 8.0+, see channelId property below
      });
    }

    async function loadFont() {
      await Font.loadAsync({
        flatMedium: require("./assets/fonts/JF-Flat-medium.ttf"),
        flatRegular: require("./assets/fonts/JF-Flat-regular.ttf"),
        // Roboto            : require('native-base/Fonts/Roboto.ttf'),
        // Roboto_medium     : require('native-base/Fonts/Roboto_medium.ttf'),
        ...Ionicons.font,
      });
      setIsReady(true);
    }

    loadFont();
  }, [isReady]);

  if (!isReady) {
    return <AppLoading />;
  }

  return (
    <Provider store={store}>
      <PersistGate persistor={persistedStore}>
        <Root>
          {/*<StatusBar style="auto" />*/}
          <AppNavigator />
        </Root>
      </PersistGate>
    </Provider>
  );
}

export default App;

// Keystore credentials
// Keystore password: ec1a1ce9e0f04e2b9f4cb3346b96e251
// Key alias:         QGFtYW55X2thc3NlbS9Pc3ItbW9udGdh
// Key password:      a72a9b17c7144bb79617561f1e01c8b1
