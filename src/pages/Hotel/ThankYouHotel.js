import React, { PureComponent } from "react";
import {
  View,
  Image,
  Modal,
  StyleSheet,
  SafeAreaView,
  Platform,
  ScrollView,
  Dimensions,
  TouchableOpacity
} from "react-native";
import { Button, Text, AutoCompleteModal, ActivityIndicator, Icon } from "../../components";
import moment from "moment";

const { width, height } = Dimensions.get("window");

class ThankYouHotel extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log(this.props.navigation.state.params);
  }
  navigateToScreen = page => () => {
    this.props.navigation.navigate(page);
  };
  render() {
    const { order, params, razorpayRes } = this.props.navigation.state.params;

    var str = params.HotelImages[0].Imagepath;
    var res = str.replace("https://cdn.grnconnect.com/", "https://images.grnconnect.com/");

    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "#E5EBF7" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <ScrollView>
            <View>
              <View style={{ justifyContent: "center", marginHorizontal: 8, marginTop: 20 }}>
                <Text style={{ fontWeight: "700", fontSize: 18 }}>Booking Confirmed</Text>
                <Text>ThankYou. Your booking has been completed.</Text>
              </View>

              <View
                style={{
                  marginHorizontal: 8,
                  marginVertical: 8,
                  backgroundColor: "#EEF1F8",
                  borderRadius: 8,
                  padding: 10
                }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    flex: 1
                  }}>
                  <View>
                    <Text style={{ lineHeight: 22 }}>Booking Id : </Text>
                    <Text style={([styles.Heading], { lineHeight: 16 })}>{order.id}</Text>
                  </View>
                  <View>
                    <Text style={{ lineHeight: 22 }}>Date : </Text>
                    <Text style={([styles.Heading], { lineHeight: 16 })}>
                      {moment(order.date_created).format("DD-MM-YYYY")}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                    alignItems: "flex-start"
                  }}>
                  <View>
                    <Text>Email : </Text>
                    <Text style={styles.Heading}>
                      {order.billing.email ? order.billing.email : null}
                    </Text>
                  </View>
                  <View>
                    <Text>Total : </Text>
                    <Text style={styles.Heading}>
                      {order.currency_symbol}
                      {order.total}
                    </Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <View style={{ flexDirection: "row" }}>
                    <Text>Payment Method : </Text>
                    <Text style={styles.Heading}>Credit Card</Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", flex: 1 }}>
                  <View>
                    <Text style={{ lineHeight: 20 }}>Booking Reference Number : </Text>
                    <Text style={[styles.Heading, { lineHeight: 18 }]}>
                      {razorpayRes.razorpay_payment_id}
                    </Text>
                  </View>
                </View>
              </View>

              <View
                style={{
                  marginHorizontal: 8,
                  marginVertical: 10,
                  backgroundColor: "#EEF1F8",
                  borderRadius: 8,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: 10
                }}>
                <Image
                  style={{ width: width / 4, height: height / 6, borderRadius: 5 }}
                  resizeMode="cover"
                  source={{ uri: res || "https://via.placeholder.com/150" }}
                />
                <View style={{ marginStart: 10, flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: "500" }}>{params.HotelName}</Text>
                  <Text>{params.selectedRoom.RoomType}</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      flex: 1
                    }}>
                    <View>
                      <Text style={{ fontWeight: "500" }}>Check-In</Text>
                      <Text>{params.checkInDate}</Text>
                    </View>
                    <View>
                      <Text style={{ fontWeight: "500" }}>Check-Out</Text>
                      <Text>{params.checkOutDate}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View
              style={{
                marginHorizontal: 8,
                elevation: 1,
                borderRadius: 5,
                marginTop: 10
              }}>
              <Text
                style={{
                  fontWeight: "500",
                  fontSize: 18,
                  paddingVertical: 10,
                  backgroundColor: "#EEF1F8",
                  paddingHorizontal: 10,
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5
                }}>
                Passenger Details
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingHorizontal: 10
                }}>
                <View style={{ flex: 2 }}>
                  <Text
                    style={{
                      fontWeight: "600",
                      fontSize: 16
                    }}>
                    Passenger
                  </Text>
                  {order.adult_details.map((item, index) => {
                    return <Text key={item.index}>{item.fname + " " + item.lname}</Text>;
                  })}
                  {order.child_details &&
                    order.child_details.map((item, index) => {
                      return <Text key={item.index}>{item.fname + " " + item.lname}</Text>;
                    })}
                </View>
                <View style={{ flex: 1, marginHorizontal: 10 }}>
                  <Text style={{ fontWeight: "600", fontSize: 16 }}>Age</Text>
                  {order.adult_details.map((item, index) => {
                    return <Text key={item.index}>{item.age}</Text>;
                  })}
                  {order.child_details &&
                    order.child_details.map((item, index) => {
                      return <Text key={item.index}>{item.age}</Text>;
                    })}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: "600", fontSize: 16 }}>Gender</Text>
                  {order.adult_details.map((item, index) => {
                    return <Text key={item.index}>{item.gender == "M" ? "Male" : "Female"}</Text>;
                  })}
                  {order.child_details &&
                    order.child_details.map((item, index) => {
                      return <Text key={item.index}>{item.gender == "M" ? "Male" : "Female"}</Text>;
                    })}
                </View>
              </View>
            </View>
            <View
              style={{
                marginHorizontal: 8,
                elevation: 1,
                borderRadius: 5,
                marginTop: 10
              }}>
              <Text
                style={{
                  fontWeight: "500",
                  fontSize: 18,
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  backgroundColor: "#EEF1F8",
                  paddingHorizontal: 10,
                  paddingVertical: 10
                }}>
                Fare Summary
              </Text>
              <View style={styles.summaryView}>
                <Text>Base Price</Text>
                <Text>0.00</Text>
              </View>
              <View style={styles.summaryView}>
                <Text>Taxes and Fees</Text>
                <Text>0.00</Text>
              </View>
              <View style={styles.summaryView}>
                <Text>Convenience Fee</Text>
                <Text>0.00</Text>
              </View>
              <View style={styles.summaryView}>
                <Text>Extra Guest Charge</Text>
                <Text>0.00</Text>
              </View>
              <View style={styles.summaryView}>
                <Text style={{ fontWeight: "500", fontSize: 18 }}>Total Price</Text>
                <Text style={{ fontWeight: "500", fontSize: 18 }}>{order.total}</Text>
              </View>
              <View style={styles.summaryView}>
                <Text style={{ flex: 1 }}>Payment Method</Text>
                <Text style={{ flex: 1, marginStart: 10 }}>Credit Card/Debit Card/Net Banking</Text>
              </View>
            </View>
            <Button
              style={{
                backgroundColor: "#F68E1F",
                justifyContent: "center",
                marginHorizontal: 50,
                marginVertical: 40,
                height: 40,
                borderRadius: 20,
                alignItems: "center"
              }}
              onPress={this.navigateToScreen("Home")}>
              <Text style={{ color: "#fff", paddingHorizontal: 40 }}>Go Home</Text>
            </Button>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  summaryView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10
  },
  Heading: { fontSize: 16, fontWeight: "500" }
});

export default ThankYouHotel;
