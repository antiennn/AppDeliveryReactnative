import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import {
  ArrowLeft2,
  Bank,
  EmptyWallet,
  Ticket2,
  ArrowRight2,
} from "iconsax-react-native";
import API, { authApi, endpoints } from "../../configs/API";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Price = ({ navigation, route }) => {
  const { post } = route.params;
  const { discount } = route.params;
  const [paymentmethod, setpaymentmethod] = useState("cash");
  const [loading, setloading] = useState(false);
  const total =
    (post.distance * 20000 * (post.option == "express" ? 15 : 5)) / 100 +
    post.distance * 20000 -
    (discount ? discount : 0);
  const VND = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
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
    });
  }, [navigation]);

  const handleCreate = async () => {
    setloading(true);
    try {
      const access_token = await AsyncStorage.getItem("access-token");
      let res = await authApi(access_token).post(endpoints["post"], {
        ...post,
        payment: paymentmethod,
        price: total,
      });
      navigation.navigate("Home")
    } catch (ex) {
      console.log(ex);
      Alert.alert("Create unsuccessfully");
    }
  };
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      automaticallyAdjustKeyboardInsets={true}
    >
      <View style={styles.deliveryoption}>
        <Text style={styles.title}>Price details</Text>
        <View style={styles.list}>
          <View style={styles.detail}>
            <Text style={styles.detailvalue}>
              Driving fee ({post.distance}km)
            </Text>
            <Text style={styles.detailvalue}>
              {VND.format(post.distance * 20000)}
            </Text>
          </View>
          <View style={styles.detail}>
            <Text style={styles.detailvalue}>Occupancy taxes (5%)</Text>
            <Text style={styles.detailvalue}>
              {VND.format(((post.distance * 5) / 100) * 20000)}
            </Text>
          </View>
          {post.option == "express" ? (
            <View style={styles.detail}>
              <Text style={[styles.detailvalue]}>
                Express Delivery Charge (10%)
              </Text>
              <Text style={[styles.detailvalue]}>
                {VND.format(((post.distance * 10) / 100) * 20000)}
              </Text>
            </View>
          ) : (
            <></>
          )}
          {discount ? (
            <View style={styles.detail}>
              <Text style={[styles.detailvalue, { color: "#f07723" }]}>
                Voucher
              </Text>
              <Text style={[styles.detailvalue, { color: "#f07723" }]}>
                -{VND.format(discount)}
              </Text>
            </View>
          ) : (
            <></>
          )}
        </View>
        <View style={styles.detail}>
          <Text style={{ fontSize: 20, fontWeight: "700" }}>Total (VND)</Text>
          <Text style={{ fontSize: 20, fontWeight: "700" }}>
            {VND.format(total)}
          </Text>
        </View>
      </View>
      <View style={styles.deliveryoption}>
        <Text style={styles.title}>Payment method</Text>
        <View style={styles.listpayment}>
          <View style={styles.paymentcontent}>
            <Bank size="24" color="gray" />
            <Text style={{ fontSize: 16 }}>Online payment with vnpay</Text>
            <TouchableOpacity
              onPress={() => {
                setpaymentmethod("online");
              }}
              style={styles.labelclick}
            >
              <View
                style={[
                  {
                    borderRadius: "50%",
                    height: "70%",
                    width: "70%",
                  },
                  paymentmethod == "online"
                    ? { backgroundColor: "green" }
                    : { backgroundColor: "#fff" },
                ]}
              ></View>
            </TouchableOpacity>
          </View>
          <View style={styles.paymentcontent}>
            <EmptyWallet size="24" color="gray" />
            <Text style={{ fontSize: 16 }}>Cash on delivery</Text>
            <TouchableOpacity
              onPress={() => {
                setpaymentmethod("cash");
              }}
              style={styles.labelclick}
            >
              <View
                style={[
                  {
                    borderRadius: "50%",
                    height: "70%",
                    width: "70%",
                  },
                  paymentmethod == "cash"
                    ? { backgroundColor: "green" }
                    : { backgroundColor: "#fff" },
                ]}
              ></View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.deliveryoption}>
        <Text style={styles.title}>Voucher</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Coupon", { price: total, post: post })
          }
          style={styles.labelvoucher}
        >
          <View style={styles.voucherinfo}>
            <Ticket2 size="24" color="#000" />
            <Text>Vouchers</Text>
          </View>
          <View style={styles.voucherinfo}>
            <Text>{discount ? `-${VND.format(discount)}` : 0}</Text>
            <ArrowRight2 size="24" color="#000" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: "100%",
            borderRadius: 30,
            backgroundColor: "#f07723",
            padding: 15,
            alignItems: "center",
          }}
          onPress={handleCreate}
        >
          <Text style={{ color: "#fff", fontSize: 20 }}>place order</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Price;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    gap: 20,
  },
  deliveryoption: {
    width: "100%",
    paddingHorizontal: "5%",
    paddingVertical: 10,
    backgroundColor: "#fff",
    gap: 20,
  },
  title: {
    fontWeight: "600",
    fontSize: 22,
    color: "#000",
  },
  list: {
    gap: 10,
    borderColor: "gray",
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  detail: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
  },
  detailvalue: {
    fontSize: 15,
    fontWeight: "500",
  },
  listpayment: {
    gap: 30,
    height: 100,
  },
  paymentcontent: {
    position: "relative",
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    width: "100%",
  },
  labelclick: {
    position: "absolute",
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    borderWidth: 0.5,
    borderColor: "gray",
    height: 25,
    width: 25,
  },
  labelvoucher: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  voucherinfo: {
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
  },
});
