import React, { PureComponent } from "react";
import { View, Image, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { Button, Text, CheckBox } from "../../components";
import { uniq, intersection, max, min, isEmpty } from "lodash";
import { Icon } from "../../components";
import RangeSlider from "rn-range-slider";
import moment from "moment";

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
        price: {},
        depature: [],
        arrival: []
      },
      index: 0
    };
  }

  /*static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.filter != prevState.filter) {
      return {filter: nextProps.filter};
    } else {
      return null;
    }
  }*/

  componentDidMount() {
    const { data, flight_type, returnFlights } = this.props;
    //console.log(data);
    let stops = [];
    let fareType = [];
    let airlines = [];
    let connectingLocations = [];
    let price = [];
    switch (flight_type) {
      case 1:
        for (let value of data) {
          stops.push(value.FlightSegments.length - 1);
          fareType.push(value.FlightSegments[0].BookingClassFare.Rule);
          airlines.push(value.FlightSegments[0].AirLineName);
          for (let j = 1; j < value.FlightSegments.length; j++) {
            connectingLocations.push(value.FlightSegments[j].IntDepartureAirportName);
          }
          price.push(value.FareDetails.TotalFare);
        }

        if (Array.isArray(returnFlights) && returnFlights.length > 0) {
          let stopsR = [];
          let fareTypeR = [];
          let airlinesR = [];
          let connectingLocationsR = [];
          for (let value of returnFlights) {
            stopsR.push(value.FlightSegments.length - 1);
            fareTypeR.push(value.FlightSegments[0].BookingClassFare.Rule);
            airlinesR.push(value.FlightSegments[0].AirLineName);
            for (let j = 1; j < value.FlightSegments.length; j++) {
              connectingLocationsR.push(value.FlightSegments[j].IntDepartureAirportName);
            }
            price.push(value.FareDetails.TotalFare);
          }
          stops = intersection(stops, stopsR).sort();
          fareType = intersection(fareType, fareTypeR);
          airlines = intersection(airlines, airlinesR);
          connectingLocations = intersection(connectingLocations, connectingLocationsR);
        } else {
          stops = uniq(stops).sort();
          fareType = uniq(fareType);
          airlines = uniq(airlines);
          connectingLocations = uniq(connectingLocations);
        }
        price = { min: Math.floor(min(price)), max: Math.ceil(max(price)) };
        break;
      case 2:
        for (let value of data) {
          stops.push(value.IntOnward.FlightSegments.length - 1);
          fareType.push(value.IntOnward.FlightSegments[0].BookingClassFare.Rule);
          airlines.push(value.IntOnward.FlightSegments[0].AirLineName);
          for (let j = 1; j < value.IntOnward.FlightSegments.length; j++) {
            connectingLocations.push(value.IntOnward.FlightSegments[j].IntDepartureAirportName);
          }
          price.push(value.IntOnward.FareDetails.TotalFare);

          if (value.IntReturn.length > 0) {
            stops.push(value.IntReturn.FlightSegments.length - 1);
            fareType.push(value.IntReturn.FlightSegments[0].BookingClassFare.Rule);
            airlines.push(value.IntReturn.FlightSegments[0].AirLineName);
            for (let j = 1; j < value.IntReturn.FlightSegments.length; j++) {
              connectingLocations.push(value.IntReturn.FlightSegments[j].IntDepartureAirportName);
            }
            price.push(value.IntReturn.FareDetails.TotalFare);
          }
        }

        stops = uniq(stops).sort();
        fareType = uniq(fareType).sort();
        airlines = uniq(airlines).sort();
        connectingLocations = uniq(connectingLocations).sort();
        price = { min: Math.floor(min(price)), max: Math.ceil(max(price)) };
        break;
    }

    this.setState({
      filters: {
        ...this.state.filters,
        stops,
        fareType,
        airlines,
        connectingLocations,
        price
      }
    });
    console.log(this.state);
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

  priceUpdate = (low, high) => {
    const { filterValues, onChangeFilter } = this.props;
    let newData = Object.assign({}, filterValues);
    newData.price = { min: low, max: high };
    onChangeFilter && onChangeFilter(newData);
  };

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
              {index == 4 && !isEmpty(filters.price) && (
                <View style={{ width: "100%", alignItems: "center", padding: 8 }}>
                  <RangeSlider
                    style={{
                      //flex: 1,
                      width: "100%",
                      height: 80
                    }}
                    isMarkersSeparated={true}
                    gravity={"center"}
                    min={filters.price.min}
                    max={filters.price.max}
                    initialLowValue={
                      filterValues.price.min ? filterValues.price.min : filters.price.min
                    }
                    initialHighValue={
                      filterValues.price.max ? filterValues.price.max : filters.price.max
                    }
                    selectionColor="#F68E1F"
                    blankColor="#757575"
                    labelBackgroundColor="#E8EEF6"
                    labelBorderColor="#E8EEF6"
                    labelTextColor="#000"
                    onValueChanged={this.priceUpdate}
                  />
                  <View
                    style={{
                      width: "100%",
                      justifyContent: "space-between",
                      flexDirection: "row"
                    }}>
                    <Text style={{ fontWeight: "700" }}>{filters.price.min}</Text>
                    <Text style={{ fontWeight: "700" }}>{filters.price.max}</Text>
                  </View>
                </View>
              )}

              {/*index == 6 && !isEmpty(filters.price) && (
                <View style={{ width: "100%", alignItems: "center", padding: 8 }}>
                  <RangeSlider
                    style={{
                      //flex: 1,
                      width: "100%",
                      height: 80
                    }}
                    isMarkersSeparated={true}
                    gravity={"center"}
                    min={moment()
                      .startOf("day")
                      .format("HH:MM")}
                    // max={moment()
                    //   .endOf("day")
                    //   .toDate()}
                    //initialLowValue={new Date()}
                    //initialHighValue={new Date()}
                    time
                    selectionColor="#F68E1F"
                    blankColor="#757575"
                    labelBackgroundColor="#E8EEF6"
                    labelBorderColor="#E8EEF6"
                    labelTextColor="#000"
                    //onValueChanged={this.priceUpdate}
                  />
                  <View
                    style={{
                      width: "100%",
                      justifyContent: "space-between",
                      flexDirection: "row"
                    }}>
                    <Text style={{ fontWeight: "700" }}>{filters.price.min}</Text>
                    <Text style={{ fontWeight: "700" }}>{filters.price.max}</Text>
                  </View>
                </View>
              )*/}
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
