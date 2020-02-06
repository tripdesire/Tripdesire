import React, { PureComponent } from "react";
import { View, SafeAreaView, StatusBar } from "react-native";
import { Button, Text, Header, RNPicker, Icon } from "../../components";
import moment from "moment";
import analytics from "@react-native-firebase/analytics";

class Boarding extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log(props.navigation.state.params);
    const { params } = props.navigation.state.params;
    this.state = {
      loader: false,
      bp: params.BoardingTimes[0],
      dp: params.DroppingTimes[0],
      boardingpoints: params.BoardingTimes,
      droppingpoints: params.DroppingTimes
    };
  }

  trackScreenView = async screen => {
    // Set & override the MainActivity screen name
    await analytics().setCurrentScreen(screen, screen);
  };
  componentDidMount() {
    this.trackScreenView("Bus Boarding Dropping");
  }

  _bookNow = () => {
    const { TripType } = this.props.navigation.state.params;
    if (TripType == 1) {
      const { bp, dp } = this.state;
      this.props.navigation.navigate("CheckoutBus", {
        ...this.props.navigation.state.params,
        BoardingPoint: bp,
        DroppingPoint: dp
      });
    } else {
      this.props.navigation.navigate("BusRound");
    }
  };

  getLabel = item => {
    let time = moment()
      .startOf("day")
      .add(item.Time, "minutes")
      .format("hh:mm a");
    return item.Location + " (" + item.Landmark + ") " + time; //rhours + ":" + rminutes
  };

  goBack = () => {
    this.props.navigation.goBack(null);
  };

  render() {
    const { boardingpoints, droppingpoints, bp, dp } = this.state;
    return (
      <>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        <SafeAreaView style={{ flex: 0, backgroundColor: "#000000" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <View>
            <View
              style={{
                backgroundColor: "#E5EBF7",
                flexDirection: "row",
                alignItems: "flex-start",
                padding: 16
              }}>
              <Button onPress={this.goBack}>
                <Icon name="md-arrow-back" size={24} />
              </Button>
              <Text
                style={{
                  fontSize: 18,
                  color: "#1E293B",
                  marginStart: 20,
                  flex: 1,
                  fontWeight: "700",
                  lineHeight: 24,
                  textTransform: "capitalize"
                }}>
                Select Boarding and Dropping Point
              </Text>
            </View>
            <View style={{ marginTop: 40 }}>
              <View style={{ marginHorizontal: 16 }}>
                <Text style={{ color: "#5D666D", marginStart: 10 }}>Boarding Points</Text>
                <RNPicker
                  value={bp}
                  items={boardingpoints}
                  getLabel={this.getLabel}
                  fieldContainerStyle={{ height: 100 }}
                  onItemChange={itemValue => this.setState({ bp: itemValue })}
                />
              </View>
              <View style={{ marginHorizontal: 16 }}>
                <Text style={{ color: "#5D666D", marginStart: 10 }}>Dropping Points</Text>
                <RNPicker
                  value={dp}
                  items={droppingpoints}
                  getLabel={this.getLabel}
                  fieldContainerStyle={{ height: 100 }}
                  onItemChange={itemValue => this.setState({ dp: itemValue })}
                />
              </View>
            </View>
            <Button
              style={{
                backgroundColor: "#F68E1D",
                marginHorizontal: 100,
                alignItems: "center",
                justifyContent: "center",
                height: 36,
                marginVertical: 20,
                borderRadius: 20
              }}
              onPress={this._bookNow}>
              <Text style={{ color: "#fff", alignSelf: "center" }}>Book Now</Text>
            </Button>
          </View>
        </SafeAreaView>
      </>
    );
  }
}

export default Boarding;
