import React from "react";
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  StatusBar
} from "react-native";
import { Button, Text, ActivityIndicator } from "../../components";
import Icon from "react-native-vector-icons/Ionicons";
import moment from "moment";
import Toast from "react-native-simple-toast";
import RazorpayCheckout from "react-native-razorpay";
import axios from "axios";
import { isEmpty } from "lodash";
import { connect } from "react-redux";
import RNPickerSelect from "react-native-picker-select";
import { etravosApi, domainApi } from "../../service";
import analytics from "@react-native-firebase/analytics";

import HTML from "react-native-render-html";

class BusPayment extends React.PureComponent {
  constructor(props) {
    super(props);
    const { selectedSheets, cartData } = this.props.navigation.state.params;
    console.log(this.props.navigation.state.params);
    this.state = {
      cartData: cartData,
      loader: false,
      gender: "Mr",
      ffn: false,
      radioDirect: true,
      radioCheck: false,
      radioCOD: false,
      orderId: "",
      transaction_id: "",
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
      BlockingReferenceNo: "",
      BookingReferenceNo: "",
      isSelectPaymentMethod: 0,
      payment_method: cartData.payment_gateway[0].gateway_id
    };
    this.ApiCall(cartData.payment_gateway[0]);
  }

  trackScreenView = async screen => {
    // Set & override the MainActivity screen name
    await analytics().setCurrentScreen(screen, screen);
  };
  componentDidMount() {
    this.trackScreenView("Bus Payment");
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

  _FFN = () => {
    this.setState({ ffn: true });
  };

  validate = () => {
    let needToValidateAdults = false;
    const { adults } = this.state;
    needToValidateAdults = adults.every(
      item => item.den == "" || item.name == "" || item.age == ""
    );
    return needToValidateAdults;
  };

  _OrderApiCall = (block, blockRound) => {
    const { user } = this.props;

    const { TripType } = this.props.navigation.state.params;

    let adult_details = this.state.adults.map(item => ({
      "ad-den": item.den,
      "ad-fname": item.name,
      "ad-gender": item.gender,
      "ad-age": item.age
    }));

    let param = {
      // user_id: user.id,
      // payment_method: this.state.payment_method,
      adult_details: adult_details,
      child_details: [],
      infant_details: []
    };

    this.setState({ loader: true });
    domainApi
      .post(
        "/checkout/new-order?user_id=" + user.id + "&payment_method=" + this.state.payment_method,
        param
      )
      .then(({ data: ord }) => {
        console.log(ord);
        this.setState({ loader: false });
        if (this.state.payment_method == "razorpay") {
          var options = {
            description: "Credits towards consultation",
            // image: "https://i.imgur.com/3g7nmJC.png",
            currency: "INR",
            //key: "rzp_test_I66kFrN53lhauw",
            key: "rzp_live_IRhvqgmESx60tW",
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
              if (TripType == 1) {
                this.setState({ loader: true });
                etravosApi
                  .get("Buses/BookBusTicket?referenceNo=" + block.BookingReferenceNo)
                  .then(({ data: Response }) => {
                    this.setState({ loader: false });
                    console.log(Response);
                    if (Response.BookingStatus == 3) {
                      Toast.show(Response.Message, Toast.LONG);
                      let paymentData = {
                        order_id: ord.id,
                        status: "completed",
                        transaction_id: razorpayRes.razorpay_payment_id,
                        reference_no: Response
                      };
                      console.log(paymentData);

                      this.setState({ loader: true });
                      domainApi
                        .post("/checkout/update-order", paymentData)
                        .then(({ data: order }) => {
                          this.setState({ loader: false });
                          console.log(order);
                          this.props.navigation.navigate("BusThankYou", {
                            isOrderPage: false,
                            order: order.data,
                            razorpayRes,
                            Response,
                            ...this.props.navigation.state.params
                          });
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
                this.setState({ loader: true });
                axios
                  .all([
                    etravosApi.get("Buses/BookBusTicket?referenceNo=" + block.BookingReferenceNo),
                    etravosApi.get(
                      "Buses/BookBusTicket?referenceNo=" + blockRound.BookingReferenceNo
                    )
                  ])
                  .then(
                    axios.spread(({ data: BookingOneway }, { data: BookingRound }) => {
                      // Both requests are now complete
                      this.setState({ loader: false });
                      console.log(BookingOneway, "BooKiNgOneway", BookingRound, "BooKiNgRound");

                      if (BookingOneway.BookingStatus == 3) {
                        if (BookingRound.BookingStatus == 3) {
                          Toast.show(BookingOneway.Message, Toast.LONG);
                          let paymentData = {
                            order_id: ord.id,
                            status: "completed",
                            transaction_id: razorpayRes.razorpay_payment_id,
                            reference_no: BookingOneway,
                            return_reference_no: BookingRound
                          };
                          console.log(paymentData);

                          this.setState({ loader: true });
                          domainApi
                            .post("/checkout/update-order", paymentData)
                            .then(({ data: order }) => {
                              this.setState({ loader: false });
                              console.log(order);
                              this.props.navigation.navigate("BusThankYou", {
                                isOrderPage: false,
                                ...this.props.navigation.state.params,
                                razorpayRes,
                                BookingOneway,
                                BookingRound,
                                order: order.data
                              });
                            });
                        } else {
                          Toast.show("Your ticket is not booked successfully.", Toast.LONG);
                        }
                      } else {
                        Toast.show("Your ticket is not booked successfully.", Toast.LONG);
                      }
                    })
                  )
                  .catch(eroor => {
                    this.setState({ loader: false });
                  });
              }
            })
            .catch(error => {
              this.setState({ loader: false });
              console.log(error);
            });
        } else {
          this.setState({ loader: true });
          domainApi
            .get("/wallet/payment", { user_id: user.id, order_id: ord.id })
            .then(({ data }) => {
              this.setState({ loader: false });
              console.log(data);
              if (data.result == "success") {
                ////

                if (TripType == 1) {
                  this.setState({ loader: true });
                  etravosApi
                    .get("Buses/BookBusTicket?referenceNo=" + block.BookingReferenceNo)
                    .then(({ data: Response }) => {
                      this.setState({ loader: false });
                      console.log(Response);
                      if (Response.BookingStatus == 3) {
                        Toast.show(Response.Message, Toast.LONG);
                        let paymentData = {
                          order_id: ord.id,
                          status: "completed",
                          transaction_id: "",
                          reference_no: Response
                        };
                        console.log(paymentData);

                        this.setState({ loader: true });
                        domainApi
                          .post("/checkout/update-order", paymentData)
                          .then(({ data: order }) => {
                            this.setState({ loader: false });
                            console.log(order);
                            this.props.navigation.navigate("BusThankYou", {
                              isOrderPage: false,
                              order: order.data,
                              Response,
                              ...this.props.navigation.state.params
                            });
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
                  this.setState({ loader: true });
                  axios
                    .all([
                      etravosApi.get("Buses/BookBusTicket?referenceNo=" + block.BookingReferenceNo),
                      etravosApi.get(
                        "Buses/BookBusTicket?referenceNo=" + blockRound.BookingReferenceNo
                      )
                    ])
                    .then(
                      axios.spread(({ data: BookingOneway }, { data: BookingRound }) => {
                        // Both requests are now complete
                        this.setState({ loader: false });
                        console.log(BookingOneway, "BooKiNgOneway", BookingRound, "BooKiNgRound");

                        if (BookingOneway.BookingStatus == 3) {
                          if (BookingRound.BookingStatus == 3) {
                            Toast.show(BookingOneway.Message, Toast.LONG);
                            let paymentData = {
                              order_id: ord.id,
                              status: "completed",
                              transaction_id: "",
                              reference_no: BookingOneway,
                              return_reference_no: BookingRound
                            };
                            console.log(paymentData);

                            this.setState({ loader: true });
                            domainApi
                              .post("/checkout/update-order", paymentData)
                              .then(({ data: order }) => {
                                this.setState({ loader: false });
                                console.log(order);
                                this.props.navigation.navigate("BusThankYou", {
                                  isOrderPage: false,
                                  ...this.props.navigation.state.params,
                                  BookingOneway,
                                  BookingRound,
                                  order: order.data
                                });
                              });
                          } else {
                            Toast.show("Your ticket is not booked successfully.", Toast.LONG);
                          }
                        } else {
                          Toast.show("Your ticket is not booked successfully.", Toast.LONG);
                        }
                      })
                    )
                    .catch(eroor => {
                      this.setState({ loader: false });
                    });
                }

                ////
              } else {
                this.setState({ loader: false });
              }
            })
            .catch(error => {
              this.setState({ loader: false });
            });
        }
      })
      .catch(error => {
        this.setState({ loader: false });
      });
  };

  _PlaceOrder = () => {
    const { IdCardType, IdNumber, IssuedBy, adults } = this.state;

    const { user } = this.props;

    const {
      params,
      paramsRound,
      BoardingPoint,
      BoardingPointReturn,
      DroppingPoint,
      DroppingPointReturn,
      destinationName,
      selectedSheets,
      selectedSheetsRound,
      sourceName,
      journeyDate,
      returnDate,
      TripType
    } = this.props.navigation.state.params;

    let name = [...this.state.adults.map(item => item.name)].join("~");

    let age = [...this.state.adults.map(item => item.age)].join("~");

    let gender = [...this.state.adults.map(item => item.gender)].join("~");

    let den = [...this.state.adults.map(item => item.den)].join("~");

    let SeatNos = [...selectedSheets.map(item => item.Number)].join("~");

    let Fares = [...selectedSheets.map(item => item.Fare)].join("~");

    let ServiceCharge = [...selectedSheets.map(item => item.OperatorServiceCharge)].join("~");

    let ServiceTax = [...selectedSheets.map(item => item.Servicetax)].join("~");

    let SeatNosRound =
      TripType == 2 ? [...selectedSheetsRound.map(item => item.Number)].join("~") : "";

    let FaresRound = TripType == 2 ? [...selectedSheetsRound.map(item => item.Fare)].join("~") : "";

    let ServiceChargeRound =
      TripType == 2
        ? [...selectedSheetsRound.map(item => item.OperatorServiceCharge)].join("~")
        : "";

    let ServiceTaxRound =
      TripType == 2 ? [...selectedSheetsRound.map(item => item.Servicetax)].join("~") : "";

    console.log(name, age, gender, den, Fares, SeatNos);

    let paramOneway = {
      Address: user.billing.address_1,
      Ages: age,
      BoardingId: BoardingPoint.PointId,
      BoardingPointDetails: BoardingPoint.Location + "" + BoardingPoint.Landmark,
      BusTypeName: params.BusType,
      CancellationPolicy: params.CancellationPolicy,
      City: user.billing.city,
      ConvenienceFee: params.ConvenienceFee,
      DepartureTime: params.DepartureTime,
      DestinationId: params.DestinationId,
      DestinationName: destinationName,
      DisplayName: params.DisplayName,
      DroppingId: DroppingPoint.PointId,
      DroppingPointDetails: DroppingPoint.Location + "" + DroppingPoint.Landmark,
      EmailId: user.billing.email || user.email,
      EmergencyMobileNo: null,
      Fares: Fares,
      Genders: gender,
      IdCardNo: IdNumber,
      IdCardType: IdCardType,
      IdCardIssuedBy: IssuedBy,
      JourneyDate: journeyDate,
      MobileNo: user.billing.phone,
      Names: name,
      NoofSeats: selectedSheets.length,
      Operator: params.Travels,
      PartialCancellationAllowed: params.PartialCancellationAllowed,
      PostalCode: user.billing.postcode,
      Provider: params.Provider,
      ReturnDate: null,
      State: user.billing.state,
      Seatcodes: null,
      SeatNos: SeatNos,
      Servicetax: ServiceTax,
      ServiceCharge: ServiceCharge,
      SourceId: params.SourceId,
      SourceName: sourceName,
      Titles: den,
      TripId: params.Id,
      TripType: 1,
      UserType: 5
    };

    if (TripType == 2) {
      var paramRound = {
        Address: user.billing.address_1,
        Ages: age,
        BoardingId: BoardingPointReturn.PointId,
        BoardingPointDetails: BoardingPointReturn.Location + "" + BoardingPointReturn.Landmark,
        BusTypeName: paramsRound.BusType,
        CancellationPolicy: paramsRound.CancellationPolicy,
        City: user.billing.city != "" ? user.billing.city : "",
        ConvenienceFee: paramsRound.ConvenienceFee,
        DepartureTime: paramsRound.DepartureTime,
        DestinationId: paramsRound.DestinationId,
        DestinationName: sourceName,
        DisplayName: paramsRound.DisplayName,
        DroppingId: DroppingPointReturn.PointId,
        DroppingPointDetails: DroppingPointReturn.Location + "" + DroppingPointReturn.Landmark,
        EmailId: user.billing.email || user.email,
        EmergencyMobileNo: null,
        Fares: FaresRound,
        Genders: gender,
        IdCardNo: IdNumber,
        IdCardType: IdCardType,
        IdCardIssuedBy: IssuedBy,
        JourneyDate: returnDate,
        MobileNo: user.billing.phone,
        Names: name,
        NoofSeats: selectedSheetsRound.length,
        Operator: paramsRound.Travels, //////not showing
        PartialCancellationAllowed: paramsRound.PartialCancellationAllowed,
        PostalCode: user.billing.postcode, /////
        Provider: paramsRound.Provider,
        ReturnDate: null,
        State: user.billing.state,
        Seatcodes: null,
        SeatNos: SeatNosRound,
        Servicetax: ServiceTaxRound,
        ServiceCharge: ServiceChargeRound,
        SourceId: paramsRound.SourceId,
        SourceName: destinationName,
        Titles: den,
        TripId: paramsRound.Id,
        TripType: 1,
        UserType: 5
      };
      console.log(paramRound);
      //console.log(JSON.stringify(paramRound));
    }
    console.log(paramOneway);
    console.log(JSON.stringify(paramOneway));
    // return;

    // if (this.state.IdNumber && this.state.IssuedBy && !this.validate()) {
    //   var adharcard = /^\d{12}$/;
    //   if (this.state.IdCardType == "ADHAR_CARD" && !this.state.IdNumber.match(adharcard)) {
    //     Toast.show("Please enter the valid Adhar Card Number", Toast.LONG);
    //   } else {

    //     else {
    //       Toast.show("Please fill all the Details", Toast.LONG);
    //     }

    if (this.validate()) {
      Toast.show("Please enter all the fields.", Toast.SHORT);
    } else {
      if (isEmpty(this.props.user)) {
        //Toast.show("Please login or signup", Toast.LONG);
        this.props.navigation.navigate("SignIn", { isCheckout: true });
      } else {
        ////////Block/////////

        if (TripType == 1) {
          this.setState({ loader: true });
          etravosApi
            .post("/Buses/BlockBusTicket", paramOneway)
            .then(({ data }) => {
              console.log(data);
              this.setState({ loader: false });
              if (data.BookingStatus == 1) {
                this._OrderApiCall(data);
              } else {
                Toast.show(data.Message, Toast.LONG);
              }
            })
            .catch(error => {});
        } else if (TripType == 2) {
          this.setState({ loader: true });
          etravosApi.post("/Buses/BlockBusTicket", paramOneway).then(({ data }) => {
            console.log(data);
            this.setState({ loader: false });

            etravosApi
              .post("/Buses/BlockBusTicket", paramRound)
              .then(({ data: BlockRound }) => {
                console.log(BlockRound);
                if (data.BookingStatus == 1 && BlockRound.BookingStatus == 1) {
                  this._OrderApiCall(data, BlockRound);
                } else {
                  Toast.show(data.Message, Toast.LONG);
                  this.setState({ loader: false });
                }
              })
              .catch(error => {
                Toast.show(data.Message, Toast.LONG);
                this.setState({ loader: false });
              });
          });
        }
      }
    }
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
    this.setState({ loader: true });
    domainApi
      .get("/cart", param)
      .then(({ data }) => {
        this.setState({ cartData: data, loader: false });
      })
      .catch(error => {
        this.setState({ loader: false });
      });
  }
  render() {
    const { cartData } = this.state;

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

    return (
      <>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        <SafeAreaView style={{ flex: 0, backgroundColor: "#000000" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <View style={{ flexDirection: "column", flex: 1 }}>
            <View style={{ flexDirection: "row", height: 56, backgroundColor: "#E5EBF7" }}>
              <Button
                style={{ padding: 10, paddingHorizontal: 16 }}
                onPress={() => this.props.navigation.goBack(null)}>
                <Icon name="md-arrow-back" size={24} />
              </Button>
              <View style={{ justifyContent: "center", marginHorizontal: 10 }}>
                <Text style={{ fontWeight: "700", fontSize: 16, lineHeight: 22 }}>Payment</Text>
                <Text style={{ fontSize: 12, color: "#717984", lineHeight: 14 }}>
                  {moment(params.Journeydate, "YYYY-MM-DD").format("DD MMM")} |{" "}
                  {moment(params.Journeydate, "YYYY-MM-DD").format("dddd")}
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
                    backgroundColor: "#ffffff",
                    marginHorizontal: 16,
                    marginTop: 16,
                    paddingVertical: 20,
                    borderRadius: 8
                  }}>
                  <View
                    style={{
                      flexDirection: "row",
                      marginHorizontal: 10,
                      alignItems: "center"
                    }}>
                    <Image
                      source={require("../../assets/imgs/person.png")}
                      style={{ width: 20, height: 20 }}
                      resizeMode="cover"
                    />
                    <Text style={{ fontSize: 18, fontWeight: "500", marginStart: 5 }}>
                      Passengers Details
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      marginTop: 10,
                      marginHorizontal: 10,
                      justifyContent: "center",
                      alignItems: "center"
                    }}>
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: "#F2F2F2",
                        height: 40,
                        flex: 1,
                        marginStart: 2,
                        paddingHorizontal: 5,
                        justifyContent: "center"
                        //alignItems: "center"
                      }}>
                      <RNPickerSelect
                        useNativeAndroidPickerStyle={false}
                        placeholder={{}}
                        value={this.state.IdCardType}
                        style={{
                          inputAndroidContainer: { height: 35 },
                          inputAndroid: { paddingStart: 0, color: "#000" },
                          inputIOS: { color: "#000" },
                          iconContainer: { justifyContent: "center", top: 0, bottom: 0 }
                        }}
                        onValueChange={(itemValue, index) =>
                          this.setState({ IdCardType: itemValue })
                        }
                        items={[
                          { value: "ADHAR_CARD", label: "Adhar Card" },
                          { value: "PAN_CARD", label: "Pan Card" },
                          { value: "DRIVING_LICENSE", label: "Driving License" },
                          { value: "PASSPORT", label: "Passport" },
                          { value: "RATION_CARD", label: "Ration Card" },
                          { value: "VOTER_CARD", label: "Voter Card" }
                        ]}
                        Icon={() => <Icon name="ios-arrow-down" size={20} />}
                      />
                    </View>
                    <TextInput
                      style={{
                        borderWidth: 1,
                        borderColor: "#F2F2F2",
                        height: 40,
                        flex: 1,
                        paddingStart: 5,
                        marginStart: 5
                      }}
                      keyboardType="numeric"
                      onChangeText={this._changeAdult("IdNumber")}
                      placeholder="Enter Number"
                    />
                  </View>
                  <TextInput
                    style={{
                      borderWidth: 1,
                      borderColor: "#F2F2F2",
                      height: 40,
                      flex: 1,
                      marginTop: 5,
                      paddingStart: 5,
                      marginStart: 12,
                      marginEnd: 10
                    }}
                    onChangeText={this._changeAdult("IssuedBy")}
                    placeholder="Identification Document Issued By"
                  />
                  {selectedSheets &&
                    selectedSheets.map((item, index) => {
                      return (
                        <View key={"sap" + index}>
                          <View
                            style={{
                              flexDirection: "row",
                              marginTop: 5,
                              marginHorizontal: 10,
                              justifyContent: "center",
                              alignItems: "center"
                            }}>
                            <Text style={{ color: "#5B6974" }}>Seat No.</Text>

                            <Text style={{ marginHorizontal: 5 }}>{item.Number}</Text>
                            <TextInput
                              style={{
                                borderWidth: 1,
                                borderColor: "#F2F2F2",
                                height: 40,
                                flex: 1,
                                paddingStart: 5,
                                marginStart: 2
                              }}
                              onChangeText={this._changeAdults(index, "name")}
                              placeholder="Passenger Name"
                            />
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              marginTop: 5,
                              marginHorizontal: 10,
                              justifyContent: "center",
                              alignItems: "center"
                            }}>
                            <View
                              style={{
                                borderWidth: 1,
                                borderColor: "#F2F2F2",
                                height: 40,
                                flex: 1,
                                marginStart: 2,
                                paddingHorizontal: 5,
                                justifyContent: "center"
                                //alignItems: "center"
                              }}>
                              <RNPickerSelect
                                useNativeAndroidPickerStyle={false}
                                placeholder={{}}
                                value={this.state.adults[index].gender}
                                style={{
                                  inputAndroidContainer: { height: 35 },
                                  inputAndroid: { paddingStart: 0, color: "#000" },
                                  inputIOS: { color: "#000" },
                                  iconContainer: { justifyContent: "center", top: 0, bottom: 0 }
                                }}
                                onValueChange={this._changeAdults(index, "gender")}
                                items={[
                                  { value: "M", label: "Male" },
                                  { value: "F", label: "Female" }
                                ]}
                                Icon={() => <Icon name="ios-arrow-down" size={20} />}
                              />
                            </View>
                            <TextInput
                              style={{
                                borderWidth: 1,
                                borderColor: "#F2F2F2",
                                height: 40,
                                flex: 1,
                                paddingStart: 5,
                                marginStart: 5
                              }}
                              keyboardType="numeric"
                              placeholder="age"
                              onChangeText={this._changeAdults(index, "age")}
                            />
                          </View>
                        </View>
                      );
                    })}
                </View>

                {cartData.payment_gateway &&
                  cartData.payment_gateway.map((item, index) => {
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
                          marginTop: 16,
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
                  onPress={this._PlaceOrder}>
                  <Text style={{ color: "#fff" }}>Book Now</Text>
                </Button>
              </ScrollView>
            </View>
            {this.state.loader && <ActivityIndicator />}
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(BusPayment);
