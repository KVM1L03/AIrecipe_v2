import React from "react";
import Navigation from "./Navigation";
import { useFonts } from "expo-font";

const App = () => {
  const [fontsLoaded] = useFonts({
    "PlayfairDisplay-Bold": require("./assets/fonts/playfair/PlayfairDisplay-Bold.ttf"),
    "PlayfairDisplay-Regular": require("./assets/fonts/playfair/PlayfairDisplay-Regular.ttf")
  });

  if (!fontsLoaded) {
    // Wait for fonts to load
    return null; // or render a loading screen
  }

  return <Navigation />;
};

export default App;
