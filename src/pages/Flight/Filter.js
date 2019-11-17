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
      stop: false,
      fareType: false,
      airline: false,
      location: false,
      price: false,
      departure: false,
      arrival: false
    };
  }

  _setcheckBox = index => {
    let newData = Object.assign([], this.state.stops);
    newData[index].checkBox = true;
    this.setState({
      stops: newData
    });
  };

  _Stop = () => {
    this.setState({
      stop: this.state.stop == false ? !this.state.stop : !this.state.stop,
      fareType: false,
      airline: false,
      location: false,
      price: false,
      departure: false,
      arrival: false
    });
  };

  _fareType = () => {
    this.setState({
      fareType: this.state.fareType == false ? !this.state.fareType : !this.state.fareType,
      stop: false,
      airline: false,
      location: false,
      price: false,
      departure: false,
      arrival: false
    });
  };

  _Airline = () => {
    this.setState({
      airline: this.state.airline == false ? !this.state.airline : !this.state.airline,
      stop: false,
      fareType: false,
      location: false,
      price: false,
      departure: false,
      arrival: false
    });
  };

  _Location = () => {
    this.setState({
      location: this.state.location == false ? !this.state.location : !this.state.location,
      fareType: false,
      stop: false,
      airline: false,
      price: false,
      departure: false,
      arrival: false
    });
  };

  _Price = () => {
    this.setState({
      price: this.state.price == false ? !this.state.price : !this.state.price,
      fareType: false,
      stop: false,
      location: false,
      airline: false,
      departure: false,
      arrival: false
    });
  };

  _Departure = () => {
    this.setState({
      departure: this.state.departure == false ? !this.state.departure : !this.state.departure,
      fareType: false,
      stop: false,
      location: false,
      airline: false,
      price: false,
      arrival: false
    });
  };

  _Arrival = () => {
    this.setState({
      arrival: this.state.arrival == false ? !this.state.arrival : !this.state.arrival,
      fareType: false,
      stop: false,
      location: false,
      airline: false,
      price: false,
      departure: false
    });
  };

  render() {
    return (
      <View animationType="slide" transparent={false} visible={this.props.visible}>
        <View style={{ flexDirection: "row", alignItems: "center", height: 56 }}>
          <Button
            onPress={this.props.onModalBackPress}
            style={{ alignItems: "center", justifyContent: "center", height: 48, width: 48 }}>
            <Icon name="md-arrow-back" size={24} />
          </Button>
          <View>
            <Text style={{ fontWeight: "700", fontSize: 16 }}>Add Filter</Text>
          </View>
        </View>
        <ScrollView contentContainerStyle={{ flexDirection: "row" }}>
          <View>
            <Button onPress={this._Stop}>
              <Text style={styles._filterHeading}>Stops</Text>
            </Button>
            <Button onPress={this._fareType}>
              <Text style={styles._filterHeading}>Fare Type</Text>
            </Button>
            <Button onPress={this._Airline}>
              <Text style={styles._filterHeading}>Airlines</Text>
            </Button>
            <Button onPress={this._Location}>
              <Text style={styles._filterHeading}>Connecting Locations</Text>
            </Button>
            <Button onPress={this._Price}>
              <Text style={styles._filterHeading}>Price</Text>
            </Button>
            <Button onPress={this._Departure}>
              <Text style={styles._filterHeading}>Depature</Text>
            </Button>
            <Button onPress={this._Arrival}>
              <Text style={styles._filterHeading}>Arrival</Text>
            </Button>
          </View>
          <View>
            {this.state.stop == true && (
              <View style={styles._mainCheckBoxView}>
                <Text style={styles._filterHeading}>Stops</Text>
                {[...Array(2)].map((e, index) => (
                  <View style={styles._singleItemView} key={index}>
                    {/* <CheckBox
                      value={this.state.stops[index].checkBox}
                      // onChange={this._setcheckBox(index)}
                    /> */}
                    <Text>{index} Stop(s)</Text>
                  </View>
                ))}
              </View>
            )}
            {this.state.fareType == true && (
              <View style={[styles._mainCheckBoxView, { marginTop: 10 }]}>
                <Text style={styles._filterHeading}>Fare Type</Text>
                <View style={styles._singleItemView}>
                  {/* <CheckBox value={this.state.zeroStop} /> */}
                  <Text>Refundable</Text>
                </View>
                <View style={styles._singleItemView}>
                  {/* <CheckBox value={this.state.zeroStop} /> */}
                  <Text>Non-Refundable</Text>
                </View>
              </View>
            )}
            {this.state.airline == true && (
              <View style={[styles._mainCheckBoxView, { marginTop: 10 }]}>
                <Text style={styles._filterHeading}>Airlines</Text>
                <View style={styles._singleItemView}>
                  {/* <CheckBox value={this.state.zeroStop} /> */}
                  <Text>Indigo</Text>
                </View>
                <View style={styles._singleItemView}>
                  {/* <CheckBox value={this.state.zeroStop} /> */}
                  <Text>Air India</Text>
                </View>
              </View>
            )}
            {this.state.location == true && (
              <View style={[styles._mainCheckBoxView, { marginTop: 10 }]}>
                <Text style={styles._filterHeading}>Connecting Locations</Text>
                <View style={styles._singleItemView}>
                  {/* <CheckBox value={this.state.zeroStop} /> */}
                  <Text>Kolkata</Text>
                </View>
                <View style={styles._singleItemView}>
                  {/* <CheckBox value={this.state.zeroStop} /> */}
                  <Text>Delhi</Text>
                </View>
              </View>
            )}
            {this.state.price == true && (
              <View style={[styles._mainCheckBoxView, { marginTop: 10 }]}>
                <Text style={styles._filterHeading}>Price</Text>
                <View style={styles._singleItemView}>
                  {/* <CheckBox value={this.state.zeroStop} /> */}
                  <Text>Kolkata</Text>
                </View>
                <View style={styles._singleItemView}>
                  {/* <CheckBox value={this.state.zeroStop} /> */}
                  <Text>Delhi</Text>
                </View>
              </View>
            )}
            {this.state.departure == true && (
              <View style={[styles._mainCheckBoxView, { marginTop: 10 }]}>
                <Text style={styles._filterHeading}>Departure</Text>
                <View style={styles._singleItemView}>
                  {/* <CheckBox value={this.state.zeroStop} /> */}
                  <Text>Kolkata</Text>
                </View>
                <View style={styles._singleItemView}>
                  {/* <CheckBox value={this.state.zeroStop} /> */}
                  <Text>Delhi</Text>
                </View>
              </View>
            )}
            {this.state.arrival == true && (
              <View style={[styles._mainCheckBoxView, { marginTop: 10 }]}>
                <Text style={styles._filterHeading}>Arrival</Text>
                <View style={styles._singleItemView}>
                  {/* <CheckBox value={this.state.zeroStop} /> */}
                  <Text>Kolkata</Text>
                </View>
                <View style={styles._singleItemView}>
                  {/* <CheckBox value={this.state.zeroStop} /> */}
                  <Text>Delhi</Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  _mainCheckBoxView: { marginHorizontal: 16 },
  _singleItemView: { flexDirection: "row", alignItems: "center" },
  _filterHeading: { fontWeight: "700", fontSize: 16, padding: 5 }
});

export default Filter;
