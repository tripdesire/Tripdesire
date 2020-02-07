import React from "react";
import { StyleSheet, View, ScrollView, SafeAreaView, Platform, StatusBar } from "react-native";
import { Button, Text, Header, ActivityIndicator, Icon, LinearGradient } from "../../../components";
import moment from "moment";
import Toast from "react-native-simple-toast";
import { etravosApi } from "../../../service";
import analytics from "@react-native-firebase/analytics";

//import data1 from "../../Bus";
//console.log(data1);

class SeatOneway extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      seats: { upper: [], lower: [] },
      data: [],
      selectedTab: "lower",
      selectedSheets: []
    };
  }

  trackScreenView = async screen => {
    // Set & override the MainActivity screen name
    await analytics().setCurrentScreen(screen, screen);
  };

  componentDidMount() {
    this.trackScreenView("Bus Seats OnewWay");

    console.log(this.props.navigation.state.params);
    const {
      tripType,
      params: { Id, SourceId, DestinationId, Journeydate, Provider, Travels }
    } = this.props.navigation.state.params;
    const queryParams = {
      tripId: Id,
      sourceId: SourceId,
      destinationId: DestinationId,
      journeyDate: moment(Journeydate, "YYYY-MM-DD").format("DD-MM-YYYY"),
      provider: Provider,
      travelOperator: Travels,
      tripType,
      userType: 5,
      user: ""
      //returnDate: null
    };
    //console.log(data);

    this.setState({ loading: true });
    etravosApi
      .get("/Buses/TripDetails", queryParams)
      .then(({ data }) => {
        //data.Seats = data1;
        this.setState({ loading: false });
        if (Array.isArray(data.Seats) && data.Seats) {
          let seats = { upper: [], lower: [] };
          for (let i of data.Seats) {
            switch (i.Zindex) {
              case 0:
                seats.lower.push(i);
                break;
              case 1:
                seats.upper.push(i);
                break;
            }
          }

          const lower =
            seats.lower.length > 0
              ? seats.lower.reduce((prev, current) => {
                  let d = {
                    Row: prev.Row > current.Row ? prev.Row : current.Row,
                    Column: prev.Column > current.Column ? prev.Column : current.Column
                  };
                  return d;
                })
              : undefined;
          let lastHasTwoHeight =
            seats.lower.length > 0
              ? seats.lower.some(val => lower.Column == val.Column && val.Length == 2)
              : undefined;
          const upper =
            seats.upper.length > 0
              ? seats.upper.reduce((prev, current) => {
                  let d = {
                    Row: prev.Row > current.Row ? prev.Row : current.Row,
                    Column: prev.Column > current.Column ? prev.Column : current.Column
                  };
                  return d;
                })
              : undefined;
          let lastUpperHasTwoHeight =
            seats.upper.length > 0
              ? seats.upper.some(val => upper.Column == val.Column && val.Length == 2)
              : undefined;

          const isRowZeroLower = seats.lower.some(val => val.Row == 0);
          const isRowZeroUpper = seats.upper.some(val => val.Row == 0);

          this.setState({
            loading: false,
            seats,
            data: data.Seats,
            selectedTab: seats.lower.length == 0 && seats.upper.length > 0 ? "upper" : "lower",
            lowerRows: lower ? lower.Row + 1 : 0,
            upperRows: upper ? upper.Row + 1 : 0,
            lowerColumns: lower ? (lastHasTwoHeight ? lower.Column + 2 : lower.Column + 1) : 0,
            upperColumns: upper ? (lastUpperHasTwoHeight ? upper.Column + 2 : upper.Column + 1) : 0,
            isRowZeroLower,
            isRowZeroUpper
          });
        } else {
          Toast.show("Seats not available");
          this.setState({ loading: false });
        }
      })
      .catch(error => {
        console.log(error);
        this.setState({ loading: false });
      });
  }

  _bookNow = () => {
    const { tripType, params, TripType } = this.props.navigation.state.params;
    const { selectedSheets } = this.state;
    if (this.state.selectedSheets.length > 0) {
      this.props.navigation.navigate("BoardingOneway", {
        ...this.props.navigation.state.params,
        selectedSheets: selectedSheets
      });
    } else {
      Toast.show("Please Select the Seat");
    }
  };

  updateSheets = item => () => {
    if (item.IsAvailableSeat === "true" || item.IsAvailableSeat === "True") {
      let selectedSheets = [...this.state.selectedSheets];
      let index = selectedSheets.findIndex(val => val.Number == item.Number);
      if (index != -1) {
        selectedSheets.splice(index, 1);
      } else if (selectedSheets.length < 6) {
        selectedSheets.push(item);
      } else {
        Toast.show("You can not select more than 6 setas");
      }
      this.setState({ selectedSheets });
      console.log(selectedSheets);
    }
  };

  renderSeat = item => {
    const { lowerRows, selectedSheets } = this.state;
    const backgroundColor =
      item.IsAvailableSeat === "false" || item.IsAvailableSeat === "False"
        ? "#BBBBBB"
        : selectedSheets.some(val => item.Number == val.Number)
        ? "#5B89F9"
        : "#FFF";
    const seatColor =
      item.IsLadiesSeat == "True" || item.IsLadiesSeat == "true" ? "pink" : "#757575";

    if (item.Length == 2 && item.Width == 1) {
      //Horizonatal Sleeper
      return (
        <Button
          style={{
            width: `${100 / lowerRows}%`,
            height: item.Length * 50,
            alignItems: "center",
            justifyContent: "center"
          }}
          key={"seat_" + item.Number}
          onPress={this.updateSheets(item)}>
          <View
            style={{
              borderRadius: 5,
              borderColor: "#000000",
              borderWidth: 1,
              backgroundColor,
              height: 80,
              width: 40
            }}>
            <Text
              style={{
                textAlign: "center",
                flex: 1,
                textAlignVertical: "center",
                transform: [{ rotateY: "180deg" }]
              }}>
              {item.Number}
            </Text>
            <View
              style={{
                borderRadius: 3,
                backgroundColor: seatColor,
                paddingVertical: 3,
                margin: 5
              }}
            />
          </View>
        </Button>
      );
    } else if (item.Length == 1 && item.Width == 2) {
      //Vertical Sleeper
      return (
        <Button
          style={{
            width: `${100 / lowerRows}%`,
            height: item.Length * 50,
            alignItems: "center",
            justifyContent: "center",
            transform: [{ translateX: 35 }]
          }}
          key={"seat_" + item.Number}
          onPress={this.updateSheets(item)}>
          <View
            style={{
              borderRadius: 5,
              borderColor: "#000000",
              borderWidth: 1,
              width: 80,
              height: 40,
              backgroundColor,
              flexDirection: "row"
            }}>
            <Text
              style={{
                textAlign: "center",
                flex: 1,
                textAlignVertical: "center",
                transform: [{ rotateY: "180deg" }]
              }}>
              {item.Number}
            </Text>
            <View
              style={{
                borderRadius: 3,
                backgroundColor: seatColor,
                paddingHorizontal: 3,
                margin: 5
              }}
            />
          </View>
        </Button>
      );
    } else {
      //Seater
      return (
        <Button
          style={{
            width: `${100 / lowerRows}%`,
            height: item.Length * 50,
            alignItems: "center",
            justifyContent: "center"
          }}
          key={"seat_" + item.Number}
          onPress={this.updateSheets(item)}>
          <View
            style={{
              borderRadius: 5,
              borderWidth: 1,
              borderColor: "#000000",
              width: 40,
              height: 40,
              backgroundColor
            }}>
            <View
              style={{
                ...StyleSheet.absoluteFill,
                borderEndWidth: 6,
                borderStartWidth: 6,
                borderBottomWidth: 6,
                borderRadius: 3,
                borderColor: seatColor,
                marginTop: 15,
                marginStart: -3,
                marginEnd: -3,
                marginBottom: -3
              }}
            />
            <Text
              style={{
                textAlign: "center",
                flex: 1,
                textAlignVertical: "center",
                transform: [{ rotateY: "180deg" }]
              }}>
              {item.Number}
            </Text>
          </View>
        </Button>
      );
    }
  };

  render() {
    const {
      seats,
      loading,
      selectedTab,
      lowerRows,
      lowerColumns,
      upperRows,
      upperColumns,
      isRowZeroLower,
      isRowZeroUpper
    } = this.state;
    //console.log(lowerColumns);

    return (
      <>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        <SafeAreaView style={{ flex: 0, backgroundColor: "#000000" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
          <View style={{ backgroundColor: "#E5EBF7" }}>
            <Header lastName="Seats" />
          </View>

          <View>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
                padding: 16
              }}>
              <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                <View>
                  <Icon
                    size={16}
                    style={{ marginEnd: 5, fontWeight: "700" }}
                    color="#BBBBBB"
                    name={Platform.OS == "ios" ? "ios-radio-button-off" : "md-radio-button-off"}
                  />
                </View>
                <Text>Available</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                <View>
                  <Icon
                    size={16}
                    style={{ marginEnd: 5 }}
                    color="#5B89F9"
                    name={Platform.OS == "ios" ? "ios-radio-button-off" : "md-radio-button-off"}
                  />
                </View>
                <Text>Selected</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                <View>
                  <Icon
                    size={16}
                    style={{ marginEnd: 5 }}
                    color="pink"
                    name={Platform.OS == "ios" ? "ios-radio-button-off" : "md-radio-button-off"}
                  />
                </View>
                <Text>Ladies</Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
                paddingHorizontal: 16,
                paddingBottom: 16
              }}>
              <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                <View>
                  <Icon
                    size={16}
                    style={{ marginEnd: 5, fontWeight: "700" }}
                    color="#BBBBBB"
                    type="FontAwesome"
                    backgroundColor="#BBBBBB"
                    name={Platform.OS == "ios" ? "circle" : "circle"}
                  />
                </View>
                <Text>Booked</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                <View
                  style={{
                    borderRadius: 5,
                    borderWidth: 1,
                    marginEnd: 5,
                    borderColor: "#BBBBBB",
                    width: 30,
                    height: 30,
                    backgroundColor: "#fff"
                  }}>
                  <View
                    style={{
                      ...StyleSheet.absoluteFill,
                      borderEndWidth: 6,
                      borderStartWidth: 6,
                      borderBottomWidth: 6,
                      borderRadius: 3,
                      borderColor: "#BBBBBB",
                      marginTop: 15,
                      marginStart: -3,
                      marginEnd: -3,
                      marginBottom: -3
                    }}
                  />
                  <Text
                    style={{ textAlign: "center", flex: 2, textAlignVertical: "center" }}></Text>
                </View>
                <Text>Seater</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                <View
                  style={{
                    borderRadius: 5,
                    borderColor: "#BBBBBB",
                    borderWidth: 2,
                    marginEnd: 5,
                    width: 60,
                    height: 30,
                    backgroundColor: "#BBBBBBB",
                    flexDirection: "row"
                  }}>
                  <Text
                    style={{ textAlign: "center", flex: 1, textAlignVertical: "center" }}></Text>
                  <View
                    style={{
                      borderRadius: 3,
                      paddingHorizontal: 3,
                      margin: 5
                    }}
                  />
                </View>
                <Text>Sleeper</Text>
              </View>
            </View>
            {seats.lower.length > 0 && seats.upper.length > 0 && (
              <View style={styles.tabContainer}>
                <LinearGradient
                  colors={selectedTab == "lower" ? ["#53b2fe", "#065af3"] : ["#ffffff", "#ffffff"]}
                  style={{
                    ...styles.tab,
                    elevation: 2,
                    shadowOffset: { width: 0, height: 2 },
                    shadowColor: "rgba(0,0,0,0.1)",
                    shadowOpacity: 1,
                    shadowRadius: 4,
                    backgroundColor: "#ffffff",
                    borderTopLeftRadius: 5,
                    borderBottomLeftRadius: 5
                  }}>
                  <Button
                    onPress={() => this.setState({ selectedTab: "lower" })}
                    style={{ paddingHorizontal: 8, paddingVertical: 4 }}>
                    <Text style={[selectedTab == "lower" ? { color: "#FFF" } : { color: "#000" }]}>
                      Lower Birth
                    </Text>
                  </Button>
                </LinearGradient>
                <LinearGradient
                  colors={selectedTab == "upper" ? ["#53b2fe", "#065af3"] : ["#ffffff", "#ffffff"]}
                  style={{
                    ...styles.tab,
                    elevation: 2,
                    shadowOffset: { width: 0, height: 2 },
                    shadowColor: "rgba(0,0,0,0.1)",
                    shadowOpacity: 1,
                    shadowRadius: 4,
                    backgroundColor: "#ffffff",
                    borderTopRightRadius: 5,
                    borderBottomRightRadius: 5
                  }}>
                  <Button
                    onPress={() => this.setState({ selectedTab: "upper" })}
                    style={{ paddingHorizontal: 8, paddingVertical: 4 }}>
                    <Text style={[selectedTab == "upper" ? { color: "#FFF" } : { color: "#000" }]}>
                      Upper Birth
                    </Text>
                  </Button>
                </LinearGradient>
              </View>
            )}
          </View>

          <ScrollView contentContainerStyle={{ paddingHorizontal: 16 }}>
            {selectedTab == "lower" && lowerRows > 0 && lowerColumns > 0 && (
              <View
                style={{
                  paddingHorizontal: lowerRows < 5 ? 48 : 24,
                  flexDirection: "column",
                  flexWrap: "wrap",
                  width: "100%",
                  transform: [{ rotateY: "180deg" }],
                  height: 50 * lowerColumns
                }}>
                {[...Array(lowerRows)].map((c, row) => {
                  return [...Array(lowerColumns)].map((r, column) => {
                    let item = seats.lower.find(v => v.Row == row && v.Column == column);
                    let rowSpan = seats.lower.find(v => v.Row == row && v.Column == column - 1);
                    //let colSpan = seats.lower.find(v => v.Row == row && v.Column == column + 1);
                    if (row == 0 && !isRowZeroLower) {
                      return;
                    } else if (item) {
                      return this.renderSeat(item);
                    } else if (rowSpan && rowSpan.Length == 2) {
                      return (
                        <View
                          key={"seat_blank" + row + column}
                          style={{ width: `${100 / lowerRows}%`, height: 0 }}
                        />
                      );
                    } else {
                      return (
                        <View
                          key={"seat_blank" + row + column}
                          style={{ width: `${100 / lowerRows}%`, height: 50 }}
                        />
                      );
                    }
                  });
                })}
              </View>
            )}

            {selectedTab == "upper" && upperRows > 0 && upperColumns > 0 && (
              <View
                style={{
                  paddingHorizontal: upperRows < 5 ? 48 : 24,
                  flexDirection: "column",
                  flexWrap: "wrap",
                  width: "100%",
                  transform: [{ rotateY: "180deg" }],
                  height: 50 * upperColumns
                }}>
                {[...Array(upperRows)].map((c, row) => {
                  return [...Array(upperColumns)].map((r, column) => {
                    let item = seats.upper.find(v => v.Row == row && v.Column == column);
                    let rowSpan = seats.upper.find(v => v.Row == row && v.Column == column - 1);
                    //let colSpan = seats.upper.find(v => v.Row == row && v.Column == column + 1);
                    if (row == 0 && !isRowZeroUpper) {
                      return;
                    } else if (item) {
                      return this.renderSeat(item);
                    } else if (rowSpan && rowSpan.Length == 2) {
                      return (
                        <View
                          style={{ width: `${100 / upperRows}%`, height: 0 }}
                          key={"seat_blank_" + row + column}
                        />
                      );
                    } else {
                      return (
                        <View
                          key={"seat_blank_" + row + column}
                          style={{ width: `${100 / upperRows}%`, height: 50 }}
                        />
                      );
                    }
                  });
                })}
              </View>
            )}
            {Array.isArray(this.state.data) && this.state.data && (
              <Button
                style={{
                  backgroundColor: "#F68E1D",
                  marginHorizontal: 90,
                  alignItems: "center",
                  justifyContent: "center",
                  height: 36,
                  marginVertical: 20,
                  borderRadius: 20
                }}
                onPress={this._bookNow}>
                <Text style={{ color: "#fff", alignSelf: "center" }}>Book Now</Text>
              </Button>
            )}
          </ScrollView>
          {loading && <ActivityIndicator />}
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOpacity: 1,
    shadowRadius: 4
  },
  tab: {
    backgroundColor: "#ffffff",
    // borderWidth: 5,
    //borderColor: "#d2d2d2",
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "center"
  }
});

export default SeatOneway;
