import React, { PureComponent } from "react";
import { View, Image, Modal, StyleSheet, TouchableOpacity } from "react-native";
import { Button, Text } from "../../components";
import Icon from "react-native-vector-icons/AntDesign";
import IconIonics from "react-native-vector-icons/Ionicons";
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwsm from "react-native-vector-icons/FontAwesome";
import Autocomplete from "react-native-autocomplete-input";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import Service from "../../service";
import { Header } from "../../components";
import { connect } from "react-redux";

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
      show_CheckIn: false,
      show_CheckOut: false,
      mode: "date",
      tripType: 1,
      backgroundColor_oneway: "#5B89F9",
      Button_text_color_oneway: "#FFFFFF",
      Button_text_color_round: "#000000",
      backgroundColor_round: "#FFFFFF",
      isselect: true,
      _select_round: false,
      suggestions: []
    };
  }

  componentDidMount() {
    this.setState({ suggestions: this.props.busSuggestion });
  }

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
      backgroundColor_oneway: value == "onewway" ? "#5B89F9" : "#FFFFFF",
      backgroundColor_round: value == "onewway" ? "#FFFFFF" : "#5B89F9",
      Button_text_color_oneway: value == "onewway" ? "#ffffff" : "#000000",
      Button_text_color_round: value == "onewway" ? "#000000" : "#ffffff",
      _select_round: value == "round" ? true : false,
      tripType: value == "round" ? 2 : 1
    });
  };

  _search = () => {
    let params = {
      sourceName: this.state.sourceName,
      destinationName: this.state.destinationName,
      sourceId: this.state.sourceId,
      destinationId: this.state.destinationId,
      journeyDate: moment(this.state.CheckIn).format("DD-MM-YYYY"),
      returnDate: moment(this.state.CheckOut).format("DD-MM-YYYY"),
      tripType: this.state.tripType,
      userType: 5,
      user: ""
    };
    console.log(params);
    this.props.navigation.navigate("BusInfo", params);
  };

  render() {
    const {
      from,
      to,
      show_CheckIn,
      show_CheckOut,
      CheckIn,
      CheckOut,
      mode,
      backgroundColor_oneway,
      backgroundColor_round,
      Button_text_color_oneway,
      Button_text_color_round,
      _select_round
    } = this.state;
    return (
      <View style={{ flexDirection: "column", flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: "#E4EAF6" }}>
          <Header
            firstName="Bus"
            lastName="Search"
            onPress={() => this.props.navigation.goBack(null)}
          />
        </View>

        <View style={{ height: 30, width: "100%" }}>
          <View style={{ flex: 2, backgroundColor: "#E4EAF6" }}></View>
          <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}></View>
          <View
            style={{ flexDirection: "row", justifyContent: "center", ...StyleSheet.absoluteFill }}>
            <Button
              style={{
                backgroundColor: backgroundColor_oneway,
                elevation: 1,
                height: 30,
                justifyContent: "center",
                paddingHorizontal: 60,
                borderBottomStartRadius: 5,
                borderTopStartRadius: 5
              }}
              onPress={() => this._triptype("onewway")}>
              <Text style={{ color: Button_text_color_oneway, fontSize: 12 }}>Oneway</Text>
            </Button>
            <Button
              style={{
                backgroundColor: backgroundColor_round,
                elevation: 1,
                height: 30,
                justifyContent: "center",
                paddingHorizontal: 60,
                borderBottomEndRadius: 5,
                borderTopEndRadius: 5
              }}
              onPress={() => this._triptype("round")}>
              <Text
                style={{
                  fontSize: 12,
                  color: Button_text_color_round
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
                <Text style={{ fontSize: 18 }} onPress={this.setModalVisible("modalFrom", true)}>
                  {from}
                </Text>
              </View>
              <Button style={{ justifyContent: "center" }} onPress={this._exchange}>
                <IconMaterial name="swap-vertical" size={40} />
              </Button>
            </View>
          </View>
          <View style={{ height: 1.35, marginHorizontal: 16, backgroundColor: "#CFCFCF" }}></View>
          <View
            style={{
              marginHorizontal: 16,
              marginVertical: 20,
              flexDirection: "row"
            }}>
            <IconMaterial name="bus" size={40} color="#A5A9AC" />
            <View style={{ marginStart: 20, flex: 1 }}>
              <Text style={{ color: "#5D666D" }}>To</Text>
              <Text style={{ fontSize: 18 }} onPress={this.setModalVisible("modalTo", true)}>
                {to}
              </Text>
            </View>
          </View>
          <View style={{ height: 1.35, marginHorizontal: 16, backgroundColor: "#CFCFCF" }}></View>

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
              <Button style={{ flex: 1, marginStart: 5 }} onPress={this.show("date")}>
                <Text style={{ fontSize: 18 }}>
                  {moment(this.state.CheckIn).format("DD-MMM-YYYY")}
                </Text>
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
            {_select_round && (
              <View
                style={{
                  flex: 1,
                  paddingStart: 20
                }}>
                <Text style={{ color: "#5D666D", marginStart: 5 }}>Return</Text>
                <Button style={{ flex: 1, marginStart: 5 }} onPress={this.showTo("date")}>
                  <Text style={{ fontSize: 18 }}>
                    {moment(this.state.CheckOut).format("DD-MMM-YYYY")}
                  </Text>
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
        <AutoCompleteModal
          placeholder="Enter Source"
          visible={this.state.modalFrom}
          suggestions={this.state.suggestions}
          onChange={this.handleFrom}
          onModalBackPress={this.setModalVisible("modalFrom", false)}
        />
        <AutoCompleteModal
          placeholder="Enter Destination"
          visible={this.state.modalTo}
          suggestions={this.state.suggestions}
          onChange={this.handleTo}
          onModalBackPress={this.setModalVisible("modalTo", false)}
        />
      </View>
    );
  }
}

class AutoCompleteModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      filteredList: this.props.suggestions
    };
  }

  filterList = text => {
    console.log(text);
    let filteredList = this.props.suggestions.filter(item =>
      item.Name.toLowerCase().includes(text.toLowerCase())
    );
    this.setState({ filteredList });
  };

  handleItemChange = item => () => {
    this.props.onChange && this.props.onChange(item);
  };

  renderItem = ({ item, i }) => (
    <TouchableOpacity
      style={{
        backgroundColor: "#FFFFFF",
        height: 30,
        justifyContent: "center",
        marginHorizontal: 10
      }}
      onPress={this.handleItemChange(item)}>
      <Text>
        {item.Name}, {item.Id} - (India)
      </Text>
    </TouchableOpacity>
  );

  keyExtractor = (item, index) => item.Name + index;

  render() {
    return (
      <Modal animationType="slide" transparent={false} visible={this.props.visible}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Button
            onPress={this.props.onModalBackPress}
            style={{ alignItems: "center", justifyContent: "center", height: 48, width: 48 }}>
            <IconIonics name="md-arrow-back" size={24} />
          </Button>
          <View style={styles.autocompleteContainer}>
            <Autocomplete
              placeholder={this.props.placeholder}
              inputContainerStyle={{ borderWidth: 0, height: 48, justifyContent: "center" }}
              data={this.state.filteredList}
              onChangeText={this.filterList}
              listStyle={{ maxHeight: 300 }}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
            />
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  autocompleteContainer: {
    flex: 1,
    start: 48,
    position: "absolute",
    end: 0,
    top: 0,
    zIndex: 1
  }
});

const mapStateToProps = state => ({
  busSuggestion: state.busSuggestion
});

export default connect(mapStateToProps, null)(Bus);
