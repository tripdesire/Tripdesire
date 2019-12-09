import React from "react";
import {
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Picker,
  ScrollView,
  SafeAreaView
} from "react-native";
import Toast from "react-native-simple-toast";
import DateTimePicker from "react-native-modal-datetime-picker";
import { Button, Text, ActivityIndicator, Icon } from "../../components";
import moment from "moment";
import RazorpayCheckout from "react-native-razorpay";
import axios from "axios";
import { connect } from "react-redux";
import { etravosApi, domainApi } from "../../service";

class Payment extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log(props.navigation.state.params);
    const { params } = props.navigation.state.params;
    this.state = {
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
      adults: [...Array(parseInt(params.adult))].map(item => {
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
      childs: [...Array(parseInt(params.child))].map(item => {
        return {
          den: parseInt(params.child) > 0 ? "Mr" : "",
          firstname: "",
          last_name: "",
          dob: moment()
            .subtract(2, "years")
            .toDate(),
          age: 12,
          gender: parseInt(params.child) > 0 ? "M" : "",
          show: false
        };
      }),
      radioDirect: true,
      orderId: "",
      transactionId: "",
      status: ""
    };
  }

  componentDidMount() {
    this.setState({ loading: false });
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
    if ((key = "dob")) {
      newData[index].age = moment().diff(moment(text), "years");
    }
    this.setState({
      adults: newData
    });
  };

  onChildsChange = (index, key) => text => {
    let newData = Object.assign([], this.state.childs);
    newData[index][key] = text;
    newData[index].show = false;
    if ((key = "dob")) {
      newData[index].age = moment().diff(moment(text), "years");
    }
    this.setState({
      childs: newData
    });
  };

  validate = () => {
    let needToValidateAdults = false;
    let needToValidateChilds = false;
    needToValidateAdults = this.state.adults.every(
      item => item.firstname == "" || item.last_name == "" || item.age == ""
    );
    needToValidateChilds =
      this.state.childs != 0 &&
      this.state.childs.every(
        item => item.firstname == "" || item.last_name == "" || item.age == ""
      );
    return needToValidateAdults || needToValidateChilds;
  };

  _order = () => {
    const { params } = this.props.navigation.state.params;

    let adult_details = this.state.adults.map(item => ({
      "ad-den": item.den,
      "ad-fname": item.firstname,
      "ad-lname": item.last_name,
      "ad-dob": item.dob,
      "ad-gender": item.gender,
      "ad-age": item.age
    }));

    let child_details = this.state.childs.map(item => ({
      "ch-den": item.den,
      "ch-fname": item.firstname,
      "ch-lname": item.last_name,
      "ch-dob": item.dob,
      "ch-gender": item.gender,
      "ch-age": item.age
    }));

    let param = {
      user_id: "7",
      payment_method: "razopay",
      adult_details: adult_details,
      child_details: child_details,
      infant_details: []
    };

    var adults = params.adultDetail.split("~");
    var childs = params.childDetail.split("~");
    console.log(adults, childs);
    let adultCount = 0;
    let childCount = 0;
    let finalArr = [],
      finalArrAge = [],
      finalArrDob = [],
      finalArrGender = [];
    for (let i = 0; i < adults.length; i++) {
      let arr = [];
      let age = [];
      let dob = [];
      let gender = [];
      for (let j = 1; j <= adults[i]; j++) {
        let item = this.state.adults[adultCount];
        arr.push(item.den + "|" + item.firstname + "|" + item.last_name + "|adt");
        age.push(item.age);
        dob.push(item.dob);
        gender.push(item.gender);
        adultCount++;
      }
      for (let j = 1; j <= childs[i]; j++) {
        let item = this.state.childs[childCount];
        arr.push(item.den + "|" + item.firstname + "|" + item.last_name + "|chd");
        age.push(item.age);
        dob.push(item.dob);
        gender.push(item.gender);
        childCount++;
      }
      if (arr.length > 0) {
        finalArr.push(arr.join("~"));
        finalArrAge.push(age.join("~"));
        finalArrDob.push(dob.join("~"));
        finalArrGender.push(gender.join("~"));
      }
    }

    let name = [
      ...this.state.adults.map(
        item => item.den + "|" + item.firstname + "|" + item.last_name + "|adt"
      ),
      ...this.state.childs.map(
        item => item.den + "|" + item.firstname + "|" + item.last_name + "|chd"
      )
    ].join("~");
    name = finalArr.join("-");

    let dob = [
      ...this.state.adults.map(item => moment(item.dob).format("DD-MM-YYYY")),
      ...this.state.childs.map(item => moment(item.dob).format("DD-MM-YYYY"))
    ].join("~");
    dob = finalArrDob.join("-");

    let gender = [
      ...this.state.adults.map(item => item.gender),
      ...this.state.childs.map(item => item.gender)
    ].join("~");
    gender = finalArrGender.join("-");

    let age = [
      ...this.state.adults.map(item => item.age),
      ...this.state.childs.map(item => item.age)
    ].join("~");
    age = finalArrAge.join("-");

    let data = {
      AdditionalInfo: null,
      Address: "",
      Adults: params.adultDetail,
      Ages: age, ///
      ArrivalDate: params.checkInDate,
      Children: params.childDetail,
      ChildrenAges: params.childAge,
      City: "",
      CityName: params.city,
      Country: "India",
      DepartureDate: params.checkOutDate,
      DestinationId: params.cityid,
      EmailId: "guru@gmail.com",
      Fare: null,
      Genders: gender,
      HotelDetail: params,
      HotelId: params.HotelId,
      HotelImages: params.HotelImages,
      HotelPolicy: params.HotelPolicy,
      HotelType: 1,
      IsOfflineBooking: false,
      MobileNo: "9999999999",
      Names: name,
      Nationality: params.CountryCode,
      NoOfdays: params.Night,
      PinCode: "",
      Provider: params.Provider,
      RoomDetails: [params.selectedRoom],
      Rooms: params.room,
      State: "",
      Status: 1,
      Titles: null,
      User: "",
      UserType: 5,
      WebsiteUrl: ""
    };
    console.log(this.state);

    if (this.validate()) {
      Toast.show("Please enter all the fields.", Toast.SHORT);
    } else {
      if (this.props.signIn == {}) {
        console.log(data);
        let totalData = data;
        this.setState({ loading: true });
        etravosApi
          .post("/Hotels/BlockHotelRoom", data)
          .then(blockres => {
            console.log(blockres.data);
            if (blockres.data.BookingStatus == 1) {
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
                      // handle success
                      //console.log(data);
                      this.setState({ loading: true });
                      etravosApi
                        .get("Hotels/BookHotelRoom?referenceNo=" + blockres.data.ReferenceNo)
                        .then(({ data: Response }) => {
                          this.setState({ loading: false });
                          console.log(Response);
                        })
                        .catch(error => {
                          console.log(error);
                        });
                      let paymentData = {
                        order_id: order.id,
                        status: "completed",
                        transaction_id: razorpayRes.razorpay_payment_id,
                        reference_no: Response // blockres.data.ReferenceNo
                      };
                      this.setState({ loading: true });
                      domainApi.post("/checkout/update-order", paymentData).then(res => {
                        this.setState({ loading: false });
                        console.log(res);
                      });
                      const { params } = this.props.navigation.state.params;
                      this.props.navigation.navigate("ThankYouHotel", {
                        order,
                        params,
                        razorpayRes
                      });
                    })
                    .catch(error => {
                      // handle failure
                      this.setState({ loading: false });
                      alert(`Error:  ${error.description}`);
                    });
                })
                .catch(error => {
                  Toast.show(error, Toast.LONG);
                  this.setState({ loading: false });
                });
            } else {
              this.setState({ loading: false });
              Toast.show("Hotel is not block successfully ", Toast.LONG);
            }
          })
          .catch(error => {
            Toast.show(error, Toast.LONG);
            this.setState({ loading: false });
          });
      } else {
        Toast.show("Please login or signup", Toast.LONG);
      }
    }

    console.log(this.state);
    return;
  };

  _radioButton = value => {
    this.setState({
      radioDirect: value == "D" ? true : false,
      radioCheck: value == "CP" ? true : false,
      radioCOD: value == "C" ? true : false
    });
  };
  render() {
    const { params } = this.props.navigation.state.params;
    const { ffn, radioDirect, radioCheck, radioCOD, DOB, mode, adults, loading } = this.state;

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
              <View style={{ marginHorizontal: 5 }}>
                <Text style={{ fontWeight: "700", fontSize: 16 }}>Checkout</Text>
                <Text style={{ fontSize: 12, color: "#717984" }}>
                  {params.checkInDate
                    ? moment(params.checkInDate, "DD-MM-YYYY").format("DD MMM")
                    : ""}
                  {params.checkOutDate
                    ? " - " + moment(params.checkOutDate, "DD-MM-YYYY").format("DD MMM") + " "
                    : ""}
                  |{params.adult > 0 ? " " + params.adult + " Adult" : " "}
                  {params.child > 0 ? " , " + params.child + " Child" : " "}
                  {params.infant > 0 ? " , " + params.infant + " Infant" : " "}
                  {params.className ? "| " + params.className : ""}
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
                    borderRadius: 8,
                    backgroundColor: "#ffffff",
                    marginHorizontal: 16,
                    marginTop: 20
                  }}>
                  <View style={{ marginHorizontal: 10, marginVertical: 10 }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Image
                        source={require("../../assets/imgs/person.png")}
                        resizeMode="contain"
                        style={{ width: 30 }}
                      />
                      <Text style={{ marginStart: 10, fontWeight: "300", fontSize: 16 }}>
                        Passengers Details
                      </Text>
                    </View>
                    {parseInt(params.adult) &&
                      [...Array(parseInt(params.adult))].map((e, index) => (
                        <View key={"adult_" + index}>
                          <View
                            style={{
                              flexDirection: "row",
                              marginTop: 10,
                              justifyContent: "center",
                              alignItems: "center"
                            }}>
                            <Text>Adult {index + 1}</Text>
                            <View
                              style={{
                                borderWidth: 1,
                                borderColor: "#F2F2F2",
                                height: 40,
                                marginStart: 2,
                                justifyContent: "center",
                                alignItems: "center"
                              }}>
                              <Picker
                                selectedValue={this.state.adults[index].den}
                                style={{ height: 50, width: 60 }}
                                onValueChange={this.onAdultChange(index, "den")}>
                                <Picker.Item label="Mr." value="Mr" />
                                <Picker.Item label="Mrs." value="Mrs" />
                              </Picker>
                            </View>
                            <TextInput
                              style={{
                                borderWidth: 1,
                                borderColor: "#F2F2F2",
                                height: 40,
                                flex: 1,
                                marginHorizontal: 2
                              }}
                              onChangeText={this.onAdultChange(index, "firstname")}
                              placeholder="First Name"
                            />
                            <TextInput
                              style={{
                                borderWidth: 1,
                                borderColor: "#F2F2F2",
                                height: 40,
                                flex: 1
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
                            <View
                              style={{
                                flex: 2,
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center"
                              }}>
                              <Text style={{ color: "#5D666D", marginStart: 5 }}>DOB</Text>
                              <Button
                                style={{
                                  flex: 1,
                                  marginStart: 5,
                                  borderWidth: 1,
                                  borderColor: "#F2F2F2",
                                  height: 40,
                                  justifyContent: "center",
                                  alignItems: "center"
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
                                maximumDate={moment()
                                  .subtract(18, "years")
                                  .toDate()}
                              />
                            </View>
                            <View
                              style={{
                                borderWidth: 1,
                                borderColor: "#F2F2F2",
                                height: 40,
                                flex: 1,
                                paddingHorizontal: 2,
                                marginHorizontal: 2,
                                justifyContent: "center",
                                alignItems: "center"
                              }}>
                              <Picker
                                selectedValue={this.state.adults[index].gender}
                                style={{ height: 50, width: 80 }}
                                onValueChange={this.onAdultChange(index, "gender")}>
                                <Picker.Item label="Male" value="M" />
                                <Picker.Item label="Female" value="F" />
                              </Picker>
                            </View>
                          </View>
                          <Button style={{ marginTop: 10 }} onPress={this._FFN}>
                            <Text style={{ color: "#5B89F9" }}>
                              Optional (Frequent flyer Number)
                            </Text>
                          </Button>
                          {ffn && (
                            <View>
                              <Text>Frequent Flyer Details</Text>
                              <Text>
                                Please verify the credit of your frequent flyer miles at the airport
                                checkin counter.
                              </Text>
                              <View style={{ flexDirection: "row" }}>
                                <TextInput
                                  style={{
                                    borderWidth: 1,
                                    borderColor: "#F2F2F2",
                                    backgroundColor: "#F2F2F2",
                                    height: 40,
                                    paddingHorizontal: 10,
                                    marginEnd: 1,
                                    flex: 1
                                  }}
                                  placeholder="Indigo-5031"
                                />
                                <TextInput
                                  style={{
                                    borderWidth: 1,
                                    borderColor: "#F2F2F2",
                                    height: 40,
                                    paddingHorizontal: 10,
                                    flex: 1,
                                    marginStart: 1
                                  }}
                                  placeholder="Enter FNN"
                                />
                              </View>
                            </View>
                          )}
                        </View>
                      ))}

                    {parseInt(params.child) > 0 &&
                      [...Array(parseInt(params.child))].map((e, index) => (
                        <View key={"child_" + index}>
                          <View
                            style={{
                              flexDirection: "row",
                              marginTop: 10,
                              justifyContent: "center",
                              alignItems: "center"
                            }}>
                            <Text>Child {index + 1}</Text>
                            <View
                              style={{
                                borderWidth: 1,
                                borderColor: "#F2F2F2",
                                height: 40,
                                marginStart: 2,
                                justifyContent: "center",
                                alignItems: "center"
                              }}>
                              <Picker
                                selectedValue={this.state.childs[index].den}
                                style={{ height: 50, width: 60 }}
                                onValueChange={this.onChildsChange(index, "den")}>
                                <Picker.Item label="Mr." value="Mr" />
                                <Picker.Item label="Mrs." value="Mrs" />
                              </Picker>
                            </View>
                            <TextInput
                              style={{
                                borderWidth: 1,
                                borderColor: "#F2F2F2",
                                height: 40,
                                flex: 1,
                                marginHorizontal: 2
                              }}
                              placeholder="First Name"
                              onChangeText={this.onChildsChange(index, "firstname")}
                            />
                            <TextInput
                              style={{
                                borderWidth: 1,
                                borderColor: "#F2F2F2",
                                height: 40,
                                flex: 1
                              }}
                              placeholder="Last Name"
                              onChangeText={this.onChildsChange(index, "last_name")}
                            />
                          </View>
                          <View
                            style={{
                              marginTop: 5,
                              flexDirection: "row",
                              justifyContent: "center",
                              alignItems: "center"
                            }}>
                            <View
                              style={{
                                flex: 2,
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center"
                              }}>
                              <Text style={{ color: "#5D666D", marginStart: 5 }}>DOB</Text>
                              <Button
                                style={{
                                  flex: 1,
                                  marginStart: 5,
                                  borderWidth: 1,
                                  borderColor: "#F2F2F2",
                                  height: 40,
                                  justifyContent: "center",
                                  alignItems: "center"
                                }}
                                onPress={this.show("childs", index, true)}
                                placeholder="DOB">
                                <Text>
                                  {moment(this.state.childs[index].dob).format("DD-MMM-YYYY")}
                                </Text>
                              </Button>
                              <DateTimePicker
                                date={this.state.childs[index].dob}
                                isVisible={this.state.childs[index].show}
                                onConfirm={this.onChildsChange(index, "dob")}
                                onCancel={this.show("childs", index, false)}
                                minimumDate={moment()
                                  .subtract(12, "years")
                                  .toDate()}
                                maximumDate={moment()
                                  .subtract(2, "years")
                                  .toDate()}
                              />
                            </View>
                            <View
                              style={{
                                borderWidth: 1,
                                borderColor: "#F2F2F2",
                                height: 40,
                                flex: 1,
                                paddingHorizontal: 2,
                                marginHorizontal: 2,
                                justifyContent: "center",
                                alignItems: "center"
                              }}>
                              <Picker
                                selectedValue={this.state.childs[index].gender}
                                style={{ height: 50, width: 80 }}
                                onValueChange={this.onChildsChange(index, "gender")}>
                                <Picker.Item label="Male" value="M" />
                                <Picker.Item label="Female" value="F" />
                              </Picker>
                            </View>
                            <TextInput
                              style={{
                                borderWidth: 1,
                                borderColor: "#F2F2F2",
                                height: 40,
                                flex: 1
                              }}
                              placeholder="Age"
                              keyboardType="numeric"
                              onChangeText={this.onChildsChange(index, "age")}
                            />
                          </View>
                        </View>
                      ))}
                  </View>
                </View>
                {/* <View
              style={{
                elevation: 2,
                backgroundColor: "#ffffff",
                marginHorizontal: 16,
                marginTop: 20,
                height: 240,
                borderRadius: 8
              }}>
              <View
                style={{
                  flexDirection: "row",
                  marginHorizontal: 10,
                  marginVertical: 5,
                  alignItems: "center"
                }}>
                <Icon name="bag" size={30} type="SimpleLineIcons"/>
                <Text style={{ fontSize: 18, fontWeight: "500", marginStart: 5 }}>
                  Contact Details
                </Text>
              </View>
              <Text style={{ marginHorizontal: 10 }}>Email Address*</Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#F2F2F2",
                  height: 30,
                  flex: 1,
                  marginHorizontal: 10
                }}
              />
              <Text style={{ marginHorizontal: 10 }}>Street Address*</Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#F2F2F2",
                  height: 30,
                  flex: 1,
                  marginHorizontal: 10
                }}
              />
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#F2F2F2",
                  height: 25,
                  marginTop: 10,
                  flex: 1,
                  marginBottom: 10,
                  marginHorizontal: 10
                }}
              />
            </View> */}

                <View
                  style={{
                    elevation: 2,
                    backgroundColor: "#ffffff",
                    marginHorizontal: 16,
                    marginTop: 20,
                    height: 190,
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
                    <Text style={{ marginStart: 5, fontSize: 18 }}>RazorPay</Text>
                  </View>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 12,
                      color: "#696969",
                      marginHorizontal: 20
                    }}>
                    Accept Cards, Netbanking, Wallets & UPI. Developer Friendly API, Fast
                    Onboarding. Free & Easy Application Process.100+ Payment Modes, Secure Gateway,
                    Simple Integration. Easy Integration. Dashboard Reporting. etravosApis:
                    Customize Your Checkout, Autofill OTP on Mobile.
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
                  onPress={this._order}>
                  <Text style={{ color: "#fff" }}>Place Order</Text>
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
  signIn: state.signIn
});

export default connect(mapStateToProps, null)(Payment);
