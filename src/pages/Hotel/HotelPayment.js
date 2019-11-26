import React, { PureComponent } from "react";
import { View, Image, StyleSheet, Dimensions, SafeAreaView } from "react-native";
import { Button, Text, ActivityIndicator } from "../../components";
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/Ionicons";
import moment from "moment";
import axios from "axios";

class HotelPayment extends React.PureComponent {
  constructor(props) {
    super(props);
    const { params } = props.navigation.state;
  }

  _payment = () => {
    const { params } = this.props.navigation.state;

    Object.assign(params, {
      itemId: 222
    });

    let param = {
      itemId: 222,
      quantity: "1",
      single_hotel_data: params,
      single_ht_img: params.HotelImages[0].Imagepath,
      hotel_adults: params.adultDetail,
      single_ht_address: params.HotelAddress,
      hotel_children: params.childDetail,
      hotel_children_age: params.childAge,
      hotel_city_id: params.cityid,
      single_ht_name: params.HotelName,
      single_ht_room_type: params.selectedRoom.RoomType,
      single_ht_city: params.city,
      single_ht_chk_in: params.checkInDate,
      single_ht_chk_out: params.checkOutDate,
      single_ht_night: params.Night,
      single_ht_room: params.room,
      single_ht_guest: params.adult + params.child,
      single_ht_adults: params.adult,
      single_ht_children: params.child,
      single_ht_price: params.selectedRoom.RoomTotal,
      single_ht_extra_guest: params.selectedRoom.ExtGuestTotal,
      single_ht_tax_amount: params.selectedRoom.ServicetaxTotal,
      single_ht_convenience_fee: params.ConvenienceFeeTotal
    };

    axios.post("https://demo66.tutiixx.com/wp-json/wc/v2/cart/add", param).then(res => {});

    this.props.navigation.navigate("Payment", params);
  };

  render() {
    const { params } = this.props.navigation.state;
    const { width, height } = Dimensions.get("window");
    let checkInDate = moment(params.checkInDate, "DD-MM-YYYY").format("DD MMM");
    let checkOutDate = moment(params.checkOutDate, "DD-MM-YYYY").format("DD MMM");
    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "#5B89F9" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <View style={{ flex: 1, flexDirection: "column" }}>
            <View style={{ flex: 4, backgroundColor: "#5B89F9" }}>
              <View
                style={{
                  height: 56,
                  backgroundColor: "#5B89F9",
                  flexDirection: "row",
                  marginHorizontal: 16,
                  marginTop: 10
                }}>
                <Button onPress={() => this.props.navigation.goBack(null)}>
                  <Icon name="md-arrow-back" size={24} />
                </Button>
                <View style={{ marginHorizontal: 5 }}>
                  <Text style={{ fontWeight: "700", fontSize: 16, marginHorizontal: 5 }}>
                    Book Your Hotel
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "flex-start"
                    }}>
                    <IconMaterial name="calendar-month" size={18} color="#ffffff" />
                    <Text style={{ fontSize: 12, marginHorizontal: 5, color: "#ffffff" }}>
                      {checkInDate} - {checkOutDate}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={{ flex: 4, backgroundColor: "#FFFFFF" }}>
              <View
                style={{
                  elevation: 2,
                  marginHorizontal: 16,
                  borderRadius: 8,
                  backgroundColor: "#ffffff",
                  marginTop: -220
                }}>
                <Text
                  style={{
                    color: "#717A81",
                    backgroundColor: "#E5EBF7",
                    paddingTop: 16,
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                    paddingHorizontal: 16
                  }}>
                  From
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    backgroundColor: "#E5EBF7",
                    paddingBottom: 16,
                    paddingHorizontal: 16
                  }}>
                  $ {params.selectedRoom.RoomTotal}
                </Text>
                <View style={style._textDetailsStyle}>
                  <Text style={style._textHeading}>City</Text>
                  <Text style={style._Details}>{params.city} (INDIA)</Text>
                </View>
                <View style={[style._textDetailsStyle, { backgroundColor: "#E5EBF7" }]}>
                  <Text style={style._textHeading}>Check In</Text>
                  <Text style={style._Details}>{params.checkInDate}</Text>
                </View>
                <View style={style._textDetailsStyle}>
                  <Text style={style._textHeading}>Check Out</Text>
                  <Text style={style._Details}>{params.checkOutDate}</Text>
                </View>
                <View style={[style._textDetailsStyle, { backgroundColor: "#E5EBF7" }]}>
                  <Text style={style._textHeading}>Night(s)</Text>
                  <Text style={style._Details}>{params.Night}</Text>
                </View>
                <View style={style._textDetailsStyle}>
                  <Text style={style._textHeading}>Room(s)</Text>
                  <Text style={style._Details}>{params.room}</Text>
                </View>
                <View
                  style={[
                    style._textDetailsStyle,
                    {
                      backgroundColor: "#E5EBF7"
                    }
                  ]}>
                  <Text style={style._textHeading}>Guest(s)</Text>
                  <Text style={style._Details}>{params.adult + params.child}</Text>
                </View>
                <Button
                  style={{
                    backgroundColor: "#F68E1D",
                    marginHorizontal: 80,
                    alignItems: "center",
                    marginVertical: 30,
                    justifyContent: "center",
                    height: 40,
                    paddingHorizontal: 20,
                    borderRadius: 20
                  }}
                  onPress={this._payment}>
                  <Text style={{ color: "#fff" }}>Continue Booking</Text>
                </Button>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const style = StyleSheet.create({
  _textDetailsStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 5,
    paddingHorizontal: 16
  },
  _Details: { color: "#717A81", flex: 1, alignItems: "flex-start" },
  _textHeading: { color: "#717A81", flex: 2 }
});

export default HotelPayment;
