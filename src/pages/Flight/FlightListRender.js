import React, { PureComponent } from "react";
import { View, Image, StyleSheet, FlatList, ScrollView, Modal } from "react-native";
import { withNavigation } from "react-navigation";
import { Button, Text, Activity_Indicator, DomesticFlights } from "../../components";
import FareDetails from "./FareRules";
import Icon from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import Toast from "react-native-simple-toast";
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";
import Foundation from "react-native-vector-icons/Foundation";
import Service from "../../service";
import moment from "moment";
import SimpleToast from "react-native-simple-toast";
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
    let data = {
      airlineId: this.props.item.FlightUId,
      classCode: this.props.item.FlightSegments[0].BookingClassFare.ClassType,
      couponFare: "",
      flightId: this.props.item.FlightSegments[0].OperatingAirlineFlightNumber,
      key: this.props.item.OriginDestinationoptionId.Key,
      provider: this.props.item.Provider,
      tripType: this.props.trip_type,
      service: this.props.flight_type,
      user: "",
      userType: 5
    };
    console.log(data);
    Service.get("/Flights/GetFareRule", data)
      .then(res => {
        //  console.log(res.data);
        this.setState({ farerule: this.convertUnicode(res.data) }); //res.data
        console.log(this.convertUnicode(res.data));
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
    let dd = moment(item.FlightSegments[0].DepartureDateTime).format("HH:MM");
    let departureDate = moment(item.FlightSegments[0].DepartureDateTime).format("MMM DD");
    let ad = moment(item.FlightSegments[item.FlightSegments.length - 1].ArrivalDateTime).format(
      "HH:MM"
    );
    let arrivalDate = moment(
      item.FlightSegments[item.FlightSegments.length - 1].ArrivalDateTime
    ).format("MMM DD");
    let img = "http://webapi.i2space.co.in" + item.FlightSegments[0].ImagePath;

    return (
      <View
        style={{
          paddingVertical: index % 2 == 0 ? 30 : 10,
          backgroundColor: index % 2 == 0 ? "#FFFFFF" : "#EEF1F8"
        }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 8,
            marginBottom: 6
          }}>
          <Text style={{ color: "#636C73", fontSize: 12 }}>
            {item.FlightSegments[0].AirLineName} | {item.FlightUId}
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "700" }}>
            ₹{parseInt(item.FareDetails.TotalFare)}
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
              style={{ width: 40, height: 40, marginEnd: 4 }}
              source={{ uri: img }}
              resizeMode="cover"
            />
            <View>
              <Text style={{ fontSize: 18, lineHeight: 20 }}>{dd}</Text>
              <Text style={{ fontSize: 12, lineHeight: 14, color: "#5D646A" }}>{from}</Text>
            </View>
          </View>

          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 16, lineHeight: 20 }}>{item.FlightSegments[0].Duration}</Text>
            <Text style={{ fontSize: 12, color: "#5D646A", lineHeight: 14 }}>
              {item.FlightSegments[0].StopQuantity == 0
                ? "Non Stop"
                : item.FlightSegments[0].StopQuantity}
            </Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <View>
              <Text style={{ fontSize: 18, lineHeight: 20 }}>{ad}</Text>
              <Text style={{ fontSize: 12, color: "#5D646A", lineHeight: 14 }}>{to}</Text>
            </View>
            <Button
              style={{
                backgroundColor: "#F68E1F",
                borderRadius: 14,
                height: 28,
                marginStart: 4,
                alignSelf: "center",
                justifyContent: "center"
              }}
              onPress={this.bookNow}>
              <Text
                style={{
                  color: "#fff",
                  alignSelf: "center",
                  paddingHorizontal: 6,
                  fontSize: 12
                }}>
                Book Now
              </Text>
            </Button>
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
          <Icon name="mail" size={20} color="#F68E1F" />
          <View
            style={{
              width: 1,
              height: 20,
              backgroundColor: "#D2D2D2",
              marginHorizontal: 2
            }}></View>
          <IconMaterial name="message-text-outline" size={20} color="#F68E1F" />
          <View style={{ justifyContent: "space-between", flexDirection: "row", flex: 1 }}>
            <Button>
              <Text
                style={{
                  flex: 1,
                  marginHorizontal: 10,
                  color: "#5D666D",
                  fontSize: 12
                }}>
                Refundable
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

        {this.state.expanded && (
          <View style={{ paddingVertical: 10, backgroundColor: "#F4F4F4" }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: 8
              }}>
              <Text style={{ color: "#636C73", fontSize: 12 }}>
                {item.FlightSegments[0].AirLineName} | {item.FlightUId}
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
                  style={{ width: 40, height: 40, marginEnd: 4 }}
                  source={{ uri: img }}
                  resizeMode="cover"
                />
                <View>
                  <Text style={{ fontSize: 20, lineHeight: 22 }}>{dd}</Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#5D646A",
                      lineHeight: 14
                    }}>
                    {from}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#5D646A",
                      lineHeight: 14
                    }}>
                    {departureDate}
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
                <Text style={{ fontSize: 20, lineHeight: 22 }}>{ad}</Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#5D646A",
                    lineHeight: 14
                  }}>
                  {to}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#5D646A",
                    lineHeight: 14
                  }}>
                  {arrivalDate}
                </Text>
              </View>
              <View style={{ flex: 1, marginStart: 3 }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#5D646A",
                    alignSelf: "center",
                    flex: 1
                  }}>
                  Base Fare:122.02
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#5D646A",
                    alignSelf: "center",
                    flex: 1
                  }}>
                  Fee & SubCharges:47.23
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
                marginVertical: 5
              }}>
              <Text
                style={{
                  flex: 1,
                  marginHorizontal: 10,
                  color: "#5D666D",
                  fontSize: 12
                }}>
                {item.FlightSegments[0].Duration}
              </Text>
              <Text
                style={{
                  flex: 1,
                  marginHorizontal: 10,
                  color: "#5D666D",
                  fontSize: 12
                }}>
                With{" "}
                {item.FlightSegments[0].StopQuantity == 0
                  ? "0"
                  : item.FlightSegments[0].StopQuantity}{" "}
                connection/s
              </Text>
              <Foundation name="shopping-bag" size={18} color="#5D666D" />
              <Text
                style={{
                  flex: 1,
                  color: "#5D666D",
                  fontSize: 12,
                  marginStart: 2
                }}>
                {item.FlightSegments[0].BaggageAllowed.HandBaggage}
              </Text>
              <Foundation name="shopping-bag" size={18} color="#5D666D" />
              <Text
                style={{
                  flex: 1,
                  color: "#5D666D",
                  fontSize: 12,
                  marginStart: 2
                }}>
                {item.FlightSegments[0].BaggageAllowed.CheckInBaggage}
              </Text>
              <Text style={{ flex: 1, color: "#5D666D", fontSize: 12 }}>
                Total Fare:₹{parseInt(item.FareDetails.TotalFare)}
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
          </View>
        )}
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.showModal}
          onRequestClose={this.closeModal}>
          <FareDetails data={this.state.farerule} onBackPress={this.closeModal} />
        </Modal>
      </View>
    );
  }
}

export default withNavigation(FlightListRender);
