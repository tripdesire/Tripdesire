import React, { PureComponent } from "react";
import { Dimensions, Image, StyleSheet, View, FlatList, Modal, SafeAreaView } from "react-native";
import { Button, Text, ActivityIndicator, HeaderFlights, Icon } from "../../components";
import Toast from "react-native-simple-toast";
import { withNavigation } from "react-navigation";
import SwiperFlatList from "react-native-swiper-flatlist";
import { etravosApi } from "../../service";
import moment from "moment";
import RenderRound from "./RenderRound";
import Filter from "./Filter";

const { width, height } = Dimensions.get("window");
class BusRound extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log("Round");
    this.state = {
      loader: false,
      onwardBus: [],
      returnBus: [],
      selectedOnward: 0,
      selectedReturn: 0,
      index: 0,
      swiperIndex: 0,
      onwardFare: "",
      returnFare: ""
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
          this.setState({ nofound: data.AvailableTrips.length, loader: false });
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

    // let newData = Object.assign({}, params);
    // newData.sourceName = params.destinationName;
    // newData.destinationName = params.sourceName;
    // newData.sourceId = params.destinationId;
    // newData.destinationId = params.sourceId;
    // newData.journeyDate = params.returnDate;
    // newData.returnDate = "";
    // console.log(newData);

    // this.setState({ loader: true });
    // etravosApi
    //   .get("/Buses/AvailableBuses", newData)
    //   .then(({ data }) => {
    //     console.log(data.AvailableTrips);
    //     if (data.AvailableTrips.length == 0) {
    //       this.setState({ nofound: data.AvailableTrips.length, loader: false });
    //       Toast.show("Data not found.", Toast.LONG);
    //     }
    //     this.setState({
    //       returnBus: data.AvailableTrips,
    //       returnFare: data.AvailableTrips.length > 0 ? data.AvailableTrips[0].Fares : 0,
    //       //   filteredBuses: data.AvailableTrips,
    //       loader: false
    //     });
    //   })
    //   .catch(() => {
    //     this.setState({ loader: false });
    //   });
  }

  _renderItemOnward = ({ item, index }) => {
    const { tripType, sourceName, destinationName } = this.props.navigation.state.params;
    return (
      <RenderRound
        item={item}
        index={index}
        getBus={this._getBusOnward}
        tripType={tripType}
        sourceName={sourceName}
        destinationName={destinationName}
      />
    );
  };

  _onChangeIndex = ({ index }) => {
    this.setState({ swiperIndex: index });
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
    const { onwardBus, returnBus, loader, index, swiperIndex, onwardFare, returnFare } = this.state;
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
              <View
                style={{
                  flexDirection: "row",
                  width: "100%"
                }}>
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
                  style={{
                    flexDirection: "row",
                    marginStart: "auto",
                    paddingEnd: 8,
                    paddingVertical: 16
                  }}>
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
