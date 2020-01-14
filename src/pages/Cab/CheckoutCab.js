import React, { PureComponent } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Picker,
  ScrollView,
  Platform,
  SafeAreaView,
  StyleSheet
} from "react-native";
import Toast from "react-native-simple-toast";
import DateTimePicker from "react-native-modal-datetime-picker";
import { Button, Text, ActivityIndicator, Icon } from "../../components";
import moment from "moment";
import RazorpayCheckout from "react-native-razorpay";
import RNPickerSelect from "react-native-picker-select";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import { etravosApi, domainApi } from "../../service";
import HTML from "react-native-render-html";

class CheckoutCab extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log(props.navigation.state.params);
    this.state = {
      den: "Mr",
      firstname: "",
      last_name: "",
      dob: moment()
        .subtract(12, "years")
        .toDate(),
      age: "",
      gender: "M",
      show: false,
      dobShow: false,
      loader: false,
      radioDirect: true,
      cartData: {},
      inputCoupon: false,
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
    const { params, item } = this.props.navigation.state.params;
    let data = {
      id: 2238,
      quantity: 1,
      car_item_data: item,
      image_path: "",
      car_name: item.Name,
      travel_type: params.travelType,
      trip_type: parseInt(params.tripType),
      pickup_time: params.pickUpTime,
      journey_date: params.journeyDate,
      return_date: params.travelType == 1 ? params.returnDate : "",
      source_city: params.sourceName,
      source_id: parseInt(params.sourceId),
      destination_city: params.travelType == 1 ? params.destinationName : "",
      destination_id: params.travelType == 1 ? parseInt(params.destinationId) : 0, /////
      car_seat: item.SeatingCapacity,
      car_bagesQty: parseInt(item.AdditionalInfo.BaggageQuantity),
      per_km: item.PerKm,
      convenience_fee: item.ConvenienceFee,
      total_price: item.TotalAmount,
      driver_charge: item.DriverCharges,
      terms_conditions: item.TermsConditions
    };

    console.log(data);

    this.setState({ loader: true });
    domainApi
      .post("/cart/add", data)
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
    domainApi
      .get("/cart")
      .then(({ data: CartData }) => {
        this.setState({ cartData: CartData, loader: false });
      })
      .catch(error => {
        this.setState({ loader: false });
        console.log(error);
      });
  }

  onAdultChange = key => text => {
    let den = key == "gender" && text == "M" ? "Mr" : "Mrs";
    this.setState({
      [key]: text,
      dobShow: false,
      den,
      age: moment().diff(moment(text), "years")
    });
  };

  handleDtPickerCancel = () => {
    this.setState({ dobShow: false });
  };

  showDatePicker = () => {
    this.setState({ dobShow: true });
  };

  _radioButton = value => {
    this.setState({
      radioDirect: value == "D" ? true : false
    });
  };

  _next = () => {
    console.log("kamal");
    this.props.navigation.navigate("PaymentCab", {
      ...this.props.navigation.state.params
    });
  };

  // _order = () => {
  //   const { user } = this.props;
  //   if (isEmpty(user)) {
  //     //Toast.show("Please login or signup", Toast.LONG);
  //     this.props.navigation.navigate("SignIn", { needBilling: true });
  //     return;
  //   }
  //   if (
  //     user.billing.email === "" ||
  //     user.billing.phone === "" ||
  //     user.billing.state === "" ||
  //     user.billing.city === "" ||
  //     user.billing.address_1 === "" ||
  //     user.billing.postcode === ""
  //   ) {
  //     this.props.navigation.navigate("BillingDetails", { needBillingOnly: true });
  //     return;
  //   }

  //   let name = this.state.firstname.concat(
  //     this.state.last_name != "" ? "~" + this.state.last_name : ""
  //   );

  //   const { den, firstname, last_name, dob, gender, age } = this.state;

  //   let adult_details = [
  //     {
  //       "ad-den": den,
  //       "ad-fname": firstname,
  //       "ad-lname": last_name,
  //       "ad-dob": dob,
  //       "ad-gender": gender,
  //       "ad-age": age
  //     }
  //   ];

  //   let newOrder = {
  //     user_id: "7",
  //     payment_method: "razopay",
  //     adult_details: adult_details,
  //     child_details: [],
  //     infant_details: []
  //   };

  //   const { item, params } = this.props.navigation.state.params;
  //   const { cartData } = this.state;
  //   let param = {
  //     TotalFare: item.TotalNetAmount, //   cartData.cart_data[0].custum_product_data.car_item_details.total_price, ///
  //     Conveniencefee: item.ConvenienceFee,
  //     NoofPassengers: item.VehicleId,
  //     Name: name,
  //     MobileNo: user.billing.phone,
  //     EmailID: user.billing.email || user.email,
  //     City: params.sourceName,
  //     Address: params.sourceName,
  //     State: user.billing.state,
  //     PostalCode: user.billing.postcode,
  //     PickUpLocation: params.travelType == 3 ? params.Pickuplocation : "",
  //     DropLocation: params.travelType == 3 ? params.Droplocation : "",
  //     Provider: item.Provider,
  //     Operator: item.Name,
  //     CancellationPolicy: item.CancellationPolicy,
  //     VehicleName: item.Name,
  //     ApproxRoundTripDistance: item.ApproxDistance,
  //     MinimumChargedDistance: item.MinimumChargedDistance,
  //     PerKmRateCharge: item.PerKm,
  //     PerKmRateOnewayCharge: item.PerKmRateOneWayCharge,
  //     DriverCharges: item.DriverCharges,
  //     NoOfCars: "1",
  //     WaitingCharges: item.WaitingCharges,
  //     ExtraHourRate: item.ExtraHourRate,
  //     SMSUsageCount: 0,
  //     BasicRate: item.BasicRate,
  //     SourceId: parseInt(params.sourceId),
  //     SourceName: params.sourceName,
  //     DestinationId: parseInt(params.destinationId) != 0 ? parseInt(params.destinationId) : 0,
  //     DestinationName: params.destinationName != "" ? params.destinationName : null,
  //     JourneyDate: params.journeyDate,
  //     ReturnDate: params.TravelType == 1 ? params.ReturnDate : null,
  //     TripType: parseInt(params.tripType),
  //     TravelType: params.travelType,
  //     OperatorId: null,
  //     OperatorName: null,
  //     PickUpTime: params.pickUpTime,
  //     Days: 1,
  //     SessionId: "vxpj0ccfqvg1dk2532zffrom",
  //     User: "",
  //     NightHalt: item.NightHalt,
  //     UserType: 5,
  //     key: item.key
  //   };

  //   console.log(param);
  //   console.log(JSON.stringify(param));

  //   if (this.state.firstname != "" && this.state.last_name != "") {
  //     if (isEmpty(this.props.user)) {
  //       //Toast.show("Please login or signup", Toast.LONG);
  //       this.props.navigation.navigate("SignIn", { isCheckout: true });
  //     } else {
  //       this.setState({ loader: true });
  //       etravosApi
  //         .post("/Cabs/BlockCab", param)
  //         .then(response => {
  //           this.setState({ loader: false });
  //           console.log(response);
  //           if (response.data.BookingStatus == 1) {
  //             const { user } = this.props;
  //             domainApi
  //               .post("/checkout/new-order?user_id=" + user.id, newOrder)
  //               .then(({ data: order }) => {
  //                 console.log(order);

  //                 var options = {
  //                   description: "Credits towards consultation",
  //                   //image: "https://i.imgur.com/3g7nmJC.png",
  //                   currency: "INR",
  //                   //key: "rzp_test_I66kFrN53lhauw",
  //                   key: "rzp_live_IRhvqgmESx60tW",
  //                   amount: parseInt(order.total) * 100,
  //                   name: "TripDesire",
  //                   prefill: {
  //                     email: user.billing.email,
  //                     contact: user.billing.phone,
  //                     name: "Razorpay Software"
  //                   },
  //                   theme: { color: "#E5EBF7" }
  //                 };

  //                 RazorpayCheckout.open(options)
  //                   .then(razorpayRes => {
  //                     // handle success
  //                     console.log(razorpayRes);
  //                     // alert(`Success: ${razorpayRes.razorpay_payment_id}`);
  //                     if (
  //                       (razorpayRes.razorpay_payment_id &&
  //                         razorpayRes.razorpay_payment_id != "") ||
  //                       razorpayRes.code == 0
  //                     ) {
  //                       this.setState({ loader: true });
  //                       etravosApi
  //                         .get("Cabs/BookCab?referenceNo=" + response.data.ReferenceNo)
  //                         .then(({ data: Response }) => {
  //                           this.setState({ loader: false });
  //                           console.log(Response);
  //                           if (Response.BookingStatus == 3) {
  //                             Toast.show(Response.Message, Toast.LONG);
  //                           } else {
  //                             Toast.show(Response.Message, Toast.LONG);
  //                           }
  //                         })
  //                         .catch(error => {
  //                           console.log(error);
  //                         });
  //                       let paymentData = {
  //                         order_id: order.id,
  //                         status: "completed",
  //                         transaction_id: razorpayRes.razorpay_payment_id,
  //                         reference_no: Response // blockres.data.ReferenceNo
  //                       };
  //                       this.setState({ loader: true });
  //                       domainApi.post("/checkout/update-order", paymentData).then(res => {
  //                         this.setState({ loader: false });
  //                         console.log(res);
  //                       });
  //                       const { params } = this.props.navigation.state.params;
  //                       this.props.navigation.navigate("ThankYouCab", {
  //                         order,
  //                         params,
  //                         razorpayRes,
  //                         item
  //                       });
  //                     } else {
  //                       Toast.show("You have been cancelled the order.", Toast.LONG);
  //                     }
  //                   })
  //                   .catch(error => {
  //                     this.setState({ loader: false });
  //                     console.log(error);
  //                   });
  //               })
  //               .catch(error => {
  //                 this.setState({ loader: false });
  //                 console.log(error);
  //               });
  //           } else {
  //             Toast.show(response.data.Message, Toast.LONG);
  //           }
  //         })
  //         .catch(error => {
  //           this.setState({ loader: false });
  //           console.log(error);
  //         });
  //     }
  //   } else {
  //     Toast.show("Please fill all the Details.", Toast.LONG);
  //   }
  // };

  render() {
    const { loader } = this.state;
    const { item, params, cartData } = this.props.navigation.state.params;
    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "#E5EBF7" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <View style={{ flex: 1 }}>
            <View
              style={{
                height: 56,
                backgroundColor: "#E5EBF7",
                flexDirection: "row",
                paddingHorizontal: 16,
                paddingVertical: 10
              }}>
              <Button onPress={() => this.props.navigation.goBack(null)}>
                <Icon name="md-arrow-back" size={24} />
              </Button>
              <View style={{ marginHorizontal: 20 }}>
                <Text style={{ fontWeight: "700", fontSize: 16 }}>Cab Summary</Text>
              </View>
            </View>
            <ScrollView style={{ flex: 4, backgroundColor: "#FFFFFF" }}>
              <View
                style={{
                  elevation: 1,
                  shadowOffset: { width: 0, height: 2 },
                  shadowColor: "rgba(0,0,0,0.2)",
                  shadowOpacity: 1,
                  shadowRadius: 4,
                  borderRadius: 8,
                  backgroundColor: "#ffffff",
                  marginHorizontal: 16,
                  marginTop: 20,
                  padding: 8
                }}>
                <View style={{ flexDirection: "row", width: "100%" }}>
                  {/* <Icon name={Platform.OS == "ios" ? "ios-car" : "md-car"} size={50} /> */}
                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: "100%"
                      }}>
                      <View style={{ flex: 4 }}>
                        <Text style={{ color: "#5B6974" }}>Name</Text>
                        <Text>{item.Name}</Text>
                      </View>
                      <View style={{ flex: 2 }}>
                        <Text style={{ color: "#5B6974" }}>Location</Text>
                        {/* <Text style={{ lineHeight: 18, color: "#696969" }}>
                          {params.travelType == 2
                            ? "Local"
                            : params.travelType == 1
                            ? "Outstation"
                            : params.travelType == 3
                            ? "Transfer"
                            : ""}
                          {params.tripType == 1
                            ? " ( One Way )"
                            : params.tripType == 2
                            ? " ( Round )"
                            : params.tripType == 4
                            ? " ( " + params.tripType + " hrs )"
                            : params.tripType == 8
                            ? " ( " + params.tripType + " hrs )"
                            : params.tripType == 12
                            ? " ( " + params.tripType + " hrs )"
                            : params.tripType == 24
                            ? " ( " + params.tripType + " hrs )"
                            : ""}
                        </Text> */}
                        <Text>
                          {params.sourceName}{" "}
                          {params.destinationName != "" ? "To " + params.destinationName : ""}
                        </Text>
                      </View>
                    </View>

                    {/* <View
                      style={{
                        backgroundColor: "#696969",
                        height: 1.35,
                        marginVertical: 5
                      }}></View> */}
                    <View
                      style={{
                        flexDirection: "row",
                        marginTop: 10,
                        justifyContent: "space-between",
                        width: "100%"
                      }}>
                      <View style={{ flex: 4 }}>
                        <Text style={{ color: "#5B6974" }}>Departure</Text>
                        <Text>
                          {params.journeyDate} ( {params.pickUpTime} )
                        </Text>
                      </View>
                      {params.returnDate && params.returnDate != "" && (
                        <View style={{ flex: 2 }}>
                          <Text style={{ color: "#5B6974" }}>Return</Text>
                          <Text>{params.returnDate != "" ? params.returnDate : null}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </View>
              {/* <View
                style={{
                  elevation: 1,
                  shadowOffset: { width: 0, height: 2 },
                  shadowColor: "rgba(0,0,0,0.2)",
                  shadowOpacity: 1,
                  shadowRadius: 4,
                  borderRadius: 8,
                  backgroundColor: "#ffffff",
                  marginHorizontal: 16,
                  marginTop: 20
                }}>
                <View style={{ marginHorizontal: 10, marginVertical: 10 }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      source={require("../../assets/imgs/person.png")}
                      style={{ width: 20, height: 20 }}
                      resizeMode="cover"
                    />
                    <Text style={{ marginStart: 10, fontWeight: "500", fontSize: 18 }}>
                      Passengers Details
                    </Text>
                  </View>
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        marginTop: 10,
                        justifyContent: "center",
                        alignItems: "center"
                      }}>
                      <Text style={{ flexBasis: "15%" }}>Adult</Text>

                      <TextInput
                        style={{
                          borderWidth: 1,
                          borderColor: "#F2F2F2",
                          height: 40,
                          flex: 1,
                          paddingStart: 5,
                          marginEnd: 5
                        }}
                        onChangeText={this.onAdultChange("firstname")}
                        placeholder="First Name"
                      />
                      <TextInput
                        style={{
                          borderWidth: 1,
                          borderColor: "#F2F2F2",
                          height: 40,
                          paddingStart: 5,
                          flex: 1
                        }}
                        placeholder="Last Name"
                        onChangeText={this.onAdultChange("last_name")}
                      />
                    </View>
                    <View
                      style={{
                        marginTop: 5,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center"
                      }}>
                      <Text style={{ flexBasis: "15%" }}>DOB</Text>
                      <Button
                        style={{
                          flex: 1,
                          borderWidth: 1,
                          borderColor: "#F2F2F2",
                          height: 40,
                          marginEnd: 5,
                          justifyContent: "center",
                          paddingStart: 5
                        }}
                        onPress={this.showDatePicker}
                        placeholder="DOB">
                        <Text>{moment(this.state.dob).format("DD-MMM-YYYY")}</Text>
                      </Button>
                      <DateTimePicker
                        date={this.state.dob}
                        isVisible={this.state.dobShow}
                        onConfirm={this.onAdultChange("dob")}
                        onCancel={this.handleDtPickerCancel}
                        maximumDate={moment()
                          .subtract(12, "years")
                          .toDate()}
                      />
                      <View
                        style={{
                          flex: 1,
                          borderWidth: 1,
                          borderColor: "#F2F2F2",
                          height: 40,
                          justifyContent: "center"
                        }}>
                        <RNPickerSelect
                          useNativeAndroidPickerStyle={false}
                          placeholder={{}}
                          selectedValue={this.state.gender}
                          style={{
                            inputAndroid: {
                              color: "#000",
                              padding: 0,
                              height: 20,
                              paddingStart: 3
                            },
                            inputIOS: { paddingStart: 3, color: "#000" },
                            iconContainer: { marginEnd: 8 }
                          }}
                          onValueChange={(itemValue, itemIndex) =>
                            this.setState({ gender: itemValue })
                          }
                          items={[
                            { label: "Male", value: "M" },
                            { label: "Female", value: "F" }
                          ]}
                          Icon={() => <Icon name="ios-arrow-down" size={20} />}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </View> */}
              <View
                style={{
                  elevation: 1,
                  shadowOffset: { width: 0, height: 2 },
                  shadowColor: "rgba(0,0,0,0.2)",
                  shadowOpacity: 1,
                  shadowRadius: 4,
                  backgroundColor: "#ffffff",
                  marginHorizontal: 16,
                  marginTop: 20,
                  padding: 10,
                  borderRadius: 8
                }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Icon type="Foundation" name="shopping-bag" size={22} />
                  <Text style={{ marginStart: 10, fontWeight: "500", fontSize: 18 }}>
                    Price Summary
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    flex: 1,
                    marginTop: 10,
                    paddingHorizontal: 8
                  }}>
                  <Text>Convenience Fee </Text>
                  <Text>₹0</Text>
                </View>
                {!this.state.inputCoupon && (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between"
                    }}>
                    {Array.isArray(this.state.cartData.coupon) &&
                      this.state.cartData.coupon.length > 0 && (
                        <Text style={{ marginStart: 10 }}>Discount</Text>
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
                    flex: 1,
                    paddingHorizontal: 8
                  }}>
                  <Text style={{ fontSize: 16, fontWeight: "700" }}>Total Payable</Text>
                  <Text style={{ fontSize: 16, fontWeight: "700" }}>
                    ₹ {this.state.cartData.total_price}
                  </Text>
                </View>
              </View>
              {/* <View
                style={{
                  elevation: 1,
                  shadowOffset: { width: 0, height: 2 },
                  shadowColor: "rgba(0,0,0,0.2)",
                  shadowOpacity: 1,
                  shadowRadius: 4,
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
                      {this.state.radioDirect && (
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
                  <Text style={{ marginStart: 5, fontSize: 18, fontWeight: "500" }}>RazorPay</Text>
                </View>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 12,
                    color: "#696969",
                    marginHorizontal: 20
                  }}>
                  Accept Cards, Netbanking, Wallets & UPI. Developer Friendly API, Fast Onboarding.
                  Free & Easy Application Process.100+ Payment Modes, Secure Gateway, Simple
                  Integration. Easy Integration. Dashboard Reporting. etravosApis: Customize Your
                  Checkout, Autofill OTP on Mobile.
                </Text>
              </View> */}

              {this.state.cartData.hasOwnProperty("coupon") &&
              this.state.cartData.coupon.length == 0 ? (
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
                        shadowOpacity: 0.5,
                        shadowRadius: 1,
                        borderRadius: 8,
                        shadowOffset: { height: 2, width: 0 }
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
                  marginVertical: 30,
                  justifyContent: "center",
                  height: 40,
                  borderRadius: 20
                }}
                onPress={this._next}>
                <Text style={{ color: "#fff" }}>Next</Text>
              </Button>
            </ScrollView>
            {loader && <ActivityIndicator />}
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

export default CheckoutCab;
