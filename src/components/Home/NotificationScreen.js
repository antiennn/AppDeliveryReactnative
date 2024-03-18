import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi, endpoints } from "../../configs/API";
import moment from "moment";

const NotificationScreen = () => {
  const [refreshing, setRefreshing] = useState(true);
  const [notification, setnotification] = useState();

  const onRefresh = () => {
    setRefreshing(true);
  };
  useEffect(() => {
    if (refreshing == false) {
      return;
    }
    const getnotification = async () => {
      let token = await AsyncStorage.getItem("access-token");
      let res = await authApi(token).get(endpoints["notice"]);
      setnotification(res.data);
      setRefreshing(false);
    };
    getnotification();
  }, [refreshing]);
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {!notification ? (
        <Text>You don't have any notification</Text>
      ) : (
        notification.map((n, idx) => {
          return <View key={idx} style={styles.notification}>
            <Image style={{ width: 70, height: 70, borderRadius: 40}} source={{ uri: n.Sender.avatar }}/>
            <View style={{gap:5}}>
                <Text><Text style={{fontWeight:700,fontSize:16}}>{n.Sender.username}</Text> {n.content}</Text>
                <Text>{moment(n.created_date).fromNow()}</Text>
            </View>
          </View>;
        })
      )}
    </ScrollView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    
    width:"100%",
  },
  notification:{
    width:"75%",
    height:100,
    flexDirection:"row",
    alignItems:"center",
    padding:5,
    gap:20,
  }
});
