import React, { PureComponent } from "react";
import {
  View,
  Platform,
  TextInput,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  StatusBar
} from "react-native";
import Toast from "react-native-simple-toast";
import { Button, Text, ActivityIndicator, Icon, LinearGradient, CurrencyText } from "../components";
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";
import moment from "moment";
import HTML from "react-native-render-html";
import { domainApi } from "../service";
import { isArray, isEmpty } from "lodash";
import { connect } from "react-redux";
import NumberFormat from "react-number-format";
import analytics from "@react-native-firebase/analytics";

class BlogCheckout extends React.PureComponent {
  constructor(props) {
    super(props);
    const { params } = props.navigation.state;
    console.log(props.navigation.state.params);
    console.log("heyy");
    this.state = {
      loading: false,
      inputCoupon: false,
      data: {},
      coupon_code: ""
    };
  }

  applyCoupon = () => {
    this.setState({ loading: true });
    domainApi
      .get("/cart/coupon", { coupon_code: this.state.coupon_code })
      .then(({ data }) => {
        if (data.code && data.code == 201) {
          Toast.show(data.message.join());
        }
        this.toggleCoupon(false)();
        this.setState({ data: data });
        this.ApiCall();
        this.setState({ loading: false });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  };

  removeCoupon = code => () => {
    this.setState({ loading: true });
    domainApi
      .get("/cart/remove-coupon", {
        coupon_code: code
      })
      .then(({ data }) => {
        this.toggleCoupon(true)();
        this.ApiCall();
        this.setState({ loading: false });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  };

  toggleCoupon = show => () => {
    this.setState({
      inputCoupon: show
    });
  };

  trackScreenView = async screen => {
    // Set & override the MainActivity screen name
    await analytics().setCurrentScreen(screen, screen);
  };

  componentDidMount() {
    this.trackScreenView("Hotel Checkout");

    const params = { ...this.props.navigation.state.params, itemId: 222 };
    console.log(params);

    let param = {
      id: params.Hotel_id,
      duration_time: params.item.nights,
      package_location: params.item.slug,
      quantity: params.No_of_person
    };
    console.log("cartdata", JSON.stringify(param));
    //console.log(JSON.stringify(param));
    this.setState({ loading: true });
    domainApi
      .post("/cart/add", param)
      .then(({ data }) => {
        if (data.code !== "1") {
          this.setState({ loading: false });
          Toast.show(data.message, Toast.LONG);
        } else {
          this.ApiCall();
        }
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  }

  ApiCall() {
    const { user } = this.props;
    domainApi
      .get("/cart?user_id=" + user.id)
      .then(({ data }) => {
        this.setState({ data: data, loading: false });
        //this.props.navigation.navigate("Payment", { params, data });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  }

  _payment = () => {
    const params = { ...this.props.navigation.state.params, itemId: 222 };

    const { user } = this.props;

    if (isEmpty(user)) {
      //Toast.show("Please login or signup", Toast.LONG);
      this.props.navigation.navigate("SignIn", { needBilling: true });
      return;
    }
    if (
      user.billing.email === "" ||
      user.billing.phone === "" ||
      user.billing.state === "" ||
      user.billing.city === "" ||
      user.billing.address_1 === "" ||
      user.billing.postcode === ""
    ) {
      this.props.navigation.navigate("BillingDetails", { needBillingOnly: true });
      return;
    }
    this.ApiCall();
    this.props.navigation.navigate("BlogPayment", { params, data: this.state.data });
  };

  render() {
    const { params } = this.props.navigation.state;
    const { width, height } = Dimensions.get("window");
    // let checkInDate = moment(params.checkInDate, "DD-MM-YYYY").format("DD MMM");
    // let checkOutDate = moment(params.checkOutDate, "DD-MM-YYYY").format("DD MMM");
    return (
      <>
        <StatusBar backgroundColor="#000000" barStyle="light-content" />
        <SafeAreaView style={{ flex: 0, backgroundColor: "#000000" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <View style={{ flex: 1, flexDirection: "column" }}>
            <LinearGradient colors={["#53b2fe", "#065af3"]}>
              <View
                style={{
                  height: 56,
                  alignItems: "center",
                  flexDirection: "row",
                  marginHorizontal: 16
                }}>
                <Button onPress={() => this.props.navigation.goBack(null)}>
                  <Icon name="md-arrow-back" size={24} color="#fff" />
                </Button>
                <View style={{ marginHorizontal: 20 }}>
                  <Text
                    style={{
                      fontWeight: "700",
                      fontSize: 16,
                      marginHorizontal: 5,
                      color: "#fff"
                    }}>
                    Order Summary
                  </Text>
                </View>
              </View>
            </LinearGradient>
            <View style={{ flex: 4, backgroundColor: "#FFFFFF", height: 100 }}>
              <View
                style={{
                  elevation: 2,
                  shadowOffset: { width: 0, height: 2 },
                  shadowColor: "rgba(0,0,0,0.1)",
                  shadowOpacity: 1,
                  shadowRadius: 4,
                  backgroundColor: "#ffffff",
                  marginHorizontal: 16,
                  marginVertical: 8,
                  borderRadius: 8
                }}>
                <View style={{ flexDirection: "row", marginStart: 5, padding: 10 }}>
                  <Icon type="SimpleLineIcons" name="bag" size={24} />
                  <Text style={{ fontSize: 18, fontWeight: "500", marginStart: 10 }}>
                    Price Summary
                  </Text>
                </View>

                {isArray(this.state.data.cart_data) && this.state.data.cart_data.length > 0 && (
                  <>
                    <View
                      style={{
                        paddingHorizontal: 10,
                        flexDirection: "row",
                        justifyContent: "space-between"
                      }}>
                      <Text style={style._textHeading}>
                        {this.state.data.cart_data[0].custum_product_data.package_data.name}
                      </Text>
                    </View>
                    <View
                      style={{
                        paddingHorizontal: 10,
                        flexDirection: "row",
                        justifyContent: "space-between"
                      }}>
                      <Text style={style._textHeading}>Per Person</Text>
                      <Text style={{ color: "#717A81" }}>
                        <CurrencyText>₹</CurrencyText>
                        {(
                          parseInt(
                            this.state.data.cart_order_total_without_symbol.replace(/\,/g, "")
                          ) / this.state.data.cart_data[0].custum_product_data.package_data.quantity
                        ).toFixed(2)}
                      </Text>
                    </View>

                    <View
                      style={{
                        paddingHorizontal: 10,
                        flexDirection: "row",
                        width: "100%",
                        justifyContent: "space-between"
                      }}>
                      <Text style={style._textHeading}>No. of Passengers</Text>
                      <Text style={{ color: "#717A81" }}>
                        {this.state.data.cart_data[0].custum_product_data.package_data.quantity}
                      </Text>
                    </View>
                    <View
                      style={{
                        paddingHorizontal: 10,
                        flexDirection: "row",
                        justifyContent: "space-between"
                      }}>
                      <Text style={style._textHeading}>Sub Total</Text>
                      <HTML
                        baseFontStyle={{
                          color: "#717A81"
                        }}
                        html={this.state.data.cart_data[0].subtotal}
                      />
                    </View>
                  </>
                )}

                {!this.state.inputCoupon && (
                  <View
                    style={{
                      paddingHorizontal: 10,
                      flexDirection: "row",
                      justifyContent: "space-between"
                    }}>
                    {Array.isArray(this.state.data.coupon) && this.state.data.coupon.length > 0 && (
                      <Text style={style._textHeading}>Discount</Text>
                    )}
                    {Array.isArray(this.state.data.coupon) &&
                      this.state.data.coupon.length > 0 &&
                      this.state.data.coupon.map(coupon => (
                        <HTML
                          key={coupon.code}
                          baseFontStyle={{
                            color: "green",
                            fontWeight: "700"
                          }}
                          containerStyle={{ marginHorizontal: 20 }}
                          html={"- " + coupon.discount}
                        />
                      ))}
                  </View>
                )}
                <View
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderBottomLeftRadius: 8,
                    borderBottomRightRadius: 8,
                    backgroundColor: "#F2F3F5"
                  }}>
                  <Text
                    style={[
                      style._textHeading,
                      { fontWeight: "700", fontSize: 16, color: "#000" }
                    ]}>
                    Total Payable
                  </Text>
                  <Text
                    style={[style._Details, { fontSize: 16, fontWeight: "700", color: "#000" }]}>
                    <CurrencyText style={{ fontWeight: "700", fontSize: 16 }}>₹</CurrencyText>
                    {this.state.data.total_price ? this.state.data.total_price : "₹" + 0.0}
                  </Text>
                </View>
              </View>

              {this.state.data.hasOwnProperty("coupon") && this.state.data.coupon.length == 0 ? (
                this.state.inputCoupon ? (
                  <View
                    style={{
                      justifyContent: "center",
                      paddingVertical: Platform.OS == "ios" ? 10 : 0,
                      marginHorizontal: 16,
                      elevation: 2,
                      marginTop: 8,
                      shadowOffset: { width: 0, height: 2 },
                      shadowColor: "rgba(0,0,0,0.1)",
                      shadowOpacity: 1,
                      shadowRadius: 4,
                      backgroundColor: "#ffffff",
                      borderRadius: 8
                    }}>
                    <TextInput
                      placeholder="Enter Coupon Code"
                      value={this.state.coupon_code}
                      style={{ marginStart: 5, color: "#000" }}
                      onChangeText={text => this.setState({ coupon_code: text })}
                    />
                    <Button
                      onPress={this.applyCoupon}
                      style={{
                        position: "absolute",
                        backgroundColor: "#222222",
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        end: 8,
                        zIndex: 1,
                        elevation: 1,
                        shadowOpacity: 0.2,
                        shadowRadius: 1,
                        borderRadius: 8,
                        shadowOffset: { height: 1, width: 0 }
                      }}>
                      <Text style={{ color: "#FFFFFF" }}>Apply</Text>
                    </Button>
                  </View>
                ) : (
                  <Button
                    onPress={this.toggleCoupon(true)}
                    style={[
                      styles.billingContainer,
                      styles.billingRow,
                      { justifyContent: "flex-start", marginHorizontal: 16, marginTop: 8 }
                    ]}>
                    <Icon
                      name="brightness-percent"
                      size={20}
                      color="#E7BA34"
                      type="MaterialCommunityIcons"
                    />
                    <Text style={{ fontWeight: "700", marginStart: 8 }}>APPLY COUPON</Text>
                    <Icon
                      name="ios-arrow-forward"
                      style={{ fontSize: 20, color: "#E7BA34", marginStart: "auto" }}
                      size={20}
                    />
                  </Button>
                )
              ) : (
                Array.isArray(this.state.data.coupon) &&
                this.state.data.coupon.length > 0 &&
                this.state.data.coupon.map(coupon => (
                  <View
                    style={[
                      styles.billingContainer,
                      styles.billingRow,
                      { marginHorizontal: 16, marginVertical: 20 }
                    ]}
                    key={coupon.code}>
                    <Text style={{ fontWeight: "700", textTransform: "uppercase" }}>
                      {coupon.code}
                    </Text>
                    <Button
                      style={{ marginStart: "auto", padding: 5 }}
                      onPress={this.removeCoupon(coupon.code)}>
                      <Icon name="md-close" color="#E7BA34" size={20} />
                    </Button>
                  </View>
                ))
              )}

              <Button
                style={{
                  backgroundColor: "#F68E1D",
                  marginHorizontal: 100,
                  alignItems: "center",
                  justifyContent: "center",
                  height: 36,
                  marginVertical: 20,
                  borderRadius: 20
                }}
                onPress={this._payment}>
                <Text style={{ color: "#fff" }}>Next</Text>
              </Button>
            </View>
          </View>
          {this.state.loading && <ActivityIndicator />}
        </SafeAreaView>
      </>
    );
  }
}

const style = StyleSheet.create({
  _textDetailsStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 5,
    paddingHorizontal: 16
  },
  _Details: { color: "#717A81" },
  _textHeading: { color: "#717A81", flex: 5, marginStart: 8 }
});

const styles = StyleSheet.create({
  billingContainer: {
    elevation: 1,
    shadowOpacity: 0.2,
    shadowRadius: 1,
    shadowOffset: { height: 1, width: 0 },
    padding: 8,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginVertical: 8
  },
  billingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 8
  }
});

const mapStateToProps = state => ({
  user: state.user
});

export default connect(
  mapStateToProps,
  null
)(BlogCheckout);
