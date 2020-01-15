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
import { Button, Text, ActivityIndicator, Icon, LinearGradient } from "../../components";
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";
import moment from "moment";
import HTML from "react-native-render-html";
import { domainApi } from "../../service";

class HotelPayment extends React.PureComponent {
  constructor(props) {
    super(props);
    const { params } = props.navigation.state;
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

  componentDidMount() {
    const params = { ...this.props.navigation.state.params, itemId: 222 };

    let param = {
      id: 222,
      quantity: "1",
      single_hotel_data: params,
      single_ht_img: params.HotelImages[0].Imagepath,
      hotel_adults: params.adultDetail,
      single_ht_address: params.HotelAddress,
      hotel_children: params.childDetail,
      hotel_children_age: params.childAge,
      hotel_city_id: params.cityid,
      single_ht_name: params.HotelName,
      single_ht_room_type: params.selectedRoom.RoomType,
      single_ht_city: params.city,
      single_ht_chk_in: params.checkInDate,
      single_ht_chk_out: params.checkOutDate,
      single_ht_night: params.Night,
      single_ht_room: params.room,
      single_ht_guest: params.adult + params.child,
      single_ht_adults: params.adult,
      single_ht_children: params.child,
      single_ht_price: params.selectedRoom.RoomTotal,
      single_ht_extra_guest: params.selectedRoom.ExtGuestTotal,
      single_ht_tax_amount: params.selectedRoom.etravosApitaxTotal,
      single_ht_convenience_fee: params.ConvenienceFeeTotal
    };
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
    domainApi
      .get("/cart")
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

    let data = {
      ...this.state.data,
      payment_method: [
        {
          id: "razorpay",
          title: "RazorPay"
        }
        // {
        //   id: "wallet",
        //   title: "Wallet"
        // }
      ]
    };

    this.props.navigation.navigate("Payment", { params, data });
  };

  render() {
    const { params } = this.props.navigation.state;
    const { width, height } = Dimensions.get("window");
    let checkInDate = moment(params.checkInDate, "DD-MM-YYYY").format("DD MMM");
    let checkOutDate = moment(params.checkOutDate, "DD-MM-YYYY").format("DD MMM");
    return (
      <>
        <StatusBar backgroundColor="#000000" barStyle="light-content" />
        <SafeAreaView style={{ flex: 0, backgroundColor: "#000000" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <View style={{ flex: 1, flexDirection: "column" }}>
            <LinearGradient colors={["#53b2fe", "#065af3"]} style={{ flex: 4 }}>
              <View style={{ flex: 4 }}>
                <View
                  style={{
                    height: 56,
                    //  backgroundColor: "#5B89F9",
                    flexDirection: "row",
                    marginHorizontal: 16,
                    marginTop: 10
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
                      Hotel Summary
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "flex-start"
                      }}>
                      <IconMaterial name="calendar-month" size={18} color="#ffffff" />
                      <Text style={{ fontSize: 12, marginHorizontal: 5, color: "#ffffff" }}>
                        {checkInDate} - {checkOutDate}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </LinearGradient>
            <View style={{ flex: 4, backgroundColor: "#FFFFFF" }}>
              <View
                style={{
                  elevation: 2,
                  shadowOffset: { width: 0, height: 2 },
                  shadowColor: "rgba(0,0,0,0.1)",
                  shadowOpacity: 1,
                  shadowRadius: 4,
                  marginHorizontal: 16,
                  borderRadius: 8,
                  backgroundColor: "#ffffff",
                  marginTop: -220
                }}>
                <Text
                  style={{
                    color: "#717A81",
                    backgroundColor: "#E5EBF7",
                    paddingTop: 16,
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                    paddingHorizontal: 16
                  }}>
                  From
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    backgroundColor: "#E5EBF7",
                    paddingHorizontal: 16
                  }}>
                  {this.state.data.total_price ? "₹ " + this.state.data.total_price : "₹ " + 0.0}
                </Text>
                {!this.state.inputCoupon && (
                  <View
                    style={{
                      backgroundColor: "#E5EBF7",
                      paddingStart: 5,
                      paddingBottom: 10
                    }}>
                    {Array.isArray(this.state.data.coupon) &&
                      this.state.data.coupon.length > 0 &&
                      this.state.data.coupon.map(coupon => (
                        <HTML
                          key={coupon.code}
                          baseFontStyle={{
                            color: "green",
                            fontWeight: "700"
                          }}
                          containerStyle={{ marginHorizontal: 10 }}
                          html={"- " + coupon.discount}
                        />
                      ))}
                  </View>
                )}
                <View style={style._textDetailsStyle}>
                  <Text style={style._textHeading}>City</Text>
                  <Text style={style._Details}>{params.city} (INDIA)</Text>
                </View>
                <View style={[style._textDetailsStyle, { backgroundColor: "#E5EBF7" }]}>
                  <Text style={style._textHeading}>Check In</Text>
                  <Text style={style._Details}>{params.checkInDate}</Text>
                </View>
                <View style={style._textDetailsStyle}>
                  <Text style={style._textHeading}>Check Out</Text>
                  <Text style={style._Details}>{params.checkOutDate}</Text>
                </View>
                <View style={[style._textDetailsStyle, { backgroundColor: "#E5EBF7" }]}>
                  <Text style={style._textHeading}>Night(s)</Text>
                  <Text style={style._Details}>{params.Night}</Text>
                </View>
                <View style={style._textDetailsStyle}>
                  <Text style={style._textHeading}>Room(s)</Text>
                  <Text style={style._Details}>{params.room}</Text>
                </View>
                <View
                  style={[
                    style._textDetailsStyle,
                    {
                      backgroundColor: "#E5EBF7"
                    }
                  ]}>
                  <Text style={style._textHeading}>Guest(s)</Text>
                  <Text style={style._Details}>{params.adult + params.child}</Text>
                </View>
                {this.state.data.hasOwnProperty("coupon") && this.state.data.coupon.length == 0 ? (
                  this.state.inputCoupon ? (
                    <View
                      style={{
                        elevation: 1,
                        backgroundColor: "#fff",
                        justifyContent: "center",
                        marginVertical: 20,
                        paddingVertical: Platform.OS == "ios" ? 10 : 0,
                        marginHorizontal: 16,
                        shadowOffset: { width: 0, height: 2 },
                        shadowColor: "rgba(0,0,0,0.1)",
                        shadowOpacity: 1,
                        shadowRadius: 4,
                        borderRadius: 8
                      }}>
                      <TextInput
                        placeholder="Enter Coupon Code"
                        value={this.state.coupon_code}
                        style={{ marginStart: 5 }}
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
                        { justifyContent: "flex-start", marginHorizontal: 16, marginVertical: 20 }
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
                    marginHorizontal: 80,
                    alignItems: "center",
                    marginVertical: 30,
                    justifyContent: "center",
                    height: 40,
                    paddingHorizontal: 20,
                    borderRadius: 20
                  }}
                  onPress={this._payment}>
                  <Text style={{ color: "#fff" }}>Next</Text>
                </Button>
              </View>
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
  _Details: { color: "#717A81", flex: 2, alignItems: "flex-start" },
  _textHeading: { color: "#717A81", flex: 3 }
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

export default HotelPayment;
