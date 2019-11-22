import React, { PureComponent } from "react";
import { View, Image, Modal, StyleSheet, SafeAreaView, Icon } from "react-native";
import { Button, Text, AutoCompleteModal } from "../../components";
import Toast from "react-native-simple-toast";
import Ionicons from "react-native-vector-icons/Ionicons";
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import RNPickerSelect from "react-native-picker-select";
import Service from "../../service";
import { Header } from "../../components";
class Cab extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      sourceName: "Hyderabad",
      destinationName: "Bangalore",
      from: "Hyderabad ,149 - (India)",
      sourceId: "149",
      to: "Bangalore ,113 - (India)",
      destinationId: "113",
      Journey_date: "31-09-2019",
      Return_date: "31-09-2019",
      modalTo: false,
      modalFrom: false,
      CheckIn: new Date(),
      CheckOut: new Date(),
      show_CheckIn: false,
      show_CheckOut: false,
      mode: "date",
      tripType: 4,
      backgroundColorLocal: "#5B89F9",
      buttonTextColorLocal: "#FFFFFF",
      buttonTextColorOutstation: "#000000",
      buttonTextColorTransfer: "#000000",
      backgroundColorOutstation: "#FFFFFF",
      backgroundColorTransfer: "#FFFFFF",
      tripTypeColorLocal: "#000000",
      tripTypeColorOutstation: "#BDC4CA",
      tripTypeColorTransferAirpot: "#BDC4CA",
      tripTypeColorTransferRailway: "#000000",
      tripTypeColorTransferHotel: "#000000",
      isselect: true,
      _select_round: false,
      suggestions: [],
      pickuptime: "",
      picktrip: "",
      transfer: 0,
      fromDTpicker: false,
      toDTpicker: false,
      travelType: 2
    };

    this.inputRefs = {
      pickuptime: null,
      text: null
    };
  }

  componentDidMount() {
    Service.get("/Cabs/Cities")
      .then(res => {
        console.log(res.data);
        this.setState({ suggestions: res.data });
      })
      .catch(error => {
        Toast.show(error, Toast.LONG);
      });
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
    } else {
      data.CheckOut = date;
    }
    this.setState(data);
    this.hideDateTimePicker(key)();
  };

  handleFrom = item => {
    this.setState({
      from: item.Name + " ," + item.Id + " - (India)",
      sourceId: item.Id,
      sourceName: item.Name,
      modalFrom: false
    });
  };

  handleTo = item => {
    this.setState({
      to: item.Name + " ," + item.Id + " - (India)",
      destinationId: item.Id,
      destinationName: item.Name,
      modalTo: false
    });
  };

  setModalVisible = (key, visible) => () => {
    this.setState({ [key]: visible });
  };

  _triptype = value => {
    this.setState({
      backgroundColorLocal: value == "oneway" ? "#5B89F9" : "#FFFFFF",
      backgroundColorOutstation: value == "round" ? "#5B89F9" : "#FFFFFF",
      backgroundColorTransfer: value == "transfer" ? "#5B89F9" : "#FFFFFF",
      buttonTextColorLocal: value == "oneway" ? "#ffffff" : "#000000",
      buttonTextColorOutstation: value == "round" ? "#ffffff" : "#000000",
      buttonTextColorTransfer: value == "transfer" ? "#ffffff" : "#000000",
      _select_round: value == "round" ? true : false,
      tripType: value == "oneway" ? 4 : value == "round" ? 1 : value == "transfer" ? 6 : "",
      transfer: value == "transfer" ? 1 : 0,
      travelType: value == "oneway" ? 2 : value == "round" ? 1 : value == "transfer" ? 3 : ""
    });
  };

  _SelectTripType = value => {
    this.setState({
      tripTypeColorLocal: value == "oneway" && this.state.transfer == 0 ? "#BDC4CA" : "#000000",
      tripTypeColorOutstation: value == "round" && this.state.transfer == 0 ? "#BDC4CA" : "#000000",
      tripTypeColorTransferAirpot: value == "airpot" ? "#BDC4CA" : "#000000",
      tripTypeColorTransferRailway: value == "railway" ? "#BDC4CA" : "#000000",
      tripTypeColorTransferHotel: value == "hotel" ? "#BDC4CA" : "#000000",
      tripType: value == "oneway" ? 1 : 2,
      selectRound: value == "round" ? true : false
    });
  };

  _search = () => {
    let params = {
      sourceId: this.state.sourceId,
      destinationId: "0",
      journeyDate: moment(this.state.CheckIn).format("DD-MM-YYYY"),
      operatorName: "",
      pickUpTime: "7:30pm",
      Pickuplocation: "",
      Droplocation: "",
      travelType: this.state.travelType,
      tripType: this.state.tripType,
      sessionId: "xb5dllu3cp02infmtvgrlaiu",
      userType: 5,
      user: "",
      dropoffTime: "",
      cabType: 1,
      affiliateId: "",
      websiteUrl: ""
    };
    console.log(params);
    Service.get("/Cabs/AvailableCabs", params)
      .then(({ data }) => {
        console.log(data);
      })
      .catch(error => {
        console.log(error);
        Toast.show(error, Toast.LONG);
      });

    // this.props.navigation.navigate("BusInfo", params);
  };

  render() {
    const {
      from,
      to,
      tripType,
      tripTypeColorLocal,
      tripTypeColorTransferAirpot,
      tripTypeColorTransferHotel,
      tripTypeColorTransferRailway,
      tripTypeColorOutstation,
      backgroundColorLocal,
      backgroundColorTransfer,
      backgroundColorOutstation,
      buttonTextColorLocal,
      buttonTextColorTransfer,
      buttonTextColorOutstation,
      _select_round,
      transfer,
      fromDTpicker,
      toDTpicker
    } = this.state;

    const placeholder = {
      label: "Select Pickup Time",
      value: null,
      color: "#9EA0A4"
    };

    const placeholderTrip = {
      label: "Select Trip",
      value: null,
      color: "#9EA0A4"
    };

    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "#E5EBF7" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <View style={{ flexDirection: "column", flex: 1 }}>
            <View style={{ backgroundColor: "#E4EAF6", flex: 1 }}>
              <Header
                firstName="Cab"
                lastName="Search"
                onPress={() => this.props.navigation.goBack(null)}
              />
            </View>

            <View style={{ height: 30, width: "100%" }}>
              <View style={{ flex: 2, backgroundColor: "#E4EAF6" }}></View>
              <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}></View>
              <View
                style={{
                  flexDirection: "row",
                  marginHorizontal: 16,
                  justifyContent: "center",
                  ...StyleSheet.absoluteFill
                }}>
                <Button
                  style={{
                    backgroundColor: backgroundColorLocal,
                    elevation: 1,
                    height: 30,
                    shadowOffset: { width: 0, height: 2 },
                    shadowColor: "rgba(0,0,0,0.1)",
                    shadowOpacity: 1,
                    shadowRadius: 4,
                    justifyContent: "center",
                    paddingHorizontal: 40,
                    borderBottomStartRadius: 5,
                    borderTopStartRadius: 5
                  }}
                  onPress={() => this._triptype("oneway")}>
                  <Text style={{ color: buttonTextColorLocal, fontSize: 12 }}>Local</Text>
                </Button>
                <Button
                  style={{
                    backgroundColor: backgroundColorOutstation,
                    elevation: 1,
                    shadowOffset: { width: 0, height: 2 },
                    shadowColor: "rgba(0,0,0,0.1)",
                    shadowOpacity: 1,
                    shadowRadius: 4,
                    height: 30,
                    justifyContent: "center",
                    paddingHorizontal: 40
                  }}
                  onPress={() => this._triptype("round")}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: buttonTextColorOutstation
                    }}>
                    Outstation
                  </Text>
                </Button>
                <Button
                  style={{
                    backgroundColor: backgroundColorTransfer,
                    elevation: 1,
                    shadowOffset: { width: 0, height: 2 },
                    shadowColor: "rgba(0,0,0,0.1)",
                    shadowOpacity: 1,
                    shadowRadius: 4,
                    height: 30,
                    justifyContent: "center",
                    paddingHorizontal: 40,
                    borderBottomEndRadius: 5,
                    borderTopEndRadius: 5
                  }}
                  onPress={() => this._triptype("transfer")}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: buttonTextColorTransfer
                    }}>
                    Transfer
                  </Text>
                </Button>
              </View>
            </View>

            <View style={{ backgroundColor: "#FFFFFF", flex: 4 }}>
              {_select_round && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginVertical: 40
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
                    <Text style={{ color: tripTypeColorLocal }}>One Way</Text>
                  </Button>
                  <Image
                    style={{ width: 25, resizeMode: "contain", marginHorizontal: 5 }}
                    source={require("../../assets/imgs/Round-trip-arrow.png")}
                  />
                  <Button
                    style={{ justifyContent: "center" }}
                    onPress={() => this._SelectTripType("round")}>
                    <Text style={{ color: tripTypeColorOutstation }}>Round Trip</Text>
                  </Button>
                </View>
              )}

              {transfer == 1 && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginVertical: 40
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
                    onPress={() => this._SelectTripType("airpot")}>
                    <Text style={{ color: tripTypeColorTransferAirpot }}>Airpot</Text>
                  </Button>
                  <Image
                    style={{ width: 25, resizeMode: "contain", marginHorizontal: 5 }}
                    source={require("../../assets/imgs/Round-trip-arrow.png")}
                  />
                  <Button
                    style={{ justifyContent: "center" }}
                    onPress={() => this._SelectTripType("railway")}>
                    <Text style={{ color: tripTypeColorTransferRailway }}>Railway Station</Text>
                  </Button>
                  <Image
                    style={{ width: 25, resizeMode: "contain", marginHorizontal: 5 }}
                    source={require("../../assets/imgs/Round-trip-arrow.png")}
                  />
                  <Button
                    style={{ justifyContent: "center" }}
                    onPress={() => this._SelectTripType("hotel")}>
                    <Text style={{ color: tripTypeColorTransferHotel }}>Area/Hotel</Text>
                  </Button>
                </View>
              )}

              <View
                style={{
                  marginHorizontal: 16,
                  marginVertical: 20,
                  flexDirection: "row"
                }}>
                <IconMaterial name="bus" size={40} color="#A5A9AC" />
                <View
                  style={{
                    flexDirection: "row",
                    marginStart: 20,
                    justifyContent: "space-between",
                    flex: 1
                  }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: "#5D666D" }}>From</Text>
                    <Text
                      style={{ fontSize: 18 }}
                      onPress={this.setModalVisible("modalFrom", true)}>
                      {from}
                    </Text>
                  </View>
                </View>
              </View>
              {_select_round && (
                <View>
                  <View
                    style={{
                      height: 1.35,
                      marginHorizontal: 16,
                      backgroundColor: "#CFCFCF"
                    }}></View>
                  <View
                    style={{
                      marginHorizontal: 16,
                      marginVertical: 20,
                      flexDirection: "row"
                    }}>
                    <IconMaterial name="bus" size={40} color="#A5A9AC" />
                    <View style={{ marginStart: 20, flex: 1 }}>
                      <Text style={{ color: "#5D666D" }}>To</Text>
                      <Text
                        style={{ fontSize: 18 }}
                        onPress={this.setModalVisible("modalTo", true)}>
                        {to}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {transfer == 1 && (
                <View>
                  <View
                    style={{
                      height: 1.35,
                      marginHorizontal: 16,
                      backgroundColor: "#CFCFCF"
                    }}></View>
                  <View
                    style={{
                      marginHorizontal: 16,
                      marginVertical: 20,
                      flexDirection: "row"
                    }}>
                    <SimpleLineIcons name="location-pin" size={40} color="#A5A9AC" />
                    <View style={{ marginStart: 20, flex: 1 }}>
                      <Text style={{ color: "#5D666D" }}>Pickup Location</Text>
                      <Text
                        style={{ fontSize: 18 }}
                        onPress={this.setModalVisible("modalTo", true)}>
                        {to}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {transfer == 1 && (
                <View>
                  <View
                    style={{
                      height: 1.35,
                      marginHorizontal: 16,
                      backgroundColor: "#CFCFCF"
                    }}></View>
                  <View
                    style={{
                      marginHorizontal: 16,
                      marginVertical: 20,
                      flexDirection: "row"
                    }}>
                    <SimpleLineIcons name="location-pin" size={40} color="#A5A9AC" />
                    <View style={{ marginStart: 20, flex: 1 }}>
                      <Text style={{ color: "#5D666D" }}>Drop Location</Text>
                      <Text
                        style={{ fontSize: 18 }}
                        onPress={this.setModalVisible("modalTo", true)}>
                        {to}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              <View
                style={{ height: 1.35, marginHorizontal: 16, backgroundColor: "#CFCFCF" }}></View>

              <View
                style={{
                  marginHorizontal: 16,
                  marginVertical: 20,
                  flexDirection: "row",
                  alignItems: "center"
                }}>
                <Image
                  style={{ width: 25, resizeMode: "contain", marginStart: 10 }}
                  source={require("../../assets/imgs/cal.png")}
                />
                <View
                  style={{
                    flex: 1,
                    paddingStart: 20
                  }}>
                  <Text style={{ color: "#5D666D", marginStart: 5 }}>Depart</Text>

                  <Button
                    style={{ flex: 1, marginStart: 5 }}
                    onPress={this.showDateTimePicker("fromDTpicker")}>
                    <Text>{moment(this.state.CheckIn).format("DD-MMM-YYYY")}</Text>
                  </Button>
                  <DateTimePicker
                    isVisible={fromDTpicker}
                    onConfirm={this.handleDatePicked("fromDTpicker")}
                    onCancel={this.hideDateTimePicker("fromDTpicker")}
                    minimumDate={new Date()}
                  />
                </View>
                {_select_round && tripType == 2 && (
                  <View
                    style={{
                      flex: 1,
                      paddingStart: 20
                    }}>
                    <Text style={{ color: "#5D666D", marginStart: 5 }}>Return</Text>
                    <Button
                      style={{ flex: 1, marginStart: 5 }}
                      onPress={this.showDateTimePicker("toDTpicker")}>
                      <Text>{moment(this.state.CheckOut).format("DD-MMM-YYYY")}</Text>
                    </Button>
                    <DateTimePicker
                      isVisible={toDTpicker}
                      onConfirm={this.handleDatePicked("toDTpicker")}
                      onCancel={this.hideDateTimePicker("toDTpicker")}
                      minimumDate={new Date()}
                    />
                  </View>
                )}
              </View>

              {!_select_round && transfer != 1 && (
                <View>
                  <Text style={{ marginHorizontal: 16 }}>Pickup Trip</Text>
                  <View
                    style={{
                      marginHorizontal: 16,
                      fontSize: 16,
                      paddingVertical: 12,
                      paddingHorizontal: 10,
                      borderWidth: 1,
                      borderColor: "gray",
                      borderRadius: 4,
                      color: "black",
                      paddingRight: 30
                    }}>
                    <RNPickerSelect
                      placeholder={placeholderTrip}
                      onValueChange={value => this.setState({ picktrip: value })}
                      items={[
                        { label: "4 hrs", value: "4" },
                        { label: "8 hrs", value: "8" },
                        { label: "12 hrs", value: "12" },
                        { label: "24 hrs", value: "24" }
                      ]}
                      value={this.state.picktrip}
                      Icon={() => {
                        return <Ionicons name="ios-arrow-down" size={24} color="gray" />;
                      }}
                    />
                  </View>
                </View>
              )}

              <View>
                <Text style={{ marginHorizontal: 16 }}>Pickup Time</Text>
                <View
                  style={{
                    marginHorizontal: 16,
                    fontSize: 16,
                    paddingVertical: 12,
                    paddingHorizontal: 10,
                    borderWidth: 1,
                    borderColor: "gray",
                    borderRadius: 4,
                    color: "black",
                    paddingRight: 30
                  }}>
                  <RNPickerSelect
                    placeholder={placeholder}
                    onValueChange={value => this.setState({ pickuptime: value })}
                    items={[
                      { label: "3:30pm", value: "3:30pm" },
                      { label: "3:45pm", value: "3:45pm" },
                      { label: "4:00pm", value: "4:00pm" }
                    ]}
                    value={this.state.pickuptime}
                    Icon={() => {
                      return <Ionicons name="ios-arrow-down" size={24} color="gray" />;
                    }}
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
            </View>

            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.modalFrom}
              onRequestClose={this.setModalVisible("modalFrom", false)}>
              <AutoCompleteModal
                placeholder="Enter Source"
                //visible={this.state.modalTo}
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
                //visible={this.state.modalTo}
                type="cab"
                onChange={this.handleTo}
                onModalBackPress={this.setModalVisible("modalTo", false)}
              />
            </Modal>
          </View>
        </SafeAreaView>
      </>
    );
  }
}

export default Cab;
