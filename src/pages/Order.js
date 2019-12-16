import React from "react";
import { Text, Button, ActivityIndicator } from "../components";
import { SafeAreaView } from "react-native";
import { View, StyleSheet, FlatList } from "react-native";
import Toast from "react-native-simple-toast";
import { isEmpty } from "lodash";
import { connect } from "react-redux";
import { domainApi } from "../service";
import moment from "moment";

class Order extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      orders: []
    };
  }
  componentDidMount() {
    if (!isEmpty(this.props.user)) {
      this.loadOrders();
    }
  }

  loadOrders = () => {
    console.log("loading orders");
    const { user } = this.props;
    this.setState({ loading: true });

    domainApi
      .get("/nutri-user/" + user.id + "/order-list")
      .then(({ data }) => {
        if (data.status == 1) {
          this.setState({ orders: data.data, loading: false });
        } else {
          Toast.show("Orders not found", Toast.SHORT);
          this.setState({ loading: false });
        }
      })
      .catch(error => {
        this.setState({ loading: false });
        Toast.show(error.toString(), Toast.LONG);
      });
  };

  navigateToLogin = () => {
    this.props.navigation.navigate("SignIn", { onBack: this.loadOrders });
  };
  navigateToOrderDetails = value => {
    this.props.navigation.navigate("OrderDetails", value);
  };

  renderItem = ({ item }) => <OrderItems item={item} onPress={this.navigateToOrderDetails} />;

  keyExtractor = item => "order_" + item.order_data.id;

  render() {
    const { loading, orders } = this.state;
    const { user } = this.props;
    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "#E4EAF6" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "grey" }}>
          <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Orders</Text>
            </View>
            {isEmpty(user) ? (
              <View style={styles.loginContainer}>
                <Text style={{ textAlign: "center" }}>
                  You need to be logged in in order to view trips
                </Text>
                <Button onPress={this.navigateToLogin} style={styles.loginButton}>
                  <Text style={{ color: "#FFF" }}>LOGIN</Text>
                </Button>
              </View>
            ) : orders.length > 0 ? (
              <FlatList
                data={orders}
                keyExtractor={this.keyExtractor}
                renderItem={this.renderItem}
              />
            ) : (
              <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
                <Text>Orders are not found</Text>
              </View>
            )}
            {loading && <ActivityIndicator />}
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
        margin: 8,
        borderRadius: 8,
        padding: 12,
        backgroundColor: "#FFFFFF",
        elevation: 3,
        shadowOpacity: 0.2,
        shadowRadius: 1,
        shadowOffset: { height: 1, width: 0 }
      }}
      onPress={_onPress}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
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
  Heading: {
    fontSize: 16,
    fontWeight: "700"
  },
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
  },
  loginContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingHorizontal: 92
  },
  loginButton: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 4,
    backgroundColor: "#F68E1F",
    marginTop: 20
  }
});

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(Order);
