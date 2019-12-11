import React, { PureComponent } from "react";
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Modal
} from "react-native";
import { Button, Text, ActivityIndicator, DomesticFlights, Icon } from "../../components";
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";
import Foundation from "react-native-vector-icons/Foundation";
import { etravosApi } from "../../service";
import moment from "moment";
import { withNavigation } from "react-navigation";
import Toast from "react-native-simple-toast";
class RenderRound extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  _SelectedSeat = (item, index) => () => {
    console.log("render....");
    const { tripType, sourceName, destinationName, TripType } = this.props;
    this.props.getBus(item, index);
    this.props.navigation.navigate("Seats", {
      params: item,
      tripType,
      sourceName,
      destinationName,
      TripType
    });
  };

  _onCanPolicy = () => {};

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
          <View>
            <Text style={{ fontSize: 18, lineHeight: 20 }}>{item.DisplayName}</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
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
            <Text style={{ paddingStart: 5, fontWeight: "700", color: "#6287F9" }}>
              Cancellation Policy
            </Text>
          </Button>
        </View>
      </TouchableOpacity>
    );
  }
}

export default withNavigation(RenderRound);
