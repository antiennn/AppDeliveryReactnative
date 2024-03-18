import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Alert,
  Animated,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import MapView, {
  BingMapsProvider,
  Marker,
  Circle,
  Polyline,
} from "react-native-maps";
import Icon from "../../assets/icon/icon";

const windowWidth = Dimensions.get("window").width;

const HomeMap = ({ navigation, route }) => {
  const [animation] = useState(new Animated.Value(400));
  const textInputRef = useRef(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const API_key =
    "AiG0p7k1VuqiubVqZ22aZXS6HEih9Yg95wRzucCj_gRvT0HeaMMuanyX13L4qGfd";
  const { latitude, longitude } = route.params;
  const [searchQuery, setsearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setsearching] = useState(false);
  const [newLatitude, setnewLatitude] = useState(null);
  const [newLongitude, setnewLongitude] = useState(null);
  const [latitudeDelta, setlatitudeDelta] = useState(0.015);
  const [longitudeDelta, setlongitudeDelta] = useState(0.015);
  const [centerLatitude, setcenterLatitude] = useState(latitude);
  const [centerLongitude, setcenterLongitude] = useState(longitude);
  const [distance,setdistance] = useState()

  const [address, setaddress] = useState(null);
  const [phonereceiver, setphonereceiver] = useState(null);
  const [namereceiver, setnamereiver] = useState(null);
  const handlecomfirm = () => {
    if (!address || !phonereceiver || !namereceiver) {
      Alert.alert("please fill full your receiver information");
      return;
    }
    navigation.navigate("PostFinal", {
      post: {
        startlatitude: latitude,
        startlongitude: longitude,
        endlatitude: newLatitude,
        endlongitude: newLongitude,
        query: searchQuery,
        address: address,
        phonereceiver: phonereceiver,
        namereceiver: namereceiver,
        distance:distance,
      },
    });
  };

  const keyBoardfocus = () => {
    Animated.timing(animation, {
      toValue: -150, // Target value
      duration: 500, // Duration of the animation in milliseconds
      useNativeDriver: true, // Use the native driver for performance
    }).start();
  };
  const keyBoardunfocus = () => {
    Animated.timing(animation, {
      toValue: 100, // Target value
      duration: 500, // Duration of the animation in milliseconds
      useNativeDriver: true, // Use the native driver for performance
    }).start();
  };
  const handleFocus = () => {
    setsearching(true);
  };
  const handleUnFocus = () => {
    setsearching(false);
  };
  const handleFind = async (t) => {
    setsearchQuery(t);
    textInputRef.current.blur();
    setsearching(false);
    try {
      const response = await fetch(
        `https://dev.virtualearth.net/REST/v1/Locations?query=${t}&key=${API_key}`
      );
      const data = await response.json();
      const firstLocation = data.resourceSets[0].resources[0];
      const newlatitude = firstLocation.point.coordinates[0];
      const newlongitude = firstLocation.point.coordinates[1];
      setnewLatitude(newlatitude);
      setnewLongitude(newlongitude);
      setlatitudeDelta(Math.abs(latitude - newlatitude) * 1.5);
      setlongitudeDelta(Math.abs(longitude - newlongitude) * 1.5);
      setcenterLatitude((latitude + newlatitude) / 2);
      setcenterLongitude((longitude + newlongitude) / 2);

      const responsee = await fetch(
        `https://dev.virtualearth.net/REST/v1/Routes/Driving?o=json&wp.0=${latitude},${longitude}&wp.1=${newlatitude},${newlongitude}&key=${API_key}`
      );
      const dataa = await responsee.json();
      if (dataa.statusCode === 200 && dataa.resourceSets.length > 0) {
        setdistance(dataa.resourceSets[0].resources[0].travelDistance)
        const route = dataa.resourceSets[0].resources[0].routeLegs[0].itineraryItems;
        const routePath = route.map((route) => ({
          latitude: route.maneuverPoint.coordinates[0],
          longitude: route.maneuverPoint.coordinates[1],
        }));
        setRouteCoordinates(routePath);
        Animated.timing(animation, {
          toValue: 100, // Target value
          duration: 500, // Duration of the animation in milliseconds
          useNativeDriver: true, // Use the native driver for performance
        }).start();
      }
    } catch (error) {
      console.error("Error searching location:", error);
      Alert.alert(
        "Error",
        "An error occurred while searching for the location. Please try again later."
      );
    }
  };
  const handleQuery = async (t) => {
    setsearchQuery(t);
    if (t == "") {
      return;
    }
    try {
      const response = await fetch(
        `http://dev.virtualearth.net/REST/v1/Autosuggest?query=${t}&key=${API_key}`
      );
      const data = await response.json();
      const suggestion = data.resourceSets[0].resources[0].value.map(
        (a) => a.address.formattedAddress
      );
      setSuggestions(suggestion);
    } catch (error) {
      console.error("Error searching suggestions:", error);
    }
  };
  const animatedStyle = {
    transform: [
      {
        translateY: animation,
      },
    ],
  };
  return (
    <View style={styles.container}>
      <View style={styles.labelsearch}>
        <Icon name="searchmap" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a location"
          value={searchQuery}
          onChangeText={handleQuery}
          onFocus={handleFocus}
          onBlur={handleUnFocus}
          ref={textInputRef}
          placeholderTextColor="black"
        />
        {!searchQuery ? (
          <Icon name="mic" />
        ) : (
          <TouchableOpacity onPress={() => setsearchQuery("")}>
            <Icon name="close" />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.suggestion}>
        {suggestions.length == 0 || searching == false ? (
          <></>
        ) : (
          <>
            {suggestions.map((s, index) => (
              <TouchableOpacity key={index} onPress={() => handleFind(s)}>
                <Text style={styles.txtsugestion}>{s}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}
      </View>
      <MapView
        provider={BingMapsProvider}
        apiKey={API_key}
        style={{ flex: 1 }}
        region={{
          latitude: centerLatitude,
          longitude: centerLongitude,
          latitudeDelta: latitudeDelta,
          longitudeDelta: longitudeDelta,
        }}
      >
        <Marker
          coordinate={{
            latitude: latitude,
            longitude: longitude,
          }}
          title="Home"
          description="Marker Description"
        />
        {newLatitude == null || newLongitude == null ? (
          <></>
        ) : (
          <>
            <Marker
              coordinate={{
                latitude: newLatitude,
                longitude: newLongitude,
              }}
              title="Home"
              description="Marker Description"
            />
          </>
        )}
        {newLatitude == null || newLongitude == null ? (
          <></>
        ) : (
          <>
            <Polyline
              strokeWidth={4}
              strokeColor="#FF0000"
              coordinates={routeCoordinates}
            />
          </>
        )}

        <Circle
          center={{
            latitude: latitude,
            longitude: longitude,
          }}
          radius={1000}
          strokeColor="rgba(0,255,0,0.5)"
          fillColor="rgba(0,255,0,0.2)"
        />
      </MapView>
      <Animated.View style={[styles.modalPost, animatedStyle]}>
        <View style={styles.post}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Address details
          </Text>
          <View style={styles.labelinput}>
            <Icon name="home" />
            <TextInput
              style={styles.input}
              placeholderTextColor="gray"
              placeholder="Floor or unit number"
              onFocus={keyBoardfocus}
              onBlur={keyBoardunfocus}
              value={address}
              onChangeText={(t) => setaddress(t)}
            />
          </View>
          <View style={styles.labelinput}>
            <Icon name="receiver" />
            <TextInput
              style={styles.input}
              placeholderTextColor="gray"
              placeholder="Phone number"
              keyboardType="numeric"
              onFocus={keyBoardfocus}
              onBlur={keyBoardunfocus}
              onChangeText={(t) => setphonereceiver(t)}
              value={phonereceiver}
            />
          </View>
          <View style={styles.labelinput}>
            <Icon name="edit" />
            <TextInput
              style={styles.input}
              placeholderTextColor="gray"
              placeholder="Name"
              onFocus={keyBoardfocus}
              onBlur={keyBoardunfocus}
              value={namereceiver}
              onChangeText={(t) => setnamereiver(t)}
            />
          </View>
          <TouchableOpacity
            onPress={handlecomfirm}
            style={{
              width: "100%",
              alignItems: "center",
              backgroundColor: "#f07723",
              padding: 15,
              borderRadius: 20,
            }}
          >
            <Text style={{ color: "#fff" }}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

export default HomeMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  labelsearch: {
    width: (windowWidth * 90) / 100,
    position: "absolute",
    zIndex: 999,
    top: 50,
    height: 40,
    backgroundColor: "#fff",
    left: (windowWidth - (windowWidth * 90) / 100) / 2,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 15,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  searchInput: {
    width: "70%",
  },
  suggestion: {
    width: (windowWidth * 90) / 100,
    position: "absolute",
    zIndex: 999,
    left: (windowWidth - (windowWidth * 90) / 100) / 2,
    top: 100,
    backgroundColor: "#fff",
  },
  txtsugestion: {
    fontSize: 14,
    borderBottomColor: "gray",
    borderWidth: 1,
    padding: 10,
  },
  modalPost: {
    width: "100%",
    height: "52%",
    position: "absolute",
    bottom: 0,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  post: {
    width: "90%",
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 20,
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
  input: {
    fontSize: 16,
    color: "#000",
    borderLeftWidth: 1,
    borderLeftColor: "gray",
    paddingLeft: 10,
  },
  labelinput: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 10,
  },
});
