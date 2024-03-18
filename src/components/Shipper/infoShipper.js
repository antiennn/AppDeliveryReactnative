import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import MyContext from "../../configs/MyContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi, endpoints } from "../../configs/API";
import { Star1,Logout } from "iconsax-react-native";
import moment from "moment";

const InfoShipper = ({navigation}) => {
  const [user, dispatch] = useContext(MyContext);
  const [rate, setrate] = useState();

  useEffect(() => {
    const getrate = async () => {
      let token = await AsyncStorage.getItem("access-token");
      let res = await authApi(token).get(endpoints.rate(user.id));
      setrate(res.data);
    };
    getrate();
  }, []);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.info}>
        <TouchableOpacity onPress={()=>{
          Alert.alert(
            "Warning",
            "Are you sure to log out?",
            [
              {
                text: "Yes",
                onPress:  async() => {
                  await AsyncStorage.clear();
                  navigation.navigate("Login")
                },
              },
              {
                text: "Cancel",
                style: "cancel",
              },
            ],
            { cancelable: false }
          );
        }} style={{position:"absolute",right:0,borderRadius:"50%",backgroundColor:"#5e46a3",padding:10}}>
          <Logout size="32" color="#fff"/>
        </TouchableOpacity>
        <Image
          source={{ uri: user.avatar }}
          style={styles.img}
          resizeMode="cover"
        />
        <View style={{ gap: 5 }}>
          <Text style={{ fontSize: 24, fontWeight: 700 }}>{user.username}</Text>
          <Text style={{ fontSize: 16 }}>
            {rate ? rate.length : 0} Nhận xét
          </Text>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={{ fontSize: 20, fontWeight: 700, padding: 20 }}>
          Comment
        </Text>
        {!rate ? (
          <ActivityIndicator/>
        ) : (
          <View style={{gap:20}}>
            {rate.map((r, idx) => {
              return (
                <View
                  key={idx}
                  style={{
                    padding: 10,
                    backgroundColor: "rgba(0,0,0,0.2)",
                    borderRadius: 10,
                    gap: 10,
                    minHeight: 200,
                  }}
                >
                  <View style={{ flexDirection: "row", gap: 20 }}>
                    <Text
                      style={{
                        position: "absolute",
                        right: 10,
                        top: 5,
                        fontWeight: 500,
                        textTransform: "capitalize",
                      }}
                    >
                      {moment(r.created_date).fromNow()}
                    </Text>
                    <Image
                      style={{ width: 60, height: 60, borderRadius: 35 }}
                      source={{ uri: r.customer.avatar }}
                    />
                    <View style={{ gap: 10 }}>
                      <Text style={{ fontSize: 16, fontWeight: 600 }}>
                        {r.customer.username}
                      </Text>
                      <View style={{ flexDirection: "row", gap: 5 }}>
                        {Array(r.rate)
                          .fill(1)
                          .concat(Array(5 - r.rate).fill(0))
                          .map((s, idx) => {
                            return (
                              <Star1
                                key={idx}
                                size="16"
                                color={
                                  Array(r.rate)
                                    .fill(1)
                                    .concat(Array(5 - r.rate).fill(0))[idx] == 0
                                    ? "#000"
                                    : "#FF8A65"
                                }
                                variant="Bold"
                              />
                            );
                          })}
                      </View>
                    </View>
                  </View>
                  <View>
                    <Text>{r.comment}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default InfoShipper;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flexGrow: 1,
    backgroundColor: "#fff",
    display: "flex",
    alignItems: "center",
    gap: 10,
    paddingTop: 40,
    width: "100%",
  },
  info: {
    position:"relative",
    marginTop: 20,
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  img: {
    height: 80,
    width: 80,
    borderRadius: 40,
  },
  content: {
    width: "90%",
  },
});
