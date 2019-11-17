import React, { PureComponent } from "react";
import { View, Image, StyleSheet, FlatList, ScrollView } from "react-native";
import { withNavigation } from "react-navigation";
import { Button, Text, Activity_Indicator, DomesticFlights } from "../../components";
import Icon from "react-native-vector-icons/AntDesign";
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";
import Foundation from "react-native-vector-icons/Foundation";
import Service from "../../service";
import moment from "moment";
var newData = [];
class FlightListRender extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
  }
  toggle = () => {
    this.setState({ expanded: !this.state.expanded });
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
    this.props.navigation.navigate("CheckOut", param);
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

    const { from, to, className } = this.props;
    return (
      <View
        style={{
          paddingVertical: this.props.index % 2 == 0 ? 30 : 10,
          backgroundColor: this.props.index % 2 == 0 ? "#FFFFFF" : "#EEF1F8"
        }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 8,
            marginBottom: 6
          }}>
          <Text style={{ color: "#636C73", fontSize: 12 }}>
            {this.props.item.FlightSegments[0].AirLineName} | {this.props.item.FlightUId}
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
            <Text style={{ fontSize: 16, lineHeight: 20 }}>
              {this.props.item.FlightSegments[0].Duration}
            </Text>
            <Text style={{ fontSize: 12, color: "#5D646A", lineHeight: 14 }}>
              {this.props.item.FlightSegments[0].StopQuantity == 0
                ? "Non Stop"
                : this.props.item.FlightSegments[0].StopQuantity}
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
          <Text
            style={{
              flex: 1,
              marginHorizontal: 10,
              color: "#5D666D",
              fontSize: 12
            }}>
            Refundable
          </Text>
          <Text style={{ flex: 1, color: "#5D666D", fontSize: 12 }}>Fare Rules</Text>
          <Button onPress={this.toggle}>
            {this.state.expanded == false && (
              <Text style={{ flex: 1, color: "#5D666D", fontSize: 12 }}>+View Details</Text>
            )}
            {this.state.expanded == true && (
              <Text style={{ flex: 1, color: "#5D666D", fontSize: 12 }}>-Hide Details</Text>
            )}
          </Button>
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
                  <Text
                    style={{
                      fontSize: 20,
                      lineHeight: 22
                    }}>
                    {dd}
                  </Text>
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
                {this.props.item.FlightSegments[0].StopQuantity == 0
                  ? "0"
                  : this.props.item.FlightSegments[0].StopQuantity}{" "}
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
      </View>
    );
  }
}

export default withNavigation(FlightListRender);
