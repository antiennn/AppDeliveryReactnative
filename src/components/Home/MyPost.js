import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi, endpoints } from "../../configs/API";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { CloseCircle, ArrowRight2, Star1 } from "iconsax-react-native";
import { TextInput } from "react-native-gesture-handler";

const Tab = createMaterialTopTabNavigator();

const VND = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});
const Ordering = ({ navigation }) => {
  const [order, setorder] = useState(null);
  const [refreshing, setRefreshing] = useState(true);
  const onRefresh = () => {
    setRefreshing(true);
  };

  React.useEffect(() => {
    if (refreshing == false) {
      return;
    }
    const getpost = async () => {
      try {
        const value = await AsyncStorage.getItem("access-token");
        const response = await authApi(value).get(endpoints["mypost"]);
        setorder(response.data);
        setRefreshing(false);
      } catch (error) {
        console.log(error);
      }
    };
    getpost();
  }, [refreshing]);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {!order ? (
        <ActivityIndicator />
      ) : (
        order.map((p, idx) => {
          return (
            <View
              key={idx.toString()}
              style={[
                styles.post,
                {
                  borderLeftColor:
                    p.status == "auctioning" ? "#f68b00" : "#1080f1",
                },
              ]}
            >
              <View
                style={[
                  styles.label,
                  {
                    backgroundColor:
                      p.status == "auctioning" ? "#f68b00" : "#1080f1",
                  },
                ]}
              >
                <Text style={{ color: "#fff",textTransform:"capitalize" }}>{p.status}</Text>
              </View>
              <Text style={{ fontSize: 16, fontWeight: "700" }}>{p.name}</Text>
              <Text style={styles.text}>Price: {VND.format(p.price)}</Text>
              <Text style={styles.text}>Distance: {p.distance} km</Text>
              <Text style={styles.text}>Distance: {p.address}</Text>
              <View
                style={{
                  borderTopWidth: 2,
                  borderTopColor: "gray",
                  marginTop: 10,
                }}
              >
                {p.auction.length == 0 ? (
                  <Text style={[{ marginTop: 10 }, styles.text]}>
                    The auction shipper has not been found yet
                  </Text>
                ) : p.status != "auctioning" ? (
                  <View
                    style={{
                      width: "100%",
                      height: 50,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ fontSize: 20, fontWeight: 700 }}>
                      Shipper is shipping
                    </Text>
                  </View>
                ) : (
                  p.auction.map((a, idx) => {
                    return (
                      <TouchableOpacity
                        key={idx}
                        onLongPress={()=>{
                          navigation.navigate("Search",{shipper:a.shipper})
                        }}
                        onPress={() => {
                          Alert.alert(
                            "Accept bidding",
                            "Are you sure you want to accept this auction?",
                            [
                              {
                                text: "Yes",
                                onPress: async () => {
                                  if (p.payment != "online") {
                                    const value = await AsyncStorage.getItem(
                                      "access-token"
                                    );
                                    let res = await authApi(value).post(
                                      endpoints["accept_auction"](p.id),
                                      { id: a.id }
                                    );
                                    if (res.status == 200) {
                                      Alert.alert(
                                        "Confirm successful",
                                        "The shipper is coming to your place to pick up the goods"
                                      );
                                    }
                                    return;
                                  }
                                  let token = await AsyncStorage.getItem(
                                    "access-token"
                                  );
                                  let res = await authApi(token).post(
                                    endpoints["create_payment"],
                                    {
                                      amount: a.Price_auction,
                                      order_info: `${p.customer.username} thanh toán đơn hàng ${a.id}`,
                                    }
                                  );
                                  if (res.data) {
                                    navigation.navigate("Payment", {
                                      link: res.data.payment_url,
                                      post_id: p.id,
                                      auction_id: a.id,
                                    });
                                  }
                                },
                              },
                              {
                                text: "Cancel",
                                style: "cancel",
                              },
                            ],
                            { cancelable: false }
                          );
                        }}
                        style={{
                          width: "100%",
                          flexDirection: "row",
                          gap: 20,
                          marginTop: 10,
                          alignItems: "center",
                        }}
                      >
                        <Image
                          style={{ width: 50, height: 50, borderRadius: 25 }}
                          source={{ uri: a.shipper.avatar }}
                        />
                        <View style={{ gap: 5 }}>
                          <Text style={[{ fontSize: 16 }, styles.text]}>
                            {a.shipper.username}
                          </Text>
                          <Text style={styles.text}>
                            {VND.format(a.Price_auction)}
                          </Text>
                          <Text style={styles.text}>{a.comment}</Text>
                        </View>
                        <ArrowRight2
                          style={{ position: "absolute", right: 10 }}
                          size="32"
                          color="gray"
                        />
                      </TouchableOpacity>
                    );
                  })
                )}
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
};

const Rate = ({p,get}) =>{
  const [rate, setrate] = useState([0, 0, 0, 0, 0]);
  const [comment, setcomment] = useState();
  return(
    
    p.isRate ? (
      <Text style={{fontSize:20,fontWeight:700}}>You have rate this post</Text>
    ) : (
      <View>
        <View
          style={{
            borderTopWidth: 2,
            borderTopColor: "gray",
            marginTop: 10,
            flexDirection: "row",
            gap: 20,
            width: "100%",
            justifyContent: "center",
            paddingTop: 10,
          }}
        >
          {rate.map((s, idx) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setrate(
                    Array(idx + 1)
                      .fill(1)
                      .concat(Array(4 - idx).fill(0))
                  );
                }}
                key={idx}
              >
                <Star1
                  size="32"
                  variant="Bold"
                  color={rate[idx] == 1 ? "#f07723" : "#000"}
                />
              </TouchableOpacity>
            );
          })}
        </View>
        {rate[0] == 0 ? (
          <></>
        ) : (
          <View style={{ gap: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 700 }}>
              Rate your shipping experience?
            </Text>
            <TextInput
              multiline
              numberOfLines={23}
              maxLength={200}
              style={{
                borderRadius: 5,
                padding: 5,
                borderWidth: 1,
                borderColor: "gray",
                height: 100,
              }}
              value={comment}
              onChangeText={(t) => setcomment(t)}
            />
            <View
              style={{
                width: "100%",
                justifyContent: "center",
                gap: 20,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={[
                  styles.btn,
                  { backgroundColor: "rgba(0,0,0,0.2)" },
                ]}
                onPress={() => {
                  setrate([0, 0, 0, 0, 0]);
                }}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#f07723" }]}
                onPress={async () => {
                  let token = await AsyncStorage.getItem(
                    "access-token"
                  );
                  let res = await authApi(token).post(
                    endpoints["postrate"],
                    {
                      id: p.id,
                      rate: rate.lastIndexOf(1) + 1,
                      comment: comment,
                    }
                  );
                  if(res.data){
                    get()
                  }
                }}
              >
                <Text>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    )
  )
  
}

const Finish = () => {
  const [refreshing, setRefreshing] = useState(true);
  const [order, setorder] = useState();
  const onRefresh = () => {
    setRefreshing(true);
  };
  useEffect(() => {
    if (refreshing == false) {
      return;
    }
    const getnewpost = async () => {
      let token = await AsyncStorage.getItem("access-token");
      let res = await authApi(token).get(endpoints["mypostcomplete"]);
      setorder(res.data);
      setRefreshing(false);
    };
    getnewpost();
  }, [refreshing]);
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {!order ? (
        <ActivityIndicator />
      ) : (
        order.map((p, idx) => {
          return (
            <View
              key={idx.toString()}
              style={[
                styles.post,
                {
                  borderLeftColor: "green",
                },
              ]}
            >
              <View
                style={[
                  styles.label,
                  {
                    backgroundColor: "green",
                  },
                ]}
              >
                <Text style={{ color: "#fff",textTransform:"capitalize" }}>{p.status}</Text>
              </View>
              <Text style={{ fontSize: 16, fontWeight: "700" }}>{p.name}</Text>
              <Text style={styles.text}>Price: {VND.format(p.price)}</Text>
              <Text style={styles.text}>Distance: {p.distance} km</Text>
              <Text style={styles.text}>Address: {p.address}</Text>
              <View style={{width:"100%",alignItems:"center"}}>
                <Rate p={p} get={onRefresh}/>
              </View>
            </View>
          );
        })
      )}
      <View style={{height:600}}/>
    </ScrollView>
  );
};

const MyPost = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="On delivery" component={Ordering} />
      <Tab.Screen name="Finish" component={Finish} />
    </Tab.Navigator>
  );
};

export default MyPost;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  post: {
    marginTop: 30,
    borderRadius: 10,
    padding: 20,
    backgroundColor: "#f5f5f5",
    width: "90%",
    position: "relative",
    borderLeftWidth: 5,
    gap: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,

    elevation: 15,
  },
  label: {
    position: "absolute",
    top: -15,
    left: 30,
    paddingHorizontal: 25,
    paddingVertical: 5,
    borderRadius: 20,
  },
  text: {
    color: "gray",
  },
  btn: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
});
