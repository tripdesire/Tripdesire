import React, { PureComponent } from "react";
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  ScrollView,
  Modal,
  Linking,
  Alert,
  TouchableOpacity
} from "react-native";
import { withNavigation } from "react-navigation";
import { Button, Text, ActivityIndicator, DomesticFlights, CurrencyText } from "../../components";
import FareDetails from "./FareRules";
import Icon from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import Toast from "react-native-simple-toast";
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";
import Foundation from "react-native-vector-icons/Foundation";
import { etravosApi } from "../../service";
import moment from "moment";
var newData = [];
class FlightListRender extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      showModal: false,
      farerule: ""
    };
  }
  viewDetails = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  fareRules = () => {
    this.setState({ showModal: true });
    const { item, flight_type, trip_type } = this.props;
    let body = {
      airlineId:
        flight_type == 1
          ? item.FlightSegments[0].OperatingAirlineCode
          : item.IntOnward.FlightSegments[0].OperatingAirlineCode,
      classCode:
        flight_type == 1
          ? item.FlightSegments[0].BookingClassFare.ClassType
          : item.IntOnward.FlightSegments[0].BookingClassFare.ClassType,
      couponFare:
        flight_type == 1 ? item.FlightSegments[0].RPH : item.IntOnward.FlightSegments[0].RPH,
      flightId:
        flight_type == 1
          ? item.FlightSegments[0].OperatingAirlineFlightNumber
          : item.IntOnward.FlightSegments[0].OperatingAirlineFlightNumber,
      key: item.OriginDestinationoptionId.Key,
      provider: item.Provider,
      tripType: trip_type,
      service: flight_type,
      user: "",
      userType: 5
    };
    console.log(body);
    etravosApi
      .get("/Flights/GetFareRule", body)
      .then(({ data }) => {
        //  console.log(res.data);
        this.setState({ farerule: this.convertUnicode(data) }); //res.data
        //console.log(this.convertUnicode(res.data));
      })
      .catch(error => {
        Toast.show(error, Toast.LONG);
      });
  };

  convertUnicode(input) {
    return input.replace(/\\u(\w\w\w\w)/g, function(a, b) {
      var charcode = parseInt(b, 16);
      return String.fromCharCode(charcode);
    });
  }

  closeModal = () => {
    this.setState({ showModal: false });
  };

  _email = () => {
    let email = "mailto:info@tripdesire.co";
    Linking.canOpenURL(email)
      .then(supported => {
        if (!supported) {
          Alert.alert("Email is not available");
        } else {
          Linking.openURL(email);
        }
      })
      .catch(err => console.log(err));
  };

  bookNow = () => {
    let param = {
      departFlight: this.props.item,
      from: this.props.from,
      to: this.props.to,
      travelClass: this.props.travelClass,
      className: this.props.className,
      journey_date: this.props.journey_date,
      journeyDate: this.props.journeyDate,
      adult: this.props.adult,
      child: this.props.child,
      infant: this.props.infant,
      flightType: this.props.flight_type,
      tripType: this.props.trip_type,
      sourceCode: this.props.sourceCode,
      destinationCode: this.props.destinationCode,
      sourceAirportName: this.props.sourceAirportName,
      destinationAirportName: this.props.destinationAirportName
    };
    this.props.navigation.navigate("CheckOut", param);
  };

  render() {
    const { item, index, from, to, className } = this.props;
    let dd = moment(item.FlightSegments[0].DepartureDateTime).format("HH:mm");
    let departureDate = moment(item.FlightSegments[0].DepartureDateTime).format("MMM DD");
    let ad = moment(item.FlightSegments[item.FlightSegments.length - 1].ArrivalDateTime).format(
      "HH:mm"
    );
    let arrivalDate = moment(
      item.FlightSegments[item.FlightSegments.length - 1].ArrivalDateTime
    ).format("MMM DD");
    let img = "http://webapi.i2space.co.in" + item.FlightSegments[0].ImagePath;

    return (
      <TouchableOpacity
        style={{
          marginHorizontal: 16,
          elevation: 2,
          shadowOffset: { width: 0, height: 2 },
          shadowColor: "rgba(0,0,0,0.1)",
          shadowOpacity: 1,
          shadowRadius: 4,
          marginTop: 16,
          borderRadius: 8,
          paddingTop: 10,
          // paddingVertical: index % 2 == 0 ? 30 : 10,
          backgroundColor: "#fff"
          //  backgroundColor: index % 2 == 0 ? "#FFFFFF" : "#EEF1F8"
        }}
        onPress={this.bookNow}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 8
          }}>
          <Text style={{ color: "#5D666D", fontSize: 12 }}>
            {item.FlightSegments[0].AirLineName} |{" "}
            {item.FlightSegments[0].OperatingAirlineCode +
              "-" +
              item.FlightSegments[0].OperatingAirlineFlightNumber}
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "700" }}>
            <CurrencyText style={{ fontSize: 18, fontWeight: "bold" }}>₹ </CurrencyText>
            {parseInt(item.FareDetails.TotalFare)}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 8,
            justifyContent: "space-between",
            alignItems: "center"
          }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              style={{ width: 40, height: 40, marginEnd: 10 }}
              source={{ uri: img || "https://via.placeholder.com/150" }}
              resizeMode="contain"
            />
            <View>
              <Text style={{ fontSize: 18, lineHeight: 20 }}>{dd}</Text>
              <Text
                style={{
                  fontSize: 12,
                  lineHeight: 14,
                  //  color: "#000",
                  textTransform: "capitalize"
                }}>
                {from}
              </Text>
            </View>
          </View>

          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 16, lineHeight: 20 }}>
              {item.FlightSegments.length == 1
                ? item.FlightSegments[0].Duration
                : item.FlightSegments[item.FlightSegments.length - 1].AccumulatedDuration}
            </Text>
            <Text style={{ fontSize: 12, color: "#5D666D", lineHeight: 14 }}>
              {item.FlightSegments.length - 1 == 0
                ? "Non Stop"
                : item.FlightSegments.length - 1 + " Stop(s)"}
            </Text>
          </View>

          <View>
            <Text style={{ fontSize: 18, lineHeight: 20, textAlign: "right" }}>{ad}</Text>
            <Text
              style={{
                fontSize: 12,
                // color: "#5D666D",
                lineHeight: 14,
                textTransform: "capitalize"
              }}>
              {to}
            </Text>
          </View>
        </View>
        <View
          style={{
            height: 1,
            marginHorizontal: 8,
            backgroundColor: "#D0D3DA",
            marginTop: 10
          }}></View>
        <View
          style={{
            marginHorizontal: 8,
            flexDirection: "row",
            marginVertical: 5
          }}>
          <Button onPress={this._email}>
            <Icon name="mail" size={20} color="#F68E1F" />
          </Button>
          {/* <View
            style={{
              width: 1,
              height: 20,
              backgroundColor: "#D2D2D2",
              marginHorizontal: 2
            }}></View>
          <IconMaterial name="message-text-outline" size={20} color="#F68E1F" /> */}
          <View style={{ justifyContent: "space-between", flexDirection: "row", flex: 1 }}>
            <Button>
              <Text
                style={{
                  flex: 1,
                  marginHorizontal: 10,
                  color: "green",
                  fontSize: 12
                }}>
                {item.FlightSegments[0].BookingClassFare.Rule}
              </Text>
            </Button>
            <Button onPress={this.fareRules}>
              <Text style={{ flex: 1, color: "#5D666D", fontSize: 12 }}>Fare Rules</Text>
            </Button>
            <Button onPress={this.viewDetails}>
              {this.state.expanded == false && (
                <Text style={{ flex: 1, color: "#5D666D", fontSize: 12 }}>+View Details</Text>
              )}
              {this.state.expanded == true && (
                <Text style={{ flex: 1, color: "#5D666D", fontSize: 12 }}>-Hide Details</Text>
              )}
            </Button>
          </View>
        </View>

        {this.state.expanded &&
          item.FlightSegments.map((itemEach, index) => {
            return (
              <View
                style={{ paddingVertical: 10, backgroundColor: "#F4F4F4" }}
                key={"_Seg" + index}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginHorizontal: 8
                  }}>
                  <Text style={{ color: "#636C73", fontSize: 12 }}>
                    {itemEach.AirLineName} |{" "}
                    {itemEach.OperatingAirlineCode + "-" + itemEach.OperatingAirlineFlightNumber}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    marginHorizontal: 8,
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                  <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                    <Image
                      style={{ width: 40, height: 40, marginEnd: 4 }}
                      source={{ uri: "http://webapi.i2space.co.in" + itemEach.ImagePath }}
                      resizeMode="contain"
                    />
                    <View>
                      <Text style={{ fontSize: 20, lineHeight: 22 }}>
                        {moment(itemEach.DepartureDateTime).format("HH:mm")}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          // color: "#5D646A",
                          lineHeight: 14
                        }}>
                        {itemEach.IntDepartureAirportName}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#5D646A",
                          lineHeight: 14
                        }}>
                        {moment(itemEach.DepartureDateTime).format("MMM DD")}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      marginHorizontal: 2,
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#5D646A",
                        marginHorizontal: 3
                      }}>
                      {className}
                    </Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 20, lineHeight: 22 }}>
                      {moment(itemEach.ArrivalDateTime).format("HH:mm")}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        // color: "#5D646A",
                        lineHeight: 14
                      }}>
                      {itemEach.IntArrivalAirportName}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#5D646A",
                        lineHeight: 14
                      }}>
                      {moment(itemEach.ArrivalDateTime).format("MMM DD")}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    borderStyle: "dashed",
                    borderWidth: 1,
                    marginHorizontal: 8,
                    borderColor: "#D0D3DA",
                    borderRadius: 0.5,
                    marginTop: 10
                  }}></View>
                <View
                  style={{
                    flexDirection: "row",
                    marginVertical: 5,
                    flex: 1,
                    marginHorizontal: 8,
                    justifyContent: "space-between"
                  }}>
                  <Text
                    style={{
                      color: "#5D666D",
                      fontSize: 12
                    }}>
                    {itemEach.Duration}
                  </Text>
                  <Text
                    style={{
                      marginHorizontal: 10,
                      color: "#5D666D",
                      fontSize: 12
                    }}>
                    With{" "}
                    {item.FlightSegments.length - 1 == 0
                      ? "0 "
                      : item.FlightSegments.length - 1 + " "}
                    connection/s
                  </Text>
                  <Foundation name="shopping-bag" size={18} color="#5D666D" />
                  <Text
                    style={{
                      color: "#5D666D",
                      fontSize: 12,
                      marginStart: 2
                    }}>
                    {itemEach.BaggageAllowed.HandBaggage != ""
                      ? itemEach.BaggageAllowed.HandBaggage
                      : 0}
                  </Text>
                  <Foundation name="shopping-bag" size={18} color="#5D666D" />
                  <Text
                    style={{
                      color: "#5D666D",
                      fontSize: 12,
                      marginStart: 2
                    }}>
                    {itemEach.BaggageAllowed.CheckInBaggage}
                  </Text>
                </View>
                <View
                  style={{
                    borderStyle: "dashed",
                    borderWidth: 1,
                    marginHorizontal: 8,
                    borderColor: "#D0D3DA",
                    borderRadius: 0.5
                  }}></View>

                {item.FlightSegments.length - 1 != index && (
                  <Text style={{ marginHorizontal: 8, marginVertical: 10, color: "green" }}>
                    Change of Planes at{" "}
                    <Text style={{ fontSize: 16, fontWeight: "700" }}>
                      {" "}
                      {itemEach.IntArrivalAirportName}
                    </Text>{" "}
                    | Connection Time:
                    <Text style={{ fontSize: 16, fontWeight: "700" }}>
                      {" "}
                      {item.FlightSegments[index + 1].GroundTime}
                    </Text>
                  </Text>
                )}

                {item.FlightSegments.length - 1 == index && (
                  <View style={{ alignItems: "flex-start", marginStart: 8 }}>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#5D646A",
                        lineHeight: 14,
                        flex: 1,
                        marginTop: 5
                      }}>
                      Base Fare : <CurrencyText style={{ fontSize: 12 }}>₹ </CurrencyText>
                      {item.FareDetails.ChargeableFares.ActualBaseFare}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        lineHeight: 14,
                        color: "#5D646A",
                        flex: 1
                      }}>
                      Tax : <CurrencyText style={{ fontSize: 12 }}>₹ </CurrencyText>
                      {item.FareDetails.ChargeableFares.Tax}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        lineHeight: 14,
                        color: "#5D646A",
                        flex: 1
                      }}>
                      Fee & Surcharges : <CurrencyText style={{ fontSize: 12 }}>₹ </CurrencyText>
                      {item.FareDetails.ChargeableFares.Conveniencefee}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        lineHeight: 14,
                        color: "#5D646A",
                        flex: 1
                      }}>
                      Total Fare : <CurrencyText style={{ fontSize: 12 }}>₹ </CurrencyText>
                      {parseInt(item.FareDetails.TotalFare)}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.showModal}
          onRequestClose={this.closeModal}>
          <FareDetails data={this.state.farerule} onBackPress={this.closeModal} />
        </Modal>
      </TouchableOpacity>
    );
  }
}

export default withNavigation(FlightListRender);
