import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Dimensions,
} from "react-native";
import { Button } from "react-native-paper";

type CardProps = {
  img: string;
  title: string;
  description: string;
  flag: string;
  style?: StyleProp<ViewStyle>;
};

const {width, height} = Dimensions.get('screen')

const HEIGHT = height * 0.40;
const WIDTH = width;

const Card: React.FC<CardProps> = ({ img, title, description, flag }) => {
  return (
    <View style={[styles.card, { width: WIDTH, height: HEIGHT }]}>
      <View style={styles.content_2}>
        <Text style={styles.title}>{title}</Text>
        <Image source={{ uri: flag }} style={styles.flag} />
      </View>
      <Image source={{ uri: img }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Button
        style={{ position:'absolute' , bottom: - HEIGHT}}
        labelStyle={{ fontFamily: "PlayfairDisplay-Bold" }}
        mode="elevated"
        textColor="#000000"
        buttonColor="#FF9001"
      >See more
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    alignItems: "center",
    padding: 20,
    borderRadius: 8,
    marginBottom: 16,
  },
  content: {
    alignItems: "center",
    marginTop: 50,
  },
  content_2: {
    alignItems: "center",
    marginBottom: 2,
  },
  image: {
    width: WIDTH * .90,
    height: HEIGHT ,
    resizeMode: 'cover'
  },
  flag: {
    width: 48,
    height: 48,
    marginTop: 20,
  },
  textContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    color: "#FF9001",
    fontFamily: "PlayfairDisplay-Bold",
  },
  description: {
    fontSize: 14,
    color: "#4b4b4b",
    fontFamily: "PlayfairDisplay-Bold",
  },
});

export default Card;
