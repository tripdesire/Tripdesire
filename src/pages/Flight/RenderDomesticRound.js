import React, { PureComponent } from "react";
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Modal
} from "react-native";
import { Button, Text, Activity_Indicator, DomesticFlights } from "../../components";
import Icon from "react-native-vector-icons/AntDesign";
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";
import Foundation from "react-native-vector-icons/Foundation";
import Service from "../../service";
import FareDetails from "./FareRules";
import moment from "moment";
import Toast from "react-native-simple-toast";
class RenderDomesticRound extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      showModal: false,
      farerule: ""
    };
    //  console.log(this.props);
  }

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
    //  console.log(data);
    Service.get("/Flights/GetFareRule", data)
      .then(res => {
        // console.log(res.data);
        this.setState({ farerule: this.convertUnicode(res.data) }); //res.data
        // console.log(this.convertUnicode(res.data));
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

  toggle = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  _onpress = () => {
    const { item, index } = this.props;
    this.props.getDomesticFlights(item, index);
  };

  render() {
    let dd = moment(this.props.item.FlightSegments[0].DepartureDateTime).format("HH:MM");
    let departureDate = moment(this.props.item.FlightSegments[0].DepartureDateTime).format(
      "MMM DD"
    );
    let ad = moment(
      this.props.item.FlightSegments[this.props.item.FlightSegments.length - 1].ArrivalDateTime
    ).format("HH:MM");
    let arrivalDate = moment(
      this.props.item.FlightSegments[this.props.item.FlightSegments.length - 1].ArrivalDateTime
    ).format("MMM DD");
    let img = "http://webapi.i2space.co.in" + this.props.item.FlightSegments[0].ImagePath;
    const { from, to, className, selected } = this.props;
    return (
      <TouchableOpacity
        style={{
          borderColor: "#EEF1F8",
          borderWidth: 1,
          paddingVertical: 10,
          borderRadius: 5,
          marginVertical: 5,
          backgroundColor: selected ? "#EEF1F8" : "#FFFFFF"
        }}
        onPress={this._onpress}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 8
          }}>
          <Text style={{ color: "#636C73", fontSize: 12 }}>
            {this.props.item.FlightSegments[0].AirLineName} | {this.props.item.FlightUId}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 8,
            justifyContent: "space-around"
          }}>
          <View style={{ alignItems: "center", flexDirection: "row" }}>
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
            </View>
          </View>
          <View>
            <Text style={{ fontSize: 16, lineHeight: 20 }}>
              {this.props.item.FlightSegments[0].Duration}
            </Text>
            <Text style={{ fontSize: 12, color: "#5D646A", lineHeight: 14 }}>
              {this.props.item.FlightSegments.length - 1 == 0
                ? "Non Stop"
                : this.props.item.FlightSegments.length - 1 + " Stop(s)"}
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
          </View>
          <Text style={{ fontSize: 18, fontWeight: "700" }}>
            ₹{parseInt(this.props.item.FareDetails.TotalFare)}
          </Text>
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
                {this.props.item.FlightSegments[0].BookingClassFare.Rule}
              </Text>
            </Button>
            <Button onPress={this.fareRules}>
              <Text style={{ flex: 1, color: "#5D666D", fontSize: 12 }}>Fare Rules</Text>
            </Button>
            <Button onPress={this.toggle}>
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
                {this.props.item.FlightSegments[0].AirLineName} | {this.props.item.FlightUId}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                marginHorizontal: 8,
                alignItems: "center",
                justifyContent: "space-between"
              }}>
              <View style={{ alignItems: "center", flexDirection: "row" }}>
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
              <View>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#5D646A",
                    lineHeight: 20,
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
                {this.props.item.FlightSegments[0].Duration}
              </Text>
              <Text
                style={{
                  flex: 1,
                  marginHorizontal: 10,
                  color: "#5D666D",
                  fontSize: 12
                }}>
                With{" "}
                {this.props.item.FlightSegments.length - 1 == 0
                  ? "0 "
                  : this.props.item.FlightSegments.length - 1 + " Stop(s) "}
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
                {this.props.item.FlightSegments[0].BaggageAllowed.HandBaggage}
              </Text>
              <Foundation name="shopping-bag" size={18} color="#5D666D" />
              <Text
                style={{
                  flex: 1,
                  color: "#5D666D",
                  fontSize: 12,
                  marginStart: 2
                }}>
                {this.props.item.FlightSegments[0].BaggageAllowed.CheckInBaggage}
              </Text>
              <Text style={{ flex: 1, color: "#5D666D", fontSize: 12 }}>
                Total Fare:₹{parseInt(this.props.item.FareDetails.TotalFare)}
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
      </TouchableOpacity>
    );
  }
}

export default RenderDomesticRound;
