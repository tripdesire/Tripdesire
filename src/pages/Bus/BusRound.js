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

class BusRound extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log("Round");
    this.state = {
      loader: false,
      onwardBus: [],
      returnBus: [],
      selectedOnward: 0,
      selectedReturn: 0
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
          filteredBuses: data.AvailableTrips,
          loader: false
        });
      })
      .catch(() => {
        this.setState({ loader: false });
      });

    let newData = Object.assign({}, params);
    newData.sourceName = params.destinationName;
    newData.destinationName = params.sourceName;
    newData.sourceId = params.destinationId;
    newData.destinationId = params.sourceId;
    newData.journeyDate = params.returnDate;
    newData.returnDate = "";
    console.log(newData);

    this.setState({ loader: true });
    etravosApi
      .get("/Buses/AvailableBuses", newData)
      .then(({ data }) => {
        console.log(data.AvailableTrips);
        if (data.AvailableTrips.length == 0) {
          this.setState({ nofound: data.AvailableTrips.length, loader: false });
          Toast.show("Data not found.", Toast.LONG);
        }
        this.setState({
          returnBus: data.AvailableTrips,
          //   filteredBuses: data.AvailableTrips,
          loader: false
        });
      })
      .catch(() => {
        this.setState({ loader: false });
      });
  }

  _renderItemOnward = ({ item, index }) => {
    return <RenderRound item={item} index={index} />;
  };

  _renderItemReturn = ({ item, index }) => {
    return <RenderRound item={item} index={index} />;
  };

  _onPress = value => {};

  _keyExtractorOnward = (item, index) => "OnwardBus_" + index;

  _keyExtractorReturn = (item, index) => "ReturnBus_" + index;

  render() {
    const { onwardBus, returnBus, loader } = this.state;
    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "#E5EBF7" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
            <HeaderFlights
              from="{from}"
              to="{to}"
              journey_date="{journey_date}"
              return_date="{return_date}"
              Adult="{Adult}"
              Child="{Child}"
              Infant="{Infant}"
              className="{className}"
              style={{ backgroundColor: "#E5EBF7", paddingBottom: 8 }}>
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
            </HeaderFlights>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                margin: 16,
                alignItems: "center"
              }}>
              <View>
                <Text style={{ color: "#5F6D78" }}>Departure</Text>
                <Text style={{ color: "#212C4C", fontSize: 18, fontWeight: "700" }}>
                  $ onwardFare
                </Text>
              </View>
              <View>
                <Text style={{ color: "#5F6D78" }}>Return</Text>
                <Text style={{ color: "#212C4C", fontSize: 18, fontWeight: "700" }}>
                  $ returnFare
                </Text>
              </View>
              <View>
                <Text style={{ color: "#5F6D78" }}>Total</Text>
                <Text style={{ color: "#212C4C", fontSize: 18, fontWeight: "700" }}>
                  $ onwardFare + returnFare
                </Text>
              </View>
              <Button style={{ backgroundColor: "#F68E1F", borderRadius: 15 }}>
                <Text style={{ color: "#fff", paddingHorizontal: 10, paddingVertical: 4 }}>
                  Book Now
                </Text>
              </Button>
            </View>
            <View
              style={{
                backgroundColor: "#DEDEDE",
                height: 1,
                marginHorizontal: 16,
                marginVertical: 10
              }}
            />
            <View
              style={{
                backgroundColor: "#FFFFFF",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginHorizontal: 16
              }}>
              <Button
                style={[styles.tabBtn, { backgroundColor: "#5B89F9" }]}
                onPress={this._onPress("Depart")}>
                <Text style={{ fontSize: 12, color: "#ffffff" }}>Depart</Text>
              </Button>
              <Button
                style={[styles.tabBtn, { backgroundColor: "#ffffff" }]}
                onPress={this._onPress("Return")}>
                <Text style={{ fontSize: 12, color: "#000000" }}>Return</Text>
              </Button>
            </View>

            <SwiperFlatList index={index}>
              <FlatList
                data={onwardBus}
                keyExtractor={this._keyExtractorOnward}
                renderItem={this._renderItemOnward}
                contentContainerStyle={{ width, paddingHorizontal: 8 }}
                extraData={this.state.selectedOnward}
              />
              <FlatList
                data={returnBus}
                keyExtractor={this._keyExtractorReturn}
                renderItem={this._renderItemReturn}
                contentContainerStyle={{ width, paddingHorizontal: 8 }}
                extraData={this.state.selectedReturn}
              />
            </SwiperFlatList>
            {loader && <ActivityIndicator />}
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
