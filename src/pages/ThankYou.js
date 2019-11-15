import React, { PureComponent } from "react";
import { Text, Button } from "../components";
import { Image, ImageBackground, Dimensions, View, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { DomSugg, IntSugg, DomHotelSugg, BusSugg } from "../store/action";
import Service from "../service";
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";
const { height, width } = Dimensions.get("window");
class ThankYou extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log(props.navigation.state);
  }

  navigateToScreen = page => () => {
    this.props.navigation.navigate(page);
  };

  render() {
    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 16,
            height: 56,
            alignItems: "center"
          }}>
          <Button onPress={this.props.navigation.goBack(null)}>
            <Icon name="md-arrow-back" size={24} />
          </Button>
          <Text
            style={{
              fontSize: 18,
              color: "#1E293B",
              marginStart: 5,
              fontWeight: "700"
            }}>
            Orders
          </Text>
        </View>
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginHorizontal: 8
            }}>
            <Text style={{ color: "#636C73", fontSize: 12 }}>01 - jan</Text>
            <Text style={{ color: "#636C73", fontSize: 12 }}>Non-Stop</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              marginHorizontal: 8,
              justifyContent: "space-between"
            }}>
            <View>
              <Text style={{ fontSize: 20, lineHeight: 22 }}>Indigo</Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "#5D646A",
                  lineHeight: 14
                }}>
                6E-151E
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: 20, lineHeight: 22 }}>08:25</Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "#5D646A",
                  lineHeight: 14
                }}>
                Hyderabad
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: 20, lineHeight: 22 }}>08:25</Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "#5D646A",
                  lineHeight: 14
                }}>
                Bangalore
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: 20, lineHeight: 22 }}>1 hrs 25 mins</Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "#5D646A",
                  lineHeight: 14
                }}>
                Bangalore
              </Text>
              <Text style={{ fontSize: 20, lineHeight: 22 }}>Economy</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            marginHorizontal: 8,
            elevation: 1,
            borderRadius: 5,
            marginTop: 10
          }}>
          <Text
            style={{
              fontWeight: "700",
              fontSize: 18,
              paddingVertical: 10,
              backgroundColor: "#EEF1F8",
              paddingHorizontal: 10,
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5
            }}>
            Passenger Details
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 10
            }}>
            <View>
              <Text
                style={{
                  fontWeight: "700",
                  fontSize: 16
                }}>
                Passenger
              </Text>
              <Text>Kamal Gangwar</Text>
            </View>
            <View>
              <Text style={{ fontWeight: "700", fontSize: 16 }}>Age</Text>
              <Text>22</Text>
            </View>
            <View>
              <Text style={{ fontWeight: "700", fontSize: 16 }}>Gender</Text>
              <Text>Male</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            marginHorizontal: 8,
            elevation: 1,
            borderRadius: 5,
            marginTop: 10
          }}>
          <Text
            style={{
              fontWeight: "700",
              fontSize: 18,
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
              backgroundColor: "#EEF1F8",
              paddingHorizontal: 10,
              paddingVertical: 10
            }}>
            Fare Summary
          </Text>
          <View style={styles.summaryView}>
            <Text>Convenience Fee</Text>
            <Text>0.00</Text>
          </View>
          <View style={styles.summaryView}>
            <Text>Flight Scharge</Text>
            <Text>0.00</Text>
          </View>
          <View style={styles.summaryView}>
            <Text>Base Fare</Text>
            <Text>1472</Text>
          </View>
          <View style={styles.summaryView}>
            <Text>Flight Gst</Text>
            <Text>0.00</Text>
          </View>
          <View style={styles.summaryView}>
            <Text>Flight Tax</Text>
            <Text>1131</Text>
          </View>
          <View style={styles.summaryView}>
            <Text style={{ fontWeight: "700", fontSize: 18 }}>Total Price</Text>
            <Text style={{ fontWeight: "700", fontSize: 18 }}>2603</Text>
          </View>
          <View style={styles.summaryView}>
            <Text style={{ flex: 1 }}>Payment Method</Text>
            <Text style={{ flex: 1, marginStart: 10 }}>Credit Card/Debit Card/Net Banking</Text>
          </View>
        </View>
        <Button
          style={{
            backgroundColor: "#F68E1F",
            justifyContent: "center",
            marginHorizontal: 50,
            marginVertical: 40,
            height: 40,
            borderRadius: 20
          }}
          onPress={this.navigateToScreen("Home")}>
          <Text style={{ color: "#fff", paddingHorizontal: 40 }}>Go Home</Text>
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  summaryView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10
  }
});

export default ThankYou;
