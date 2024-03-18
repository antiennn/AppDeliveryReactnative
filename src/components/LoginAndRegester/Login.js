import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
import Input from "./input";
import styles from "./styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API, { endpoints, authApi } from "../../configs/API";
import MyContext from "../../configs/MyContext";


const Login = ({ navigation }) => {
  const [username, setUsername] = useState();
  const [password, setpassword] = useState();
  const [loading, setLoading] = useState(false);
  const [user, dispatch] = useContext(MyContext);

  React.useEffect(() => {
    const autologin = async () => {
      try {
        // AsyncStorage.clear();
        const value = await AsyncStorage.getItem("access-token");
        if(value){
          let user = await authApi(value).get(
            endpoints["current-user"]
          );
          dispatch({
            type: "login",
            payload: user.data,
          });
          navigation.navigate("Index");
        }
      } catch (error) {
        Alert.alert("Your login session has expired")
      }
    };
    const loadusername = async () => {
      try {
        const value = await AsyncStorage.getItem("username");
        setUsername(value);
      } catch (error) {
        console.log(error);
      }
    };
    autologin();
    loadusername();
  }, []);
  const handleChangeUsername = (field,t) => {
    setUsername(t);
  };
  const handleChangePassword = (field,t) => {
    setpassword(t);
  };
  const handlelogin = async () => {
    setLoading(true);
    try {
      let res = await API.post(endpoints["login"], {
        username: username,
        password: password,
        client_id: "uAZo0gJ92skZSfMZk2oWdVTEVBwlveSzT6mBanOB",
        client_secret:
          "FVRCLKSlg3hOLUfstyhnOZMDyJ7AMU7GXBPnbTbrcm4PTr60jTEaJacVfhFpN7FLWXbVE8An49WkJs49Rjn19nIu6exBUH0Qp11R0j6EKRblABH2A0Rv2f1Fjs10U7aC",
        grant_type: "password",
      });
      await AsyncStorage.setItem("access-token", res.data.access_token);
      let user = await authApi(res.data.access_token).get(
        endpoints["current-user"]
      );
      dispatch({
        type: "login",
        payload: user.data,
      });
      navigation.navigate("Index");
    } catch (ex) {
      Alert.alert("Password or username is not match")
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require("../../assets/image/logo.png")}
        resizeMode="contain"
      />
      <View style={styles.content}>
        <Text style={styles.headertext}>Login</Text>
        <Input
          name="user"
          placeholder="Username"
          check={() => {}}
          get={handleChangeUsername}
          value={username}
        />
        <Input
          name="lock"
          placeholder="Password"
          check={() => {}}
          get={handleChangePassword}
          type="pass"
        />
        {loading ? (
          <ActivityIndicator />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handlelogin}>
            <Text style={styles.text}>Login</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.switch}>Or, login with...</Text>
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
        <TouchableOpacity onPress={() => navigation.navigate("Step1")}>
          <Text style={styles.switch}>
            Don't have an Account <Text style={styles.submitbtn}>Sign-up?</Text>
          </Text>
        </TouchableOpacity>
        
      </View>
    </View>
  );
};

export default Login;
