import React, {PureComponent} from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView
} from "react-native";
import {Button, Text, Activity_Indicator, HeaderFlights, Icon} from "../../components";
import Toast from "react-native-simple-toast";
import {withNavigation} from "react-navigation";
import SwiperFlatList from "react-native-swiper-flatlist";
import Service from "../../service";
import moment from "moment";
import RenderDomesticRound from "./RenderDomesticRound";

const {width, height} = Dimensions.get("window");

class FlightsInfoRound extends React.PureComponent {
  constructor(props) {
    super();
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
      flight_type: "",
      onwardFlights: [],
      returnFlights: [],
      onwardFare: "",
      returnFare: "",
      loader: true,
      index: 0,
      swiperIndex: 0,
      selectedOnward: 0,
      selectedReturn: 0,
      sourceCode: "",
      destinationCode: "",
      sourceAirportName: "",
      destinationAirportName: ""
    };
  }

  componentDidMount() {
    let data = this.props.navigation.state.params;

    let jd = moment(data.journeyDate, "DD-MM-YYYY").format("DD MMM");
    let rt = moment(data.returnDate, "DD-MM-YYYY").format("DD MMM");
    this.setState({
      from: data.sourceName,
      to: data.destinationName,
      className: data.className,
      travelClass: data.travelClass,
      journey_date: jd,
      return_date: rt,
      journeyDate: data.journeyDate,
      returnDate: data.returnDate,
      Adult: data.adults,
      Child: data.children,
      Infant: data.infants,
      flight_type: data.flightType,
      sourceCode: data.source,
      destinationCode: data.destination,
      sourceAirportName: data.sourceAirportName,
      destinationAirportName: data.destinationAirportName
    });
    Service.get("/Flights/AvailableFlights", data)
      .then(({data}) => {
        if (data.DomesticOnwardFlights.length > 1) {
          this._getDomesticFlightOnward(data.DomesticOnwardFlights[0], 0);
        }
        if (data.DomesticReturnFlights.length > 1) {
          this._getDomesticFlightReturn(data.DomesticReturnFlights[0], 0);
        }
        this.setState({
          onwardFlights: data.DomesticOnwardFlights,
          returnFlights: data.DomesticReturnFlights,
          loader: false
        });
      })
      .catch(error => {
        Toast.show(error, Toast.LONG);
        this.setState({loader: false});
      });
  }

  _getDomesticFlightOnward = (value, index) => {
    this.setState({
      onwardFare: value.FareDetails.TotalFare,
      selectedOnward: index
    });
  };

  _getDomesticFlightReturn = (value, index) => {
    this.setState({
      returnFare: value.FareDetails.TotalFare,
      selectedReturn: index
    });
  };

  _bookNow = () => {
    console.log("hey");
    const {returnFlights, onwardFlights, selectedOnward, selectedReturn} = this.state;
    let param = {
      arrivalFlight: returnFlights[selectedReturn],
      departFlight: onwardFlights[selectedOnward],
      flightType: 1,
      tripType: 2,
      from: this.state.from,
      to: this.state.to,
      className: this.state.className,
      travelClass: this.state.travelClass,
      adult: this.state.Adult,
      child: this.state.Child,
      infant: this.state.Child,
      journey_date: this.state.journey_date,
      return_date: this.state.return_date,
      journeyDate: this.state.journeyDate,
      returnDate: this.state.returnDate,
      Adult: this.state.Adult,
      Child: this.state.Child,
      Infant: this.state.Infant,
      sourceCode: this.state.sourceCode,
      destinationCode: this.state.destinationCode,
      sourceAirportName: this.state.sourceAirportName,
      destinationAirportName: this.state.destinationAirportName
    };

    this.props.navigation.navigate("CheckOut", param);
  };

  _onPress = value => () => {
    if (value == "Depart") {
      this.scrollRef.scrollToIndex({index: 0});
    } else if (value == "Return") {
      this.scrollRef.scrollToIndex({index: 1});
    }
  };

  _onChangeIndex = ({index}) => {
    this.setState({swiperIndex: index});
  };

  _renderItemOnward = ({item, index}) => {
    return (
      <RenderDomesticRound
        item={item}
        index={index}
        from={this.state.from}
        to={this.state.to}
        selected={index == this.state.selectedOnward}
        getDomesticFlights={this._getDomesticFlightOnward}
        className={this.state.className}
        travelClass={this.state.travelClass}
        journeyDate={this.state.journeyDate}
        returnDate={this.state.returnDate}
        sourceCode={this.state.sourceCode}
        destinationCode={this.state.destinationCode}
        sourceAirportName={this.state.sourceAirportName}
        destinationAirportName={this.state.destinationAirportName}
        trip_type={2}
        flight_type={1}
      />
    );
  };

  _renderItemReturn = ({item, index}) => {
    return (
      <RenderDomesticRound
        item={item}
        index={index}
        selected={index == this.state.selectedReturn}
        getDomesticFlights={this._getDomesticFlightReturn}
        from={this.state.to}
        to={this.state.from}
        className={this.state.className}
        travelClass={this.state.travelClass}
        journeyDate={this.state.journeyDate}
        returnDate={this.state.returnDate}
        sourceCode={this.state.sourceCode}
        destinationCode={this.state.destinationCode}
        sourceAirportName={this.state.sourceAirportName}
        destinationAirportName={this.state.destinationAirportName}
        trip_type={2}
        flight_type={1}
      />
    );
  };

  _keyExtractorOnward = (item, index) => "OnwardFlights_" + index;

  _keyExtractorReturn = (item, index) => "ReturnFlights_" + index;

  render() {
    const {
      from,
      to,
      journey_date,
      return_date,
      loader,
      Adult,
      Child,
      Infant,
      className,
      index,
      onwardFare,
      returnFare,
      swiperIndex,
      flight_type
    } = this.state;
    return (
      <>
        <SafeAreaView style={{flex: 0, backgroundColor: "#E5EBF7"}} />
        <SafeAreaView style={{flex: 1, backgroundColor: "#ffffff"}}>
          <View style={{flex: 1, backgroundColor: "#FFFFFF"}}>
            <HeaderFlights
              from={from}
              to={to}
              journey_date={journey_date}
              return_date={return_date}
              Adult={Adult}
              Child={Child}
              Infant={Infant}
              className={className}
              style={{backgroundColor: "#E5EBF7", paddingBottom: 8}}>
              <Button
                style={{
                  flexDirection: "row",
                  marginStart: "auto",
                  paddingEnd: 8,
                  paddingVertical: 16
                }}
                //onPress={this.openFilter}
              >
                <Icon name="filter" size={20} color="#5D89F4" type="MaterialCommunityIcons" />
                <Text style={{fontSize: 12, marginHorizontal: 5, color: "#717984"}}>
                  Sort & Filter
                </Text>
              </Button>
            </HeaderFlights>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                margin: 16,
                alignItems: "center"
              }}>
              <View>
                <Text style={{color: "#5F6D78"}}>Departure</Text>
                <Text style={{color: "#212C4C", fontSize: 18, fontWeight: "700"}}>
                  $ {onwardFare}
                </Text>
              </View>
              <View>
                <Text style={{color: "#5F6D78"}}>Return</Text>
                <Text style={{color: "#212C4C", fontSize: 18, fontWeight: "700"}}>
                  $ {returnFare}
                </Text>
              </View>
              <View>
                <Text style={{color: "#5F6D78"}}>Total</Text>
                <Text style={{color: "#212C4C", fontSize: 18, fontWeight: "700"}}>
                  $ {onwardFare + returnFare}
                </Text>
              </View>
              <Button
                style={{backgroundColor: "#F68E1F", borderRadius: 15}}
                onPress={this._bookNow}>
                <Text style={{color: "#fff", paddingHorizontal: 10, paddingVertical: 4}}>
                  Book Now
                </Text>
              </Button>
            </View>
            <View
              style={{
                backgroundColor: "#DEDEDE",
                height: 1,
                marginHorizontal: 16,
                marginVertical: 10
              }}
            />
            <View
              style={{
                backgroundColor: "#FFFFFF",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginHorizontal: 16
              }}>
              <Button
                style={[styles.tabBtn, {backgroundColor: swiperIndex == 0 ? "#5B89F9" : "#ffffff"}]}
                onPress={this._onPress("Depart")}>
                <Text style={{fontSize: 12, color: swiperIndex == 0 ? "#ffffff" : "#000000"}}>
                  Depart
                </Text>
              </Button>
              <Button
                style={[styles.tabBtn, {backgroundColor: swiperIndex == 1 ? "#5B89F9" : "#ffffff"}]}
                onPress={this._onPress("Return")}>
                <Text style={{fontSize: 12, color: swiperIndex == 1 ? "#ffffff" : "#000000"}}>
                  Return
                </Text>
              </Button>
            </View>

            <SwiperFlatList
              index={index}
              ref={ref => (this.scrollRef = ref)}
              onChangeIndex={this._onChangeIndex}>
              <FlatList
                data={this.state.onwardFlights}
                keyExtractor={this._keyExtractorOnward}
                renderItem={this._renderItemOnward}
                contentContainerStyle={{width, paddingHorizontal: 8}}
                extraData={this.state.selectedOnward}
              />
              <FlatList
                data={this.state.returnFlights}
                keyExtractor={this._keyExtractorReturn}
                renderItem={this._renderItemReturn}
                contentContainerStyle={{width, paddingHorizontal: 8}}
                extraData={this.state.selectedReturn}
              />
            </SwiperFlatList>
            {loader && <Activity_Indicator />}
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  tabBtn: {
    elevation: 1,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    height: 40,
    justifyContent: "center",
    paddingHorizontal: 50,
    borderRadius: 20
  }
});

export default withNavigation(FlightsInfoRound);
