import React from "react";
import { View, Image, Modal, StyleSheet, SafeAreaView, StatusBar } from "react-native";
import { Button, Text, AutoCompleteModal, LinearGradient } from "../../components";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import { Header } from "../../components";
import Animated, { Easing } from "react-native-reanimated";

class Bus extends React.PureComponent {
  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(0);
    this.state = {
      sourceName: "Hyderabad",
      destinationName: "Bangalore",
      from: "Hyderabad ,100 - (India)",
      sourceId: "100",
      to: "Bangalore ,109 - (India)",
      destinationId: "109",
      Journey_date: "31-09-2019",
      Return_date: "31-09-2019",
      modalTo: false,
      modalFrom: false,
      CheckIn: new Date(),
      CheckOut: new Date(),
      tripType: 1,
      isselect: true,
      _select_round: false,
      fromDTpicker: false,
      toDTpicker: false,
      TripType: 1,
      rotateVal: 1
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
      data.CheckIn = date;
      data.CheckOut = date;
    } else {
      data.CheckOut = date;
    }
    this.setState(data);
    this.hideDateTimePicker(key)();
  };

  setModalVisible = (key, visible) => () => {
    this.setState({ [key]: visible });
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
      _select_round: value == "round" ? true : false,
      tripType: 1,
      TripType: value == "round" ? 2 : 1
    });
  };

  _search = () => {
    let params = {
      sourceName: this.state.sourceName,
      destinationName: this.state.destinationName,
      sourceId: this.state.sourceId,
      destinationId: this.state.destinationId,
      journeyDate: moment(this.state.CheckIn).format("DD-MM-YYYY"),
      returnDate: this.state.tripType == 1 ? moment(this.state.CheckOut).format("DD-MM-YYYY") : "",
      tripType: this.state.tripType,
      TripType: this.state.TripType,
      userType: 5,
      user: ""
    };
    console.log(params);
    if (this.state.TripType == 1) {
      this.props.navigation.navigate("BusInfo", params);
    } else {
      this.props.navigation.navigate("BusRound", params);
    }
  };

  render() {
    const { from, to, _select_round, fromDTpicker, toDTpicker, TripType } = this.state;
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
      <>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        <SafeAreaView style={{ flex: 0, backgroundColor: "#E5EBF7" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <View style={{ flexDirection: "column", flex: 1 }}>
            <View style={{ backgroundColor: "#E4EAF6", height: 80 }}>
              <Header firstName="Buses" lastName="Search" />
            </View>

            <View style={{ backgroundColor: "#FFFFFF", flex: 4 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  marginTop: -15
                }}>
                <LinearGradient
                  colors={TripType == 1 ? ["#53b2fe", "#065af3"] : ["#ffffff", "#ffffff"]}
                  style={{ borderBottomLeftRadius: 5, borderTopLeftRadius: 5 }}>
                  <Button
                    style={{
                      // backgroundColor: TripType == 1 ? "#5B89F9" : "#FFFFFF",
                      borderBottomLeftRadius: 5,
                      borderTopLeftRadius: 5,
                      ...styles.tabButton
                    }}
                    onPress={() => this._triptype("onewway")}>
                    <Text
                      style={{
                        color: TripType == 1 ? "#ffffff" : "#000000",
                        fontSize: 16,
                        fontWeight: "600"
                      }}>
                      One Way
                    </Text>
                  </Button>
                </LinearGradient>
                <LinearGradient
                  colors={TripType == 2 ? ["#53b2fe", "#065af3"] : ["#ffffff", "#ffffff"]}
                  style={{ borderBottomRightRadius: 5, borderTopRightRadius: 5 }}>
                  <Button
                    style={{
                      //backgroundColor: TripType == 2 ? "#5B89F9" : "#FFFFFF",
                      borderBottomRightRadius: 5,
                      borderTopRightRadius: 5,
                      ...styles.tabButton
                    }}
                    onPress={() => this._triptype("round")}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: TripType == 2 ? "#ffffff" : "#000000"
                      }}>
                      Round
                    </Text>
                  </Button>
                </LinearGradient>
              </View>
              <View
                style={{
                  marginHorizontal: 16,
                  marginVertical: 20,
                  flexDirection: "row",
                  alignItems: "center"
                }}>
                <Image
                  style={{ width: 40, height: 40, tintColor: "#000000" }}
                  source={require("../../assets/imgs/busNew.png")}
                />
                <View
                  style={{
                    flexDirection: "row",
                    marginStart: 20,
                    alignItems: "center",
                    justifyContent: "space-between",
                    flex: 1
                  }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: "#000000" }}>From</Text>
                    <Text
                      style={{ fontSize: 18, color: "#000000", fontWeight: "600" }}
                      onPress={this.setModalVisible("modalFrom", true)}>
                      {from}
                    </Text>
                  </View>
                  <Button onPress={this._exchange}>
                    <Animated.Image
                      style={[imageStyle, { marginTop: 10 }]}
                      source={require("../../assets/imgs/exchange.png")}
                    />
                    {/* <Icon type="MaterialCommunityIcons" name="swap-vertical" color="#000000" size={40} /> */}
                  </Button>
                </View>
              </View>
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
                  style={{ width: 40, height: 40, tintColor: "#000000" }}
                  source={require("../../assets/imgs/busNew.png")}
                />
                <View style={{ marginStart: 20, flex: 1 }}>
                  <Text style={{ color: "#000000" }}>To</Text>
                  <Text
                    style={{ fontSize: 18, color: "#000000", fontWeight: "600" }}
                    onPress={this.setModalVisible("modalTo", true)}>
                    {to}
                  </Text>
                </View>
              </View>
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
                  style={{ width: 40, height: 40, tintColor: "#000000" }}
                  source={require("../../assets/imgs/calender.png")}
                />
                <Button
                  style={{
                    flex: 1,
                    paddingStart: 20
                  }}
                  onPress={this.showDateTimePicker("fromDTpicker")}>
                  <Text style={{ color: "#000000" }}>Depart</Text>

                  <Text style={{ fontSize: 18, color: "#000000", fontWeight: "600" }}>
                    {moment(this.state.CheckIn).format("DD MMM, YY")}
                  </Text>
                  <DateTimePicker
                    isVisible={fromDTpicker}
                    onConfirm={this.handleDatePicked("fromDTpicker")}
                    onCancel={this.hideDateTimePicker("fromDTpicker")}
                    minimumDate={new Date()}
                  />
                </Button>
                {_select_round && (
                  <Button
                    style={{
                      flex: 1,
                      paddingStart: 20
                    }}
                    onPress={this.showDateTimePicker("toDTpicker")}>
                    <Text style={{ color: "#000000" }}>Return</Text>
                    <Text style={{ fontSize: 18, color: "#000000", fontWeight: "600" }}>
                      {moment(this.state.CheckOut).format("DD MMM, YY")}
                    </Text>
                    <DateTimePicker
                      isVisible={toDTpicker}
                      onConfirm={this.handleDatePicked("toDTpicker")}
                      onCancel={this.hideDateTimePicker("toDTpicker")}
                      minimumDate={this.state.CheckIn}
                    />
                  </Button>
                )}
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

            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.modalFrom}
              onRequestClose={this.setModalVisible("modalFrom", false)}>
              <AutoCompleteModal
                placeholder="Enter Source"
                //visible={this.state.modalTo}
                type="bus"
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
                type="bus"
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

const styles = StyleSheet.create({
  tabButton: {
    elevation: 1,
    height: 30,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOpacity: 1,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    shadowRadius: 4,
    justifyContent: "center",
    paddingHorizontal: 45
  }
});

export default Bus;
