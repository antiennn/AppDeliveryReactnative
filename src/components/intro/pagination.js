import { StyleSheet, Text, View,Dimensions,Animated } from 'react-native'
import React from 'react'

const {width} = Dimensions.get("screen")
const Pagination = ({data,scrollX}) => {
  return (
    <View style={styles.container}> 
        {
            data.map((_, idx) =>{
                const inputRange = [(idx - 1) * width, idx * width, (idx + 1)* width];
                const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange:[0.5,1,0.5],
                    extrapolate:'clamp'
                })
                const dotwidth = scrollX.interpolate({
                    inputRange,
                    outputRange: [12, 30, 12],
                    extrapolate:'clamp'
                });
                const backgroundColor = scrollX.interpolate({
                    inputRange,
                    outputRange: ["#ccc","#000", "#ccc"],
                    extrapolate:'clamp'
                })
                return <Animated.View key={idx.toString()} style={[styles.dot,{width:dotwidth,backgroundColor,opacity}]}/>
            } )
        }
    </View>
  )
}

export default Pagination

const styles = StyleSheet.create({
    container:{
        position: "absolute",
        bottom:30,
        flexDirection:"row",
        justifyContent:'center',
        width:"100%"
    },
    dot:{
        width:12,
        height:12,
        borderRadius:6,
        backgroundColor:"#ccc",
        margin:10
    }
})