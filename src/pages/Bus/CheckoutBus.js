import React, { PureComponent } from "react";
import { View, Image, TextInput, Picker, ScrollView, SafeAreaView } from "react-native";
import { Button, Text, ActivityIndicator } from "../../components";
import Icon from "react-native-vector-icons/Ionicons";
import { etravosApi } from "../../service";
import moment from "moment";
import RNPickerSelect from "react-native-picker-select";
import Toast from "react-native-simple-toast";
import HTML from "react-native-render-html";
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
      loader: false
    };
  }

  componentDidMount() {
    console.log(this.props.navigation.state.params);
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
    needToValidateAdults = this.state.adults.every(item => item.name == "" || item.age == "");
    return needToValidateAdults;
  };

  _Next = () => {
    const { IdCardType, IdNumber, IssuedBy, adults } = this.state;

    const {
      params,
      paramsRound,
      BoardingPoint,
      BoardingPointReturn,
      DroppingPoint,
      DroppingPointReturn,
      cartData,
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

    let param = {
      Address: "South X",
      Ages: age,
      BoardingId: BoardingPoint.PointId,
      BoardingPointDetails: BoardingPoint.Location + "" + BoardingPoint.Landmark,
      BusTypeName: params.BusType,
      CancellationPolicy: params.CancellationPolicy,
      City: sourceName,
      ConvenienceFee: params.ConvenienceFee,
      DepartureTime: params.DepartureTime,
      DestinationId: params.DestinationId,
      DestinationName: destinationName,
      DisplayName: params.DisplayName,
      DroppingId: DroppingPoint.PointId,
      DroppingPointDetails: DroppingPoint.Location + "" + DroppingPoint.Landmark,
      EmailId: "nadeem@webiixx.com",
      EmergencyMobileNo: null,
      Fares: Fares,
      Genders: gender,
      IdCardNo: IdNumber,
      IdCardType: IdCardType,
      IdCardIssuedBy: IssuedBy,
      JourneyDate: journeyDate,
      MobileNo: 9999999999,
      Names: name,
      NoofSeats: selectedSheets.length,
      Operator: "GDS Demo Test", //////not showing
      PartialCancellationAllowed: params.PartialCancellationAllowed,
      PostalCode: "500035", /////
      Provider: params.Provider,
      ReturnDate: null,
      State: "Telangana",
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
      let paramRound = {
        Address: "South X",
        Ages: age,
        BoardingId: BoardingPointReturn.PointId,
        BoardingPointDetails: BoardingPointReturn.Location + "" + BoardingPointReturn.Landmark,
        BusTypeName: paramsRound.BusType,
        CancellationPolicy: paramsRound.CancellationPolicy,
        City: destinationName,
        ConvenienceFee: paramsRound.ConvenienceFee,
        DepartureTime: paramsRound.DepartureTime,
        DestinationId: paramsRound.DestinationId,
        DestinationName: sourceName,
        DisplayName: paramsRound.DisplayName,
        DroppingId: DroppingPointReturn.PointId,
        DroppingPointDetails: DroppingPointReturn.Location + "" + DroppingPointReturn.Landmark,
        EmailId: "nadeem@webiixx.com",
        EmergencyMobileNo: null,
        Fares: FaresRound,
        Genders: gender,
        IdCardNo: IdNumber,
        IdCardType: IdCardType,
        IdCardIssuedBy: IssuedBy,
        JourneyDate: returnDate,
        MobileNo: 9999999999,
        Names: name,
        NoofSeats: selectedSheetsRound.length,
        Operator: "GDS Demo Test", //////not showing
        PartialCancellationAllowed: paramsRound.PartialCancellationAllowed,
        PostalCode: "500035", /////
        Provider: paramsRound.Provider,
        ReturnDate: null,
        State: "Telangana",
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
      console.log(JSON.stringify(paramRound));
    }
    console.log(param);
    console.log(JSON.stringify(param));
    //return;

    if (this.state.IdNumber && this.state.IssuedBy && !this.validate()) {
      var adharcard = /^\d{12}$/;
      if (this.state.IdCardType == "ADHAR_CARD" && !this.state.IdNumber.match(adharcard)) {
        Toast.show("Please enter the valid Adhar Card Number", Toast.LONG);
      } else {
        if (TripType == 1) {
          this.setState({ loader: true });
          etravosApi
            .post("/Buses/BlockBusTicket", param)
            .then(({ data }) => {
              console.log(data);
              this.setState({ loader: false });
              if (data.BookingStatus == 1) {
                this.props.navigation.navigate("BusPayment", {
                  BlockingReferenceNo: data.BlockingReferenceNo,
                  BookingReferenceNo: data.BookingReferenceNo,
                  ...this.props.navigation.state.params,
                  adults: adults
                });
              } else {
                Toast.show(data.Message, Toast.LONG);
              }
            })
            .catch(error => {});
        } else if (TripType == 2) {
          this.setState({ loader: true });
          etravosApi.post("/Buses/BlockBusTicket", param).then(({ data }) => {
            console.log(data);
            this.setState({ loader: false });

            etravosApi
              .post("/Buses/BlockBusTicket", paramRound)
              .then(({ data: BlockRound }) => {
                console.log(BlockRound);
                if (data.BookingStatus == 1 && BlockRound.BookingStatus == 1) {
                  this.props.navigation.navigate("BusPayment", {
                    BlockingReferenceNo: data.BlockingReferenceNo,
                    BookingReferenceNo: data.BookingReferenceNo,
                    BlockingReferenceNoRound: BlockRound.BlockingReferenceNo,
                    BookingReferenceNoRound: BlockRound.BookingReferenceNo,
                    ...this.props.navigation.state.params,
                    adults: adults
                  });
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
    } else {
      Toast.show("Please fill all the Details", Toast.LONG);
    }
  };
  render() {
    const {
      params,
      paramsRound,
      cartData,
      destinationName,
      sourceName,
      BoardingPoint,
      BoardingPointReturn,
      DroppingPoint,
      selectedSheets,
      TripType,
      selectedSheetsRound
    } = this.props.navigation.state.params;
    const { loader } = this.state;
    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "#E5EBF7" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <View style={{ flexDirection: "column", flex: 1 }}>
            <View style={{ height: 56, backgroundColor: "#E5EBF7", flex: 1 }}>
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
                    marginTop: 20
                  }}>
                  <View style={{ marginHorizontal: 10, marginVertical: 10 }}>
                    <Text style={{ fontWeight: "700", fontSize: 16 }}>Departure</Text>
                    <View
                      style={{
                        flexDirection: "row",
                        marginTop: 10,
                        justifyContent: "space-between"
                      }}>
                      <Text style={{ flex: 1, color: "#5B6974" }}>Name</Text>
                      <Text style={{ flex: 1, color: "#5B6974", marginHorizontal: 5 }}>
                        Journey Date
                      </Text>
                      <Text style={{ flex: 1, color: "#5B6974" }}>Route</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between"
                      }}>
                      <Text style={{ flex: 1 }}>{params.DisplayName}</Text>
                      <Text style={{ flex: 1, marginHorizontal: 5 }}>
                        {moment(params.Journeydate, "YYYY-MM-DD").format("DD-MM-YYYY")}
                      </Text>
                      <Text style={{ flex: 1 }}>
                        {sourceName} To {destinationName}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        marginTop: 10,
                        justifyContent: "space-between"
                      }}>
                      <Text style={{ flex: 1, color: "#5B6974" }}>Boarding Point</Text>
                      <Text style={{ flex: 1, color: "#5B6974", marginHorizontal: 5 }}>
                        Seats No.
                      </Text>
                      <Text style={{ flex: 1, color: "#5B6974" }}>Bus Type</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between"
                      }}>
                      <Text style={{ flex: 3 }}>{BoardingPoint.Location}</Text>
                      {Array.isArray(selectedSheets) &&
                        selectedSheets.map((item, index) => {
                          return (
                            <Text style={{ flex: 1, marginHorizontal: 5 }} key={"Sap" + index}>
                              {item.Number + "\n"}
                            </Text>
                          );
                        })}
                      <Text style={{ flex: 3 }}>{params.BusType}</Text>
                    </View>
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
                      <Text style={{ fontWeight: "300", fontSize: 16 }}>Arrival</Text>
                      <View
                        style={{
                          flexDirection: "row",
                          marginTop: 10,
                          justifyContent: "space-between"
                        }}>
                        <Text style={{ flex: 1, color: "#5B6974" }}>Name</Text>
                        <Text style={{ flex: 1, color: "#5B6974", marginHorizontal: 5 }}>
                          Journey Date
                        </Text>
                        <Text style={{ flex: 1, color: "#5B6974" }}>Route</Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between"
                        }}>
                        <Text style={{ flex: 1 }}>{paramsRound.DisplayName}</Text>
                        <Text style={{ flex: 1, marginHorizontal: 5 }}>
                          {moment(paramsRound.Journeydate, "YYYY-MM-DD").format("DD-MM-YYYY")}
                        </Text>
                        <Text style={{ flex: 1 }}>
                          {destinationName} To {sourceName}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          marginTop: 10,
                          justifyContent: "space-between"
                        }}>
                        <Text style={{ flex: 1, color: "#5B6974" }}>Boarding Point</Text>
                        <Text style={{ flex: 1, color: "#5B6974", marginHorizontal: 5 }}>
                          Seats No.
                        </Text>
                        <Text style={{ flex: 1, color: "#5B6974" }}>Bus Type</Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between"
                        }}>
                        <Text style={{ flex: 3 }}>{BoardingPointReturn.Location}</Text>
                        {Array.isArray(selectedSheetsRound) &&
                          selectedSheetsRound.map((item, index) => {
                            return (
                              <Text style={{ flex: 1, marginHorizontal: 5 }} key={"Sap" + index}>
                                {item.Number + "\n"}
                              </Text>
                            );
                          })}
                        <Text style={{ flex: 3 }}>{paramsRound.BusType}</Text>
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
                    marginVertical: 20,
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
                        justifyContent: "center",
                        alignItems: "center"
                      }}>
                      <RNPickerSelect
                        useNativeAndroidPickerStyle={false}
                        placeholder={{}}
                        value={this.state.IdCardType}
                        style={{
                          inputAndroidContainer: { height: 35 },
                          inputAndroid: { paddingStart: 0, color: "#000" },
                          iconContainer: { justifyContent: "center", top: 0, bottom: 0 }
                        }}
                        onValueChange={(itemValue, index) =>
                          this.setState({ IdCardType: itemValue })
                        }
                        items={[
                          { value: "ADHAR_CARD", label: "Adhar Card" },
                          { value: "PAN_CARD", label: "PAN_CARD" }
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
                        marginHorizontal: 2
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
                      marginTop: 10,
                      paddingStart: 5,
                      marginHorizontal: 10
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
                              marginTop: 10,
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
                                marginHorizontal: 2
                              }}
                              onChangeText={this._changeAdults(index, "name")}
                              placeholder="Passenger Name"
                            />
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
                                justifyContent: "center",
                                alignItems: "center"
                              }}>
                              <RNPickerSelect
                                useNativeAndroidPickerStyle={false}
                                placeholder={{}}
                                value={this.state.adults[index].gender}
                                style={{
                                  inputAndroidContainer: { height: 35 },
                                  inputAndroid: { paddingStart: 0, color: "#000" },
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
                                marginHorizontal: 2
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

                <View
                  style={{
                    elevation: 2,
                    shadowOffset: { width: 0, height: 2 },
                    shadowColor: "rgba(0,0,0,0.1)",
                    shadowOpacity: 1,
                    shadowRadius: 4,
                    backgroundColor: "#ffffff",
                    marginHorizontal: 16,
                    marginBottom: 20,
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
                      Fare Breakup
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      flex: 1,
                      marginHorizontal: 10,
                      marginTop: 5,
                      justifyContent: "space-between"
                    }}>
                    <Text>Fare</Text>
                    <Text>0</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      flex: 1,
                      marginHorizontal: 10,
                      justifyContent: "space-between"
                    }}>
                    <Text>Conv. Fee</Text>
                    <Text>0</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      flex: 1,
                      marginHorizontal: 10,
                      justifyContent: "space-between"
                    }}>
                    <Text style={{ fontWeight: "700", fontSize: 16 }}>Total Fare</Text>
                    <Text style={{ fontWeight: "700", fontSize: 16 }}>0</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      flex: 1,
                      marginHorizontal: 10,
                      justifyContent: "space-between"
                    }}>
                    <Text style={{ fontWeight: "700", fontSize: 16, color: "#5191FB" }}>
                      Total Payable
                    </Text>
                    <HTML html={cartData.total_price} />
                  </View>
                </View>

                {/* <View
              style={{
                elevation: 2,
                backgroundColor: "#ffffff",
                marginHorizontal: 30,
                marginTop: 20,
                height: 190,
                padding: 10,
                borderRadius: 8
              }}>
              <View
                style={{
                  flexDirection: "row",
                  marginVertical: 5,
                  alignItems: "center"
                }}>
                <IconSimple name="bag" size={30} />
                <Text style={{ fontSize: 18, fontWeight: "500", marginStart: 5 }}>
                  Contact Details
                </Text>
              </View>
              <Text style={{ color: "#5B6974" }}>Email Address*</Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#F2F2F2",
                  height: 30,
                  flex: 1
                }}
              />
              <Text style={{ color: "#5B6974" }}>Mobile*</Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#F2F2F2",
                  height: 30,
                  flex: 1
                }}
              />
            </View> */}

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
                  onPress={this._Next}>
                  <Text style={{ color: "#fff" }}>Next</Text>
                </Button>
              </ScrollView>
              {loader && <ActivityIndicator />}
            </View>
          </View>
        </SafeAreaView>
      </>
    );
  }
}

export default CheckoutBus;
