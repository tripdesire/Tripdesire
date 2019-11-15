import React, { PureComponent } from "react";
import {
  View,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Picker,
  ScrollView,
  Modal
} from "react-native";
import { withNavigation } from "react-navigation";
import Button from "./Button";
import Text from "./TextComponent";
import Service from "../service";
import Autocomplete from "react-native-autocomplete-input";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import Icon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
class InternationalFlights extends React.PureComponent {
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
      flightType: 2,
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
      destinationName: "Mumbai",
      fromCode: "DEL",
      ToCode: "BOM",
      sourceAirportName: "New Delhi, India - (DEL) - Indira Gandhi International",
      destinationAirportName: "Mumbai, India - (BOM) - Chhatrapati Shivaji International",
      Journey_date: new Date(),
      Return_date: new Date(),
      mode: "date",
      show: false,
      showTo: false,
      backgroundColor_domestic: "#5B89F9",
      Button_text_color_domestic: "#FFFFFF",
      Button_text_color_international: "#000000",
      backgroundColor_international: "#FFFFFF",
      tripTypeColorOneway: "#000000",
      tripTypeColorRound: "#BDC4CA",
      selectRound: false
    };
  }

  componentDidMount() {
    this.setState({ suggestions: this.props.internationalSuggestion });
    // Service.get("/Flights/Airports?flightType=2")
    //   .then(({ data }) => {
    //     this.setState({ suggestions: data });
    //   })
    //   .catch(() => {});
    // console.log("mount");
  }

  setDate = (event, date) => {
    date = date || this.state.Journey_date;
    this.setState({
      show: Platform.OS === "ios" ? true : false,
      Journey_date: date
    });
  };

  setDateTo = (event, date) => {
    date = date || this.state.Return_date;
    this.setState({
      showTo: Platform.OS === "ios" ? true : false,
      Return_date: date
    });
  };

  show = mode => () => {
    this.setState({
      show: true,
      mode
    });
  };

  showTo = mode => () => {
    this.setState({
      showTo: true,
      mode
    });
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
      flightType: 2,
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
    console.log(this.state.tripType);
    if (this.state.tripType == 1) {
      this.props.navigation.navigate("FlightsInfoOneway", params);
    } else if (this.state.tripType == 2) {
      this.props.navigation.navigate("FlightInfoRoundInt", params);
    }
  };

  render() {
    const {
      from,
      to,
      show,
      showTo,
      Journey_date,
      Return_date,
      mode,
      backgroundColor_domestic,
      backgroundColor_international,
      Button_text_color_domestic,
      Button_text_color_international,
      tripTypeColorOneway,
      tripTypeColorRound,
      selectRound
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
            source={require("../assets/imgs/white-arrow-left-side.png")}
          />
          <Button
            style={{ justifyContent: "center" }}
            onPress={() => this._SelectTripType("oneway")}>
            <Text style={{ color: tripTypeColorOneway }}>One Way</Text>
          </Button>
          <Image
            style={{ width: 25, resizeMode: "contain", marginHorizontal: 5 }}
            source={require("../assets/imgs/Round-trip-arrow.png")}
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
            source={require("../assets/imgs/flights-1.png")}
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
            source={require("../assets/imgs/cal.png")}
          />
          <View
            style={{
              flex: 1,
              paddingStart: 20
            }}>
            <Text style={{ color: "#5D666D", marginStart: 5 }}>Depart</Text>
            <Button style={{ flex: 1, marginStart: 5 }} onPress={this.show("date")}>
              <Text>{moment(this.state.Journey_date).format("DD-MMM-YYYY")}</Text>
            </Button>
            {show && (
              <RNDateTimePicker
                display="calendar"
                value={Journey_date}
                mode={mode}
                minimumDate={new Date()}
                onChange={this.setDate}
              />
            )}
          </View>
          {selectRound && (
            <View
              style={{
                flex: 1,
                paddingStart: 20
              }}>
              <Text style={{ color: "#5D666D", marginStart: 5 }}>Return</Text>
              <Button style={{ flex: 1, marginStart: 5 }} onPress={this.showTo("date")}>
                <Text>{moment(this.state.Return_date).format("DD-MMM-YYYY")}</Text>
              </Button>
              {showTo && (
                <RNDateTimePicker
                  display="calendar"
                  value={Return_date}
                  mode={mode}
                  minimumDate={new Date()}
                  onChange={this.setDateTo}
                />
              )}
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
            source={require("../assets/imgs/person.png")}
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
                onPress={this.setPassengers}>
                <Text style={{ color: "#fff", paddingHorizontal: 15 }}>ADD</Text>
              </Button>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              paddingStart: 20
            }}>
            <Text style={{ color: "#5D666D", marginStart: 5 }}>Class</Text>
            <Picker
              selectedValue={this.state.class}
              style={{ height: 20, width: 110 }}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ class: itemValue, index: itemIndex })
              }>
              {classItems}
              {/* <Picker.Item label="Ecomony" value="E" />
              <Picker.Item label="Premium Economy" value="PE" />
              <Picker.Item label="Business" value="B" />
              <Picker.Item label="First Class" value="F" /> */}
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
        <AddPassengers visible={this.state.modalPassengers} submit={this.submit} />

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
    let filteredList = this.props.suggestions.filter(
      item =>
        item.AirportCode.toLowerCase().includes(text.toLowerCase()) ||
        item.City.toLowerCase().includes(text.toLowerCase())
    );
    this.setState({ filteredList });
  };

  handleItemChange = item => () => {
    this.props.onChange && this.props.onChange(item);
  };

  renderItem = ({ item, i }) => (
    <TouchableOpacity
      style={{
        paddingStart: 8,
        marginVertical: 8,
        justifyContent: "center"
      }}
      onPress={this.handleItemChange(item)}>
      <Text>
        {item.City},{item.Country}-({item.AirportCode})-{item.AirportDesc}
      </Text>
    </TouchableOpacity>
  );

  keyExtractor = (item, index) => item.AirportCode + index;

  render() {
    return (
      <Modal animationType="slide" transparent={false} visible={this.props.visible}>
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
          <View style={styles.autocompleteContainer}>
            <Autocomplete
              placeholder={this.props.placeholder}
              inputContainerStyle={{
                borderWidth: 0,
                height: 48,
                justifyContent: "center"
              }}
              data={this.state.filteredList}
              onChangeText={this.filterList}
              listStyle={{
                maxHeight: 300,
                margin: 0,
                padding: 0,
                borderWidth: 0
              }}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
            />
          </View>
        </View>
      </Modal>
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
      <Modal animationType="slide" transparent={false} visible={this.props.visible}>
        <View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Button
              onPress={this.props.submit}
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
                  width: 60,
                  borderWidth: 1,
                  borderRadius: 5,
                  borderColor: "#000"
                }}
                onValueChange={(itemValue, itemIndex) => this.setState({ adult: itemValue })}>
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
                style={{ height: 50, width: 60 }}
                onValueChange={(itemValue, itemIndex) => this.setState({ children: itemValue })}>
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
                style={{ height: 50, width: 60 }}
                onValueChange={(itemValue, itemIndex) => this.setState({ infants: itemValue })}>
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
  internationalSuggestion: state.internationalSuggestion
});

export default connect(mapStateToProps, null)(withNavigation(InternationalFlights));
