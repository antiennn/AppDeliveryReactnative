import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

const Getstart = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <Text style={styles.text} onPress={() => navigation.navigate("Login")}>
          Get started
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Getstart;

const styles = StyleSheet.create({
  container: {
    borderRadius: 40,
    width: 200,
    height: 50,
    backgroundColor: "#000",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    textTransform: "uppercase",
    fontSize: 18,
    color: "#fff",
  },
});
