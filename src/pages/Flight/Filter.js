import React, { PureComponent } from "react";
import { View, Image, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { Button, Text, CheckBox } from "../../components";
import { _ } from "lodash";
import moment from "moment";
import { connect } from "react-redux";
import { Header, Icon } from "../../components";
import {} from "react-native-gesture-handler";

class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterTabs: [
        "Stops",
        "Fare Type",
        "Airlines",
        "Connecting Locations",
        "Price",
        "Depature",
        "Arrival"
      ],
      filters: {
        stops: [],
        fareType: [],
        airlines: [],
        connectingLocations: [],
        price: [],
        depature: [],
        arrival: []
      },
      index: 0
    };
  }
  componentDidMount() {
    const { data, flight_type } = this.props;
    //console.log(data);
    let stops = [];
    let fareType = [];
    let airlines = [];
    let connectingLocations = [];
    let price = [];
    switch (flight_type) {
      case 1:
        for (let value of data) {
          if (!stops.includes(value.FlightSegments.length - 1)) {
            stops.push(value.FlightSegments.length - 1);
          }
          if (!fareType.includes(value.FlightSegments[0].BookingClassFare.Rule)) {
            fareType.push(value.FlightSegments[0].BookingClassFare.Rule);
          }
          if (!airlines.includes(value.FlightSegments[0].AirLineName)) {
            airlines.push(value.FlightSegments[0].AirLineName);
          }
          for (let j = 1; j < value.FlightSegments.length; j++) {
            if (!connectingLocations.includes(value.FlightSegments[j].IntDepartureAirportName)) {
              connectingLocations.push(value.FlightSegments[j].IntDepartureAirportName);
            }
          }
        }
        price = data.map(value => value.FareDetails.TotalFare);
        price = [Math.min(...price), Math.max(...price)];
        break;
      case 2:
        for (let value of data) {
          if (!stops.includes(value.IntOnward.FlightSegments.length - 1)) {
            stops.push(value.IntOnward.FlightSegments.length - 1);
          }
          if (!fareType.includes(value.IntOnward.FlightSegments[0].BookingClassFare.Rule)) {
            fareType.push(value.IntOnward.FlightSegments[0].BookingClassFare.Rule);
          }
          if (!airlines.includes(value.IntOnward.FlightSegments[0].AirLineName)) {
            airlines.push(value.IntOnward.FlightSegments[0].AirLineName);
          }
          for (let j = 1; j < value.IntOnward.FlightSegments.length; j++) {
            if (
              !connectingLocations.includes(
                value.IntOnward.FlightSegments[j].IntDepartureAirportName
              )
            ) {
              connectingLocations.push(value.IntOnward.FlightSegments[j].IntDepartureAirportName);
            }
          }
        }
        price = data.map(value => value.FareDetails.TotalFare);
        price = [Math.min(...price), Math.max(...price)];
        break;
    }

    this.setState({
      filters: {
        ...this.state.filters,
        stops: stops.sort(),
        fareType,
        airlines,
        connectingLocations
      }
    });
    console.log(stops, fareType, airlines, connectingLocations, price);
  }

  changeActiveTab = index => () => {
    this.setState({ index });
  };

  updateFilter = (key, index) => () => {
    const { filterValues } = this.props;
    const { filters } = this.state;
    let newData = Object.assign({}, filterValues);
    if (newData[key].includes(filters[key][index])) {
      newData[key].splice(
        newData[key].findIndex(val => val == filters[key][index]),
        1
      );
    } else {
      newData[key].push(filters[key][index]);
    }
    console.log(newData);
    this.props.onChangeFilter && this.props.onChangeFilter(newData);
  };

  reset = () => {};

  render() {
    const { filterTabs, index, filters } = this.state;
    const { filterValues } = this.props;

    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "white" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "gray" }}>
          <View style={styles.headerContainer}>
            <Button onPress={this.props.onBackPress} style={{ padding: 16 }}>
              <Icon name="md-arrow-back" size={24} />
            </Button>
            <Text style={{ fontWeight: "700", fontSize: 16 }}>Filter</Text>
          </View>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={{ flex: 2, backgroundColor: "#E8EEF6" }}>
              {filterTabs.map((item, i) => (
                <Button
                  style={[styles.filterTabs, i == index ? { backgroundColor: "#FFFFFF" } : null]}
                  key={"filter_" + item + index}
                  onPress={this.changeActiveTab(i)}>
                  <Text>{item}</Text>
                </Button>
              ))}
            </View>
            <View style={{ flex: 3, backgroundColor: "#FFFFFF" }}>
              {index == 0 && (
                <ScrollView>
                  {filters.stops.map((item, index) => (
                    <CheckBox
                      label={item + " Stop(s)"}
                      key={"stops_" + item + index}
                      checked={filterValues.stops.includes(item)}
                      onPress={this.updateFilter("stops", index)}
                    />
                  ))}
                </ScrollView>
              )}
              {index == 1 && (
                <ScrollView>
                  {filters.fareType.map((item, index) => (
                    <CheckBox
                      label={item}
                      key={"fareType_" + item + index}
                      checked={filterValues.fareType.includes(item)}
                      onPress={this.updateFilter("fareType", index)}
                    />
                  ))}
                </ScrollView>
              )}
              {index == 2 && (
                <ScrollView>
                  {filters.airlines.map((item, index) => (
                    <CheckBox
                      label={item}
                      key={"airlines_" + item + index}
                      checked={filterValues.airlines.includes(item)}
                      onPress={this.updateFilter("airlines", index)}
                    />
                  ))}
                </ScrollView>
              )}
              {index == 3 && (
                <ScrollView>
                  {filters.connectingLocations.map((item, index) => (
                    <CheckBox
                      label={item}
                      key={"connectingLocations_" + item + index}
                      checked={filterValues.connectingLocations.includes(item)}
                      onPress={this.updateFilter("connectingLocations", index)}
                    />
                  ))}
                </ScrollView>
              )}
            </View>
          </View>
          <View style={styles.footer}>
            {/* <Button style={styles.resetButton} onPress={this.reset}>
            <Text style={{ fontWeight: "700" }}>Reset</Text>
          </Button> */}
            <Button style={styles.applyButton} onPress={this.props.filter}>
              <Text style={{ color: "#FFFFFF", fontWeight: "700" }}>Apply</Text>
            </Button>
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    backgroundColor: "#FFFFFF"
  },
  filterTabs: {
    width: "100%",
    padding: 16
  },
  footer: {
    flexDirection: "row",
    width: "100%",
    padding: 8,
    backgroundColor: "#FFFFFF"
  },
  resetButton: {
    padding: 16,
    flex: 2,
    alignItems: "center"
  },
  applyButton: {
    padding: 16,
    backgroundColor: "#F68E1F",
    borderRadius: 8,
    flex: 1,
    alignItems: "center"
  }
});

export default Filter;
