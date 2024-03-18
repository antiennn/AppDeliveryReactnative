import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import styles from "./styles";
import * as ImagePicker from "expo-image-picker";
import API, { endpoints } from "../../configs/API";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Registerstep3 = ({ navigation, route }) => {
  const { user } = route.params;
  const [done, setdone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatar, setavatar] = useState(
    require("../../assets/image/avatar.png")
  );
  const [finaluser, setfinaluser] = useState(user);
  const picker = async () => {
    let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission Denied!");
    } else {
      let res = await ImagePicker.launchImageLibraryAsync();
      if (!res.canceled) {
        setavatar(res.assets[0]);
        setdone(true);
        setfinaluser({ ...finaluser, image: res.assets[0] });
      }
    }
  };
  const register = async () => {
    if (!done) {
      Alert.alert("image invalid", "Please choose your image");
    }
    setLoading(true);
    if (user.role == "Customer") {
      const { identity_number, confirm_password, ...tempuser } = finaluser;
      setfinaluser(tempuser);
    }
    const form = new FormData();
    for (let key in finaluser)
      if (key === "image") {
        form.append(key, {
          uri: finaluser[key].uri,
          name: finaluser[key].fileName,
          type: finaluser[key].type,
        });
      } else {
        form.append(key, finaluser[key]);
      }
    try {
      let res = await API.post(endpoints["register"], form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.info(res.data);
      await AsyncStorage.setItem(
        'username',
        res.data.username,
      );
      navigation.navigate("Login");
    } catch (ex) {
      Alert.alert("Your username have been use", "Please change your username");
      navigation.navigate("Step2",{"role":user.role,"usererr":user});
      console.log(ex);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.headertext}>Choose your image</Text>
        <TouchableOpacity style={stylesRegister.labelavatar} onPress={picker}>
          <Image
            style={stylesRegister.avatar}
            source={avatar}
            resizeMode="contain"
          />
        </TouchableOpacity>
        {loading===true?<ActivityIndicator />:
        <TouchableOpacity style={styles.button} onPress={register}>
          <Text style={styles.text}>Save</Text>
        </TouchableOpacity>}
      </View>
    </View>
  );
};

export default Registerstep3;

const stylesRegister = StyleSheet.create({
  avatar: {
    width: "100%",
  },
  labelavatar: {
    overflow: "hidden",
    width: 300,
    height: 300,
    borderRadius: 150,
    borderColor: "#000",
    borderWidth: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
