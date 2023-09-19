import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { Image } from "react-native";

const Header = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate("Recipe")}
        >
          <Ionicons name="local-dining" size={34} color={"#000000"} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
          <Image style={{height:40, width:60}} source={{uri:"https://i.ibb.co/1nVh0fm/obraz-2023-09-18-192215867-removebg-preview.png"}}/>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate("Calculator")}
        >
          <Ionicons name="local-fire-department" size={34} color={"#000000"} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  item: {
    marginHorizontal:50,
  },
  img: {
    height: 38,
    width: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: "black",
  },
});

export default Header;
