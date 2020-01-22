import React, { PureComponent } from "react";
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Modal,
  Linking,
  Alert
} from "react-native";
import { Button, Text, ActivityIndicator, DomesticFlights } from "../../components";
import Icon from "react-native-vector-icons/AntDesign";
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";
import Foundation from "react-native-vector-icons/Foundation";
import { etravosApi } from "../../service";
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
  }

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
    etravosApi
      .get("/Flights/GetFareRule", body)
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

  render() {
    let dd = moment(this.props.item.FlightSegments[0].DepartureDateTime).format("HH:mm");
    let departureDate = moment(this.props.item.FlightSegments[0].DepartureDateTime).format(
      "MMM DD"
    );
    let ad = moment(
      this.props.item.FlightSegments[this.props.item.FlightSegments.length - 1].ArrivalDateTime
    ).format("HH:mm");
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
          paddingTop: 10,
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
            {this.props.item.FlightSegments[0].AirLineName} |{" "}
            {this.props.item.FlightSegments[0].OperatingAirlineCode +
              "-" +
              this.props.item.FlightSegments[0].OperatingAirlineFlightNumber}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 8
          }}>
          <View style={{ alignItems: "center", flexDirection: "row" }}>
            <Image
              style={{ width: 40, height: 40, marginEnd: 10 }}
              source={{ uri: img }}
              resizeMode="contain"
            />
            <View>
              <Text style={{ fontSize: 20, lineHeight: 22 }}>{dd}</Text>
              <Text
                style={{
                  fontSize: 12,
                  // color: "#5D646A",
                  lineHeight: 14
                }}>
                {from}
              </Text>
            </View>
          </View>
          <View>
            <Text style={{ fontSize: 16, lineHeight: 20 }}>
              {this.props.item.FlightSegments.length == 1
                ? this.props.item.FlightSegments[0].Duration
                : this.props.item.FlightSegments[this.props.item.FlightSegments.length - 1]
                    .AccumulatedDuration}
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
                //color: "#5D646A",
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

        {this.state.expanded &&
          this.props.item.FlightSegments.map((itemEach, index) => {
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
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}>
                  <View style={{ alignItems: "flex-start", flexDirection: "row" }}>
                    <Image
                      style={{ width: 40, height: 40, marginEnd: 6 }}
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
                    justifyContent: "space-between",
                    marginHorizontal: 8,
                    flex: 1
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
                    {this.props.item.FlightSegments.length - 1 == 0
                      ? "0 "
                      : this.props.item.FlightSegments.length - 1 + " Stop(s) "}
                    connection/s
                  </Text>
                  <Foundation name="shopping-bag" size={18} color="#5D666D" />
                  <Text
                    style={{
                      color: "#5D666D",
                      fontSize: 12,
                      marginStart: 2
                    }}>
                    {itemEach.BaggageAllowed.HandBaggage != 0
                      ? itemEach.BaggageAllowed.HandBaggage
                      : "0KG"}
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

                {this.props.item.FlightSegments.length - 1 != index && (
                  <Text style={{ marginHorizontal: 8, marginVertical: 10, color: "green" }}>
                    Change of Planes at{" "}
                    <Text style={{ fontSize: 16, fontWeight: "700" }}>
                      {" "}
                      {itemEach.IntArrivalAirportName}
                    </Text>{" "}
                    | Connection Time:
                    <Text style={{ fontSize: 16, fontWeight: "700" }}>
                      {" "}
                      {this.props.item.FlightSegments[index + 1].GroundTime}
                    </Text>
                  </Text>
                )}

                {this.props.item.FlightSegments.length - 1 == index && (
                  <View style={{ flex: 1, marginStart: 8, alignItems: "flex-start", marginTop: 5 }}>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#5D646A",
                        lineHeight: 14
                      }}>
                      Base Fare : ₹{this.props.item.FareDetails.ChargeableFares.ActualBaseFare}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#5D646A",
                        lineHeight: 14
                      }}>
                      Tax : ₹{this.props.item.FareDetails.ChargeableFares.Tax}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#5D646A",
                        lineHeight: 14
                      }}>
                      Fee & SubCharges : ₹
                      {this.props.item.FareDetails.ChargeableFares.Conveniencefee}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#5D646A",
                        lineHeight: 14
                      }}>
                      Total Fare:₹{parseInt(this.props.item.FareDetails.TotalFare)}
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

export default RenderDomesticRound;
