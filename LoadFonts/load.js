// loadFonts.js
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const fetchFonts = async () => {
    await Font.loadAsync({
        "Jakarta-Regular": require("../assets/fonts/PlusJakartaSans-VariableFont_wght.ttf"),
        "Jakarta-Bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
        "Jakarta-Semibold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    });
};

export const loadFonts = async () => {
    await fetchFonts();
    await SplashScreen.hideAsync();
};

export default loadFonts;