import React, {PureComponent} from "react";
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
import {Button, Text, ActivityIndicator} from "../../components";
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";
import IconSimple from "react-native-vector-icons/SimpleLineIcons";
import Icon from "react-native-vector-icons/Ionicons";
import Service from "../../service";
import moment from "moment";
import Toast from "react-native-simple-toast";
import HTML from "react-native-render-html";
class CheckoutBus extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      gender: "M",
      IdCardType: "ADHAR_CARD",
      IdNumber: "",
      IssuedBy: "",
      Name: "",
      Age: "",
      ffn: false,
      loader: false
    };
  }

  _FFN = () => {
    this.setState({ffn: true});
  };

  componentDidMount() {
    console.log(this.props.navigation.state.params);
  }

  _changeAdult = key => text => {
    this.setState({[key]: text});
  };

  _Next = () => {
    let param = {
      Address: "South X",
      Ages: "24",
      BoardingId: "1798",
      BoardingPointDetails: "Tank Bund Tank Bund",
      BusTypeName: "Sleeper AC Volvo B11R Multi Axle (2+2)",
      CancellationPolicy: "10:-1:10:0",
      City: "Hyderabad",
      ConvenienceFee: 0,
      DepartureTime: "08:00 PM",
      DestinationId: "109",
      DestinationName: "Bangalore",
      DisplayName: "TRSMOP",
      DroppingId: "136",
      DroppingPointDetails: "White Field White Field",
      EmailId: "nadeem@webiixx.com",
      EmergencyMobileNo: null,
      Fares: "1600",
      Genders: "M",
      IdCardNo: "123456",
      IdCardType: "PAN_CARD",
      IdCardIssuedBy: "GOV",
      JourneyDate: "03-12-2019",
      MobileNo: 9999999999,
      Names: "rahul singh",
      NoofSeats: "1",
      Operator: "GDS Demo Test",
      PartialCancellationAllowed: "true",
      PostalCode: "500035",
      Provider: "+rfVawweNEABIDWJVZMKFA==",
      ReturnDate: "",
      State: "Telangana",
      Seatcodes: null,
      SeatNos: "31",
      Servicetax: "225",
      ServiceCharge: "10.00",
      SourceId: "100",
      SourceName: "Hyderabad",
      Titles: "Mr.",
      TripId: "340",
      TripType: 1,
      UserType: 5
    };

    console.log(this.state);

    if (this.state.Name != "" && this.state.IdNumber && this.state.IssuedBy && this.state.Age) {
      this.setState({loader: true});
      Service.post("/Buses/BlockBusTicket", param)
        .then(({data}) => {
          console.log(data);
          this.setState({loader: false});
          const {
            cartData,
            destinationName,
            sourceName,
            params
          } = this.props.navigation.state.params;
          if (data.BookingStatus == 1) {
            this.props.navigation.navigate("BusPayment", {
              BlockingReferenceNo: data.BlockingReferenceNo,
              cartData,
              destinationName,
              sourceName,
              params
            });
          } else {
            Toast.show(data.Message, Toast.LONG);
          }
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      Toast.show("Please fill all the Details", Toast.LONG);
    }
  };
  render() {
    const {params, cartData, destinationName, sourceName} = this.props.navigation.state.params;
    const {ffn, loader} = this.state;
    return (
      <View style={{flexDirection: "column", flex: 1}}>
        <View style={{height: 56, backgroundColor: "#E5EBF7", flex: 1}}>
          <View style={{flexDirection: "row", width: "100%"}}>
            <Button onPress={() => this.props.navigation.goBack(null)} style={{padding: 16}}>
              <Icon name="md-arrow-back" size={24} />
            </Button>
            <View
              style={{
                paddingTop: 16
              }}>
              <Text style={{fontWeight: "700", fontSize: 16, marginHorizontal: 5}}>Checkout</Text>
              <Text style={{fontSize: 12, marginHorizontal: 5, color: "#717984"}}>
                {moment(params.Journeydate, "YYYY-MM-DD").format("DD MMM")}
              </Text>
            </View>
          </View>
        </View>

        <View style={{flex: 4, backgroundColor: "#FFFFFF"}}>
          <ScrollView
            contentContainerStyle={{backgroundColor: "#ffffff"}}
            showsVerticalScrollIndicator={false}>
            <View
              style={{
                elevation: 2,
                borderRadius: 8,
                backgroundColor: "#ffffff",
                marginHorizontal: 16,
                marginTop: 20
              }}>
              <View style={{marginHorizontal: 10, marginVertical: 10}}>
                <Text style={{fontWeight: "300", fontSize: 16}}>Departure</Text>
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 10,
                    justifyContent: "space-between"
                  }}>
                  <Text style={{flex: 1, color: "#5B6974"}}>Name</Text>
                  <Text style={{flex: 1, color: "#5B6974", marginHorizontal: 5}}>Journey Date</Text>
                  <Text style={{flex: 1, color: "#5B6974"}}>Route</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between"
                  }}>
                  <Text style={{flex: 1}}>{params.DisplayName}</Text>
                  <Text style={{flex: 1, marginHorizontal: 5}}>
                    {moment(params.Journeydate, "YYYY-MM-DD").format("DD-MM-YYYY")}
                  </Text>
                  <Text style={{flex: 1}}>
                    {sourceName} To {destinationName}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 10,
                    justifyContent: "space-between"
                  }}>
                  <Text style={{flex: 1, color: "#5B6974"}}>Boarding Point</Text>
                  <Text style={{flex: 1, color: "#5B6974", marginHorizontal: 5}}>Seats No.</Text>
                  <Text style={{flex: 1, color: "#5B6974"}}>Bus Type</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between"
                  }}>
                  <Text style={{flex: 1}}>
                    Kukatpally Kukatpally 1 Vodafone Store 9000405125 - 07:15 PM
                  </Text>
                  <Text style={{flex: 1, marginHorizontal: 5}}>12 U</Text>
                  <Text style={{flex: 1}}>{params.BusType}</Text>
                </View>
              </View>
            </View>
            <View
              style={{
                elevation: 2,
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
                  style={{width: 20, height: 20}}
                  resizeMode="cover"
                />
                <Text style={{fontSize: 18, fontWeight: "500", marginStart: 5}}>
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
                    justifyContent: "center",
                    alignItems: "center"
                  }}>
                  <Picker
                    selectedValue={this.state.IdCardType}
                    style={{height: 50, width: 120}}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({IdCardType: itemValue})
                    }>
                    <Picker.Item label="Adhar Card" value="ADHAR_CARD" />
                    <Picker.Item label="PAN CARD" value="PAN_CARD" />
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
                  marginHorizontal: 10
                }}
                onChangeText={this._changeAdult("IssuedBy")}
                placeholder="Identification Document Issued By"
              />
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 10,
                  marginHorizontal: 10,
                  justifyContent: "center",
                  alignItems: "center"
                }}>
                <Text style={{color: "#5B6974"}}>Seat No.</Text>

                <Text style={{marginHorizontal: 5}}>12 U</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: "#F2F2F2",
                    height: 40,
                    flex: 1,
                    marginHorizontal: 2
                  }}
                  onChangeText={this._changeAdult("Name")}
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
                    justifyContent: "center",
                    alignItems: "center"
                  }}>
                  <Picker
                    selectedValue={this.state.gender}
                    style={{height: 50, width: 120}}
                    onValueChange={(itemValue, itemIndex) => this.setState({gender: itemValue})}>
                    <Picker.Item label="Male" value="M" />
                    <Picker.Item label="Female" value="F" />
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
                  keyboardType="numeric"
                  placeholder="Age"
                  onChangeText={this._changeAdult("Age")}
                />
              </View>
            </View>

            <View
              style={{
                elevation: 2,
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
                  style={{width: 20, height: 20}}
                  resizeMode="cover"
                />
                <Text style={{fontSize: 18, fontWeight: "500", marginStart: 5}}>Fare Breakup</Text>
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
                <Text style={{fontWeight: "700", fontSize: 16}}>Total Fare</Text>
                <Text style={{fontWeight: "700", fontSize: 16}}>0</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  flex: 1,
                  marginHorizontal: 10,
                  justifyContent: "space-between"
                }}>
                <Text style={{fontWeight: "700", fontSize: 16, color: "#5191FB"}}>
                  Total Payable
                </Text>
                <HTML html={cartData.total} />
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
              <Text style={{color: "#fff"}}>Next</Text>
            </Button>
          </ScrollView>
          {loader && <ActivityIndicator />}
        </View>
      </View>
    );
  }
}

export default CheckoutBus;
