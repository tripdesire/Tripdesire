import React, { PureComponent } from "react";
import { Text, Button, Header, Activity_Indicator } from "../components";
import {
  Image,
  ImageBackground,
  Dimensions,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity
} from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons";
import Toast from "react-native-simple-toast";
import { DomSugg, IntSugg, DomHotelSugg, BusSugg } from "../store/action";
import Service from "../service";
import axios from "axios";
import moment from "moment";
const { height, width } = Dimensions.get("window");
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
      .get("http://tripdesire.co/wp-json/wc/v2/nutri-user/7/order-list")
      .then(res => {
        console.log(res.data);
        if (res.data.status == 1) {
          this.setState({
            orders: res.data.data,
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
    if (value == "completed") return <Text style={{ color: "green" }}>{value}</Text>;
  };

  _renderItem = ({ item, index }) => {
    let date = moment(item.date_created).format("MMM DD YYYY");
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
            <Text style={styles.Heading}>Booking Id :</Text>
            <Text>{item.id}</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.Heading}>Status :</Text>
            {this.status(item.status)}
          </View>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.Heading}>Date :</Text>
            <Text>{date}</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.Heading}>Total :</Text>
            <Text>{item.total}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  _keyExtractor = (item, index) => "key" + index;

  render() {
    const { loader } = this.state;
    return (
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
        {loader && <Activity_Indicator />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  Heading: { fontSize: 16, fontWeight: "700" }
});

export default Order;
