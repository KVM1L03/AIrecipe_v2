import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Animated,
} from "react-native";
import HeaderDetails from "../components/HeaderCalories";
import Ionicons from "@expo/vector-icons/MaterialIcons";
import { Button, Searchbar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface FoodData {
  id: string;
  name: string;
  energy: number;
  "nutrition-per-100g"?: {
    energy: number;
  };
  "nutrition-per-100ml"?: {
    energy: number;
  };
}

const DetailsScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<FoodData[]>([]);
  const [selectedResult, setSelectedResult] = useState<FoodData | null>(null);
  const [dailyCalories, setDailyCalories] = useState<string>("");
  const [addCalories, setAddCalories] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [consumedCalories, setConsumedCalories] = useState<number>(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [calorieGoalEntered, setCalorieGoalEntered] = useState(false);

  //Animation for calorie progress animation
  const animateProgress = () => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    animateProgress();
  }, [progress]);

  //Load caloreieGoal from AsyncStorage
  useEffect(() => {
    const loadCalorieGoal = async () => {
      try {
        const storedGoal = await AsyncStorage.getItem("dailyCalories");
        if (storedGoal !== null) {
          setDailyCalories(storedGoal);
          setCalorieGoalEntered(true);
        }
      } catch (error) {
        console.error("Error loading calorie goal from AsyncStorage:", error);
      }
    };

    //Load progress from AsyncStorage
    const loadProgress = async () => {
      try {
        const storedProgress = await AsyncStorage.getItem("progress");
        if (storedProgress !== null) {
          setProgress(parseFloat(storedProgress));
        }
      } catch (error) {
        console.error("Error loading progress from AsyncStorage:", error);
      }
    };

    loadCalorieGoal();
    loadProgress();
  }, []);

  //Searching for products function, adding calories to calculator after clocking
  const handleSearch = async () => {
    try {
      const response = await fetch(
        "https://raw.githubusercontent.com/noizwaves/nutrition/master/data/food.json"
      );
      const data: FoodData[] = await response.json();

      const searchTerm = searchQuery.trim().toLowerCase();
      const results = data
        .filter((food) => {
          return (
            food.name.toLowerCase().includes(searchTerm) ||
            (food.id && food.id.toLowerCase().includes(searchTerm))
          );
        })
        .map((food) => {
          let energy;
          if (food["nutrition-per-100g"]) {
            energy = food["nutrition-per-100g"]["energy"];
          } else if (food["nutrition-per-100ml"]) {
            energy = food["nutrition-per-100ml"]["energy"];
          } else {
            energy = 0;
          }
          return {
            id: food.id,
            name: food.name,
            energy: energy,
          };
        })
        .slice(0, 2);

      setSearchResults(results);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [searchQuery]);

  useEffect(() => {
    const loadConsumedCalories = async () => {
      try {
        const storedConsumedCalories = await AsyncStorage.getItem("consumedCalories");
        if (storedConsumedCalories !== null) {
          setConsumedCalories(parseInt(storedConsumedCalories, 10));
        }
      } catch (error) {
        console.error("Error loading consumed calories from AsyncStorage:", error);
      }
    };
  
    loadConsumedCalories();
  }, []);

  const handleSelectResult = (result: FoodData) => {
    setSelectedResult(result);

    const selectedCalories = result.energy;
    const newConsumedCalories = consumedCalories + selectedCalories;

    if (newConsumedCalories <= parseInt(dailyCalories)) {
      setConsumedCalories(newConsumedCalories);
    } else {
      setConsumedCalories(parseInt(dailyCalories));
    }

    calculateProgress(newConsumedCalories, dailyCalories);
  };

  const calculateProgress = (consumed: number, daily: string) => {
    if (daily) {
      const calculatedProgress = (consumed / parseInt(daily, 10)) * 100;
      //Ensure the progress doesn't exceed 100%
      const progress = Math.min(calculatedProgress, 100);
      setProgress(progress);

      //Save the progress to AsyncStorage
      AsyncStorage.setItem("progress", progress.toString()).catch((error) => {
        console.error("Error saving progress to AsyncStorage:", error);
      });
    } else {
      setProgress(0);
    }
  };

  //Reset calories calculator
  const handleReset = async () => {
    try {
      // Clear the daily calorie goal and progress from AsyncStorage
      await AsyncStorage.multiRemove(["dailyCalories"]);
      await AsyncStorage.removeItem("progress"); // Clear the progress value
    } catch (error) {
      console.error("Error clearing data from AsyncStorage:", error);
    }

    // Reset the state
    setProgress(0);
    setConsumedCalories(0);
    setSelectedResult(null);
    setDailyCalories("");
    setCalorieGoalEntered(false);
    setAddCalories("");

    Animated.timing(progressAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  //Add extra calories
  const handleAddCalories = () => {
    if (addCalories && !isNaN(parseInt(addCalories))) {
      const newConsumedCalories = consumedCalories + parseInt(addCalories);
  
      if (newConsumedCalories <= parseInt(dailyCalories)) {
        // Delay the progress update by 500 milliseconds (adjust as needed)
        setTimeout(() => {
          setConsumedCalories(newConsumedCalories);
          calculateProgress(newConsumedCalories, dailyCalories);
  
          // Save the updated consumed calories to AsyncStorage
          AsyncStorage.setItem("consumedCalories", newConsumedCalories.toString()).catch((error) => {
            console.error("Error saving consumed calories to AsyncStorage:", error);
          });
        }, 250);
      }
    }
    setAddCalories("");
  };
  

  const progressBarWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  const renderItem = ({ item }: { item: FoodData }) => {
    return (
      <TouchableOpacity
        style={styles.resultItem}
        onPress={() => handleSelectResult(item)}
      >
        <View style={{ padding: 16 }}>
          <Text style={{ fontFamily: "PlayfairDisplay-Bold" }}>
            {item.name}
          </Text>
          <Text style={{ fontFamily: "PlayfairDisplay-Regular" }}>
            Calories: {item.energy} kcal
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <HeaderDetails />
        <TextInput
          placeholder="Calorie goal : "
          numberOfLines={1}
          keyboardType="numeric"
          value={dailyCalories}
          cursorColor={"#000000"}
          onChangeText={async (text) => {
            setDailyCalories(text);
            setCalorieGoalEntered(true);

            try {
              await AsyncStorage.setItem("dailyCalories", text);
            } catch (error) {
              console.error(
                "Error saving calorie goal to AsyncStorage:",
                error
              );
            }
          }}
          style={{
            borderWidth: 2,
            borderColor: "#c4c4c4",
            padding: 10,
            borderRadius: 20,
            fontFamily: "PlayfairDisplay-Bold",
            fontSize: 16,
            marginTop: 10,
          }}
          textAlign="center"
          placeholderTextColor="#4b4b4b"
        />
        {calorieGoalEntered && (
          <>
            <Searchbar
              mode="bar"
              rippleColor={"black"}
              inputStyle={{ fontFamily: "PlayfairDisplay-Regular" }}
              placeholder="Search for a food..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              style={{ marginVertical: 10, backgroundColor: "#c4c4c4" }}
              theme={{ colors: { primary: "black", background: "#c4c4c4" } }}
            />
            <FlatList
              data={searchResults}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
            />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 100,
                alignContent: "center",
              }}
            >
              <TextInput
                placeholder="Add your own calories: "
                numberOfLines={1}
                keyboardType="numeric"
                value={addCalories}
                onChangeText={setAddCalories}
                cursorColor={"#000000"}
                style={{
                  borderWidth: 2,
                  borderColor: "#c4c4c4",
                  padding: 10,
                  borderRadius: 20,
                  fontFamily: "PlayfairDisplay-Regular",
                  fontSize: 16,
                  marginTop: 10,
                }}
                textAlign="center"
                placeholderTextColor="#000000"
              />
              <Button
                style={{ marginHorizontal: 20, marginTop: 10 }}
                mode="elevated"
                buttonColor="#FF9001"
                onPress={handleAddCalories}
                disabled={!addCalories}
              >
                <Ionicons
                  name="add"
                  size={20}
                  color={"black"}
                  style={{ alignSelf: "center" }}
                />
              </Button>
            </View>
          </>
        )}
        <>
          <Text style={{ alignSelf: "center", fontSize: 40 }}>
            {" "}
            {Math.round(progress)} %
          </Text>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                { width: progressBarWidth },
                progress >= 100 && { backgroundColor: "red" }, // Red when hitting 100%
                progress > 50 &&
                  progress < 100 && { backgroundColor: "orange" }, // Orange after hitting 50%
              ]}
            />
          </View>
          <Text style={{fontFamily: "PlayfairDisplay-Regular", alignSelf:'center'}}>{parseInt(dailyCalories, 10) - consumedCalories} calories left</Text>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Ionicons
              name="delete"
              size={36}
              color={"red"}
              style={{ alignSelf: "center" }}
            />
            <Text
              style={{
                color: "red",
                marginTop: 10,
                fontFamily: "PlayfairDisplay-Regular",
              }}
            >
              Reset
            </Text>
          </TouchableOpacity>
        </>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    flex: 1,
    backgroundColor: "transparent",
    borderRadius: 100,
  },
  content: {
    flex: 18 / 20,
    padding: 16,
    backgroundColor: "white",
    elevation: 4,
  },
  resultItem: {
    backgroundColor: "#f4f4f7",
    marginBottom: 8,
    borderRadius: 30,
    elevation: 3,
    marginHorizontal: 3,
  },
  progressBar: {
    height: 20,
    width: "100%",
    backgroundColor: "#ccc",
    borderRadius:6,
    marginTop: 16,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "green",
    borderRadius: 5,
  },
  resetButton: {
    alignItems: "center",
    marginTop: 20,
  },
});

export default DetailsScreen;
