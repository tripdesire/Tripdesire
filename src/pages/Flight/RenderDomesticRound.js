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
import { Button, Text, CurrencyText } from "../../components";
import Icon from "react-native-vector-icons/AntDesign";
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";
import Foundation from "react-native-vector-icons/Foundation";
import { etravosApi } from "../../service";
import FareDetails from "./FareRules";
import moment from "moment";
import Toast from "react-native-simple-toast";
import NumberFormat from "react-number-format";
import analytics from "@react-native-firebase/analytics";

class RenderDomesticRound extends React.PureComponent {
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
    this.trackScreenView("Flight Domestic Round");
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
          elevation: 2,
          borderColor: "#EEF1F8",
          borderWidth: 1,
          paddingTop: 10,
          borderRadius: 5,
          marginVertical: 5,
          backgroundColor: selected ? "#EEF1F8" : "#FFFFFF"
        }}
        onPress={this._onpress}>
        <View
          style={[
            styles.flexdirection,
            {
              marginHorizontal: 8
            }
          ]}>
          <Text style={{ color: "#636C73", fontSize: 12 }}>
            {this.props.item.FlightSegments[0].AirLineName} |{" "}
            {this.props.item.FlightSegments[0].OperatingAirlineCode +
              "-" +
              this.props.item.FlightSegments[0].OperatingAirlineFlightNumber}
          </Text>
        </View>
        <View
          style={[
            styles.flexdirection,
            {
              marginHorizontal: 8
            }
          ]}>
          <View style={{ alignItems: "center", flexDirection: "row" }}>
            <Image style={styles.image} source={{ uri: img }} resizeMode="contain" />
            <View>
              <Text style={{ fontSize: 20, lineHeight: 22 }}>{dd}</Text>
              <Text style={styles.fontsize}>{from}</Text>
            </View>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 16, lineHeight: 20 }}>
              {this.props.item.FlightSegments.length == 1
                ? this.props.item.FlightSegments[0].Duration
                : moment
                    .duration(
                      moment(
                        this.props.item.FlightSegments[this.props.item.FlightSegments.length - 1]
                          .ArrivalDateTime
                      ).diff(moment(this.props.item.FlightSegments[0].DepartureDateTime))
                    )
                    .format("h:mm [hrs]")}
            </Text>
            <Text style={{ fontSize: 12, color: "#5D646A", lineHeight: 14 }}>
              {this.props.item.FlightSegments.length - 1 == 0
                ? "Non Stop"
                : this.props.item.FlightSegments.length - 1 + " Stop"}
            </Text>
          </View>
          <View>
            <Text style={{ fontSize: 20, lineHeight: 22 }}>{ad}</Text>
            <Text style={styles.fontsize}>{to}</Text>
          </View>
          <Text style={styles.text}>
            <CurrencyText style={{ fontSize: 18, fontWeight: "bold" }}>₹</CurrencyText>
            <NumberFormat
              decimalScale={0}
              fixedDecimalScale
              value={parseInt(this.props.item.FareDetails.TotalFare)}
              displayType={"text"}
              thousandSeparator={true}
              thousandsGroupStyle="lakh"
              renderText={value => <Text style={styles.text}>{value}</Text>}
            />
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

          <View style={[styles.flexdirection, { flex: 1 }]}>
            <Button>
              <Text
                style={{
                  flex: 1,
                  marginHorizontal: 10,
                  color: "green",
                  fontSize: 12
                }}>
                {this.props.item.FlightSegments[0].BookingClassFare.Rule.trim()}
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
          this.props.item.FlightSegments.map((itemEach, index) => {
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
                      style={styles.image}
                      source={{ uri: "http://webapi.i2space.co.in" + itemEach.ImagePath }}
                      resizeMode="contain"
                    />
                    <View>
                      <Text style={{ fontSize: 20, lineHeight: 22 }}>
                        {moment(itemEach.DepartureDateTime).format("HH:mm")}
                      </Text>
                      <Text style={styles.fontsize}>{itemEach.IntDepartureAirportName}</Text>
                      <Text
                        style={[
                          styles.fontsize,
                          {
                            color: "#5D646A"
                          }
                        ]}>
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
                    <Text style={styles.fontsize}>{itemEach.IntArrivalAirportName}</Text>
                    <Text
                      style={[
                        styles.fontsize,
                        {
                          color: "#5D646A"
                        }
                      ]}>
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
                      marginVertical: 5,
                      marginHorizontal: 8,
                      flex: 1
                    }
                  ]}>
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
                      : this.props.item.FlightSegments.length - 1 + " Stop"}
                    connection/s
                  </Text>
                  <Foundation name="shopping-bag" size={18} color="#5D666D" />
                  <Text style={styles.bags}>
                    {itemEach.BaggageAllowed.HandBaggage != 0
                      ? itemEach.BaggageAllowed.HandBaggage
                      : "0KG"}
                  </Text>
                  <Foundation name="shopping-bag" size={18} color="#5D666D" />
                  <Text style={styles.bags}>{itemEach.BaggageAllowed.CheckInBaggage}</Text>
                </View>
                <View style={styles.dash}></View>

                {this.props.item.FlightSegments.length - 1 != index && (
                  <Text style={{ marginHorizontal: 8, marginVertical: 10, color: "green" }}>
                    Change of Planes at{" "}
                    <Text style={styles.changeFlightText}> {itemEach.IntArrivalAirportName}</Text> |
                    Connection Time:
                    <Text style={styles.changeFlightText}>
                      {" "}
                      {moment
                        .duration(
                          moment(this.props.item.FlightSegments[index + 1].DepartureDateTime).diff(
                            moment(this.props.item.FlightSegments[index].ArrivalDateTime)
                          )
                        )
                        .format("h:mm [hrs]")}
                    </Text>
                  </Text>
                )}

                {this.props.item.FlightSegments.length - 1 == index && (
                  <View style={{ flex: 1, marginStart: 8, alignItems: "flex-start", marginTop: 5 }}>
                    <Text style={styles.fareDeatilLabel}>
                      Base Fare : <CurrencyText style={{ fontSize: 12 }}>₹</CurrencyText>
                      {this.props.item.FareDetails.ChargeableFares.ActualBaseFare}
                    </Text>
                    <Text style={styles.fareDeatilLabel}>
                      Tax : <CurrencyText style={{ fontSize: 12 }}>₹</CurrencyText>
                      {this.props.item.FareDetails.ChargeableFares.Tax}
                    </Text>
                    <Text style={styles.fareDeatilLabel}>
                      Fee & SubCharges : <CurrencyText style={{ fontSize: 12 }}>₹</CurrencyText>
                      {this.props.item.FareDetails.ChargeableFares.Conveniencefee}
                    </Text>
                    <Text style={styles.fareDeatilLabel}>
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
  image: { width: 40, height: 40, marginEnd: 10 },
  farerule: { flex: 1, color: "#5D666D", fontSize: 12 },
  dash: {
    borderStyle: "dashed",
    borderWidth: 1,
    marginHorizontal: 8,
    borderColor: "#D0D3DA",
    borderRadius: 0.5
  },
  flexdirection: { flexDirection: "row", justifyContent: "space-between" },
  text: { fontSize: 18, fontWeight: "700" },
  fareDeatilLabel: {
    fontSize: 12,
    color: "#5D646A",
    lineHeight: 14
  },
  changeFlightText: { fontSize: 16, fontWeight: "700" },
  bags: {
    color: "#5D666D",
    fontSize: 12,
    marginStart: 2
  },
  fontsize: {
    fontSize: 12,
    lineHeight: 14
  }
});

export default RenderDomesticRound;
