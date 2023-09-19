import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import DetailsScreen from "./screens/CaloriesScreen";
import RecipeScreen from "./screens/RecipeScreen";


const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false, animationEnabled: true }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Calculator"
          component={DetailsScreen}
          options={{
            animationEnabled: true,
            cardStyle: { backgroundColor: "transparent" },
            cardOverlayEnabled: true,
            cardStyleInterpolator: ({ current: { progress } }) => ({
              cardStyle: {
                transform: [
                  {
                    translateX: progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [300, 0],
                    }),
                  },
                ],
              },
              overlayStyle: {
                opacity: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.5],
                }),
              },
            }),
            gestureDirection: "horizontal", 
          }}
        />
        <Stack.Screen name="Recipe" component={RecipeScreen} options={{
            animationEnabled: true,
            cardStyle: { backgroundColor: "transparent" },
            cardOverlayEnabled: true,
            cardStyleInterpolator: ({ current: { progress } }) => ({
              cardStyle: {
                transform: [
                  {
                    translateX: progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-300, 0],
                    }),
                  },
                ],
              },
              overlayStyle: {
                opacity: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.5],
                }),
              },
            }),
            gestureDirection: "horizontal", 
          }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
