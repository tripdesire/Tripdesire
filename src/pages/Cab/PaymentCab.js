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

class PaymentCab extends React.PureComponent {
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
      coupon_code: "",
      isSelectPaymentMethod: 0,
      payment_method: "wallet"
    };
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

  _radioButton = (index, item) => {
    this.setState({
      isSelectPaymentMethod: index,
      payment_method: item.gateway_id
    });
  };

  _order = () => {
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

    let name = this.state.firstname.concat(
      this.state.last_name != "" ? "~" + this.state.last_name : ""
    );

    const { den, firstname, last_name, dob, gender, age } = this.state;

    let adult_details = [
      {
        "ad-den": den,
        "ad-fname": firstname,
        "ad-lname": last_name,
        "ad-dob": dob,
        "ad-gender": gender,
        "ad-age": age
      }
    ];

    let newOrder = {
      user_id: user.id,
      payment_method: this.state.payment_method,
      adult_details: adult_details,
      child_details: [],
      infant_details: []
    };

    const { item, params, data } = this.props.navigation.state.params;
    let param = {
      TotalFare: data.total_price, //   cartData.cart_data[0].custum_product_data.car_item_details.total_price, ///
      Conveniencefee: item.ConvenienceFee,
      NoofPassengers: item.VehicleId,
      Name: name,
      MobileNo: user.billing.phone,
      EmailID: user.billing.email || user.email,
      City: params.sourceName,
      Address: params.sourceName,
      State: user.billing.state,
      PostalCode: user.billing.postcode,
      PickUpLocation: params.travelType == 3 ? params.Pickuplocation : "",
      DropLocation: params.travelType == 3 ? params.Droplocation : "",
      Provider: item.Provider,
      Operator: item.Name,
      CancellationPolicy: item.CancellationPolicy,
      VehicleName: item.Name,
      ApproxRoundTripDistance: item.ApproxDistance,
      MinimumChargedDistance: item.MinimumChargedDistance,
      PerKmRateCharge: item.PerKm,
      PerKmRateOnewayCharge: item.PerKmRateOneWayCharge,
      DriverCharges: item.DriverCharges,
      NoOfCars: "1",
      WaitingCharges: item.WaitingCharges,
      ExtraHourRate: item.ExtraHourRate,
      SMSUsageCount: 0,
      BasicRate: item.BasicRate,
      SourceId: parseInt(params.sourceId),
      SourceName: params.sourceName,
      DestinationId: parseInt(params.destinationId) != 0 ? parseInt(params.destinationId) : 0,
      DestinationName: params.destinationName != "" ? params.destinationName : null,
      JourneyDate: params.journeyDate,
      ReturnDate: params.TravelType == 1 ? params.ReturnDate : null,
      TripType: parseInt(params.tripType),
      TravelType: params.travelType,
      OperatorId: null,
      OperatorName: null,
      PickUpTime: params.pickUpTime,
      Days: 1,
      SessionId: "vxpj0ccfqvg1dk2532zffrom",
      User: "",
      NightHalt: item.NightHalt,
      UserType: 5,
      key: item.key
    };

    console.log(param);
    console.log(JSON.stringify(param));

    if (this.state.firstname != "" && this.state.last_name != "") {
      if (isEmpty(this.props.user)) {
        //Toast.show("Please login or signup", Toast.LONG);
        this.props.navigation.navigate("SignIn", { isCheckout: true });
      } else {
        this.setState({ loader: true });
        etravosApi
          .post("/Cabs/BlockCab", param)
          .then(response => {
            this.setState({ loader: false });
            console.log(response);
            if (response.data.BookingStatus == 1) {
              const { user } = this.props;
              domainApi
                .post(
                  "/checkout/new-order?user_id=" + user.id + "&payment_method=razorpay",
                  newOrder
                )
                .then(({ data: ord }) => {
                  console.log(ord);

                  var options = {
                    description: "Credits towards consultation",
                    //image: "https://i.imgur.com/3g7nmJC.png",
                    currency: "INR",
                    key: "rzp_test_I66kFrN53lhauw",
                    //  key: "rzp_live_IRhvqgmESx60tW",
                    amount: parseInt(ord.total) * 100,
                    name: "TripDesire",
                    prefill: {
                      email: user.billing.email,
                      contact: user.billing.phone,
                      name: "Razorpay Software"
                    },
                    theme: { color: "#E5EBF7" }
                  };

                  RazorpayCheckout.open(options)
                    .then(razorpayRes => {
                      // handle success
                      console.log(razorpayRes);
                      // alert(`Success: ${razorpayRes.razorpay_payment_id}`);
                      if (
                        (razorpayRes.razorpay_payment_id &&
                          razorpayRes.razorpay_payment_id != "") ||
                        razorpayRes.code == 0
                      ) {
                        this.setState({ loader: true });
                        etravosApi
                          .get("Cabs/BookCab?referenceNo=" + response.data.ReferenceNo)
                          .then(({ data: Response }) => {
                            this.setState({ loader: false });
                            console.log(Response);
                            if (Response.BookingStatus == 3) {
                              Toast.show(Response.Message, Toast.LONG);
                            } else {
                              Toast.show(Response.Message, Toast.LONG);
                            }
                          })
                          .catch(error => {
                            console.log(error);
                          });
                        let paymentData = {
                          order_id: ord.id,
                          status: "completed",
                          transaction_id: razorpayRes.razorpay_payment_id,
                          reference_no: Response // blockres.data.ReferenceNo
                        };
                        this.setState({ loader: true });
                        domainApi
                          .post("/checkout/update-order", paymentData)
                          .then(({ data: order }) => {
                            this.setState({ loader: false });
                            console.log(order);
                            const { params } = this.props.navigation.state.params;
                            this.props.navigation.navigate("CabThankYou", {
                              isOrderPage: false,
                              order: order.data,
                              params,
                              razorpayRes,
                              item
                            });
                          });
                      } else {
                        Toast.show("You have been cancelled the order.", Toast.LONG);
                      }
                    })
                    .catch(error => {
                      this.setState({ loader: false });
                      console.log(error);
                    });
                })
                .catch(error => {
                  this.setState({ loader: false });
                  console.log(error);
                });
            } else {
              Toast.show(response.data.Message, Toast.LONG);
            }
          })
          .catch(error => {
            this.setState({ loader: false });
            console.log(error);
          });
      }
    } else {
      Toast.show("Please fill all the Details.", Toast.LONG);
    }
  };

  render() {
    const { data } = this.props.navigation.state.params;
    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "#E5EBF7" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <View>
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
                <Text style={{ fontWeight: "700", fontSize: 16 }}>Checkout</Text>
              </View>
            </View>
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
            </View>
            {data.payment_gateway &&
              data.payment_gateway.map((item, index) => {
                return (
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
                    }}
                    key={"sap" + index}>
                    <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                      <TouchableOpacity onPress={() => this._radioButton(index, item)}>
                        <View
                          style={{
                            height: 18,
                            width: 18,
                            borderRadius: 12,
                            borderWidth: 2,
                            marginTop: 4,
                            borderColor: "#000",
                            alignItems: "center",
                            justifyContent: "center"
                          }}>
                          {this.state.isSelectPaymentMethod === index && (
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
                      <Text style={{ marginStart: 5, fontSize: 18, fontWeight: "500" }}>
                        {" "}
                        {item.gateway_title}
                      </Text>
                    </View>
                    <HTML
                      baseFontStyle={{
                        flex: 1,
                        fontSize: 12,
                        color: "#696969",
                        marginHorizontal: 20
                      }}
                      html={item.gateway_description}
                    />
                  </View>
                );
              })}

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
              onPress={this._order}>
              <Text style={{ color: "#fff" }}>Order</Text>
            </Button>
          </View>
          {this.state.loader && <ActivityIndicator />}
        </SafeAreaView>
      </>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
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

export default connect(mapStateToProps, null)(PaymentCab);
