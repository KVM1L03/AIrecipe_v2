import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  ScrollView,
} from "react-native";
import Card from "../components/Card";
import Header from "../components/Header";

const { width, height } = Dimensions.get("screen");

const HEIGHT = height * 0.75;
const WIDTH = width;

const HomeScreen: React.FC = () => {
  const scrollX = React.useRef(new Animated.Value(0)).current;

  const data = [
    {
      id: "1",
      img: "https://i.ibb.co/VSLRjTR/obraz-2023-09-19-125915413-removebg-preview.png" ,
      title: "American",
      description:
        "American cuisine is a diverse fusion of flavors influenced by various cultures. It includes iconic dishes like hamburgers, barbecue, southern comfort food, Tex-Mex, and fast food.",
      flag: "https://img.icons8.com/color/48/usa.png",
    },
    {
      id: "2",
      img: "https://i.ibb.co/fkMFC49/obraz-2023-09-11-225237277-removebg-preview.png",
      title: "Italian",
      description:
        "Experience Italy's culinary charm in your own kitchen. Create a masterpiece with layers of fresh pasta, tomatoes, basil, and mozzarella, bathed in homemade marinara sauce. It's an Italian classic that promises pure delight. Buon appetito!",
      flag: "https://img.icons8.com/color/48/italy.png",
    },

    {
      id: "3",
      img: "https://i.ibb.co/84KhSd8/obraz-2023-09-18-184139917-removebg-preview.png",
      title: "French",
      description:
        "Bring the charm of France to your kitchen with our delightful French cuisine recipe. Picture tender escargot bathed in garlic and herb sauce, served with crusty baguette. It's a taste of French sophistication that will transport your senses. Bon appétit!",
      flag: "https://img.icons8.com/color/48/france.png",
    },
  ];
  console.log(data.length);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        contentContainerStyle={styles.scrollViewContent}
        onScroll={handleScroll}
      >
        {data.map((item) => (
          <Card
            key={item.id}
            img={item.img}
            title={item.title}
            flag={item.flag}
            description={item.description}
          />
        ))}
      </ScrollView>
      <View style={styles.pagination}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: "#333",
              },
            ]}
          />
        ))}
        <Animated.View
          style={[
            styles.dotIndicator,
            {
              transform: [
                {
                  translateX: Animated.divide(scrollX, WIDTH).interpolate({
                    inputRange: [0, data.length - 1],
                    outputRange: [0, 12 * data.length],
                  }),
                },
              ],
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  scrollViewContent: {
    flexDirection: "row",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 16,
    width: WIDTH,
    height: HEIGHT,
  },
  pagination: {
    flexDirection: "row",
    position: "absolute",
    bottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: "#333",
    marginHorizontal: 5,
  },
  dotIndicator: {
    width: 12,
    height: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
    position: "absolute",
    bottom: -2,
    left: 3,
  },
});

export default HomeScreen;
