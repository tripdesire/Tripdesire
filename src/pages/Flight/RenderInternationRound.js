import React, { PureComponent } from "react";
import {
  Dimensions,
  View,
  Image,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Modal
} from "react-native";
import { Button, Text, Activity_Indicator, DomesticFlights } from "../../components";
import { withNavigation } from "react-navigation";
import Icon from "react-native-vector-icons/AntDesign";
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";
import Foundation from "react-native-vector-icons/Foundation";
import Service from "../../service";
import Toast from "react-native-simple-toast";
import FareDetails from "./FareRules";
import moment from "moment";
class RenderInternationRound extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      expandedReturn: false,
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
      tripType: this.props.TripType,
      service: this.props.FlightType,
      user: "",
      userType: 5
    };
    // console.log(data);
    Service.get("/Flights/GetFareRule", data)
      .then(res => {
        //   console.log(res.data);
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

  toggleReturn = () => {
    this.setState({ expandedReturn: !this.state.expandedReturn });
  };

  _BookNow = value => {
    let param = {
      departFlight: value,
      from: this.props.from,
      to: this.props.to,
      className: this.props.className,
      travelClass: this.props.travelClass,
      journey_date: this.props.journey_date,
      return_date: this.props.return_date,
      journeyDate: this.props.journeyDate,
      returnDate: this.props.returnDate,
      adult: this.props.Adult,
      child: this.props.Child,
      infant: this.props.Infant,
      flightType: this.props.FlightType,
      tripType: this.props.TripType,
      sourceCode: this.props.sourceCode,
      destinationCode: this.props.destinationCode,
      sourceAirportName: this.props.sourceAirportName,
      destinationAirportName: this.props.destinationAirportName
    };
    this.props.navigation.navigate("CheckOut", param);
  };

  render() {
    const { width, height } = Dimensions.get("window");
    let dd = moment(this.props.item.IntOnward.FlightSegments[0].DepartureDateTime).format("HH:MM");
    let ddRet = moment(this.props.item.IntReturn.FlightSegments[0].DepartureDateTime).format(
      "HH:MM"
    );
    let departureDate = moment(
      this.props.item.IntOnward.FlightSegments[0].DepartureDateTime
    ).format("MMM DD");
    let departureDateReturn = moment(
      this.props.item.IntReturn.FlightSegments[0].DepartureDateTime
    ).format("MMM DD");
    let ad = moment(
      this.props.item.IntOnward.FlightSegments[this.props.item.IntOnward.FlightSegments.length - 1]
        .ArrivalDateTime
    ).format("HH:MM");
    let adReturn = moment(
      this.props.item.IntReturn.FlightSegments[this.props.item.IntReturn.FlightSegments.length - 1]
        .ArrivalDateTime
    ).format("HH:MM");
    let arrivalDate = moment(
      this.props.item.IntOnward.FlightSegments[this.props.item.IntOnward.FlightSegments.length - 1]
        .ArrivalDateTime
    ).format("MMM DD");
    let arrivalDateReturn = moment(
      this.props.item.IntReturn.FlightSegments[this.props.item.IntReturn.FlightSegments.length - 1]
        .ArrivalDateTime
    ).format("MMM DD");
    let img = "http://webapi.i2space.co.in" + this.props.item.IntOnward.FlightSegments[0].ImagePath;
    let imgReturn =
      "http://webapi.i2space.co.in" + this.props.item.IntReturn.FlightSegments[0].ImagePath;
    const { from, to, className } = this.props;
    return (
      <View
        style={{
          paddingVertical: 10,
          backgroundColor: this.props.index % 2 == 0 ? "#FFFFFF" : "#EEF1F8"
        }}>
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 16,
            marginBottom: 10
          }}>
          <Image style={{ width: 35, resizeMode: "contain" }} source={{ uri: img }} />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              flex: 1,
              alignItems: "center"
            }}>
            <Text style={{ marginStart: 10 }}>
              {this.props.item.IntOnward.FlightSegments[0].AirLineName}
            </Text>
            <View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700"
                }}>
                $ {this.props.item.FareDetails.TotalFare}
              </Text>
              <Button
                style={{
                  backgroundColor: "#F68E1F",
                  borderRadius: 15,
                  height: 30,
                  alignSelf: "center",
                  justifyContent: "center"
                }}
                onPress={() => this._BookNow(this.props.item)}>
                <Text
                  style={{
                    color: "#fff",
                    alignSelf: "center",
                    paddingHorizontal: 10
                  }}>
                  Book Now
                </Text>
              </Button>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 16
          }}>
          <Text style={{ color: "#636C73", fontSize: 12 }}>
            Depart - {this.props.item.IntOnward.FlightSegments[0].AirLineName} |{" "}
            {this.props.item.FlightUId}
          </Text>
        </View>
        <View style={{ flexDirection: "row", marginHorizontal: 16 }}>
          <Image style={{ width: 35, resizeMode: "contain" }} source={{ uri: img }} />
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              flex: 1,
              marginStart: 10
            }}>
            <View>
              <Text style={{ fontSize: 20, alignItems: "flex-start" }}>{dd}</Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "#5D646A",
                  alignSelf: "flex-start"
                }}>
                {from}
              </Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 16 }}>
                {this.props.item.IntOnward.FlightSegments[0].Duration}
              </Text>
              <View
                style={{
                  backgroundColor: "#5D646A",
                  height: 1.35,
                  width: width / 5
                }}></View>
              <Text style={{ fontSize: 12, color: "#5D646A", alignSelf: "center" }}>
                {this.props.item.IntOnward.FlightSegments.length - 1 == 0
                  ? "Non Stop"
                  : this.props.item.IntOnward.FlightSegments.length - 1 + " Stop(s) "}
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: 20, alignItems: "flex-start" }}>{ad}</Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "#5D646A",
                  alignSelf: "flex-start"
                }}>
                {to}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            height: 1,
            marginHorizontal: 16,
            backgroundColor: "#D0D3DA",
            marginTop: 10
          }}></View>
        <View
          style={{
            marginHorizontal: 16,
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
                <Text style={{ flex: 1, color: "#5D666D", fontSize: 12 }}>+Hide Details</Text>
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
                marginHorizontal: 16
              }}>
              <Text style={{ color: "#636C73", fontSize: 12 }}>
                {this.props.item.IntOnward.FlightSegments[0].AirLineName} |{" "}
                {this.props.item.FlightUId}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                marginHorizontal: 16,
                justifyContent: "space-around"
              }}>
              <Image
                style={{
                  width: 35,
                  resizeMode: "contain",
                  alignItems: "flex-start",
                  justifyContent: "flex-start"
                }}
                source={{ uri: img }}
              />
              <View style={{ marginHorizontal: 8 }}>
                <Text style={{ fontSize: 20, alignSelf: "flex-start" }}>{dd}</Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#5D646A",
                    alignSelf: "flex-start"
                  }}>
                  {from}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#5D646A",
                    alignSelf: "flex-start"
                  }}>
                  {departureDate}
                </Text>
              </View>
              <View
                style={{
                  marginHorizontal: 2,
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                <Text style={{ fontSize: 12, color: "#5D646A" }}>{className}</Text>
              </View>
              <View style={{ marginHorizontal: 8 }}>
                <Text style={{ fontSize: 20, alignSelf: "flex-start" }}>{ad}</Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#5D646A",
                    alignSelf: "flex-start"
                  }}>
                  {to}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#5D646A",
                    alignSelf: "flex-start"
                  }}>
                  {arrivalDate}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
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
                  Free & SubCharges:47.23
                </Text>
              </View>
            </View>
            <View
              style={{
                borderStyle: "dashed",
                borderWidth: 1,
                marginHorizontal: 16,
                borderColor: "#D0D3DA",
                borderRadius: 0.5,
                marginTop: 10
              }}></View>
            <View
              style={{
                marginHorizontal: 16,
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
                {this.props.item.IntOnward.FlightSegments[0].Duration}
              </Text>
              <Text
                style={{
                  flex: 1,
                  marginHorizontal: 10,
                  color: "#5D666D",
                  fontSize: 12
                }}>
                With{" "}
                {this.props.item.IntOnward.FlightSegments.length - 1 == 0
                  ? "Non Stop"
                  : this.props.item.IntOnward.FlightSegments.length - 1 + " "}
                connection/s
              </Text>
              <Foundation name="shopping-bag" size={24} color="#5D666D" />
              <Text style={{ flex: 1, color: "#5D666D", fontSize: 12 }}>
                {this.props.item.IntOnward.FlightSegments[0].BaggageAllowed.HandBaggage}
              </Text>
              <Foundation name="shopping-bag" size={24} color="#5D666D" />
              <Text style={{ flex: 1, color: "#5D666D", fontSize: 12 }}>
                {this.props.item.IntOnward.FlightSegments[0].BaggageAllowed.CheckInBaggage}
              </Text>
              <Text style={{ flex: 1, color: "#5D666D", fontSize: 12 }}>
                Total Fare:₹{parseInt(this.props.item.FareDetails.TotalFare)}
              </Text>
            </View>
            <View
              style={{
                borderStyle: "dashed",
                borderWidth: 1,
                marginHorizontal: 16,
                borderColor: "#D0D3DA",
                borderRadius: 0.5
              }}></View>
          </View>
        )}
        <View
          style={{
            borderStyle: "dashed",
            borderWidth: 1,
            marginHorizontal: 16,
            marginVertical: 10,
            borderColor: "#D0D3DA",
            borderRadius: 0.5
          }}></View>
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginHorizontal: 16
            }}>
            <Text style={{ color: "#636C73", fontSize: 12 }}>
              Return - {this.props.item.IntReturn.FlightSegments[0].AirLineName} |{" "}
              {this.props.item.FlightUId}
            </Text>
          </View>
          <View style={{ flexDirection: "row", marginHorizontal: 16 }}>
            <Image style={{ width: 35, resizeMode: "contain" }} source={{ uri: imgReturn }} />
            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
                flex: 1,
                marginStart: 10
              }}>
              <View>
                <Text style={{ fontSize: 20, alignItems: "flex-start" }}>{ddRet}</Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#5D646A",
                    alignSelf: "flex-start"
                  }}>
                  {to}
                </Text>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text style={{ fontSize: 16 }}>
                  {this.props.item.IntReturn.FlightSegments[0].Duration}
                </Text>
                <View
                  style={{
                    backgroundColor: "#5D646A",
                    height: 1.35,
                    width: width / 5
                  }}></View>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#5D646A",
                    alignSelf: "center"
                  }}>
                  {this.props.item.IntReturn.FlightSegments.length - 1 == 0
                    ? "Non Stop"
                    : this.props.item.IntReturn.FlightSegments.length - 1 + " Stop(s) "}
                </Text>
              </View>
              <View>
                <Text style={{ fontSize: 20, alignItems: "flex-start" }}>{adReturn}</Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#5D646A",
                    alignSelf: "flex-start"
                  }}>
                  {from}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              height: 1,
              marginHorizontal: 16,
              backgroundColor: "#D0D3DA",
              marginTop: 10
            }}></View>
          <View
            style={{
              marginHorizontal: 16,
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
                  {this.props.item.IntReturn.FlightSegments[0].BookingClassFare.Rule}
                </Text>
              </Button>
              <Button onPress={this.fareRules}>
                <Text style={{ flex: 1, color: "#5D666D", fontSize: 12 }}>Fare Rules</Text>
              </Button>
              <Button onPress={this.toggleReturn}>
                {this.state.expandedReturn == false && (
                  <Text style={{ flex: 1, color: "#5D666D", fontSize: 12 }}>+View Details</Text>
                )}
                {this.state.expandedReturn == true && (
                  <Text style={{ flex: 1, color: "#5D666D", fontSize: 12 }}>+Hide Details</Text>
                )}
              </Button>
            </View>
          </View>

          {this.state.expandedReturn && (
            <View style={{ paddingVertical: 10, backgroundColor: "#F4F4F4" }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginHorizontal: 16
                }}>
                <Text style={{ color: "#636C73", fontSize: 12 }}>
                  {this.props.item.IntReturn.FlightSegments[0].AirLineName} |{" "}
                  {this.props.item.FlightUId}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  marginHorizontal: 16,
                  justifyContent: "space-around"
                }}>
                <Image
                  style={{
                    width: 35,
                    resizeMode: "contain",
                    alignItems: "flex-start",
                    justifyContent: "flex-start"
                  }}
                  source={{ uri: imgReturn }}
                />
                <View style={{ marginHorizontal: 8 }}>
                  <Text style={{ fontSize: 20, alignSelf: "flex-start" }}>{ddRet}</Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#5D646A",
                      alignSelf: "flex-start"
                    }}>
                    {to}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#5D646A",
                      alignSelf: "flex-start"
                    }}>
                    {departureDateReturn}
                  </Text>
                </View>
                <View
                  style={{
                    marginHorizontal: 2,
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                  <Text style={{ fontSize: 12, color: "#5D646A" }}>{className}</Text>
                </View>
                <View style={{ marginHorizontal: 8 }}>
                  <Text style={{ fontSize: 20, alignSelf: "flex-start" }}>{adReturn}</Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#5D646A",
                      alignSelf: "flex-start"
                    }}>
                    {from}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#5D646A",
                      alignSelf: "flex-start"
                    }}>
                    {arrivalDate}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
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
                    Free & SubCharges:47.23
                  </Text>
                </View>
              </View>
              <View
                style={{
                  borderStyle: "dashed",
                  borderWidth: 1,
                  marginHorizontal: 16,
                  borderColor: "#D0D3DA",
                  borderRadius: 0.5,
                  marginTop: 10
                }}></View>
              <View
                style={{
                  marginHorizontal: 16,
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
                  {this.props.item.IntReturn.FlightSegments[0].Duration}
                </Text>
                <Text
                  style={{
                    flex: 1,
                    marginHorizontal: 10,
                    color: "#5D666D",
                    fontSize: 12
                  }}>
                  With{" "}
                  {this.props.item.IntReturn.FlightSegments.length - 1 == 0
                    ? "Non Stop"
                    : this.props.item.IntReturn.FlightSegments.length - 1 + " "}
                  connection/s
                </Text>
                <Foundation name="shopping-bag" size={24} color="#5D666D" />
                <Text style={{ flex: 1, color: "#5D666D", fontSize: 12 }}>
                  {this.props.item.IntReturn.FlightSegments[0].BaggageAllowed.HandBaggage}
                </Text>
                <Foundation name="shopping-bag" size={24} color="#5D666D" />
                <Text style={{ flex: 1, color: "#5D666D", fontSize: 12 }}>
                  {this.props.item.IntReturn.FlightSegments[0].BaggageAllowed.CheckInBaggage}
                </Text>
                <Text style={{ flex: 1, color: "#5D666D", fontSize: 12 }}>
                  Total Fare:₹{parseInt(this.props.item.FareDetails.TotalFare)}
                </Text>
              </View>
              <View
                style={{
                  borderStyle: "dashed",
                  borderWidth: 1,
                  marginHorizontal: 16,
                  borderColor: "#D0D3DA",
                  borderRadius: 0.5
                }}></View>
            </View>
          )}
        </View>
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

export default withNavigation(RenderInternationRound);
