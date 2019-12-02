import React, {PureComponent} from "react";
import {Text, Button, Icon} from "../components";
import {Image, ImageBackground, Dimensions, View, StyleSheet, ScrollView} from "react-native";
import {connect} from "react-redux";
import {DomSugg, IntSugg, DomHotelSugg, BusSugg} from "../store/action";
import Service from "../service";
import axios from "axios";
import moment from "moment";
const {height, width} = Dimensions.get("window");
import HTML from "react-native-render-html";

class ThankYou extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log(props.navigation.state.params);
  }

  navigateToScreen = page => () => {
    this.props.navigation.navigate(page);
  };

  render() {
    const {params, blockRes, cartRes, stateData} = this.props.navigation.state.params;
    console.log(params);
    return (
      <ScrollView>
        <View>
          <View style={{justifyContent: "center", marginHorizontal: 8, marginTop: 20}}>
            <Text style={{fontWeight: "700", fontSize: 18}}>Booking Confirmed</Text>
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
              <View style={{flexDirection: "row", alignItems: "center"}}>
                <Text>Ref No. : </Text>
                <Text style={styles.Heading}>{blockRes.data.ReferenceNo}</Text>
              </View>
              <View style={{flexDirection: "row"}}>
                <Text>Date : </Text>
                <Text style={styles.Heading}>{moment(new Date()).format("MMM DD YYYY")}</Text>
              </View>
            </View>
            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
              <View style={{flexDirection: "row"}}>
                <Text>Email : </Text>
                <Text style={styles.Heading}>kamlesh@webiixx.com</Text>
              </View>
              <View style={{flexDirection: "row"}}>
                <Text>Total : </Text>
                <HTML html={params.data.total} />
              </View>
            </View>
            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
              <View style={{flexDirection: "row"}}>
                <Text>Payment Method : </Text>
                <Text style={styles.Heading}>Credit Card</Text>
              </View>
            </View>
          </View>

          <Text style={{fontSize: 16, fontWeight: "700", marginHorizontal: 8, marginTop: 10}}>
            Departure
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginHorizontal: 8
            }}>
            <Text style={{color: "#636C73", fontSize: 12}}>
              {params.params.flightType == 1
                ? moment(params.params.departFlight.FlightSegments[0].DepartureDateTime).format(
                    "DD-MMM"
                  )
                : moment(
                    params.params.departFlight.IntOnward.FlightSegments[0].DepartureDateTime
                  ).format("DD-MMM")}
            </Text>
            {params.params.flightType == 1 && (
              <Text style={{color: "#636C73", fontSize: 12}}>
                {" "}
                {params.params.departFlight.FlightSegments.length - 1 == 0
                  ? "Non Stop"
                  : params.params.departFlight.FlightSegments.length - 1 + " Stop(s)"}
              </Text>
            )}
            {params.params.flightType == 2 && (
              <Text style={{color: "#636C73", fontSize: 12}}>
                {" "}
                {params.params.departFlight.IntOnward.FlightSegments.length - 1 == 0
                  ? "Non Stop"
                  : params.params.departFlight.IntOnward.FlightSegments.length - 1 + " Stop(s)"}
              </Text>
            )}
          </View>
          <View
            style={{
              flexDirection: "row",
              marginHorizontal: 8,
              justifyContent: "space-between"
            }}>
            <View>
              <Text style={{fontSize: 20, lineHeight: 22}}>
                {params.params.flightType == 1
                  ? params.params.departFlight.FlightSegments[0].AirLineName
                  : params.params.departFlight.IntOnward.FlightSegments[0].AirLineName}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "#5D646A",
                  lineHeight: 14
                }}>
                {params.params.departFlight.FlightUId}
              </Text>
            </View>
            <View>
              <Text style={{fontSize: 20, lineHeight: 22}}>
                {params.params.flightType == 1
                  ? moment(params.params.departFlight.FlightSegments[0].DepartureDateTime).format(
                      "HH:mm"
                    )
                  : moment(
                      params.params.departFlight.IntOnward.FlightSegments[0].DepartureDateTime
                    ).format("HH:mm")}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "#5D646A",
                  lineHeight: 14
                }}>
                {params.params.flightType == 1
                  ? params.params.departFlight.FlightSegments[0].IntDepartureAirportName
                  : params.params.departFlight.IntOnward.FlightSegments[0].IntDepartureAirportName}
              </Text>
            </View>
            <View>
              <Text style={{fontSize: 20, lineHeight: 22}}>
                {params.params.flightType == 1
                  ? moment(
                      params.params.departFlight.FlightSegments[
                        params.params.departFlight.FlightSegments.length - 1
                      ].ArrivalDateTime
                    ).format("HH:mm")
                  : moment(
                      params.params.departFlight.IntOnward.FlightSegments[
                        params.params.departFlight.IntOnward.FlightSegments.length - 1
                      ].ArrivalDateTime
                    ).format("HH:mm")}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "#5D646A",
                  lineHeight: 14
                }}>
                {params.params.flightType == 1
                  ? params.params.departFlight.FlightSegments[
                      params.params.departFlight.FlightSegments.length - 1
                    ].IntArrivalAirportName
                  : params.params.departFlight.IntOnward.FlightSegments[
                      params.params.departFlight.IntOnward.FlightSegments.length - 1
                    ].IntArrivalAirportName}
              </Text>
            </View>
            <View>
              {params.params.flightType == 1 && (
                <Text style={{fontSize: 20, lineHeight: 22}}>
                  {" "}
                  {params.params.departFlight.FlightSegments.length == 1
                    ? params.params.departFlight.FlightSegments[0].Duration
                    : params.params.departFlight.FlightSegments[
                        params.params.departFlight.FlightSegments.length - 1
                      ].AccumulatedDuration}
                </Text>
              )}
              {params.params.flightType == 2 && (
                <Text style={{fontSize: 20, lineHeight: 22}}>
                  {" "}
                  {params.params.departFlight.IntOnward.FlightSegments.length == 1
                    ? params.params.departFlight.IntOnward.FlightSegments[0].Duration
                    : params.params.departFlight.IntOnward.FlightSegments[
                        params.params.departFlight.IntOnward.FlightSegments.length - 1
                      ].AccumulatedDuration}
                </Text>
              )}

              <Text style={{fontSize: 20, lineHeight: 22}}>{params.params.className}</Text>
            </View>
          </View>
          {params.params.tripType == 2 && (
            <View>
              <Text style={{fontSize: 16, fontWeight: "700", marginHorizontal: 8, marginTop: 10}}>
                Arrival
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginHorizontal: 8
                }}>
                <Text style={{color: "#636C73", fontSize: 12}}>01 - jan</Text>
                <Text style={{color: "#636C73", fontSize: 12}}>Non-Stop</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  marginHorizontal: 8,
                  justifyContent: "space-between"
                }}>
                <View>
                  <Text style={{fontSize: 20, lineHeight: 22}}>Indigo</Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#5D646A",
                      lineHeight: 14
                    }}>
                    6E-151E
                  </Text>
                </View>
                <View>
                  <Text style={{fontSize: 20, lineHeight: 22}}>08:25</Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#5D646A",
                      lineHeight: 14
                    }}>
                    Hyderabad
                  </Text>
                </View>
                <View>
                  <Text style={{fontSize: 20, lineHeight: 22}}>08:25</Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#5D646A",
                      lineHeight: 14
                    }}>
                    Bangalore
                  </Text>
                </View>
                <View>
                  <Text style={{fontSize: 20, lineHeight: 22}}>1 hrs 25 mins</Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#5D646A",
                      lineHeight: 14
                    }}>
                    Bangalore
                  </Text>
                  <Text style={{fontSize: 20, lineHeight: 22}}>Economy</Text>
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
            <View>
              <Text
                style={{
                  fontWeight: "700",
                  fontSize: 16
                }}>
                Passenger
              </Text>
              {stateData.adults.map(item => {
                return <Text>{item.firstname + " " + item.last_name}</Text>;
              })}
            </View>
            <View>
              <Text style={{fontWeight: "700", fontSize: 16}}>Age</Text>
              {stateData.adults.map(item => {
                return <Text>{item.age}</Text>;
              })}
            </View>
            <View>
              <Text style={{fontWeight: "700", fontSize: 16}}>Gender</Text>
              {stateData.adults.map(item => {
                return <Text>{item.gender == "M" ? "Male" : "Female"}</Text>;
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
            <Text>{params.params.departFlight.FareDetails.ChargeableFares.ActualBaseFare}</Text>
          </View>
          <View style={styles.summaryView}>
            <Text>Flight Gst</Text>
            <Text>0.00</Text>
          </View>
          <View style={styles.summaryView}>
            <Text>Flight Tax</Text>
            <Text>{params.params.departFlight.FareDetails.ChargeableFares.Tax}</Text>
          </View>
          <View style={styles.summaryView}>
            <Text style={{fontWeight: "700", fontSize: 18}}>Total Price</Text>
            <HTML html={params.data.total} />
          </View>
          <View style={styles.summaryView}>
            <Text style={{flex: 1}}>Payment Method</Text>
            <Text style={{flex: 1, marginStart: 10}}>Credit Card/Debit Card/Net Banking</Text>
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
          <Text style={{color: "#fff", paddingHorizontal: 40}}>Go Home</Text>
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
  Heading: {fontSize: 16, fontWeight: "700"}
});

export default ThankYou;
