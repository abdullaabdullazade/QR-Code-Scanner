import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import 'react-native-reanimated';
import { Chewy_400Regular } from '@expo-google-fonts/chewy/400Regular';

export default function RootLayout() {
  const [loaded] = useFonts({
    Chewy_400Regular,
  });

  if (!loaded) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name='(stack)' options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
