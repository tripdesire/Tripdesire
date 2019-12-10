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
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";
import IconFontAwsm from "react-native-vector-icons/FontAwesome";
import moment from "moment";

class ThankYouBus extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log(this.props.navigation.state.params);
    return;
  }

  navigateToScreen = page => () => {
    this.props.navigation.navigate(page);
  };

  render() {
    const {
      order,
      params,
      razorpayRes,
      sourceName,
      destinationName,
      selectedSheets,
      BoardingPoint
    } = this.props.navigation.state.params;
    return (
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
                justifyContent: "space-between"
              }}>
              <View>
                <Text style={{ lineHeight: 22 }}>Booking Id : </Text>
                <Text style={[styles.Heading, { lineHeight: 16 }]}>{order.id}</Text>
              </View>
              <View>
                <Text style={{ lineHeight: 22 }}>Date : </Text>
                <Text style={[styles.Heading, { lineHeight: 16 }]}>
                  {moment(order.date_created).format("DD-MM-YYYY")}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row" }}>
                <Text>Email : </Text>
                <Text style={styles.Heading}>kamlesh@webiixx.com</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text>Total : </Text>
                <Text>{order.total}</Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row" }}>
                <Text>Payment Method : </Text>
                <Text style={styles.Heading}>Credit Card</Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View>
                <Text>Booking Reference Number : </Text>
                <Text style={styles.Heading}>{razorpayRes.razorpay_payment_id}</Text>
              </View>
            </View>
          </View>

          <View
            style={{
              marginHorizontal: 8,
              marginVertical: 10,
              backgroundColor: "#EEF1F8",
              borderRadius: 8,
              justifyContent: "space-between",
              padding: 10
            }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontWeight: "700", flex: 2 }}>{params.BusType}</Text>
              <View style={{ flexDirection: "row", marginStart: 10, flex: 1 }}>
                <Text style={{ fontWeight: "700" }}>Seat(s) : </Text>
                <Text>{[...selectedSheets.map(item => item.Number)].join(",")}</Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 10
              }}>
              <IconMaterial name="bus" size={50} color="#6287F9" />
              <View>
                <Text style={{ fontSize: 18, lineHeight: 20 }}>{params.DisplayName}</Text>
                <Text style={{ fontSize: 16, lineHeight: 16 }}>
                  {moment(params.Journeydate, "YYYY-MM-DD").format("DD-MM-YYYY")}
                </Text>
                <Text style={{ fontSize: 16, lineHeight: 16 }}>
                  {sourceName + " to " + destinationName}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.Heading}>Boarding Point : </Text>
              <Text style={{ flex: 1, lineHeight: 20 }}>
                {BoardingPoint.Location + " " + BoardingPoint.Landmark}
              </Text>
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
              fontWeight: "700",
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
                  fontWeight: "700",
                  fontSize: 16
                }}>
                Passenger
              </Text>
              {order.adult_details.map((item, index) => {
                return <Text key={item.index}>{item.fname}</Text>;
              })}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "700", fontSize: 16 }}>Age</Text>
              {order.adult_details.map((item, index) => {
                return <Text key={item.index}>{item.age}</Text>;
              })}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "700", fontSize: 16 }}>Gender</Text>
              {order.adult_details.map((item, index) => {
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
              fontWeight: "700",
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
            <Text>Convenience Fee</Text>
            <Text>0.00</Text>
          </View>
          <View style={styles.summaryView}>
            <Text style={{ fontWeight: "700", fontSize: 18 }}>Total Price</Text>
            <Text style={{ fontWeight: "700", fontSize: 18 }}>{order.total}</Text>
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
    );
  }
}

const styles = StyleSheet.create({
  summaryView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10
  },
  Heading: { fontSize: 16, fontWeight: "700" }
});

export default ThankYouBus;
