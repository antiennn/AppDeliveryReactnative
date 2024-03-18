import { StyleSheet } from "react-native";

const stylesHome = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    width: "100%",
    backgroundColor: "#5e46a3",
    alignItems: "center",
  },
  headertop: {
    width: "100%",
    flexDirection: "row",
    paddingTop: 50,
    paddingHorizontal: 20,
    gap: 20,
  },
  headerbottom: {
    width: "90%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 25,
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 20,
    gap: 20,
    marginBottom: 20,
  },
  labelscan: {
    width: 45,
    height: 45,
    backgroundColor: "#f07723",
    position: "absolute",
    borderRadius: 22.5,
    right: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  searchicon: {
    backgroundColor: "#000",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  titlelocation: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    gap: 5,
  },
  location: {
    color: "#fff",
    fontSize: 14,
  },
  labelava: {
    overflow: "hidden",
    width: 60,
    height: 60,
    borderRadius: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  labelnotification: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 5,
    width: "90%",
    marginTop: 10,
    gap: 10,
  },
  labeltracking: {
    fontSize: 20,
  },
  dashboard: {
    backgroundColor: "#fff",
    width: "100%",
    height: 250,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,

    elevation: 15,
  },
  dashboardHeader: {
    flex: 3,
    position: "relative",
    marginHorizontal: 15,
  },
  dashboardHeaderTitle: {
    position: "absolute",
    color: "#697689",
    top: 5,
  },
  dashboardHeaderID: {
    fontSize: 12,
    bottom: 10,
    width:"70%",
    position: "absolute",
    fontWeight: "bold",
  },
  dashboardHeaderIcon: {
    height: 60,
    width: 60,
    position: "absolute",
    right: 10,
    top: 5,
  },
  dashboardContent: {
    flex: 5,
    flexDirection: "row",
    marginHorizontal: 10,
    borderColor: "gray",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    padding: 5,
    gap:40
  },
  dashboardContentHorizontal: {
    height: "100%",
    width: "50%",
    gap: 25,
  },
  dashboardContentHorizontalVertical: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
  },
  dashboardContentIcon: {
    height: 40,
    width: 40,
  },
  dashboardContentLeftTitle: {},
  dashboardContentLeftName: {
    textTransform:"capitalize",
    fontSize: 20,
  },
  post: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  coupon: {
    flex: 4,
    marginVertical: 20,
    width: "90%",
    justifyContent: "center",
    gap: 5,
  },
  listcoupon: {
    width: "100%",
    height: 200,
  },
});
export default stylesHome;
