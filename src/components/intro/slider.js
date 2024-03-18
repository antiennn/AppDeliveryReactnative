import { Animated, FlatList, StyleSheet, Text, View } from "react-native";
import React, { useRef,useState } from "react";
import { Data } from "../../assets/data";
import SliderItems from "./SliderItems";
import Pagination from "./pagination";
const Slider = ({ navigation }) => {
  const [index, setIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const handleOnScroll = event => {
    Animated.event([
      {
        nativeEvent: {
          contentOffset: {
            x: scrollX,
          },
        },
      },
    ],
    {
      useNativeDriver:false
    })(event);
  };

  return (
    <View>
      <FlatList
        data={Data}
        renderItem={({ item }) => <SliderItems items={item} navigation={ navigation }/>}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleOnScroll}
      />
      <Pagination data={Data} scrollX={scrollX} />
    </View>
  );
};

export default Slider;

const styles = StyleSheet.create({});
