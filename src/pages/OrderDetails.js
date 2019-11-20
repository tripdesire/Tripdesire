import React, { PureComponent } from "react";
import { Text, Button } from "../components";
import { View, StyleSheet, SafeAreaView } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
class OrderDetails extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log(props.navigation.state.params);
  }

  _goBack = () => {
    this.props.navigation.goBack(null);
  };

  render() {
    const { params } = this.props.navigation.state;
    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "#ffffff" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <View>
            <View
              style={{
                flexDirection: "row",
                marginHorizontal: 16,
                height: 56,
                alignItems: "center"
              }}>
              <Button onPress={this._goBack}>
                <Icon name="md-arrow-back" size={24} />
              </Button>
              <Text
                style={{
                  fontSize: 18,
                  color: "#1E293B",
                  marginStart: 5,
                  fontWeight: "700"
                }}>
                {"   "}#{params.id}
              </Text>
            </View>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginHorizontal: 8
                }}>
                <Text style={{ color: "#636C73", fontSize: 12 }}>
                  {params.line_items.length > 0 ? params.line_items[0].meta_data[12].value : ""}
                </Text>
                <Text style={{ color: "#636C73", fontSize: 12 }}>
                  {params.line_items.length > 0 && params.line_items[0].meta_data[8].value != 0
                    ? params.line_items[0].meta_data[8].value
                    : "Non-Stop"}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  marginHorizontal: 8,
                  justifyContent: "space-between"
                }}>
                <View>
                  <Text style={{ fontSize: 20, lineHeight: 22 }}>
                    {params.line_items.length > 0 ? params.line_items[0].meta_data[1].value : ""}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#5D646A",
                      lineHeight: 14
                    }}>
                    {params.line_items.length > 0 ? params.line_items[0].meta_data[2].value : ""}
                  </Text>
                </View>
                <View>
                  <Text style={{ fontSize: 20, lineHeight: 22 }}>
                    {params.line_items.length > 0 ? params.line_items[0].meta_data[5].value : ""}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#5D646A",
                      lineHeight: 14
                    }}>
                    {params.line_items.length > 0 ? params.line_items[0].meta_data[3].value : ""}
                  </Text>
                </View>
                <View>
                  <Text style={{ fontSize: 20, lineHeight: 22 }}>
                    {params.line_items.length > 0 ? params.line_items[0].meta_data[6].value : ""}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#5D646A",
                      lineHeight: 14
                    }}>
                    {params.line_items.length > 0 ? params.line_items[0].meta_data[4].value : ""}
                  </Text>
                </View>
                <View>
                  <Text style={{ fontSize: 20, lineHeight: 22 }}>
                    {params.line_items.length > 0 ? params.line_items[0].meta_data[7].value : ""}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#5D646A",
                      lineHeight: 14
                    }}>
                    Bangalore
                  </Text>
                  <Text style={{ fontSize: 20, lineHeight: 22 }}>
                    {params.line_items.length > 0 ? params.line_items[0].meta_data[21].value : ""}
                  </Text>
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
                <Text>
                  {params.line_items.length > 0 ? params.line_items[0].meta_data[9].value : ""}
                </Text>
              </View>
              <View style={styles.summaryView}>
                <Text>Flight Scharge</Text>
                <Text>
                  {params.line_items.length > 0 ? params.line_items[0].meta_data[10].value : ""}
                </Text>
              </View>
              <View style={styles.summaryView}>
                <Text>Base Fare</Text>
                <Text>
                  {params.currency_symbol}
                  {params.line_items.length > 0 ? params.line_items[0].meta_data[15].value : ""}
                </Text>
              </View>
              <View style={styles.summaryView}>
                <Text>Flight Gst</Text>
                <Text>
                  {params.currency_symbol}
                  {params.line_items.length > 0 ? params.line_items[0].meta_data[16].value : ""}
                </Text>
              </View>
              <View style={styles.summaryView}>
                <Text>Flight Tax</Text>
                <Text>
                  {params.currency_symbol}
                  {params.line_items.length > 0 ? params.line_items[0].meta_data[11].value : ""}
                </Text>
              </View>
              <View style={styles.summaryView}>
                <Text style={{ fontWeight: "700", fontSize: 18 }}>Total Price</Text>
                <Text style={{ fontWeight: "700", fontSize: 18 }}>
                  {params.currency_symbol}
                  {params.total}
                </Text>
              </View>
              <View style={styles.summaryView}>
                <Text style={{ flex: 1 }}>Payment Method</Text>
                <Text style={{ flex: 1, marginStart: 10 }}>{params.payment_method}</Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </>
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

export default OrderDetails;
