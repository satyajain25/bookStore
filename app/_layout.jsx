import { Stack } from "expo-router";
import "../global.css";
import { Provider } from 'react-redux';
import store from '../components/Store.js';
import { SafeAreaProvider } from "react-native-safe-area-context";
export default function RootLayout() {
  return (
    <Provider store={store}>
         <SafeAreaProvider>
      <Stack initialRouteName="(auth)" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      </SafeAreaProvider>
    </Provider>
  );
}

