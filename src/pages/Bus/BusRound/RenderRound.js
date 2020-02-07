import React, { PureComponent } from "react";
import { View, SafeAreaView, TouchableOpacity, Modal, StyleSheet, Image } from "react-native";
import { Button, Text, CurrencyText, Icon } from "../../../components";
import { withNavigation } from "react-navigation";
import NumberFormat from "react-number-format";
import moment from "moment";
import analytics from "@react-native-firebase/analytics";

class RenderRound extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      CancellationPolicy: false
    };
  }

  trackScreenView = async screen => {
    // Set & override the MainActivity screen name
    await analytics().setCurrentScreen(screen, screen);
  };
  componentDidMount() {
    this.trackScreenView("Bus OnewWay Render");
  }

  _SelectedSeat = (item, index) => () => {
    this.props.navigation.navigate("SeatOneway", {
      params: item,
      ...this.props.navigation.state.params
    });
  };

  _onCanPolicy = () => {
    this.setState({ CancellationPolicy: true });
  };

  closePolicy = () => {
    this.setState({ CancellationPolicy: false });
  };

  render() {
    const { item, index } = this.props;
    let rupee = item.Fares.split("/", 1);
    return (
      <TouchableOpacity
        style={{
          elevation: 2,
          shadowOffset: { width: 0, height: 2 },
          shadowColor: "rgba(0,0,0,0.1)",
          shadowOpacity: 1,
          shadowRadius: 4,
          marginHorizontal: 8,
          marginTop: 10,
          borderRadius: 8,
          paddingVertical: 10,
          backgroundColor: "#FFFFFF"
        }}
        onPress={this._SelectedSeat(item, index)}>
        <View
          style={{
            flexDirection: "row",
            marginEnd: 8,
            alignItems: "flex-start"
            // marginVertical: 10
          }}>
          <Image
            style={{ width: 45, height: 45, marginEnd: 5 }}
            source={require("../../../assets/imgs/busNew.png")}
          />
          <View style={{ flexShrink: 1 }}>
            <Text>{item.DisplayName}</Text>
            <Text style={{ fontSize: 12, color: "#5D666D" }}>{item.BusType}</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                justifyContent: "space-between"
              }}>
              <Text style={{ fontSize: 18 }}>
                {moment(item.DepartureTime, ["h:mm A"]).format("HH:mm")}
              </Text>
              <Text style={{ color: "#5D666D", fontSize: 16 }}>{item.Duration}</Text>
              <Text style={{ fontSize: 18 }}>
                {moment(item.ArrivalTime, ["h:mm A"]).format("HH:mm")}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 8,
            paddingTop: 8,
            marginTop: 8,
            borderTopWidth: 0.5,
            borderTopColor: "#d2d2d2",
            alignItems: "center",
            flex: 1,
            justifyContent: "space-between"
          }}>
          <Button onPress={this._onCanPolicy}>
            {/* <Icon name="mobile-phone" size={24} color="#6287F9" type="FontAwesome" /> */}
            <Text
              style={{
                fontSize: 12,
                color: "green",
                zIndex: 1
              }}>
              Cancellation Policy
            </Text>
          </Button>
          <Text style={{ fontSize: 16, textAlign: "right", fontWeight: "600" }}>
            <CurrencyText style={{ fontSize: 16, fontWeight: "600" }}>₹</CurrencyText>
            <NumberFormat
              decimalScale={0}
              fixedDecimalScale
              value={parseInt(rupee[0])}
              displayType={"text"}
              thousandSeparator={true}
              thousandsGroupStyle="lakh"
              renderText={value => <Text style={{ fontSize: 16, fontWeight: "600" }}>{value}</Text>}
            />
          </Text>
        </View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.CancellationPolicy}
          onRequestClose={this.closePolicy}>
          <CanPolicy onBackPress={this.closePolicy} />
        </Modal>
      </TouchableOpacity>
    );
  }
}

class CanPolicy extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "#000000" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <View>
            <View style={styles.headerContainer}>
              <Button onPress={this.props.onBackPress} style={{ padding: 16 }}>
                <Icon name="md-arrow-back" size={24} />
              </Button>
              <Text style={{ fontWeight: "700", fontSize: 16 }}>Cancellation Policy</Text>
            </View>
            <View style={{ marginHorizontal: 16, marginTop: 16 }}>
              <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                <Text style={{ fontWeight: "700", flex: 3 }}>Cancellation Time</Text>
                <Text style={{ fontWeight: "700", flex: 1 }}>Cancellation Charge</Text>
              </View>
              <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                <Text style={{ flex: 3 }}>
                  Between 0 days 5 hours and 0 hours before journey time
                </Text>
                <Text style={{ flex: 1 }}>100.0%</Text>
              </View>
              <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                <Text style={{ flex: 3 }}>Between 24 hours and 0 days before journey time</Text>
                <Text style={{ flex: 1 }}>10.0%</Text>
              </View>
              <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                <Text style={{ flex: 3 }}>24 hours before journey time</Text>
                <Text style={{ flex: 1 }}>10.0%</Text>
              </View>
              <Text style={{ color: "red" }}>*Partial cancellation not allowed</Text>
            </View>
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    backgroundColor: "#E5EBF7"
  }
});

export default withNavigation(RenderRound);
