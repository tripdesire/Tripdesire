import React from "react";
import { Dimensions, Modal, StyleSheet, View, FlatList, SafeAreaView } from "react-native";
import { Button, Text, ActivityIndicator, Icon } from "../../../components";
import { orderBy } from "lodash";
import Toast from "react-native-simple-toast";
import { etravosApi } from "../../../service";
import RenderRound from "./RenderRound";
import Filter from "../Filter";

const { width, height } = Dimensions.get("window");
class BusRound extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log("Round");
    this.state = {
      loader: false,
      onwardBus: [],
      filteredBuses: [],
      selectedOnward: 0,
      filterModalVisible: false,
      filterValues: {
        busTimings: [],
        busType: [],
        travels: [],
        boardingPoints: [],
        droppingPoints: [],
        sortBy: "Fare low to high"
      }
    };
  }

  componentDidMount() {
    const { params } = this.props.navigation.state;
    this.setState({ loader: true });
    etravosApi
      .get("/Buses/AvailableBuses", params)
      .then(({ data }) => {
        console.log(data.AvailableTrips);
        if (data.AvailableTrips.length == 0) {
          Toast.show("Data not found.", Toast.LONG);
        }
        this.setState({
          onwardBus: data.AvailableTrips,
          filteredBuses: data.AvailableTrips,
          loader: false
        });
      })
      .catch(() => {
        this.setState({ loader: false });
      });
  }

  openFilter = () => {
    this.setState({ filterModalVisible: true });
  };
  closeFilter = () => {
    this.setState({ filterModalVisible: false });
  };
  onChangeFilter = filterValues => {
    this.setState({ filterValues });
  };

  filter = () => {
    const { filterValues, onwardBus } = this.state;
    let filteredBuses = onwardBus.filter(
      item =>
        (filterValues.busTimings.length == 0 ||
          filterValues.busTimings.some(values => {
            values = values.split("to").map(v => v.trim());
            if (values[1].toLowerCase().includes("p")) {
              return moment(item.DepartureTime, "HH:mm A").isBetween(
                moment(values[0], "HH:mm A"),
                moment(values[1], "HH:mm A"),
                null,
                "[)"
              );
            } else {
              return moment(item.DepartureTime, "HH:mm A").isBetween(
                moment(values[0], "HH:mm A"),
                moment(values[1], "HH:mm A").add("1", "days"),
                null,
                "[)"
              );
            }
          })) &&
        (filterValues.busType.length == 0 ||
          filterValues.busType.some(val => item.BusType.includes(val))) &&
        (filterValues.travels.length == 0 || filterValues.travels.includes(item.DisplayName)) &&
        (filterValues.boardingPoints.length == 0 ||
          item.BoardingTimes.some(value => filterValues.boardingPoints.includes(value.Location))) &&
        (filterValues.droppingPoints.length == 0 ||
          item.DroppingTimes.some(value => filterValues.droppingPoints.includes(value.Location)))
    );

    switch (filterValues.sortBy) {
      case "Travels Asc":
        filteredBuses = orderBy(filteredBuses, "DisplayName", "asc");
        break;
      case "Travels Desc":
        filteredBuses = orderBy(filteredBuses, "DisplayName", "desc");
        break;
      case "Fare low to high":
        filteredBuses = orderBy(filteredBuses, "Fares", "asc");
        break;
      case "Fare high to low":
        filteredBuses = orderBy(filteredBuses, "Fares", "desc");
        break;
      case "Departure Asc":
        filteredBuses = orderBy(
          filteredBuses,
          item => moment(item.DepartureTime, "hh:mm A").toDate(),
          "asc"
        );
        break;
      case "Departure Desc":
        filteredBuses = orderBy(
          filteredBuses,
          item => moment(item.DepartureTime, "hh:mm A").toDate(),
          "desc"
        );
        break;
      case "Arrival Asc":
        filteredBuses = orderBy(
          filteredBuses,
          item => moment(item.ArrivalTime, "hh:mm A").toDate(),
          "asc"
        );
        break;
      case "Arrival Desc":
        filteredBuses = orderBy(
          filteredBuses,
          item => moment(item.ArrivalTime, "hh:mm A").toDate(),
          "desc"
        );
        break;
    }

    this.setState({
      filteredBuses,
      filterModalVisible: false
    });
  };

  _renderItemOnward = ({ item, index }) => {
    const {
      tripType,
      sourceName,
      destinationName,
      TripType,
      sourceId,
      destinationId,
      journeyDate,
      returnDate
    } = this.props.navigation.state.params;
    return (
      <RenderRound
        item={item}
        index={index}
        tripType={tripType}
        sourceName={sourceName}
        sourceId={sourceId}
        TripType={TripType}
        destinationName={destinationName}
        destinationId={destinationId}
        journeyDate={journeyDate}
        returnDate={returnDate}
      />
    );
  };

  _keyExtractorOnward = (item, index) => "OnwardBus_" + index;

  render() {
    const { onwardBus, loader, filteredBuses, filterValues, filterModalVisible } = this.state;
    const {
      sourceName,
      destinationName,
      journeyDate,
      returnDate
    } = this.props.navigation.state.params;
    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "#E5EBF7" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
            <View style={{ backgroundColor: "#E5EBF7" }}>
              <View style={{ flexDirection: "row", width: "100%" }}>
                <Button onPress={() => this.props.navigation.goBack(null)} style={{ padding: 16 }}>
                  <Icon name="md-arrow-back" size={24} />
                </Button>
                <View style={{ flex: 1, paddingTop: 16, paddingBottom: 8 }}>
                  <View>
                    <Text style={{ fontWeight: "700", fontSize: 16, marginHorizontal: 5 }}>
                      {sourceName} to {destinationName}
                    </Text>
                    <Text style={{ fontSize: 12, marginHorizontal: 5, color: "#717984" }}>
                      {journeyDate} {" - " + returnDate}
                    </Text>
                  </View>
                </View>
                <Button style={styles.sortFilter} onPress={this.openFilter}>
                  <Icon name="filter" size={20} color="#5D89F4" type="MaterialCommunityIcons" />
                  <Text style={{ fontSize: 14, marginHorizontal: 5, color: "#717984" }}>
                    Sort & Filter
                  </Text>
                </Button>
              </View>
            </View>

            <View style={{ flex: 4 }}>
              <FlatList
                data={filteredBuses}
                keyExtractor={this._keyExtractorOnward}
                renderItem={this._renderItemOnward}
                contentContainerStyle={{ width, paddingHorizontal: 8 }}
              />
              {!loader && filteredBuses.length == 0 && (
                <View style={{ alignItems: "center", justifyContent: "center", flex: 4 }}>
                  <Text style={{ fontSize: 18, fontWeight: "700" }}>Data not Found.</Text>
                </View>
              )}
              {loader && <ActivityIndicator />}
            </View>
            <Modal
              animationType="slide"
              transparent={false}
              visible={filterModalVisible}
              onRequestClose={this.closeFilter}>
              <Filter
                data={onwardBus}
                onBackPress={this.closeFilter}
                filterValues={filterValues}
                onChangeFilter={this.onChangeFilter}
                filter={this.filter}
              />
            </Modal>
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  tabBtn: {
    elevation: 1,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    height: 40,
    justifyContent: "center",
    paddingHorizontal: 50,
    borderRadius: 20
  },
  sortFilter: {
    flexDirection: "row",
    marginStart: "auto",
    paddingEnd: 8,
    paddingVertical: 16
  }
});

export default BusRound;
