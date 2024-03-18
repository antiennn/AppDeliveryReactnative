import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import React, { useRef } from "react";
import Getstart from "./getstart";

const { width, height } = Dimensions.get("screen");

const SliderItems = ({ items,navigation  }) => {
  return (
    <View style={styles.container}>
      <Image source={items.image} resizeMode="contain" style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{items.title}</Text>
        <Text style={styles.description}>{items.description}</Text>
      </View>
      <View style={styles.button}>{items.id == 4 ? <Getstart navigation={navigation}/> : <></>}</View>
    </View>
  );
};

export default SliderItems;

const styles = StyleSheet.create({
  container: {
    width,
    height,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  image: {
    flex: 0.8,
    width: "100%",
  },
  content: {
    flex: 0.4,
    alignItems: "center",
    width: "80%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  description: {
    fontSize: 18,
    marginVertical: 20,
    color: "#333",
    textAlign: "center",
  },
  button: {
    flex: 0.5,
  },
});
