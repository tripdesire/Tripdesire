import React, { PureComponent } from "react";
import { View, Image, StyleSheet, ScrollView } from "react-native";
import { Button, Text } from "../../components";
import Service from "../../service";
import Autocomplete from "react-native-autocomplete-input";
//import RNDateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import { connect } from "react-redux";
import { Header, Icon } from "../../components";
//import CheckBox from "@react-native-community/checkbox";
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
      filters: [
        "Stops",
        "Fare Type",
        "Airlines",
        "Connecting Locations",
        "Price",
        "Depature",
        "Arrival"
      ],
      index: 0
    };
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
    const { filters } = this.state;
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
            {this.state.filters.map((item, index) => (
              <Button
                style={[
                  styles.filterTabs,
                  index == this.state.index ? { backgroundColor: "#FFFFFF" } : null
                ]}
                key={"filter_" + item + index}
                onPress={this.changeActiveTab(index)}>
                <Text>{item}</Text>
              </Button>
            ))}
          </View>
          <View style={{ flex: 3 }}>
            <ScrollView></ScrollView>
          </View>
        </View>
        {/* <ScrollView contentContainerStyle={{ flexDirection: "row" }}>
          <View>
            <Button onPress={this._Stop}>
              <Text style={styles.filterTabs}>Stops</Text>
            </Button>
            <Button onPress={this._fareType}>
              <Text style={styles.filterTabs}>Fare Type</Text>
            </Button>
            <Button onPress={this._Airline}>
              <Text style={styles.filterTabs}>Airlines</Text>
            </Button>
            <Button onPress={this._Location}>
              <Text style={styles.filterTabs}>Connecting Locations</Text>
            </Button>
            <Button onPress={this._Price}>
              <Text style={styles.filterTabs}>Price</Text>
            </Button>
            <Button onPress={this._Departure}>
              <Text style={styles.filterTabs}>Depature</Text>
            </Button>
            <Button onPress={this._Arrival}>
              <Text style={styles.filterTabs}>Arrival</Text>
            </Button>
          </View>
          <View>
            {this.state.stop == true && (
              <View style={styles._mainCheckBoxView}>
                <Text style={styles.filterTabs}>Stops</Text>
                {[...Array(2)].map((e, index) => (
                  <View style={styles._singleItemView} key={index}>
                    <Text>{index} Stop(s)</Text>
                  </View>
                ))}
              </View>
            )}
            {this.state.fareType == true && (
              <View style={[styles._mainCheckBoxView, { marginTop: 10 }]}>
                <Text style={styles.filterTabs}>Fare Type</Text>
                <View style={styles._singleItemView}>
                  
                  <Text>Refundable</Text>
                </View>
                <View style={styles._singleItemView}>
                  <Text>Non-Refundable</Text>
                </View>
              </View>
            )}
            {this.state.airline == true && (
              <View style={[styles._mainCheckBoxView, { marginTop: 10 }]}>
                <Text style={styles.filterTabs}>Airlines</Text>
                <View style={styles._singleItemView}>
                  <Text>Indigo</Text>
                </View>
                <View style={styles._singleItemView}>
                  <Text>Air India</Text>
                </View>
              </View>
            )}
            {this.state.location == true && (
              <View style={[styles._mainCheckBoxView, { marginTop: 10 }]}>
                <Text style={styles.filterTabs}>Connecting Locations</Text>
                <View style={styles._singleItemView}>
                  <Text>Kolkata</Text>
                </View>
                <View style={styles._singleItemView}>
                  <Text>Delhi</Text>
                </View>
              </View>
            )}
            {this.state.price == true && (
              <View style={[styles._mainCheckBoxView, { marginTop: 10 }]}>
                <Text style={styles.filterTabs}>Price</Text>
                <View style={styles._singleItemView}>
                  <Text>Kolkata</Text>
                </View>
                <View style={styles._singleItemView}>
                  <Text>Delhi</Text>
                </View>
              </View>
            )}
            {this.state.departure == true && (
              <View style={[styles._mainCheckBoxView, { marginTop: 10 }]}>
                <Text style={styles.filterTabs}>Departure</Text>
                <View style={styles._singleItemView}>
                  <Text>Kolkata</Text>
                </View>
                <View style={styles._singleItemView}>
                  <Text>Delhi</Text>
                </View>
              </View>
            )}
            {this.state.arrival == true && (
              <View style={[styles._mainCheckBoxView, { marginTop: 10 }]}>
                <Text style={styles.filterTabs}>Arrival</Text>
                <View style={styles._singleItemView}>
                  <Text>Kolkata</Text>
                </View>
                <View style={styles._singleItemView}>
                  <Text>Delhi</Text>
                </View>
              </View>
            )} 
          </View>
        </ScrollView> */}
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
