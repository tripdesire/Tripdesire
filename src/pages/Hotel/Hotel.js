import React from "react";
import { View, Image, StyleSheet, Modal, SafeAreaView } from "react-native";
import { Button, Text, AutoCompleteModal, Icon } from "../../components";
import Toast from "react-native-simple-toast";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import { Header } from "../../components";
import AddPassengers from "./AddPassengers";

class Hotel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      class: "E",
      cityId: "269",
      city: "Noida",
      place: "Noida, 269 - (India)",
      suggestions: [],
      country: "Select Country",
      _country: false,
      _place: false,
      CheckIn: new Date(),
      CheckOut: new Date(),
      adults: "1~0~0~0",
      adults_count: 1,
      children: "0~0~0~0",
      children_count: 0,
      childrenAges: "-1~-1~-1~-1~-1~-1~-1~-1",
      mode: "date",
      show_CheckIn: false,
      show_CheckOut: false,
      modalPassengers: false,
      room: 1,
      fromDTpicker: false,
      toDTpicker: false,
      hoteltype: 1
    };
  }

  goBack = () => {
    this.props.navigation.goBack(null);
  };

  _handle = async item => {
    await this.setState({
      place: item.CityName + ", " + item.CityId + (this.state.hoteltype == 1 ? " - (India)" : ""),
      cityId: item.CityId,
      city: item.CityName,
      _place: false
    });
  };
  _handleCountry = item => {
    this.setState({ country: item, _country: false });
  };

  countryOpen = () => {
    this.setState({ _country: true });
  };
  modalOpen = () => {
    if (this.state.country === "Select Country" && this.state.hoteltype == 2) {
      Toast.show("Select Country first", Toast.LONG);
    } else {
      this.setState({ _place: true });
    }
  };

  modalBackPress = () => {
    this.setState({ _place: false, _country: false });
  };

  setPassengers = () => {
    this.setState({ modalPassengers: true });
  };

  modalClose = () => {
    this.setState({ modalPassengers: false });
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
      data.CheckIn = date;
      data.CheckOut = date;
    } else {
      data.CheckOut = date;
    }
    this.setState(data);
    this.hideDateTimePicker(key)();
  };

  submit = value => {
    console.log(value);
    this.setState({
      modalPassengers: false,
      adults: value.data.map(item => item.adults).join("~")
        ? value.data.map(item => item.adults).join("~")
        : this.state.adults,
      adults_count: eval(value.data.map(item => item.adults).join("+"))
        ? eval(value.data.map(item => item.adults).join("+"))
        : this.state.adults_count,
      children: value.data.map(item => item.children).join("~")
        ? value.data.map(item => item.children).join("~")
        : this.state.children,
      children_count:
        eval(value.data.map(item => item.children).join("+")) >= 0
          ? eval(value.data.map(item => item.children).join("+"))
          : this.state.children_count,
      childrenAges: value.data
        .map(item => item.childAge)
        .reduce((total, currentValue) => total.concat(currentValue), [])
        .join("~")
        ? value.data
            .map(item => item.childAge)
            .reduce((total, currentValue) => total.concat(currentValue), [])
            .join("~")
        : this.state.childrenAges,
      room: value.room ? value.room : this.state.room
    });
  };

  _search = () => {
    let Difference_In_Time = this.state.CheckOut - this.state.CheckIn;
    let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24), 1);
    let params = {
      city: this.state.city,
      destinationId: this.state.cityId,
      arrivalDate: moment(this.state.CheckIn).format("DD-MM-YYYY"),
      departureDate: moment(this.state.CheckOut).format("DD-MM-YYYY"),
      rooms: 1,
      adults: this.state.adults,
      children: this.state.children,
      childrenAges: this.state.childrenAges,
      NoOfDays: Difference_In_Days,
      userType: 5,
      hoteltype: this.state.hoteltype,
      adults_count: this.state.adults_count,
      children_count: this.state.children_count,
      user: "",
      room: this.state.room
    };
    console.log(params);
    this.props.navigation.navigate("HotelInfo", params);
  };

  updateHotelType = val => () => {
    this.setState({ hoteltype: val });
  };

  render() {
    const {
      place,
      CheckIn,
      CheckOut,
      adults_count,
      children_count,
      room,
      fromDTpicker,
      toDTpicker,
      hoteltype,
      _country,
      country
    } = this.state;
    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "#E5EBF7" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "gray" }}>
          <View style={{ flexDirection: "column", height: 140, backgroundColor: "#E5EBF7" }}>
            <Header firstName="Hotel" lastName="Search" onPress={this.goBack} />
          </View>
          <View style={{ backgroundColor: "#FFFFFF", flex: 1 }}>
            <View
              style={{
                marginHorizontal: 20,
                flexDirection: "row",
                height: 30,
                marginTop: -10
              }}>
              <Button
                onPress={this.updateHotelType(1)}
                style={{
                  backgroundColor: hoteltype == 1 ? "#5B89F9" : "#FFF",
                  elevation: 2,
                  zIndex: 2,
                  height: 30,
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 5
                }}>
                <Text style={{ color: hoteltype == 1 ? "#FFF" : "#000", fontSize: 12 }}>
                  Domestic
                </Text>
              </Button>
              <Button
                onPress={this.updateHotelType(2)}
                style={{
                  backgroundColor: hoteltype == 2 ? "#5B89F9" : "#FFF",
                  elevation: 2,
                  zIndex: 2,
                  height: 30,
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 5
                }}>
                <Text style={{ color: hoteltype == 2 ? "#FFF" : "#000", fontSize: 12 }}>
                  International
                </Text>
              </Button>
            </View>

            <View style={{ margin: 16, marginTop: 54, flexDirection: "row", alignItems: "center" }}>
              <Icon
                name="location"
                type="Entypo"
                style={{ color: "#858585", fontSize: 24, marginTop: 5 }}
              />
              {hoteltype == 2 && (
                <Button style={{ flex: 1, paddingStart: 20 }} onPress={this.countryOpen}>
                  <Text style={{ color: "#5D666D" }}>Country</Text>
                  <Text style={{}}>{country}</Text>
                </Button>
              )}
              <Button style={{ flex: 1, paddingStart: 20 }} onPress={this.modalOpen}>
                <Text style={{ color: "#5D666D" }}>City</Text>
                <Text style={{}}>{place}</Text>
              </Button>
            </View>

            <View
              style={{
                height: 1,
                backgroundColor: "#DDDDDD",
                marginHorizontal: 20
              }}
            />

            <View style={{ margin: 16, flexDirection: "row", alignItems: "center" }}>
              <Image
                style={{ width: 25, resizeMode: "contain" }}
                source={require("../../assets/imgs/cal.png")}
              />
              <Button
                style={{ flex: 1, paddingStart: 20 }}
                onPress={this.showDateTimePicker("fromDTpicker")}>
                <Text style={{ color: "#5D666D" }}>Check-in</Text>
                <Text style={{}}>{moment(CheckIn).format("DD-MMM-YYYY")}</Text>
                <DateTimePicker
                  isVisible={fromDTpicker}
                  onConfirm={this.handleDatePicked("fromDTpicker")}
                  onCancel={this.hideDateTimePicker("fromDTpicker")}
                  minimumDate={new Date()}
                />
              </Button>
              <Button
                style={{ flex: 1, paddingStart: 20 }}
                onPress={this.showDateTimePicker("toDTpicker")}>
                <Text style={{ color: "#5D666D" }}>Check-out</Text>
                <Text style={{}}>{moment(CheckOut).format("DD-MMM-YYYY")}</Text>
                <DateTimePicker
                  isVisible={toDTpicker}
                  onConfirm={this.handleDatePicked("toDTpicker")}
                  onCancel={this.hideDateTimePicker("toDTpicker")}
                  minimumDate={this.state.CheckIn}
                />
              </Button>
            </View>

            <View
              style={{
                height: 1,
                backgroundColor: "#DDDDDD",
                marginHorizontal: 20
              }}
            />

            <View style={{ margin: 16, flexDirection: "row", alignItems: "center" }}>
              <Image
                style={{ width: 25, resizeMode: "contain" }}
                source={require("../../assets/imgs/person.png")}
              />
              <Button style={{ flex: 1, paddingStart: 20 }} onPress={this.setPassengers}>
                <Text>Rooms & Guest</Text>
                <Text style={{ color: "#5D666D" }}>
                  {adults_count === "Passengers:" ? adults_count : ""}
                  {adults_count > 0 ? adults_count + " Adults , " : ""}
                  {children_count > 0 ? children_count + " Children , " : ""}
                  {adults_count > 0 ? room + " Room" : ""}
                </Text>
                <View
                  style={{
                    backgroundColor: "#F68E1F",
                    height: 25,
                    justifyContent: "center",
                    borderRadius: 15,
                    alignSelf: "flex-start"
                  }}>
                  <Text style={{ color: "#fff", paddingHorizontal: 15 }}>ADD</Text>
                </View>
              </Button>
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
          </View>

          <AddPassengers
            visible={this.state.modalPassengers}
            submit={this.submit}
            modalClose={this.modalClose}
          />

          {hoteltype == 2 && (
            <Modal
              animationType="slide"
              transparent={false}
              visible={_country}
              onRequestClose={this.modalBackPress}>
              <AutoCompleteModal
                placeholder="Country"
                type="hotelCountry"
                onChange={this._handleCountry}
                onModalBackPress={this.modalBackPress}
              />
            </Modal>
          )}

          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state._place}
            onRequestClose={this.modalBackPress}>
            <AutoCompleteModal
              placeholder="Enter Source"
              type={hoteltype == 1 ? "domesticHotel" : "intHotel"}
              onChange={this._handle}
              country={country === "Select Country" ? "" : country}
              onModalBackPress={this.modalBackPress}
            />
          </Modal>
        </SafeAreaView>
      </>
    );
  }
}

export default Hotel;
