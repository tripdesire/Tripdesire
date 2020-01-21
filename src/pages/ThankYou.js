import React, { PureComponent } from "react";
import { Text, Button, Icon, ActivityIndicator } from "../components";
import {
  Image,
  ImageBackground,
  Dimensions,
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ToastAndroid
} from "react-native";
import { etravosApi } from "../service";
import moment from "moment";
import { isArray } from "lodash";
import Toast from "react-native-simple-toast";
import HTML from "react-native-render-html";
const { height, width } = Dimensions.get("window");

class ThankYou extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log(props.navigation.state.params);
    this.state = {
      ticket: {},
      loader: false
    };
  }

  componentDidMount() {
    const { order } = this.props.navigation.state.params;
    const dataArray = JSON.parse(order.reference_no);
    let params = {
      referenceNo: dataArray.ReferenceNo,
      type: 2,
      mobileNo: order.billing.phone,
      email: order.billing.email
    };
    this.setState({ loader: true });
    etravosApi
      .get("Flights/FlightTicketBookingDetails", params)
      .then(res => {
        if (res.status == 200) {
          this.setState({ ticket: res.data, loader: false });
        } else {
          Toast.show("Ticket can not fetch please contact the admin");
          return;
        }
      })
      .catch(error => {
        this.setState({ loader: false });
      });
  }

  navigateToScreen = page => () => {
    this.props.navigation.navigate(page);
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
    const { ticket, loader } = this.state;
    const { order } = this.props.navigation.state.params;

    JSON.parse('{ "name":"John", "age":30, "city":"New York"}');
    const dataArray = order.line_items[0].meta_data.reduce(
      (obj, item) => (
        (obj[item.key] = this.hasJsonStructure(item.value) ? JSON.parse(item.value) : item.value),
        obj
      ),
      {}
    );
    console.log(dataArray);

    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "#E5EBF7" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                height: 56,
                backgroundColor: "#E5EBF7",
                alignItems: "center"
              }}>
              <Button style={{ padding: 16 }} onPress={this.navigateToScreen}>
                <Icon name="md-arrow-back" size={24} />
              </Button>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View>
                <View style={{ justifyContent: "center", marginHorizontal: 8, marginTop: 20 }}>
                  <Text style={{ fontWeight: "500", fontSize: 18 }}>Booking Confirmed</Text>
                  <Text>ThankYou. Your booking has been completed.</Text>
                </View>

                <View style={[styles.cardView, { marginTop: 15 }]}>
                  <View style={styles.flightType}>
                    <Text style={styles.heading}>Ticket Information</Text>
                  </View>
                  <View style={styles.contentView}>
                    <View>
                      <Text style={[styles.time, { marginBottom: 4 }]}>Reference No.</Text>
                      <Text style={styles.airlineno}>
                        {ticket.BookingRefNo != "" ? ticket.BookingRefNo : null}
                      </Text>
                    </View>

                    <View style={{ alignItems: "center" }}>
                      <Text style={[styles.time, { marginBottom: 4 }]}>E-mail</Text>
                      <Text style={styles.airlineno}>
                        {ticket.EmailId != "" ? ticket.EmailId : null}
                      </Text>
                    </View>

                    <View>
                      <Text style={[styles.time, { marginBottom: 4 }]}>Date</Text>
                      <Text style={styles.airlineno}>
                        {moment(ticket.BookingDate).format("DD-MM-YYYY")}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={[styles.cardView, { marginTop: 15 }]}>
                  <View style={styles.flightType}>
                    <Text style={styles.heading}>Departure</Text>
                  </View>
                  <View style={styles.contentView}>
                    <View>
                      <Text style={styles.time}>
                        {dataArray.hasOwnProperty("Onward Item Result Data")
                          ? dataArray["Onward Item Result Data"].FlightSegments[0].AirLineName
                          : dataArray["Int Fl Item Result Data"].IntOnward.FlightSegments[0]
                              .AirLineName}
                      </Text>
                      <Text style={styles.airlineno}>
                        {dataArray.hasOwnProperty("Onward Item Result Data")
                          ? dataArray["Onward Item Result Data"].FlightUId
                          : dataArray["Int Fl Item Result Data"].FlightUId}
                      </Text>
                      <Text style={styles.class}>{dataArray["Class Type"]}</Text>
                    </View>

                    <View style={{ alignItems: "center" }}>
                      <Text style={styles.time}>
                        {dataArray.hasOwnProperty("Onward Item Result Data")
                          ? moment(
                              dataArray["Onward Item Result Data"].FlightSegments[0]
                                .DepartureDateTime
                            ).format("HH:mm")
                          : moment(
                              dataArray["Int Fl Item Result Data"].IntOnward.FlightSegments[0]
                                .DepartureDateTime
                            ).format("HH:mm")}
                      </Text>
                      <Text style={styles.airlineno}>
                        {dataArray.hasOwnProperty("Onward Item Result Data")
                          ? dataArray["Onward Item Result Data"].FlightSegments[0]
                              .IntDepartureAirportName
                          : dataArray["Int Fl Item Result Data"].IntOnward.FlightSegments[0]
                              .IntDepartureAirportName}
                      </Text>

                      <View style={{ flexDirection: "row" }}>
                        {dataArray.hasOwnProperty("Onward Item Result Data") && (
                          <Text style={styles.airlineno}>
                            {dataArray["Onward Item Result Data"].FlightSegments.length == 1
                              ? dataArray["Onward Item Result Data"].FlightSegments[0].Duration
                              : dataArray["Onward Item Result Data"].FlightSegments[
                                  dataArray["Onward Item Result Data"].FlightSegments.length - 1
                                ].AccumulatedDuration}
                          </Text>
                        )}
                        {dataArray.hasOwnProperty("Int Fl Item Result Data") && (
                          <Text style={styles.airlineno}>
                            {dataArray["Int Fl Item Result Data"].IntOnward.FlightSegments.length ==
                            1
                              ? dataArray["Int Fl Item Result Data"].IntOnward.FlightSegments[0]
                                  .Duration
                              : dataArray["Int Fl Item Result Data"].IntOnward.FlightSegments[
                                  dataArray["Int Fl Item Result Data"].IntOnward.FlightSegments
                                    .length - 1
                                ].AccumulatedDuration}
                          </Text>
                        )}

                        {dataArray.hasOwnProperty("Onward Item Result Data") && (
                          <Text style={styles.airlineno}>
                            {dataArray["Onward Item Result Data"].FlightSegments.length - 1 == 0
                              ? " Non Stop"
                              : " " +
                                dataArray["Onward Item Result Data"].FlightSegments.length -
                                1 +
                                " Stop(s)"}
                          </Text>
                        )}
                        {dataArray.hasOwnProperty("Int Fl Item Result Data") && (
                          <Text style={styles.airlineno}>
                            {dataArray["Int Fl Item Result Data"].IntOnward.FlightSegments.length -
                              1 ==
                            0
                              ? " Non Stop"
                              : " " +
                                dataArray["Int Fl Item Result Data"].IntOnward.FlightSegments
                                  .length -
                                1 +
                                " Stop(s)"}
                          </Text>
                        )}
                      </View>
                    </View>

                    <View>
                      <Text style={styles.time}>
                        {dataArray.hasOwnProperty("Onward Item Result Data")
                          ? moment(
                              dataArray["Onward Item Result Data"].FlightSegments[
                                dataArray["Onward Item Result Data"].FlightSegments.length - 1
                              ].ArrivalDateTime
                            ).format("HH:mm")
                          : moment(
                              dataArray["Int Fl Item Result Data"].IntOnward.FlightSegments[
                                dataArray["Int Fl Item Result Data"].IntOnward.FlightSegments
                                  .length - 1
                              ].ArrivalDateTime
                            ).format("HH:mm")}
                      </Text>
                      <Text style={styles.airlineno}>
                        {dataArray.hasOwnProperty("Onward Item Result Data")
                          ? dataArray["Onward Item Result Data"].FlightSegments[
                              dataArray["Onward Item Result Data"].FlightSegments.length - 1
                            ].IntArrivalAirportName
                          : dataArray["Int Fl Item Result Data"].IntOnward.FlightSegments[
                              dataArray["Int Fl Item Result Data"].IntOnward.FlightSegments.length -
                                1
                            ].IntArrivalAirportName}
                      </Text>
                    </View>
                  </View>
                </View>

                {((dataArray.hasOwnProperty("Int Fl Item Result Data") &&
                  dataArray["Int Fl Item Result Data"].IntReturn != null) ||
                  dataArray.hasOwnProperty("Return Item Result Data")) && (
                  <View style={[styles.cardView, { marginTop: 15 }]}>
                    <View style={styles.flightType}>
                      <Text style={styles.heading}>Return</Text>
                    </View>
                    <View style={styles.contentView}>
                      <View>
                        <Text style={styles.time}>
                          {!dataArray.hasOwnProperty("Return Item Result Data")
                            ? dataArray["Int Fl Item Result Data"].IntReturn.FlightSegments[0]
                                .AirLineName
                            : dataArray["Return Item Result Data"].FlightSegments[0].AirLineName}
                        </Text>
                        <Text style={styles.airlineno}>
                          {dataArray.hasOwnProperty("Return Item Result Data")
                            ? dataArray["Return Item Result Data"].FlightUId
                            : dataArray["Int Fl Item Result Data"].FlightUId}
                        </Text>
                        <Text style={styles.class}>{dataArray["Class Type"]}</Text>
                      </View>

                      <View style={{ alignItems: "center" }}>
                        <Text style={styles.time}>
                          {!dataArray.hasOwnProperty("Return Item Result Data")
                            ? moment(
                                dataArray["Int Fl Item Result Data"].IntReturn.FlightSegments[0]
                                  .DepartureDateTime
                              ).format("HH:mm")
                            : moment(
                                dataArray["Return Item Result Data"].FlightSegments[0]
                                  .DepartureDateTime
                              ).format("HH:mm")}
                        </Text>
                        <Text style={styles.airlineno}>
                          {!dataArray.hasOwnProperty("Return Item Result Data")
                            ? dataArray["Int Fl Item Result Data"].IntReturn.FlightSegments[0]
                                .IntDepartureAirportName
                            : dataArray["Return Item Result Data"].FlightSegments[0]
                                .IntDepartureAirportName}
                        </Text>

                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                          {dataArray.hasOwnProperty("Int Fl Item Result Data") && (
                            <Text style={styles.airlineno}>
                              {dataArray["Int Fl Item Result Data"].IntReturn.FlightSegments
                                .length == 1
                                ? dataArray["Int Fl Item Result Data"].IntReturn.FlightSegments[0]
                                    .Duration
                                : dataArray["Int Fl Item Result Data"].IntReturn.FlightSegments[
                                    dataArray["Int Fl Item Result Data"].IntReturn.FlightSegments
                                      .length - 1
                                  ].AccumulatedDuration}
                            </Text>
                          )}
                          {dataArray.hasOwnProperty("Return Item Result Data") && (
                            <Text style={styles.airlineno}>
                              {dataArray["Return Item Result Data"].FlightSegments.length == 1
                                ? dataArray["Return Item Result Data"].FlightSegments[0].Duration
                                : dataArray["Return Item Result Data"].FlightSegments[
                                    dataArray["Return Item Result Data"].FlightSegments.length - 1
                                  ].AccumulatedDuration}
                            </Text>
                          )}

                          {dataArray.hasOwnProperty("Int Fl Item Result Data") && (
                            <Text style={styles.airlineno}>
                              {dataArray["Int Fl Item Result Data"].IntReturn.FlightSegments
                                .length -
                                1 ==
                              0
                                ? " Non Stop"
                                : " " +
                                  dataArray["Int Fl Item Result Data"].IntReturn.FlightSegments
                                    .length -
                                  1 +
                                  " Stop(s)"}
                            </Text>
                          )}
                          {dataArray.hasOwnProperty("Return Item Result Data") && (
                            <Text style={styles.airlineno}>
                              {dataArray["Return Item Result Data"].FlightSegments.length - 1 == 0
                                ? " Non Stop"
                                : " " +
                                  dataArray["Return Item Result Data"].FlightSegments.length -
                                  1 +
                                  " Stop(s)"}
                            </Text>
                          )}
                        </View>

                        {/* <Text style={styles.airlineno}>01:10hrs Non Stop</Text> */}
                      </View>

                      <View>
                        <Text style={styles.time}>
                          {!dataArray.hasOwnProperty("Return Item Result Data")
                            ? moment(
                                dataArray["Int Fl Item Result Data"].IntReturn.FlightSegments[
                                  dataArray["Int Fl Item Result Data"].IntReturn.FlightSegments
                                    .length - 1
                                ].ArrivalDateTime
                              ).format("HH:mm")
                            : moment(
                                dataArray["Return Item Result Data"].FlightSegments[
                                  dataArray["Return Item Result Data"].FlightSegments.length - 1
                                ].ArrivalDateTime
                              ).format("HH:mm")}
                        </Text>
                        <Text style={styles.airlineno}>
                          {!dataArray.hasOwnProperty("Return Item Result Data")
                            ? dataArray["Int Fl Item Result Data"].IntReturn.FlightSegments[
                                dataArray["Int Fl Item Result Data"].IntReturn.FlightSegments
                                  .length - 1
                              ].IntArrivalAirportName
                            : dataArray["Return Item Result Data"].FlightSegments[
                                dataArray["Return Item Result Data"].FlightSegments.length - 1
                              ].IntArrivalAirportName}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}

                <View style={[styles.cardView, { marginTop: 15 }]}>
                  <View style={styles.flightType}>
                    <Text style={styles.heading}>Baggage Information</Text>
                  </View>
                  <View style={styles.contentView}>
                    <View>
                      <Text style={[styles.time, { marginBottom: 4 }]}>Type</Text>
                      <Text style={styles.airlineno}>
                        {dataArray.hasOwnProperty("Onward Item Result Data")
                          ? dataArray["Onward Item Result Data"].FlightUId
                          : dataArray["Int Fl Item Result Data"].FlightUId}
                      </Text>
                      {((dataArray.hasOwnProperty("Int Fl Item Result Data") &&
                        dataArray["Int Fl Item Result Data"].IntReturn != null) ||
                        dataArray.hasOwnProperty("Return Item Result Data")) && (
                        <Text style={styles.airlineno}>
                          {dataArray.hasOwnProperty("Return Item Result Data")
                            ? dataArray["Return Item Result Data"].FlightUId
                            : dataArray["Int Fl Item Result Data"].FlightUId}
                        </Text>
                      )}
                    </View>

                    <View style={{ alignItems: "center" }}>
                      <Text style={[styles.time, { marginBottom: 4 }]}>Cabin</Text>

                      {isArray(ticket.OnwardFlightSegments) &&
                        ticket.OnwardFlightSegments.length > 0 &&
                        ticket.OnwardFlightSegments.map((item, index) => {
                          return (
                            <Text style={styles.airlineno} key={index}>
                              {item.BaggageAllowed.HandBaggage != ""
                                ? item.BaggageAllowed.HandBaggage
                                : null}
                            </Text>
                          );
                        })}

                      {ticket.TripType == 2 &&
                        isArray(ticket.ReturnFlightSegments) &&
                        ticket.ReturnFlightSegments.length > 0 &&
                        ticket.ReturnFlightSegments.map((item, index) => {
                          return (
                            <Text style={styles.airlineno} key={index}>
                              {item.BaggageAllowed.HandBaggage != ""
                                ? item.BaggageAllowed.HandBaggage
                                : null}
                            </Text>
                          );
                        })}
                    </View>

                    <View>
                      <Text style={[styles.time, { marginBottom: 4 }]}>Check-in</Text>
                      {isArray(ticket.OnwardFlightSegments) &&
                        ticket.OnwardFlightSegments.length > 0 &&
                        ticket.OnwardFlightSegments.map((item, index) => {
                          return (
                            <Text style={styles.airlineno} key={index}>
                              {item.BaggageAllowed.CheckInBaggage != ""
                                ? item.BaggageAllowed.CheckInBaggage
                                : null}
                            </Text>
                          );
                        })}

                      {ticket.TripType == 2 &&
                        isArray(ticket.ReturnFlightSegments) &&
                        ticket.ReturnFlightSegments.length > 0 &&
                        ticket.ReturnFlightSegments.map((item, index) => {
                          return (
                            <Text style={styles.airlineno} key={index}>
                              {item.BaggageAllowed.CheckInBaggage != ""
                                ? item.BaggageAllowed.CheckInBaggage
                                : null}
                            </Text>
                          );
                        })}
                    </View>
                  </View>
                </View>

                <View style={[styles.cardView, { marginTop: 15 }]}>
                  <View style={styles.flightType}>
                    <Text style={styles.heading}>Passenger Details Onward</Text>
                  </View>
                  <View style={[styles.contentView, { flexDirection: "column" }]}>
                    <View style={{ flexDirection: "row", flex: 1, marginBottom: 4 }}>
                      <Text style={[styles.time, { flex: 2 }]}>Name</Text>
                      <Text style={[styles.time, { flex: 1, textAlign: "center" }]}>Age</Text>
                      <Text style={[styles.time, { flex: 1, textAlign: "center" }]}>Gender</Text>
                      <Text style={[styles.time, { flex: 2, textAlign: "center" }]}>
                        Ticket No.
                      </Text>
                    </View>

                    {order.adult_details.map((item, index) => {
                      return (
                        <View style={{ flexDirection: "row", flex: 1 }}>
                          <Text key={item.index} style={[styles.airlineno, { flex: 2 }]}>
                            {item.fname + " " + item.lname}
                          </Text>
                          <Text
                            key={item.index}
                            style={[styles.airlineno, { flex: 1, textAlign: "center" }]}>
                            {item.age}
                          </Text>
                          <Text
                            key={item.index}
                            style={[styles.airlineno, { flex: 1, textAlign: "center" }]}>
                            {item.gender == "M" ? "Male" : "Female"}
                          </Text>

                          {isArray(ticket.Tickets) &&
                            ticket.Tickets.map(item => {
                              if (item.TripType == 1) {
                                return (
                                  <Text
                                    key={item.index}
                                    style={[styles.airlineno, { flex: 2, textAlign: "center" }]}>
                                    {item.EticketNo}
                                  </Text>
                                );
                              }
                            })}
                        </View>
                      );
                    })}
                    {order.child_details &&
                      order.child_details.map((item, index) => {
                        return (
                          <View style={{ flexDirection: "row", flex: 1 }}>
                            <Text key={item.index} style={styles.airlineno}>
                              {item.fname + " " + item.lname}
                            </Text>
                            <Text
                              key={item.index}
                              style={[styles.airlineno, { flex: 1, textAlign: "center" }]}>
                              {item.age}
                            </Text>
                            <Text
                              key={item.index}
                              style={[styles.airlineno, { flex: 1, textAlign: "center" }]}>
                              {item.gender == "M" ? "Male" : "Female"}
                            </Text>
                            {isArray(ticket.Tickets) &&
                              ticket.Tickets.map(item => {
                                if (item.TripType == 1) {
                                  return (
                                    <Text
                                      key={item.index}
                                      style={[styles.airlineno, { flex: 2, textAlign: "center" }]}>
                                      {item.EticketNo}
                                    </Text>
                                  );
                                }
                              })}
                          </View>
                        );
                      })}
                    {order.infan_details &&
                      order.infan_details.map((item, index) => {
                        return (
                          <View style={{ flexDirection: "row", flex: 1 }}>
                            <Text key={item.index} style={styles.airlineno}>
                              {item.fname + " " + item.lname}
                            </Text>
                            <Text
                              key={item.index}
                              style={[styles.airlineno, { flex: 1, textAlign: "center" }]}>
                              {item.age}
                            </Text>
                            <Text
                              key={item.index}
                              style={[styles.airlineno, { flex: 1, textAlign: "center" }]}>
                              {item.gender == "M" ? "Male" : "Female"}
                            </Text>
                            {isArray(ticket.Tickets) &&
                              ticket.Tickets.map(item => {
                                if (item.TripType == 1) {
                                  return (
                                    <Text
                                      key={item.index}
                                      style={[styles.airlineno, { flex: 2, textAlign: "center" }]}>
                                      {item.EticketNo}
                                    </Text>
                                  );
                                }
                              })}
                          </View>
                        );
                      })}
                  </View>
                </View>

                {((dataArray.hasOwnProperty("Int Fl Item Result Data") &&
                  dataArray["Int Fl Item Result Data"].IntReturn != null) ||
                  dataArray.hasOwnProperty("Return Item Result Data")) && (
                  <View style={[styles.cardView, { marginTop: 15 }]}>
                    <View style={styles.flightType}>
                      <Text style={styles.heading}>Passenger Details Return</Text>
                    </View>
                    <View style={[styles.contentView, { flexDirection: "column" }]}>
                      <View style={{ flexDirection: "row", flex: 1, marginBottom: 4 }}>
                        <Text style={[styles.time, { flex: 2 }]}>Name</Text>
                        <Text style={[styles.time, { flex: 1, textAlign: "center" }]}>Age</Text>
                        <Text style={[styles.time, { flex: 1, textAlign: "center" }]}>Gender</Text>
                        <Text style={[styles.time, { flex: 2, textAlign: "center" }]}>
                          Ticket No.
                        </Text>
                      </View>

                      {order.adult_details.map((item, index) => {
                        return (
                          <View style={{ flexDirection: "row", flex: 1 }} key={"adults" + index}>
                            <Text key={item.index} style={[styles.airlineno, { flex: 2 }]}>
                              {item.fname + " " + item.lname}
                            </Text>
                            <Text
                              key={item.index}
                              style={[styles.airlineno, { flex: 1, textAlign: "center" }]}>
                              {item.age}
                            </Text>
                            <Text
                              key={item.index}
                              style={[styles.airlineno, { flex: 1, textAlign: "center" }]}>
                              {item.gender == "M" ? "Male" : "Female"}
                            </Text>

                            {isArray(ticket.Tickets) &&
                              ticket.Tickets.map(item => {
                                if (item.TripType == 2) {
                                  return (
                                    <Text
                                      key={item.index}
                                      style={[styles.airlineno, { flex: 2, textAlign: "center" }]}>
                                      {item.EticketNo}
                                    </Text>
                                  );
                                }
                              })}
                          </View>
                        );
                      })}
                      {order.child_details &&
                        order.child_details.map((item, index) => {
                          return (
                            <View style={{ flexDirection: "row", flex: 1 }} key={"child" + index}>
                              <Text key={item.index} style={styles.airlineno}>
                                {item.fname + " " + item.lname}
                              </Text>
                              <Text
                                key={item.index}
                                style={[styles.airlineno, { flex: 1, textAlign: "center" }]}>
                                {item.age}
                              </Text>
                              <Text
                                key={item.index}
                                style={[styles.airlineno, { flex: 1, textAlign: "center" }]}>
                                {item.gender == "M" ? "Male" : "Female"}
                              </Text>
                              {isArray(ticket.Tickets) &&
                                ticket.Tickets.map(item => {
                                  if (item.TripType == 2) {
                                    return (
                                      <Text
                                        key={item.index}
                                        style={[
                                          styles.airlineno,
                                          { flex: 2, textAlign: "center" }
                                        ]}>
                                        {item.EticketNo}
                                      </Text>
                                    );
                                  }
                                })}
                            </View>
                          );
                        })}
                      {order.infan_details &&
                        order.infan_details.map((item, index) => {
                          return (
                            <View style={{ flexDirection: "row", flex: 1 }} key={"infants" + index}>
                              <Text key={item.index} style={styles.airlineno}>
                                {item.fname + " " + item.lname}
                              </Text>
                              <Text
                                key={item.index}
                                style={[styles.airlineno, { flex: 1, textAlign: "center" }]}>
                                {item.age}
                              </Text>
                              <Text
                                key={item.index}
                                style={[styles.airlineno, { flex: 1, textAlign: "center" }]}>
                                {item.gender == "M" ? "Male" : "Female"}
                              </Text>
                              {isArray(ticket.Tickets) &&
                                ticket.Tickets.map(item => {
                                  if (item.TripType == 2) {
                                    return (
                                      <Text
                                        key={item.index}
                                        style={[
                                          styles.airlineno,
                                          { flex: 2, textAlign: "center" }
                                        ]}>
                                        {item.EticketNo}
                                      </Text>
                                    );
                                  }
                                })}
                            </View>
                          );
                        })}
                    </View>
                  </View>
                )}

                <View style={[styles.cardView, { marginTop: 15 }]}>
                  <View style={styles.flightType}>
                    <Text style={styles.heading}>Fare Summary</Text>
                  </View>

                  <Text style={[styles.time, { paddingTop: 8, marginHorizontal: 12 }]}>Onward</Text>

                  <View style={styles.summaryRow}>
                    <Text style={styles.airlineno}>Base Fare</Text>
                    <Text style={styles.airlineno}>₹ {dataArray["Base Fare"]}</Text>
                  </View>

                  <View style={styles.summaryRow}>
                    <Text style={styles.airlineno}>Flight Scharge</Text>
                    <Text style={styles.airlineno}>₹ {dataArray["Flight Schagre"]}</Text>
                  </View>

                  <View style={styles.summaryRow}>
                    <Text style={styles.airlineno}>Flight Tax</Text>
                    <Text style={styles.airlineno}>₹ {dataArray["Flight Tax"]}</Text>
                  </View>

                  {dataArray.hasOwnProperty("Return Item Result Data") && (
                    <>
                      <Text style={[styles.time, { paddingTop: 8, marginHorizontal: 12 }]}>
                        Return
                      </Text>
                      <View style={styles.summaryRow}>
                        <Text style={styles.airlineno}>Base Fare</Text>
                        <Text style={styles.airlineno}>₹ {dataArray["Return Base Fare"]}</Text>
                      </View>

                      <View style={styles.summaryRow}>
                        <Text style={styles.airlineno}>Flight Scharge</Text>
                        <Text style={styles.airlineno}>₹ {dataArray["Flight Schagre"]}</Text>
                      </View>

                      <View style={styles.summaryRow}>
                        <Text style={styles.airlineno}>Flight Tax</Text>
                        <Text style={styles.airlineno}>₹ {dataArray["Return Flight Tax"]}</Text>
                      </View>
                    </>
                  )}

                  <View style={[styles.summaryRow]}>
                    <Text style={styles.airlineno}>Convenience Fee</Text>
                    <HTML baseFontStyle={styles.airlineno} html={dataArray["ConvenienceFee"]} />
                  </View>

                  <View style={styles.summaryRow}>
                    <Text style={styles.time}>Total Price</Text>
                    <Text style={styles.time}>₹ {order.total}</Text>
                  </View>
                  <View style={[styles.summaryRow, { paddingBottom: 8 }]}>
                    <Text style={styles.airlineno}>Payment Method</Text>
                    <Text style={styles.airlineno}>
                      {order.payment_method != "" || order.payment_method
                        ? order.payment_method
                        : null}
                    </Text>
                  </View>
                </View>
              </View>

              <Button
                style={{
                  backgroundColor: "#F68E1F",
                  justifyContent: "center",
                  marginHorizontal: 20,
                  marginVertical: 40,
                  height: 36,
                  borderRadius: 20,
                  alignItems: "center"
                }}
                onPress={this.navigateToScreen("Home")}>
                <Text style={{ color: "#fff", paddingHorizontal: 40 }}>Go Home</Text>
              </Button>
            </ScrollView>
            {loader && <ActivityIndicator />}
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  summaryView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10
  },
  Heading: { fontSize: 16, fontWeight: "700" },
  header: {
    fontSize: 16,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 5,
    backgroundColor: "#edeeef"
  },
  time: {
    lineHeight: 16,
    fontWeight: "600"
  },
  airlineno: {
    fontSize: 12,
    lineHeight: 16,
    color: "#757575"
  },
  class: {
    lineHeight: 16,
    fontWeight: "600"
  },
  summaryRow: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  cardView: {
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    marginHorizontal: 8,
    backgroundColor: "#fff",
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOpacity: 1,
    shadowRadius: 4
  },
  flightType: {
    backgroundColor: "#edeeef",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8
  },
  contentView: {
    flexDirection: "row",
    paddingHorizontal: 5,
    paddingTop: 8,
    paddingBottom: 8,
    justifyContent: "space-between",
    marginHorizontal: 8
  },
  heading: {
    fontSize: 16,
    fontWeight: "600"
  }
});

export default ThankYou;
