import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import NotificationScreen from "./NotificationScreen";
import Homeindex from "./homeindex";
import {
  Notification,
  Home2,
  Global,
  User,
  Judge,
  BoxTime,
  ArrowLeft2,
} from "iconsax-react-native";
import HomeForShipper from "../Shipper/homeShipper";
import InfoShipper from "../Shipper/infoShipper";
import MyAuction from "../Shipper/MyAuction";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { useContext, useState } from "react";
import MyContext from "../../configs/MyContext";
import HomeMap from "../Post/HomeMap";
import PostFinal from "../Post/PostFinal";
import Price from "../Post/Price";
import Coupon from "../Post/Coupon";
import MyPost from "./MyPost";
import { WebView } from "react-native-webview";
import {
  ActivityIndicator,
  Alert,
  Modal,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API, { authApi, endpoints } from "../../configs/API";
import SearchInfo from "./SearchInfo";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const WebPayment = ({ route, navigation }) => {
  const [loading, setloading] = useState(false);
  const { link, auction_id, post_id } = route.params;
  return (
    <View style={{ flex: 1 }}>
      <Modal transparent={true} visible={loading}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#000000AA",
          }}
        >
          <ActivityIndicator />
        </View>
      </Modal>
      <View
        style={{
          flex: 0.1,
          backgroundColor: "#5e46a3",
          flexDirection: "row",
          alignItems: "flex-end",
          alignContent: "center",
          justifyContent: "space-between",
          padding: 15,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft2 size="32" color="#fff" />
        </TouchableOpacity>
      </View>
      <WebView
        onNavigationStateChange={async (t) => {
          if (loading == true) {
            return;
          }
          if (t.url.includes("vnp_ResponseCode=00")) {
            setloading(true);
            const value = await AsyncStorage.getItem("access-token");
            let res = await authApi(value).post(
              endpoints["accept_auction"](post_id),
              { id: auction_id }
            );
            Alert.alert(
              "Payment successful",
              "The shipper is coming to your place to pick up the goods"
            );
            setloading(false);
          }
        }}
        style={{ flex: 1 }}
        source={{ uri: link }}
      />
    </View>
  );
};
const Home = () => {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false, tabBarActiveTintColor: "#5e46a3" }}
    >
      <Tab.Screen
        name="Home"
        component={Homeindex}
        options={{
          tabBarIcon: ({ focused }) => (
            <Home2 size="28" color={focused ? "#5e46a3" : "gray"} />
          ),
        }}
      />
      <Tab.Screen
        name="My Post"
        component={MyPost}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: "#5e46a3",
          },
          headerTitleStyle: {
            fontWeight: "700",
            color: "#fff",
          },
          tabBarIcon: ({ focused }) => (
            <BoxTime size="28" color={focused ? "#5e46a3" : "gray"} />
          ),
        }}
      />
      <Tab.Screen
        name="Notification"
        component={NotificationScreen}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: "#5e46a3",
          },
          headerTitleStyle: {
            fontWeight: "700",
            color: "#fff",
          },
          tabBarIcon: ({ focused }) => (
            <BoxTime size="28" color={focused ? "#5e46a3" : "gray"} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const HomeShipperr = () => {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false, tabBarActiveTintColor: "#5e46a3" }}
    >
      <Tab.Screen
        name="Start"
        component={HomeForShipper}
        options={{
          tabBarIcon: ({ focused }) => (
            <Global size="28" color={focused ? "#5e46a3" : "gray"} />
          ),
        }}
      />
      <Tab.Screen
        name="My Auction"
        component={MyAuction}
        options={{
          tabBarIcon: ({ focused }) => (
            <Judge size="28" color={focused ? "#5e46a3" : "gray"} />
          ),
        }}
      />
      <Tab.Screen
        name="Announcement"
        component={NotificationScreen}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: "#5e46a3",
          },
          headerTitleStyle: {
            fontWeight: "700",
            color: "#fff",
          },
          tabBarIcon: ({ focused }) => (
            <BoxTime size="28" color={focused ? "#5e46a3" : "gray"} />
          ),
        }}
      />
      <Tab.Screen
        name="My account"
        component={InfoShipper}
        options={{
          tabBarIcon: ({ focused }) => (
            <User size="28" color={focused ? "#5e46a3" : "gray"} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
const RootNavigator = () => {
  const [user, dispatch] = useContext(MyContext);

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator
        screenOptions={{ headerShown: false, tabBarActiveTintColor: "#5e46a3" }}
        initialRouteName={user.role_user}
      >
        <Stack.Screen options={{
            headerShown: true,
            title: "Infomation",
            headerStyle: {
              backgroundColor: "#5e46a3",
            },
            headerTitleStyle: {
              fontWeight: "700",
              color: "#fff",
            },
          }} name="Search" component={SearchInfo}/>
        <Stack.Screen name="Payment" component={WebPayment} />
        <Stack.Screen name="Customer" component={Home} />
        <Stack.Screen name="Shipper" component={HomeShipperr} />
        <Stack.Screen name="HomeMap" component={HomeMap} />
        <Stack.Screen
          options={{
            headerShown: true,
            title: "Delivery Details",
            headerStyle: {
              backgroundColor: "#5e46a3",
            },
            headerTitleStyle: {
              fontWeight: "700",
              color: "#fff",
            },
          }}
          name="PostFinal"
          component={PostFinal}
        />
        <Stack.Screen
          options={{
            headerShown: true,
            title: "Pricing",
            headerStyle: {
              backgroundColor: "#5e46a3",
            },
            headerTitleStyle: {
              fontWeight: "700",
              color: "#fff",
            },
          }}
          name="Price"
          component={Price}
        />
        <Stack.Screen
          options={{
            headerShown: true,
            title: "Coupon",
            headerStyle: {
              backgroundColor: "#5e46a3",
            },
            headerTitleStyle: {
              fontWeight: "700",
              color: "#fff",
            },
          }}
          name="Coupon"
          component={Coupon}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default RootNavigator;
