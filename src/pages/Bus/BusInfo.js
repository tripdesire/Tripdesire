import React, { PureComponent } from "react";
import { View, Image, Modal, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Button, Text, Activity_Indicator } from "../../components";
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";
import IconFontAwsm from "react-native-vector-icons/FontAwesome";
import Icon from "react-native-vector-icons/Ionicons";
import moment from "moment";
import Service from "../../service";

class BusInfo extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      sourceName: "",
      destinationName: "",
      journeyDate: "",
      day: "",
      No_of_buses_Available: "",
      loader: true,
      buses: []
    };
  }

  componentDidMount() {
    const { params } = this.props.navigation.state;
    console.log(params);
    let jd = moment(params.journeyDate, "DD-MM-YYYY").format("DD MMM");
    let day = moment(params.journeyDate, "DD-MM-YYYY").format("dddd");
    this.setState({
      sourceName: params.sourceName,
      destinationName: params.destinationName,
      journeyDate: jd,
      day: day
    });
    Service.get("/Buses/AvailableBuses", params)
      .then(({ data }) => {
        console.log(data.AvailableTrips);
        this.setState({
          buses: data.AvailableTrips,
          No_of_buses_Available: data.AvailableTrips.length,
          loader: false
        });
      })
      .catch(() => {});
  }

  _renderItemList = ({ item, index }) => {
    return (
      <View
        style={{
          paddingVertical: index % 2 == 0 ? 40 : 20,
          backgroundColor: index % 2 == 0 ? "#FFFFFF" : "#E5EBF7"
        }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginHorizontal: 30
          }}>
          <Text style={{ flex: 1, fontWeight: "700" }}>{item.BusType}</Text>
          <Button
            style={{
              backgroundColor: "#ED902D",
              borderRadius: 15,
              paddingHorizontal: 10,
              paddingVertical: 5
            }}>
            <Text style={{ color: "#fff" }}>Select Seats</Text>
          </Button>
        </View>
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 20,
            alignItems: "center",
            marginVertical: 10
          }}>
          <IconMaterial name="bus" size={50} color="#6287F9" />
          <View>
            <Text style={{ fontSize: 20 }}>{item.DisplayName}</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 16 }}>{item.DepartureTime}</Text>
              <Text style={{ fontSize: 16 }}> | </Text>
              <Text style={{ color: "#ADADAF", alignSelf: "center" }}>{item.Duration}</Text>
              <Text style={{ fontSize: 16 }}> | </Text>
              <Text style={{ fontSize: 16 }}>{item.ArrivalTime}</Text>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: "row", marginHorizontal: 30 }}>
          <Text style={{ flex: 1, paddingEnd: 10 }}>Rs. {item.Fares}</Text>
          <Button style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
            <IconFontAwsm name="mobile-phone" size={24} color="#6287F9" />
            <Text style={{ paddingStart: 5, fontWeight: "700", color: "#6287F9" }}>
              Cancellation Policy
            </Text>
          </Button>
        </View>
      </View>
    );
  };

  _keyExtractoritems = (item, index) => "key" + index;

  render() {
    const {
      sourceName,
      destinationName,
      journeyDate,
      No_of_buses_Available,
      day,
      loader
    } = this.state;
    return (
      <View style={{ flexDirection: "column", flex: 1 }}>
        <View style={{ flex: 1, height: 56, backgroundColor: "#E5EBF7" }}>
          <View
            style={{
              flexDirection: "row",
              marginHorizontal: 20,
              marginTop: 20
            }}>
            <Button onPress={() => this.props.navigation.goBack(null)}>
              <Icon name="md-arrow-back" size={24} />
            </Button>
            <View style={{ justifyContent: "space-between", flexDirection: "row", flex: 1 }}>
              <View>
                <Text style={{ fontWeight: "700", fontSize: 16, marginHorizontal: 5 }}>
                  {sourceName} to {destinationName}
                </Text>
                <Text style={{ fontSize: 12, marginHorizontal: 5, color: "#717984" }}>
                  {journeyDate}, {day ? day + " " : ""}
                  {No_of_buses_Available ? No_of_buses_Available + " Buses Found" : ""}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "flex-start"
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
        <View style={{ flex: 4, backgroundColor: "#FFFFFF" }}>
          <FlatList
            data={this.state.buses}
            keyExtractor={this._keyExtractoritems}
            renderItem={this._renderItemList}
          />
        </View>
        {loader && <Activity_Indicator />}
      </View>
    );
  }
}

export default BusInfo;
