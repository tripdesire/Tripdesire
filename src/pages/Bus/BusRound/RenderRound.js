import React, { PureComponent } from "react";
import { View, SafeAreaView, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { Button, Text, ActivityIndicator, DomesticFlights, Icon } from "../../../components";
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";
import Foundation from "react-native-vector-icons/Foundation";
import { etravosApi } from "../../../service";
import moment from "moment";
import { withNavigation } from "react-navigation";
import Toast from "react-native-simple-toast";
class RenderRound extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      CancellationPolicy: false
    };
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
    return (
      <TouchableOpacity
        style={{
          paddingVertical: index % 2 == 0 ? 40 : 20,
          backgroundColor: index % 2 == 0 ? "#FFFFFF" : "#E5EBF7"
        }}
        onPress={this._SelectedSeat(item, index)}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginHorizontal: 16
          }}>
          <Text style={{ flex: 1, fontWeight: "700" }}>{item.BusType}</Text>
          <Button
            style={{
              backgroundColor: "#5191FB",
              borderRadius: 20,
              paddingHorizontal: 10,
              paddingVertical: 5
            }}
            onPress={this._SelectedSeat(item)}>
            <Text style={{ color: "#fff", fontWeight: "600" }}>Select Seats</Text>
          </Button>
        </View>
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 16,
            alignItems: "center",
            marginVertical: 10
          }}>
          <IconMaterial name="bus" size={50} color="#6287F9" />
          <View style={{ flexShrink: 1 }}>
            <Text style={{ fontSize: 18, lineHeight: 20 }}>{item.DisplayName}</Text>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontSize: 16, lineHeight: 18 }}>{item.DepartureTime}</Text>
              <Text style={{ fontSize: 16, lineHeight: 18 }}> | </Text>
              <Text style={{ color: "#ADADAF", alignSelf: "center", lineHeight: 18 }}>
                {item.Duration}
              </Text>
              <Text style={{ fontSize: 16, lineHeight: 18 }}> | </Text>
              <Text style={{ fontSize: 16, lineHeight: 18 }}>{item.ArrivalTime}</Text>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: "row", marginHorizontal: 16 }}>
          <Text style={{ flex: 1, paddingEnd: 10 }}>Rs. {item.Fares}</Text>
          <Button
            style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}
            onPress={this._onCanPolicy}>
            <Icon type="FontAwesome" name="mobile-phone" size={24} color="#6287F9" />
            <Text style={{ paddingStart: 5, fontWeight: "700", color: "#6287F9", zIndex: 1 }}>
              Cancellation Policy
            </Text>
          </Button>
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
        <SafeAreaView style={{ flex: 0, backgroundColor: "#ffffff" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <View>
            <View style={styles.headerContainer}>
              <Button onPress={this.props.onBackPress} style={{ padding: 16 }}>
                <Icon name="md-arrow-back" size={24} />
              </Button>
              <Text style={{ fontWeight: "700", fontSize: 16 }}>Cancellation Policy</Text>
            </View>
            <View style={{ marginHorizontal: 16 }}>
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
    backgroundColor: "#FFFFFF"
  }
});

export default withNavigation(RenderRound);
