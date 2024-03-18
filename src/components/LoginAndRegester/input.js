import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useRef, useState } from "react";
import Icon from "../../assets/icon/icon";

const Input = ({ id,name, placeholder, type ,check,get,value}) => {
  const [text, settext] = useState();
  const [hide, sethide] = useState(type=="pass"?true:false);
  const current = useRef()

  const handlechangletext = (t) => {
    settext(t);
    get(id,t)
    switch (type) {
      case "email":
        reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(t) === false) {
          check(id,false)
        } else {
          check(id,true)
        }
        break
      case "pass": 
        reg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
        if (reg.test(t) === false) {
          check(id,false)
        } else {
          check(id,true)
        }
        break
      case "phone":
        reg = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/
        if (reg.test(t) === false) {
          check(id,false)
        } else {
          check(id,true)
        }
        break
      case "identity_number":
        if (t.length ==10 || t.length == 12) {
          check(id,true)
        } else {
          check(id,false)
        }
        break
      default:
        if(t.trim())
          check(id,true)
        else
          check(id,false)
    }
  };
  return (
    <View>
      <View style={styles.labelinput}>
        <TouchableOpacity onPress={() => current.current.focus()}>
          <Icon name={name} />
        </TouchableOpacity>
        <TextInput
          value={value}
          onChangeText={handlechangletext}
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={"#697689"}
          secureTextEntry={hide}
          ref={current}
          keyboardType={type=="phone" || type=="identity_number"?"phone-pad":"default"}
        />
        {type == "pass" ? (
          <TouchableOpacity
            onPress={() => {sethide(!hide)}}
            style={styles.labeleye}
          >
            {hide ? (
              <Icon name={"eye"}></Icon>
            ) : (
              <Icon name={"eyeslash"}></Icon>
            )}
          </TouchableOpacity>
        ) : (
          <></>
        )}
      </View>
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  labelinput: {
    position: "relative",
    width: "100%",
    height: 40,
    borderBottomColor: "#697689",
    borderBottomWidth: 2,
  },
  icon: {
    position: "absolute",
    left: 0,
    top: 0,
  },
  input: {
    position: "absolute",
    left: 50,
    fontSize: 16,
    color: "#697689",
    width: "80%",
  },
  labeleye: {
    position: "absolute",
    right: 0,
    top: 0,
  },
});
