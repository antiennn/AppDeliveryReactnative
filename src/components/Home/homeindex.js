import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import * as Location from "expo-location";
import MyContext from "../../configs/MyContext";
import stylesHome from "./stylesHome";
import Icon from "../../assets/icon/icon";
import axios from "axios";
import { coupon } from "../../assets/data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi, endpoints } from "../../configs/API";

const Homeindex = ({ navigation,route }) => {
  const [refreshing, setRefreshing] = useState(true);
  const [location, setLocation] = useState(null);
  const [user, dispatch] = useContext(MyContext);
  const [latitude, setlatitude] = useState(null);
  const [longitude, setlongitude] = useState(null);
  const [newpost,setnewpost] = useState(null)

  const onRefresh = () => {
    setRefreshing(true);
  };

  useEffect(() => {
    if (refreshing == false) {
      return;
    }
    const getperm = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setlatitude(location.coords.latitude);
      setlongitude(location.coords.longitude);
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.coords.latitude}&lon=${location.coords.longitude}`
        );
        setLocation(response.data.display_name);
      } catch (error) {
        console.log(error);
      }
    };
    const getnewpost = async () =>{
      let token = await AsyncStorage.getItem("access-token");
      let res = await authApi(token).get(
        endpoints["newest"]
      );
      setnewpost(res.data)
      setRefreshing(false);
    }
    getperm();
    getnewpost();
  }, [refreshing]);

  return (
    <ScrollView contentContainerStyle={[stylesHome.container, { backgroundColor: "#f5f5f5",flexGrow:1}]}
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }
    >
      <View style={stylesHome.header}>
        <View style={stylesHome.headertop}>
          <View style={stylesHome.labelava}>
            <Image
              source={{ uri: user.avatar }}
              style={stylesHome.avatar}
              resizeMode="cover"
            />
          </View>
          <View style={{ marginTop: 5, gap: 10, width: "55%" }}>
            <View style={stylesHome.titlelocation}>
              <Icon name="location" />
              <Text style={{ color: "white", fontWeight: 200, fontSize: 14 }}>
                Your location
              </Text>
            </View>
            <Text style={stylesHome.location}>
              {location ? location : "Not Found"}
            </Text>
          </View>
          <TouchableOpacity onPress={()=>{navigation.navigate("Notification")}} style={stylesHome.labelnotification}>
            <Icon name="notification" />
          </TouchableOpacity>
        </View>
        <View style={stylesHome.headerbottom}>
          <Icon name="search" />
          <TextInput placeholderTextColor={"black"} placeholder="Enter the receipt number" />
          <View style={stylesHome.labelscan}>
            <Icon name="scan" />
          </View>
        </View>
      </View>
      <View style={stylesHome.content}>
        <Text style={stylesHome.labeltracking}>Tracking</Text>
        <View style={stylesHome.dashboard}>
          <View style={stylesHome.dashboardHeader}>
            <Text style={stylesHome.dashboardHeaderTitle}>
              Shippment Number
            </Text>
            <Text style={stylesHome.dashboardHeaderID}>{newpost!=null&&newpost.id?newpost.id:"None"}</Text>
            <Image
              style={stylesHome.dashboardHeaderIcon}
              source={require("../../assets/image/deliverycar.png")}
            />
          </View>
          <View style={stylesHome.dashboardContent}>
            <View style={stylesHome.dashboardContentHorizontal}>
              <View style={stylesHome.dashboardContentHorizontalVertical}>
                <Image
                  style={stylesHome.dashboardContentIcon}
                  source={require("../../assets/image/receivericon.png")}
                />
                <View>
                  <Text style={stylesHome.dashboardContentLeftTitle}>
                    Shipper
                  </Text>
                  <Text style={stylesHome.dashboardContentLeftName}>
                    {newpost!=null && newpost.shipper &&newpost.shipper.usename!=""?newpost.shipper.username:"None"}
                  </Text>
                </View>
              </View>
              <View style={stylesHome.dashboardContentHorizontalVertical}>
                <Image
                  style={stylesHome.dashboardContentIcon}
                  source={require("../../assets/image/sendericon.png")}
                />
                <View>
                  <Text style={stylesHome.dashboardContentLeftTitle}>
                    Receiver
                  </Text>
                  <Text style={stylesHome.dashboardContentLeftName}>
                  {newpost!=null&&newpost.nameReceiver!=""?newpost.nameReceiver:"None"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={stylesHome.dashboardContentHorizontal}>
              <View style={stylesHome.dashboardContentHorizontalVertical}>
                <View>
                  <Text style={stylesHome.dashboardContentLeftTitle}>Distance</Text>
                  <Text style={stylesHome.dashboardContentLeftName}>
                    {newpost!=null&&newpost.distance?`${newpost.distance} km`:"None"}
                  </Text>
                </View>
              </View>
              <View style={stylesHome.dashboardContentHorizontalVertical}>
                <View>
                  <Text style={stylesHome.dashboardContentLeftTitle}>
                    status
                  </Text>
                  <Text style={stylesHome.dashboardContentLeftName}>
                  {newpost!=null&&newpost.status?newpost.status:"None"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={stylesHome.post}
            onPress={() => {
              location
                ? navigation.navigate("HomeMap", {
                    latitude: latitude,
                    longitude: longitude,
                  })
                : Alert.alert("You need to allow app get location");
            }}
          >
            <Text style={{ fontSize: 20, color: "#f07723", fontWeight: 700 }}>
              + Add Order
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={stylesHome.coupon}>
        <Text style={{ fontSize: 20 }}>Coupon</Text>
        <View style={stylesHome.listcoupon}>
          <FlatList
            contentContainerStyle={{ gap:20}}
            data={coupon}
            renderItem={({ item }) => (
              <Image
                source={item.image}
                resizeMode="contain"
                style={{ flex: 1,borderRadius:10}}
              />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default Homeindex;
