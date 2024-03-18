import { StyleSheet, Text, TouchableOpacity, ScrollView,View, ActivityIndicator,Image } from "react-native";
import React, { useLayoutEffect,useEffect, useState } from "react";
import { ArrowLeft2,Star1} from "iconsax-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi, endpoints } from "../../configs/API";
import moment from "moment";

const SearchInfo = ({ navigation,route }) => {
  const { shipper } = route.params;
  const [rate, setrate] = useState();

  useEffect(() => {
    const getrate = async () => {
      let token = await AsyncStorage.getItem("access-token");
      let res = await authApi(token).get(endpoints.rate(shipper.id));
      setrate(res.data);
    };
    getrate();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 10,
            }}
          >
            <ArrowLeft2 size="32" color="#fff" />
          </View>
        </TouchableOpacity>
      ),
      title: shipper.username
    });
  }, [navigation]);
  return (
    <ScrollView contentContainerStyle={styles.container}>
        <View style={{width:"90%"}}>
            <Text style={{fontSize:20}}>{rate?rate.length:0} reviews</Text>
        </View>
      {!rate?<ActivityIndicator/>:(
        rate.map((r,idx)=>{
            return(
                <View
                  key={idx}
                  style={{
                    width:"90%",
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
            )
        })
      )}
    </ScrollView>
  );
};

export default SearchInfo;

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
});
