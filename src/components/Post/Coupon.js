import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { ArrowLeft2 } from "iconsax-react-native";
import API, { endpoints } from "../../configs/API";
import react from "react";
const Coupon = ({ navigation, route }) => {
  const { price, post } = route.params;
  const [listCoupon, setlistCoupon] = useState();

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

  react.useEffect(() => {
    const getCoupon = async () => {
      try {
        let coupon = await API.get(endpoints["coupon"]);
        setlistCoupon(coupon.data);
      } catch (error) {}
    };
    getCoupon();
  }, []);
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      automaticallyAdjustKeyboardInsets={true}
    >
      <Text style={{ fontSize: 20, fontWeight: 900 }}>Feartured Coupon</Text>
      {!listCoupon ? (
        <ActivityIndicator />
      ) : (
        listCoupon.map((c, idx) => {
          function calvalid() {
            let today = new Date();
            let startday = new Date(c.start_date);
            let endday = new Date(c.expiration_date);
            if (today > startday && today < endday && price > c.Minimum_price) {
              return true;
            }
            return false;
          }
          return (
            <TouchableOpacity
              key={idx.toString()}
              style={styles.coupon}
              onPress={() => {
                if (calvalid()) {
                  let discount = (price * c.percent_discount) / 100;
                  navigation.navigate("Price", {
                    post: post,
                    discount: discount,
                  });
                }
              }}
            >
              {!calvalid() ? <View style={styles.hidden}></View> : <></>}
              <View style={styles.couponLeftTop}></View>
              <View style={styles.couponLeftBottom}></View>
              <View style={styles.couponRightBottom}></View>
              <View style={styles.couponRightTop}></View>
              <View style={styles.couponLeft}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 900,
                    textTransform: "uppercase",
                    color: "#171717",
                  }}
                >
                  {c.name}
                </Text>
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: 900,
                    textTransform: "uppercase",
                    color: "#e99324",
                  }}
                >
                  Save {c.percent_discount}%
                </Text>
              </View>
              <View style={styles.couponRight}>
                <View style={{ transform: [{ rotate: "-90deg" }], gap: 10 }}>
                  <Text style={styles.couponinfo}>
                    Valid start: {c.start_date}
                  </Text>
                  <Text style={styles.couponinfo}>
                    Valid till: {c.expiration_date}
                  </Text>
                  <Text style={styles.couponinfo}>
                    Min price: {VND.format(c.Minimum_price)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })
      )}
    </ScrollView>
  );
};

export default Coupon;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#f5f5f5",
    gap: 30,
  },
  coupon: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,

    elevation: 15,
    width: "90%",
    height: 150,
    backgroundColor: "#d3262c",
    flexDirection: "row",
  },
  couponLeft: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
  },
  couponRight: {
    width: "40%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e99324",
  },
  couponinfo: {
    fontSize: 12,
  },
  hidden: {
    position: "absolute",
    zIndex: 2,
    backgroundColor: "#000",
    width: "100%",
    height: "100%",
    opacity: 0.5,
  },

  couponLeftTop: {
    zIndex: 2,
    position: "absolute",
    top: 0,
    left: 0,
    height: 25,
    width: 25,
    borderBottomRightRadius: 12.5,
    backgroundColor: "#f5f5f5",
  },
  couponLeftBottom: {
    zIndex: 2,
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 25,
    width: 25,
    borderTopRightRadius: 12.5,
    backgroundColor: "#f5f5f5",
  },
  couponRightBottom: {
    zIndex: 2,
    position: "absolute",
    bottom: 0,
    right: 0,
    height: 25,
    width: 25,
    borderTopLeftRadius: 12.5,
    backgroundColor: "#f5f5f5",
  },
  couponRightTop: {
    zIndex: 2,
    position: "absolute",
    top: 0,
    right: 0,
    height: 25,
    width: 25,
    borderBottomLeftRadius: 12.5,
    backgroundColor: "#f5f5f5",
  },
});
