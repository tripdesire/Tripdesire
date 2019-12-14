import React, { PureComponent } from "react";
import { Text, Button, ActivityIndicator } from "../components";
import { SafeAreaView } from "react-native";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Toast from "react-native-simple-toast";
import axios from "axios";
import { isEmpty } from "lodash";
import { connect } from "react-redux";
import { etravosApi, domainApi } from "../service";
import moment from "moment";

class Order extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      loader: true,
      orders: []
    };

    const { user } = this.props;

    if (isEmpty(user)) {
      this.setState({
        loader: false,
        orders: 0
      });
      //Toast.show("Please login or signup", Toast.LONG);
      this.props.navigation.navigate("SignIn", { isCheckout: true });
    } else {
      domainApi
        .get("/nutri-user/" + user.id + "/order-list")
        .then(({ data }) => {
          // console.log(data);
          if (data.status == 1) {
            this.setState({
              orders: data.data,
              loader: false
            });
          } else {
            Toast.show("Orders are not found", Toast.SHORT);
            this.setState({ loader: false });
          }
        })
        .catch(error => {
          console.log(error, Toast.LONG);
        });
    }
  }

  _orderDetails = value => {
    this.props.navigation.navigate("OrderDetails", value);
  };

  _renderItem = ({ item }) => <OrderItems item={item} onPress={this._orderDetails} />;

  _keyExtractor = item => "order_" + item.order_data.id;

  render() {
    const { loader, orders } = this.state;
    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "#ffffff" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#E4EAF6" }}>
          <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Orders</Text>
            </View>

            {orders.length > 0 ? (
              <FlatList
                data={orders}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderItem}
              />
            ) : (
              <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
                <Text>Orders are not found</Text>
              </View>
            )}
            {loader && <ActivityIndicator />}
          </View>
        </SafeAreaView>
      </>
    );
  }
}

function OrderItems({ item, onPress }) {
  const date = moment(item.order_data.date_created).format("MMM DD YYYY");
  const _onPress = () => {
    onPress && onPress(item);
  };
  const status = value => {
    if (value == "completed")
      return <Text style={{ color: "green", lineHeight: 18, fontWeight: "700" }}>{value}</Text>;
  };
  return (
    <Button
      style={{
        marginHorizontal: 8,
        marginVertical: 8,
        borderRadius: 8,
        padding: 10,
        backgroundColor: "#FFFFFF",
        elevation: 3,
        shadowOpacity: 0.2,
        shadowRadius: 1,
        shadowOffset: { height: 3, width: 0 }
      }}
      onPress={_onPress}>
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
          {status(item.order_data.status)}
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
    </Button>
  );
}

const styles = StyleSheet.create({
  Heading: { fontSize: 16, fontWeight: "700" },
  header: {
    flexDirection: "row",
    paddingHorizontal: 16,
    height: 48,
    alignItems: "center",
    backgroundColor: "#E4EAF6"
  },
  headerTitle: {
    color: "#1E293B",
    fontWeight: "700",
    fontSize: 18
  }
});

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(Order);
