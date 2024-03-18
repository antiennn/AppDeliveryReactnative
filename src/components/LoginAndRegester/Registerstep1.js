import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState, useMemo } from "react";
import styles from "./styles";
import RadioGroup from "react-native-radio-buttons-group";
const Registerstep1 = ({ navigation }) => {
  
  const [selectedId, setSelectedId] = useState();
  const radioButtons = useMemo(
    () => [
      {
        id: "Customer",
        label: "Customer",
        value: "Customer",
      },
      {
        id: "Shipper",
        label: "Shipper",
        value: "Shipper",
      },
    ],
    []
  );
  const handleclick = () => {
    !selectedId
      ? Alert.alert("Error user", "You need choose your role")
      : navigation.navigate("Step2",{"role":selectedId});
  };
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require("../../assets/image/welcome.gif")}
        resizeMode="contain"
      />
      <View style={styles.content}>
        <Text style={styles.headertext}>Sign up</Text>
        <View style={styles.sociallabel}>
          <TouchableOpacity style={styles.socialbtn}>
            <Image
              style={styles.logoimg}
              source={require("../../assets/image/icon_google.png")}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialbtn}>
            <Image
              style={styles.logoimg}
              source={require("../../assets/image/icon_facebook.png")}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.switch}>Or, register with...</Text>
        <Text style={stylesRegister.choose}>You are</Text>
        <RadioGroup
          containerStyle={stylesRegister.containerRadio}
          radioButtons={radioButtons}
          onPress={setSelectedId}
          selectedId={selectedId}
        />
        <TouchableOpacity style={styles.button} onPress={handleclick}>
          <Text style={styles.text}>Next</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.switch}>
            Already have an Account{" "}
            <Text style={styles.submitbtn}>Log-in?</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Registerstep1;

const stylesRegister = StyleSheet.create({
  choose: {
    fontSize: 24,
  },
  containerRadio: {
    width: "100%",
    display: "flex",
    alignItems: "flex-start",
  },
});
