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
import { Button, Text, ActivityIndicator, InternationalFlights } from "../../components";
import Icon from "react-native-vector-icons/AntDesign";
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";
import Foundation from "react-native-vector-icons/Foundation";
import { withNavigation } from "react-navigation";
import FareDetails from "./FareRules";
import { etravosApi } from "../../service";
import moment from "moment";
var newData = [];
class FlightListInternational extends React.PureComponent {
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
    let data = {
      airlineId: this.props.item.FlightUId,
      classCode: this.props.item.IntOnward.FlightSegments[0].BookingClassFare.ClassType,
      couponFare: "",
      flightId: this.props.item.IntOnward.FlightSegments[0].OperatingAirlineFlightNumber,
      key: this.props.item.OriginDestinationoptionId.Key,
      provider: this.props.item.Provider,
      tripType: this.props.trip_type,
      service: this.props.flight_type,
      user: "",
      userType: 5
    };
    //  console.log(data);
    etravosApi
      .get("/Flights/GetFareRule", data)
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

  bookNow = value => {
    let param = {
      departFlight: value,
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
    console.log(param);
    this.props.navigation.navigate("CheckOut", param);
  };

  render() {
    let dd = moment
      .utc(this.props.item.IntOnward.FlightSegments[0].DepartureDateTimeZone)
      .format("HH:mm");
    let departureTime = moment(
      this.props.item.IntOnward.FlightSegments[0].DepartureDateTime
    ).format("MMM DD");
    let ad = moment(
      this.props.item.IntOnward.FlightSegments[this.props.item.IntOnward.FlightSegments.length - 1]
        .ArrivalDateTime
    ).format("HH:mm");
    let arrivalTime = moment(
      this.props.item.IntOnward.FlightSegments[this.props.item.IntOnward.FlightSegments.length - 1]
        .ArrivalDateTime
    ).format("MMM DD");
    let img = "http://webapi.i2space.co.in" + this.props.item.IntOnward.FlightSegments[0].ImagePath;

    const { from, to, className } = this.props;
    return (
      <TouchableOpacity
        style={{
          paddingVertical: this.props.index % 2 == 0 ? 30 : 10,
          backgroundColor: this.props.index % 2 == 0 ? "#FFFFFF" : "#EEF1F8"
        }}
        onPress={() => this.bookNow(this.props.item)}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 8
          }}>
          <Text style={{ color: "#636C73", fontSize: 12, flex: 1, paddingEnd: 10 }}>
            {this.props.item.IntOnward.FlightSegments[0].AirLineName} | {this.props.item.FlightUId}
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "700" }}>
            ₹{parseInt(this.props.item.FareDetails.TotalFare)}
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
              resizeMode="contain"
              source={{ uri: img }}
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
              {
                this.props.item.IntOnward.FlightSegments[
                  this.props.item.IntOnward.FlightSegments.length - 1
                ].AccumulatedDuration
              }
            </Text>
            <Text style={{ fontSize: 12, color: "#5D646A", lineHeight: 14 }}>
              {this.props.item.IntOnward.FlightSegments.length - 1 == 0
                ? "Non Stop"
                : this.props.item.IntOnward.FlightSegments.length - 1 + " Stop(s)"}
            </Text>
          </View>
          {/* <View style={{ flexDirection: "row" }}> */}
          <View>
            <Text style={{ fontSize: 20, lineHeight: 22, textAlign: "right" }}>{ad}</Text>
            <Text
              style={{
                fontSize: 12,
                color: "#5D646A",
                lineHeight: 14
              }}>
              {to}
            </Text>
          </View>
          {/* <Button
              style={{
                backgroundColor: "#F68E1F",
                borderRadius: 14,
                height: 28,
                marginStart: 4,
                alignSelf: "center",
                justifyContent: "center"
              }}
              onPress={() => this.bookNow(this.props.item)}>
              <Text
                style={{
                  color: "#fff",
                  alignSelf: "center",
                  paddingHorizontal: 6,
                  fontSize: 10
                }}>
                Book Now
              </Text>
            </Button> */}
          {/* </View> */}
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
                  color: "#5D666D",
                  fontSize: 12
                }}>
                {this.props.item.IntOnward.FlightSegments[0].BookingClassFare.Rule}
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
          this.props.item.IntOnward.FlightSegments.map((itemEach, index) => {
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
                    {itemEach.AirLineName} | {this.props.item.FlightUId}
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
                      source={{
                        uri: "http://webapi.i2space.co.in" + itemEach.ImagePath
                      }}
                      resizeMode="contain"
                    />
                    <View>
                      <Text style={{ fontSize: 20, lineHeight: 22 }}>
                        {moment(itemEach.DepartureDateTime).format("HH:mm")}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#5D646A",
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
                      marginHorizontal: 2
                    }}>
                    <Text style={{ fontSize: 12, color: "#5D646A", lineHeight: 20 }}>
                      {className}
                    </Text>
                  </View>
                  <View style={{ marginHorizontal: 8 }}>
                    <Text style={{ fontSize: 20, lineHeight: 22 }}>
                      {moment(itemEach.ArrivalDateTime).format("HH:mm")}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#5D646A",
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
                    marginHorizontal: 8,
                    flexDirection: "row",
                    marginVertical: 5,
                    justifyContent: "space-between"
                  }}>
                  <Text
                    style={{
                      marginEnd: 10,
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
                    {this.props.item.IntOnward.FlightSegments.length - 1 == 0
                      ? "0 "
                      : this.props.item.IntOnward.FlightSegments.length - 1 + " "}
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
                      : 0 + " PC(s)"}
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

                {this.props.item.IntOnward.FlightSegments.length - 1 != index && (
                  <Text style={{ marginHorizontal: 8, marginVertical: 10, color: "green" }}>
                    Change of Planes at{" "}
                    <Text style={{ fontSize: 16, fontWeight: "700" }}>
                      {" "}
                      {itemEach.IntArrivalAirportName}
                    </Text>{" "}
                    | Connection Time:
                    <Text style={{ fontSize: 16, fontWeight: "700" }}>
                      {" "}
                      {this.props.item.IntOnward.FlightSegments[index + 1].GroundTime}
                    </Text>
                  </Text>
                )}

                {this.props.item.IntOnward.FlightSegments.length - 1 == index && (
                  <View
                    style={{
                      flex: 1,
                      alignItems: "flex-start",
                      marginTop: 5,
                      marginHorizontal: 8
                    }}>
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

export default withNavigation(FlightListInternational);
