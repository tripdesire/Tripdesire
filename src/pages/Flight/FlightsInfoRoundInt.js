import React, { PureComponent } from "react";
import { Dimensions, Image, StyleSheet, View, FlatList, TouchableOpacity } from "react-native";
import { Button, Text, Activity_Indicator, InternationalFlights } from "../../components";
import Icon from "react-native-vector-icons/Ionicons";
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";
import { withNavigation } from "react-navigation";
import RenderInternationRound from "./RenderInternationRound";
import Service from "../../service";
import moment from "moment";
class FlightsInfoRoundInt extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      from: "",
      to: "",
      journey_date: "",
      return_date: "",
      journeyDate: "",
      returnDate: "",
      className: "",
      travelClass: "",
      Adult: "",
      Child: "",
      Infant: "",
      triptype: "",
      flighttype: "",
      flights: [],
      sourceCode: "",
      destinationCode: "",
      sourceAirportName: "",
      destinationAirportName: "",
      loader: true
    };
  }
  componentDidMount() {
    let data = [];
    data = this.props.navigation.state.params;
    console.log(data);

    let jd = moment(data.journeyDate, "DD-MM-YYYY").format("DD MMM");
    let rd = moment(data.returnDate, "DD-MM-YYYY").format("DD MMM");
    this.setState({
      from: data.sourceName,
      to: data.destinationName,
      travelClass: data.travelClass,
      className: data.className,
      journey_date: jd,
      return_date: rd,
      journeyDate: data.journeyDate,
      returnDate: data.returnDate,
      Adult: data.adults,
      Child: data.children,
      Infant: data.infants,
      triptype: data.tripType,
      flighttype: data.flightType,
      sourceCode: data.source,
      destinationCode: data.destination,
      sourceAirportName: data.sourceAirportName,
      destinationAirportName: data.destinationAirportName
    });

    Service.get("/Flights/AvailableFlights", data).then(({ data }) => {
      console.log(data);
      this.setState({
        flights: data.InternationalFlights,
        loader: false
      });
    });
  }

  _renderItem = ({ item, index }) => {
    return (
      <RenderInternationRound
        item={item}
        index={index}
        from={this.state.from}
        to={this.state.to}
        className={this.state.className}
        travelClass={this.state.travelClass}
        TripType={this.state.triptype}
        FlightType={this.state.flighttype}
        journey_date={this.state.journey_date}
        return_date={this.state.return_date}
        journeyDate={this.state.journeyDate}
        returnDate={this.state.returnDate}
        Adult={this.state.Adult}
        Child={this.state.Child}
        Infant={this.state.Infant}
        sourceCode={this.state.sourceCode}
        destinationCode={this.state.destinationCode}
        sourceAirportName={this.state.sourceAirportName}
        destinationAirportName={this.state.destinationAirportName}
      />
    );
  };

  _keyExtractor = (item, index) => "key" + index;

  render() {
    const {
      flights,
      from,
      to,
      journey_date,
      return_date,
      Adult,
      Child,
      Infant,
      className,
      loader
    } = this.state;
    const { width, height } = Dimensions.get("window");
    return (
      <View style={{ flex: 1 }}>
        <View style={{ backgroundColor: "#E5EBF7", height: 56 }}>
          <View
            style={{
              flexDirection: "row",
              marginHorizontal: 16,
              marginTop: 10
            }}>
            <Button onPress={() => this.props.navigation.goBack(null)}>
              <Icon name="md-arrow-back" size={24} />
            </Button>
            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
                flex: 1
              }}>
              <View>
                <Text
                  style={{
                    fontWeight: "700",
                    fontSize: 16,
                    marginHorizontal: 5
                  }}>
                  {from} To {to}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    marginHorizontal: 5,
                    color: "#717984"
                  }}>
                  {journey_date + " - " + return_date} | {Adult > 0 ? Adult + " Adult" : ""}
                  {Child > 0 ? "," + Child + " Child" : ""}{" "}
                  {Infant > 0 ? "," + Infant + " Infant" : ""} | {className}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "flex-start",
                  flex: 1
                }}>
                <IconMaterial name="filter" fontSize={35} color="#5D89F4" />
                <Text
                  style={{
                    fontSize: 12,
                    marginHorizontal: 5,
                    color: "#717984"
                  }}>
                  Sort & Filter
                </Text>
              </View>
            </View>
          </View>
        </View>
        <FlatList data={flights} keyExtractor={this._keyExtractor} renderItem={this._renderItem} />
        {loader && <Activity_Indicator />}
      </View>
    );
  }
}

export default FlightsInfoRoundInt;
