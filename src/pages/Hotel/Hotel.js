import React, { PureComponent } from "react";
import { View, Image, StyleSheet, Modal, TouchableOpacity, Picker } from "react-native";
import { Button, Text, AutoCompleteModal } from "../../components";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import { connect } from "react-redux";
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
      room: 1
    };
  }

  // componentDidMount() {
  //   this.setState({ suggestions: this.props.domesticHotelSuggestionReducer });
  // }

  navigateToScreen = () => {
    this.props.navigation.goBack(null);
  };

  setDate = (event, date) => {
    date = date || this.state.CheckIn;
    this.setState({
      show_CheckIn: Platform.OS === "ios" ? true : false,
      CheckIn: date
    });
  };

  setDate_CheckOut = (event, date) => {
    date = date || this.state.CheckOut;
    this.setState({
      show_CheckOut: Platform.OS === "ios" ? true : false,
      CheckOut: date
    });
  };

  show = mode => () => {
    this.setState({
      show_CheckIn: true,
      mode
    });
  };

  showTo = mode => () => {
    this.setState({
      show_CheckOut: true,
      mode
    });
  };

  _handle = async item => {
    await this.setState({
      place: item.CityName + ", " + item.CityId + " - (India)",
      cityId: item.CityId,
      city: item.CityName,
      _place: false
    });
  };

  modalOpen = () => {
    this.setState({ _place: true });
  };

  modalBackPress = () => {
    this.setState({ _place: false });
  };

  setPassengers = () => {
    this.setState({ modalPassengers: true });
  };

  modalClose = () => {
    this.setState({ modalPassengers: false });
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
      children_count: eval(value.data.map(item => item.children).join("+"))
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
      hoteltype: 1,
      adults_count: this.state.adults_count,
      children_count: this.state.children_count,
      user: "",
      room: this.state.room
    };
    this.props.navigation.navigate("HotelInfo", params);
  };

  render() {
    const {
      place,
      CheckIn,
      CheckOut,
      mode,
      show_CheckIn,
      show_CheckOut,
      adults_count,
      children_count,
      room
    } = this.state;
    return (
      <View style={{ flexDirection: "column", flex: 1 }}>
        <View style={{ backgroundColor: "#E5EBF7", flex: 1 }}>
          <Header firstName="Hotel" lastName="Search" onPress={this.navigateToScreen} />
        </View>

        <View style={{ height: 30, width: "100%" }}>
          <View style={{ flex: 2, backgroundColor: "#E5EBF7" }}></View>
          <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}></View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginHorizontal: 20,
              ...StyleSheet.absoluteFill
            }}>
            <Button
              style={{
                backgroundColor: "#5B89F9",
                elevation: 1,
                height: 30,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 5
              }}>
              <Text style={{ color: "#fff", fontSize: 12 }}>Domestic</Text>
            </Button>
          </View>
        </View>
        <View
          style={{
            elevation: 1,
            backgroundColor: "#FFFFFF",
            flex: 4
          }}>
          <Text
            style={{
              color: "#1F273E",
              fontSize: 18,
              marginVertical: 30,
              marginHorizontal: 16,
              alignSelf: "center"
            }}
            onPress={this.modalOpen}>
            {place}
          </Text>

          <View style={{ margin: 16, flexDirection: "row", alignItems: "center" }}>
            <Image
              style={{ width: 25, resizeMode: "contain" }}
              source={require("../../assets/imgs/cal.png")}
            />
            <View
              style={{
                flex: 1,
                paddingStart: 20
              }}>
              <Text style={{ color: "#5D666D", marginStart: 5 }}>Check-in</Text>
              <Button style={{ flex: 1, marginStart: 5 }} onPress={this.show("date")}>
                <Text style={{ flex: 1 }}>{moment(this.state.CheckIn).format("DD-MMM-YYYY")}</Text>
              </Button>
              {show_CheckIn && (
                <RNDateTimePicker
                  display="calendar"
                  value={CheckIn}
                  mode={mode}
                  minimumDate={new Date()}
                  onChange={this.setDate}
                />
              )}
            </View>
            <View
              style={{
                flex: 1,
                paddingStart: 20
              }}>
              <Text style={{ color: "#5D666D", marginStart: 5 }}>Check-out</Text>
              <Button style={{ flex: 1, marginStart: 5 }} onPress={this.showTo("date")}>
                <Text style={{ flex: 1 }}>{moment(this.state.CheckOut).format("DD-MMM-YYYY")}</Text>
              </Button>
              {show_CheckOut && (
                <RNDateTimePicker
                  display="calendar"
                  value={CheckOut}
                  mode={mode}
                  minimumDate={new Date()}
                  onChange={this.setDate_CheckOut}
                />
              )}
            </View>
          </View>

          <View
            style={{
              height: 1,
              backgroundColor: "#DDDDDD",
              marginHorizontal: 20
            }}></View>

          <View style={{ margin: 16, flexDirection: "row", alignItems: "center" }}>
            <Image
              style={{ width: 25, resizeMode: "contain" }}
              source={require("../../assets/imgs/person.png")}
            />
            <View
              style={{
                flex: 1,
                paddingStart: 20
              }}>
              <Text style={{ color: "#5D666D", marginStart: 5 }}>
                {adults_count === "Passengers:" ? adults_count : ""}
                {adults_count > 0 ? adults_count + " Adults , " : ""}
                {children_count > 0 ? children_count + " Children , " : ""}
                {adults_count > 0 ? room + " Room" : ""}
              </Text>
              <View style={{ flexDirection: "row", flex: 1, paddingStart: 5 }}>
                <Button
                  style={{
                    backgroundColor: "#F68E1F",
                    height: 25,
                    justifyContent: "center",
                    borderRadius: 15
                  }}
                  onPress={this.setPassengers}>
                  <Text style={{ color: "#fff", paddingHorizontal: 15 }}>ADD</Text>
                </Button>
              </View>
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
        </View>

        <AddPassengers
          visible={this.state.modalPassengers}
          submit={this.submit}
          modalClose={this.modalClose}
        />

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state._place}
          onRequestClose={this.modalBackPress}>
          <AutoCompleteModal
            placeholder="Enter Source"
            type="domesticHotel"
            onChange={this._handle}
            onModalBackPress={this.modalBackPress}
          />
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  domesticHotelSuggestionReducer: state.domesticHotelSuggestionReducer
});

export default connect(mapStateToProps, null)(Hotel);
