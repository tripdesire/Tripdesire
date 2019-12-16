import React from "react";
import { Dimensions, Image, StyleSheet, View, FlatList, SafeAreaView } from "react-native";
import { Button, Text, ActivityIndicator, Icon } from "../../../components";
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
      selectedOnward: 0,
      onwardFare: ""
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
          onwardFare: data.AvailableTrips.length > 0 ? data.AvailableTrips[0].Fares : 0,
          filteredBuses: data.AvailableTrips,
          loader: false
        });
      })
      .catch(() => {
        this.setState({ loader: false });
      });
  }

  _renderItemOnward = ({ item, index }) => {
    const {
      tripType,
      sourceName,
      destinationName,
      TripType,
      sourceId,
      destinationId,
      journeyDate,
      returnDate,
      params
    } = this.props.navigation.state.params;
    return (
      <RenderRound
        item={item}
        index={index}
        getBus={this._getBusOnward}
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

  _getBusOnward = (value, index) => {
    console.log("hey");
    this.setState({
      onwardFare: value.Fares,
      selectedOnward: index
    });
  };

  _keyExtractorOnward = (item, index) => "OnwardBus_" + index;

  render() {
    const { onwardBus, loader, onwardFare } = this.state;
    const {
      tripType,
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
                <Button
                  style={styles.sortFilter}>
                  <Icon name="filter" size={20} color="#5D89F4" type="MaterialCommunityIcons" />
                  <Text style={{ fontSize: 14, marginHorizontal: 5, color: "#717984" }}>
                    Sort & Filter
                  </Text>
                </Button>
              </View>
            </View>

            <View style={{ flex: 4 }}>
              <FlatList
                data={onwardBus}
                keyExtractor={this._keyExtractorOnward}
                renderItem={this._renderItemOnward}
                contentContainerStyle={{ width, paddingHorizontal: 8 }}
                extraData={this.state.selectedOnward}
              />
              {loader && <ActivityIndicator />}
            </View>
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
  }
});

export default BusRound;
