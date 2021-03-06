import React from "react";
import {
  View,
  Image,
  Modal,
  StyleSheet,
  SafeAreaView,
  Platform,
  ScrollView,
  StatusBar
} from "react-native";
import { Button, Text, AutoCompleteModal, Icon, LinearGradient } from "../../components";
import Toast from "react-native-simple-toast";
import Animated, { Easing } from "react-native-reanimated";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import RNPickerSelect from "react-native-picker-select";
import { Header } from "../../components";
import SuggLoc from "./LocationModal";
import analytics from "@react-native-firebase/analytics";

class Cab extends React.PureComponent {
  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(0);
    this.state = {
      sourceName: "Agra",
      destinationName: "Bangalore",
      from: "Agra", //, 100 - (India)",
      sourceId: "149",
      to: "Bangalore", //113 - (India)",
      pickuplocation: "",
      droplocation: "",
      destinationId: "113",
      Journey_date: "31-09-2019",
      Return_date: "31-09-2019",
      modalTo: false,
      modalFrom: false,
      modalPickupLocationSugg: false,
      modalDropSugg: false,
      CheckIn: new Date(),
      CheckOut: new Date(),
      show_CheckIn: false,
      show_CheckOut: false,
      mode: "date",
      isselect: true,
      _select_round: false,
      suggestions: [],
      pickuptime: "3:30pm",
      tripType: "4",
      transfer: 0,
      fromDTpicker: false,
      toDTpicker: false,
      travelType: 2,
      suggestionsLocation: "",
      SuggPickup: "",
      SuggDrop: "",
      selectedTransfer: 1,
      suggItem: "",
      item: this.getTimeStops(new Date()),
      rotateVal: 1
    };

    this.inputRefs = {
      pickuptime: null,
      text: null
    };
  }

  trackScreenView = async screen => {
    // Set & override the MainActivity screen name
    await analytics().setCurrentScreen(screen, screen);
  };
  componentDidMount() {
    this.trackScreenView("Cab Search");
  }

  getTimeStops(date) {
    var startTime = moment(date);

    if (startTime.isSameOrBefore(moment())) {
      startTime.minutes(Math.ceil(startTime.minutes() / 15) * 15);
    } else {
      startTime.startOf("day");
    }
    var endTime = moment(date).endOf("day");
    // if (endTime.isBefore(startTime)) {
    //   endTime.add(1, "day");
    // }
    var timeStops = [];
    while (startTime <= endTime) {
      let newSlot = new moment(startTime).format("h:mma");
      timeStops.push({ label: newSlot, value: newSlot });
      startTime.add(15, "minutes");
    }
    return timeStops;
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
      data.CheckIn = date;
      data.CheckOut = date;
      data.item = this.getTimeStops(date);
    } else {
      data.CheckOut = date;
    }
    this.setState(data);
    this.hideDateTimePicker(key)();
  };

  handleFrom = item => {
    console.log(item);
    this.setState({
      from: item.Name, // + " ," + item.Id + " - (India)",
      sourceId: item.Id,
      sourceName: item.Name,
      modalFrom: false,
      suggItem: item,
      SuggPickup:
        this.state.selectedTransfer == 1
          ? item.Airport
          : this.state.selectedTransfer == 2
          ? item.RailwayStation
          : this.state.selectedTransfer == 3
          ? item.Hotel
          : "",
      SuggDrop: [...item.Airport, ...item.RailwayStation, ...item.Hotel]
    });
  };

  handleTo = item => {
    this.setState({
      to: item.Name, // + " ," + item.Id + " - (India)",
      destinationId: item.Id,
      destinationName: item.Name,
      modalTo: false
    });
  };

  handlePickupLocation = item => {
    this.setState({ modalPickupLocationSugg: false, pickuplocation: item });
  };

  handleDropLocation = item => {
    this.setState({ modalDropSugg: false, droplocation: item });
  };

  itemSingle = item => {
    this.setState({ SuggPickup: item });
  };

  setModalVisible = (key, visible) => () => {
    this.setState({ [key]: visible });
  };

  _exchange = () => {
    Animated.timing(this.animatedValue, {
      toValue: this.state.rotateVal,
      duration: 300,
      easing: Easing.inOut(Easing.ease)
    }).start();

    this.setState({
      from: this.state.to,
      sourceName: this.state.destinationName,
      destinationName: this.state.sourceName,
      sourceId: this.state.destinationId,
      destinationId: this.state.sourceId,
      to: this.state.from,
      rotateVal: this.state.rotateVal == 1 ? 0 : 1
    });
  };

  _triptype = value => {
    this.setState({
      tripType: value == "oneway" ? 4 : value == "round" ? 1 : value == "transfer" ? 6 : "",
      travelType: value == "oneway" ? 2 : value == "round" ? 1 : value == "transfer" ? 3 : "",
      destinationName:
        value == "oneway"
          ? ""
          : value == "round"
          ? this.state.sourceName
          : value == "transfer"
          ? ""
          : "",
      to:
        value == "oneway" ? "" : value == "round" ? this.state.from : value == "transfer" ? "" : ""
    });
  };

  _SelectTripType = value => {
    this.setState({
      selectedTransfer: value == "airport" ? 1 : value == "railway" ? 2 : value == "hotel" ? 3 : "",
      tripType:
        value == "oneway"
          ? 1
          : value == "round"
          ? 2
          : value == "airport"
          ? 6
          : value == "railway"
          ? 7
          : value == "hotel"
          ? 8
          : "",
      selectRound: value == "round" ? true : false,
      SuggPickup:
        value == "airport"
          ? this.state.suggItem.Airport
          : value == "railway"
          ? this.state.suggItem.RailwayStation
          : value == "hotel"
          ? this.state.suggItem.Hotel
          : ""
    });
  };

  _search = () => {
    let params = {
      sourceId: this.state.sourceId,
      destinationId: this.state.travelType == 1 ? this.state.destinationId : "0",
      journeyDate: moment(this.state.CheckIn).format("DD-MM-YYYY"),
      operatorName: "",
      // pickTrip: this.state.picktrip,
      pickUpTime: this.state.pickuptime,
      Pickuplocation: this.state.pickuplocation,
      Droplocation: this.state.droplocation,
      travelType: this.state.travelType,
      tripType: this.state.tripType,
      sessionId: "xb5dllu3cp02infmtvgrlaiu",
      userType: 5,
      user: "",
      dropoffTime: "",
      cabType: 1,
      affiliateId: "",
      websiteUrl: "",
      sourceName: this.state.sourceName,
      destinationName: this.state.travelType == 1 ? this.state.destinationName : ""
    };

    if (this.state.travelType == 1) {
      Object.assign(params, {
        returnDate: this.state.tripType == 2 ? moment(this.state.CheckOut).format("DD-MM-YYYY") : ""
      });
    }

    if (this.state.sourceName != this.state.destinationName) {
      if (this.state.travelType == 3 && this.state.pickuplocation == this.state.droplocation) {
        Toast.show("Pickup and Drop Location can't Same or empty.", Toast.SHORT);
      } else {
        console.log(JSON.stringify(params));
        this.props.navigation.navigate("CabList", params);
      }
    } else {
      Toast.show("Source and Destination can't Same.", Toast.SHORT);
    }
  };

  render() {
    const {
      from,
      to,
      tripType,
      fromDTpicker,
      toDTpicker,
      pickuplocation,
      droplocation,
      travelType
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
    };

    return (
      <>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        <SafeAreaView style={{ flex: 0, backgroundColor: "#000000" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <View style={{ flexDirection: "column", backgroundColor: "#E4EAF6", height: 80 }}>
            <Header firstName="Cabs" lastName="Search" />
          </View>

          <View
            style={{
              flexDirection: "row",
              marginHorizontal: 32,
              marginTop: -15,
              justifyContent: "center",
              borderRadius: 10,
              borderWidth: 0,
              elevation: 1,
              shadowOffset: { width: 0, height: 2 },
              shadowColor: "rgba(0,0,0,0.1)",
              shadowOpacity: 1,
              shadowRadius: 4
            }}>
            <LinearGradient
              colors={travelType == 2 ? ["#53b2fe", "#065af3"] : ["#ffffff", "#ffffff"]}
              style={{
                shadowOffset: { width: 0, height: 2 },
                shadowColor: "rgba(0,0,0,0.1)",
                shadowOpacity: 1,
                shadowRadius: 4,
                elevation: 2,
                borderTopLeftRadius: 6,
                borderBottomLeftRadius: 6
              }}>
              <Button
                style={{
                  shadowOffset: { width: 0, height: 2 },
                  shadowColor: "rgba(0,0,0,0.1)",
                  shadowOpacity: 1,
                  shadowRadius: 4,
                  elevation: 1,
                  borderTopLeftRadius: 6,
                  borderBottomLeftRadius: 6,
                  ...styles.tabButtons
                }}
                onPress={() => this._triptype("oneway")}>
                <Text
                  style={{
                    color: travelType == 2 ? "#ffffff" : "#000000",
                    fontSize: 16,
                    fontWeight: "600"
                  }}>
                  Local
                </Text>
              </Button>
            </LinearGradient>

            <LinearGradient
              colors={travelType == 1 ? ["#53b2fe", "#065af3"] : ["#ffffff", "#ffffff"]}
              style={{
                shadowOffset: { width: 0, height: 2 },
                shadowColor: "rgba(0,0,0,0.1)",
                shadowOpacity: 1,
                shadowRadius: 4,
                elevation: 2
              }}>
              <Button
                style={{
                  shadowOffset: { width: 0, height: 2 },
                  shadowColor: "rgba(0,0,0,0.1)",
                  shadowOpacity: 1,
                  shadowRadius: 4,
                  elevation: 1,
                  ...styles.tabButtons
                }}
                onPress={() => this._triptype("round")}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: travelType == 1 ? "#ffffff" : "#000000"
                  }}>
                  Outstation
                </Text>
              </Button>
            </LinearGradient>

            <LinearGradient
              colors={travelType == 3 ? ["#53b2fe", "#065af3"] : ["#ffffff", "#ffffff"]}
              style={{
                shadowOffset: { width: 0, height: 2 },
                shadowColor: "rgba(0,0,0,0.1)",
                shadowOpacity: 1,
                shadowRadius: 4,
                elevation: 2,
                borderTopRightRadius: 6,
                borderBottomRightRadius: 6
              }}>
              <Button
                style={{
                  shadowOffset: { width: 0, height: 2 },
                  shadowColor: "rgba(0,0,0,0.1)",
                  shadowOpacity: 1,
                  shadowRadius: 4,
                  elevation: 1,
                  borderTopRightRadius: 6,
                  borderBottomRightRadius: 6,
                  ...styles.tabButtons
                }}
                onPress={() => this._triptype("transfer")}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: travelType == 3 ? "#ffffff" : "#000000"
                  }}>
                  Transfer
                </Text>
              </Button>
            </LinearGradient>
          </View>

          <ScrollView contentContainerStyle={{ backgroundColor: "#FFFFFF", marginTop: 2 }}>
            {travelType == 1 && (
              <View
                style={{
                  marginTop: 24,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center"
                }}>
                <Image
                  style={{ width: 20, marginHorizontal: 5, resizeMode: "contain" }}
                  source={require("../../assets/imgs/white-arrow-left-side.png")}
                />
                <Button onPress={() => this._SelectTripType("oneway")}>
                  <Text style={{ color: tripType == 1 ? "#000000" : "#BDC4CA" }}>One Way</Text>
                </Button>
                <Image
                  style={{ width: 25, resizeMode: "contain", marginHorizontal: 5 }}
                  source={require("../../assets/imgs/Round-trip-arrow.png")}
                />
                <Button onPress={() => this._SelectTripType("round")}>
                  <Text style={{ color: tripType == 2 ? "#000000" : "#BDC4CA" }}>Round Trip</Text>
                </Button>
              </View>
            )}

            {travelType == 3 && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 40
                }}>
                <Icon
                  name={Platform.OS == "ios" ? "plane" : "plane"}
                  type="FontAwesome"
                  size={16}
                  style={{ marginEnd: 5 }}
                  color={tripType == 6 ? "#000000" : "#BDC4CA"}
                />
                <Button onPress={() => this._SelectTripType("airport")}>
                  <Text style={{ color: tripType == 6 ? "#000000" : "#BDC4CA" }}>Airport</Text>
                </Button>
                <Icon
                  name={Platform.OS == "ios" ? "ios-train" : "md-train"}
                  size={16}
                  color={tripType == 7 ? "#000000" : "#BDC4CA"}
                  style={{ marginStart: 10, marginEnd: 5 }}
                />
                <Button onPress={() => this._SelectTripType("railway")}>
                  <Text style={{ color: tripType == 7 ? "#000000" : "#BDC4CA" }}>
                    Railway Station
                  </Text>
                </Button>
                <Icon
                  name={Platform.OS == "ios" ? "hotel" : "hotel"}
                  size={14}
                  color={tripType == 8 ? "#000000" : "#BDC4CA"}
                  type="FontAwesome5"
                  style={{ marginStart: 10, marginEnd: 5 }}
                />
                <Button
                  style={{ justifyContent: "center" }}
                  onPress={() => this._SelectTripType("hotel")}>
                  <Text style={{ color: tripType == 8 ? "#000000" : "#BDC4CA" }}>Area/Hotel</Text>
                </Button>
              </View>
            )}

            <View style={{ margin: 16, marginTop: 40, flexDirection: "row", alignItems: "center" }}>
              <Image style={styles.image} source={require("../../assets/imgs/cabSearch.png")} />
              <Button style={styles.view} onPress={this.setModalVisible("modalFrom", true)}>
                <Text style={styles.heading}>From</Text>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text numberOfLines={1} style={styles.places}>
                    {from}
                  </Text>
                  {travelType == 1 && (
                    <Button style={{ justifyContent: "center" }} onPress={this._exchange}>
                      <Animated.Image
                        style={[imageStyle]}
                        source={require("../../assets/imgs/exchange.png")}
                      />
                    </Button>
                  )}
                </View>
              </Button>
            </View>

            {travelType == 1 && (
              <>
                <View style={styles.line} />
                <View style={styles.mainView}>
                  <Image style={styles.image} source={require("../../assets/imgs/cabSearch.png")} />

                  <Button style={styles.view} onPress={this.setModalVisible("modalTo", true)}>
                    <Text style={styles.heading}>To</Text>
                    <Text numberOfLines={1} style={styles.places}>
                      {to}
                    </Text>
                  </Button>
                </View>
              </>
            )}

            {travelType == 3 && (
              <>
                <View style={styles.line} />

                <View style={styles.mainView}>
                  <Image
                    style={styles.image}
                    source={require("../../assets/imgs/locationList.png")}
                  />
                  <Button
                    style={styles.view}
                    onPress={this.setModalVisible("modalPickupLocationSugg", true)}>
                    <Text style={styles.heading}>Pickup Location</Text>
                    <Text
                      numberOfLines={1}
                      style={{ fontSize: 18, color: "#000000", fontWeight: "600" }}>
                      {pickuplocation != "" ? pickuplocation : "Tap To Enter"}
                    </Text>
                  </Button>
                  <Button style={styles.view} onPress={this.setModalVisible("modalDropSugg", true)}>
                    <Text style={styles.heading}>Drop Location</Text>
                    <Text
                      numberOfLines={1}
                      style={{ fontSize: 18, color: "#000000", fontWeight: "600" }}>
                      {droplocation != "" ? droplocation : "Tap To Enter"}
                    </Text>
                  </Button>
                </View>
              </>
            )}

            <View style={styles.line} />

            <View style={styles.mainView}>
              <Image style={styles.image} source={require("../../assets/imgs/calender.png")} />
              <Button style={styles.view} onPress={this.showDateTimePicker("fromDTpicker")}>
                <Text style={styles.heading}>Depart</Text>
                <Text style={{ fontSize: 18, color: "#000000", fontWeight: "600" }}>
                  {moment(this.state.CheckIn).format("DD MMM, YY")}
                </Text>
                <DateTimePicker
                  isVisible={fromDTpicker}
                  onConfirm={this.handleDatePicked("fromDTpicker")}
                  onCancel={this.hideDateTimePicker("fromDTpicker")}
                  date={this.state.CheckIn}
                  minimumDate={new Date()}
                />
              </Button>
              {travelType == 1 && tripType == 2 && (
                <Button style={styles.view} onPress={this.showDateTimePicker("toDTpicker")}>
                  <Text style={styles.heading}>Return</Text>
                  <Text
                    numberOfLines={1}
                    style={{ fontSize: 18, color: "#000000", fontWeight: "600" }}>
                    {moment(this.state.CheckOut).format("DD MMM, YY")}
                  </Text>
                  <DateTimePicker
                    isVisible={toDTpicker}
                    onConfirm={this.handleDatePicked("toDTpicker")}
                    onCancel={this.hideDateTimePicker("toDTpicker")}
                    date={this.state.CheckOut}
                    minimumDate={this.state.CheckIn}
                  />
                </Button>
              )}
            </View>

            <View style={styles.line} />

            <View style={styles.mainView}>
              <Image style={styles.image} source={require("../../assets/imgs/locationList.png")} />
              {travelType == 2 && (
                <View style={styles.view}>
                  <Text style={styles.heading}>Select Trip</Text>
                  <View style={{ width: 80 }}>
                    <RNPickerSelect
                      placeholder={{}}
                      useNativeAndroidPickerStyle={false}
                      onValueChange={value => this.setState({ tripType: value })}
                      items={[
                        { label: "4 hrs", value: "4" },
                        { label: "8 hrs", value: "8" },
                        { label: "12 hrs", value: "12" },
                        { label: "24 hrs", value: "24" }
                      ]}
                      style={{
                        inputIOS: {
                          color: "#000000",
                          padding: 0,
                          height: 20,
                          fontWeight: "700",
                          fontSize: 18
                        },
                        inputAndroid: {
                          color: "#000000",
                          padding: 0,
                          height: 20,
                          fontWeight: "700",
                          fontSize: 18
                        }
                      }}
                      pickerProps={{ mode: "dropdown" }}
                      value={this.state.tripType}
                      Icon={() => <Icon name="ios-arrow-down" size={20} color="grey" />}
                    />
                  </View>
                </View>
              )}
              <View style={styles.view}>
                <Text style={styles.heading}>Pickup</Text>
                <View style={{ width: 100 }}>
                  <RNPickerSelect
                    placeholder={{}}
                    useNativeAndroidPickerStyle={false}
                    onValueChange={value => this.setState({ pickuptime: value })}
                    items={this.state.item}
                    style={{
                      inputIOS: {
                        color: "#000000",
                        padding: 0,
                        height: 20,
                        fontWeight: "700",
                        fontSize: 18
                      },
                      inputAndroid: {
                        color: "#000000",
                        padding: 0,
                        height: 20,
                        fontWeight: "700",
                        fontSize: 18
                      }
                    }}
                    pickerProps={{ mode: "dropdown" }}
                    value={this.state.pickuptime}
                    Icon={() => <Icon name="ios-arrow-down" size={20} color="grey" />}
                  />
                </View>
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
            visible={this.state.modalFrom}
            onRequestClose={this.setModalVisible("modalFrom", false)}>
            <AutoCompleteModal
              placeholder="Enter Source"
              type="cab"
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
              type="cab"
              onChange={this.handleTo}
              onModalBackPress={this.setModalVisible("modalTo", false)}
            />
          </Modal>

          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalPickupLocationSugg}
            onRequestClose={this.setModalVisible("modalPickupLocationSugg", false)}>
            <SuggLoc
              placeholder="Enter Location"
              type="cab"
              selectedTransfer={this.state.selectedTransfer}
              data={this.state.SuggPickup}
              onChange={this.handlePickupLocation}
              item={this.itemSingle}
              onModalBackPress={this.setModalVisible("modalPickupLocationSugg", false)}
            />
          </Modal>

          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalDropSugg}
            onRequestClose={this.setModalVisible("modalDropSugg", false)}>
            <SuggLoc
              placeholder="Enter Location"
              type="cab"
              data={this.state.SuggDrop}
              onChange={this.handleDropLocation}
              item={this.itemSingle}
              onModalBackPress={this.setModalVisible("modalDropSugg", false)}
            />
          </Modal>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  tabButtons: {
    // elevation: 2,
    zIndex: 2,
    height: 30,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    paddingHorizontal: 25,
    // shadowOffset: { width: 0, height: 2 },
    // shadowColor: "#757575",
    // shadowOpacity: 0.2,
    // shadowRadius: 2,
    justifyContent: "center",
    alignItems: "center"
  },
  places: { fontSize: 18, color: "#000000", fontWeight: "600" },
  image: { width: 40, height: 40, tintColor: "#000000" },
  view: { flex: 1, paddingStart: 20 },
  heading: { color: "#000000" },
  mainView: { margin: 16, flexDirection: "row", alignItems: "center" },
  line: { height: 1, backgroundColor: "#DDD", marginHorizontal: 20 }
});

export default Cab;
