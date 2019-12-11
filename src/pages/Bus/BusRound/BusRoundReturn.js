import React, { PureComponent } from "react";
import { Dimensions, Image, StyleSheet, View, FlatList, Modal, SafeAreaView } from "react-native";
import { Button, Text, ActivityIndicator, HeaderFlights, Icon } from "../../../components";
import Toast from "react-native-simple-toast";
import { withNavigation } from "react-navigation";
import SwiperFlatList from "react-native-swiper-flatlist";
import { etravosApi } from "../../../service";
import moment from "moment";
import RenderRoundReturn from "./RenderRoundReturn";
import Filter from "../Filter";

const { width, height } = Dimensions.get("window");
class BusRoundReturn extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log(this.props.navigation.state.params);
    console.log("Round");
    this.state = {
      loader: false,
      returnBus: [],
      selectedReturn: 0,
      index: 0,
      swiperIndex: 0,
      returnFare: ""
    };
  }

  componentDidMount() {
    const {
      sourceName,
      sourceId,
      destinationName,
      destinationId,
      journeyDate,
      tripType,
      TripType
    } = this.props.navigation.state.params;

    let param = {
      sourceName: destinationName,
      destinationName: sourceName,
      sourceId: destinationId,
      destinationId: sourceId,
      journeyDate: returnDate,
      returnDate: "",
      tripType: tripType,
      TripType: TripType,
      userType: 5,
      user: ""
    };

    this.setState({ loader: true });
    etravosApi
      .get("/Buses/AvailableBuses", param)
      .then(({ data }) => {
        console.log(data.AvailableTrips);
        if (data.AvailableTrips.length == 0) {
          this.setState({ nofound: data.AvailableTrips.length, loader: false });
          Toast.show("Data not found.", Toast.LONG);
        }
        this.setState({
          returnBus: data.AvailableTrips,
          returnFare: data.AvailableTrips.length > 0 ? data.AvailableTrips[0].Fares : 0,
          //   filteredBuses: data.AvailableTrips,
          loader: false
        });
      })
      .catch(() => {
        this.setState({ loader: false });
      });
  }

  _renderItemReturn = ({ item, index }) => {
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
      <RenderRoundReturn
        item={item}
        index={index}
        getBus={this._getBusReturn}
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

  _onChangeIndex = ({ index }) => {
    this.setState({ swiperIndex: index });
  };

  _getBusReturn = (value, index) => {
    console.log("hey");
    this.setState({
      returnFare: value.Fares,
      selectedReturn: index
    });
  };

  _keyExtractorReturn = (item, index) => "ReturnBus_" + index;

  render() {
    const { returnBus, loader, index, swiperIndex, onwardFare, returnFare } = this.state;
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
                      {destinationName} to {sourceName}
                    </Text>
                    <Text style={{ fontSize: 12, marginHorizontal: 5, color: "#717984" }}>
                      {returnDate}
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
                data={returnBus}
                keyExtractor={this._keyExtractorReturn}
                renderItem={this._renderItemReturn}
                contentContainerStyle={{ width, paddingHorizontal: 8 }}
                extraData={this.state.selectedReturn}
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

export default BusRoundReturn;
