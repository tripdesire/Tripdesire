import React from "react";
import { View, Image, StyleSheet, Picker, Modal } from "react-native";
import { withNavigation } from "react-navigation";
import { Button, Text, AutoCompleteModal, Icon } from "../../components";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";

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
      from: "DEL, Delhi",
      to: "BOM, Mumbai",
      sourceName: "Delhi",
      sourceAirportName: "New Delhi, India - (DEL) - Indira Gandhi International",
      destinationAirportName: "Mumbai, India - (BOM) - Chhatrapati Shivaji International",
      destinationName: "Mumbai",
      fromCode: "DEL",
      ToCode: "BOM",
      Journey_date: new Date(),
      Return_date: new Date(),
      tripTypeColorOneway: "#000000",
      tripTypeColorRound: "#BDC4CA",
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
    if (this.state.tripType == 1) {
      this.props.navigation.navigate("FlightsInfoOneway", params);
    } else if (this.state.tripType == 2) {
      this.props.navigation.navigate("FlightsInfoRound", params);
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
      Return_date
    } = this.state;

    let classItems = this.state.className.map((item, i) => {
      return <Picker.Item key={i} value={item.value} label={item.label} />;
    });
    return (
      <View>
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
          <View
            style={{
              flex: 1,
              paddingStart: 20,
              position: "relative"
            }}>
            <Text style={{ color: "#5D666D" }}>From:</Text>
            <Text style={{ color: "#5D666D" }} onPress={this.setModalVisible("modalFrom", true)}>
              {from}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              paddingStart: 20
            }}>
            <Text style={{ color: "#5D666D" }}>To:</Text>
            <Text style={{ color: "#5D666D" }} onPress={this.setModalVisible("modalTo", true)}>
              {to}
            </Text>
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
              <Text>{moment(Journey_date).format("DD-MMM-YYYY")}</Text>
            </Button>
            <DateTimePicker
              isVisible={fromDTpicker}
              onConfirm={this.handleDatePicked("fromDTpicker")}
              onCancel={this.hideDateTimePicker("fromDTpicker")}
              minimumDate={new Date()}
            />
          </View>
          {selectRound && (
            <View
              style={{
                flex: 1,
                paddingStart: 20
              }}>
              <Text style={{ color: "#5D666D", marginStart: 5 }}>Return</Text>
              <Button
                style={{ flex: 1, marginStart: 5 }}
                onPress={this.showDateTimePicker("toDTpicker")}>
                <Text>{moment(Return_date).format("DD-MMM-YYYY")}</Text>
              </Button>
              <DateTimePicker
                isVisible={toDTpicker}
                onConfirm={this.handleDatePicked("toDTpicker")}
                onCancel={this.hideDateTimePicker("fromDTpicker")}
                minimumDate={new Date()}
              />
            </View>
          )}
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
            <Text style={{ color: "#5D666D", marginStart: 5 }}>Passengers:</Text>
            <View style={{ flexDirection: "row", flex: 1, paddingStart: 5 }}>
              <Button
                style={{
                  backgroundColor: "#F68E1F",
                  height: 25,
                  justifyContent: "center",
                  borderRadius: 12
                }}
                onPress={this.setModalVisible("modalPassengers", true)}>
                <Text style={{ color: "#fff", paddingHorizontal: 15 }}>ADD</Text>
              </Button>
            </View>
          </View>
          <View style={{ flex: 1, paddingStart: 20 }}>
            <Text style={{ color: "#5D666D", marginStart: 5 }}>Class</Text>
            <Picker
              selectedValue={this.state.class}
              style={{ height: 30, width: "100%" }}
              onValueChange={itemValue => this.setState({ class: itemValue })}>
              {classItems}
            </Picker>
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

class AddPassengers extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      adult: "1",
      children: "0",
      infants: "0"
    };
  }

  _submit = () => {
    this.props.submit && this.props.submit(this.state);
  };

  render() {
    return (
      <View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Button
            onPress={this.props.onModalBackPress}
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: 48,
              width: 48
            }}>
            <Icon name="md-arrow-back" size={24} />
          </Button>
          <Text style={{ fontSize: 18 }}>Choose Passengers</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 20,
            marginVertical: 10
          }}>
          <View style={{ alignItems: "center" }}>
            <Text>Adults</Text>
            <Picker
              selectedValue={this.state.adult}
              style={{
                height: 50,
                width: 80,
                borderWidth: 1,
                borderRadius: 5,
                borderColor: "#000"
              }}
              onValueChange={itemValue => this.setState({ adult: itemValue })}>
              <Picker.Item label="1" value="1" />
              <Picker.Item label="2" value="2" />
              <Picker.Item label="3" value="3" />
              <Picker.Item label="4" value="4" />
            </Picker>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text>childrens</Text>
            <Picker
              selectedValue={this.state.children}
              style={{ height: 50, width: 80 }}
              onValueChange={itemValue => this.setState({ children: itemValue })}>
              <Picker.Item label="0" value="0" />
              <Picker.Item label="1" value="1" />
              <Picker.Item label="2" value="2" />
              <Picker.Item label="3" value="3" />
              <Picker.Item label="4" value="4" />
            </Picker>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text>Infants</Text>
            <Picker
              selectedValue={this.state.infants}
              style={{ height: 50, width: 80 }}
              onValueChange={itemValue => this.setState({ infants: itemValue })}>
              <Picker.Item label="0" value="0" />
              <Picker.Item label="1" value="1" />
              <Picker.Item label="2" value="2" />
              <Picker.Item label="3" value="3" />
              <Picker.Item label="4" value="4" />
            </Picker>
          </View>
        </View>
        <Button
          style={{
            height: 40,
            backgroundColor: "#F68E1F",
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 20,
            borderRadius: 20
          }}
          onPress={this._submit}>
          <Text style={{ paddingHorizontal: 40, color: "#fff" }}>Submit</Text>
        </Button>
      </View>
    );
  }
}

export default withNavigation(DomesticFlights);
