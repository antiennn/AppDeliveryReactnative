import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useReducer, useState } from "react";
import Slider from "./src/components/intro/slider";
import Login from "./src/components/LoginAndRegester/Login";
import Registerstep1 from "./src/components/LoginAndRegester/Registerstep1";
import Registerstep2 from "./src/components/LoginAndRegester/Registerstep2";
import Registerstep3 from "./src/components/LoginAndRegester/Registerstep3";
import Home from "./src/components/Home/Home";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MyContext from "./src/configs/MyContext";
import MyUserReducer from "./reducers/MyUserReducer";

const Stack = createStackNavigator();

const App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, null);
  const [layout, setlayout] = useState("");
  const [loading, setloading] = useState(true);
  React.useEffect(() => {
    const loadlayout = async () => {
      try {
        // AsyncStorage.clear()
        const value = await AsyncStorage.getItem("layout");
        setlayout(value ? "Login" : "Intro");
        setloading(false);
      } catch (error) {
        console.log(error);
      } finally {
        await AsyncStorage.setItem("layout", "Login");
      }
    };
    loadlayout();
  }, []);

  if (loading) {
    return <Text>loading</Text>;
  }
  return (
    <MyContext.Provider value={[user, dispatch]}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName={layout}
        >
          <Stack.Screen name="Index" component={Home} />
          <Stack.Screen name="Intro" component={Slider} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Step1" component={Registerstep1} />
          <Stack.Screen name="Step2" component={Registerstep2} />
          <Stack.Screen name="Step3" component={Registerstep3} />
        </Stack.Navigator>
      </NavigationContainer>
    </MyContext.Provider>
  );
};

export default App;

const styles = StyleSheet.create({});
