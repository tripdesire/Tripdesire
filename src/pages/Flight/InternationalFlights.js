import React from "react";
import { View, Image, StyleSheet, Picker, Modal } from "react-native";
import { withNavigation } from "react-navigation";
import { Button, Text, AutoCompleteModal } from "../../components";
import moment from "moment";
import DateTimePicker from "react-native-modal-datetime-picker";
import Icon from "react-native-vector-icons/Ionicons";
import RNPickerSelect from "react-native-picker-select";
import Toast from "react-native-simple-toast";
import AddPassengers from "./AddPassengers";

class InternationalFlights extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      class: "E",
      index: 0,
      className: [
        { value: "E", label: "Economy" },
        { value: "PE", label: "Premium Economy" },
        { value: "B", label: "Business" },
        { value: "F", label: "First Class" }
      ],
      suggestions: [],
      passengers: 1,
      flightType: 2,
      tripType: 1,
      adult: 1,
      children: 0,
      infants: 0,
      modalFrom: false,
      modalTo: false,
      modalPassengers: false,
      from: "DXB, Dubai",
      to: "SFO, San Francisco",
      sourceName: "Dubai",
      destinationName: "San Francisco",
      fromCode: "DXB",
      ToCode: "SFO",
      sourceAirportName: "Dubai, United Arab Emirates - (DXB) - Dubai",
      destinationAirportName: "San Francisco, Unites State - (SFO) - San Francisco International",
      Journey_date: new Date(),
      Return_date: new Date(),
      mode: "date",
      show: false,
      showTo: false,
      backgroundColor_domestic: "#5B89F9",
      Button_text_color_domestic: "#FFFFFF",
      Button_text_color_international: "#000000",
      backgroundColor_international: "#FFFFFF",
      tripTypeColorOneway: "#5D666D",
      tripTypeColorRound: "#BDC4CA",
      selectRound: false,
      fromDTpicker: false,
      toDTpicker: false
    };
  }

  setDate = (event, date) => {
    date = date || this.state.Journey_date;
    this.setState({
      show: Platform.OS === "ios" ? true : false,
      Journey_date: date
    });
  };

  setDateTo = (event, date) => {
    date = date || this.state.Return_date;
    this.setState({
      showTo: Platform.OS === "ios" ? true : false,
      Return_date: date
    });
  };

  show = mode => () => {
    this.setState({
      show: true,
      mode
    });
  };

  showTo = mode => () => {
    this.setState({
      showTo: true,
      mode
    });
  };

  setModalVisible = (key, visible) => () => {
    this.setState({ [key]: visible });
  };

  setPassengers = () => {
    this.setState({ modalPassengers: true });
  };

  _SelectTripType = value => {
    this.setState({
      tripTypeColorOneway: value == "oneway" ? "#5D666D" : "#BDC4CA",
      tripTypeColorRound: value == "oneway" ? "#BDC4CA" : "#5D666D",
      tripType: value == "oneway" ? 1 : 2,
      selectRound: value == "round" ? true : false
    });
  };

  submit = value => {
    this.setState({ ...value, modalPassengers: false });
  };

  showDateTimePicker = key => () => {
    this.setState({ [key]: true });
  };

  hideDateTimePicker = key => () => {
    this.setState({ [key]: false });
  };

  handleDatePicked = key => date => {
    let data = {};
    if (key == "fromDTpicker") {
      data.Journey_date = date;
      data.Return_date = date;
    } else {
      data.Return_date = date;
    }
    this.setState(data);
    this.hideDateTimePicker(key)();
  };

  handleFrom = item => {
    this.setState({
      from: item.AirportCode + ", " + item.City,
      modalFrom: false,
      fromCode: item.AirportCode,
      sourceName: item.City,
      sourceAirportName:
        item.City + ", " + item.Country + "- (" + item.AirportCode + ") - " + item.AirportDesc
    });
  };
  handleTo = item => {
    this.setState({
      to: item.AirportCode + ", " + item.City,
      modalTo: false,
      ToCode: item.AirportCode,
      destinationName: item.City,
      destinationAirportName:
        item.City + ", " + item.Country + "- (" + item.AirportCode + ") - " + item.AirportDesc
    });
  };

  _search = () => {
    let jd = moment(this.state.Journey_date).format("DD-MM-YYYY");
    let rd = moment(this.state.Return_date).format("DD-MM-YYYY");
    let params = {
      source: this.state.fromCode,
      destination: this.state.ToCode,
      sourceName: this.state.sourceName,
      destinationName: this.state.destinationName,
      journeyDate: jd,
      returnDate: this.state.tripType == 2 ? rd : "",
      tripType: this.state.tripType,
      flightType: 2,
      adults: this.state.adult,
      children: this.state.children,
      infants: this.state.infants,
      travelClass: this.state.class,
      className: this.state.className[this.state.index].label,
      destinationAirportName: this.state.destinationAirportName,
      sourceAirportName: this.state.sourceAirportName,
      userType: 5
    };
    console.log(params);
    console.log(this.state.tripType);
    if (this.state.adult >= this.state.infants) {
      if (this.state.tripType == 1) {
        this.props.navigation.navigate("FlightsInfoOneway", params);
      } else if (this.state.tripType == 2) {
        this.props.navigation.navigate("FlightsInfoRoundInt", params);
      }
    } else {
      Toast.show("Infants should be less than adult", Toast.SHORT);
    }
  };

  render() {
    const {
      from,
      to,
      Journey_date,
      Return_date,
      fromDTpicker,
      toDTpicker,
      adult,
      children,
      infants,
      tripTypeColorOneway,
      tripTypeColorRound,
      selectRound
    } = this.state;
    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginVertical: 16
          }}>
          <Image
            style={{
              width: 20,
              resizeMode: "contain",
              marginHorizontal: 5,
              alignSelf: "center"
            }}
            source={require("../../assets/imgs/white-arrow-left-side.png")}
          />
          <Button
            style={{ justifyContent: "center" }}
            onPress={() => this._SelectTripType("oneway")}>
            <Text style={{ color: tripTypeColorOneway }}>One Way</Text>
          </Button>
          <Image
            style={{ width: 25, resizeMode: "contain", marginHorizontal: 5 }}
            source={require("../../assets/imgs/Round-trip-arrow.png")}
          />
          <Button
            style={{ justifyContent: "center" }}
            onPress={() => this._SelectTripType("round")}>
            <Text style={{ color: tripTypeColorRound }}>Round Trip</Text>
          </Button>
        </View>
        <View style={{ margin: 16, flexDirection: "row", alignItems: "center" }}>
          <Image
            style={{ width: 25, resizeMode: "contain" }}
            source={require("../../assets/imgs/flights-1.png")}
          />
          <Button
            style={{ flex: 1, paddingStart: 20 }}
            onPress={this.setModalVisible("modalFrom", true)}>
            <Text style={{ color: "#5D666D" }}>From: </Text>
            <Text style={{ color: "#5D666D" }}>{from}</Text>
          </Button>
          <Button
            style={{ flex: 1, paddingStart: 20 }}
            onPress={this.setModalVisible("modalTo", true)}>
            <Text style={{ color: "#5D666D" }}>To:</Text>
            <Text style={{ color: "#5D666D" }}>{to}</Text>
          </Button>
        </View>

        <View style={{ height: 1, backgroundColor: "#DDDDDD", marginHorizontal: 20 }} />

        <View style={{ margin: 16, flexDirection: "row", alignItems: "center" }}>
          <Image
            style={{ width: 25, resizeMode: "contain" }}
            source={require("../../assets/imgs/cal.png")}
          />
          <Button
            style={{ flex: 1, paddingStart: 20 }}
            onPress={this.showDateTimePicker("fromDTpicker")}>
            <Text style={{ color: "#5D666D" }}>Depart </Text>
            <Text>{moment(Journey_date).format("DD-MMM-YYYY")}</Text>
            <DateTimePicker
              isVisible={fromDTpicker}
              date={Journey_date}
              onConfirm={this.handleDatePicked("fromDTpicker")}
              onCancel={this.hideDateTimePicker("fromDTpicker")}
              minimumDate={new Date()}
            />
          </Button>
          {selectRound && (
            <Button
              style={{ flex: 1, paddingStart: 20 }}
              onPress={this.showDateTimePicker("toDTpicker")}>
              <Text style={{ color: "#5D666D" }}>Return</Text>
              <Text>{moment(Return_date).format("DD-MMM-YYYY")}</Text>
              <DateTimePicker
                isVisible={toDTpicker}
                date={Return_date}
                onConfirm={this.handleDatePicked("toDTpicker")}
                onCancel={this.hideDateTimePicker("toDTpicker")}
                minimumDate={this.state.Journey_date}
              />
            </Button>
          )}
        </View>

        <View style={{ height: 1, backgroundColor: "#DDDDDD", marginHorizontal: 20 }} />

        <View style={{ margin: 16, flexDirection: "row", alignItems: "center" }}>
          <Image
            style={{ width: 25, resizeMode: "contain" }}
            source={require("../../assets/imgs/person.png")}
          />
          <View style={{ flex: 1, paddingStart: 20 }}>
            <Text style={{ color: "#5D666D" }}>Passengers:</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "#5D666D" }}>
                {adult > 0 ? adult + " Adults" : ""}
                {children > 0 ? ", " + children + " Children" : ""}
                {infants > 0 ? ", " + infants + " Infants" : ""}
              </Text>
              <Button
                style={{
                  backgroundColor: "#F68E1F",
                  height: 25,
                  width: 70,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 12
                }}
                onPress={this.setPassengers}>
                <Text style={{ color: "#fff", paddingHorizontal: 15 }}>ADD</Text>
              </Button>
            </View>
          </View>
          <View style={{ flex: 1, paddingStart: 20 }}>
            <Text style={{ color: "#5D666D" }}>Class</Text>
            <RNPickerSelect
              useNativeAndroidPickerStyle={false}
              placeholder={{}}
              value={this.state.class}
              style={{
                inputIOS: {
                  fontSize: 18,
                  fontWeight: "600",
                  color: "#5D666D"
                },
                inputAndroid: {
                  padding: 0,
                  height: 20,
                  fontSize: 18,
                  fontWeight: "600",
                  color: "#5D666D"
                }
              }}
              onValueChange={(itemValue, index) =>
                this.setState({ class: itemValue, index: index })
              }
              items={this.state.className}
              Icon={() => <Icon name="ios-arrow-down" size={20} />}
            />
          </View>
        </View>
        <Button
          style={{
            backgroundColor: "#F68E1F",
            marginHorizontal: 100,
            height: 40,
            justifyContent: "center",
            borderRadius: 20,
            marginVertical: 40
          }}
          onPress={this._search}>
          <Text style={{ color: "#fff", alignSelf: "center" }}>Search</Text>
        </Button>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalPassengers}
          onRequestClose={this.setModalVisible("modalPassengers", false)}>
          <AddPassengers
            submit={this.submit}
            adultCount={this.state.adult}
            childrenCount={this.state.children}
            infantsCount={this.state.infants}
            onModalBackPress={this.setModalVisible("modalPassengers", false)}
          />
        </Modal>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalFrom}
          onRequestClose={this.setModalVisible("modalFrom", false)}>
          <AutoCompleteModal
            placeholder="Enter Source"
            //visible={this.state.modalFrom}
            type="internationalFlight"
            onChange={this.handleFrom}
            onModalBackPress={this.setModalVisible("modalFrom", false)}
          />
        </Modal>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalTo}
          onRequestClose={this.setModalVisible("modalTo", false)}>
          <AutoCompleteModal
            placeholder="Enter Destination"
            //visible={this.state.modalTo}
            type="internationalFlight"
            onChange={this.handleTo}
            onModalBackPress={this.setModalVisible("modalTo", false)}
          />
        </Modal>
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

export default withNavigation(InternationalFlights);
