import React from "react";
import { View, Image, Modal } from "react-native";
import { withNavigation } from "react-navigation";
import { Button, Text, AutoCompleteModal, Icon } from "../../components";
import AddPassengers from "./AddPassengers";
import DateTimePicker from "react-native-modal-datetime-picker";
import RNPickerSelect from "react-native-picker-select";
import moment from "moment";
import Toast from "react-native-simple-toast";

class DomesticFlights extends React.PureComponent {
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
      flightType: 1,
      tripType: 1,
      adult: 1,
      children: 0,
      infants: 0,
      modalFrom: false,
      modalTo: false,
      modalPassengers: false,
      from: "HYD, Hyderabad",
      to: "BLR, Bangalore",
      sourceName: "Hyderabad",
      sourceAirportName: "Hyderabad, India - (HYD) - Rajiv Gandhi Airpot",
      destinationAirportName: "Bangalore, India - (BLR) - Bangalore International Airpot",
      destinationName: "Bangalore",
      fromCode: "HYD",
      ToCode: "BLR",
      Journey_date: new Date(),
      Return_date: new Date(),
      tripTypeColorOneway: "#000000",
      tripTypeColorRound: "#5D666D",
      selectRound: false,
      fromDTpicker: false,
      toDTpicker: false
    };
  }

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

  setModalVisible = (key, visible) => () => {
    this.setState({ [key]: visible });
  };

  setPassengers = () => {
    this.setState({ modalPassengers: true });
  };

  _SelectTripType = value => {
    this.setState({
      tripTypeColorOneway: value == "oneway" ? "#000000" : "#BDC4CA",
      tripTypeColorRound: value == "oneway" ? "#BDC4CA" : "#000000",
      tripType: value == "oneway" ? 1 : 2,
      selectRound: value == "round" ? true : false
    });
  };

  submit = value => {
    this.setState({ ...value, modalPassengers: false });
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
      flightType: 1,
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
    if (this.state.adult >= this.state.infants) {
      if (this.state.tripType == 1) {
        this.props.navigation.navigate("FlightsInfoOneway", params);
      } else if (this.state.tripType == 2) {
        this.props.navigation.navigate("FlightsInfoRound", params);
      }
    } else {
      Toast.show("Infants should be less than adult", Toast.SHORT);
    }
  };

  render() {
    const {
      from,
      to,
      tripTypeColorOneway,
      tripTypeColorRound,
      selectRound,
      fromDTpicker,
      toDTpicker,
      Journey_date,
      Return_date,
      className,
      adult,
      children,
      infants
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
            <Text style={{ color: tripTypeColorOneway, fontWeight: "600", fontSize: 14 }}>
              One Way
            </Text>
          </Button>
          <Image
            style={{ width: 25, resizeMode: "contain", marginHorizontal: 5 }}
            source={require("../../assets/imgs/Round-trip-arrow.png")}
          />
          <Button
            style={{ justifyContent: "center" }}
            onPress={() => this._SelectTripType("round")}>
            <Text style={{ color: tripTypeColorRound, fontWeight: "600", fontSize: 14 }}>
              Round Trip
            </Text>
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
            <Text style={{ color: "#5D666D", fontSize: 18, fontWeight: "600" }}>{from}</Text>
          </Button>
          <Button
            style={{ flex: 1, paddingStart: 20 }}
            onPress={this.setModalVisible("modalTo", true)}>
            <Text style={{ color: "#5D666D" }}>To:</Text>
            <Text style={{ color: "#5D666D", fontSize: 18, fontWeight: "600" }}>{to}</Text>
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
            <Text style={{ color: "#5D666D", fontSize: 18, fontWeight: "600" }}>
              {moment(Journey_date).format("DD-MMM-YYYY")}
            </Text>
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
              <Text style={{ color: "#5D666D", fontSize: 18, fontWeight: "600" }}>
                {moment(Return_date).format("DD-MMM-YYYY")}
              </Text>
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
          <Button
            style={{ flex: 1, paddingStart: 20 }}
            onPress={this.setModalVisible("modalPassengers", true)}>
            <Text style={{ color: "#5D666D" }}>Passengers:</Text>

            <Text style={{ color: "#5D666D", fontSize: 18, fontWeight: "600" }}>
              {adult > 0 ? adult + " Adults" : ""}
              {children > 0 ? ", " + children + " Children" : ""}
              {infants > 0 ? ", " + infants + " Infants" : ""}
            </Text>
          </Button>
          <View style={{ flex: 1, paddingStart: 20 }}>
            <Text style={{ color: "#5D666D" }}>Class</Text>
            <RNPickerSelect
              useNativeAndroidPickerStyle={false}
              itemstyle={{ fontWeight: "700", fontSize: 24 }}
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
              items={className}
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
            type="domesticFlight"
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
            type="domesticFlight"
            onChange={this.handleTo}
            onModalBackPress={this.setModalVisible("modalTo", false)}
          />
        </Modal>
      </View>
    );
  }
}

export default withNavigation(DomesticFlights);
