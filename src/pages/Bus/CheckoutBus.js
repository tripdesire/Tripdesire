import React, { PureComponent } from "react";
import {
  View,
  Image,
  TextInput,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Platform,
  StatusBar
} from "react-native";
import { Button, Text, ActivityIndicator, Icon, CurrencyText } from "../../components";
import { etravosApi, domainApi } from "../../service";
import moment from "moment";
import Toast from "react-native-simple-toast";
import HTML from "react-native-render-html";
import { connect } from "react-redux";
import { isEmpty, isArray } from "lodash";
import NumberFormat from "react-number-format";

class CheckoutBus extends React.PureComponent {
  constructor(props) {
    super(props);
    const { selectedSheets } = props.navigation.state.params;
    console.log(props.navigation.state.params);
    this.state = {
      IdCardType: "ADHAR_CARD",
      IdNumber: "",
      IssuedBy: "",
      adults: [...Array(selectedSheets.length)].map(item => {
        return {
          name: "",
          age: "",
          gender: "M",
          den: "Mr"
        };
      }),
      loader: false,
      inputCoupon: false,
      cartData: {},
      coupon_code: ""
    };
  }

  applyCoupon = () => {
    this.setState({ loader: true });
    domainApi
      .get("/cart/coupon", { coupon_code: this.state.coupon_code })
      .then(({ data }) => {
        console.log(data);
        if (data.code && data.code == 201) {
          Toast.show(data.message.join());
        }
        this.toggleCoupon(false)();
        this.setState({ cartData: data });
        this.ApiCall();
        // this.setState({ loader: false });
      })
      .catch(() => {
        this.setState({ loader: false });
      });
  };

  removeCoupon = code => () => {
    this.setState({ loader: true });
    domainApi
      .get("/cart/remove-coupon", {
        coupon_code: code
      })
      .then(({ data }) => {
        this.toggleCoupon(true)();
        this.ApiCall();
        // this.setState({ loader: false });
      })
      .catch(() => {
        this.setState({ loader: false });
      });
  };

  toggleCoupon = show => () => {
    this.setState({
      inputCoupon: show
    });
  };

  componentDidMount() {
    console.log(this.props.navigation.state.params);

    const {
      params,
      paramsRound,
      sourceName,
      BoardingPoint,
      BoardingPointReturn,
      DroppingPoint,
      DroppingPointReturn,
      destinationName,
      tripType,
      TripType,
      selectedSheets,
      selectedSheetsRound
    } = this.props.navigation.state.params;
    console.log(params, selectedSheets);

    let Seats = selectedSheets.map(item => item.Number).join("~");

    let Fares = selectedSheets.map(item => item.Fare).reduce((a, b) => Number(a) + Number(b));

    let ServiceCharge = selectedSheets
      .map(item => item.OperatorServiceCharge)
      .reduce((a, b) => Number(a) + Number(b));

    let ServiceTax = selectedSheets
      .map(item => item.Servicetax)
      .reduce((a, b) => Number(a) + Number(b));

    console.log(Seats, Fares, ServiceCharge, ServiceTax);
    // return;

    let paramAddToCart = {
      id: 273,
      quantity: 1,
      bus_item_result_data: params,
      display_name: params.DisplayName,
      bus_type: params.BusType,
      departure_time: params.DepartureTime,
      arrival_time: params.ArrivalTime,
      source_city: sourceName,
      source_id: params.SourceId,
      destination_city: destinationName,
      destination_id: params.DestinationId,
      boarding_point: BoardingPoint.Landmark + " " + BoardingPoint.Location,
      dropping_point: DroppingPoint.Landmark + " " + DroppingPoint.Location,
      time_duration: params.Duration,
      select_seat: selectedSheets.length,
      select_seat_number: Seats,
      base_fare: Fares,
      service_charge: ServiceCharge,
      service_tax: ServiceTax,
      ConvenienceFee: params.ConvenienceFee,
      trip_type: TripType,
      journey_date: moment(params.Journeydate, "YYYY-MM-DD").format("DD-MM-YYYY")
    };

    if (TripType == 2) {
      let SeatsRound = [...selectedSheetsRound.map(item => item.Number)].join("~");

      let FaresRound = [...selectedSheetsRound.map(item => item.Fare)].reduce(
        (a, b) => Number(a) + Number(b)
      );

      let ServiceChargeRound = [
        ...selectedSheetsRound.map(item => item.OperatorServiceCharge)
      ].reduce((a, b) => Number(a) + Number(b));

      let ServiceTaxRound = [...selectedSheetsRound.map(item => item.Servicetax)].reduce(
        (a, b) => Number(a) + Number(b)
      );

      (paramAddToCart.return_bus_item_result_data = paramsRound), ////Return
        (paramAddToCart.return_display_name = paramsRound.DisplayName),
        (paramAddToCart.return_bus_type = paramsRound.BusType),
        (paramAddToCart.return_departure_time = paramsRound.DepartureTime),
        (paramAddToCart.return_arrival_time = params.ArrivalTime),
        (paramAddToCart.return_source_city = destinationName),
        (paramAddToCart.return_source_id = paramsRound.SourceId),
        (paramAddToCart.return_destination_city = destinationName),
        (paramAddToCart.return_destination_id = paramsRound.DestinationId),
        (paramAddToCart.return_boarding_point =
          BoardingPointReturn.Landmark + " " + BoardingPointReturn.Location),
        (paramAddToCart.return_dropping_point =
          DroppingPointReturn.Landmark + " " + DroppingPointReturn.Location),
        (paramAddToCart.return_time_duration = paramsRound.Duration),
        (paramAddToCart.return_select_seat = selectedSheetsRound.length),
        (paramAddToCart.return_select_seat_number = SeatsRound),
        (paramAddToCart.return_base_fare = FaresRound),
        (paramAddToCart.return_service_charge = ServiceChargeRound),
        (paramAddToCart.return_service_tax = ServiceTaxRound),
        (paramAddToCart.return_ConvenienceFee = paramsRound.ConvenienceFee),
        (paramAddToCart.return_trip_type = tripType),
        (paramAddToCart.return_journey_date = moment(paramsRound.Journeydate, "YYYY-MM-DD").format(
          "DD-MM-YYYY"
        ));
    }

    console.log(paramAddToCart);
    console.log(JSON.stringify(paramAddToCart));

    this.setState({ loader: true });
    domainApi
      .post("/cart/add", paramAddToCart)
      .then(({ data }) => {
        if (data.code !== "1") {
          this.setState({ loader: false });
          Toast.show(data.message, Toast.LONG);
        } else {
          this.ApiCall();
        }
      })
      .catch(error => {
        this.setState({ loader: false });
        console.log(error);
      });
  }

  ApiCall() {
    const { user } = this.props;
    domainApi
      .get("/cart?user_id=" + user.id)
      .then(({ data }) => {
        this.setState({ cartData: data, loader: false });
      })
      .catch(() => {
        this.setState({ loader: false });
      });
  }

  _changeAdults = (index, key) => text => {
    let newData = Object.assign([], this.state.adults);
    newData[index][key] = text;
    if (key == "gender") {
      newData[index].den = text == "M" ? "Mr" : "Mrs";
    }
    this.setState({
      adults: newData
    });
  };

  _changeAdult = key => text => {
    this.setState({ [key]: text });
  };

  validate = () => {
    let needToValidateAdults = false;
    needToValidateAdults = this.state.adults.some(item => item.name == "" || item.age == "");
    return needToValidateAdults;
  };

  _Next = () => {
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

    this.props.navigation.navigate("BusPayment", {
      ...this.props.navigation.state.params,
      cartData: this.state.cartData
    });
  };
  render() {
    const {
      params,
      paramsRound,
      destinationName,
      sourceName,
      BoardingPoint,
      BoardingPointReturn,
      DroppingPoint,
      selectedSheets,
      TripType,
      selectedSheetsRound
    } = this.props.navigation.state.params;
    const { loader, cartData } = this.state;
    return (
      <>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        <SafeAreaView style={{ flex: 0, backgroundColor: "#E5EBF7" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <View style={{ flexDirection: "column", flex: 1 }}>
            <View style={{ height: 56, backgroundColor: "#E5EBF7", height: 80 }}>
              <View style={{ flexDirection: "row", width: "100%" }}>
                <Button onPress={() => this.props.navigation.goBack(null)} style={{ padding: 16 }}>
                  <Icon name="md-arrow-back" size={24} />
                </Button>
                <View
                  style={{
                    paddingTop: 16
                  }}>
                  <Text style={{ fontWeight: "700", fontSize: 16, marginHorizontal: 5 }}>
                    Checkout
                  </Text>
                  <Text style={{ fontSize: 12, marginHorizontal: 5, color: "#717984" }}>
                    {moment(params.Journeydate, "YYYY-MM-DD").format("DD MMM")}
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ flex: 4, backgroundColor: "#FFFFFF" }}>
              <ScrollView
                contentContainerStyle={{ backgroundColor: "#ffffff" }}
                showsVerticalScrollIndicator={false}>
                <View
                  style={{
                    elevation: 2,
                    shadowOffset: { width: 0, height: 2 },
                    shadowColor: "rgba(0,0,0,0.1)",
                    shadowOpacity: 1,
                    shadowRadius: 4,
                    borderRadius: 8,
                    backgroundColor: "#ffffff",
                    marginHorizontal: 16,
                    marginTop: 20,
                    padding: 8
                  }}>
                  <Text style={{ fontWeight: "500", fontSize: 18, paddingHorizontal: 4 }}>
                    Departure
                  </Text>
                  <View style={{ flexDirection: "row", marginTop: 10 }}>
                    <View style={{ flex: 3, paddingHorizontal: 4 }}>
                      <Text style={{ color: "#5B6974" }}>Name</Text>
                      <Text>{params.DisplayName}</Text>
                    </View>
                    <View style={{ flex: 2, paddingHorizontal: 4 }}>
                      <Text style={{ color: "#5B6974" }}>Journey Date</Text>
                      <Text>{moment(params.Journeydate, "YYYY-MM-DD").format("DD-MM-YYYY")}</Text>
                    </View>
                    <View style={{ flex: 1, paddingHorizontal: 2 }}>
                      <Text style={{ color: "#5B6974" }}>Seat(s)</Text>
                      <Text>
                        {Array.isArray(selectedSheets) &&
                          selectedSheets.map(item => item.Number).join()}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: "row", marginTop: 10 }}>
                    <View style={{ flex: 1, paddingHorizontal: 4 }}>
                      <Text style={{ color: "#5B6974" }}>Route</Text>
                      <Text>
                        {sourceName} To {destinationName}
                      </Text>
                    </View>
                    <View style={{ flex: 1, paddingHorizontal: 4 }}>
                      <Text style={{ color: "#5B6974" }}>Bus Type</Text>
                      <Text>{params.BusType}</Text>
                    </View>
                  </View>
                  <View style={{ flex: 1, paddingHorizontal: 4, marginTop: 10 }}>
                    <Text style={{ color: "#5B6974" }}>Boarding Point</Text>
                    <Text>{BoardingPoint.Location}</Text>
                  </View>
                </View>

                {TripType == 2 && (
                  <View
                    style={{
                      elevation: 2,
                      shadowOffset: { width: 0, height: 2 },
                      shadowColor: "rgba(0,0,0,0.1)",
                      shadowOpacity: 1,
                      shadowRadius: 4,
                      borderRadius: 8,
                      backgroundColor: "#ffffff",
                      marginHorizontal: 16,
                      marginTop: 20
                    }}>
                    <View style={{ marginHorizontal: 10, marginVertical: 10 }}>
                      <Text style={{ fontSize: 18, fontWeight: "500" }}>Arrival</Text>

                      <View style={{ flexDirection: "row", marginTop: 10 }}>
                        <View style={{ flex: 3, paddingHorizontal: 4 }}>
                          <Text style={{ color: "#5B6974" }}>Name</Text>
                          <Text>{paramsRound.DisplayName}</Text>
                        </View>
                        <View style={{ flex: 2, paddingHorizontal: 4 }}>
                          <Text style={{ color: "#5B6974" }}>Journey Date</Text>
                          <Text>
                            {moment(paramsRound.Journeydate, "YYYY-MM-DD").format("DD-MM-YYYY")}
                          </Text>
                        </View>
                        <View style={{ flex: 1, paddingHorizontal: 4 }}>
                          <Text style={{ color: "#5B6974" }}>Seat(s)</Text>
                          <Text>
                            {Array.isArray(selectedSheetsRound) &&
                              selectedSheetsRound.map(item => item.Number).join()}
                          </Text>
                        </View>
                      </View>
                      <View style={{ flexDirection: "row", marginTop: 10 }}>
                        <View style={{ flex: 1, paddingHorizontal: 4 }}>
                          <Text style={{ color: "#5B6974" }}>Route</Text>
                          <Text>
                            {destinationName} To {sourceName}
                          </Text>
                        </View>
                        <View style={{ flex: 1, paddingHorizontal: 4 }}>
                          <Text style={{ color: "#5B6974" }}>Bus Type</Text>
                          <Text>{paramsRound.BusType}</Text>
                        </View>
                      </View>
                      <View style={{ flex: 1, paddingHorizontal: 4, marginTop: 10 }}>
                        <Text style={{ color: "#5B6974" }}>Boarding Point</Text>
                        <Text>{BoardingPointReturn.Location}</Text>
                      </View>
                    </View>
                  </View>
                )}

                <View
                  style={{
                    elevation: 2,
                    shadowOffset: { width: 0, height: 2 },
                    shadowColor: "rgba(0,0,0,0.1)",
                    shadowOpacity: 1,
                    shadowRadius: 4,
                    backgroundColor: "#ffffff",
                    marginHorizontal: 16,
                    paddingTop: 8,
                    borderRadius: 8,
                    marginTop: 16
                  }}>
                  <View
                    style={{
                      flexDirection: "row",
                      marginHorizontal: 10,
                      alignItems: "center"
                    }}>
                    <Icon type="Foundation" name="shopping-bag" size={22} />
                    <Text style={{ marginStart: 10, fontWeight: "500", fontSize: 18 }}>
                      Price Summary
                    </Text>
                  </View>
                  {Array.isArray(cartData.cart_data) && !isEmpty(cartData.cart_data) && (
                    <>
                      <Text style={{ fontSize: 16, fontWeight: "500", marginHorizontal: 10 }}>
                        Onward Fare
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          flex: 1,
                          marginHorizontal: 10,
                          marginTop: 5,
                          justifyContent: "space-between"
                        }}>
                        <Text>Fare</Text>
                        <Text>
                          <CurrencyText>₹</CurrencyText>
                          <NumberFormat decimalScale={2} fixedDecimalScale
                            value={
                              cartData.cart_data[0].custum_product_data.bus_item_details.base_fare
                            }
                            displayType={"text"}
                            thousandSeparator={true}
                            thousandsGroupStyle="lakh"
                            renderText={value => <Text>{value}</Text>}
                          />
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          flex: 1,
                          marginHorizontal: 10,
                          justifyContent: "space-between"
                        }}>
                        <Text>Service Charges</Text>
                        <Text>
                          <CurrencyText>₹</CurrencyText>
                          <NumberFormat decimalScale={2} fixedDecimalScale
                            value={
                              cartData.cart_data[0].custum_product_data.bus_item_details
                                .service_charge2
                            }
                            displayType={"text"}
                            thousandSeparator={true}
                            thousandsGroupStyle="lakh"
                            renderText={value => <Text>{value}</Text>}
                          />
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between"
                        }}>
                        <Text style={{ marginStart: 10 }}>Tax</Text>
                        <Text style={{ marginEnd: 10 }}>
                          <CurrencyText>₹</CurrencyText>
                          <NumberFormat decimalScale={2} fixedDecimalScale
                            value={
                              cartData.cart_data[0].custum_product_data.bus_item_details
                                .service_tax2
                            }
                            displayType={"text"}
                            thousandSeparator={true}
                            thousandsGroupStyle="lakh"
                            renderText={value => <Text>{value}</Text>}
                          />
                        </Text>
                      </View>
                    </>
                  )}

                  {Array.isArray(cartData.cart_data) &&
                    !isEmpty(cartData.cart_data) &&
                    cartData.cart_data[0].custum_product_data.bus_item_details.hasOwnProperty(
                      "return_base_fare"
                    ) && (
                      <>
                        <Text style={{ fontSize: 16, fontWeight: "500", marginHorizontal: 10 }}>
                          Return Fare
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            flex: 1,
                            marginHorizontal: 10,
                            marginTop: 5,
                            justifyContent: "space-between"
                          }}>
                          <Text>Fare</Text>
                          <Text>
                            <CurrencyText>₹</CurrencyText>
                            <NumberFormat decimalScale={2} fixedDecimalScale
                              value={
                                cartData.cart_data[0].custum_product_data.bus_item_details
                                  .return_base_fare
                              }
                              displayType={"text"}
                              thousandSeparator={true}
                              thousandsGroupStyle="lakh"
                              renderText={value => <Text>{value}</Text>}
                            />
                          </Text>
                        </View>

                        <View
                          style={{
                            flexDirection: "row",
                            flex: 1,
                            marginHorizontal: 10,
                            justifyContent: "space-between"
                          }}>
                          <Text>Service Charges</Text>
                          <Text>
                            <CurrencyText>₹</CurrencyText>
                            <NumberFormat decimalScale={2} fixedDecimalScale
                              value={
                                cartData.cart_data[0].custum_product_data.bus_item_details
                                  .return_service_charge2
                              }
                              displayType={"text"}
                              thousandSeparator={true}
                              thousandsGroupStyle="lakh"
                              renderText={value => <Text>{value}</Text>}
                            />
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between"
                          }}>
                          <Text style={{ marginStart: 10 }}>Tax</Text>
                          <Text style={{ marginEnd: 10 }}>
                            <CurrencyText>₹</CurrencyText>
                            <NumberFormat decimalScale={2} fixedDecimalScale
                              value={
                                cartData.cart_data[0].custum_product_data.bus_item_details
                                  .return_service_tax2
                              }
                              displayType={"text"}
                              thousandSeparator={true}
                              thousandsGroupStyle="lakh"
                              renderText={value => <Text>{value}</Text>}
                            />
                          </Text>
                        </View>
                      </>
                    )}

                  {!this.state.inputCoupon && (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between"
                      }}>
                      {Array.isArray(this.state.cartData.coupon) &&
                        this.state.cartData.coupon.length > 0 && (
                          <Text style={{ marginStart: 10, fontWeight: "700" }}>Discount</Text>
                        )}
                      {Array.isArray(this.state.cartData.coupon) &&
                        this.state.cartData.coupon.length > 0 &&
                        this.state.cartData.coupon.map(coupon => (
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
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      paddingVertical: 10,
                      borderBottomLeftRadius: 8,
                      borderBottomRightRadius: 8,
                      backgroundColor: "#F2F3F5"
                    }}>
                    <Text style={{ marginStart: 10, fontWeight: "700", fontSize: 16 }}>
                      Total Payable
                    </Text>
                    <Text style={{ marginEnd: 10, fontWeight: "700", fontSize: 16 }}>
                      <CurrencyText style={{ marginEnd: 10, fontWeight: "700", fontSize: 16 }}>
                        ₹
                      </CurrencyText>
                      <NumberFormat decimalScale={2} fixedDecimalScale
                        value={cartData.total_price}
                        displayType={"text"}
                        thousandSeparator={true}
                        thousandsGroupStyle="lakh"
                        renderText={value => (
                          <Text style={{ marginEnd: 10, fontWeight: "700", fontSize: 16 }}>
                            {value}
                          </Text>
                        )}
                      />
                    </Text>
                  </View>
                </View>

                {this.state.cartData.hasOwnProperty("coupon") &&
                this.state.cartData.coupon.length == 0 ? (
                  this.state.inputCoupon ? (
                    <View
                      style={{
                        elevation: 1,
                        backgroundColor: "#fff",
                        justifyContent: "center",
                        marginHorizontal: 16,
                        marginTop: 20,
                        paddingVertical: Platform.OS == "ios" ? 10 : 0,
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
                  Array.isArray(this.state.cartData.coupon) &&
                  this.state.cartData.coupon.length > 0 &&
                  this.state.cartData.coupon.map(coupon => (
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
                  onPress={this._Next}>
                  <Text style={{ color: "#fff" }}>Next</Text>
                </Button>
              </ScrollView>
              {this.state.loader && <ActivityIndicator />}
            </View>
          </View>
        </SafeAreaView>
      </>
    );
  }
}

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

export default connect(mapStateToProps, null)(CheckoutBus);
