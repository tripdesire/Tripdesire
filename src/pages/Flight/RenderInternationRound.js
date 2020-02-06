import React, { PureComponent } from "react";
import { Dimensions, View, Image, TouchableOpacity, Modal, Linking, Alert } from "react-native";
import { Button, Text, CurrencyText } from "../../components";
import { withNavigation } from "react-navigation";
import Icon from "react-native-vector-icons/AntDesign";
import Foundation from "react-native-vector-icons/Foundation";
import { etravosApi } from "../../service";
import Toast from "react-native-simple-toast";
import FareDetails from "./FareRules";
import moment from "moment";
import analytics from "@react-native-firebase/analytics";

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

  trackScreenView = async screen => {
    // Set & override the MainActivity screen name
    await analytics().setCurrentScreen(screen, screen);
  };
  componentDidMount() {
    this.trackScreenView("Flight International Round");
  }

  fareRules = () => {
    this.setState({ showModal: true });
    let data = {
      airlineId: this.props.item.IntOnward.FlightSegments[0].OperatingAirlineCode,
      classCode: this.props.item.IntOnward.FlightSegments[0].BookingClassFare.ClassType,
      couponFare: this.props.item.IntOnward.FlightSegments[0].RPH || "",
      flightId: this.props.item.IntOnward.FlightSegments[0].OperatingAirlineFlightNumber,
      key: this.props.item.OriginDestinationoptionId.Key,
      provider: this.props.item.Provider,
      tripType: this.props.TripType,
      service: this.props.FlightType,
      user: "",
      userType: 5
    };
    console.log(data);
    this.setState({ loader: true });
    etravosApi
      .get("/Flights/GetFareRule", data)
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
    let dd = moment(this.props.item.IntOnward.FlightSegments[0].DepartureDateTime).format("HH:mm");
    let ddRet = moment(this.props.item.IntReturn.FlightSegments[0].DepartureDateTime).format(
      "HH:mm"
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
    ).format("HH:mm");
    let adReturn = moment(
      this.props.item.IntReturn.FlightSegments[this.props.item.IntReturn.FlightSegments.length - 1]
        .ArrivalDateTime
    ).format("HH:mm");
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
          // paddingVertical: 10,
          // backgroundColor: this.props.index % 2 == 0 ? "#FFFFFF" : "#EEF1F8"
        }}
        onPress={() => this._BookNow(this.props.item)}>
        <View
          style={{
            flexDirection: "row",
            marginEnd: 8,
            marginBottom: 10
          }}>
          {/* <Image style={{ width: 35, resizeMode: "contain" }} source={{ uri: img }} /> */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              flex: 1,
              alignItems: "flex-start"
            }}>
            <Text style={{ marginStart: 10, flex: 1 }}>
              {this.props.item.IntOnward.FlightSegments[0].AirLineName}
            </Text>
            <View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700"
                }}>
                <CurrencyText style={{ fontSize: 18, fontWeight: "bold" }}>₹</CurrencyText>
                {this.props.item.FareDetails.TotalFare}
              </Text>
              {/* <Button
                style={{
                  backgroundColor: "#F68E1F",
                  borderRadius: 15,
                  height: 24,
                  alignSelf: "center",
                  justifyContent: "center"
                }}
                onPress={() => this._BookNow(this.props.item)}>
                <Text
                  style={{
                    color: "#fff",
                    alignSelf: "center",
                    fontSize: 12,
                    paddingHorizontal: 10
                  }}>
                  Book Now
                </Text>
              </Button> */}
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 8
          }}>
          <Text style={{ color: "#636C73", fontSize: 12 }}>
            Depart - {this.props.item.IntOnward.FlightSegments[0].AirLineName} |{" "}
            {this.props.item.IntOnward.FlightSegments[0].OperatingAirlineCode +
              "-" +
              this.props.item.IntOnward.FlightSegments[0].OperatingAirlineFlightNumber}
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
              <Text style={{ fontSize: 18, lineHeight: 22 }}>{dd}</Text>
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
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontSize: 16, lineHeight: 18 }}>
              {moment
                .duration(
                  moment(
                    this.props.item.IntOnward.FlightSegments[
                      this.props.item.IntOnward.FlightSegments.length - 1
                    ].ArrivalDateTime
                  ).diff(moment(this.props.item.IntOnward.FlightSegments[0].DepartureDateTime))
                )
                .format("h:mm [hrs]")}
            </Text>
            {/* <View
              style={{
                backgroundColor: "#5D646A",
                height: 1.35,
                width: width / 5,
                lineHeight: 14
              }}></View> */}
            <Text style={{ fontSize: 12, color: "#5D646A", lineHeight: 14 }}>
              {this.props.item.IntOnward.FlightSegments.length - 1 == 0
                ? "Non Stop"
                : this.props.item.IntOnward.FlightSegments.length - 1 + " Stop(s) "}
            </Text>
          </View>
          <View>
            <Text style={{ fontSize: 18, lineHeight: 22, textAlign: "right" }}>{ad}</Text>
            <Text
              style={{
                fontSize: 12,
                // color: "#5D646A",
                lineHeight: 14
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
                  marginHorizontal: 8,
                  color: "green",
                  fontSize: 12
                }}>
                {this.props.item.IntOnward.FlightSegments[0].BookingClassFare.Rule.trim()}
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
                key={"_Sep" + index}>
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
                      resizeMode="contain"
                      source={{ uri: "http://webapi.i2space.co.in" + itemEach.ImagePath }}
                    />
                    <View>
                      <Text style={{ fontSize: 18, lineHeight: 22 }}>
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
                  <Text style={{ fontSize: 12, color: "#5D646A" }}>{className}</Text>
                  <View>
                    <Text style={{ fontSize: 18, lineHeight: 22 }}>
                      {moment(itemEach.ArrivalDateTime).format("HH:mm")}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        //color: "#5D646A",
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
                    flex: 1,
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
                    {this.props.item.IntOnward.FlightSegments.length - 1 == 0
                      ? "0 "
                      : this.props.item.IntOnward.FlightSegments.length - 1 + " "}
                    connection/s
                  </Text>
                  <Foundation name="shopping-bag" size={20} color="#5D666D" />
                  <Text style={{ color: "#5D666D", fontSize: 12 }}>
                    {itemEach.BaggageAllowed.HandBaggage != ""
                      ? itemEach.BaggageAllowed.HandBaggage
                      : 0 + " PC(s)"}
                  </Text>
                  <Foundation name="shopping-bag" size={20} color="#5D666D" />
                  <Text style={{ color: "#5D666D", fontSize: 12 }}>
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
                      {moment
                        .duration(
                          moment(
                            this.props.item.IntOnward.FlightSegments[index + 1].DepartureDateTime
                          ).diff(
                            moment(this.props.item.IntOnward.FlightSegments[index].ArrivalDateTime)
                          )
                        )
                        .format("h:mm [hrs]")}
                    </Text>
                  </Text>
                )}

                {this.props.item.IntOnward.FlightSegments.length - 1 == index && (
                  <View
                    style={{
                      flex: 1,
                      marginHorizontal: 8,
                      alignItems: "flex-start",
                      marginTop: 5
                    }}>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#5D646A",
                        lineHeight: 14
                      }}>
                      Base Fare : <CurrencyText style={{ fontSize: 12 }}>₹</CurrencyText>
                      {this.props.item.FareDetails.ChargeableFares.ActualBaseFare}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#5D646A",
                        lineHeight: 14
                      }}>
                      Tax : <CurrencyText style={{ fontSize: 12 }}>₹</CurrencyText>
                      {this.props.item.FareDetails.ChargeableFares.Tax}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#5D646A",
                        lineHeight: 14
                      }}>
                      Fee & SubCharges : <CurrencyText style={{ fontSize: 12 }}>₹</CurrencyText>
                      {this.props.item.FareDetails.ChargeableFares.Conveniencefee}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#5D646A",
                        lineHeight: 14
                      }}>
                      Total Fare : <CurrencyText style={{ fontSize: 12 }}>₹</CurrencyText>
                      {parseInt(this.props.item.FareDetails.TotalFare)}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        <View
          style={{
            borderStyle: "dashed",
            borderWidth: 1,
            marginHorizontal: 8,
            marginVertical: 10,
            borderColor: "#D0D3DA",
            borderRadius: 0.5
          }}></View>
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginHorizontal: 8
            }}>
            <Text style={{ color: "#636C73", fontSize: 12 }}>
              Return - {this.props.item.IntReturn.FlightSegments[0].AirLineName} |{" "}
              {this.props.item.IntReturn.FlightSegments[0].OperatingAirlineCode +
                "-" +
                this.props.item.IntReturn.FlightSegments[0].OperatingAirlineFlightNumber}
            </Text>
          </View>
          <View
            style={{ flexDirection: "row", marginHorizontal: 8, justifyContent: "space-between" }}>
            <View style={{ alignItems: "center", flexDirection: "row" }}>
              <Image
                style={{ width: 40, height: 40, marginEnd: 10, resizeMode: "contain" }}
                source={{ uri: imgReturn }}
                resizeMode="contain"
              />
              <View>
                <Text style={{ fontSize: 18, lineHeight: 22 }}>{ddRet}</Text>
                <Text
                  style={{
                    fontSize: 12,
                    // color: "#5D646A",
                    lineHeight: 14
                  }}>
                  {to}
                </Text>
              </View>
            </View>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 16, lineHeight: 18 }}>
                {moment
                  .duration(
                    moment(
                      this.props.item.IntReturn.FlightSegments[
                        this.props.item.IntReturn.FlightSegments.length - 1
                      ].ArrivalDateTime
                    ).diff(moment(this.props.item.IntReturn.FlightSegments[0].DepartureDateTime))
                  )
                  .format("h:mm [hrs]")}
              </Text>
              {/* <View
                style={{
                  backgroundColor: "#5D646A",
                  height: 1.35,
                  width: width / 5,
                  lineHeight: 14
                }}></View> */}
              <Text
                style={{
                  fontSize: 12,
                  color: "#5D646A",
                  lineHeight: 14
                }}>
                {this.props.item.IntReturn.FlightSegments.length - 1 == 0
                  ? "Non Stop"
                  : this.props.item.IntReturn.FlightSegments.length - 1 + " Stop(s) "}
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: 18, lineHeight: 22, textAlign: "right" }}>{adReturn}</Text>
              <Text
                style={{
                  fontSize: 12,
                  // color: "#5D646A",
                  lineHeight: 18,
                  textAlign: "right"
                }}>
                {from}
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
                    marginHorizontal: 8,
                    color: "green",
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
                  <Text style={{ flex: 1, color: "#5D666D", fontSize: 12 }}>-Hide Details</Text>
                )}
              </Button>
            </View>
          </View>

          {this.state.expandedReturn &&
            this.props.item.IntReturn.FlightSegments.map((itemEach, index) => {
              return (
                <View
                  style={{ paddingVertical: 10, backgroundColor: "#F4F4F4" }}
                  key={"_SepReturn" + index}>
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
                    <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                      <Image
                        style={{
                          width: 40,
                          height: 40,
                          marginEnd: 4,
                          resizeMode: "contain"
                        }}
                        source={{ uri: "http://webapi.i2space.co.in" + itemEach.ImagePath }}
                      />
                      <View>
                        <Text style={{ fontSize: 18, lineHeight: 22 }}>
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
                    <Text style={{ fontSize: 12, color: "#5D646A", lineHeight: 14 }}>
                      {className}
                    </Text>
                    <View>
                      <Text style={{ fontSize: 18, lineHeight: 22 }}>
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
                      marginHorizontal: 8,
                      flexDirection: "row",
                      marginVertical: 5,
                      flex: 1,
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
                        marginHorizontal: 8,
                        color: "#5D666D",
                        fontSize: 12
                      }}>
                      With{" "}
                      {this.props.item.IntReturn.FlightSegments.length - 1 == 0
                        ? "0 "
                        : this.props.item.IntReturn.FlightSegments.length - 1 + " "}
                      connection/s
                    </Text>
                    <Foundation name="shopping-bag" size={20} color="#5D666D" />
                    <Text style={{ color: "#5D666D", fontSize: 12 }}>
                      {itemEach.BaggageAllowed.HandBaggage != ""
                        ? itemEach.BaggageAllowed.HandBaggage
                        : 0 + " PC(s)"}
                    </Text>
                    <Foundation name="shopping-bag" size={20} color="#5D666D" />
                    <Text style={{ color: "#5D666D", fontSize: 12 }}>
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

                  {this.props.item.IntReturn.FlightSegments.length - 1 != index && (
                    <Text style={{ marginHorizontal: 8, marginVertical: 10, color: "green" }}>
                      Change of Planes at{" "}
                      <Text style={{ fontSize: 16, fontWeight: "700" }}>
                        {" "}
                        {itemEach.IntArrivalAirportName}
                      </Text>{" "}
                      | Connection Time:
                      <Text style={{ fontSize: 16, fontWeight: "700" }}>
                        {" "}
                        {moment
                          .duration(
                            moment(
                              this.props.item.IntReturn.FlightSegments[index + 1].DepartureDateTime
                            ).diff(
                              moment(
                                this.props.item.IntReturn.FlightSegments[index].ArrivalDateTime
                              )
                            )
                          )
                          .format("h:mm [hrs]")}
                      </Text>
                    </Text>
                  )}

                  {this.props.item.IntReturn.FlightSegments.length - 1 == index && (
                    <View style={{ flex: 1, marginHorizontal: 8, marginTop: 5 }}>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#5D646A",
                          lineHeight: 14
                        }}>
                        Base Fare : <CurrencyText style={{ fontSize: 12 }}>₹</CurrencyText>
                        {this.props.item.FareDetails.ChargeableFares.ActualBaseFare}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#5D646A",
                          lineHeight: 14
                        }}>
                        Tax : <CurrencyText style={{ fontSize: 12 }}>₹</CurrencyText>
                        {this.props.item.FareDetails.ChargeableFares.Tax}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#5D646A",
                          lineHeight: 14
                        }}>
                        Fee & SubCharges : <CurrencyText style={{ fontSize: 12 }}>₹</CurrencyText>
                        {this.props.item.FareDetails.ChargeableFares.Conveniencefee}
                      </Text>
                      <Text style={{ fontSize: 12, color: "#5D646A", lineHeight: 14 }}>
                        Total Fare : <CurrencyText style={{ fontSize: 12 }}>₹</CurrencyText>
                        {parseInt(this.props.item.FareDetails.TotalFare)}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
        </View>
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

export default withNavigation(RenderInternationRound);
