// App.js
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";
import StartingPage from "./Pages/StartingPage";
import LoginPage from "./Pages/Logins/LoginPage";
import SignUp from "./Pages/Logins/SignUp";
import Dashboard from "./Pages/Dashboard";
import OrderInformation from "./Pages/Operation/OrderInformation";
import Payment from "./Pages/Operation/Payment";
import Gcash from "./Pages/Operation/Gcash";
import DonePayment from "./Pages/Operation/DonePayment";
import { UserProvider } from './Components/UserContext'; // Import UserProvider
import ContinueSignUp from "./Pages/Logins/ContinueSignUp";
import StationReg from "./Pages/Operation/stationReg";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="StartingPage" component={StartingPage} />
          <Stack.Screen name="LoginPage" component={LoginPage} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="OrderInformation" component={OrderInformation} />
          <Stack.Screen name="Payment" component={Payment} />
          <Stack.Screen name="Gcash" component={Gcash} />
          <Stack.Screen name="DonePayment" component={DonePayment} />
          <Stack.Screen name="ContinueSignUp" component={ContinueSignUp} />
          <Stack.Screen name="StationReg" component={StationReg} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}

const styles = StyleSheet.create({});
