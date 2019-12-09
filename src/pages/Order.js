import React, { PureComponent } from "react";
import { Text, Button, ActivityIndicator } from "../components";
import { SafeAreaView } from "react-native";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Toast from "react-native-simple-toast";
import axios from "axios";
import moment from "moment";

class Order extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loader: true,
      orders: []
    };
  }

  _OrderDetails = value => () => {
    console.log("Hye");
    this.props.navigation.navigate("OrderDetails", value);
  };

  componentDidMount() {
    axios
      .get("https://demo66.tutiixx.com/wp-json/wc/v2/nutri-user/7/order-list")
      .then(({ data }) => {
        console.log(data);
        if (data.status == 1) {
          this.setState({
            orders: data.data,
            loader: false
          });
        } else {
          Toast.show("Data not found.", Toast.SHORT);
          this.setState({ loader: false });
        }
      })
      .catch(error => {
        console.log(error, Toast.LONG);
      });
  }

  status = value => {
    if (value == "completed")
      return <Text style={{ color: "green", lineHeight: 18 }}>{value}</Text>;
  };

  _renderItem = ({ item, index }) => {
    let date = moment(item.order_data.date_created).format("MMM DD YYYY");
    return (
      <TouchableOpacity
        style={{
          marginHorizontal: 8,
          marginVertical: 8,
          backgroundColor: "#EEF1F8",
          borderRadius: 8,
          padding: 10
        }}
        onPress={this._OrderDetails(item)}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between"
          }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={[styles.Heading, { lineHeight: 20 }]}>Booking Id : </Text>
            <Text style={{ lineHeight: 18 }}>{item.order_data.id}</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.Heading, { lineHeight: 20 }]}>Status : </Text>
            {this.status(item.order_data.status)}
          </View>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.Heading, { lineHeight: 20 }]}>Date : </Text>
            <Text style={{ lineHeight: 20 }}>{date}</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.Heading, { lineHeight: 20 }]}>Total : </Text>
            <Text style={{ lineHeight: 20 }}>{item.order_data.total}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  _keyExtractor = (item, index) => "key" + index;

  render() {
    const { loader } = this.state;
    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "#ffffff" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <View>
            <View
              style={{
                flexDirection: "row",
                marginHorizontal: 16,
                height: 56,
                alignItems: "center"
              }}>
              <Button onPress={this.props.navigation.openDrawer}>
                <Icon name="md-arrow-back" size={24} />
              </Button>
              <Text
                style={{
                  fontSize: 18,
                  color: "#1E293B",
                  marginStart: 5,
                  fontWeight: "700"
                }}>
                Orders
              </Text>
            </View>

            <FlatList
              data={this.state.orders}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}
            />
          </View>
          {loader && <ActivityIndicator />}
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  Heading: { fontSize: 16, fontWeight: "700" }
});

export default Order;
