import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert
} from "react-native";
import React, { useState } from "react";
import styles from "./styles";
import Input from "./input";

const Registerstep2 = ({ navigation, route }) => {
  const {usererr} = route.params;
  const { role } = route.params;
  const [validatedUser, setValidatedUser] = useState({
    email: false,
    first_name: false,
    last_name: false,
    username: false,
    password: false,
    phone: false,
    identity_number:role=="Shipper"?false:true
  });

  const [user, setUser] = useState({
    email: usererr?usererr.email:"",
    first_name: usererr?usererr.first_name:"",
    last_name: usererr?usererr.last_name:"",
    username: usererr?usererr.username:"",
    password: usererr?usererr.password:"",
    phone: usererr?usererr.phone:"",
    confirm_password: "",
    identity_number:usererr?usererr.identity_number:"",
    role: role,
  });
  const handlevalidatedUser = (field, status) => {
    setValidatedUser((current) => {
      return { ...current, [field]: status };
    });
  };
  const changeUser = (field, value) => {
    setUser((current) => {
      return { ...current, [field]: value };
    });
  };
  const handleSubbmit = () =>{
    if(user.confirm_password != user.password){
      Alert.alert("Error infomation", "Password is not matching")
        return
    }
    for (let key in validatedUser) {
      if (!validatedUser[key]) {
        Alert.alert("Error infomation", "You need to fill in all information")
        return
      }
    }
    navigation.navigate("Step3", { user: user })
  }
  return (
    <ScrollView
      contentContainerStyle={stylesRegister.container}
      automaticallyAdjustKeyboardInsets={true}
    >
      <View style={stylesRegister.content}>
        <Text style={styles.headertext}>Sign up</Text>
        <Input
          id="email"
          name="email"
          placeholder="Email"
          type="email"
          check={handlevalidatedUser}
          get={changeUser}
        />
        {validatedUser.email ? (
          <></>
        ) : (
          <Text style={stylesRegister.error}>
            Please check again your email
          </Text>
        )}
        <Input
          id="username"
          name="user"
          placeholder="Username"
          check={handlevalidatedUser}
          get={changeUser}
        />
        {
          usererr?<Text style={stylesRegister.error}>Your username have been use</Text>:<></>
        }
        {validatedUser.username ? (
          <></>
        ) : (
          <Text style={stylesRegister.error}>Please fill your username</Text>
        )}
        <Input
          id="first_name"
          name="infouser"
          placeholder="First name"
          check={handlevalidatedUser}
          get={changeUser}
        />
        {validatedUser.first_name ? (
          <></>
        ) : (
          <Text style={stylesRegister.error}>Please fill your first name</Text>
        )}
        <Input
          id="last_name"
          name="infouser"
          check={handlevalidatedUser}
          placeholder="Last name"
          get={changeUser}
        />
        {validatedUser.last_name ? (
          <></>
        ) : (
          <Text style={stylesRegister.error}>Please fill your last name</Text>
        )}
        <Input
          id="password"
          name="lock"
          check={handlevalidatedUser}
          placeholder="Password"
          type="pass"
          get={changeUser}
        />
        {validatedUser.password ? (
          <></>
        ) : (
          <Text style={stylesRegister.error}>
            The password must be {"\n"}- Eight characters {"\n"}- Including one
            uppercase letter{"\n"}- One special character{"\n"}- Alphanumeric
            characters
          </Text>
        )}
        <Input
          id = "confirm_password"
          name="lock"
          placeholder="Repeat a password"
          check={() => {}}
          get={changeUser}
          type="pass"
        />
        {user.confirm_password == user.password ? (
          <></>
        ) : (
          <Text style={stylesRegister.error}>
            Password is not matching
          </Text>
        )}
        <Input
          id="phone"
          name="call"
          placeholder="phone number"
          check={handlevalidatedUser}
          get={changeUser}
          type="phone"
        />
        {
          validatedUser.phone ? (
            <></>
          ) : (
            <Text style={stylesRegister.error}>
              Phone number is invalid
            </Text>
          )
        }
        {role == "Shipper" ? (
          <Input id="identity_number" check={handlevalidatedUser}
          get={changeUser}
          type="identity_number" name="identitycard" placeholder="identity number" />
          
        ) : (
          <></>
        )}
        {
          validatedUser.identity_number ? (
            <></>
          ) : (
            <Text style={stylesRegister.error}>
              Identity number must have 10 or 12 character
            </Text>
          )
        }
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubbmit}
        >
          <Text style={styles.text}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Registerstep2;

const stylesRegister = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 100,
  },
  content: {
    flex: 0.8,
    width: "80%",
    gap: 15,
  },
  error: {
    marginTop: 20,
    color: "red",
    transform: [{ translateY: -20 }],
  },
});
