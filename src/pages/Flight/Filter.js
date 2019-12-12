import React from "react";
import { View, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { Button, Text, CheckBox, RadioButton } from "../../components";
import { uniq, intersection, max, min } from "lodash";
import { Icon } from "../../components";
import moment from "moment";
import MultiSlider from "@ptomasroos/react-native-multi-slider";

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
        "departure",
        "Arrival",
        "Sort by"
      ],
      filters: {
        stops: [],
        fareType: [],
        airlines: [],
        connectingLocations: [],
        price: [],
        departure: [],
        arrival: [],
        sortBy: [
          "Airline ascending",
          "Airline descending",
          "Price low to high",
          "Price high to low",
          "Departure ascending",
          "Departure descending",
          "Arrival ascending",
          "Arrival descending"
        ]
      },
      index: 0,
      timeStops: this.getTimeStops(),
      widthSeekBar: 100
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
        price = [Math.floor(min(price)), Math.ceil(max(price))];
        break;
      case 2:
        for (let value of data) {
          stops.push(value.IntOnward.FlightSegments.length - 1);
          fareType.push(value.IntOnward.FlightSegments[0].BookingClassFare.Rule);
          airlines.push(value.IntOnward.FlightSegments[0].AirLineName);
          for (let j = 1; j < value.IntOnward.FlightSegments.length; j++) {
            connectingLocations.push(value.IntOnward.FlightSegments[j].IntDepartureAirportName);
          }
          price.push(value.FareDetails.TotalFare);
          if (value.IntReturn.length > 0) {
            stops.push(value.IntReturn.FlightSegments.length - 1);
            fareType.push(value.IntReturn.FlightSegments[0].BookingClassFare.Rule);
            airlines.push(value.IntReturn.FlightSegments[0].AirLineName);
            for (let j = 1; j < value.IntReturn.FlightSegments.length; j++) {
              connectingLocations.push(value.IntReturn.FlightSegments[j].IntDepartureAirportName);
            }
          }
        }
        stops = uniq(stops).sort();
        fareType = uniq(fareType).sort();
        airlines = uniq(airlines).sort();
        connectingLocations = uniq(connectingLocations).sort();
        price = [Math.floor(min(price)), Math.ceil(max(price))];
        break;
    }

    this.setState({
      filters: {
        ...this.state.filters,
        stops,
        fareType,
        airlines,
        connectingLocations,
        price,
        departure: [0, this.state.timeStops.length - 1],
        arrival: [0, this.state.timeStops.length - 1]
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
    this.props.onChangeFilter && this.props.onChangeFilter(newData);
  };

  onSliderUpdate = key => value => {
    const { filterValues, onChangeFilter } = this.props;
    const { filters, timeStops } = this.state;
    let newData = Object.assign({}, filterValues);
    if (key == "price") {
      newData[key] = [value[0], value[1] || filters[key][1]];
    } else {
      newData[key] = [timeStops[value[0]], timeStops[value[1]]];
    }
    //console.log(newData);
    onChangeFilter && onChangeFilter(newData);
  };

  onRadioUpdate = (key, value) => () => {
    const { filterValues, onChangeFilter } = this.props;
    let newData = Object.assign({}, filterValues);
    newData[key] = value;
    console.log(newData);
    onChangeFilter && onChangeFilter(newData);
  };

  _radioButton = (index, value) => {
    let newData = Object.assign([], this.state.radioButton);
    for (let i = 0; i < newData.length; i++) {
      if (newData[i].Name == value) {
        this.setState({ radioDirect: true });
      }
    }
  };

  getSizeSeekBar(event) {
    this.setState({ widthSeekBar: event.nativeEvent.layout.width });
  }

  getTimeStops() {
    var startTime = moment("00:00", "HH:mm");
    var endTime = moment("23:59", "HH:mm");
    if (endTime.isBefore(startTime)) {
      endTime.add(1, "day");
    }
    var timeStops = [];
    while (startTime <= endTime) {
      timeStops.push(new moment(startTime).format("hh:mm A"));
      startTime.add(15, "minutes");
    }
    return timeStops;
  }

  render() {
    const { filterTabs, index, filters, timeStops, radioButton } = this.state;
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
            <View
              style={{ flex: 3, backgroundColor: "#FFFFFF" }}
              onLayout={e => this.getSizeSeekBar(e)}>
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
              {index == 4 && (
                <View style={{ width: "100%", alignItems: "center", padding: 8 }}>
                  <MultiSlider
                    trackStyle={{ height: 4 }}
                    selectedStyle={{ backgroundColor: "#F68E1F" }}
                    markerStyle={{ marginTop: 4, backgroundColor: "#F68E1F" }}
                    sliderLength={this.state.widthSeekBar - 32}
                    min={filters.price[0]}
                    max={filters.price[1]}
                    values={
                      [filterValues.price[0] || filters.price[0], filterValues.price[1]] ||
                      filters.price[1]
                    }
                    enabledTwo
                    onValuesChangeFinish={this.onSliderUpdate("price")}
                  />
                  <View
                    style={{
                      width: "100%",
                      justifyContent: "space-between",
                      flexDirection: "row"
                    }}>
                    <Text style={{ fontWeight: "700" }}>
                      {filterValues.price[0] || filters.price[0]}
                    </Text>
                    <Text style={{ fontWeight: "700" }}>
                      {filterValues.price[1] || filters.price[1]}
                    </Text>
                  </View>
                </View>
              )}

              {index == 5 && (
                <View style={{ width: "100%", alignItems: "center", padding: 8 }}>
                  <MultiSlider
                    trackStyle={{ height: 4 }}
                    selectedStyle={{ backgroundColor: "#F68E1F" }}
                    markerStyle={{ marginTop: 4, backgroundColor: "#F68E1F" }}
                    sliderLength={this.state.widthSeekBar - 32}
                    min={0}
                    max={timeStops.length - 1}
                    values={[
                      timeStops.findIndex(e => e == filterValues.departure[0]),
                      timeStops.findIndex(e => e == filterValues.departure[1])
                    ]}
                    enabledTwo
                    onValuesChangeFinish={this.onSliderUpdate("departure")}
                  />

                  <View
                    style={{
                      width: "100%",
                      justifyContent: "space-between",
                      flexDirection: "row"
                    }}>
                    <Text style={{ fontWeight: "700" }}>{filterValues.departure[0]}</Text>
                    <Text style={{ fontWeight: "700" }}>{filterValues.departure[1]}</Text>
                  </View>
                </View>
              )}

              {index == 6 && (
                <View style={{ width: "100%", alignItems: "center", padding: 8 }}>
                  <MultiSlider
                    trackStyle={{ height: 4 }}
                    selectedStyle={{ backgroundColor: "#F68E1F" }}
                    markerStyle={{ marginTop: 4, backgroundColor: "#F68E1F" }}
                    sliderLength={this.state.widthSeekBar - 32}
                    min={0}
                    max={timeStops.length - 1}
                    values={[
                      timeStops.findIndex(e => e == filterValues.arrival[0]),
                      timeStops.findIndex(e => e == filterValues.arrival[1])
                    ]}
                    enabledTwo
                    onValuesChangeFinish={this.onSliderUpdate("arrival")}
                  />

                  <View
                    style={{
                      width: "100%",
                      justifyContent: "space-between",
                      flexDirection: "row"
                    }}>
                    <Text style={{ fontWeight: "700" }}>{filterValues.arrival[0]}</Text>
                    <Text style={{ fontWeight: "700" }}>{filterValues.arrival[1]}</Text>
                  </View>
                </View>
              )}

              {index == 7 &&
                filters.sortBy.map((item, index) => (
                  <RadioButton
                    key={"sort_" + item + index}
                    label={item}
                    onPress={this.onRadioUpdate("sortBy", item)}
                    selected={item === filterValues.sortBy}
                  />
                ))}
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
