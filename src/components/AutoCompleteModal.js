import React from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView } from "react-native";
import Button from "./Button";
import Text from "./TextComponent";
import ActivityIndicator from "./ActivityIndicator";
import { etravosApi, domainApi } from "../service";
import Autocomplete from "react-native-autocomplete-input";
import Toast from "react-native-simple-toast";
import Icon from "./IconNB";
import {
  DomSugg,
  IntSugg,
  DomHotelSugg,
  intHotelSugg,
  BusSugg,
  CabSugg,
  hotelCountrySugg
} from "../store/action";
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
      case "intHotel":
        data = { filteredList: this.props.intHotelSuggestion };
        break;
      case "hotelCountry":
        data = { filteredList: this.props.hotelCountries };
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
      country,
      domesticSuggestion,
      internationalSuggestion,
      domesticHotelSuggestion,
      hotelCountries,
      intHotelSuggestion,
      busSuggestion,
      cabSuggestion
    } = this.props;

    switch (type) {
      case "domesticFlight":
        console.log("domestic");

        if (domesticSuggestion.length == 0) {
          this.setState({ loader: true });
          etravosApi
            .get("/Flights/Airports?flightType=1")
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
          etravosApi
            .get("/Flights/Airports?flightType=2")
            .then(({ data }) => {
              this.props.intHotelSuggestion(data);
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
          etravosApi
            .get("Hotels/Cities?hoteltype=1")
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
      case "hotelCountry":
        console.log("here");
        if (hotelCountries.length == 0) {
          this.setState({ loader: true });
          domainApi
            .get("/country/contry-list")
            .then(({ data }) => {
              this.props.hotelCountrySugg(data);
              this.setState({ loader: false, filteredList: data });
            })
            .catch(err => {
              Toast.show(err, Toast.LONG);
              this.setState({ loader: false });
            });
        }
        break;
      case "intHotel":
        //if (intHotelSuggestion.length == 0) {
        this.setState({ loader: true });
        domainApi
          .post("/country/contry-list", { country: country })
          .then(({ data }) => {
            data = data.map(item => ({ CityId: item.city_id, CityName: item.city_name }));
            this.props.intHotelSugg(data);
            this.setState({ loader: false, filteredList: data });
          })
          .catch(err => {
            Toast.show(err, Toast.LONG);
            this.setState({ loader: false });
          });
        //}
        break;
      case "bus":
        if (busSuggestion.length == 0) {
          this.setState({ loader: true });
          etravosApi
            .get("/Buses/Sources")
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
          etravosApi
            .get("/Cabs/Cities")
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
      intHotelSuggestion,
      hotelCountries,
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
      case "intHotel":
        filteredList = intHotelSuggestion.filter(item =>
          item.CityName.toLowerCase().includes(text.toLowerCase())
        );
        break;
      case "hotelCountry":
        filteredList = hotelCountries.filter(item =>
          item.toLowerCase().includes(text.toLowerCase())
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
      case "intHotel":
        text = item.CityName + ", " + item.CityId;
        break;
      case "hotelCountry":
        text = item;
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
      case "domesticHotel":
        return "hotel_" + item.CityName + item.CityId;
      case "intHotel":
        return "hotel_" + item.CityName + item.CityId;
      case "hotelCountry":
        return "hotel_" + item;
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
  cabSuggestion: state.cabSuggestion,
  intHotelSuggestion: state.intHotelSuggestion,
  hotelCountries: state.hotelCountries
});

const mapDispatchToProps = {
  DomSugg,
  IntSugg,
  DomHotelSugg,
  intHotelSugg,
  BusSugg,
  CabSugg,
  hotelCountrySugg
};

export default connect(mapStateToProps, mapDispatchToProps)(AutoCompleteModal);
