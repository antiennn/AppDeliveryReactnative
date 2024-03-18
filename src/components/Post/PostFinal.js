import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { TruckFast, Truck, Warning2, ArrowLeft2 } from "iconsax-react-native";
import Icon from "../../assets/icon/icon";
import { categories } from "../../assets/data";

const PostFinal = ({ navigation, route }) => {
  const [name, setname] = useState();
  const [weight, setweight] = useState();
  const [security, setsecurity] = useState(false);
  const [category, setcategory] = useState();
  const [option, setoption] = useState();
  const { post } = route.params;
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

  const handleNext = () => {
    if (!security) {
      Alert.alert("Please sure about your consignment is security");
      return;
    }
    if (!option) {
      Alert.alert("Please choose delivery option");
      return;
    }
    if (!name || !weight || !category) {
      Alert.alert("Please give product details");
      return;
    }
    navigation.navigate("Price", {
      post: {
        ...post,
        option: option,
        namepost: name,
        weight: weight,
        category: category,
      },
    });
  };
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      automaticallyAdjustKeyboardInsets={true}
    >
      <View style={styles.deliveryoption}>
        <Text style={styles.title}>Delivery Option</Text>
        <View style={styles.deliveryoptionclist}>
          <TouchableOpacity
            onPress={() => {
              setoption("express");
            }}
            style={[
              styles.deliveryoptionchoice,
              option == "express"
                ? { backgroundColor: "black" }
                : { backgroundColor: "white" },
            ]}
          >
            <TruckFast
              size="24"
              color={option == "express" ? "white" : "black"}
            />
            <Text
              style={[
                { fontSize: 16 },
                option == "express" ? { color: "white" } : { color: "black" },
              ]}
            >
              Express Delivery
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setoption("normal");
            }}
            style={[
              styles.deliveryoptionchoice,
              option == "normal"
                ? { backgroundColor: "black" }
                : { backgroundColor: "white" },
            ]}
          >
            <Truck size="24" color={option == "normal" ? "white" : "black"} />
            <Text
              style={[
                { fontSize: 16 },
                option == "normal" ? { color: "white" } : { color: "black" },
              ]}
            >
              Normal Delivery
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.warning}>
          <Warning2 size="22" color="#f07723" />
          <Text style={{ color: "#f07723", fontSize: 12 }}>
            Express delivery charge extra 10% cost
          </Text>
        </View>
      </View>
      <View style={styles.deliveryoption}>
        <Text style={styles.title}>Product Details</Text>
        <View
          style={[
            styles.deliveryoptionclist,
            {
              flexDirection: "column",
              backgroundColor: "white",
              justifyContent: "center",
              gap: 20,
              height: 200,
              borderRadius: 20,
            },
          ]}
        >
          <View style={styles.inputlabel}>
            <Icon name="edit" />
            <TextInput
              style={styles.input}
              placeholderTextColor="gray"
              placeholder="Product name"
              value={name}
              onChangeText={(t) => setname(t)}
            />
          </View>
          <View style={styles.inputlabel}>
            <Icon name="box" />
            <TextInput
              style={styles.input}
              placeholderTextColor="gray"
              placeholder="Approx weight"
              value={weight}
              onChangeText={(t) => setweight(t)}
            />
          </View>
        </View>
      </View>
      <View style={styles.deliveryoption}>
        <Text style={styles.title}>Categories</Text>
        <Text style={{ color: "gray", fontSize: 16 }}>
          What are you sending?
        </Text>
        <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap" }}>
          {categories.map((c, idx) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setcategory(c.type);
                }}
                style={[
                  styles.categories,
                  category == c.type
                    ? { backgroundColor: "#5e46a3" }
                    : { backgroundColor: "white" },
                ]}
                key={idx.toString()}
              >
                <Text
                  style={
                    category == c.type ? { color: "white" } : { color: "black" }
                  }
                >
                  {c.type}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      <View style={styles.deliveryoption}>
        <Text style={styles.title}>Conditions</Text>
        <TouchableOpacity
          onPress={() => {
            setsecurity(!security);
          }}
          style={styles.chooselabel}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              borderWidth: 2,
              height: 25,
              width: 25,
            }}
          >
            <View
              style={[
                {
                  borderRadius: "50%",
                  height: "70%",
                  width: "70%",
                },
                security
                  ? { backgroundColor: "#5e46a3" }
                  : { backgroundColor: "#fff" },
              ]}
            ></View>
          </View>
          <Icon name="boxtick" />
          <Text style={{ fontSize: 16 }}>No prohibited items</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={{
          width: "90%",
          borderRadius: 30,
          backgroundColor: "#f07723",
          padding: 15,
          marginBottom: 50,
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 7,
          },
          shadowOpacity: 0.43,
          shadowRadius: 9.51,

          elevation: 15,
        }}
        onPress={handleNext}
      >
        <Text style={{ color: "#fff", fontSize: 20 }}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PostFinal;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#f5f5f5",
    gap: 20,
  },
  deliveryoption: {
    width: "90%",
    gap: 10,
  },
  title: {
    fontWeight: "600",
    fontSize: 22,
    color: "#5e46a3",
  },
  deliveryoptionclist: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,

    elevation: 15,
    width: "100%",
    height: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deliveryoptionchoice: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,

    elevation: 15,
    width: "45%",
    height: "100%",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  warning: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  inputlabel: {
    width: "90%",
    height: 60,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    flexDirection: "row",
    padding: 20,
    alignItems: "center",
  },
  input: {
    fontSize: 18,
    color: "#000",
    borderLeftWidth: 1,
    borderLeftColor: "gray",
    paddingLeft: 10,
    marginLeft: 15,
  },
  categories: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  chooselabel: {
    width: "100%",
    height: 60,
    backgroundColor: "#fff",
    borderRadius: 10,
    flexDirection: "row",
    padding: 20,
    alignItems: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,

    elevation: 15,
  },
});
