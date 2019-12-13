import React, { PureComponent } from "react";
import {
  View,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Picker,
  ScrollView
} from "react-native";
import { Button, Text, ActivityIndicator } from "../../components";
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";
import IconSimple from "react-native-vector-icons/SimpleLineIcons";
import Icon from "react-native-vector-icons/Ionicons";
import moment from "moment";
import Toast from "react-native-simple-toast";
import RazorpayCheckout from "react-native-razorpay";
import axios from "axios";
import { isEmpty } from "lodash";
import { connect } from "react-redux";
import { etravosApi, domainApi } from "../../service";
import { Signin } from "../../store/action";

class BusPayment extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log(this.props.navigation.state.params);
    this.state = {
      gender: "Mr",
      ffn: false,
      radioDirect: true,
      radioCheck: false,
      radioCOD: false,
      orderId: "",
      transaction_id: ""
    };
  }

  _FFN = () => {
    this.setState({ ffn: true });
  };

  validate = () => {
    let needToValidateAdults = false;
    const { adults } = this.props.navigation.state.params;
    needToValidateAdults = adults.every(
      item => item.den == "" || item.name == "" || item.age == ""
    );
    return needToValidateAdults;
  };

  _PlaceOrder = () => {
    const {
      TripType,
      params,
      paramsRound,
      adults,
      BlockingReferenceNo,
      BookingReferenceNo,
      BlockingReferenceNoRound,
      BookingReferenceNoRound
    } = this.props.navigation.state.params;

    let adult_details = adults.map(item => ({
      "ad-den": item.den,
      "ad-fname": item.name,
      "ad-gender": item.gender,
      "ad-age": item.age
    }));

    let param = {
      user_id: "7",
      payment_method: "razopay",
      adult_details: adult_details,
      child_details: [],
      infant_details: []
    };

    if (this.validate()) {
      Toast.show("Please enter all the fields.", Toast.SHORT);
    } else {
      if (isEmpty(this.props.signIn)) {
        Toast.show("Please login or signup", Toast.LONG);
      } else {
        // try {
        //   const [BookingOneway, BookingRound] = await axios.all([
        //     etravosApi.get("Buses/BookBusTicket?referenceNo=" + BookingReferenceNo),
        //     etravosApi.get("Buses/BookBusTicket?referenceNo=" + BookingReferenceNoRound)
        //   ]);
        //   console.log(BookingOneway, BookingRound);
        //   this.props.navigation.navigate("ThankYouBus", {
        //     ...this.props.navigation.state.params
        //   });
        // } catch (e) {
        //   console.log(e);
        // }
        //  return;
        const { signIn } = this.props;
        domainApi
          .post("/checkout/new-order?user_id=" + signIn.id, param)
          .then(({ data: order }) => {
            console.log(order);

            var options = {
              description: "Credits towards consultation",
              image: "https://i.imgur.com/3g7nmJC.png",
              currency: "INR",
              key: "rzp_test_a3aQYPLYowGvWJ",
              amount: parseInt(order.total) * 100,
              name: "TripDesire",
              prefill: {
                email: "void@razorpay.com",
                contact: "9191919191",
                name: "Razorpay Software"
              },
              theme: { color: "#E5EBF7" }
            };

            RazorpayCheckout.open(options)
              .then(razorpayRes => {
                if (TripType == 1) {
                  etravosApi
                    .get("Buses/BookBusTicket?referenceNo=" + BookingReferenceNo)
                    .then(({ data: Response }) => {
                      console.log(Response);
                      if (Response.BookingStatus == 3) {
                        this.props.navigation.navigate("ThankYouBus", {
                          order,
                          razorpayRes,
                          Response,
                          ...this.props.navigation.state.params
                        });
                        Toast.show(Response.Message, Toast.LONG);
                        let paymentData = {
                          order_id: order.id,
                          status: "completed",
                          transaction_id: razorpayRes.razorpay_payment_id,
                          reference_no: Response
                        };
                        console.log(paymentData);

                        domainApi.post("/checkout/update-order", paymentData).then(res => {
                          console.log(res);
                        });
                      } else {
                        Toast.show(Response.Message, Toast.LONG);
                      }
                    })
                    .catch(error => {
                      // handle failure
                      alert(`Error: ${error.code} | ${error.description}`);
                    });
                } else {
                  try {
                    const [BookingOneway, BookingRound] = axios.all([
                      etravosApi.get("Buses/BookBusTicket?referenceNo=" + BookingReferenceNo),
                      etravosApi.get("Buses/BookBusTicket?referenceNo=" + BookingReferenceNoRound)
                    ]);
                    console.log(BookingOneway, BookingRound);
                    if (BookingOneway.BookingStatus == 3 && BookingRound.BookingStatus == 3) {
                      this.props.navigation.navigate("ThankYouBus", {
                        ...this.props.navigation.state.params,
                        razorpayRes,
                        BookingOneway,
                        BookingRound,
                        order
                      });

                      Toast.show(BookingOneway.Message, Toast.LONG);
                      let paymentData = {
                        order_id: order.id,
                        status: "completed",
                        transaction_id: razorpayRes.razorpay_payment_id,
                        reference_no: Response
                      };
                      console.log(paymentData);

                      domainApi.post("/checkout/update-order", paymentData).then(res => {
                        console.log(res);
                      });
                    }
                  } catch (e) {
                    console.log(e);
                  }
                }
              })
              .catch(error => {
                console.log(error);
              });
          });
      }
    }
  };

  _radioButton = value => {
    this.setState({
      radioDirect: value == "D" ? true : false
    });
  };
  render() {
    const { radioDirect } = this.state;
    const { cartData, params } = this.props.navigation.state.params;
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
                  Checkout
                </Text>
                <Text style={{ fontSize: 12, marginHorizontal: 5, color: "#717984" }}>
                  {moment(params.Journeydate, "YYYY-MM-DD").format("DD MMM")} |{" "}
                  {moment(params.Journeydate, "YYYY-MM-DD").format("dddd")}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "flex-start"
                }}>
                <IconMaterial name="share-variant" size={20} color="#5D89F4" />
              </View>
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
                borderRadius: 8,
                backgroundColor: "#ffffff",
                marginHorizontal: 16,
                marginTop: 20
              }}>
              <View style={{ marginVertical: 10 }}>
                <View style={{ flexDirection: "row", alignItems: "center", marginHorizontal: 10 }}>
                  <IconSimple name="bag" size={30} />
                  <Text style={{ marginStart: 10, fontWeight: "300", fontSize: 16 }}>
                    Fare Backup
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingHorizontal: 10,
                    marginTop: 5
                  }}>
                  <Text>Onward Fare</Text>
                  <Text></Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    backgroundColor: "#F2F3F5",
                    paddingHorizontal: 10
                  }}>
                  <Text>Fare</Text>
                  <Text>0.00</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingHorizontal: 10
                  }}>
                  <Text>Conv. Fare</Text>
                  <Text>0.00</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    backgroundColor: "#F2F3F5",
                    paddingHorizontal: 10,
                    marginBottom: 10
                  }}>
                  <Text style={{ fontSize: 16 }}>TOTAL PAYABLE</Text>
                  <Text style={{ fontSize: 16, fontWeight: "700" }}>{cartData.total_price}</Text>
                </View>
              </View>
            </View>
            <View
              style={{
                elevation: 2,
                backgroundColor: "#ffffff",
                marginHorizontal: 16,
                marginTop: 20,
                height: 40,
                flexDirection: "row",
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "space-between"
              }}>
              <TextInput style={{ marginStart: 10, flex: 1 }} placeholder="Have a Promo Code?" />
              <Button
                style={{
                  height: 40,
                  paddingHorizontal: 10,
                  justifyContent: "center",
                  backgroundColor: "#5B89F9",
                  borderBottomRightRadius: 8,
                  borderTopRightRadius: 8
                }}>
                <Text style={{ color: "#fff" }}>Apply</Text>
              </Button>
            </View>

            <View
              style={{
                elevation: 2,
                backgroundColor: "#ffffff",
                marginHorizontal: 16,
                marginTop: 20,
                padding: 10,
                borderRadius: 8
              }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity onPress={() => this._radioButton("D")}>
                  <View
                    style={{
                      height: 18,
                      width: 18,
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor: "#000",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                    {radioDirect && (
                      <View
                        style={{
                          height: 10,
                          width: 10,
                          borderRadius: 6,
                          backgroundColor: "#000"
                        }}
                      />
                    )}
                  </View>
                </TouchableOpacity>
                <Text style={{ marginStart: 5, fontSize: 16 }}>RazorPay</Text>
              </View>
              <Text style={{ flex: 1, fontSize: 12, color: "#696969", marginHorizontal: 20 }}>
                Make your payment direct into our bank account.Please use your order ID as the
                payment reference.Your order will not be shipped untill the funds have cleared in
                our account
              </Text>
            </View>

            <Button
              style={{
                backgroundColor: "#F68E1D",
                marginHorizontal: 100,
                alignItems: "center",
                marginVertical: 30,
                justifyContent: "center",
                height: 40,
                borderRadius: 20
              }}
              onPress={this._PlaceOrder}>
              <Text style={{ color: "#fff" }}>Place Order</Text>
            </Button>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  signIn: state.signIn
});

export default connect(mapStateToProps, null)(BusPayment);
