import React, { PureComponent } from "react";
import { View, Image, TextInput, ScrollView, SafeAreaView } from "react-native";
import Toast from "react-native-simple-toast";
import { Button, Text, ActivityIndicator, Icon } from "../../components";
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";
import IconSimple from "react-native-vector-icons/SimpleLineIcons";
import moment from "moment";
import axios from "axios";

class CheckOut extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log(this.props.navigation.state.params);
    this.state = {
      loading: false,
      return: false
    };
  }

  navigateToScreen = (page, params = {}) => () => {
    const { params } = this.props.navigation.state;
    Object.assign(params, {
      itemId: 87
    });

    let dt =
      params.flightType == 1
        ? moment(params.departFlight.FlightSegments[0].DepartureDateTime).format("HH:MM")
        : moment(params.departFlight.IntOnward.FlightSegments[0].DepartureDateTime).format("HH:MM");

    let dtReturn =
      params.flightType == 2 && params.tripType == 2
        ? moment(params.departFlight.IntReturn.FlightSegments[0].DepartureDateTime).format("HH:MM")
        : params.flightType == 1 && params.tripType == 2
        ? moment(params.arrivalFlight.FlightSegments[0].DepartureDateTime).format("HH:MM")
        : "";

    let at =
      params.flightType == 1
        ? moment(
            params.departFlight.FlightSegments[params.departFlight.FlightSegments.length - 1]
              .ArrivalDateTime
          ).format("HH:MM")
        : moment(
            params.departFlight.IntOnward.FlightSegments[
              params.departFlight.IntOnward.FlightSegments.length - 1
            ].ArrivalDateTime
          ).format("HH:MM");

    let atReturn =
      params.flightType == 2 && params.tripType == 2
        ? moment(
            params.departFlight.IntReturn.FlightSegments[
              params.departFlight.IntReturn.FlightSegments.length - 1
            ].ArrivalDateTime
          ).format("HH:MM")
        : params.flightType == 1 && params.tripType == 2
        ? moment(
            params.arrivalFlight.FlightSegments[params.arrivalFlight.FlightSegments.length - 1]
              .ArrivalDateTime
          ).format("HH:MM")
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
          : "",
      fl_adults: params.adult,
      fl_children: params.child,
      fl_infant: params.infant,
      fl_ctype: params.className
    };

    console.log(JSON.stringify(param));

    this.setState({ loading: true });
    axios
      .post("https://demo66.tutiixx.com/wp-json/wc/v2/cart/add", param)
      .then(res => {
        console.log(res);
        // if (res.data.code == 1) {
        axios
          .get("https://demo66.tutiixx.com/wp-json/wc/v2/cart")
          .then(({ data }) => {
            console.log(data);
            this.props.navigation.navigate(page, { params, data });
            this.setState({ loading: false });
          })
          .catch(error => {
            Toast.show(error, Toast.LONG);
            this.setState({ loading: false });
          });
        // }
      })
      .catch(error => {
        Toast.show(error, Toast.LONG);
        this.setState({ loading: false });
      });
  };

  render() {
    const { params } = this.props.navigation.state;

    if (params.flightType == 2 && params.tripType == 2) {
      var imgIntRet =
        "http://webapi.i2space.co.in" + params.departFlight.IntReturn.FlightSegments[0].ImagePath;
      var ddIntReturn = moment(
        params.departFlight.IntReturn.FlightSegments[0].DepartureDateTime
      ).format("HH:MM");
      var adIntReturn = moment(
        params.departFlight.IntReturn.FlightSegments[
          params.departFlight.IntReturn.FlightSegments.length - 1
        ].ArrivalDateTime
      ).format("HH:MM");
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
        "HH:MM"
      );
      var adReturn = moment(
        params.arrivalFlight.FlightSegments[params.arrivalFlight.FlightSegments.length - 1]
          .ArrivalDateTime
      ).format("HH:MM");
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
        ? moment(params.departFlight.FlightSegments[0].DepartureDateTime).format("HH:MM")
        : moment(params.departFlight.IntOnward.FlightSegments[0].DepartureDateTime).format("HH:MM");
    var ad =
      params.flightType == 1
        ? moment(
            params.departFlight.FlightSegments[params.departFlight.FlightSegments.length - 1]
              .ArrivalDateTime
          ).format("HH:MM")
        : moment(
            params.departFlight.IntOnward.FlightSegments[
              params.departFlight.IntOnward.FlightSegments.length - 1
            ].ArrivalDateTime
          ).format("HH:MM");

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
            <View style={{ flexDirection: "column", flex: 1 }}>
              <View style={{ height: 56, backgroundColor: "#E5EBF7" }}>
                <View
                  style={{
                    flexDirection: "row",
                    marginHorizontal: 16,
                    marginVertical: 10
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
                          marginHorizontal: 5
                        }}>
                        Checkout
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          marginHorizontal: 5,
                          color: "#717984"
                        }}>
                        {params.journey_date}{" "}
                        {params.return_date ? "- " + params.return_date : null} |{" "}
                        {params.adult > 0 ? params.adult + " Adult" : " "}
                        {params.child > 0 ? " , " + params.child + " Child" : " "}
                        {params.infant > 0 ? " , " + params.infant + " Infant" : " "} |{" "}
                        {params.className}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "flex-start"
                      }}>
                      <IconMaterial name="share-variant" size={20} color="#5D89F4" />
                    </View>
                  </View>
                </View>
              </View>
              <ScrollView style={{ flex: 4, backgroundColor: "#FFFFFF" }}>
                <View
                  style={{
                    elevation: 2,
                    backgroundColor: "#ffffff",
                    marginHorizontal: 16,
                    marginVertical: 20,
                    borderRadius: 8,
                    padding: 10
                  }}>
                  <View>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Image
                        source={require("../../assets/imgs/flights-1.png")}
                        resizeMode="contain"
                        style={{ width: 40 }}
                      />
                      <Text style={{ marginStart: 10, fontWeight: "300", fontSize: 16 }}>
                        Departure
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 10 }}>
                      <Image style={{ width: 35, resizeMode: "contain" }} source={{ uri: img }} />
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
                        <Text>{params.from}</Text>
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
                        <Text>{params.to}</Text>
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
                          source={require("../../assets/imgs/flights-1.png")}
                          resizeMode="contain"
                          style={{ width: 40 }}
                        />
                        <Text
                          style={{
                            marginStart: 10,
                            fontWeight: "300",
                            fontSize: 16
                          }}>
                          Arrival
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
                          source={{ uri: imgRet }}
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
                          <Text>{params.to}</Text>
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
                          <Text>{params.from}</Text>
                          <Text>{arrivalDateReturn}</Text>
                        </View>
                      </View>
                    </View>
                  )}
                </View>

                <View
                  style={{
                    elevation: 2,
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
                      Fare Backup
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
                      <Text style={{ marginEnd: 10, alignItems: "flex-start" }}>
                        {params.child}
                      </Text>
                    </View>
                  )}
                  {params.infant > 0 && (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between"
                      }}>
                      <Text style={{ marginStart: 10 }}>No. of Infant</Text>
                      <Text style={{ marginEnd: 10, alignItems: "flex-start" }}>
                        {params.infant}
                      </Text>
                    </View>
                  )}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between"
                    }}>
                    <Text style={{ marginStart: 10 }}>Base Fare</Text>
                    <Text style={{ marginEnd: 10 }}>
                      {params.departFlight.FareDetails.ChargeableFares.ActualBaseFare}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between"
                    }}>
                    <Text style={{ marginStart: 10 }}>Fee & Surcharges</Text>
                    <Text style={{ marginEnd: 10 }}>
                      {params.departFlight.FareDetails.ChargeableFares.SCharge}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between"
                    }}>
                    <Text style={{ marginStart: 10 }}>GST</Text>
                    <Text style={{ marginEnd: 10 }}>
                      {params.departFlight.FareDetails.ChargeableFares.STax}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between"
                    }}>
                    <Text style={{ marginStart: 10 }}>Conve. Fee</Text>
                    <Text style={{ marginEnd: 10 }}>
                      {params.departFlight.FareDetails.ChargeableFares.Conveniencefee}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between"
                    }}>
                    <Text style={{ marginStart: 10 }}>Tax</Text>
                    <Text style={{ marginEnd: 10 }}>
                      {params.departFlight.FareDetails.ChargeableFares.Tax}
                    </Text>
                  </View>
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
                      $ {params.departFlight.FareDetails.TotalFare}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    elevation: 2,
                    backgroundColor: "#ffffff",
                    marginHorizontal: 16,
                    marginVertical: 20,
                    borderRadius: 8,
                    height: 40,
                    justifyContent: "space-between",
                    flexDirection: "row"
                  }}>
                  <TextInput
                    placeholder="Have a Promo Code?"
                    style={{ marginStart: 5, flex: 1 }}></TextInput>
                  <Button
                    style={{
                      backgroundColor: "#5B89F9",
                      justifyContent: "center",
                      borderBottomRightRadius: 8,
                      borderTopRightRadius: 8
                    }}>
                    <Text style={{ color: "#fff", paddingHorizontal: 10 }}>Apply</Text>
                  </Button>
                </View>
                <Button
                  style={{
                    backgroundColor: "#F68E1D",
                    marginHorizontal: 100,
                    alignItems: "center",
                    justifyContent: "center",
                    height: 40,
                    marginBottom: 20,
                    borderRadius: 20
                  }}
                  onPress={this.navigateToScreen("CheckOut1", params)}>
                  <Text style={{ color: "#fff" }}>Next</Text>
                </Button>
              </ScrollView>
              {this.state.loading && <ActivityIndicator />}
            </View>
          </SafeAreaView>
        </>
      );
    } else if (params.flightType == 2) {
      return (
        <>
          <SafeAreaView style={{ flex: 0, backgroundColor: "#E5EBF7" }} />
          <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
            <View style={{ flexDirection: "column", flex: 1 }}>
              <View style={{ height: 56, backgroundColor: "#E5EBF7" }}>
                <View
                  style={{
                    flexDirection: "row",
                    marginHorizontal: 16,
                    marginVertical: 10
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
                          marginHorizontal: 5
                        }}>
                        Checkout
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          marginHorizontal: 5,
                          color: "#717984"
                        }}>
                        {params.journey_date}{" "}
                        {params.return_date ? "- " + params.return_date : null} |{" "}
                        {params.adult > 0 ? params.adult + " Adult" : " "}
                        {params.child > 0 ? " , " + params.child + " Child" : " "}
                        {params.infant > 0 ? " , " + params.infant + " Infant" : " "} |{" "}
                        {params.className}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "flex-start"
                      }}>
                      <IconMaterial name="share-variant" size={20} color="#5D89F4" />
                    </View>
                  </View>
                </View>
              </View>
              <ScrollView style={{ flex: 4, backgroundColor: "#FFFFFF" }}>
                <View
                  style={{
                    elevation: 2,
                    backgroundColor: "#ffffff",
                    marginHorizontal: 16,
                    marginVertical: 20,
                    borderRadius: 8,
                    padding: 10
                  }}>
                  <View>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Image
                        source={require("../../assets/imgs/flights-1.png")}
                        resizeMode="contain"
                        style={{ width: 40 }}
                      />
                      <Text style={{ marginStart: 10, fontWeight: "300", fontSize: 16 }}>
                        Departure
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 10 }}>
                      <Image style={{ width: 35, resizeMode: "contain" }} source={{ uri: img }} />
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
                        <Text>{params.from}</Text>
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
                        <Text>{params.to}</Text>
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
                          source={require("../../assets/imgs/flights-1.png")}
                          resizeMode="contain"
                          style={{ width: 40 }}
                        />
                        <Text
                          style={{
                            marginStart: 10,
                            fontWeight: "300",
                            fontSize: 16
                          }}>
                          Arrival
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row", marginTop: 10 }}>
                        <Image
                          source={{ uri: imgIntRet }}
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
                          <Text>{params.to}</Text>
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
                          <Text>{params.from}</Text>
                          <Text>{arrivalDateIntReturn}</Text>
                        </View>
                      </View>
                    </View>
                  )}
                </View>

                <View
                  style={{
                    elevation: 2,
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
                      Fare Backup
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
                      <Text style={{ marginEnd: 10, alignItems: "flex-start" }}>
                        {params.child}
                      </Text>
                    </View>
                  )}
                  {params.infant > 0 && (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between"
                      }}>
                      <Text style={{ marginStart: 10 }}>No. of Infant</Text>
                      <Text style={{ marginEnd: 10, alignItems: "flex-start" }}>
                        {params.infant}
                      </Text>
                    </View>
                  )}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between"
                    }}>
                    <Text style={{ marginStart: 10 }}>Base Fare</Text>
                    <Text style={{ marginEnd: 10 }}>
                      {params.departFlight.FareDetails.ChargeableFares.ActualBaseFare}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between"
                    }}>
                    <Text style={{ marginStart: 10 }}>Fee & Surcharges</Text>
                    <Text style={{ marginEnd: 10 }}>
                      {params.departFlight.FareDetails.ChargeableFares.SCharge}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between"
                    }}>
                    <Text style={{ marginStart: 10 }}>GST</Text>
                    <Text style={{ marginEnd: 10 }}>
                      {params.departFlight.FareDetails.IsGSTMandatory == false ? 0 : 0}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between"
                    }}>
                    <Text style={{ marginStart: 10 }}>Conve. Fee</Text>
                    <Text style={{ marginEnd: 10 }}>
                      {params.departFlight.FareDetails.ChargeableFares.Conveniencefee}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between"
                    }}>
                    <Text style={{ marginStart: 10 }}>Tax</Text>
                    <Text style={{ marginEnd: 10 }}>
                      {params.departFlight.FareDetails.ChargeableFares.Tax +
                        params.departFlight.FareDetails.ChargeableFares.STax}
                    </Text>
                  </View>
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
                      $ {params.departFlight.FareDetails.TotalFare}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    elevation: 2,
                    backgroundColor: "#ffffff",
                    marginHorizontal: 16,
                    marginVertical: 20,
                    borderRadius: 8,
                    height: 40,
                    justifyContent: "space-between",
                    flexDirection: "row"
                  }}>
                  <TextInput
                    placeholder="Have a Promo Code?"
                    style={{ marginStart: 5, flex: 1 }}></TextInput>
                  <Button
                    style={{
                      backgroundColor: "#5B89F9",
                      justifyContent: "center",
                      borderBottomRightRadius: 8,
                      borderTopRightRadius: 8
                    }}>
                    <Text style={{ color: "#fff", paddingHorizontal: 10 }}>Apply</Text>
                  </Button>
                </View>
                <Button
                  style={{
                    backgroundColor: "#F68E1D",
                    marginHorizontal: 100,
                    alignItems: "center",
                    justifyContent: "center",
                    height: 40,
                    marginBottom: 20,
                    borderRadius: 20
                  }}
                  onPress={this.navigateToScreen("CheckOut1", params)}>
                  <Text style={{ color: "#fff" }}>Next</Text>
                </Button>
              </ScrollView>
              {this.state.loading && <ActivityIndicator />}
            </View>
          </SafeAreaView>
        </>
      );
    }
  }
}

export default CheckOut;
