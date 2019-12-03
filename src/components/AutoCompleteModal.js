import React from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView } from "react-native";
import Button from "./Button";
import Text from "./TextComponent";
import ActivityIndicator from "./ActivityIndicator";
 import {etravosApi}  from "../service";
import Autocomplete from "react-native-autocomplete-input";
import Toast from "react-native-simple-toast";
import Icon from "./IconNB";
import { DomSugg, IntSugg, DomHotelSugg, BusSugg, CabSugg } from "../store/action";
import { connect } from "react-redux";

const { height } = Dimensions.get("window");

class AutoCompleteModal extends React.PureComponent {
  constructor(props) {
    super(props);
    let data = {};
    switch (props.type) {
      case "domesticFlight":
        data = { filteredList: this.props.domesticSuggestion };
        break;
      case "internationalFlight":
        data = { filteredList: this.props.internationalSuggestion };
        break;
      case "domesticHotel":
        data = { filteredList: this.props.domesticHotelSuggestion };
        break;
      case "bus":
        data = { filteredList: this.props.busSuggestion };
        break;
      case "cab":
        data = { filteredList: this.props.cabSuggestion };
        break;
    }

    this.state = {
      ...data,
      loader: false
    };
  }

  componentDidMount() {
    const {
      type,
      domesticSuggestion,
      internationalSuggestion,
      domesticHotelSuggestion,
      busSuggestion,
      cabSuggestion
    } = this.props;

    switch (type) {
      case "domesticFlight":
        if (domesticSuggestion.length == 0) {
          this.setState({ loader: true });
          etravosApi.get("/Flights/Airports?flightType=1")
            .then(({ data }) => {
              this.props.DomSugg(data);
              this.setState({ loader: false, filteredList: data });
            })
            .catch(err => {
              Toast.show(err, Toast.LONG);
              this.setState({ loader: false });
            });
        }
        break;

      case "internationalFlight":
        if (internationalSuggestion.length == 0) {
          this.setState({ loader: true });
          etravosApi.get("/Flights/Airports?flightType=2")
            .then(({ data }) => {
              this.props.IntSugg(data);
              this.setState({ loader: false, filteredList: data });
            })
            .catch(err => {
              Toast.show(err, Toast.LONG);
              this.setState({ loader: false });
            });
        }
        break;
      case "domesticHotel":
        if (domesticHotelSuggestion.length == 0) {
          this.setState({ loader: true });
          etravosApi.get("Hotels/Cities?hoteltype=1")
            .then(({ data }) => {
              this.props.DomHotelSugg(data);
              this.setState({ loader: false, filteredList: data });
            })
            .catch(err => {
              Toast.show(err, Toast.LONG);
              this.setState({ loader: false });
            });
        }
        break;

      case "bus":
        if (busSuggestion.length == 0) {
          this.setState({ loader: true });
          etravosApi.get("/Buses/Sources")
            .then(({ data }) => {
              this.props.BusSugg(data);
              this.setState({ loader: false, filteredList: data });
            })
            .catch(err => {
              Toast.show(err, Toast.LONG);
              this.setState({ loader: false });
            });
        }
        break;

      case "cab":
        if (cabSuggestion.length == 0) {
          this.setState({ loader: true });
          etravosApi.get("/Cabs/Cities")
            .then(({ data }) => {
              this.props.CabSugg(data);
              this.setState({ loader: false, filteredList: data });
            })
            .catch(err => {
              Toast.show(err, Toast.LONG);
              this.setState({ loader: false });
            });
        }
        break;
    }
  }

  filterList = text => {
    const {
      type,
      domesticSuggestion,
      internationalSuggestion,
      domesticHotelSuggestion,
      busSuggestion,
      cabSuggestion
    } = this.props;
    let filteredList = [];
    switch (type) {
      case "domesticFlight":
        filteredList = domesticSuggestion.filter(
          item =>
            item.AirportCode.toLowerCase().includes(text.toLowerCase()) ||
            item.City.toLowerCase().includes(text.toLowerCase())
        );
        break;
      case "internationalFlight":
        filteredList = internationalSuggestion.filter(
          item =>
            item.AirportCode.toLowerCase().includes(text.toLowerCase()) ||
            item.City.toLowerCase().includes(text.toLowerCase())
        );
        break;
      case "domesticHotel":
        filteredList = domesticHotelSuggestion.filter(item =>
          item.CityName.toLowerCase().includes(text.toLowerCase())
        );
        break;
      case "bus":
        filteredList = busSuggestion.filter(item =>
          item.Name.toLowerCase().includes(text.toLowerCase())
        );
        break;
      case "cab":
        filteredList = cabSuggestion.filter(item =>
          item.Name.toLowerCase().includes(text.toLowerCase())
        );
        break;
    }
    this.setState({ filteredList });
  };

  handleItemChange = item => () => {
    this.props.onChange && this.props.onChange(item);
  };

  renderItem = ({ item, i }) => {
    let text = "";
    switch (this.props.type) {
      case "domesticFlight":
      case "internationalFlight":
        text = item.City + "," + item.Country + "-(" + item.AirportCode + ")-" + item.AirportDesc;
        break;
      case "domesticHotel":
        text = item.CityName + ", " + item.CityId + " - (India)";
        break;
      case "bus":
        text = item.Name + ", " + item.Id + " - (India)";
        break;
      case "cab":
        text = item.Name + ", " + item.Id + " - (India)";
        break;
    }

    return (
      <TouchableOpacity
        style={{
          //backgroundColor: "#FFFFFF",
          //minHeight: 35,
          paddingStart: 8,
          marginVertical: 8,
          justifyContent: "center"
        }}
        onPress={this.handleItemChange(item)}>
        <Text style={{ flex: 1 }}>{text}</Text>
      </TouchableOpacity>
    );
  };

  keyExtractor = (item, index) => {
    switch (this.props.type) {
      case "domesticFlight":
      case "internationalFlight":
        return "flight_" + item.AirportCode + index;
        break;
      case "domesticHotel":
        return "hotel_" + item.CityName + item.CityId;
      case "bus":
        return "bus_" + item.Name + item.Id;
      case "cab":
        return "cab_" + item.Name + item.Id;
    }
  };

  render() {
    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "white" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "gray" }}>
          <View style={{ flex: 1, backgroundColor: "white" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Button
                onPress={this.props.onModalBackPress}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  height: 48,
                  width: 48,
                  zIndex: 1
                }}>
                <Icon name="md-arrow-back" size={24} />
              </Button>
              <View style={styles.autocompleteContainer}>
                <Autocomplete
                  placeholder={this.props.placeholder}
                  inputContainerStyle={{
                    borderWidth: 0,
                    height: 48,
                    paddingStart: 48,
                    justifyContent: "center"
                  }}
                  data={this.state.filteredList}
                  onChangeText={this.filterList}
                  listStyle={{
                    maxHeight: height,
                    margin: 0,
                    paddingHorizontal: 16,
                    borderWidth: 0
                  }}
                  renderItem={this.renderItem}
                  keyExtractor={this.keyExtractor}
                />
              </View>
            </View>
            {this.state.loader && <ActivityIndicator />}
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  autocompleteContainer: {
    flex: 1,
    start: 0,
    position: "absolute",
    end: 0,
    top: 0
  }
});

const mapStateToProps = state => ({
  domesticSuggestion: state.domesticSuggestion,
  internationalSuggestion: state.internationalSuggestion,
  domesticHotelSuggestion: state.domesticHotelSuggestion,
  busSuggestion: state.busSuggestion,
  cabSuggestion: state.cabSuggestion
});

const mapDispatchToProps = {
  DomSugg,
  IntSugg,
  DomHotelSugg,
  BusSugg,
  CabSugg
};

export default connect(mapStateToProps, mapDispatchToProps)(AutoCompleteModal);
