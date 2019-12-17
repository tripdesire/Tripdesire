import React from "react";
import { View, Image, Modal, StyleSheet, SafeAreaView } from "react-native";
import { Button, Text, AutoCompleteModal } from "../../components";
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import { Header } from "../../components";

class Bus extends React.PureComponent {
  constructor(props) {
    super(props);
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
      TripType: 1
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
    this.setState({
      from: this.state.to,
      sourceName: this.state.destinationName,
      destinationName: this.state.sourceName,
      sourceId: this.state.destinationId,
      destinationId: this.state.sourceId,
      to: this.state.from
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
    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "#E5EBF7" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <View style={{ flexDirection: "column", flex: 1 }}>
            <View style={{ backgroundColor: "#E4EAF6", height: 80 }}>
              <Header firstName="Bus" lastName="Search" />
            </View>

            <View style={{ height: 30, width: "100%" }}>
              <View style={{ flex: 2, backgroundColor: "#E4EAF6" }}></View>
              <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}></View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  ...StyleSheet.absoluteFill
                }}>
                <Button
                  style={{
                    backgroundColor: TripType == 1 ? "#5B89F9" : "#FFFFFF",
                    borderBottomStartRadius: 5,
                    borderTopStartRadius: 5,
                    ...styles.tabButton
                  }}
                  onPress={() => this._triptype("onewway")}>
                  <Text
                    style={{
                      color: TripType == 1 ? "#ffffff" : "#5D666D",
                      fontSize: 16,
                      fontWeight: "600"
                    }}>
                    Oneway
                  </Text>
                </Button>
                <Button
                  style={{
                    backgroundColor: TripType == 2 ? "#5B89F9" : "#FFFFFF",
                    borderBottomEndRadius: 5,
                    borderTopEndRadius: 5,
                    ...styles.tabButton
                  }}
                  onPress={() => this._triptype("round")}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: TripType == 2 ? "#ffffff" : "#5D666D"
                    }}>
                    Round
                  </Text>
                </Button>
              </View>
            </View>

            <View style={{ backgroundColor: "#FFFFFF", flex: 4 }}>
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
                      style={{ fontSize: 18, color: "#5D666D", fontWeight: "600" }}
                      onPress={this.setModalVisible("modalFrom", true)}>
                      {from}
                    </Text>
                  </View>
                  <Button style={{ justifyContent: "center" }} onPress={this._exchange}>
                    <IconMaterial name="swap-vertical" color="#5D666D" size={40} />
                  </Button>
                </View>
              </View>
              <View
                style={{ height: 1.35, marginHorizontal: 16, backgroundColor: "#CFCFCF" }}></View>
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
                    style={{ fontSize: 18, color: "#5D666D", fontWeight: "600" }}
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
                  style={{ width: 25, resizeMode: "contain", marginStart: 10 }}
                  source={require("../../assets/imgs/cal.png")}
                />
                <Button
                  style={{
                    flex: 1,
                    paddingStart: 20
                  }}
                  onPress={this.showDateTimePicker("fromDTpicker")}>
                  <Text style={{ color: "#5D666D" }}>Depart</Text>

                  <Text style={{ fontSize: 18, color: "#5D666D", fontWeight: "600" }}>
                    {moment(this.state.CheckIn).format("DD-MMM-YYYY")}
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
                    <Text style={{ color: "#5D666D" }}>Return</Text>
                    <Text style={{ fontSize: 18, color: "#5D666D", fontWeight: "600" }}>
                      {moment(this.state.CheckOut).format("DD-MMM-YYYY")}
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
    shadowRadius: 4,
    justifyContent: "center",
    paddingHorizontal: 45
  }
});

export default Bus;
