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
import { isArray } from "lodash";
import { Button, Text, CurrencyText, Icon } from "../../components";
import moment from "moment";
import HTML from "react-native-render-html";

const { width, height } = Dimensions.get("window");

class ThankYouHotel extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log(props.navigation.state.params);
  }
  navigateToScreen = page => () => {
    this.props.navigation.navigate(page);
  };

  _goBack = () => {
    this.props.navigation.goBack(null);
  };

  render() {
    const { order, isOrderPage } = this.props.navigation.state.params;
    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "#000000" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          {isOrderPage && (
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 16,
                height: 56,
                backgroundColor: "#E4EAF6",
                alignItems: "center"
              }}>
              <Button onPress={this._goBack}>
                <Icon name="md-arrow-back" size={24} />
              </Button>
              <Text
                style={{
                  fontSize: 18,
                  color: "#1E293B",
                  marginStart: 15,
                  fontWeight: "700"
                }}>
                #{order.id}
              </Text>
            </View>
          )}
          <ScrollView>
            <View>
              {!isOrderPage && (
                <View style={{ justifyContent: "center", marginHorizontal: 8, marginTop: 20 }}>
                  <Text style={{ fontWeight: "700", fontSize: 18 }}>Booking Confirmed</Text>
                  <Text>ThankYou. Your booking has been completed.</Text>
                </View>
              )}

              <View style={[styles.cardView, { marginTop: 15 }]}>
                <View style={styles.flightType}>
                  <Text style={styles.heading}>Contact Details</Text>
                </View>
                <View style={styles.contentView}>
                  <View>
                    <Text style={[styles.time, { marginBottom: 4 }]}>Address</Text>
                    <Text style={styles.airlineno}>
                      {order.billing.address_1 != "" ? order.billing.address_1 : null}
                    </Text>
                  </View>

                  <View style={{ alignItems: "center" }}>
                    <Text style={[styles.time, { marginBottom: 4 }]}>Email Id</Text>
                    <Text style={styles.airlineno}>
                      {order.billing.email ? order.billing.email : null}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={[styles.cardView, { marginTop: 15 }]}>
              <View style={styles.flightType}>
                <Text style={styles.heading}>Guest Details</Text>
              </View>
              <View style={[styles.contentView, { flexDirection: "column" }]}>
                <View style={{ flexDirection: "row", flex: 1, marginBottom: 4 }}>
                  <Text style={[styles.time, { flex: 1 }]}>Name</Text>
                  <Text style={[styles.time, { flex: 1, textAlign: "center" }]}>Age</Text>
                  <Text style={[styles.time, { flex: 1, textAlign: "center" }]}>Gender</Text>
                </View>

                {order.adult_details &&
                  order.adult_details.map((item, index) => {
                    return (
                      <View style={{ flexDirection: "row", flex: 1 }} key={"adult" + index}>
                        <Text key={item.index} style={[styles.airlineno, { flex: 1 }]}>
                          {item.fname + " " + item.lname}
                        </Text>
                        <Text
                          key={item.index}
                          style={[styles.airlineno, { flex: 1, textAlign: "center" }]}>
                          {item.age}
                        </Text>
                        <Text
                          key={item.index}
                          style={[styles.airlineno, { flex: 1, textAlign: "center" }]}>
                          {item.gender == "M" ? "Male" : "Female"}
                        </Text>
                      </View>
                    );
                  })}
              </View>
            </View>

            <View style={[styles.cardView, { marginTop: 15, marginBottom: 5 }]}>
              <View style={styles.flightType}>
                <Text style={styles.heading}>Your Order</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.airlineno}>{order.line_items[0].name}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.airlineno}>Per Person</Text>
                <Text style={styles.airlineno}>{order.line_items[0].price}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.airlineno}>No of Passengers</Text>
                <Text style={styles.airlineno}>{order.line_items[0].quantity}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.time}>Total Payable</Text>
                <Text style={styles.time}>{order.currency_symbol + "" + order.total}</Text>
              </View>
              <View style={[styles.summaryRow, { paddingBottom: 8 }]}>
                <Text style={styles.airlineno}>Payment Method</Text>
                <Text style={styles.airlineno}>
                  {order.payment_method_title != "" || order.payment_method_title
                    ? order.payment_method_title
                    : null}
                </Text>
              </View>
            </View>

            {!isOrderPage && (
              <Button
                style={{
                  backgroundColor: "#F68E1F",
                  justifyContent: "center",
                  marginHorizontal: 50,
                  marginVertical: 40,
                  height: 36,
                  borderRadius: 20,
                  alignItems: "center"
                }}
                onPress={this.navigateToScreen("Home")}>
                <Text style={{ color: "#fff", paddingHorizontal: 40 }}>Go Home</Text>
              </Button>
            )}
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
  Heading: { fontSize: 16, fontWeight: "500" },
  header: {
    fontSize: 16,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 5,
    backgroundColor: "#edeeef"
  },
  time: {
    lineHeight: 16,
    fontWeight: "600"
  },
  airlineno: {
    fontSize: 12,
    lineHeight: 16,
    color: "#757575"
  },
  class: {
    lineHeight: 16,
    fontWeight: "600"
  },
  summaryRow: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  cardView: {
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    marginHorizontal: 8,
    backgroundColor: "#fff",
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOpacity: 1,
    shadowRadius: 4
  },
  flightType: {
    backgroundColor: "#edeeef",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8
  },
  contentView: {
    flexDirection: "row",
    paddingHorizontal: 5,
    paddingTop: 8,
    paddingBottom: 8,
    justifyContent: "space-between",
    marginHorizontal: 8
  },
  heading: {
    fontSize: 16,
    fontWeight: "600"
  }
});

export default ThankYouHotel;
