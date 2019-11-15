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
import { Button, Text, Activity_Indicator } from "../../components";
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";
import IconSimple from "react-native-vector-icons/SimpleLineIcons";
import Icon from "react-native-vector-icons/Ionicons";
class CheckoutBus extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      gender: "Male",
      ffn: false,
      radioDirect: true,
      radioCheck: false,
      radioCOD: false
    };
  }

  _FFN = () => {
    this.setState({ ffn: true });
  };

  _radioButton = value => {
    this.setState({
      radioDirect: value == "D" ? true : false,
      radioCheck: value == "CP" ? true : false,
      radioCOD: value == "C" ? true : false
    });
  };
  render() {
    const { ffn, radioDirect, radioCheck, radioCOD } = this.state;
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
                  19 Sept | Thursday | 2 Buses Found
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

        {/* <View style={{ height: 100, width: "100%" }}>
              <View style={{ flex: 1, backgroundColor: "#E4EAF6" }}></View>
              <View style={{ flex: 3, backgroundColor: "#FFFFFF" }}></View>
             
            </View> */}
        <View style={{ flex: 4, backgroundColor: "#FFFFFF" }}>
          <ScrollView
            contentContainerStyle={{ backgroundColor: "#ffffff" }}
            showsVerticalScrollIndicator={false}>
            <View
              style={{
                elevation: 2,
                borderRadius: 8,
                backgroundColor: "#ffffff",
                marginHorizontal: 30,
                marginTop: 20
              }}>
              <View style={{ marginHorizontal: 10, marginVertical: 10 }}>
                <Text style={{ fontWeight: "300", fontSize: 16 }}>Departure</Text>
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 10,
                    justifyContent: "space-between"
                  }}>
                  <Text style={{ flex: 1, color: "#5B6974" }}>Operator Name</Text>
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
                  <Text style={{ flex: 1 }}>GreenLine Travels And Holidays</Text>
                  <Text style={{ flex: 1, marginHorizontal: 5 }}>04-10-19</Text>
                  <Text style={{ flex: 1 }}>Hyderabad To Bangalore</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 10,
                    justifyContent: "space-between"
                  }}>
                  <Text style={{ flex: 1, color: "#5B6974" }}>Boarding Point</Text>
                  <Text style={{ flex: 1, color: "#5B6974", marginHorizontal: 5 }}>Seats No.</Text>
                  <Text style={{ flex: 1, color: "#5B6974" }}>Bus Type</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between"
                  }}>
                  <Text style={{ flex: 1 }}>
                    Kukatpally Kukatpally 1 Vodafone Store 9000405125 - 07:15 PM
                  </Text>
                  <Text style={{ flex: 1, marginHorizontal: 5 }}>12 U</Text>
                  <Text style={{ flex: 1 }}>A/C Sleeper (2+1)</Text>
                </View>
              </View>
            </View>
            <View
              style={{
                elevation: 2,
                backgroundColor: "#ffffff",
                marginHorizontal: 30,
                marginTop: 20,
                height: 150,
                borderRadius: 8
              }}>
              <View
                style={{
                  flexDirection: "row",
                  marginHorizontal: 10,
                  marginVertical: 5,
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
                <Text style={{ color: "#5B6974" }}>Seat No.</Text>

                <Text style={{ marginHorizontal: 5 }}>12 U</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: "#F2F2F2",
                    height: 40,
                    flex: 1,
                    marginHorizontal: 2
                  }}
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
                    style={{ height: 50, width: 120 }}
                    onValueChange={(itemValue, itemIndex) => this.setState({ gender: itemValue })}>
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
                  placeholder="Age"
                />
              </View>
            </View>

            <View
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
              }}>
              <Text style={{ color: "#fff" }}>Next</Text>
            </Button>
          </ScrollView>
        </View>
      </View>
    );
  }
}

export default CheckoutBus;
