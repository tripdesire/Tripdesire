import React from "react";
import { View, Image, Modal, Platform, ScrollView, StyleSheet } from "react-native";
import { withNavigation } from "react-navigation";
import { Button, Text, AutoCompleteModal, Icon } from "../../components";
import AddPassengers from "./AddPassengers";
import Animated, { Easing } from "react-native-reanimated";
import DateTimePicker from "react-native-modal-datetime-picker";
import RNPickerSelect from "react-native-picker-select";
import moment from "moment";
import Toast from "react-native-simple-toast";
import analytics from "@react-native-firebase/analytics";

class DomesticFlights extends React.PureComponent {
  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(0);
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
      selectRound: false,
      fromDTpicker: false,
      toDTpicker: false,
      rotateVal: 1
    };
  }

  trackScreenView = async screen => {
    // Set & override the MainActivity screen name
    await analytics().setCurrentScreen(screen, screen);
  };
  componentDidMount() {
    this.trackScreenView("Domestic Search");
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

  _exchange = () => {
    const {
      from,
      to,
      sourceName,
      destinationName,
      fromCode,
      ToCode,
      sourceAirportName,
      destinationAirportName
    } = this.state;

    Animated.timing(this.animatedValue, {
      toValue: this.state.rotateVal,
      duration: 300,
      easing: Easing.inOut(Easing.ease)
    }).start();

    this.setState({
      from: to,
      to: from,
      sourceName: destinationName,
      sourceAirportName: destinationAirportName,
      destinationAirportName: sourceAirportName,
      destinationName: sourceName,
      fromCode: ToCode,
      ToCode: fromCode,
      rotateVal: this.state.rotateVal == 1 ? 0 : 1
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
      tripType,
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

    const imageStyle = {
      height: 30,
      width: 30,
      transform: [
        {
          rotate: Animated.concat(
            this.animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [90, 270]
            }),
            "deg"
          )
        }
      ]
      // transform: [{ rotate: "90deg" }]}
    };

    return (
      <View style={{ flex: 1 }}>
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
            <Text
              style={{
                color: tripType == 1 ? "#000000" : "#BDC4CA",
                fontWeight: "600",
                fontSize: 14
              }}>
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
            <Text
              style={{
                color: tripType == 2 ? "#000000" : "#BDC4CA",
                fontWeight: "600",
                fontSize: 14
              }}>
              Round Trip
            </Text>
          </Button>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ margin: 16, flexDirection: "row", alignItems: "center" }}>
            <Image
              style={{ width: 40, height: 40, tintColor: "#000000" }}
              source={require("../../assets/imgs/flightSearch.png")}
            />
            <Button
              style={{ flex: 1, paddingStart: 20 }}
              onPress={this.setModalVisible("modalFrom", true)}>
              <Text style={{ color: "#000000" }}>From</Text>
              <Text style={styles.sourceAndDestination}>{from}</Text>
            </Button>
            <Button onPress={this._exchange}>
              <Animated.Image
                style={[imageStyle, { marginTop: 10 }]}
                source={require("../../assets/imgs/exchange.png")}
              />
              {/* <Icon type="MaterialCommunityIcons" name="swap-vertical" color="#000000" size={40} /> */}
            </Button>
          </View>

          <View style={{ height: 1, backgroundColor: "#DDDDDD", marginHorizontal: 20 }} />

          <View style={{ margin: 16, flexDirection: "row", alignItems: "center" }}>
            <Image
              style={{ width: 40, height: 40, tintColor: "#000000" }}
              source={require("../../assets/imgs/flightSearch.png")}
            />
            <Button
              style={{ flex: 1, paddingStart: 20 }}
              onPress={this.setModalVisible("modalTo", true)}>
              <Text style={{ color: "#000000" }}>To</Text>
              <Text style={styles.sourceAndDestination}>{to}</Text>
            </Button>
          </View>

          <View style={{ height: 1, backgroundColor: "#DDDDDD", marginHorizontal: 20 }} />

          <View style={{ margin: 16, flexDirection: "row", alignItems: "center" }}>
            <Image
              style={{ width: 40, height: 40, tintColor: "#000000" }}
              source={require("../../assets/imgs/calender.png")}
            />
            <Button
              style={{ flex: 1, paddingStart: 20 }}
              onPress={this.showDateTimePicker("fromDTpicker")}>
              <Text style={{ color: "#000000" }}>Depart </Text>
              <Text style={{ color: "#000000", fontSize: 18, fontWeight: "600" }}>
                {moment(Journey_date).format("DD MMM, YY")}
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
                <Text style={{ color: "#000000" }}>Return</Text>
                <Text style={{ color: "#000000", fontSize: 18, fontWeight: "600" }}>
                  {moment(Return_date).format("DD MMM, YY")}
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
              style={{ width: 40, height: 40, tintColor: "#000000" }}
              source={require("../../assets/imgs/Passenger.png")}
            />
            <Button
              style={{ flex: 1, paddingStart: 20 }}
              onPress={this.setModalVisible("modalPassengers", true)}>
              <Text style={{ color: "#000000" }}>Passengers</Text>

              <Text style={{ color: "#000000", fontSize: 18, fontWeight: "600" }}>
                {parseInt(adult) + parseInt(children) + parseInt(infants) < 9
                  ? "0" + (parseInt(adult) + parseInt(children) + parseInt(infants))
                  : parseInt(adult) + parseInt(children) + parseInt(infants)}
              </Text>
            </Button>
          </View>
          <View style={{ height: 1, backgroundColor: "#DDDDDD", marginHorizontal: 20 }} />
          <View style={{ margin: 16, flexDirection: "row", alignItems: "center" }}>
            <Image
              style={{ width: 40, height: 40, tintColor: "#000000" }}
              source={require("../../assets/imgs/class.png")}
            />

            <View style={{ flex: 1, paddingStart: 20, paddingTop: 0 }}>
              <Text style={{ color: "#000000" }}>Class</Text>
              <RNPickerSelect
                useNativeAndroidPickerStyle={false}
                itemstyle={{ fontWeight: "700", fontSize: 24 }}
                placeholder={{}}
                pickerProps={{ mode: "dropdown" }}
                value={this.state.class}
                style={{
                  inputIOS: {
                    fontSize: 18,
                    fontWeight: "700",
                    color: "#000000"
                  },
                  inputAndroid: {
                    padding: 0,
                    height: 20,
                    fontSize: 18,
                    fontWeight: "700",
                    color: "#000000"
                  }
                }}
                onValueChange={(itemValue, index) =>
                  this.setState({ class: itemValue, index: index })
                }
                items={className}
                Icon={() => (
                  <Icon name={Platform.OS == "ios" ? "ios-arrow-down" : null} size={20} />
                )}
              />
            </View>
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
        </ScrollView>

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

const styles = StyleSheet.create({
  sourceAndDestination: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "600",
    textTransform: "capitalize"
  }
});

export default withNavigation(DomesticFlights);
