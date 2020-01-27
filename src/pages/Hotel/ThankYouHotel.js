import React, { PureComponent } from "react";
import {
  View,
  Image,
  Modal,
  StyleSheet,
  SafeAreaView,
  Platform,
  ScrollView,
  Dimensions,
  TouchableOpacity
} from "react-native";
import { isArray } from "lodash";
import { Button, Text, CurrencyText } from "../../components";
import moment from "moment";
import HTML from "react-native-render-html";

const { width, height } = Dimensions.get("window");

class ThankYouHotel extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log(this.props.navigation.state.params);
  }
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
    const { order } = this.props.navigation.state.params;

    const { line_items } = order;
    JSON.parse('{ "name":"John", "age":30, "city":"New York"}');
    const dataArray = line_items[0].meta_data.reduce(
      (obj, item) => (
        (obj[item.key] = this.hasJsonStructure(item.value) ? JSON.parse(item.value) : item.value),
        obj
      ),
      {}
    );
    console.log(dataArray);

    var str = dataArray["Hotel Image"];
    var res = str.replace("https://cdn.grnconnect.com/", "https://images.grnconnect.com/");

    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "#E5EBF7" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <ScrollView>
            <View>
              <View style={{ justifyContent: "center", marginHorizontal: 8, marginTop: 20 }}>
                <Text style={{ fontWeight: "700", fontSize: 18 }}>Booking Confirmed</Text>
                <Text>ThankYou. Your booking has been completed.</Text>
              </View>

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
                  <Text style={styles.heading}>{dataArray["Hotel Name"]}</Text>
                </View>
                <View style={styles.contentView}>
                  <Image
                    style={{ width: 100, height: 100, borderRadius: 5 }}
                    resizeMode="cover"
                    source={{ uri: res || "https://via.placeholder.com/150" }}
                  />
                  <View style={{ marginStart: 10, flex: 1 }}>
                    <Text style={styles.airlineno}>{dataArray["Room Type"]}</Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        flex: 1
                      }}>
                      <View>
                        <Text style={styles.time}>Check-In</Text>
                        <Text style={styles.airlineno}>{dataArray["Check In"]}</Text>
                      </View>
                      <View>
                        <Text style={styles.time}>Check-Out</Text>
                        <Text style={styles.airlineno}>{dataArray["Check Out"]}</Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        flex: 1
                      }}>
                      <View>
                        <Text style={styles.time}>Rooms</Text>
                        <Text style={styles.airlineno}>{dataArray["Room"]}</Text>
                      </View>
                      <View>
                        <Text style={styles.time}>Guests</Text>
                        <Text style={styles.airlineno}>{dataArray["No. Of Guest"]}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
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
                          {item.fname + " " + item.lname}
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
                {order.child_details &&
                  order.child_details.map((item, index) => {
                    return (
                      <View style={{ flexDirection: "row", flex: 1 }} key={"child" + index}>
                        <Text key={item.index} style={styles.airlineno}>
                          {item.fname + " " + item.lname}
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
                {order.infan_details &&
                  order.infan_details.map((item, index) => {
                    return (
                      <View style={{ flexDirection: "row", flex: 1 }} key={"infant" + index}>
                        <Text key={item.index} style={styles.airlineno}>
                          {item.fname + " " + item.lname}
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

            <View style={[styles.cardView, { marginTop: 15 }]}>
              <View style={styles.flightType}>
                <Text style={styles.heading}>Fare Summary</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.airlineno}>Service Charge</Text>
                <HTML
                  baseFontStyle={styles.airlineno}
                  containerStyle={{}}
                  html={dataArray["Service Charge"]}
                />
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.airlineno}>Tax</Text>
                <Text style={styles.airlineno}><CurrencyText style={styles.airlineno}>₹</CurrencyText>{dataArray["Tax"]}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.time}>Total Price</Text>
                <Text style={styles.time}><CurrencyText style={styles.airlineno}>₹</CurrencyText>{order.total}</Text>
              </View>
              <View style={[styles.summaryRow, { paddingBottom: 8 }]}>
                <Text style={styles.airlineno}>Payment Method</Text>
                <Text style={styles.airlineno}>
                  {order.payment_method != "" || order.payment_method ? order.payment_method : null}
                </Text>
              </View>
            </View>

            <Button
              style={{
                backgroundColor: "#F68E1F",
                justifyContent: "center",
                marginHorizontal: 50,
                marginVertical: 40,
                height: 36,
                borderRadius: 20,
                alignItems: "center"
              }}
              onPress={this.navigateToScreen("Home")}>
              <Text style={{ color: "#fff", paddingHorizontal: 40 }}>Go Home</Text>
            </Button>
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

export default ThankYouHotel;
