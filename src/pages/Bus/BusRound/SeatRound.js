import React from "react";
import { StyleSheet, View, ScrollView, SafeAreaView } from "react-native";
import { Button, Text, Header, ActivityIndicator } from "../../../components";
import moment from "moment";
import Toast from "react-native-simple-toast";
import { etravosApi, domainApi } from "../../../service";
//import data1 from "../../Bus";
class SeatRound extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      seats: { upper: [], lower: [] },
      data: [],
      selectedTab: "lower",
      selectedSheetsRound: []
    };
  }

  componentDidMount() {
    console.log(this.props.navigation.state.params);
    const {
      tripType,
      paramsRound: { Id, SourceId, DestinationId, Journeydate, Provider, Travels }
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

          this.setState({
            loading: false,
            seats,
            data: data.Seats,
            selectedTab: seats.lower.length == 0 && seats.upper.length > 0 ? "upper" : "lower",
            lowerRows: lower ? lower.Row : 0,
            upperRows: upper ? upper.Row : 0,
            lowerColumns: lower ? (lastHasTwoHeight ? lower.Column + 1 : lower.Column) : 0,
            upperColumns: upper ? (lastUpperHasTwoHeight ? upper.Column + 1 : upper.Column) : 0
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
    const { selectedSheetsRound } = this.state;
    if (this.state.selectedSheetsRound.length > 0) {
      this.props.navigation.navigate("BoardingRound", {
        ...this.props.navigation.state.params,
        selectedSheetsRound: selectedSheetsRound
      });
    } else {
      Toast.show("Please Select the Seat");
    }
  };

  updateSheets = item => () => {
    let selectedSheetsRound = [...this.state.selectedSheetsRound];
    let index = selectedSheetsRound.findIndex(val => val.Number == item.Number);
    if (index != -1) {
      selectedSheetsRound.splice(index, 1);
    } else {
      selectedSheetsRound.push(item);
    }
    this.setState({ selectedSheetsRound });
    console.log(selectedSheetsRound);
  };

  renderSeat = item => {
    const { lowerRows, selectedSheetsRound } = this.state;
    const backgroundColor = selectedSheetsRound.some(val => item.Number == val.Number)
      ? "#BBBBBB"
      : "#FFF";
    const seatColor = item.IsLadiesSeat == "True" ? "pink" : "#757575";

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
            <Text style={{ textAlign: "center", flex: 1, textAlignVertical: "center" }}>
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
            <Text style={{ textAlign: "center", flex: 1, textAlignVertical: "center" }}>
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
            <Text style={{ textAlign: "center", flex: 1, textAlignVertical: "center" }}>
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
      upperColumns
    } = this.state;
    //console.log(lowerColumns);

    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "#E5EBF7" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
          <View style={{ backgroundColor: "#E5EBF7" }}>
            <Header firstName="Seats" />
          </View>

          {seats.lower.length > 0 && seats.upper.length > 0 && (
            <View style={styles.tabContainer}>
              <Button
                onPress={() => this.setState({ selectedTab: "lower" })}
                style={[
                  selectedTab == "lower" ? { backgroundColor: "#5B89F9" } : null,
                  styles.tab
                ]}>
                <Text style={[selectedTab == "lower" ? { color: "#FFF" } : null]}>Lower Birth</Text>
              </Button>
              <Button
                onPress={() => this.setState({ selectedTab: "upper" })}
                style={[
                  selectedTab == "upper" ? { backgroundColor: "#5B89F9" } : null,
                  styles.tab
                ]}>
                <Text style={[selectedTab == "upper" ? { color: "#FFF" } : null]}>Upper Birth</Text>
              </Button>
            </View>
          )}
          <ScrollView contentContainerStyle={{ paddingHorizontal: 16 }}>
            {selectedTab == "lower" && lowerRows > 0 && lowerColumns > 0 && (
              <View
                style={{
                  paddingHorizontal: lowerRows < 5 ? 48 : 24,
                  flexDirection: "column",
                  flexWrap: "wrap",
                  height: 50 * lowerColumns
                }}>
                {[...Array(lowerRows)].map((c, row) => {
                  return [...Array(lowerColumns)].map((r, column) => {
                    let item = seats.lower.find(v => v.Row == row + 1 && v.Column == column + 1);
                    let rowSpan = seats.lower.find(v => v.Row == row + 1 && v.Column == column);
                    //let colSpan = seats.lower.find(v => v.Row == row && v.Column == column + 1);
                    if (item) {
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
                  height: 50 * upperColumns
                }}>
                {[...Array(upperRows)].map((c, row) => {
                  return [...Array(upperColumns)].map((r, column) => {
                    let item = seats.upper.find(v => v.Row == row + 1 && v.Column == column + 1);
                    let rowSpan = seats.upper.find(v => v.Row == row + 1 && v.Column == column);
                    //let colSpan = seats.upper.find(v => v.Row == row && v.Column == column + 1);
                    if (item) {
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
            <Button
              style={{
                backgroundColor: "#F68E1F",
                marginHorizontal: 100,
                height: 40,
                justifyContent: "center",
                borderRadius: 20,
                marginVertical: 16
              }}
              onPress={this._bookNow}>
              <Text style={{ color: "#fff", alignSelf: "center" }}>Book Now</Text>
            </Button>
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
    justifyContent: "space-around",
    padding: 16
  },
  tab: {
    flex: 1,
    marginHorizontal: 32,
    paddingVertical: 6,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4
  }
});

export default SeatRound;
