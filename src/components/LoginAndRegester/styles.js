import { StyleSheet} from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent:"center",
  },
  image: {
    flex: 0.4,
    width: "80%",
  },
  content: {
    flex: 0.8,
    width: "80%",
    gap: 30,
  },
  headertext: {
    fontWeight: "700",
    fontSize: 32,
  },
  button:{
    width:"100%",
    borderRadius:20,
    padding:10,
    backgroundColor:"#000"
  },
  text:{
    textAlign:"center",
    fontWeight:"700",
    fontSize:16,
    color:"#fff",
  },
  switch:{
    width:"100%",
    textAlign:"center",
    color:"#697689",
  },
  sociallabel:{
    display:"flex",
    flexDirection:"row",
    justifyContent:"center",
    gap:40
  },
  socialbtn:{
    width:80,
    height:60,
    borderColor:"#697689",
    borderWidth:1.5,
    borderRadius:10,
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
  },
  logoimg:{
    width:"50%",
  },
  submitbtn:{
    color:"#000",
    fontWeight:"800",
  },
  footer:{
    height:100,
    width:"100%"
  }
});
export default styles;
