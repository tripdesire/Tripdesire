import React from "react";
import { Text, Button, CurrencyText } from "../components";
import { SafeAreaView, ActivityIndicator, StatusBar } from "react-native";
import { View, StyleSheet, FlatList } from "react-native";
import Toast from "react-native-simple-toast";
import { isEmpty, isArray } from "lodash";
import { connect } from "react-redux";
import { domainApi } from "../service";
import moment from "moment";

class Order extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      orders: [],
      offset: 0,
      limit: 20,
      allowMoreScroll: true,
      refreshing: false
    };
  }

  onRefresh = async () => {
    console.log("kamal");
    await this.setState({ refreshing: true, offset: 0 });
    this.loadOrders();
    // this.setState({ refreshing: false });
    // React.useCallback(() => {
    //   this.setState({ refreshing: true });
    //   this.wait(2000).then(() => this.setState({ refreshing: false }));
    // }, [this.state.refreshing]);
  };

  // wait(timeout) {
  //   return new Promise(resolve => {
  //     setTimeout(resolve, timeout);
  //   });
  // }

  componentDidMount() {
    if (!isEmpty(this.props.user)) {
      this.loadOrders();
    }
  }

  loadOrders = () => {
    const { user } = this.props;
    const { offset, limit, allowMoreScroll } = this.state;
    if (!allowMoreScroll) {
      return;
    }
    this.setState({ loading: !this.state.refreshing });
    domainApi
      .post("/nutri-user/" + user.id + "/order-list", { offset, limit })
      .then(({ data }) => {
        console.log(data);
        if (data.status == 1) {
          this.setState({
            orders: this.state.refreshing ? data.data : [...this.state.orders, ...data.data],
            loading: false,
            offset: offset + limit,
            refreshing: false,
            allowMoreScroll: data.data.length >= limit
          });
        } else {
          Toast.show("Orders are not found", Toast.SHORT);
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
    console.log(value);
    const { product_id } = value.line_items[0];
    if (product_id === 222) {
      this.props.navigation.navigate("HotelThankYou", { order: value, isOrderPage: true });
    } else if (product_id === 273) {
      this.props.navigation.navigate("BusThankYou", { order: value, isOrderPage: true });
    } else if (product_id === 2238) {
      this.props.navigation.navigate("CabThankYou", { order: value, isOrderPage: true });
    } else if (product_id === 87) {
      this.props.navigation.navigate("FlightThankYou", { order: value, isOrderPage: true });
    } else {
      this.props.navigation.navigate("OrderDetails", value);
    }
  };

  renderItem = ({ item }) => <OrderItems item={item} onPress={this.navigateToOrderDetails} />;

  keyExtractor = item => "order_" + item.id;

  render() {
    const { loading, orders, refreshing } = this.state;
    const { user } = this.props;

    return (
      <>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        <SafeAreaView style={{ flex: 0, backgroundColor: "#000000" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Orders</Text>
          </View>
          {isEmpty(user) ? (
            <View style={styles.loginContainer}>
              <Text style={{ textAlign: "center" }}>Please login to view your bookings</Text>
              <Button onPress={this.navigateToLogin} style={styles.loginButton}>
                <Text style={{ color: "#FFF" }}>LOGIN</Text>
              </Button>
            </View>
          ) : orders.length > 0 ? (
            <View style={{ flex: 5 }}>
              <FlatList
                onRefresh={this.onRefresh}
                refreshing={refreshing}
                showsVerticalScrollIndicator={false}
                bounces={true}
                data={orders}
                keyExtractor={this.keyExtractor}
                renderItem={this.renderItem}
                onEndReached={this.loadOrders}
                contentContainerStyle={{ backgroundColor: "#FFF" }}
                onEndReachedThreshold={0.5}
              />
            </View>
          ) : (
            !loading && (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#FFF"
                }}>
                <Text>No bookings yet</Text>
              </View>
            )
          )}

          {loading && (
            <ActivityIndicator style={{ flex: 1, backgroundColor: "#FFF" }} size="large" />
          )}
        </SafeAreaView>
      </>
    );
  }
}

function OrderItems({ item, onPress }) {
  const date = moment(item.date_created).format("MMM DD YYYY");
  const _onPress = () => {
    onPress && onPress(item);
  };
  const status = value => {
    if (value == "completed") {
      return (
        <Text
          style={{
            color: "green",
            lineHeight: 18,
            fontWeight: "500",
            textTransform: "capitalize"
          }}>
          {value}
        </Text>
      );
    } else if (value == "cancelled") {
      return (
        <Text
          style={{
            color: "red",
            lineHeight: 18,
            fontWeight: "500",
            textTransform: "capitalize"
          }}>
          {value}
        </Text>
      );
    } else if (value == "pending") {
      return (
        <Text
          style={{
            color: "yellow",
            lineHeight: 18,
            fontWeight: "500",
            textTransform: "capitalize"
          }}>
          {value}
        </Text>
      );
    }
  };

  const hasJsonStructure = str => {
    if (typeof str !== "string") return false;
    try {
      const result = JSON.parse(str);
      const type = Object.prototype.toString.call(result);
      return type === "[object Object]" || type === "[object Array]";
    } catch (err) {
      return false;
    }
  };

  const ticketData = hasJsonStructure(item.reference_no)
    ? JSON.parse(item.reference_no)
    : item.reference_no;

  //console.log(ticketData);

  const isFlight =
    isArray(item.line_items) && item.line_items.length > 0 && item.line_items[0].product_id == 87;

  const isHotel =
    isArray(item.line_items) && item.line_items.length > 0 && item.line_items[0].product_id == 222;

  const isBus =
    isArray(item.line_items) && item.line_items.length > 0 && item.line_items[0].product_id == 273;

  const isCab =
    isArray(item.line_items) && item.line_items.length > 0 && item.line_items[0].product_id == 2238;

  return (
    <Button
      style={{
        margin: 8,
        borderRadius: 8,
        padding: 12,
        backgroundColor: "#FFFFFF",
        elevation: 1,
        shadowColor: "rgba(0,0,0,0.1)",
        shadowOpacity: 1,
        shadowRadius: 4,
        shadowOffset: { height: 0, width: 2 }
      }}
      onPress={_onPress}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={[styles.Heading, { lineHeight: 20 }]}>Booking Id : </Text>
          <Text style={{ lineHeight: 18 }}>{item.id}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.Heading, { lineHeight: 20 }]}>Status : </Text>
          {status(item.status)}
        </View>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.Heading, { lineHeight: 20 }]}>Date : </Text>
          <Text style={{ lineHeight: 20 }}>{date}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.Heading, { lineHeight: 20 }]}>Total : </Text>
          <Text style={{ lineHeight: 20 }}>
            <CurrencyText>₹</CurrencyText>
            {item.total}
          </Text>
        </View>
      </View>

      {isFlight && (
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {item.reference_no != "" && (
            <View>
              <Text style={[styles.Heading, { lineHeight: 20 }]}>PNR No</Text>
              <Text style={{ lineHeight: 20 }}>{ticketData.GDFPNRNo}</Text>
            </View>
          )}
          {item.reference_no != "" && (
            <View>
              <Text style={[styles.Heading, { lineHeight: 20 }]}>Reference No</Text>
              <Text style={{ lineHeight: 20 }}>{ticketData.ReferenceNo}</Text>
            </View>
          )}
        </View>
      )}

      {isHotel && (
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {(item.reference_no != "" || item.reference_no != '""""') && ticketData.GDFPNRNo != null && (
            <View>
              <Text style={[styles.Heading, { lineHeight: 20 }]}>PNR No</Text>
              <Text style={{ lineHeight: 20 }}>{ticketData.GDFPNRNo}</Text>
            </View>
          )}
          {(item.reference_no != "" || item.reference_no != '""') && (
            <View>
              <Text style={[styles.Heading, { lineHeight: 20 }]}>Reference No</Text>
              <Text style={{ lineHeight: 20 }}>{ticketData.ReferenceNo}</Text>
            </View>
          )}
        </View>
      )}

      {isBus && (
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {item.reference_no != "" && ticketData.OperatorPNR != null && (
            <View>
              <Text style={[styles.Heading, { lineHeight: 20 }]}>PNR No</Text>
              <Text style={{ lineHeight: 20 }}>{ticketData.OperatorPNR}</Text>
            </View>
          )}
          {item.reference_no != "" && (
            <View>
              <Text style={[styles.Heading, { lineHeight: 20 }]}>Reference No</Text>
              <Text style={{ lineHeight: 20 }}>{ticketData.APIReferenceNo}</Text>
            </View>
          )}
        </View>
      )}

      {isCab && (
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {item.reference_no != "" && (
            <View>
              <Text style={[styles.Heading, { lineHeight: 20 }]}>PNR No</Text>
              <Text style={{ lineHeight: 20 }}>{ticketData.GDFPNRNo}</Text>
            </View>
          )}
          {item.reference_no != "" && (
            <View>
              <Text style={[styles.Heading, { lineHeight: 20 }]}>Reference No</Text>
              <Text style={{ lineHeight: 20 }}>{ticketData.ReferenceNo}</Text>
            </View>
          )}
        </View>
      )}
    </Button>
  );
}

const styles = StyleSheet.create({
  Heading: {
    fontSize: 16,
    fontWeight: "500"
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
    fontWeight: "500",
    fontSize: 18
  },
  loginContainer: {
    backgroundColor: "#FFF",
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
