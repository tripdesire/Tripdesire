import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Button from "./Button";
import Text from "./TextComponent";
import Activity_Indicator from "./Activity_Indicator";
import Service from "../service";
import Autocomplete from "react-native-autocomplete-input";
import Icon from "./IconNB";
import { DomSugg, IntSugg, DomHotelSugg } from "../store/action";
import { connect } from "react-redux";

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
      domesticHotelSuggestion
    } = this.props;
    switch (type) {
      case "domesticFlight":
        if (domesticSuggestion.length == 0) {
          this.setState({ loader: true });
          Service.get("/Flights/Airports?flightType=1")
            .then(({ data }) => {
              this.props.DomSugg(data);
              this.setState({ loader: false, filteredList: data });
            })
            .catch(err => {
              console.log(err);
              this.setState({ loader: false });
            });
        }
        break;

      case "internationalFlight":
        if (internationalSuggestion.length == 0) {
          this.setState({ loader: true });
          Service.get("/Flights/Airports?flightType=2")
            .then(({ data }) => {
              this.props.IntSugg(data);
              this.setState({ loader: false, filteredList: data });
            })
            .catch(err => {
              console.log(err);
              this.setState({ loader: false });
            });
        }
        break;
      case "domesticHotel":
        if (domesticHotelSuggestion.length == 0) {
          this.setState({ loader: true });
          Service.get("Hotels/Cities?hoteltype=1")
            .then(({ data }) => {
              this.props.DomHotelSugg(data);
              this.setState({ loader: false, filteredList: data });
            })
            .catch(err => {
              console.log(err);
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
      domesticHotelSuggestion
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
        <Text>{text}</Text>
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
    }
  };

  render() {
    return (
      // <Modal animationType="slide" transparent={false} visible={this.props.visible}>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Button
            onPress={this.props.onModalBackPress}
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: 48,
              width: 48
            }}>
            <Icon name="md-arrow-back" size={24} />
          </Button>
          <View style={styles.autocompleteContainer}>
            <Autocomplete
              placeholder={this.props.placeholder}
              inputContainerStyle={{
                borderWidth: 0,
                height: 48,
                justifyContent: "center"
              }}
              data={this.state.filteredList}
              onChangeText={this.filterList}
              listStyle={{
                maxHeight: 300,
                margin: 0,
                padding: 0,
                borderWidth: 0
              }}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
            />
          </View>
        </View>
        {this.state.loader && <Activity_Indicator />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  autocompleteContainer: {
    flex: 1,
    start: 48,
    position: "absolute",
    end: 0,
    top: 0,
    zIndex: 1
  }
});

const mapStateToProps = state => ({
  domesticSuggestion: state.domesticSuggestion,
  internationalSuggestion: state.internationalSuggestion,
  domesticHotelSuggestion: state.domesticHotelSuggestion
});

const mapDispatchToProps = {
  DomSugg,
  IntSugg,
  DomHotelSugg
};

export default connect(mapStateToProps, mapDispatchToProps)(AutoCompleteModal);
