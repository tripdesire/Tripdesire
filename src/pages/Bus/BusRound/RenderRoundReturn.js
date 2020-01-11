import React from "react";
import { View, TouchableOpacity, StyleSheet, Modal, SafeAreaView, Image } from "react-native";
import { Button, Text, Icon } from "../../../components";
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";
import { withNavigation } from "react-navigation";
class RenderRoundReturn extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      CancellationPolicy: false
    };
  }

  _SelectedSeat = (item, index) => () => {
    console.log("render....");
    this.props.navigation.navigate("SeatRound", {
      paramsRound: item,
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
        {/* <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginHorizontal: 16
          }}>
          <Text style={{ flex: 1, fontWeight: "700" }}>{item.BusType}</Text>
          {/* <Button
            style={{
              backgroundColor: "#5191FB",
              borderRadius: 20,
              paddingHorizontal: 10,
              paddingVertical: 5
            }}
            onPress={this._SelectedSeat(item)}>
            <Text style={{ color: "#fff", fontWeight: "600" }}>Select Seats</Text>
          </Button> 
        </View> */}
        <View
          style={{
            flexDirection: "row",
            marginEnd: 8,
            alignItems: "flex-start"
            // marginVertical: 10
          }}>
          <Image
            style={{ width: 70, height: 70 }}
            source={require("../../../assets/imgs/busNew.png")}
          />
          <View style={{ flexShrink: 1, marginTop: 5 }}>
            <Text style={{ fontSize: 14, lineHeight: 20, fontWeight: "400" }}>
              {item.DisplayName}
            </Text>
            <Text style={{ fontWeight: "300", fontSize: 10, lineHeight: 16 }}>{item.BusType}</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 12, lineHeight: 16 }}>{item.DepartureTime}</Text>
              <Text style={{ fontSize: 12, lineHeight: 16 }}> | </Text>
              <Text style={{ color: "#ADADAF", alignSelf: "center", lineHeight: 16, fontSize: 10 }}>
                {item.Duration}
              </Text>
              <Text style={{ fontSize: 12, lineHeight: 16 }}> | </Text>
              <Text style={{ fontSize: 12, lineHeight: 16 }}>{item.ArrivalTime}</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 8,
            justifyContent: "space-between",
            flex: 1
          }}>
          <Button
            style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}
            onPress={this._onCanPolicy}>
            {/* <Icon type="FontAwesome" name="mobile-phone" size={24} color="#6287F9" /> */}
            <Text
              style={{
                paddingStart: 5,
                fontSize: 14,
                fontWeight: "400",
                color: "#6287F9",
                zIndex: 1
              }}>
              Cancellation Policy
            </Text>
          </Button>
          <Text>Rs. {item.Fares}</Text>
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
        <SafeAreaView style={{ flex: 0, backgroundColor: "#E5EBF7" }} />
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

export default withNavigation(RenderRoundReturn);
