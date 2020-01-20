import React, { PureComponent } from "react";
import { View, StyleSheet, ScrollView, SafeAreaView, Image } from "react-native";
import Button from "./Button";
import Text from "./TextComponent";
import Icon from "./IconNB";
import moment from "moment";

class BusThankYou extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  _goBack = () => {
    this.props.navigation.goBack(null);
  };

  navigateToScreen = page => () => {
    this.props.navigation.navigate(page);
  };

  hasJsonStructure(str) {
    if (typeof str !== "string") return false;
    try {
      const result = JSON.parse(str);
      const type = Object.prototype.toString.call(result);
      return type === "[object Object]" || type === "[object Array]";
    } catch (err) {
      return false;
    }
  }

  render() {
    console.log(this.props.navigation.state.params);
    const { order, isOrderPage } = this.props.navigation.state.params;
    const dataArray = order.line_items[0].meta_data.reduce(
      (obj, item) => (
        (obj[item.key] = this.hasJsonStructure(item.value) ? JSON.parse(item.value) : item.value),
        obj
      ),
      {}
    );
    console.log(dataArray);
    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "#E4EAF6" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          {isOrderPage && (
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 16,
                height: 56,
                backgroundColor: "#E4EAF6",
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
                #{order.id}
              </Text>
            </View>
          )}
          <ScrollView>
            <View>
              {!isOrderPage && (
                <View style={{ justifyContent: "center", marginHorizontal: 8, marginTop: 20 }}>
                  <Text style={{ fontWeight: "700", fontSize: 18 }}>Booking Confirmed</Text>
                  <Text>ThankYou. Your booking has been completed.</Text>
                </View>
              )}

              <View style={[styles.cardView, { marginTop: 15 }]}>
                <View style={styles.flightType}>
                  <Text style={styles.heading}>Ticket Information</Text>
                </View>
                <View style={styles.contentView}>
                  <View>
                    <Text style={[styles.time, { marginBottom: 4 }]}>Booking Id</Text>
                    <Text style={styles.airlineno}>{order.id != "" ? order.id : null}</Text>
                  </View>

                  <View style={{ alignItems: "center" }}>
                    <Text style={[styles.time, { marginBottom: 4 }]}>E-mail</Text>
                    <Text style={styles.airlineno}>
                      {order.billing.email ? order.billing.email : null}
                    </Text>
                  </View>

                  <View>
                    <Text style={[styles.time, { marginBottom: 4 }]}>Date</Text>
                    <Text style={styles.airlineno}>
                      {moment(order.date_created).format("DD-MM-YYYY")}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={[styles.cardView, { marginTop: 15 }]}>
                <View style={styles.flightType}>
                  <Text style={styles.heading}>Arrival</Text>
                </View>
                <View style={styles.contentView}>
                  <Image
                    style={{ width: 60, height: 60, marginEnd: 3 }}
                    source={require("../assets/imgs/busNew.png")}
                  />
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={styles.time}>{dataArray["Bus Name"]}</Text>
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text style={styles.time}>Seat(s):</Text>
                        <Text style={styles.time}>{dataArray["Select Seat Number"]}</Text>
                      </View>
                    </View>
                    <Text style={styles.airlineno}>{dataArray["Bus Type"]}</Text>
                    <View>
                      <Text style={styles.time}>Boarding Point</Text>
                      <Text style={styles.airlineno}>{dataArray["Boarding Point Id"]}</Text>
                    </View>
                    <View>
                      <Text style={styles.time}>Dropping Point</Text>
                      <Text style={styles.airlineno}>{dataArray["Dropping Point Id"]}</Text>
                    </View>
                  </View>
                </View>
              </View>

              {dataArray.hasOwnProperty("Return Bus Item Result Data") && (
                <View style={[styles.cardView, { marginTop: 15 }]}>
                  <View style={styles.flightType}>
                    <Text style={styles.heading}>Return</Text>
                  </View>
                  <View style={styles.contentView}>
                    <Image
                      style={{ width: 60, height: 60, marginEnd: 3 }}
                      source={require("../assets/imgs/busNew.png")}
                    />
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={styles.time}>{dataArray["Return Bus Name"]}</Text>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                          <Text style={styles.time}>Seat(s):</Text>
                          <Text style={styles.time}>{dataArray["Return Select Seat Number"]}</Text>
                        </View>
                      </View>
                      <Text style={styles.airlineno}>{dataArray["Return Bus Type"]}</Text>
                      <View>
                        <Text style={styles.time}>Boarding Point</Text>
                        <Text style={styles.airlineno}>
                          {dataArray["Return Boarding Point Id"]}
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.time}>Dropping Point</Text>
                        <Text style={styles.airlineno}>
                          {dataArray["Return Dropping Point Id"]}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </View>

            <View style={[styles.cardView, { marginTop: 15 }]}>
              <View style={styles.flightType}>
                <Text style={styles.heading}>Passenger Details</Text>
              </View>
              <View style={[styles.contentView, { flexDirection: "column" }]}>
                <View style={{ flexDirection: "row", flex: 1, marginBottom: 4 }}>
                  <Text style={[styles.time, { flex: 1 }]}>Name</Text>
                  <Text style={[styles.time, { flex: 1, textAlign: "center" }]}>Age</Text>
                  <Text style={[styles.time, { flex: 1, textAlign: "center" }]}>Gender</Text>
                </View>

                {order.adult_details &&
                  order.adult_details.map((item, index) => {
                    return (
                      <View style={{ flexDirection: "row", flex: 1 }} key={"adult" + index}>
                        <Text key={item.index} style={[styles.airlineno, { flex: 1 }]}>
                          {item.fname}
                        </Text>
                        <Text
                          key={item.index}
                          style={[styles.airlineno, { flex: 1, textAlign: "center" }]}>
                          {item.age}
                        </Text>
                        <Text
                          key={item.index}
                          style={[styles.airlineno, { flex: 1, textAlign: "center" }]}>
                          {item.gender == "M" ? "Male" : "Female"}
                        </Text>
                      </View>
                    );
                  })}
              </View>
            </View>

            <View style={[styles.cardView, { marginTop: 15, marginBottom: 20 }]}>
              <View style={styles.flightType}>
                <Text style={styles.heading}>Fare Summary</Text>
              </View>

              <Text style={[styles.time, { marginHorizontal: 12, marginTop: 10 }]}>Onward</Text>

              <View style={styles.summaryRow}>
                <Text style={styles.airlineno}>Base Fare</Text>
                <Text style={styles.airlineno}>₹ {dataArray["Base Fare"]}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.airlineno}>Service Charge</Text>
                <Text style={styles.airlineno}>₹ {dataArray["Service Charge2"]}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.airlineno}>Tax</Text>
                <Text style={styles.airlineno}>₹ {dataArray["Service Tax2"]}</Text>
              </View>

              {dataArray.hasOwnProperty("Return Bus Item Result Data") && (
                <>
                  <Text style={[styles.time, { marginHorizontal: 12 }]}>Return</Text>
                  <View style={styles.summaryRow}>
                    <Text style={styles.airlineno}>Base Fare</Text>
                    <Text style={styles.airlineno}>₹ {dataArray["Return Base Fare"]}</Text>
                  </View>

                  <View style={styles.summaryRow}>
                    <Text style={styles.airlineno}>Service Charge</Text>
                    <Text style={styles.airlineno}>₹ {dataArray["Return Service Charge2"]}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.airlineno}>Tax</Text>
                    <Text style={styles.airlineno}>₹ {dataArray["Return Service Tax2"]}</Text>
                  </View>
                </>
              )}

              <View style={styles.summaryRow}>
                <Text style={styles.time}>Total Price</Text>
                <Text style={styles.time}>₹ {order.total}</Text>
              </View>

              <View style={[styles.summaryRow, { paddingBottom: 8 }]}>
                <Text style={styles.airlineno}>Payment Method</Text>
                <Text style={styles.airlineno}>
                  {order.payment_method != "" || order.payment_method ? order.payment_method : null}
                </Text>
              </View>
            </View>

            {!isOrderPage && (
              <Button
                style={{
                  backgroundColor: "#F68E1F",
                  justifyContent: "center",
                  marginHorizontal: 50,
                  marginVertical: 40,
                  height: 40,
                  borderRadius: 20,
                  alignItems: "center"
                }}
                onPress={this.navigateToScreen("Home")}>
                <Text style={{ color: "#fff", paddingHorizontal: 40 }}>Go Home</Text>
              </Button>
            )}
          </ScrollView>
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
  },
  Heading: { fontSize: 16, fontWeight: "500" },
  header: {
    fontSize: 16,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 5,
    backgroundColor: "#edeeef"
  },
  time: {
    lineHeight: 16,
    fontWeight: "600"
  },
  airlineno: {
    fontSize: 12,
    lineHeight: 16,
    color: "#757575"
  },
  class: {
    lineHeight: 16,
    fontWeight: "600"
  },
  summaryRow: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  cardView: {
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    marginHorizontal: 8,
    backgroundColor: "#fff",
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOpacity: 1,
    shadowRadius: 4
  },
  flightType: {
    backgroundColor: "#edeeef",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8
  },
  contentView: {
    flexDirection: "row",
    paddingHorizontal: 5,
    paddingTop: 8,
    paddingBottom: 8,
    justifyContent: "space-between",
    marginHorizontal: 8
  },
  heading: {
    fontSize: 16,
    fontWeight: "600"
  }
});

export default BusThankYou;
