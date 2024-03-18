import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import stylesHome from "../Home/stylesHome";
import MyContext from "../../configs/MyContext";
import * as Location from "expo-location";
import Icon from "../../assets/icon/icon";
import axios from "axios";
import API, { authApi, endpoints } from "../../configs/API";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ArrowDown2,
  ArrowUp2,
  Judge,
  CloseCircle,
  Moneys,
  Note,
} from "iconsax-react-native";
import SelectDropdown from "react-native-select-dropdown";
import moment from "moment";
import MapView, { BingMapsProvider, Marker } from "react-native-maps";

const HomeForShipper = ({navigation}) => {
  const API_key =
    "AiG0p7k1VuqiubVqZ22aZXS6HEih9Yg95wRzucCj_gRvT0HeaMMuanyX13L4qGfd";
  const [location, setLocation] = useState(null);
  const [user, dispatch] = useContext(MyContext);
  const [latitude, setlatitude] = useState(null);
  const [longitude, setlongitude] = useState(null);
  const [post, setpost] = useState();
  const [postisauctioning, setpostisauctioning] = useState(null);
  const [value, setvalue] = useState(null);
  const [comment,setComment] = useState(null)

  const VND = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  const countries = ["All", "Near You"];
  useEffect(() => {
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
    const getpost = async () => {
      try {
        const value = await AsyncStorage.getItem("access-token");
        const response = await authApi(value).get(endpoints["getpost"]);
        setpost(response.data);
    
      } catch (error) {
        console.log(error);
      }
    };
    getpost();
    getperm();
  }, []);

  const handle = (p) => {
    setpostisauctioning(p);
  };
  const handleauction = async () => {
    try {
      let token = await AsyncStorage.getItem("access-token");
      
      let res = await authApi(token).post(
        endpoints["auction"](postisauctioning.id),
        {
          comment: comment,
          price_auction:value
        }
      );
      setpostisauctioning(null)
    } catch (ex) {
      Alert.alert("Error","You have bit this order")
      setpostisauctioning(null)
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Modal transparent={true} visible={postisauctioning ? true : false}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#000000AA",
          }}
        >
          <View style={styles.modal}>
            <TouchableOpacity
              style={{ position: "absolute", top: 10, right: 10 }}
              onPress={() => setpostisauctioning(null)}
            >
              <CloseCircle size="32" color="#000" />
            </TouchableOpacity>
            <Text style={{ fontSize: 24 }}>Auction</Text>
            <View
              style={{
                backgroundColor: "#f5f5f5",
                width: "90%",
                height: 40,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                gap: 20,
                padding: 5,
                borderRadius: "10%",
              }}
            >
              <Note size="32" color="gray"/>
              <TextInput
                value={comment}
                onChangeText={(c) => setComment(c)}
                style={{ width: "70%" }}
                placeholder="Note"
                placeholderTextColor={"black"}
              />
            </View>
            <View
              style={{
                backgroundColor: "#f5f5f5",
                width: "90%",
                height: 40,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                gap: 20,
                padding: 5,
                borderRadius: "10%",
              }}
            >
              <Moneys size="32" color="gray" />
              <TextInput
                value={value}
                onChangeText={(t) => setvalue(t)}
                keyboardType="number-pad"
                style={{ width: "60%" }}
                placeholder="Your price to delivery"
                placeholderTextColor={"black"}
              />
              <Text>đ</Text>
            </View>
            <Text style={{ fontSize: 16 }}>You bid on this delivery for:</Text>
            <Text style={{ fontSize: 20, padding: 10 }}>
              {VND.format(value)}
            </Text>
            <TouchableOpacity
              onPress={handleauction}
              style={{
                width: "50%",
                borderRadius: "10%",
                padding: 10,
                backgroundColor: "#f07723",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 16, color: "#fff" }}>Send request</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={[stylesHome.header]}>
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
          <TouchableOpacity onPress={()=>{navigation.navigate("Announcement")}} style={stylesHome.labelnotification}>
            <Icon name="notification" />
          </TouchableOpacity>
        </View>
        <SelectDropdown
          renderDropdownIcon={(isOpened) => {
            return isOpened ? (
              <ArrowUp2 size="32" color="#000" />
            ) : (
              <ArrowDown2 size="32" color="#000" />
            );
          }}
          data={countries}
          defaultButtonText={"All"}
          buttonStyle={styles.dropdown4BtnStyle}
          onSelect={async (selectedItem) => {
            const value = await AsyncStorage.getItem("access-token");
            if(selectedItem=="Near You"){
              const response = await authApi(value).get(endpoints.getpostnearyou({latitude,longitude}));
              setpost(response.data);
            }else{
              const response = await authApi(value).get(endpoints["getpost"]);
              setpost(response.data);
            }
          }}
          rowTextStyle={styles.dropdown4RowTxtStyle}
          rowStyle={styles.dropdown4RowStyle}
        />
      </View>

      <View style={[stylesHome.content, { marginBottom: 50 }]}>
        {!post ? (
          <ActivityIndicator />
        ) : (
          post.map((p, idx) => {
            return (
              <View key={idx.toString()} style={styles.post}>
                <View style={styles.info}>
                  <Image
                    style={{ width: 50, borderRadius: 25 }}
                    source={{ uri: p.customer.avatar }}
                  />
                  <View style={{ gap: 10 }}>
                    <Text>{p.customer.username}</Text>
                    <Text>{moment(p.created_date).fromNow()}</Text>
                  </View>
                </View>
                <View style={styles.content}>
                  <Text style={{ fontSize: 16 }}>{p.name}</Text>
                  <View style={{ flexDirection: "row", gap: 20 }}>
                    <Text>Weight: {p.weight}</Text>
                    <Text>Category: {p.category}</Text>
                  </View>
                  <View style={{ flexDirection: "row", gap: 20 }}>
                    <Text>Distance: {p.distance} km</Text>
                    <Text>Price: {VND.format(p.price)}</Text>
                  </View>
                  <Text>From:</Text>
                  <MapView
                    scrollEnabled={false}
                    provider={BingMapsProvider}
                    apiKey={API_key}
                    style={{
                      flex: 1,
                      borderRadius: 10,
                      borderWidth: 3,
                      borderColor: "#000",
                    }}
                    region={{
                      latitude: p.fromLatitude,
                      longitude: p.fromLongitude,
                      latitudeDelta: 0.005,
                      longitudeDelta: 0.005,
                    }}
                  >
                    <Marker
                      coordinate={{
                        latitude: p.fromLatitude,
                        longitude: p.fromLongitude,
                      }}
                      title="Home"
                      description="Marker Description"
                    />
                  </MapView>
                  <Text>Reicerver: {p.address}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    handle(p);
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    justifyContent: "center",
                    width: "100%",
                    padding: 10,
                  }}
                >
                  <Judge size="28" color="#000" />
                  <Text style={{ color: "#000", fontSize: 20 }}>Auction</Text>
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
};

export default HomeForShipper;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flexGrow: 1,
    backgroundColor: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  post: {
    width: "100%",
    height: 600,
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: "20%",
    gap: 10,
  },
  dropdown4BtnStyle: {
    margin:"10%",
    width: "80%",
    height: 50,
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#444",
    marginVertical: 10,
  },
  dropdown4RowStyle: {
    backgroundColor: "#EFEFEF",
    borderBottomColor: "#C5C5C5",
  },
  dropdown4RowTxtStyle: { color: "#444", textAlign: "left" },
  info: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    gap: 10,
  },
  content: {
    height: "80%",
    gap: 10,
  },
  modal: {
    height: 350,
    width: "80%",
    borderRadius: 20,
    padding: 16,
    backgroundColor: "white",
    alignItems: "center",
    gap: 20,
    marginBottom: 90,
  },
});
