import {
  StyleSheet,
  Text,
  View,
  SrollView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  RefreshControl,
  Alert,
} from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API, { authApi, endpoints } from "../../configs/API";
import { ScrollView } from "react-native-gesture-handler";
import moment from "moment";
import MapView, { BingMapsProvider, Marker } from "react-native-maps";
import {
  Judge,CloseCircle,Note,Moneys,
} from "iconsax-react-native";

const MyAuction = () => {
  const [auction, setauction] = useState(null);
  const API_key =
  "AiG0p7k1VuqiubVqZ22aZXS6HEih9Yg95wRzucCj_gRvT0HeaMMuanyX13L4qGfd";
  const [postisauctioning, setpostisauctioning] = useState(null);
  const [value, setvalue] = useState(null);
  const [comment,setComment] = useState(null)
  const [refreshing, setRefreshing] = useState(true);

  const VND = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  const handle = (a,b,c) => {
    setpostisauctioning(a);
    setvalue(b)
    setComment(c)
  };
  const  onRefresh = () => {
    setRefreshing(true)
  }
  React.useEffect(() => {
    if(refreshing==false){
      return;
    }
    const getmyauction = async () => {
      try {
        const value = await AsyncStorage.getItem("access-token");
        const response = await authApi(value).get(endpoints["myauction"]);
        setauction(response.data);
        setRefreshing(false)
      } catch (error) {
        console.log(error);
      }
    };
    getmyauction();
    
  }, [refreshing]);
  const handleauction = async () => {
    try {
      let token = await AsyncStorage.getItem("access-token");
      let res = await authApi(token).patch(
        endpoints["updateauction"](postisauctioning),
        {
          comment: comment,
          Price_auction:value
        }
      );
      setpostisauctioning(null)
      setRefreshing(true)
    } catch (ex) {
      console.error(ex);
    }
  }
  return (
    <ScrollView
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
    }
     contentContainerStyle={styles.container}>
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
                value={value?value.toString():value}
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
      <Text style={styles.title}>My Auction</Text>
        {!auction ? (
          <Text>You don't have any shipping orders yet</Text>
        ) : (
          auction.map((a, idx) => {
            return (
              <View key={idx.toString()} style={styles.post}>
                <TouchableOpacity onPress={()=>{
                  if(a.post.status!="auctioning"){
                    Alert.alert("Error","This delivery can't delete, for information please call admin")
                    return
                  }
                  Alert.alert(
                    "Delete",
                    "Are you sure you want to delete this auction?",
                    [
                      { 
                        text: "Yes", 
                        onPress: async () => {
                          let token = await AsyncStorage.getItem("access-token");
                          let res = await authApi(token).delete(
                            endpoints["deleteauction"](a.id)
                          );
                          setRefreshing(true)
                        },
                      },
                      {
                        text: "Cancel",
                        style: "cancel"
                      },
                    ],
                    { cancelable: false }
                  );
                }} style={{position:"absolute",right:20,top:20,zIndex:10}}>
                  <CloseCircle size="37" color="#000" />
                </TouchableOpacity>
                <View style={styles.info}>
                  <Image
                    style={{ width: 50, borderRadius: 25 }}
                    source={{ uri: a.post.customer.avatar }}
                  />
                  <View style={{ gap: 10 }}>
                    <Text>{a.post.customer.username}</Text>
                    <Text>{moment(a.post.created_date).fromNow()}</Text>
                  </View>
                </View>
                <View style={styles.content}>
                  
                  <Text style={{ fontSize: 16 }}>{a.post.name}</Text>
                  <View style={{ flexDirection: "row", gap: 20 }}>
                    <Text>Weight: {a.post.weight}</Text>
                    <Text>Category: {a.post.category}</Text>
                  </View>
                  <View style={{ flexDirection: "row", gap: 20 }}>
                    <Text>Distance: {a.post.distance} km</Text>
                    <Text>Price: {VND.format(a.post.price)}</Text>
                  </View>
                  <Text>Status: {a.post.status}</Text>
                  <Text>From:</Text>
                  <MapView
                    scrollEnabled={false}
                    provider={BingMapsProvider}
                    apiKey={API_key}
                    style={{
                      height:300,
                      borderRadius: 10,
                      borderWidth: 3,
                      borderColor: "#000",
                    }}
                    region={{
                      latitude: a.post.fromLatitude,
                      longitude: a.post.fromLongitude,
                      latitudeDelta: 0.005,
                      longitudeDelta: 0.005,
                    }}
                  >
                    <Marker
                      coordinate={{
                        latitude: a.post.fromLatitude,
                        longitude: a.post.fromLongitude,
                      }}
                      title="Home"
                      description="Marker Description"
                    />
                  </MapView>
                  <Text>Apartment number: {a.post.apartmentNumber}</Text>
                  <Text>Reicerver: {a.post.address}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    if(a.post.status!="auctioning"){
                      Alert.alert(
                        "Warning",
                        "Are you sure you want to confirm complete this post?",
                        [
                          { 
                            text: "Yes", 
                            onPress: async () => {
                              console.log(a.post.id)
                              let token = await AsyncStorage.getItem("access-token");
                              let res = await authApi(token).post(
                                endpoints["complete_delivery"],{id:a.post.id}
                              );
                              if(res.status==200){
                                console.log(res.data)
                                setRefreshing(true)
                              }
                            },
                          },
                          {
                            text: "Cancel",
                            style: "cancel"
                          },
                        ],
                        { cancelable: false }
                      );
                      return
                    }
                    handle(a.id,a.Price_auction,a.comment);
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
                  {a.post.status!="auction"?<></>:<Judge size="28" color="#000" />}
                  <Text style={{ color: "#000", fontSize: 20,fontWeight:"600" }}>{a.post.status!="auctioning"?"Complete":"Re-auction"}</Text>
                </TouchableOpacity>
                <Text style={{fontSize:20,color:"#5e46a3",fontWeight:"600"}}>{a.post.status!="auction"?"You will get":"Your Auction"}</Text>
                <Text>Your price auction: {VND.format(a.Price_auction)}</Text>
                <Text>Your note: {a.comment}</Text>
              </View>
            );
          })
        )}
    </ScrollView>
  );
};

export default MyAuction;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flexGrow: 1,
    backgroundColor: "#fff",
    display: "flex",
    alignItems: "center",
    gap:20,
    paddingTop:40
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#f07723",
  },
  post: {
    position:"relative",
    width: "90%",
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: "20%",
    gap: 10,
    marginBottom:20
  },
  info: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    gap: 10,
  },
  content: {
    gap: 20,
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
