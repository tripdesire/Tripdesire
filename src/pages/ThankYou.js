import React, { PureComponent } from "react";
import { Text, Button, Icon } from "../components";
import {
  Image,
  ImageBackground,
  Dimensions,
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView
} from "react-native";
import { connect } from "react-redux";
import { DomSugg, IntSugg, DomHotelSugg, BusSugg } from "../store/action";
import { etravosApi } from "../service";
import axios from "axios";
import moment from "moment";
const { height, width } = Dimensions.get("window");

class ThankYou extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log(props.navigation.state.params);
    return;
  }

  navigateToScreen = page => () => {
    this.props.navigation.navigate(page);
  };

  render() {
    const { params, order, razorpayRes } = this.props.navigation.state.params;
    console.log(params);
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
                    flex: 1,
                    justifyContent: "space-between"
                  }}>
                  <View>
                    <Text style={{ lineHeight: 22 }}>Ref No. : </Text>
                    <Text style={[styles.Heading, { lineHeight: 16 }]}>
                      {razorpayRes.razorpay_payment_id}
                    </Text>
                  </View>
                  <View>
                    <Text style={{ lineHeight: 22 }}>Date : </Text>
                    <Text style={[styles.Heading, { lineHeight: 16 }]}>
                      {moment(order.date_created).format("DD-MM-YYYY")}
                    </Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", flex: 1 }}>
                  <View>
                    <Text style={{ lineHeight: 22 }}>Email : </Text>
                    <Text style={[styles.Heading, { lineHeight: 16 }]}>kamlesh@webiixx.com</Text>
                  </View>
                  <View>
                    <Text style={{ lineHeight: 22 }}>Total : </Text>
                    <Text style={[styles.Heading, { lineHeight: 16 }]}>{order.total}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", flex: 1 }}>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={{ lineHeight: 22 }}>Payment Method : </Text>
                    <Text style={[styles.Heading, { lineHeight: 20 }]}>Credit Card</Text>
                  </View>
                </View>
              </View>

              <Text style={{ fontSize: 16, fontWeight: "700", marginHorizontal: 8, marginTop: 10 }}>
                Departure
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginHorizontal: 8
                }}>
                <Text style={{ color: "#636C73", fontSize: 12 }}>
                  {params.flightType == 1
                    ? moment(params.departFlight.FlightSegments[0].DepartureDateTime).format(
                        "DD-MMM"
                      )
                    : moment(
                        params.departFlight.IntOnward.FlightSegments[0].DepartureDateTime
                      ).format("DD-MMM")}
                </Text>
                {params.flightType == 1 && (
                  <Text style={{ color: "#636C73", fontSize: 12 }}>
                    {params.departFlight.FlightSegments.length - 1 == 0
                      ? "Non Stop"
                      : params.departFlight.FlightSegments.length - 1 + " Stop(s)"}
                  </Text>
                )}
                {params.flightType == 2 && (
                  <Text style={{ color: "#636C73", fontSize: 12 }}>
                    {params.departFlight.IntOnward.FlightSegments.length - 1 == 0
                      ? "Non Stop"
                      : params.departFlight.IntOnward.FlightSegments.length - 1 + " Stop(s)"}
                  </Text>
                )}
              </View>
              <View
                style={{
                  flexDirection: "row",
                  marginHorizontal: 8,
                  justifyContent: "space-between"
                }}>
                <View style={{ flex: 2 }}>
                  <Text style={{ fontSize: 20, lineHeight: 22 }}>
                    {params.flightType == 1
                      ? params.departFlight.FlightSegments[0].AirLineName
                      : params.departFlight.IntOnward.FlightSegments[0].AirLineName}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#5D646A",
                      lineHeight: 14
                    }}>
                    {params.departFlight.FlightUId}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 20, lineHeight: 22 }}>
                    {params.flightType == 1
                      ? moment(params.departFlight.FlightSegments[0].DepartureDateTime).format(
                          "HH:mm"
                        )
                      : moment(
                          params.departFlight.IntOnward.FlightSegments[0].DepartureDateTime
                        ).format("HH:mm")}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#5D646A",
                      lineHeight: 14
                    }}>
                    {params.flightType == 1
                      ? params.departFlight.FlightSegments[0].IntDepartureAirportName
                      : params.departFlight.IntOnward.FlightSegments[0].IntDepartureAirportName}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 20, lineHeight: 22 }}>
                    {params.flightType == 1
                      ? moment(
                          params.departFlight.FlightSegments[
                            params.departFlight.FlightSegments.length - 1
                          ].ArrivalDateTime
                        ).format("HH:mm")
                      : moment(
                          params.departFlight.IntOnward.FlightSegments[
                            params.departFlight.IntOnward.FlightSegments.length - 1
                          ].ArrivalDateTime
                        ).format("HH:mm")}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#5D646A",
                      lineHeight: 14
                    }}>
                    {params.flightType == 1
                      ? params.departFlight.FlightSegments[
                          params.departFlight.FlightSegments.length - 1
                        ].IntArrivalAirportName
                      : params.departFlight.IntOnward.FlightSegments[
                          params.departFlight.IntOnward.FlightSegments.length - 1
                        ].IntArrivalAirportName}
                  </Text>
                </View>
                <View style={{ flex: 2 }}>
                  {params.flightType == 1 && (
                    <Text style={{ fontSize: 20, lineHeight: 22 }}>
                      {params.departFlight.FlightSegments.length == 1
                        ? params.departFlight.FlightSegments[0].Duration
                        : params.departFlight.FlightSegments[
                            params.departFlight.FlightSegments.length - 1
                          ].AccumulatedDuration}
                    </Text>
                  )}
                  {params.flightType == 2 && (
                    <Text style={{ fontSize: 20, lineHeight: 22 }}>
                      {params.departFlight.IntOnward.FlightSegments.length == 1
                        ? params.departFlight.IntOnward.FlightSegments[0].Duration
                        : params.departFlight.IntOnward.FlightSegments[
                            params.departFlight.IntOnward.FlightSegments.length - 1
                          ].AccumulatedDuration}
                    </Text>
                  )}

                  <Text style={{ fontSize: 20, lineHeight: 22 }}>{params.className}</Text>
                </View>
              </View>
              {params.tripType == 2 && (
                <View>
                  <Text
                    style={{ fontSize: 16, fontWeight: "700", marginHorizontal: 8, marginTop: 10 }}>
                    Arrival
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginHorizontal: 8
                    }}>
                    <Text style={{ color: "#636C73", fontSize: 12 }}>
                      {params.flightType == 2
                        ? moment(
                            params.departFlight.IntReturn.FlightSegments[0].DepartureDateTime
                          ).format("DD-MMM")
                        : moment(params.arrivalFlight.FlightSegments[0].DepartureDateTime).format(
                            "DD-MMM"
                          )}
                    </Text>
                    {params.flightType == 2 && (
                      <Text style={{ color: "#636C73", fontSize: 12 }}>
                        {params.departFlight.IntReturn.FlightSegments.length - 1 == 0
                          ? "Non Stop"
                          : params.departFlight.IntReturn.FlightSegments.length - 1 + " Stop(s)"}
                      </Text>
                    )}
                    {params.flightType == 1 && (
                      <Text style={{ color: "#636C73", fontSize: 12 }}>
                        {params.arrivalFlight.FlightSegments.length - 1 == 0
                          ? "Non Stop"
                          : params.arrivalFlight.FlightSegments.length - 1 + " Stop(s)"}
                      </Text>
                    )}
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      marginHorizontal: 8,
                      justifyContent: "space-between"
                    }}>
                    <View style={{ flex: 2 }}>
                      <Text style={{ fontSize: 20, lineHeight: 22 }}>
                        {params.flightType == 2
                          ? params.departFlight.IntReturn.FlightSegments[0].AirLineName
                          : params.arrivalFlight.FlightSegments[0].AirLineName}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#5D646A",
                          lineHeight: 14
                        }}>
                        {params.departFlight.FlightUId}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 20, lineHeight: 22 }}>
                        {params.flightType == 2
                          ? moment(
                              params.departFlight.IntReturn.FlightSegments[0].DepartureDateTime
                            ).format("HH:mm")
                          : moment(params.arrivalFlight.FlightSegments[0].DepartureDateTime).format(
                              "HH:mm"
                            )}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#5D646A",
                          lineHeight: 14
                        }}>
                        {params.flightType == 2
                          ? params.departFlight.IntReturn.FlightSegments[0].IntDepartureAirportName
                          : params.arrivalFlight.FlightSegments[0].IntDepartureAirportName}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 20, lineHeight: 22 }}>
                        {params.flightType == 2
                          ? moment(
                              params.departFlight.IntReturn.FlightSegments[
                                params.departFlight.IntReturn.FlightSegments.length - 1
                              ].ArrivalDateTime
                            ).format("HH:mm")
                          : moment(
                              params.arrivalFlight.FlightSegments[
                                params.arrivalFlight.FlightSegments.length - 1
                              ].ArrivalDateTime
                            ).format("HH:mm")}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#5D646A",
                          lineHeight: 14
                        }}>
                        {params.flightType == 2
                          ? params.departFlight.IntReturn.FlightSegments[
                              params.departFlight.IntReturn.FlightSegments.length - 1
                            ].IntArrivalAirportName
                          : params.arrivalFlight.FlightSegments[
                              params.arrivalFlight.FlightSegments.length - 1
                            ].IntArrivalAirportName}
                      </Text>
                    </View>
                    <View style={{ flex: 2 }}>
                      {params.flightType == 2 && (
                        <Text style={{ fontSize: 20, lineHeight: 22 }}>
                          {params.departFlight.IntReturn.FlightSegments.length == 1
                            ? params.departFlight.IntReturn.FlightSegments[0].Duration
                            : params.departFlight.IntReturn.FlightSegments[
                                params.departFlight.IntReturn.FlightSegments.length - 1
                              ].AccumulatedDuration}
                        </Text>
                      )}
                      {params.flightType == 1 && (
                        <Text style={{ fontSize: 20, lineHeight: 22 }}>
                          {params.arrivalFlight.FlightSegments.length == 1
                            ? params.arrivalFlight.FlightSegments[0].Duration
                            : params.arrivalFlight.FlightSegments[
                                params.arrivalFlight.FlightSegments.length - 1
                              ].AccumulatedDuration}
                        </Text>
                      )}
                      <Text style={{ fontSize: 20, lineHeight: 22 }}>{params.className}</Text>
                    </View>
                  </View>
                </View>
              )}
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
                    return <Text key={item.index}>{item.fname + " " + item.lname}</Text>;
                  })}
                  {order.child_details &&
                    order.child_details.map((item, index) => {
                      return <Text key={item.index}>{item.fname + " " + item.lname}</Text>;
                    })}
                  {order.infan_details &&
                    order.infan_details.map((item, index) => {
                      return <Text key={item.index}>{item.fname + " " + item.lname}</Text>;
                    })}
                </View>
                <View style={{ flex: 1, marginHorizontal: 10 }}>
                  <Text style={{ fontWeight: "700", fontSize: 16 }}>Age</Text>
                  {order.adult_details.map((item, index) => {
                    return <Text key={item.index}>{item.age}</Text>;
                  })}
                  {order.child_details.map((item, index) => {
                    return <Text key={item.index}>{item.age}</Text>;
                  })}
                  {order.infan_details.map((item, index) => {
                    return <Text key={item.index}>{item.age}</Text>;
                  })}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: "700", fontSize: 16 }}>Gender</Text>
                  {order.adult_details.map((item, index) => {
                    return <Text key={item.index}>{item.gender == "M" ? "Male" : "Female"}</Text>;
                  })}
                  {order.child_details.map((item, index) => {
                    return <Text key={item.index}>{item.gender == "M" ? "Male" : "Female"}</Text>;
                  })}
                  {order.infan_details.map((item, index) => {
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
                <Text>Flight Scharge</Text>
                <Text>0.00</Text>
              </View>
              <View style={styles.summaryView}>
                <Text>Base Fare</Text>
                <Text>{params.departFlight.FareDetails.ChargeableFares.ActualBaseFare}</Text>
              </View>
              <View style={styles.summaryView}>
                <Text>Flight Gst</Text>
                <Text>0.00</Text>
              </View>
              <View style={styles.summaryView}>
                <Text>Flight Tax</Text>
                <Text>{params.departFlight.FareDetails.ChargeableFares.Tax}</Text>
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
  Heading: { fontSize: 16, fontWeight: "700" }
});

export default ThankYou;
