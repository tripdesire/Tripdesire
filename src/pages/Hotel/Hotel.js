import React from "react";
import { View, Image, StyleSheet, Modal, SafeAreaView } from "react-native";
import { Button, Text, AutoCompleteModal, LinearGradient } from "../../components";
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
      CheckOut: moment()
        .add(1, "days")
        .toDate(),
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
      data.CheckOut = moment(date)
        .add(1, "days")
        .toDate();
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
    if (this.state.country === "Select Country" && this.state.hoteltype == 2) {
      Toast.show("Please select the country", Toast.LONG);
      return;
    }

    let Difference_In_Days = moment
      .duration(
        moment(this.state.CheckOut)
          .startOf("day")
          .diff(moment(this.state.CheckIn).startOf("day"))
      )
      .asDays();
    let params = {
      city: this.state.city,
      destinationId: this.state.cityId,
      arrivalDate: moment(this.state.CheckIn).format("DD-MM-YYYY"),
      departureDate: moment(this.state.CheckOut).format("DD-MM-YYYY"),
      rooms: this.state.room,
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
    // console.log(params);
    //console.log(JSON.stringify(params));
    this.props.navigation.navigate("HotelInfo", params);
  };

  updateHotelType = val => () => {
    this.setState({ hoteltype: val });
  };

  render() {
    const {
      place,
      adults_count,
      children_count,
      room,
      CheckIn,
      CheckOut,
      fromDTpicker,
      toDTpicker,
      hoteltype,
      _country,
      country
    } = this.state;
    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "#E5EBF7" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "grey" }}>
          <View style={{ flexDirection: "column", height: 80, backgroundColor: "#E5EBF7" }}>
            <Header firstName="Hotels" lastName="Search" onPress={this.goBack} />
          </View>
          <View style={{ backgroundColor: "#FFFFFF", flex: 1 }}>
            <View
              style={{
                marginHorizontal: 20,
                flexDirection: "row",
                height: 30,
                alignItems: "center",
                justifyContent: "center",
                marginTop: -15
              }}>
              <LinearGradient
                colors={hoteltype == 1 ? ["#53b2fe", "#065af3"] : ["#ffffff", "#ffffff"]}
                style={{
                  borderBottomLeftRadius: 5,
                  borderTopLeftRadius: 5
                }}>
                <Button
                  onPress={this.updateHotelType(1)}
                  style={{
                    // backgroundColor: hoteltype == 1 ? "#5B89F9" : "#FFF",
                    elevation: 1,
                    shadowOffset: { width: 0, height: 2 },
                    shadowColor: "rgba(0,0,0,0.1)",
                    shadowOpacity: 1,
                    shadowRadius: 4,
                    zIndex: 2,
                    height: 30,
                    borderWidth: 1,
                    borderColor: "#DDDDDD",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 30,
                    borderBottomStartRadius: 5,
                    borderTopStartRadius: 5
                  }}>
                  <Text
                    style={{
                      color: hoteltype == 1 ? "#FFF" : "#5D666D",
                      fontSize: 16,
                      fontWeight: "600"
                    }}>
                    Domestic
                  </Text>
                </Button>
              </LinearGradient>
              <LinearGradient
                colors={hoteltype == 2 ? ["#53b2fe", "#065af3"] : ["#ffffff", "#ffffff"]}
                style={{
                  borderBottomRightRadius: 5,
                  borderTopRightRadius: 5
                }}>
                <Button
                  onPress={this.updateHotelType(2)}
                  style={{
                    // backgroundColor: hoteltype == 2 ? "#5B89F9" : "#FFF",
                    elevation: 1,
                    borderWidth: 1,
                    borderColor: "#DDDDDD",
                    shadowOffset: { width: 0, height: 2 },
                    shadowColor: "rgba(0,0,0,0.1)",
                    shadowOpacity: 1,
                    shadowRadius: 4,
                    zIndex: 2,
                    height: 30,
                    paddingHorizontal: 30,
                    justifyContent: "center",
                    alignItems: "center",
                    borderBottomEndRadius: 5,
                    borderTopEndRadius: 5
                  }}>
                  <Text
                    style={{
                      color: hoteltype == 2 ? "#FFF" : "#5D666D",
                      fontSize: 16,
                      fontWeight: "600"
                    }}>
                    International
                  </Text>
                </Button>
              </LinearGradient>
            </View>

            {hoteltype == 2 && (
              <>
                <View
                  style={{ margin: 16, marginTop: 54, flexDirection: "row", alignItems: "center" }}>
                  <Image
                    style={{ width: 40, height: 40, tintColor: "#5D666D" }}
                    source={require("../../assets/imgs/locationList.png")}
                  />

                  <Button style={{ flex: 1, paddingStart: 20 }} onPress={this.countryOpen}>
                    <Text style={{ color: "#5D666D" }}>Country</Text>
                    <Text style={{ color: "#5D666D", fontSize: 18, fontWeight: "600" }}>
                      {country}
                    </Text>
                  </Button>
                </View>
                <View style={{ height: 1, backgroundColor: "#DDDDDD", marginHorizontal: 20 }} />
              </>
            )}
            <View
              style={{
                margin: 16,
                marginTop: hoteltype == 2 ? 16 : 54,
                flexDirection: "row",
                alignItems: "center"
              }}>
              <Image
                style={{ width: 40, height: 40, tintColor: "#5D666D" }}
                source={require("../../assets/imgs/locationList.png")}
              />
              <Button style={{ flex: 1, paddingStart: 20 }} onPress={this.modalOpen}>
                <Text style={{ color: "#5D666D" }}>City</Text>
                <Text
                  style={{
                    color: "#5D666D",
                    fontSize: 18,
                    fontWeight: "600",
                    textTransform: "capitalize"
                  }}>
                  {place}
                </Text>
              </Button>
            </View>

            <View style={{ height: 1, backgroundColor: "#DDDDDD", marginHorizontal: 20 }} />

            <View style={{ margin: 16, flexDirection: "row", alignItems: "center" }}>
              <Image
                style={{ width: 40, height: 40, tintColor: "#5D666D" }}
                source={require("../../assets/imgs/calender.png")}
              />
              <Button
                style={{ flex: 1, paddingStart: 20 }}
                onPress={this.showDateTimePicker("fromDTpicker")}>
                <Text style={{ color: "#5D666D" }}>Check-in</Text>
                <Text style={{ color: "#5D666D", fontSize: 18, fontWeight: "600" }}>
                  {moment(CheckIn).format("DD MMM YYYY")}
                </Text>
                <DateTimePicker
                  isVisible={fromDTpicker}
                  onConfirm={this.handleDatePicked("fromDTpicker")}
                  onCancel={this.hideDateTimePicker("fromDTpicker")}
                  date={CheckIn}
                  minimumDate={new Date()}
                />
              </Button>
              <Button
                style={{ flex: 1, paddingStart: 20 }}
                onPress={this.showDateTimePicker("toDTpicker")}>
                <Text style={{ color: "#5D666D" }}>Check-out</Text>
                <Text style={{ color: "#5D666D", fontSize: 18, fontWeight: "600" }}>
                  {moment(CheckOut).format("DD MMM YYYY")}
                </Text>
                <DateTimePicker
                  isVisible={toDTpicker}
                  onConfirm={this.handleDatePicked("toDTpicker")}
                  onCancel={this.hideDateTimePicker("toDTpicker")}
                  date={CheckOut}
                  minimumDate={moment(this.state.CheckIn)
                    .add(1, "days")
                    .toDate()}
                />
              </Button>
            </View>

            <View style={{ height: 1, backgroundColor: "#DDD", marginHorizontal: 20 }} />

            <View style={{ margin: 16, flexDirection: "row", alignItems: "center" }}>
              <Image
                style={{ width: 40, height: 40, tintColor: "#5D666D" }}
                source={require("../../assets/imgs/Passenger.png")}
              />
              <Button style={{ flex: 1, paddingStart: 20 }} onPress={this.setPassengers}>
                <Text style={{ color: "#5D666D" }}>Rooms & Guests</Text>
                <Text style={{ color: "#5D666D", fontSize: 18, fontWeight: "600" }}>
                  {adults_count === "Passengers:" ? adults_count : ""}
                  {adults_count > 0 ? adults_count + " Adults , " : ""}
                  {children_count > 0 ? children_count + " Children , " : ""}
                  {adults_count > 0 ? room + " Room" : ""}
                </Text>
              </Button>
            </View>
            <Button
              style={{
                backgroundColor: "#F68E1F",
                marginHorizontal: 100,
                height: 36,
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
