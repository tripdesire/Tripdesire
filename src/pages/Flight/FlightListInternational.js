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
import { Button, Text, CurrencyText } from "../../components";
import Icon from "react-native-vector-icons/AntDesign";
import Foundation from "react-native-vector-icons/Foundation";
import { withNavigation } from "react-navigation";
import FareDetails from "./FareRules";
import { etravosApi } from "../../service";
import NumberFormat from "react-number-format";
import moment from "moment";
import analytics from "@react-native-firebase/analytics";

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

  trackScreenView = async screen => {
    // Set & override the MainActivity screen name
    await analytics().setCurrentScreen(screen, screen);
  };
  componentDidMount() {
    this.trackScreenView("International Oneway List");
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
    console.log(body);
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
    let dd = moment(this.props.item.IntOnward.FlightSegments[0].DepartureDateTime).format("HH:mm");
    let ad = moment(
      this.props.item.IntOnward.FlightSegments[this.props.item.IntOnward.FlightSegments.length - 1]
        .ArrivalDateTime
    ).format("HH:mm");
    let img = "http://webapi.i2space.co.in" + this.props.item.IntOnward.FlightSegments[0].ImagePath;

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
          marginVertical: 8,
          borderRadius: 8,
          paddingTop: 10,
          backgroundColor: "#fff"
        }}
        onPress={() => this.bookNow(this.props.item)}>
        <View
          style={[
            styles.flexdirection,
            {
              marginHorizontal: 8
            }
          ]}>
          <Text style={{ color: "#636C73", fontSize: 12, flex: 1, paddingEnd: 10 }}>
            {this.props.item.IntOnward.FlightSegments[0].AirLineName} |{" "}
            {this.props.item.IntOnward.FlightSegments[0].OperatingAirlineCode +
              "-" +
              this.props.item.IntOnward.FlightSegments[0].OperatingAirlineFlightNumber}
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "700" }}>
            <CurrencyText style={{ fontSize: 18, fontWeight: "bold" }}>₹</CurrencyText>
            <NumberFormat
              decimalScale={0}
              fixedDecimalScale
              value={this.props.item.FareDetails.TotalFare}
              displayType={"text"}
              thousandSeparator={true}
              thousandsGroupStyle="lakh"
              renderText={value => <Text style={{ fontSize: 18, fontWeight: "700" }}>{value}</Text>}
            />
          </Text>
        </View>
        <View
          style={[
            styles.flexdirection,
            {
              marginHorizontal: 8,
              alignItems: "center"
            }
          ]}>
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
                  lineHeight: 14
                }}>
                {from}
              </Text>
            </View>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 16, lineHeight: 20 }}>
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
            <Text style={{ fontSize: 12, color: "#5D646A", lineHeight: 14 }}>
              {this.props.item.IntOnward.FlightSegments.length - 1 == 0
                ? "Non Stop"
                : this.props.item.IntOnward.FlightSegments.length - 1 + " Stop"}
            </Text>
          </View>
          <View>
            <Text style={{ fontSize: 20, lineHeight: 22, textAlign: "right" }}>{ad}</Text>
            <Text
              style={{
                fontSize: 12,
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

          <View style={[styles.flexdirection, { flex: 1 }]}>
            <Button>
              <Text
                style={{
                  flex: 1,
                  marginHorizontal: 10,
                  color: "green",
                  fontSize: 12
                }}>
                {this.props.item.IntOnward.FlightSegments[0].BookingClassFare.Rule.trim()}
              </Text>
            </Button>
            <Button onPress={this.fareRules}>
              <Text style={styles.farerule}>Fare Rules</Text>
            </Button>
            <Button onPress={this.toggle}>
              {this.state.expanded == false && <Text style={styles.farerule}>+View Details</Text>}
              {this.state.expanded == true && <Text style={styles.farerule}>-Hide Details</Text>}
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
                  style={[
                    styles.flexdirection,
                    {
                      marginHorizontal: 8
                    }
                  ]}>
                  <Text style={{ color: "#636C73", fontSize: 12 }}>
                    {itemEach.AirLineName} |{" "}
                    {itemEach.OperatingAirlineCode + "-" + itemEach.OperatingAirlineFlightNumber}
                  </Text>
                </View>
                <View
                  style={[
                    styles.flexdirection,
                    {
                      marginHorizontal: 8,
                      alignItems: "center"
                    }
                  ]}>
                  <View style={{ alignItems: "flex-start", flexDirection: "row" }}>
                    <Image
                      style={{ width: 40, height: 40, marginEnd: 10 }}
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
                  style={[
                    styles.dash,
                    {
                      marginTop: 10
                    }
                  ]}></View>
                <View
                  style={[
                    styles.flexdirection,
                    {
                      marginHorizontal: 8,
                      marginVertical: 5
                    }
                  ]}>
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
                  <Text style={styles.bags}>
                    {itemEach.BaggageAllowed.HandBaggage != ""
                      ? itemEach.BaggageAllowed.HandBaggage
                      : 0 + " PC(s)"}
                  </Text>
                  <Foundation name="shopping-bag" size={18} color="#5D666D" />
                  <Text style={styles.bags}>{itemEach.BaggageAllowed.CheckInBaggage}</Text>
                </View>
                <View style={styles.dash}></View>

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
                      alignItems: "flex-start",
                      marginTop: 5,
                      marginHorizontal: 8
                    }}>
                    <Text style={styles.fare_label}>
                      Base Fare : <CurrencyText style={{ fontSize: 12 }}>₹</CurrencyText>
                      {this.props.item.FareDetails.ChargeableFares.ActualBaseFare}
                    </Text>
                    <Text style={styles.fare_label}>
                      Tax : <CurrencyText style={{ fontSize: 12 }}>₹</CurrencyText>
                      {this.props.item.FareDetails.ChargeableFares.Tax}
                    </Text>
                    <Text style={styles.fare_label}>
                      Fee & Surcharges : <CurrencyText style={{ fontSize: 12 }}>₹</CurrencyText>
                      {this.props.item.FareDetails.ChargeableFares.Conveniencefee}
                    </Text>
                    <Text style={styles.fare_label}>
                      Total Fare : <CurrencyText style={{ fontSize: 12 }}>₹</CurrencyText>
                      {parseInt(this.props.item.FareDetails.TotalFare)}
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

const styles = StyleSheet.create({
  fare_label: {
    fontSize: 12,
    color: "#5D646A",
    lineHeight: 14
  },
  dash: {
    borderStyle: "dashed",
    borderWidth: 1,
    marginHorizontal: 8,
    borderColor: "#D0D3DA",
    borderRadius: 0.5
  },
  farerule: { flex: 1, color: "#5D666D", fontSize: 12 },
  bags: {
    color: "#5D666D",
    fontSize: 12,
    marginStart: 2
  },
  flexdirection: { flexDirection: "row", justifyContent: "space-between" }
});

export default withNavigation(FlightListInternational);
