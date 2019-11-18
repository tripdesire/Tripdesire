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
import Toast from "react-native-simple-toast";
import DateTimePicker from "react-native-modal-datetime-picker";
import { Button, Text, Activity_Indicator, Icon } from "../../components";
import moment from "moment";
import RazorpayCheckout from "react-native-razorpay";
import axios from "axios";
import Service from "../../service";
class Payment extends React.PureComponent {
  constructor(props) {
    super(props);
    const { params } = props.navigation.state;
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
            .subtract(12, "years")
            .toDate(),
          age: "",
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
          age: "",
          gender: parseInt(params.child) > 0 ? "M" : "",
          show: false
        };
      }),
      infants: [...Array(parseInt(params.infant))].map(item => {
        return {
          den: parseInt(params.infant) > 0 ? "Mr" : "",
          firstname: "",
          last_name: "",
          dob: new Date(),
          age: "",
          gender: parseInt(params.infant) > 0 ? "M" : "",
          show: false
        };
      }),
      radioDirect: true,
      orderId: "",
      transactionId: "",
      status: ""
    };
    console.log(props.navigation.state.params);
  }

  show = (key, index, isShow) => () => {
    let newData = Object.assign([], this.state[key]);
    newData[index].show = isShow;
    this.setState({
      adults: newData
    });
  };

  // showChild = (mode, index, isShow) => () => {
  //   let newData = Object.assign([], this.state.childs);
  //   newData[index].show = isShow;
  //   this.setState({
  //     childs: newData
  //   });
  // };

  // showInfant = (mode, index, isShow) => () => {
  //   let newData = Object.assign([], this.state.infants);
  //   newData[index].show = isShow;
  //   this.setState({
  //     infants: newData
  //   });
  // };

  _FFN = () => {
    this.setState({ ffn: this.state.ffn == true ? false : true });
  };

  onAdultChange = (index, key) => text => {
    let newData = Object.assign([], this.state.adults);
    newData[index][key] = text;
    newData[index].show = false;
    this.setState({
      adults: newData
    });
  };

  onChildsChange = (index, key) => text => {
    let newData = Object.assign([], this.state.childs);
    newData[index][key] = text;
    newData[index].show = false;
    this.setState({
      childs: newData
    });
  };

  onInfantChange = (index, key) => text => {
    let newData = Object.assign([], this.state.infants);
    newData[index][key] = text;
    newData[index].show = false;
    this.setState({
      infants: newData
    });
  };

  validate = () => {
    let needToValidateAdults = false;
    let needToValidateChilds = false;
    let needToValidateInfants = false;
    needToValidateAdults = this.state.adults.every(
      item => item.firstname == "" || item.last_name == "" || item.age == ""
    );
    needToValidateChilds =
      this.state.childs != 0 &&
      this.state.childs.every(
        item => item.firstname == "" || item.last_name == "" || item.age == ""
      );
    needToValidateInfants =
      this.state.infants != 0 &&
      this.state.infants.every(
        item => item.firstname == "" || item.last_name == "" || item.age == ""
      );

    return needToValidateAdults || needToValidateChilds || needToValidateInfants;
  };

  _order = () => {
    const { params } = this.props.navigation.state;

    let journey_date = moment(params.journey_date, "DD MMM").format("DD-MM-YYYY");

    let param = {
      user_id: "7",
      payment_method: "razopay",
      adult_details: this.state.adults,
      child_details: this.state.childs,
      infant_details: this.state.infants
    };

    let dataa = [];
    let arrayCount = [];
    dataa = params.adultDetail;
    for (let i = 0; i < dataa.length; i++) {
      if (dataa[i] == "~") {
        continue;
      } else {
        arrayCount.push(dataa[i]);
      }
    }
    console.log(arrayCount);

    let name = [
      ...this.state.adults.map(
        item => item.den + "|" + item.firstname + "|" + item.last_name + "|adt"
      ),
      ...this.state.childs.map(
        item => item.den + "|" + item.firstname + "|" + item.last_name + "|chd"
      )
    ].join("~");

    let dob = [
      ...this.state.adults.map(item => moment(item.dob).format("DD-MM-YYYY")),
      ...this.state.childs.map(item => moment(item.dob).format("DD-MM-YYYY")),
      ...this.state.infants.map(item => moment(item.dob).format("DD-MM-YYYY"))
    ].join("~");

    let gender = [
      ...this.state.adults.map(item => item.gender),
      ...this.state.childs.map(item => item.gender),
      ...this.state.infants.map(item => item.gender)
    ].join("~");

    let age = [
      ...this.state.adults.map(item => item.age),
      ...this.state.childs.map(item => item.age),
      ...this.state.infants.map(item => item.age)
    ].join("~");

    console.log(name);

    let data = {
      AdditionalInfo: null,
      Address: "",
      Adults: params.adultDetail,
      Ages: "", ///
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
      Genders: "",
      HotelDetail: params.RoomDetails,
      HotelId: params.HotelId,
      HotelImages: params.HotelImages,
      HotelPolicy: params.HotelPolicy,
      HotelType: 1,
      IsOfflineBooking: false,
      MobileNo: "9999999999",
      Names: "",
      Nationality: params.CountryCode,
      NoOfdays: params.Night,
      PinCode: "",
      Provider: params.Provider,
      RoomDetails: params.selectedRoom,
      Rooms: params.room,
      State: "",
      Status: 1,
      Titles: null,
      User: "",
      UserType: 5,
      WebsiteUrl: ""
    };

    if (this.validate()) {
      Toast.show("Please enter all the fields.", Toast.SHORT);
    } else {
      console.log(data);
      let totalData = data;

      this.setState({ loading: true });
      Service.post("/Hotels/BlockHotelRoom", data)
        .then(blockres => {
          console.log(blockres.data);
          if (blockres.data.BookingStatus == 8) {
            axios
              .post("http://tripdesire.co/wp-json/wc/v2/checkout/new-order?user_id=7")
              .then(res => {
                console.log(res);
                this.setState({
                  transactionId: res.data.transaction_id,
                  status: res.data.status,
                  loading: false
                });

                var options = {
                  description: "Credits towards consultation",
                  image: "https://i.imgur.com/3g7nmJC.png",
                  currency: "INR",
                  key: "rzp_test_a3aQYPLYowGvWJ",
                  amount: "5000",
                  name: "TripDesire",
                  prefill: {
                    email: "void@razorpay.com",
                    contact: "9191919191",
                    name: "Razorpay Software"
                  },
                  theme: { color: "#E5EBF7" }
                };

                RazorpayCheckout.open(options)
                  .then(data => {
                    // handle success
                    console.log(data);
                    alert(`Success: ${data.razorpay_payment_id}`);
                    this.setState({ orderId: data.razorpay_payment_id });
                    this.props.navigation.navigate("ThankYou", {
                      cartRes: res,
                      blockRes: blockres,
                      data: totalData
                    });
                    let paymentData = {
                      order_id: res.data.id,
                      status: "completed",
                      transaction_id: res.data.transaction_id,
                      reference_no: blockres.data.ReferenceNo
                    };
                    console.log(paymentData);
                    axios
                      .post("http://tripdesire.co/wp-json/wc/v2/checkout/update-order", paymentData)
                      .then(res => {
                        console.log(res);
                      });
                  })
                  .catch(error => {
                    // handle failure

                    alert(`Error: ${error.code} | ${error.description}`);
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
    }

    console.log(param);
    console.log(this.state);
  };

  _radioButton = value => {
    this.setState({
      radioDirect: value == "D" ? true : false,
      radioCheck: value == "CP" ? true : false,
      radioCOD: value == "C" ? true : false
    });
  };
  render() {
    const { params } = this.props.navigation.state;
    const { ffn, radioDirect, radioCheck, radioCOD, DOB, mode, adults } = this.state;

    return (
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
              {params.journey_date} {params.return_date ? " - " + params.return_date : ""}
              {params.checkInDate ? moment(params.checkInDate, "DD-MM-YYYY").format("DD MMM") : ""}
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
                            <Text style={{ flex: 1 }}>
                              {moment(this.state.adults[index].dob).format("DD-MMM-YYYY")}
                            </Text>
                          </Button>
                          <DateTimePicker
                            date={this.state.adults[index].dob}
                            isVisible={this.state.adults[index].show}
                            onConfirm={this.onAdultChange(index, "dob")}
                            onCancel={this.show("adults", index, false)}
                            maximumDate={moment()
                              .subtract(12, "years")
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
                        <TextInput
                          style={{
                            borderWidth: 1,
                            borderColor: "#F2F2F2",
                            height: 40,
                            flex: 1
                          }}
                          placeholder="Age"
                          keyboardType="numeric"
                          onChangeText={this.onAdultChange(index, "age")}
                        />
                      </View>
                      <Button style={{ marginTop: 10 }} onPress={this._FFN}>
                        <Text style={{ color: "#5B89F9" }}>Optional (Frequent flyer Number)</Text>
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
                            <Text style={{ flex: 1 }}>
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

                {parseInt(params.infant) > 0 &&
                  [...Array(parseInt(params.infant))].map((e, index) => (
                    <View key={"_infant" + index}>
                      <View
                        style={{
                          flexDirection: "row",
                          marginTop: 10,
                          justifyContent: "center",
                          alignItems: "center"
                        }}>
                        <Text>Infant {index + 1}</Text>
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
                            selectedValue={this.state.infants[index].den}
                            style={{ height: 50, width: 60 }}
                            onValueChange={this.onInfantChange(index, "den")}>
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
                          onChangeText={this.onInfantChange(index, "firstname")}
                        />
                        <TextInput
                          style={{
                            borderWidth: 1,
                            borderColor: "#F2F2F2",
                            height: 40,
                            flex: 1
                          }}
                          placeholder="Last Name"
                          onChangeText={this.onInfantChange(index, "last_name")}
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
                            onPress={this.show("infants", index, true)}
                            placeholder="DOB">
                            <Text style={{ flex: 1 }}>
                              {moment(this.state.infants[index].dob).format("DD-MMM-YYYY")}
                            </Text>
                          </Button>
                          <DateTimePicker
                            date={this.state.infants[index].dob}
                            isVisible={this.state.infants[index].show}
                            onConfirm={this.onInfantChange(index, "dob")}
                            onCancel={this.show("infants", index, false)}
                            maximumDate={new Date()}
                            minimumDate={moment()
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
                            selectedValue={this.state.infants[index].gender}
                            style={{ height: 50, width: 80 }}
                            onValueChange={this.onInfantChange(index, "gender")}>
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
                          onChangeText={this.onInfantChange(index, "age")}
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
                Accept Cards, Netbanking, Wallets & UPI. Developer Friendly API, Fast Onboarding.
                Free & Easy Application Process.100+ Payment Modes, Secure Gateway, Simple
                Integration. Easy Integration. Dashboard Reporting. Services: Customize Your
                Checkout, Autofill OTP on Mobile.
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
        {this.state.loading && <Activity_Indicator />}
      </View>
    );
  }
}

export default Payment;
