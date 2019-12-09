import React, { PureComponent } from "react";
import { Text, Button } from "../components";
import { View, StyleSheet, SafeAreaView, Dimensions, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import moment from "moment";

const { width, height } = Dimensions.get("window");
class OrderDetails extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log(props.navigation.state.params);
  }

  _goBack = () => {
    this.props.navigation.goBack(null);
  };

  hasJsonStructure(str) {
    if (typeof str !== "string") return false;
    try {
      const result = JSON.parse(str);
      const type = Object.prototype.toString.call(result);
      return type === "[object Object]" || type === "[object Array]";
    } catch (err) {
      return false;
    }
  }

  render() {
    const {
      adult_details,
      child_details,
      infan_details,
      order_data
    } = this.props.navigation.state.params;
    JSON.parse('{ "name":"John", "age":30, "city":"New York"}');
    const dataArray = order_data.line_items[0].meta_data.reduce(
      (obj, item) => (
        (obj[item.key] = this.hasJsonStructure(item.value) ? JSON.parse(item.value) : item.value),
        obj
      ),
      {}
    );
    console.log(dataArray);

    const {
      "Int Fl Item Result Data": International,
      "Onward Item Result Data": Onward_Domestic,
      "Return Item Result Data": Retun_Domestic,
      "Single Hotel Data": Hotel,
      "Car Item Data": Car,
      "Bus Item Result Data": Bus
    } = dataArray;

    if (International) {
      return (
        <>
          <SafeAreaView style={{ flex: 0, backgroundColor: "#ffffff" }} />
          <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  marginHorizontal: 16,
                  height: 56,
                  alignItems: "center"
                }}>
                <Button onPress={this._goBack}>
                  <Icon name="md-arrow-back" size={24} />
                </Button>
                <Text
                  style={{
                    fontSize: 18,
                    color: "#1E293B",
                    marginStart: 5,
                    fontWeight: "700"
                  }}>
                  #{order_data.id}
                </Text>
              </View>

              <View>
                <Text style={{ fontSize: 18, fontWeight: "700", marginHorizontal: 8 }}>Depart</Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginHorizontal: 8
                  }}>
                  <Text style={{ color: "#636C73", fontSize: 12 }}>
                    {dataArray["Departure Time"]}
                  </Text>
                  <Text style={{ color: "#636C73", fontSize: 12 }}>
                    {parseInt(dataArray["Flight Stop"]) == 0
                      ? "Non-Stop"
                      : dataArray["Flight Stop"]}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    marginHorizontal: 8,
                    justifyContent: "space-between"
                  }}>
                  <View style={{ flex: 2 }}>
                    <Text style={{ fontSize: 20, lineHeight: 22 }}>
                      {International.IntOnward.FlightSegments[0].AirLineName}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#5D646A",
                        lineHeight: 14
                      }}>
                      {International.FlightUId}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 20, lineHeight: 22 }}>
                      {dataArray["Departure Time"]}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#5D646A",
                        lineHeight: 14
                      }}>
                      {International.IntOnward.FlightSegments[0].IntDepartureAirportName}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 20, lineHeight: 22 }}>
                      {moment(
                        International.IntOnward.FlightSegments[
                          International.IntOnward.FlightSegments.length - 1
                        ].ArrivalDateTime
                      ).format("HH:mm")}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#5D646A",
                        lineHeight: 14
                      }}>
                      {
                        International.IntOnward.FlightSegments[
                          International.IntOnward.FlightSegments.length - 1
                        ].IntArrivalAirportName
                      }
                    </Text>
                  </View>
                  <View style={{ flex: 2 }}>
                    <Text style={{ fontSize: 20, lineHeight: 22 }}>
                      {International.IntOnward.FlightSegments.length == 1
                        ? International.IntOnward.FlightSegments[0].Duration
                        : International.IntOnward.FlightSegments[
                            International.IntOnward.FlightSegments.length - 1
                          ].AccumulatedDuration}
                    </Text>
                    <Text style={{ fontSize: 20, lineHeight: 22 }}>{dataArray["Class Type"]}</Text>
                  </View>
                </View>
              </View>
              {International.IntReturn != null && (
                <View style={{ marginTop: 10 }}>
                  <Text style={{ fontSize: 18, fontWeight: "700", marginHorizontal: 8 }}>
                    Arrival
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginHorizontal: 8
                    }}>
                    <Text style={{ color: "#636C73", fontSize: 12 }}>
                      {dataArray["Departure Time"]}
                    </Text>
                    <Text style={{ color: "#636C73", fontSize: 12 }}>
                      {parseInt(dataArray["Flight Stop"]) == 0
                        ? "Non-Stop"
                        : dataArray["Flight Stop"]}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      marginHorizontal: 8,
                      justifyContent: "space-between"
                    }}>
                    <View style={{ flex: 2 }}>
                      <Text style={{ fontSize: 20, lineHeight: 22 }}>
                        {International.IntReturn.FlightSegments[0].AirLineName}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#5D646A",
                          lineHeight: 14
                        }}>
                        {International.FlightUId}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 20, lineHeight: 22 }}>
                        {dataArray["Departure Time"]}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#5D646A",
                          lineHeight: 14
                        }}>
                        {International.IntReturn.FlightSegments[0].IntDepartureAirportName}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 20, lineHeight: 22 }}>
                        {moment(
                          International.IntReturn.FlightSegments[
                            International.IntReturn.FlightSegments.length - 1
                          ].ArrivalDateTime
                        ).format("HH:mm")}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#5D646A",
                          lineHeight: 14
                        }}>
                        {
                          International.IntReturn.FlightSegments[
                            International.IntReturn.FlightSegments.length - 1
                          ].IntArrivalAirportName
                        }
                      </Text>
                    </View>
                    <View style={{ flex: 2 }}>
                      <Text style={{ fontSize: 20, lineHeight: 22 }}>
                        {International.IntReturn.FlightSegments.length == 1
                          ? International.IntReturn.FlightSegments[0].Duration
                          : International.IntReturn.FlightSegments[
                              International.IntReturn.FlightSegments.length - 1
                            ].AccumulatedDuration}
                      </Text>
                      <Text style={{ fontSize: 20, lineHeight: 22 }}>
                        {dataArray["Class Type"]}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
              <View
                style={{
                  marginHorizontal: 8,
                  elevation: 1,
                  borderRadius: 5,
                  marginTop: 10
                }}>
                <Text
                  style={{
                    fontWeight: "700",
                    fontSize: 18,
                    paddingVertical: 10,
                    backgroundColor: "#EEF1F8",
                    paddingHorizontal: 10,
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5
                  }}>
                  Passenger Details
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingHorizontal: 10
                  }}>
                  <View>
                    <Text
                      style={{
                        fontWeight: "700",
                        fontSize: 16
                      }}>
                      Passenger
                    </Text>
                    <Text>Kamal Gangwar</Text>
                  </View>
                  <View>
                    <Text style={{ fontWeight: "700", fontSize: 16 }}>Age</Text>
                    <Text>22</Text>
                  </View>
                  <View>
                    <Text style={{ fontWeight: "700", fontSize: 16 }}>Gender</Text>
                    <Text>Male</Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  marginHorizontal: 8,
                  elevation: 1,
                  borderRadius: 5,
                  marginTop: 10
                }}>
                <Text
                  style={{
                    fontWeight: "700",
                    fontSize: 18,
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,
                    backgroundColor: "#EEF1F8",
                    paddingHorizontal: 10,
                    paddingVertical: 10
                  }}>
                  Fare Summary
                </Text>
                <View style={styles.summaryView}>
                  <Text>Convenience Fee</Text>
                  <Text></Text>
                </View>
                <View style={styles.summaryView}>
                  <Text>Flight Scharge</Text>
                  <Text></Text>
                </View>
                <View style={styles.summaryView}>
                  <Text>Base Fare</Text>
                  <Text></Text>
                </View>
                <View style={styles.summaryView}>
                  <Text>Flight Gst</Text>
                  <Text></Text>
                </View>
                <View style={styles.summaryView}>
                  <Text>Flight Tax</Text>
                  <Text></Text>
                </View>
                <View style={styles.summaryView}>
                  <Text style={{ fontWeight: "700", fontSize: 18 }}>Total Price</Text>
                  <Text style={{ fontWeight: "700", fontSize: 18 }}>
                    {order_data.currency_symbol}
                    {order_data.total}
                  </Text>
                </View>
                <View style={styles.summaryView}>
                  <Text style={{ flex: 1 }}>Payment Method</Text>
                  <Text style={{ flex: 1, marginStart: 10 }}>{order_data.payment_method}</Text>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </>
      );
    } else if (Onward_Domestic && !Retun_Domestic) {
      return (
        <>
          <SafeAreaView style={{ flex: 0, backgroundColor: "#ffffff" }} />
          <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  marginHorizontal: 16,
                  height: 56,
                  alignItems: "center"
                }}>
                <Button onPress={this._goBack}>
                  <Icon name="md-arrow-back" size={24} />
                </Button>
                <Text
                  style={{
                    fontSize: 18,
                    color: "#1E293B",
                    marginStart: 5,
                    fontWeight: "700"
                  }}>
                  #{order_data.id}
                </Text>
              </View>

              <View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginHorizontal: 8
                  }}>
                  <Text style={{ color: "#636C73", fontSize: 12 }}>
                    {moment(Onward_Domestic.FlightSegments[0].DepartureDateTime).format("HH:mm")}
                  </Text>
                  <Text style={{ color: "#636C73", fontSize: 12 }}>
                    {parseInt(dataArray["Flight Stop"]) == 0
                      ? "Non-Stop"
                      : dataArray["Flight Stop"]}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    marginHorizontal: 8,
                    justifyContent: "space-between"
                  }}>
                  <View style={{ flex: 2 }}>
                    <Text style={{ fontSize: 20, lineHeight: 22 }}>
                      {Onward_Domestic.FlightSegments[0].AirLineName}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#5D646A",
                        lineHeight: 14
                      }}>
                      {Onward_Domestic.FlightUId}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 20, lineHeight: 22 }}>
                      {moment(Onward_Domestic.FlightSegments[0].DepartureDateTime).format("HH:mm")}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#5D646A",
                        lineHeight: 14
                      }}>
                      {Onward_Domestic.FlightSegments[0].IntDepartureAirportName}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 20, lineHeight: 22 }}>
                      {moment(
                        Onward_Domestic.FlightSegments[Onward_Domestic.FlightSegments.length - 1]
                          .ArrivalDateTime
                      ).format("HH:mm")}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#5D646A",
                        lineHeight: 14
                      }}>
                      {
                        Onward_Domestic.FlightSegments[Onward_Domestic.FlightSegments.length - 1]
                          .IntArrivalAirportName
                      }
                    </Text>
                  </View>
                  <View style={{ flex: 2 }}>
                    <Text style={{ fontSize: 20, lineHeight: 22 }}>
                      {Onward_Domestic.FlightSegments.length == 1
                        ? Onward_Domestic.FlightSegments[0].Duration
                        : Onward_Domestic.FlightSegments[Onward_Domestic.FlightSegments.length - 1]
                            .AccumulatedDuration}
                    </Text>
                    <Text style={{ fontSize: 20, lineHeight: 22 }}>{dataArray["Class Type"]}</Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  marginHorizontal: 8,
                  elevation: 1,
                  borderRadius: 5,
                  marginTop: 10
                }}>
                <Text
                  style={{
                    fontWeight: "700",
                    fontSize: 18,
                    paddingVertical: 10,
                    backgroundColor: "#EEF1F8",
                    paddingHorizontal: 10,
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5
                  }}>
                  Passenger Details
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingHorizontal: 10
                  }}>
                  <View>
                    <Text
                      style={{
                        fontWeight: "700",
                        fontSize: 16
                      }}>
                      Passenger
                    </Text>
                    {adult_details.map((item, index) => {
                      return <Text key={item.index}>{item.fname + " " + item.lname}</Text>;
                    })}
                    {child_details.length > 0 &&
                      child_details.map((item, index) => {
                        return <Text key={item.index}>{item.fname + " " + item.lname}</Text>;
                      })}
                  </View>
                  <View>
                    <Text style={{ fontWeight: "700", fontSize: 16 }}>Age</Text>
                    {adult_details.map((item, index) => {
                      return <Text key={item.index}>{item.age}</Text>;
                    })}
                    {child_details &&
                      child_details.map((item, index) => {
                        return <Text key={item.index}>{item.age}</Text>;
                      })}
                  </View>
                  <View>
                    <Text style={{ fontWeight: "700", fontSize: 16 }}>Gender</Text>
                    {adult_details.map((item, index) => {
                      return <Text key={item.index}>{item.gender == "M" ? "Male" : "Female"}</Text>;
                    })}
                    {child_details.length > 0 &&
                      child_details.map((item, index) => {
                        return (
                          <Text key={item.index}>{item.gender == "M" ? "Male" : "Female"}</Text>
                        );
                      })}
                  </View>
                </View>
              </View>
              <View
                style={{
                  marginHorizontal: 8,
                  elevation: 1,
                  borderRadius: 5,
                  marginTop: 10
                }}>
                <Text
                  style={{
                    fontWeight: "700",
                    fontSize: 18,
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,
                    backgroundColor: "#EEF1F8",
                    paddingHorizontal: 10,
                    paddingVertical: 10
                  }}>
                  Fare Summary
                </Text>
                <View style={styles.summaryView}>
                  <Text>Convenience Fee</Text>
                  <Text></Text>
                </View>
                <View style={styles.summaryView}>
                  <Text>Flight Scharge</Text>
                  <Text></Text>
                </View>
                <View style={styles.summaryView}>
                  <Text>Base Fare</Text>
                  <Text></Text>
                </View>
                <View style={styles.summaryView}>
                  <Text>Flight Gst</Text>
                  <Text></Text>
                </View>
                <View style={styles.summaryView}>
                  <Text>Flight Tax</Text>
                  <Text></Text>
                </View>
                <View style={styles.summaryView}>
                  <Text style={{ fontWeight: "700", fontSize: 18 }}>Total Price</Text>
                  <Text style={{ fontWeight: "700", fontSize: 18 }}>
                    {order_data.currency_symbol}
                    {order_data.total}
                  </Text>
                </View>
                <View style={styles.summaryView}>
                  <Text style={{ flex: 1 }}>Payment Method</Text>
                  <Text style={{ flex: 1, marginStart: 10 }}>{order_data.payment_method}</Text>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </>
      );
    } else if (Onward_Domestic && Retun_Domestic) {
      return (
        <>
          <SafeAreaView style={{ flex: 0, backgroundColor: "#ffffff" }} />
          <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  marginHorizontal: 16,
                  height: 56,
                  alignItems: "center"
                }}>
                <Button onPress={this._goBack}>
                  <Icon name="md-arrow-back" size={24} />
                </Button>
                <Text
                  style={{
                    fontSize: 18,
                    color: "#1E293B",
                    marginStart: 5,
                    fontWeight: "700"
                  }}>
                  #{order_data.id}
                </Text>
              </View>

              <View>
                <Text style={{ fontSize: 18, fontWeight: "700", marginHorizontal: 8 }}>
                  Arrival
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginHorizontal: 8
                  }}>
                  <Text style={{ color: "#636C73", fontSize: 12 }}>
                    {moment(Onward_Domestic.FlightSegments[0].DepartureDateTime).format("HH:mm")}
                  </Text>
                  <Text style={{ color: "#636C73", fontSize: 12 }}>
                    {parseInt(dataArray["Flight Stop"]) == 0
                      ? "Non-Stop"
                      : dataArray["Flight Stop"]}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    marginHorizontal: 8,
                    justifyContent: "space-between"
                  }}>
                  <View style={{ flex: 2 }}>
                    <Text style={{ fontSize: 20, lineHeight: 22 }}>
                      {Onward_Domestic.FlightSegments[0].AirLineName}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#5D646A",
                        lineHeight: 14
                      }}>
                      {Onward_Domestic.FlightUId}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 20, lineHeight: 22 }}>
                      {moment(Onward_Domestic.FlightSegments[0].DepartureDateTime).format("HH:mm")}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#5D646A",
                        lineHeight: 14
                      }}>
                      {Onward_Domestic.FlightSegments[0].IntDepartureAirportName}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 20, lineHeight: 22 }}>
                      {moment(
                        Onward_Domestic.FlightSegments[Onward_Domestic.FlightSegments.length - 1]
                          .ArrivalDateTime
                      ).format("HH:mm")}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#5D646A",
                        lineHeight: 14
                      }}>
                      {
                        Onward_Domestic.FlightSegments[Onward_Domestic.FlightSegments.length - 1]
                          .IntArrivalAirportName
                      }
                    </Text>
                  </View>
                  <View style={{ flex: 2 }}>
                    <Text style={{ fontSize: 20, lineHeight: 22 }}>
                      {Onward_Domestic.FlightSegments.length == 1
                        ? Onward_Domestic.FlightSegments[0].Duration
                        : Onward_Domestic.FlightSegments[Onward_Domestic.FlightSegments.length - 1]
                            .AccumulatedDuration}
                    </Text>
                    <Text style={{ fontSize: 20, lineHeight: 22 }}>{dataArray["Class Type"]}</Text>
                  </View>
                </View>
              </View>
              <View>
                <Text style={{ fontSize: 18, fontWeight: "700", marginHorizontal: 8 }}>Depart</Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginHorizontal: 8
                  }}>
                  <Text style={{ color: "#636C73", fontSize: 12 }}>
                    {moment(Retun_Domestic.FlightSegments[0].DepartureDateTime).format("HH:mm")}
                  </Text>
                  <Text style={{ color: "#636C73", fontSize: 12 }}>
                    {parseInt(dataArray["Flight Stop"]) == 0
                      ? "Non-Stop"
                      : dataArray["Flight Stop"]}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    marginHorizontal: 8,
                    justifyContent: "space-between"
                  }}>
                  <View style={{ flex: 2 }}>
                    <Text style={{ fontSize: 20, lineHeight: 22 }}>
                      {Retun_Domestic.FlightSegments[0].AirLineName}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#5D646A",
                        lineHeight: 14
                      }}>
                      {Retun_Domestic.FlightUId}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 20, lineHeight: 22 }}>
                      {moment(Retun_Domestic.FlightSegments[0].DepartureDateTime).format("HH:mm")}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#5D646A",
                        lineHeight: 14
                      }}>
                      {Retun_Domestic.FlightSegments[0].IntDepartureAirportName}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 20, lineHeight: 22 }}>
                      {moment(
                        Retun_Domestic.FlightSegments[Retun_Domestic.FlightSegments.length - 1]
                          .ArrivalDateTime
                      ).format("HH:mm")}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#5D646A",
                        lineHeight: 14
                      }}>
                      {
                        Retun_Domestic.FlightSegments[Retun_Domestic.FlightSegments.length - 1]
                          .IntArrivalAirportName
                      }
                    </Text>
                  </View>
                  <View style={{ flex: 2 }}>
                    <Text style={{ fontSize: 20, lineHeight: 22 }}>
                      {Retun_Domestic.FlightSegments.length == 1
                        ? Retun_Domestic.FlightSegments[0].Duration
                        : Retun_Domestic.FlightSegments[Retun_Domestic.FlightSegments.length - 1]
                            .AccumulatedDuration}
                    </Text>
                    <Text style={{ fontSize: 20, lineHeight: 22 }}>{dataArray["Class Type"]}</Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  marginHorizontal: 8,
                  elevation: 1,
                  borderRadius: 5,
                  marginTop: 10
                }}>
                <Text
                  style={{
                    fontWeight: "700",
                    fontSize: 18,
                    paddingVertical: 10,
                    backgroundColor: "#EEF1F8",
                    paddingHorizontal: 10,
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5
                  }}>
                  Passenger Details
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingHorizontal: 10
                  }}>
                  <View>
                    <Text
                      style={{
                        fontWeight: "700",
                        fontSize: 16
                      }}>
                      Passenger
                    </Text>
                    {adult_details.map((item, index) => {
                      return <Text key={item.index}>{item.fname + " " + item.lname}</Text>;
                    })}
                    {child_details.length > 0 &&
                      child_details.map((item, index) => {
                        return <Text key={item.index}>{item.fname + " " + item.lname}</Text>;
                      })}
                  </View>
                  <View>
                    <Text style={{ fontWeight: "700", fontSize: 16 }}>Age</Text>
                    {adult_details.map((item, index) => {
                      return <Text key={item.index}>{item.age}</Text>;
                    })}
                    {child_details &&
                      child_details.map((item, index) => {
                        return <Text key={item.index}>{item.age}</Text>;
                      })}
                  </View>
                  <View>
                    <Text style={{ fontWeight: "700", fontSize: 16 }}>Gender</Text>
                    {adult_details.map((item, index) => {
                      return <Text key={item.index}>{item.gender == "M" ? "Male" : "Female"}</Text>;
                    })}
                    {child_details.length > 0 &&
                      child_details.map((item, index) => {
                        return (
                          <Text key={item.index}>{item.gender == "M" ? "Male" : "Female"}</Text>
                        );
                      })}
                  </View>
                </View>
              </View>
              <View
                style={{
                  marginHorizontal: 8,
                  elevation: 1,
                  borderRadius: 5,
                  marginTop: 10
                }}>
                <Text
                  style={{
                    fontWeight: "700",
                    fontSize: 18,
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,
                    backgroundColor: "#EEF1F8",
                    paddingHorizontal: 10,
                    paddingVertical: 10
                  }}>
                  Fare Summary
                </Text>
                <View style={styles.summaryView}>
                  <Text>Convenience Fee</Text>
                  <Text></Text>
                </View>
                <View style={styles.summaryView}>
                  <Text>Flight Scharge</Text>
                  <Text></Text>
                </View>
                <View style={styles.summaryView}>
                  <Text>Base Fare</Text>
                  <Text></Text>
                </View>
                <View style={styles.summaryView}>
                  <Text>Flight Gst</Text>
                  <Text></Text>
                </View>
                <View style={styles.summaryView}>
                  <Text>Flight Tax</Text>
                  <Text></Text>
                </View>
                <View style={styles.summaryView}>
                  <Text style={{ fontWeight: "700", fontSize: 18 }}>Total Price</Text>
                  <Text style={{ fontWeight: "700", fontSize: 18 }}>
                    {order_data.currency_symbol}
                    {order_data.total}
                  </Text>
                </View>
                <View style={styles.summaryView}>
                  <Text style={{ flex: 1 }}>Payment Method</Text>
                  <Text style={{ flex: 1, marginStart: 10 }}>{order_data.payment_method}</Text>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </>
      );
    } else if (Hotel) {
      var str = dataArray["Hotel Image"];
      var res = str.replace("https://cdn.grnconnect.com/", "https://images.grnconnect.com/");
      return (
        <>
          <SafeAreaView style={{ flex: 0, backgroundColor: "#ffffff" }} />
          <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  marginHorizontal: 16,
                  height: 56,
                  alignItems: "center"
                }}>
                <Button onPress={this._goBack}>
                  <Icon name="md-arrow-back" size={24} />
                </Button>
                <Text
                  style={{
                    fontSize: 18,
                    color: "#1E293B",
                    marginStart: 5,
                    fontWeight: "700"
                  }}>
                  #{order_data.id}
                </Text>
              </View>
              <View
                style={{
                  marginHorizontal: 8,
                  marginVertical: 10,
                  backgroundColor: "#EEF1F8",
                  borderRadius: 8,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: 10
                }}>
                <Image
                  style={{ width: width / 4, height: height / 6, borderRadius: 5 }}
                  resizeMode="cover"
                  source={{ uri: res }}
                />
                <View style={{ marginStart: 10, flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: "700" }}>{dataArray["Hotel Name"]}</Text>
                  <Text style={{ flex: 1 }}>{dataArray["Room Type"]}</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      flex: 1
                    }}>
                    <View>
                      <Text style={{ fontWeight: "700" }}>Check-In</Text>
                      <Text>{dataArray["Check In"]}</Text>
                    </View>
                    <View>
                      <Text style={{ fontWeight: "700" }}>Check-Out</Text>
                      <Text>{dataArray["Check Out"]}</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View
                style={{
                  marginHorizontal: 8,
                  elevation: 1,
                  borderRadius: 5,
                  marginTop: 10
                }}>
                <Text
                  style={{
                    fontWeight: "700",
                    fontSize: 18,
                    paddingVertical: 10,
                    backgroundColor: "#EEF1F8",
                    paddingHorizontal: 10,
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5
                  }}>
                  Passenger Details
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingHorizontal: 10
                  }}>
                  <View>
                    <Text
                      style={{
                        fontWeight: "700",
                        fontSize: 16
                      }}>
                      Passenger
                    </Text>
                    {adult_details.map((item, index) => {
                      return <Text key={item.index}>{item.fname + " " + item.lname}</Text>;
                    })}
                    {child_details.length > 0 &&
                      child_details.map((item, index) => {
                        return <Text key={item.index}>{item.fname + " " + item.lname}</Text>;
                      })}
                  </View>
                  <View>
                    <Text style={{ fontWeight: "700", fontSize: 16 }}>Age</Text>
                    {adult_details.map((item, index) => {
                      return <Text key={item.index}>{item.age}</Text>;
                    })}
                    {child_details &&
                      child_details.map((item, index) => {
                        return <Text key={item.index}>{item.age}</Text>;
                      })}
                  </View>
                  <View>
                    <Text style={{ fontWeight: "700", fontSize: 16 }}>Gender</Text>
                    {adult_details.map((item, index) => {
                      return <Text key={item.index}>{item.gender == "M" ? "Male" : "Female"}</Text>;
                    })}
                    {child_details.length > 0 &&
                      child_details.map((item, index) => {
                        return (
                          <Text key={item.index}>{item.gender == "M" ? "Male" : "Female"}</Text>
                        );
                      })}
                  </View>
                </View>
              </View>
              <View
                style={{
                  marginHorizontal: 8,
                  elevation: 1,
                  borderRadius: 5,
                  marginTop: 10
                }}>
                <Text
                  style={{
                    fontWeight: "700",
                    fontSize: 18,
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,
                    backgroundColor: "#EEF1F8",
                    paddingHorizontal: 10,
                    paddingVertical: 10
                  }}>
                  Fare Summary
                </Text>
                <View style={styles.summaryView}>
                  <Text>Convenience Fee</Text>
                  <Text></Text>
                </View>
                <View style={styles.summaryView}>
                  <Text>Flight Scharge</Text>
                  <Text></Text>
                </View>
                <View style={styles.summaryView}>
                  <Text>Base Fare</Text>
                  <Text></Text>
                </View>
                <View style={styles.summaryView}>
                  <Text>Flight Gst</Text>
                  <Text></Text>
                </View>
                <View style={styles.summaryView}>
                  <Text>Flight Tax</Text>
                  <Text></Text>
                </View>
                <View style={styles.summaryView}>
                  <Text style={{ fontWeight: "700", fontSize: 18 }}>Total Price</Text>
                  <Text style={{ fontWeight: "700", fontSize: 18 }}>
                    {order_data.currency_symbol}
                    {order_data.total}
                  </Text>
                </View>
                <View style={styles.summaryView}>
                  <Text style={{ flex: 1 }}>Payment Method</Text>
                  <Text style={{ flex: 1, marginStart: 10 }}>{order_data.payment_method}</Text>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </>
      );
    } else if (Car) {
      return (
        <View>
          <Text>Car</Text>
        </View>
      );
    } else if (Bus) {
      return (
        <View>
          <Text>Bus</Text>
        </View>
      );
    } else {
      return (
        <View>
          <Text>Invalid Ticket Contact Admin</Text>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  summaryView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10
  }
});

export default OrderDetails;
