import React, {PureComponent} from "react";
import {
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Picker,
  ScrollView,
  Platform,
  SafeAreaView
} from "react-native";
import Toast from "react-native-simple-toast";
import DateTimePicker from "react-native-modal-datetime-picker";
import {Button, Text, ActivityIndicator, Icon} from "../../components";
import moment from "moment";
import RazorpayCheckout from "react-native-razorpay";
import axios from "axios";
import Service from "../../service";

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
      radioDirect: true
    };
  }

  onAdultChange = key => text => {
    // console.log(moment().diff(moment(text), "years"));
    this.setState({
      [key]: text,
      dobShow: false,
      age: moment().diff(moment(text), "years")
    });
    //console.log(this.state);
  };

  show = () => {
    this.setState({dobShow: false});
  };

  showDatePicker = () => {
    this.setState({dobShow: true});
  };

  _radioButton = value => {
    this.setState({
      radioDirect: value == "D" ? true : false
    });
  };

  _order = () => {
    let name = this.state.firstname.concat(
      this.state.last_name != "" ? "~" + this.state.last_name : ""
    );
    console.log(name);

    const {item, params} = this.props.navigation.state.params;

    let param = {
      TotalFare: item.TotalNetAmount, ///
      Conveniencefee: item.ConvenienceFee,
      NoofPassengers: item.VehicleId,
      Name: name,
      MobileNo: "9999999999",
      EmailID: "test@test.gmail.com",
      City: params.sourceName,
      Address: params.sourceName, ////
      State: "Telangana",
      PostalCode: "502032",
      PickUpAddress: params.travelType == 3 ? params.Pickuplocation : "", ////
      Provider: item.Provider,
      Operator: null,
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
      ReturnDate: params.travelType == 1 ? params.ReturnDate : null,
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
      Service.post("/Cabs/BlockCab", param)
        .then(res => {
          console.log(res);
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      Toast.show("Please fill all the Details.", Toast.LONG);
    }
  };

  render() {
    const {item, params} = this.props.navigation.state.params;
    return (
      <>
        <SafeAreaView style={{flex: 0, backgroundColor: "#E5EBF7"}} />
        <SafeAreaView style={{flex: 1, backgroundColor: "#ffffff"}}>
          <View style={{flex: 1}}>
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
              <View style={{marginHorizontal: 5}}>
                <Text style={{fontWeight: "700", fontSize: 16}}>Checkout</Text>
                <Text style={{fontSize: 12, color: "#717984"}}>
                  {/* {params.journey_date} {params.return_date ? " - " + params.return_date : ""}
                  {params.checkInDate
                    ? moment(params.checkInDate, "DD-MM-YYYY").format("DD MMM")
                    : ""}
                  {params.checkOutDate
                    ? " - " + moment(params.checkOutDate, "DD-MM-YYYY").format("DD MMM") + " "
                    : ""}
                  |{params.adult > 0 ? " " + params.adult + " Adult" : " "}
                  {params.child > 0 ? " , " + params.child + " Child" : " "}
                  {params.infant > 0 ? " , " + params.infant + " Infant" : " "}
                  {params.className ? "| " + params.className : ""} */}
                </Text>
              </View>
            </View>
            <ScrollView style={{flex: 4, backgroundColor: "#FFFFFF"}}>
              <View
                style={{
                  elevation: 2,
                  borderRadius: 8,
                  backgroundColor: "#ffffff",
                  marginHorizontal: 16,
                  marginTop: 20,
                  padding: 8
                }}>
                <View style={{flexDirection: "row", width: "100%"}}>
                  <Icon name={Platform.OS == "ios" ? "ios-car" : "md-car"} size={50} />
                  <View style={{marginStart: 5, flex: 1}}>
                    <Text style={{flex: 1, fontWeight: "700", fontSize: 16, lineHeight: 22}}>
                      {item.Name}
                    </Text>
                    <Text style={{lineHeight: 18, color: "#696969"}}>
                      {params.travelType == 2
                        ? "Local"
                        : params.travelType == 1
                        ? "Outstation"
                        : params.travelType == 3
                        ? "Transfer"
                        : ""}
                      {params.tripType == 1
                        ? " (One Way)"
                        : params.tripType == 2
                        ? " (Round)"
                        : params.tripType == 4
                        ? " ( " + params.tripType + " hrs )"
                        : params.tripType == 8
                        ? " ( " + params.tripType + " hrs )"
                        : params.tripType == 12
                        ? " ( " + params.tripType + " hrs )"
                        : params.tripType == 24
                        ? " ( " + params.tripType + " hrs )"
                        : ""}
                    </Text>
                    <Text style={{lineHeight: 18, color: "#696969"}}>
                      {params.sourceName}{" "}
                      {params.destinationName != "" ? "To " + params.destinationName : ""}
                    </Text>
                    <View
                      style={{
                        backgroundColor: "#696969",
                        height: 1.35,
                        marginVertical: 5
                      }}></View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: "100%"
                      }}>
                      <View>
                        <Text style={{fontWeight: "700"}}>Pick-Up</Text>
                        <Text>
                          {params.journeyDate}( {params.pickUpTime})
                        </Text>
                      </View>
                      <View>
                        <Text style={{fontWeight: "700"}}>Drop</Text>
                        <Text>{params.journeyDate}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <View
                style={{
                  elevation: 2,
                  borderRadius: 8,
                  backgroundColor: "#ffffff",
                  marginHorizontal: 16,
                  marginTop: 20
                }}>
                <View style={{marginHorizontal: 10, marginVertical: 10}}>
                  <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Icon name={Platform.OS === "ios" ? "ios-person" : "md-person"} size={22} />
                    <Text style={{marginStart: 10, fontWeight: "600", fontSize: 16}}>
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
                      <Text>Adult</Text>
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
                          selectedValue={this.state.den}
                          style={{height: 50, width: 60}}
                          onValueChange={(itemValue, itemIndex) => this.setState({den: itemValue})}>
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
                        onChangeText={this.onAdultChange("firstname")}
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
                      <View
                        style={{
                          flex: 2,
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}>
                        <Text style={{color: "#5D666D", marginStart: 5}}>DOB</Text>
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
                          onPress={this.showDatePicker}
                          placeholder="DOB">
                          <Text>{moment(this.state.dob).format("DD-MMM-YYYY")}</Text>
                        </Button>
                        <DateTimePicker
                          date={this.state.dob}
                          isVisible={this.state.dobShow}
                          onConfirm={this.onAdultChange("dob")}
                          onCancel={this.show}
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
                          marginHorizontal: 2,
                          justifyContent: "center",
                          alignItems: "center"
                        }}>
                        <Picker
                          selectedValue={this.state.gender}
                          style={{height: 50, width: 90}}
                          onValueChange={(itemValue, itemIndex) =>
                            this.setState({gender: itemValue})
                          }>
                          <Picker.Item label="Male" value="M" />
                          <Picker.Item label="Female" value="F" />
                        </Picker>
                      </View>
                    </View>
                    <Button style={{marginTop: 10}}>
                      <Text style={{color: "#5B89F9"}}>Optional (Frequent flyer Number)</Text>
                    </Button>

                    <View>
                      <Text>Frequent Flyer Details</Text>
                      <Text>
                        Please verify the credit of your frequent flyer miles at the airport checkin
                        counter.
                      </Text>
                      <View style={{flexDirection: "row"}}>
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
                  </View>
                </View>
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
                <View style={{flexDirection: "row", alignItems: "center"}}>
                  <Icon type="Foundation" name="shopping-bag" size={22} />
                  <Text style={{marginStart: 10, fontWeight: "600", fontSize: 16}}>
                    Fare Breakkup
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
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    flex: 1,
                    paddingHorizontal: 8
                  }}>
                  <Text style={{fontSize: 16, fontWeight: "700"}}>You Pay</Text>
                  <Text style={{fontSize: 16, fontWeight: "700"}}>₹11231</Text>
                </View>
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
                <View style={{flexDirection: "row", alignItems: "center"}}>
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
                  <Text style={{marginStart: 5, fontSize: 18}}>RazorPay</Text>
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
                <Text style={{color: "#fff"}}>Place Order</Text>
              </Button>
            </ScrollView>
          </View>
        </SafeAreaView>
      </>
    );
  }
}

export default CheckoutCab;
