import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

const HeaderRecipe = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView>
      <View style={styles.row}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={30} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Calculator")}
        >
          <Ionicons name="local-fire-department" size={34} color={"#000000"} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    row: {
      flexDirection: "row",
      justifyContent: "space-between", 
      alignItems: "center",
      paddingHorizontal: 0, 
    }, 
  });
  

export default HeaderRecipe;
