import React, { PureComponent } from "react";
import { View, Image, StyleSheet, ScrollView } from "react-native";
import { Button, Text, CheckBox } from "../../components";
import { _ } from "lodash";
import moment from "moment";
import { connect } from "react-redux";
import { Header, Icon } from "../../components";
import {} from "react-native-gesture-handler";

class Filter extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      stops: [...Array(2)].map(item => {
        return {
          checkBox: false
        };
      }),
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
    const { data } = this.props;
    console.log(data);

    let stops = data
      .map(value => value.FlightSegments.length - 1)
      .filter((value, index, self) => self.indexOf(value) === index);

    let fareType = data
      .map(value => value.FlightSegments[0].BookingClassFare.Rule)
      .filter((value, index, self) => self.indexOf(value) === index);

    let airlines = data
      .map(value => value.FlightSegments[0].AirLineName)
      .filter((value, index, self) => self.indexOf(value) === index);

    let connectingLocations = data
      .map(value =>
        value.FlightSegments.filter((el, i) => i != 0).map(el => el.IntDepartureAirportName)
      )
      .reduce((total, value) => [...total, ...value])
      .filter((value, index, self) => self.indexOf(value) === index);

    let priceArray = data.map(value => value.FareDetails.TotalFare);
    let price = [Math.min(...priceArray), Math.max(...priceArray)];

    this.setState({
      filters: {
        ...this.state.filters,
        stops,
        fareType,
        airlines,
        connectingLocations,
        maxArrivalTime,
        minArrivalTime
      }
    });
    console.log(stops, fareType, airlines, connectingLocations, price);
  }

  _setcheckBox = index => {
    let newData = Object.assign([], this.state.stops);
    newData[index].checkBox = true;
    this.setState({
      stops: newData
    });
  };

  changeActiveTab = index => () => {
    this.setState({ index });
  };

  render() {
    const { filterTabs, index, filters } = this.state;
    return (
      <>
        <View style={{ flexDirection: "row", alignItems: "center", height: 56 }}>
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
          <View style={{ flex: 3 }}>
            {index == 0 && (
              <ScrollView>
                {filters.stops.map((item, index) => (
                  <CheckBox label={item + " Stop(s)"} />
                ))}
              </ScrollView>
            )}
            {index == 1 && (
              <ScrollView>
                {filters.fareType.map((item, index) => (
                  <CheckBox label={item} />
                ))}
              </ScrollView>
            )}
            {index == 2 && (
              <ScrollView>
                {filters.airlines.map((item, index) => (
                  <CheckBox label={item} />
                ))}
              </ScrollView>
            )}
            {index == 3 && (
              <ScrollView>
                {filters.connectingLocations.map((item, index) => (
                  <CheckBox label={item} />
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  _mainCheckBoxView: { marginHorizontal: 16 },
  _singleItemView: { flexDirection: "row", alignItems: "center" },
  filterTabs: {
    width: "100%",
    padding: 16
  }
});

export default Filter;
