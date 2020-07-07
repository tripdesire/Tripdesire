import React from "react";
import {
  View,
  Image,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ScrollView,
  SafeAreaView
} from "react-native";
import Toast from "react-native-simple-toast";
import DateTimePicker from "react-native-modal-datetime-picker";
import { Button, Text, ActivityIndicator, Icon } from "../components";
import moment from "moment";
import RNPickerSelect from "react-native-picker-select";
import RazorpayCheckout from "react-native-razorpay";
import { isEmpty } from "lodash";
import { connect } from "react-redux";
import { etravosApi, domainApi } from "../service";
import HTML from "react-native-render-html";
import analytics from "@react-native-firebase/analytics";

class BlogPayment extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log(props.navigation.state.params);
    const { params, data } = props.navigation.state.params;
    this.state = {
      data: data,
      loading: false,
      date: new Date(),
      gender: "Mr",
      DOB: new Date(),
      mode: "date",
      ffn: false,
      firstname: "",
      lastname: "",
      age: "",
      adultName: "",
      adultDob: "",
      adultAge: "",
      adultGender: "",
      childName: "",
      childDob: "",
      childAge: "",
      childGender: "",
      adults: [...Array(parseInt(params.No_of_person))].map(item => {
        return {
          den: "Mr",
          firstname: "",
          last_name: "",
          dob: moment()
            .subtract(18, "years")
            .toDate(),
          age: 18,
          gender: "M",
          show: false
        };
      }),
      radioDirect: true,
      orderId: "",
      transactionId: "",
      status: "",
      openLoginPage: false,
      isSelectPaymentMethod: 0,
      payment_method: data.payment_gateway[0].gateway_id
    };
    this.ApiCall(data.payment_gateway[0]);
  }

  trackScreenView = async screen => {
    // Set & override the MainActivity screen name
    await analytics().setCurrentScreen(screen, screen);
  };
  componentDidMount() {
    this.trackScreenView("Hotel Payment");
  }

  show = (key, index, isShow) => () => {
    let newData = Object.assign([], this.state[key]);
    newData[index].show = isShow;
    this.setState({
      [key]: newData
    });
  };

  _FFN = () => {
    this.setState({ ffn: this.state.ffn == true ? false : true });
  };

  onAdultChange = (index, key) => text => {
    let newData = Object.assign([], this.state.adults);
    newData[index][key] = text;
    newData[index].show = false;
    if (key == "dob") {
      newData[index].age = moment().diff(moment(text), "years");
    }
    if (key == "gender") {
      newData[index].den = text == "M" ? "Mr" : "Mrs";
    }
    this.setState({
      adults: newData
    });
  };

  validate = () => {
    let needToValidateAdults = false;
    needToValidateAdults = this.state.adults.some(
      item => item.firstname == "" || item.last_name == "" || item.age == ""
    );
    return needToValidateAdults;
  };

  _order = () => {
    const { params, data } = this.props.navigation.state.params;

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

    let adult_details = this.state.adults.map(item => ({
      "ad-den": item.den,
      "ad-fname": item.firstname,
      "ad-lname": item.last_name,
      "ad-dob": item.dob,
      "ad-gender": item.gender,
      "ad-age": item.age
    }));

    let param = {
      //user_id: user.id,
      //payment_method: this.state.payment_method,
      adult_details: adult_details
    };

    console.log(param);

    if (this.validate()) {
      Toast.show("Please enter all the fields.", Toast.SHORT);
    } else {
      if (isEmpty(this.props.user)) {
        //Toast.show("Please login or signup", Toast.LONG);
        this.props.navigation.navigate("SignIn", { isCheckout: true });
      } else {
        this.setState({ loading: true });
        const { user } = this.props;
        domainApi
          .post(
            "/checkout/new-order?user_id=" +
              user.id +
              "&payment_method=" +
              this.state.payment_method,
            param
          )
          .then(({ data: ord }) => {
            console.log(ord);

            if (this.state.payment_method == "razorpay") {
              var options = {
                description: "Credits towards consultation",
                //image: "https://i.imgur.com/3g7nmJC.png",
                currency: "INR",
                key: "rzp_test_I66kFrN53lhauw",
                //key: "rzp_live_IRhvqgmESx60tW",
                amount: parseInt(ord.total) * 100,
                name: "TripDesire",
                prefill: {
                  email: user.billing.email,
                  contact: user.billing.phone,
                  name:
                    user.first_name && user.last_name
                      ? user.first_name + " " + user.last_name
                      : user.first_name
                      ? user.first_name
                      : user.username
                },
                theme: { color: "#E5EBF7" }
              };
              RazorpayCheckout.open(options)
                .then(razorpayRes => {
                  // handle success
                  console.log(razorpayRes);
                  this.setState({ loading: true });
                  if (
                    (razorpayRes.razorpay_payment_id && razorpayRes.razorpay_payment_id != "") ||
                    razorpayRes.code == 0
                  ) {
                    let paymentData = {
                      order_id: ord.id,
                      status: "completed",
                      transaction_id: razorpayRes.razorpay_payment_id,
                      reference_no: "" // blockres.data.ReferenceNo
                    };
                    this.setState({ loading: true });
                    domainApi
                      .post("/checkout/update-order", paymentData)
                      .then(({ data: order }) => {
                        this.setState({ loading: false });
                        console.log(order);
                        this.props.navigation.navigate("ThankYouHotel", {
                          order: order.data,
                          isOrderPage: false
                        });
                      })
                      .catch(error => {
                        this.setState({ loading: false });
                      });
                  } else {
                    this.setState({ loading: false });
                    Toast.show("You have been cancelled the ticket", Toast.LONG);
                  }
                })

                .catch(error => {
                  // handle failure
                  this.setState({ loading: false });
                  alert(`Error:  ${error.description}`);
                });
            } else {
              this.setState({ loading: true });
              domainApi
                .get("/wallet/payment", { user_id: user.id, order_id: ord.id })
                .then(({ data }) => {
                  this.setState({ loading: false });
                  console.log(data);
                  if (data.result == "success") {
                    let paymentData = {
                      order_id: ord.id,
                      status: "completed",
                      transaction_id: "",
                      reference_no: "" // blockres.data.ReferenceNo
                    };
                    this.setState({ loading: true });
                    domainApi
                      .post("/checkout/update-order", paymentData)
                      .then(({ data: order }) => {
                        this.setState({ loading: false });
                        console.log(order);
                        const { params } = this.props.navigation.state.params;
                        this.props.navigation.navigate("ThankYouHotel", {
                          order: order.data,
                          isOrderPage: false
                        });
                      })
                      .catch(error => {
                        this.setState({ loading: false });
                      });
                  } else {
                    this.setState({ loading: false });
                    Toast.show("You have been cancelled the ticket", Toast.LONG);
                  }
                })
                .catch(error => {
                  this.setState({ loading: false });
                });
            }
          })
          .catch(error => {
            Toast.show(error, Toast.LONG);
            this.setState({ loading: false });
          });
      }
    }

    console.log(this.state);
    return;
  };

  _radioButton = (index, item) => {
    this.setState({
      isSelectPaymentMethod: index,
      payment_method: item.gateway_id
    });
    this.ApiCall(item);
  };
  ApiCall(item) {
    const { user } = this.props;
    let param = {
      user_id: user.id,
      chosen_payment_method: item.gateway_id
    };
    this.setState({ loading: true });
    domainApi
      .get("/cart", param)
      .then(({ data }) => {
        this.setState({ data: data, loading: false });
      })
      .catch(error => {
        this.setState({ loading: false });
      });
  }
  render() {
    const { params } = this.props.navigation.state.params;
    const { data, loading } = this.state;

    return (
      <>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        <SafeAreaView style={{ flex: 0, backgroundColor: "#000000" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <View style={{ flex: 1 }}>
            <View
              style={{
                height: 56,
                backgroundColor: "#E5EBF7",
                flexDirection: "row"
              }}>
              <Button
                style={{ padding: 10, paddingHorizontal: 16 }}
                onPress={() => this.props.navigation.goBack(null)}>
                <Icon name="md-arrow-back" size={24} />
              </Button>
              <View style={{ marginHorizontal: 10, justifyContent: "center" }}>
                <Text style={{ fontWeight: "700", fontSize: 16, lineHeight: 20 }}>Checkout</Text>
                <Text style={{ fontSize: 12, color: "#717984", lineHeight: 14 }}>
                  {params.adult > 0 ? " " + params.adult + " Adult" : " "}
                </Text>
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
                    marginTop: 20
                  }}>
                  <View style={{ marginHorizontal: 10, marginVertical: 10 }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Image
                        source={require("../assets/imgs/person.png")}
                        resizeMode="contain"
                        style={{ width: 20 }}
                      />
                      <Text style={{ marginStart: 10, fontSize: 18, fontWeight: "500" }}>
                        Guest Details
                      </Text>
                    </View>

                    {parseInt(params.No_of_person) &&
                      [...Array(parseInt(params.No_of_person))].map((e, index) => (
                        <View key={"adult_" + index}>
                          <View
                            style={{
                              flexDirection: "row",
                              marginTop: 10,
                              justifyContent: "center",
                              alignItems: "center"
                            }}>
                            <Text style={{ flexBasis: "20%" }}>Adult {index + 1}</Text>

                            <TextInput
                              style={{
                                borderWidth: 1,
                                borderColor: "#F2F2F2",
                                height: 40,
                                flex: 1,
                                paddingStart: 5
                              }}
                              onChangeText={this.onAdultChange(index, "firstname")}
                              placeholder="First Name"
                            />
                            <TextInput
                              style={{
                                borderWidth: 1,
                                borderColor: "#F2F2F2",
                                height: 40,
                                flex: 1,
                                marginStart: 5,
                                paddingStart: 5
                              }}
                              placeholder="Last Name"
                              onChangeText={this.onAdultChange(index, "last_name")}
                            />
                          </View>
                          <View
                            style={{
                              marginTop: 5,

                              flexDirection: "row",
                              justifyContent: "center",
                              alignItems: "center"
                            }}>
                            <Text style={{ flexBasis: "20%" }}>DOB</Text>
                            <Button
                              style={{
                                flex: 1,
                                borderWidth: 1,
                                borderColor: "#F2F2F2",
                                height: 40,
                                justifyContent: "center",
                                paddingStart: 5
                              }}
                              onPress={this.show("adults", index, true)}
                              placeholder="DOB">
                              <Text>
                                {moment(this.state.adults[index].dob).format("DD-MMM-YYYY")}
                              </Text>
                            </Button>
                            <DateTimePicker
                              date={this.state.adults[index].dob}
                              isVisible={this.state.adults[index].show}
                              onConfirm={this.onAdultChange(index, "dob")}
                              onCancel={this.show("adults", index, false)}
                              maximumDate={new Date(moment().subtract(18, "years"))}
                            />
                            <View
                              style={{
                                flex: 1,
                                borderWidth: 1,
                                borderColor: "#F2F2F2",
                                height: 40,
                                marginStart: 5,
                                justifyContent: "center"
                              }}>
                              <RNPickerSelect
                                useNativeAndroidPickerStyle={false}
                                placeholder={{}}
                                selectedValue={this.state.adults[index].gender}
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
                                onValueChange={this.onAdultChange(index, "gender")}
                                items={[
                                  { label: "Male", value: "M" },
                                  { label: "Female", value: "F" }
                                ]}
                                Icon={() => <Icon name="ios-arrow-down" size={20} />}
                              />
                            </View>
                          </View>
                        </View>
                      ))}
                  </View>
                </View>

                {data.payment_gateway &&
                  data.payment_gateway.map((item, index) => {
                    return (
                      <View
                        style={{
                          elevation: 2,
                          shadowOffset: { width: 0, height: 2 },
                          shadowColor: "rgba(0,0,0,0.1)",
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
                  <Text style={{ color: "#fff" }}>Book Now</Text>
                </Button>
              </ScrollView>
            </View>
            {loading && <ActivityIndicator />}
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(
  mapStateToProps,
  null
)(BlogPayment);
