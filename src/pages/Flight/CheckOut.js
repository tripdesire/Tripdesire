import React, { PureComponent } from "react";
import {
  View,
  Image,
  TextInput,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Platform
} from "react-native";
import Toast from "react-native-simple-toast";
import { Button, Text, ActivityIndicator, Icon } from "../../components";
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";
import IconSimple from "react-native-vector-icons/SimpleLineIcons";
import moment from "moment";
import { isArray } from "lodash";
import HTML from "react-native-render-html";
import { domainApi } from "../../service";

class CheckOut extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log(this.props.navigation.state.params);
    this.state = {
      loading: false,
      return: false,
      inputCoupon: false,
      data: {},
      coupon_code: ""
    };
  }

  applyCoupon = () => {
    this.setState({ loading: true });
    domainApi
      .get("/cart/coupon", { coupon_code: this.state.coupon_code })
      .then(({ data }) => {
        console.log(data);
        if (data.code && data.code == 201) {
          Toast.show(data.message.join());
        }
        this.toggleCoupon(false)();
        this.setState({ data: data });
        this.ApiCall();
        // this.setState({ loading: false });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  };

  removeCoupon = code => () => {
    this.setState({ loading: true });
    domainApi
      .get("/cart/remove-coupon", {
        coupon_code: code
      })
      .then(({ data }) => {
        this.toggleCoupon(true)();
        this.ApiCall();
        // this.setState({ loading: false });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  };

  toggleCoupon = show => () => {
    this.setState({
      inputCoupon: show
    });
  };

  ApiCall() {
    domainApi
      .get("/cart")
      .then(({ data }) => {
        this.setState({ data: data, loading: false });
      })
      .catch(error => {
        this.setState({ loading: false });
      });
  }

  componentDidMount() {
    const { params } = this.props.navigation.state;
    Object.assign(params, {
      itemId: 87
    });

    let dt =
      params.flightType == 1
        ? moment(params.departFlight.FlightSegments[0].DepartureDateTime).format("HH:mm")
        : moment(params.departFlight.IntOnward.FlightSegments[0].DepartureDateTime).format("HH:mm");

    let dtReturn =
      params.flightType == 2 && params.tripType == 2
        ? moment(params.departFlight.IntReturn.FlightSegments[0].DepartureDateTime).format("HH:mm")
        : params.flightType == 1 && params.tripType == 2
        ? moment(params.arrivalFlight.FlightSegments[0].DepartureDateTime).format("HH:mm")
        : "";

    let at =
      params.flightType == 1
        ? moment(
            params.departFlight.FlightSegments[params.departFlight.FlightSegments.length - 1]
              .ArrivalDateTime
          ).format("HH:mm")
        : moment(
            params.departFlight.IntOnward.FlightSegments[
              params.departFlight.IntOnward.FlightSegments.length - 1
            ].ArrivalDateTime
          ).format("HH:mm");

    let atReturn =
      params.flightType == 2 && params.tripType == 2
        ? moment(
            params.departFlight.IntReturn.FlightSegments[
              params.departFlight.IntReturn.FlightSegments.length - 1
            ].ArrivalDateTime
          ).format("HH:mm")
        : params.flightType == 1 && params.tripType == 2
        ? moment(
            params.arrivalFlight.FlightSegments[params.arrivalFlight.FlightSegments.length - 1]
              .ArrivalDateTime
          ).format("HH:mm")
        : "";
    let departureDate =
      params.flightType == 1
        ? moment(params.departFlight.FlightSegments[0].DepartureDateTime).format("MMM DD")
        : moment(params.departFlight.IntOnward.FlightSegments[0].DepartureDateTime).format(
            "MMM DD"
          );

    let departureDateReturn =
      params.flightType == 2 && params.tripType == 2
        ? moment(params.departFlight.IntReturn.FlightSegments[0].DepartureDateTime).format("MMM DD")
        : params.flightType == 1 && params.tripType == 2
        ? moment(params.arrivalFlight.FlightSegments[0].DepartureDateTime).format("MMM DD")
        : "";
    let arrivalDate =
      params.flightType == 1
        ? moment(
            params.departFlight.FlightSegments[params.departFlight.FlightSegments.length - 1]
              .ArrivalDateTime
          ).format("MMM DD")
        : moment(
            params.departFlight.IntOnward.FlightSegments[
              params.departFlight.IntOnward.FlightSegments.length - 1
            ].ArrivalDateTime
          ).format("MMM DD");

    let arrivalDateReturn =
      params.flightType == 2 && params.tripType == 2
        ? moment(
            params.departFlight.IntReturn.FlightSegments[
              params.departFlight.IntReturn.FlightSegments.length - 1
            ].ArrivalDateTime
          ).format("MMM DD")
        : params.flightType == 1 && params.tripType == 2
        ? moment(
            params.arrivalFlight.FlightSegments[params.arrivalFlight.FlightSegments.length - 1]
              .ArrivalDateTime
          ).format("MMM DD")
        : "";

    let param = {
      id: 87,
      quantity: "1",
      is_Air_Asia:
        params.flightType == 1 && params.departFlight.FlightSegments[0].AirLineName == "Air Asia"
          ? true
          : params.flightType == 2 &&
            params.departFlight.IntOnward.FlightSegments[0].AirLineName == "Air Asia"
          ? true
          : false,
      int_fl_item_result_data: params.flightType == 2 ? params.departFlight : {},
      onward_item_result_data: params.flightType == 1 ? params.departFlight : {},
      single_fl_name:
        params.flightType == 1
          ? params.departFlight.FlightSegments[0].AirLineName
          : params.departFlight.IntOnward.FlightSegments[0].AirLineName,
      single_fl_code: params.departFlight.FlightUId,
      single_fl_from: params.from,
      single_fl_to: params.to,
      single_fl_time1: dt,
      single_fl_time2: at,
      single_fl_time_dur:
        params.flightType == 1
          ? params.departFlight.FlightSegments[0].Duration
          : params.departFlight.IntOnward.FlightSegments[0].Duration,
      single_fl_stop:
        params.flightType == 1
          ? params.departFlight.FlightSegments[0].StopQuantity
          : params.departFlight.IntOnward.FlightSegments[0].StopQuantity,
      single_fl_conveniencefee: params.departFlight.FareDetails.ChargeableFares.Conveniencefee,
      single_fl_schagre: params.departFlight.FareDetails.ChargeableFares.SCharge,
      single_fl_tax: params.departFlight.FareDetails.ChargeableFares.Tax,
      single_fl_dept_date: departureDate,
      single_fl_arriv_date: arrivalDate,
      single_fl_fare_rule: "Refundable",
      single_fl_base_fare: params.departFlight.FareDetails.ChargeableFares.ActualBaseFare,
      single_fl_gst:
        params.departFlight.FareDetails.IsGSTMandatory == false
          ? 0
          : params.departFlight.FareDetails.IsGSTMandatory,
      return_item_result_data:
        params.flightType == 1 && params.tripType == 2 ? params.arrivalFlight : {},
      return_is_Air_Asia:
        params.flightType == 2 &&
        params.tripType == 2 &&
        params.departFlight.IntReturn.FlightSegments[0].AirLineName == "Air Asia"
          ? true
          : params.flightType == 1 &&
            params.tripType == 2 &&
            params.arrivalFlight.FlightSegments[0].AirLineName == "Air Asia"
          ? true
          : false,
      return_fl_name:
        params.flightType == 2 && params.tripType == 2
          ? params.departFlight.IntReturn.FlightSegments[0].AirLineName
          : params.flightType == 1 && params.tripType == 2
          ? params.arrivalFlight.FlightSegments[0].AirLineName
          : "",
      return_fl_code:
        params.flightType == 2 && params.tripType == 2
          ? params.departFlight.FlightUId
          : params.flightType == 1 && params.tripType == 2
          ? params.arrivalFlight.FlightUId
          : "",
      return_fl_from: params.tripType == 2 ? params.to : "",
      return_fl_to: params.tripType == 2 ? params.from : "",
      return_fl_time1: params.tripType == 2 ? dtReturn : "",
      return_fl_time2: params.tripType == 2 ? atReturn : "",
      return_fl_time_dur:
        params.flightType == 2 && params.tripType == 2
          ? params.departFlight.IntReturn.FlightSegments[0].Duration
          : params.flightType == 1 && params.tripType == 2
          ? params.arrivalFlight.FlightSegments[0].Duration
          : "",
      return_fl_stop:
        params.flightType == 2 && params.tripType == 2
          ? params.departFlight.IntReturn.FlightSegments[0].StopQuantity
          : params.flightType == 1 && params.tripType == 2
          ? params.arrivalFlight.FlightSegments[0].StopQuantity
          : "",
      return_fl_conveniencefee:
        params.flightType == 2 && params.tripType == 2
          ? params.departFlight.FareDetails.ChargeableFares.Conveniencefee
          : params.flightType == 1 && params.tripType == 2
          ? params.arrivalFlight.FareDetails.ChargeableFares.Conveniencefee
          : "",
      return_fl_schagre:
        params.flightType == 2 && params.tripType == 2
          ? params.departFlight.FareDetails.ChargeableFares.SCharge
          : params.flightType == 1 && params.tripType == 2
          ? params.arrivalFlight.FareDetails.ChargeableFares.SCharge
          : "",
      return_fl_tax:
        params.flightType == 2 && params.tripType == 2
          ? params.departFlight.FareDetails.ChargeableFares.Tax
          : params.flightType == 1 && params.tripType == 2
          ? params.arrivalFlight.FareDetails.ChargeableFares.Tax
          : "",
      return_fl_dept_date: params.tripType == 2 ? departureDateReturn : "",
      return_fl_arriv_date: params.tripType == 2 ? arrivalDateReturn : "",
      return_fl_fare_rule: "Refundable",
      return_fl_base_fare:
        params.flightType == 2 && params.tripType == 2
          ? params.departFlight.FareDetails.ChargeableFares.ActualBaseFare
          : params.flightType == 1 && params.tripType == 2
          ? params.arrivalFlight.FareDetails.ChargeableFares.ActualBaseFare
          : "",
      return_fl_gst:
        params.flightType == 2 &&
        params.tripType == 2 &&
        params.departFlight.FareDetails.IsGSTMandatory == false
          ? params.departFlight.FareDetails.IsGSTMandatory
          : params.flightType == 1 &&
            params.tripType == 2 &&
            params.arrivalFlight.FareDetails.IsGSTMandatory == false
          ? params.departFlight.FareDetails.IsGSTMandatory
          : 0,
      fl_tot_price:
        params.flightType == 2 && params.tripType == 2
          ? params.departFlight.FareDetails.TotalFare
          : params.flightType == 1 && params.tripType == 2
          ? params.departFlight.FareDetails.TotalFare + params.arrivalFlight.FareDetails.TotalFare
          : params.flightType == 1 && params.tripType == 1
          ? params.departFlight.FareDetails.TotalFare
          : params.flightType == 2 && params.tripType == 1
          ? params.departFlight.FareDetails.TotalFare
          : "",
      fl_adults: params.adult,
      fl_children: params.child,
      fl_infant: params.infant,
      fl_ctype: params.className
    };

    console.log(param);
    this.setState({ loading: true });
    domainApi
      .post("/cart/add", param)
      .then(({ data }) => {
        if (data.code !== "1") {
          this.setState({ loading: false });
          Toast.show(data.message, Toast.LONG);
        } else {
          this.ApiCall();
        }
      })
      .catch(error => {
        this.setState({ loading: false });
      });
  }

  navigateToScreen = (page, params = {}) => () => {
    this.props.navigation.navigate(page, { params, data: this.state.data });
  };

  render() {
    const { params } = this.props.navigation.state;

    if (params.flightType == 2 && params.tripType == 2) {
      var imgIntRet =
        "http://webapi.i2space.co.in" + params.departFlight.IntReturn.FlightSegments[0].ImagePath;
      var ddIntReturn = moment(
        params.departFlight.IntReturn.FlightSegments[0].DepartureDateTime
      ).format("HH:mm");
      var adIntReturn = moment(
        params.departFlight.IntReturn.FlightSegments[
          params.departFlight.IntReturn.FlightSegments.length - 1
        ].ArrivalDateTime
      ).format("HH:mm");
      var departureDateIntReturn = moment(
        params.departFlight.IntReturn.FlightSegments[0].DepartureDateTime
      ).format("MMM DD");
      var arrivalDateIntReturn = moment(
        params.departFlight.IntReturn.FlightSegments[
          params.departFlight.IntReturn.FlightSegments.length - 1
        ].ArrivalDateTime
      ).format("MMM DD");
    }

    if (params.flightType == 1 && params.tripType == 2) {
      var imgRet = "http://webapi.i2space.co.in" + params.arrivalFlight.FlightSegments[0].ImagePath;
      var ddReturn = moment(params.arrivalFlight.FlightSegments[0].DepartureDateTime).format(
        "HH:mm"
      );
      var adReturn = moment(
        params.arrivalFlight.FlightSegments[params.arrivalFlight.FlightSegments.length - 1]
          .ArrivalDateTime
      ).format("HH:mm");
      var departureDateReturn = moment(
        params.arrivalFlight.FlightSegments[0].DepartureDateTime
      ).format("MMM DD");
      var arrivalDateReturn = moment(
        params.arrivalFlight.FlightSegments[params.arrivalFlight.FlightSegments.length - 1]
          .ArrivalDateTime
      ).format("MMM DD");
    }

    var img =
      params.flightType == 1
        ? "http://webapi.i2space.co.in" + params.departFlight.FlightSegments[0].ImagePath
        : "http://webapi.i2space.co.in" + params.departFlight.IntOnward.FlightSegments[0].ImagePath;
    var dd =
      params.flightType == 1
        ? moment(params.departFlight.FlightSegments[0].DepartureDateTime).format("HH:mm")
        : moment(params.departFlight.IntOnward.FlightSegments[0].DepartureDateTime).format("HH:mm");
    var ad =
      params.flightType == 1
        ? moment(
            params.departFlight.FlightSegments[params.departFlight.FlightSegments.length - 1]
              .ArrivalDateTime
          ).format("HH:mm")
        : moment(
            params.departFlight.IntOnward.FlightSegments[
              params.departFlight.IntOnward.FlightSegments.length - 1
            ].ArrivalDateTime
          ).format("HH:mm");

    var departureDate =
      params.flightType == 1
        ? moment(params.departFlight.FlightSegments[0].DepartureDateTime).format("MMM DD")
        : moment(params.departFlight.IntOnward.FlightSegments[0].DepartureDateTime).format(
            "MMM DD"
          );
    var arrivalDate =
      params.flightType == 1
        ? moment(
            params.departFlight.FlightSegments[params.departFlight.FlightSegments.length - 1]
              .ArrivalDateTime
          ).format("MMM DD")
        : moment(
            params.departFlight.IntOnward.FlightSegments[
              params.departFlight.IntOnward.FlightSegments.length - 1
            ].ArrivalDateTime
          ).format("MMM DD");

    if (params.flightType == 1) {
      return (
        <>
          <SafeAreaView style={{ flex: 0, backgroundColor: "#E5EBF7" }} />
          <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
            <View style={{ backgroundColor: "#E5EBF7" }}>
              <View
                style={{
                  flexDirection: "row"
                }}>
                <Button onPress={() => this.props.navigation.goBack(null)} style={{ padding: 16 }}>
                  <Icon name="md-arrow-back" size={24} />
                </Button>
                <View
                  style={{
                    flex: 1,
                    paddingTop: 16,
                    paddingBottom: 16
                  }}>
                  <Text
                    style={{
                      fontWeight: "700",
                      fontSize: 16,
                      marginHorizontal: 5
                    }}>
                    Flight Summary
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      marginHorizontal: 5,
                      color: "#717984"
                    }}>
                    {params.journey_date} {params.return_date ? "- " + params.return_date : null} |{" "}
                    {params.adult > 0 ? params.adult + " Adult" : " "}
                    {params.child > 0 ? " , " + params.child + " Child" : " "}
                    {params.infant > 0 ? " , " + params.infant + " Infant" : " "} |{" "}
                    {params.className}
                  </Text>
                </View>
              </View>
            </View>
            <ScrollView style={{ flex: 4, backgroundColor: "#FFFFFF" }}>
              <View
                style={{
                  elevation: 2,
                  shadowOffset: { width: 0, height: 2 },
                  shadowColor: "rgba(0,0,0,0.1)",
                  shadowOpacity: 1,
                  shadowRadius: 4,
                  backgroundColor: "#ffffff",
                  marginHorizontal: 16,
                  marginVertical: 20,
                  borderRadius: 8,
                  padding: 10
                }}>
                <View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      source={require("../../assets/imgs/flightSearch.png")}
                      resizeMode="contain"
                      style={{ width: 30 }}
                    />
                    <Text style={{ fontSize: 18, fontWeight: "500", marginStart: 5 }}>
                      Departure
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", marginTop: 10 }}>
                    <Image
                      style={{ width: 35, resizeMode: "contain" }}
                      source={{ uri: img || "https://via.placeholder.com/150" }}
                    />
                    <View style={{ marginStart: 10, flex: 1 }}>
                      <Text>
                        {params.departFlight.FlightSegments[0].AirLineName} |{" "}
                        {params.departFlight.FlightUId}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between"
                        }}>
                        <Text
                          style={{ fontSize: 18, fontWeight: "700", textTransform: "capitalize" }}>
                          {dd}
                        </Text>
                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: "700"
                          }}>
                          {ad}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 5
                    }}>
                    <View>
                      <Text style={{ textTransform: "capitalize" }}>{params.from}</Text>
                      <Text>{departureDate}</Text>
                    </View>
                    <View>
                      <Text style={{ alignSelf: "center" }}>{params.className}</Text>
                      <View
                        style={{
                          height: 1.35,
                          width: 90,
                          backgroundColor: "#D1D1D1"
                        }}></View>
                    </View>
                    <View>
                      <Text style={{ textTransform: "capitalize" }}>{params.to}</Text>
                      <Text>{arrivalDate}</Text>
                    </View>
                  </View>
                </View>

                {params.tripType == 2 && params.flightType == 1 && (
                  <View
                    style={{
                      height: 1.35,
                      backgroundColor: "#F2F3F5",
                      marginVertical: 10,
                      flex: 1
                    }}></View>
                )}
                {params.tripType == 2 && params.flightType == 1 && (
                  <View>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Image
                        source={require("../../assets/imgs/flightSearch.png")}
                        resizeMode="contain"
                        style={{ width: 30 }}
                      />
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "500",
                          marginStart: 5
                        }}>
                        Return
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 10 }}>
                      {/* <Image
                          source={require("../../assets/imgs/indigo.png")}
                          resizeMode="contain"
                          style={{ width: 40 }}
                        /> */}
                      <Image
                        style={{ width: 35, resizeMode: "contain" }}
                        source={{ uri: imgRet || "https://via.placeholder.com/150" }}
                      />
                      <View style={{ flex: 1, marginStart: 10 }}>
                        <Text>
                          {params.arrivalFlight.FlightSegments[0].AirLineName} |{" "}
                          {params.arrivalFlight.FlightUId}
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between"
                          }}>
                          <Text style={{ fontSize: 18, fontWeight: "700" }}>{ddReturn}</Text>
                          <Text
                            style={{
                              fontSize: 18,
                              fontWeight: "700"
                            }}>
                            {adReturn}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 5
                      }}>
                      <View>
                        <Text style={{ textTransform: "capitalize" }}>{params.to}</Text>
                        <Text>{departureDateReturn}</Text>
                      </View>
                      <View>
                        <Text style={{ alignSelf: "center" }}>{params.className}</Text>
                        <View
                          style={{
                            height: 1.35,
                            width: 90,
                            backgroundColor: "#D1D1D1"
                          }}></View>
                      </View>
                      <View>
                        <Text style={{ textTransform: "capitalize" }}>{params.from}</Text>
                        <Text>{arrivalDateReturn}</Text>
                      </View>
                    </View>
                  </View>
                )}
              </View>

              <View
                style={{
                  elevation: 2,
                  shadowOffset: { width: 0, height: 2 },
                  shadowColor: "rgba(0,0,0,0.1)",
                  shadowOpacity: 1,
                  shadowRadius: 4,
                  backgroundColor: "#ffffff",
                  marginHorizontal: 16,
                  borderRadius: 8
                }}>
                <View
                  style={{
                    flexDirection: "row",
                    marginHorizontal: 10,
                    marginVertical: 5,
                    alignItems: "center"
                  }}>
                  <IconSimple name="bag" size={24} />
                  <Text style={{ fontSize: 18, fontWeight: "500", marginStart: 5 }}>
                    Price Summary
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between"
                  }}>
                  <Text style={{ marginStart: 10 }}>No. of Adult</Text>
                  <Text style={{ marginEnd: 10, alignItems: "flex-start" }}>{params.adult}</Text>
                </View>
                {params.child > 0 && (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between"
                    }}>
                    <Text style={{ marginStart: 10 }}>No. of Child</Text>
                    <Text style={{ marginEnd: 10, alignItems: "flex-start" }}>{params.child}</Text>
                  </View>
                )}
                {params.infant > 0 && (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between"
                    }}>
                    <Text style={{ marginStart: 10 }}>No. of Infant</Text>
                    <Text style={{ marginEnd: 10, alignItems: "flex-start" }}>{params.infant}</Text>
                  </View>
                )}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between"
                  }}>
                  <Text style={{ marginStart: 10 }}>Base Fare</Text>
                  <Text style={{ marginEnd: 10 }}>
                    {"₹" + params.departFlight.FareDetails.ChargeableFares.ActualBaseFare}
                  </Text>
                </View>
                {isArray(this.state.data.cart_data) && this.state.data.cart_data.length > 0 && (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between"
                    }}>
                    <Text style={{ marginStart: 10 }}>Fee & Surcharges</Text>
                    <Text style={{ marginEnd: 10 }}>
                      {"₹" +
                        this.state.data.cart_data[0].custum_product_data.flight_book_item
                          .flight_schagre}
                    </Text>
                  </View>
                )}

                {isArray(this.state.data.cart_data) && this.state.data.cart_data.length > 0 && (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between"
                    }}>
                    <Text style={{ marginStart: 10 }}>Tax</Text>
                    <Text style={{ marginEnd: 10 }}>
                      {"₹" +
                        this.state.data.cart_data[0].custum_product_data.flight_book_item
                          .flight_tax}
                    </Text>
                  </View>
                )}

                <View
                  style={{
                    marginEnd: 10,
                    flexDirection: "row",
                    justifyContent: "space-between"
                  }}>
                  <Text style={{ marginStart: 10 }}>Total Booking Price</Text>
                  <Text style={{ marginStart: 10 }}>
                    ₹{params.departFlight.FareDetails.TotalFare}
                  </Text>
                </View>

                {params.tripType == 2 && params.flightType == 1 && (
                  <View>
                    <Text style={{ marginStart: 10, fontWeight: "500", fontSize: 16 }}>Return</Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between"
                      }}>
                      <Text style={{ marginStart: 10 }}>Base Fare</Text>
                      <Text style={{ marginEnd: 10 }}>
                        {"₹" + params.arrivalFlight.FareDetails.ChargeableFares.ActualBaseFare}
                      </Text>
                    </View>
                    {isArray(this.state.data.cart_data) && this.state.data.cart_data.length > 0 && (
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between"
                        }}>
                        <Text style={{ marginStart: 10 }}>Fee & Surcharges</Text>
                        <Text style={{ marginEnd: 10 }}>
                          {"₹" +
                            this.state.data.cart_data[0].custum_product_data.flight_book_item
                              .return_flight_schagre}
                        </Text>
                      </View>
                    )}

                    {isArray(this.state.data.cart_data) && this.state.data.cart_data.length > 0 && (
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between"
                        }}>
                        <Text style={{ marginStart: 10 }}>Tax</Text>
                        <Text style={{ marginEnd: 10 }}>
                          {"₹" +
                            this.state.data.cart_data[0].custum_product_data.flight_book_item
                              .return_flight_tax}
                        </Text>
                      </View>
                    )}

                    <View
                      style={{
                        marginEnd: 10,
                        flexDirection: "row",
                        justifyContent: "space-between"
                      }}>
                      <Text style={{ marginStart: 10 }}>Total Booking Price</Text>
                      <Text style={{ marginStart: 10 }}>
                        ₹{params.arrivalFlight.FareDetails.TotalFare}
                      </Text>
                    </View>
                  </View>
                )}

                {this.state.data.cart_data && isArray(this.state.data.cart_data) && (
                  <View
                    style={{
                      marginEnd: 10,
                      flexDirection: "row",
                      justifyContent: "space-between"
                    }}>
                    <Text style={{ marginStart: 10 }}>Convenience Fees</Text>
                    <HTML
                      html={
                        this.state.data.cart_data[0].custum_product_data.flight_book_item
                          .ConvenienceFee
                      }
                    />
                  </View>
                )}

                {!this.state.inputCoupon && (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between"
                    }}>
                    {Array.isArray(this.state.data.coupon) && this.state.data.coupon.length > 0 && (
                      <Text style={{ marginStart: 10 }}>Discount</Text>
                    )}
                    {Array.isArray(this.state.data.coupon) &&
                      this.state.data.coupon.length > 0 &&
                      this.state.data.coupon.map(coupon => (
                        <HTML
                          key={coupon.code}
                          baseFontStyle={{
                            color: "green",
                            fontWeight: "700"
                          }}
                          containerStyle={{ marginHorizontal: 10 }}
                          html={"- " + coupon.discount}
                        />
                      ))}
                  </View>
                )}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: 10,
                    borderBottomLeftRadius: 8,
                    borderBottomRightRadius: 8,
                    backgroundColor: "#F2F3F5"
                  }}>
                  <Text style={{ marginStart: 10, fontWeight: "700", fontSize: 16 }}>
                    Total Payable
                  </Text>
                  <Text style={{ marginEnd: 10, fontWeight: "700", fontSize: 16 }}>
                    ₹ {this.state.data.total_price}
                  </Text>
                </View>
              </View>
              {this.state.data.hasOwnProperty("coupon") && this.state.data.coupon.length == 0 ? (
                this.state.inputCoupon ? (
                  <View
                    style={{
                      elevation: 1,
                      backgroundColor: "#fff",
                      justifyContent: "center",
                      marginVertical: 20,
                      paddingVertical: Platform.OS == "ios" ? 10 : 0,
                      marginHorizontal: 16,
                      shadowOffset: { width: 0, height: 2 },
                      shadowColor: "rgba(0,0,0,0.1)",
                      shadowOpacity: 1,
                      shadowRadius: 4,
                      borderRadius: 8
                    }}>
                    <TextInput
                      placeholder="Enter Coupon Code"
                      value={this.state.coupon_code}
                      style={{ marginStart: 5 }}
                      onChangeText={text => this.setState({ coupon_code: text })}
                    />
                    <Button
                      onPress={this.applyCoupon}
                      style={{
                        position: "absolute",
                        backgroundColor: "#222222",
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        end: 8,
                        zIndex: 1,
                        elevation: 1,
                        shadowOpacity: 0.2,
                        shadowRadius: 1,
                        borderRadius: 8,
                        shadowOffset: { height: 1, width: 0 }
                      }}>
                      <Text style={{ color: "#FFFFFF" }}>Apply</Text>
                    </Button>
                  </View>
                ) : (
                  <Button
                    onPress={this.toggleCoupon(true)}
                    style={[
                      styles.billingContainer,
                      styles.billingRow,
                      { justifyContent: "flex-start", marginHorizontal: 16, marginVertical: 20 }
                    ]}>
                    <Icon
                      name="brightness-percent"
                      size={20}
                      color="#E7BA34"
                      type="MaterialCommunityIcons"
                    />
                    <Text style={{ fontWeight: "700", marginStart: 8 }}>APPLY COUPON</Text>
                    <Icon
                      name="ios-arrow-forward"
                      style={{ fontSize: 20, color: "#E7BA34", marginStart: "auto" }}
                      size={20}
                    />
                  </Button>
                )
              ) : (
                Array.isArray(this.state.data.coupon) &&
                this.state.data.coupon.length > 0 &&
                this.state.data.coupon.map(coupon => (
                  <View
                    style={[
                      styles.billingContainer,
                      styles.billingRow,
                      { marginHorizontal: 16, marginVertical: 20 }
                    ]}
                    key={coupon.code}>
                    <Text style={{ fontWeight: "700", textTransform: "uppercase" }}>
                      {coupon.code}
                    </Text>
                    <Button
                      style={{ marginStart: "auto", padding: 5 }}
                      onPress={this.removeCoupon(coupon.code)}>
                      <Icon name="md-close" color="#E7BA34" size={20} />
                    </Button>
                  </View>
                ))
              )}
              <Button
                style={{
                  backgroundColor: "#F68E1D",
                  marginHorizontal: 100,
                  alignItems: "center",
                  justifyContent: "center",
                  height: 36,
                  marginVertical: 20,
                  borderRadius: 20
                }}
                onPress={this.navigateToScreen("CheckOut1", params)}>
                <Text style={{ color: "#fff" }}>Next</Text>
              </Button>
            </ScrollView>
            {this.state.loading && <ActivityIndicator />}
          </SafeAreaView>
        </>
      );
    } else if (params.flightType == 2) {
      return (
        <>
          <SafeAreaView style={{ flex: 0, backgroundColor: "#E5EBF7" }} />
          <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
            <View style={{ backgroundColor: "#E5EBF7" }}>
              <View
                style={{
                  flexDirection: "row",
                  marginHorizontal: 16,
                  marginVertical: 20
                }}>
                <Button onPress={() => this.props.navigation.goBack(null)}>
                  <Icon name="md-arrow-back" size={24} />
                </Button>
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    flex: 1
                  }}>
                  <View>
                    <Text
                      style={{
                        fontWeight: "700",
                        fontSize: 16,
                        marginHorizontal: 20
                      }}>
                      Flight Summary
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        marginHorizontal: 20,
                        color: "#717984"
                      }}>
                      {params.journey_date} {params.return_date ? "- " + params.return_date : null}{" "}
                      | {params.adult > 0 ? params.adult + " Adult" : " "}
                      {params.child > 0 ? " , " + params.child + " Child" : " "}
                      {params.infant > 0 ? " , " + params.infant + " Infant" : " "} |{" "}
                      {params.className}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <ScrollView style={{ flex: 4, backgroundColor: "#FFFFFF" }}>
              <View
                style={{
                  elevation: 2,
                  shadowOffset: { width: 0, height: 2 },
                  shadowColor: "rgba(0,0,0,0.1)",
                  shadowOpacity: 1,
                  shadowRadius: 4,
                  backgroundColor: "#ffffff",
                  marginHorizontal: 16,
                  marginVertical: 20,
                  borderRadius: 8,
                  padding: 10
                }}>
                <View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      source={require("../../assets/imgs/flightSearch.png")}
                      resizeMode="contain"
                      style={{ width: 30 }}
                    />
                    <Text style={{ fontSize: 18, fontWeight: "500", marginStart: 10 }}>
                      Departure
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", marginTop: 10 }}>
                    <Image
                      style={{ width: 35, resizeMode: "contain" }}
                      source={{ uri: img || "https://via.placeholder.com/150" }}
                    />
                    <View style={{ marginStart: 10, flex: 1 }}>
                      <Text>
                        {params.departFlight.IntOnward.FlightSegments[0].AirLineName} |{" "}
                        {params.departFlight.FlightUId}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between"
                        }}>
                        <Text style={{ fontSize: 18, fontWeight: "700" }}>{dd}</Text>
                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: "700"
                          }}>
                          {ad}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 5
                    }}>
                    <View>
                      <Text style={{ textTransform: "capitalize" }}>{params.from}</Text>
                      <Text>{departureDate}</Text>
                    </View>
                    <View>
                      <Text style={{ alignSelf: "center" }}>{params.className}</Text>
                      <View
                        style={{
                          height: 1.35,
                          width: 90,
                          backgroundColor: "#D1D1D1"
                        }}></View>
                    </View>
                    <View>
                      <Text style={{ textTransform: "capitalize" }}>{params.to}</Text>
                      <Text>{arrivalDate}</Text>
                    </View>
                  </View>
                </View>

                {params.tripType == 2 && params.flightType == 2 && (
                  <View
                    style={{
                      height: 1.35,
                      backgroundColor: "#F2F3F5",
                      marginVertical: 10,
                      flex: 1
                    }}></View>
                )}
                {params.tripType == 2 && params.flightType == 2 && (
                  <View>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Image
                        source={require("../../assets/imgs/flightSearch.png")}
                        resizeMode="contain"
                        style={{ width: 30 }}
                      />
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "500",
                          marginStart: 10
                        }}>
                        Return
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 10 }}>
                      <Image
                        source={{ uri: imgIntRet || "https://via.placeholder.com/150" }}
                        resizeMode="contain"
                        style={{ width: 40 }}
                      />
                      <View style={{ flex: 1, marginStart: 10 }}>
                        <Text>
                          {params.departFlight.IntReturn.FlightSegments[0].AirLineName} |{" "}
                          {params.departFlight.FlightUId}
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between"
                          }}>
                          <Text style={{ fontSize: 18, fontWeight: "700" }}>{ddIntReturn}</Text>
                          <Text
                            style={{
                              fontSize: 18,
                              fontWeight: "700"
                            }}>
                            {adIntReturn}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 5
                      }}>
                      <View>
                        <Text style={{ textTransform: "capitalize" }}>{params.to}</Text>
                        <Text>{departureDateIntReturn}</Text>
                      </View>
                      <View>
                        <Text style={{ alignSelf: "center" }}>{params.className}</Text>
                        <View
                          style={{
                            height: 1.35,
                            width: 90,
                            backgroundColor: "#D1D1D1"
                          }}></View>
                      </View>
                      <View>
                        <Text style={{ textTransform: "capitalize" }}>{params.from}</Text>
                        <Text>{arrivalDateIntReturn}</Text>
                      </View>
                    </View>
                  </View>
                )}
              </View>

              <View
                style={{
                  elevation: 2,
                  shadowOffset: { width: 0, height: 2 },
                  shadowColor: "rgba(0,0,0,0.1)",
                  shadowOpacity: 1,
                  shadowRadius: 4,
                  backgroundColor: "#ffffff",
                  marginHorizontal: 16,
                  borderRadius: 8
                }}>
                <View
                  style={{
                    flexDirection: "row",
                    marginHorizontal: 10,
                    marginVertical: 5,
                    alignItems: "center"
                  }}>
                  <IconSimple name="bag" size={24} />
                  <Text style={{ fontSize: 18, fontWeight: "500", marginStart: 5 }}>
                    Price Summary
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between"
                  }}>
                  <Text style={{ marginStart: 10 }}>No. of Adult</Text>
                  <Text style={{ marginEnd: 10, alignItems: "flex-start" }}>{params.adult}</Text>
                </View>
                {params.child > 0 && (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between"
                    }}>
                    <Text style={{ marginStart: 10 }}>No. of Child</Text>
                    <Text style={{ marginEnd: 10, alignItems: "flex-start" }}>{params.child}</Text>
                  </View>
                )}
                {params.infant > 0 && (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between"
                    }}>
                    <Text style={{ marginStart: 10 }}>No. of Infant</Text>
                    <Text style={{ marginEnd: 10, alignItems: "flex-start" }}>{params.infant}</Text>
                  </View>
                )}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between"
                  }}>
                  <Text style={{ marginStart: 10 }}>Base Fare</Text>
                  <Text style={{ marginEnd: 10 }}>
                    ₹ {params.departFlight.FareDetails.ChargeableFares.ActualBaseFare}
                  </Text>
                </View>

                {isArray(this.state.data.cart_data) && this.state.data.cart_data.length > 0 && (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between"
                    }}>
                    <Text style={{ marginStart: 10 }}>Fee & Surcharges</Text>
                    <Text style={{ marginEnd: 10 }}>
                      {"₹" +
                        this.state.data.cart_data[0].custum_product_data.flight_book_item
                          .flight_schagre}
                    </Text>
                  </View>
                )}

                {this.state.data.cart_data && isArray(this.state.data.cart_data) && (
                  <View
                    style={{
                      flexDirection: "row",
                      marginEnd: 10,
                      justifyContent: "space-between"
                    }}>
                    <Text style={{ marginStart: 10 }}>Tax</Text>
                    <Text>
                      ₹
                      {params.departFlight.FareDetails.ChargeableFares.Tax +
                        params.departFlight.FareDetails.ChargeableFares.STax}
                    </Text>
                    {/* <HTML
                      html={
                        "₹" +
                        parseInt(
                          this.state.data.cart_data[0].custum_product_data.flight_book_item
                            .flight_tax
                        ) +
                        parseInt(params.departFlight.FareDetails.ChargeableFares.STax)
                      }
                    /> */}
                  </View>
                )}

                <View
                  style={{
                    marginEnd: 10,
                    flexDirection: "row",
                    justifyContent: "space-between"
                  }}>
                  <Text style={{ marginStart: 10 }}>Total Booking Price</Text>
                  <Text style={{ marginStart: 10 }}>
                    ₹{params.departFlight.FareDetails.TotalFare}
                  </Text>
                </View>

                {this.state.data.cart_data && isArray(this.state.data.cart_data) && (
                  <View
                    style={{
                      flexDirection: "row",
                      marginEnd: 10,
                      justifyContent: "space-between"
                    }}>
                    <Text style={{ marginStart: 10 }}>Convenience Fees</Text>
                    <HTML
                      html={
                        this.state.data.cart_data[0].custum_product_data.flight_book_item
                          .ConvenienceFee
                      }
                    />
                  </View>
                )}

                {!this.state.inputCoupon && (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between"
                    }}>
                    {Array.isArray(this.state.data.coupon) && this.state.data.coupon.length > 0 && (
                      <Text style={{ marginStart: 10 }}>Discount</Text>
                    )}
                    {Array.isArray(this.state.data.coupon) &&
                      this.state.data.coupon.length > 0 &&
                      this.state.data.coupon.map(coupon => (
                        <HTML
                          key={coupon.code}
                          baseFontStyle={{
                            color: "green",
                            fontWeight: "700"
                          }}
                          containerStyle={{ marginHorizontal: 10 }}
                          html={"- " + coupon.discount}
                        />
                      ))}
                  </View>
                )}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: 10,
                    borderBottomLeftRadius: 8,
                    borderBottomRightRadius: 8,
                    backgroundColor: "#F2F3F5"
                  }}>
                  <Text style={{ marginStart: 10, fontWeight: "600", fontSize: 16 }}>
                    Total Payable
                  </Text>
                  <Text style={{ marginEnd: 10, fontWeight: "700", fontSize: 16 }}>
                    ₹ {this.state.data.total_price}
                  </Text>
                </View>
              </View>
              {this.state.data.hasOwnProperty("coupon") && this.state.data.coupon.length == 0 ? (
                this.state.inputCoupon ? (
                  <View
                    style={{
                      elevation: 1,
                      backgroundColor: "#fff",
                      justifyContent: "center",
                      marginVertical: 20,
                      paddingVertical: Platform.OS == "ios" ? 10 : 0,
                      marginHorizontal: 16,
                      shadowOffset: { width: 0, height: 2 },
                      shadowColor: "rgba(0,0,0,0.1)",
                      shadowOpacity: 1,
                      shadowRadius: 4,
                      borderRadius: 8
                    }}>
                    <TextInput
                      placeholder="Enter Coupon Code"
                      value={this.state.coupon_code}
                      style={{ marginStart: 5 }}
                      onChangeText={text => this.setState({ coupon_code: text })}
                    />
                    <Button
                      onPress={this.applyCoupon}
                      style={{
                        position: "absolute",
                        backgroundColor: "#222222",
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        end: 8,
                        zIndex: 1,
                        elevation: 1,
                        shadowOpacity: 0.2,
                        shadowRadius: 1,
                        borderRadius: 8,
                        shadowOffset: { height: 1, width: 0 }
                      }}>
                      <Text style={{ color: "#FFFFFF" }}>Apply</Text>
                    </Button>
                  </View>
                ) : (
                  <Button
                    onPress={this.toggleCoupon(true)}
                    style={[
                      styles.billingContainer,
                      styles.billingRow,
                      { justifyContent: "flex-start", marginHorizontal: 16, marginVertical: 20 }
                    ]}>
                    <Icon
                      name="brightness-percent"
                      size={20}
                      color="#E7BA34"
                      type="MaterialCommunityIcons"
                    />
                    <Text style={{ fontWeight: "700", marginStart: 8 }}>APPLY COUPON</Text>
                    <Icon
                      name="ios-arrow-forward"
                      style={{ fontSize: 20, color: "#E7BA34", marginStart: "auto" }}
                      size={20}
                    />
                  </Button>
                )
              ) : (
                Array.isArray(this.state.data.coupon) &&
                this.state.data.coupon.length > 0 &&
                this.state.data.coupon.map(coupon => (
                  <View
                    style={[
                      styles.billingContainer,
                      styles.billingRow,
                      { marginHorizontal: 16, marginVertical: 20 }
                    ]}
                    key={coupon.code}>
                    <Text style={{ fontWeight: "700", textTransform: "uppercase" }}>
                      {coupon.code}
                    </Text>
                    <Button
                      style={{ marginStart: "auto", padding: 5 }}
                      onPress={this.removeCoupon(coupon.code)}>
                      <Icon name="md-close" color="#E7BA34" size={20} />
                    </Button>
                  </View>
                ))
              )}
              <Button
                style={{
                  backgroundColor: "#F68E1D",
                  marginHorizontal: 100,
                  alignItems: "center",
                  justifyContent: "center",
                  height: 36,
                  borderRadius: 20,
                  marginVertical: 20
                }}
                onPress={this.navigateToScreen("CheckOut1", params)}>
                <Text style={{ color: "#fff" }}>Next</Text>
              </Button>
            </ScrollView>
            {this.state.loading && <ActivityIndicator />}
          </SafeAreaView>
        </>
      );
    }
  }
}

const styles = StyleSheet.create({
  billingContainer: {
    elevation: 1,
    shadowOpacity: 0.2,
    shadowRadius: 1,
    shadowOffset: { height: 1, width: 0 },
    padding: 8,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginVertical: 8
  },
  billingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 8
  }
});

export default CheckOut;
