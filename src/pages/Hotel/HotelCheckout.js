import React, { PureComponent } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  SafeAreaView,
  Linking
} from "react-native";
import { Button, Text, ActivityIndicator, Icon } from "../../components";
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";
import Stars from "react-native-stars";
//import MapView from "react-native-maps";
import moment from "moment";
import HTML from "react-native-render-html";

class HotelCheckout extends React.Component {
  constructor(props) {
    super(props);
    const { params } = props.navigation.state;
    console.log(params);
    this.state = {
      _selectRadio: "1",
      selectedRoom: params.RoomDetails[0]
    };
  }

  _radioButton = item => () => {
    this.setState({
      _selectRadio: item.RoomIndex,
      selectedRoom: item
    });
  };

  _viewLocation = (lat, lag) => () => {
    console.log(lat);
    console.log(lag);
    let loc = "geo:" + lat + "," + lag + "?q=" + lat + "," + lag;
    console.log(loc);
    Linking.canOpenURL(loc)
      .then(supported => {
        if (!supported) {
          console.log("Can't handle url: ");
        } else {
          return Linking.openURL(loc);
        }
      })
      .catch(err => console.error("An error occurred", err));
  };

  _Next = () => {
    const params = { ...this.props.navigation.state.params, selectedRoom: this.state.selectedRoom };
    this.props.navigation.navigate("HotelPayment", params);
  };

  _keyExtractor = (item, index) => "key" + index;

  render() {
    const { params } = this.props.navigation.state;

    let Amenities = params.Facilities.split(",").map(s => s.trim());
    console.log(Amenities);

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
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    flex: 1
                  }}>
                  <View style={{ marginHorizontal: 5 }}>
                    <Text
                      style={{
                        fontWeight: "700",
                        fontSize: 16,
                        marginHorizontal: 5
                      }}>
                      {params.city}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "flex-start"
                      }}>
                      <IconMaterial name="calendar-month" size={18} color="#ffffff" />
                      <Text
                        style={{
                          fontSize: 12,
                          marginHorizontal: 5,
                          color: "#ffffff"
                        }}>
                        {checkInDate} - {checkOutDate}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View
                style={{
                  marginHorizontal: 16,
                  marginTop: 20,
                  padding: 10
                }}>
                <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                  <Text
                    style={{
                      fontSize: 18,
                      flex: 1,
                      color: "#ffffff",
                      fontWeight: "700"
                    }}>
                    {params.HotelName}
                  </Text>
                  <Text style={{ alignSelf: "flex-end", color: "#ffffff" }}>
                    {params.room}:Room(s),{params.Night}:Night
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginVertical: 15
                  }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ color: "#ffffff" }}>({params.city})</Text>
                    <View style={{ alignItems: "flex-start", marginStart: 10 }}>
                      <Stars
                        default={parseInt(params.StarRating)}
                        count={5}
                        half={true}
                        starSize={80}
                        fullStar={<IconMaterial name={"star"} style={[styles.myStarStyle]} />}
                        emptyStar={
                          <IconMaterial
                            name={"star-outline"}
                            style={[styles.myStarStyle, styles.myEmptyStarStyle]}
                          />
                        }
                        halfStar={<IconMaterial name={"star-half"} style={[styles.myStarStyle]} />}
                      />
                    </View>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                    <Icon
                      name="location-pin"
                      type="SimpleLineIcons"
                      size={16}
                      style={{ marginEnd: 5 }}
                      color="#fff"
                    />
                    <TouchableOpacity
                      style={{ color: "#717A81", fontSize: 12 }}
                      onPress={this._viewLocation(params.Latitude, params.Longitude)}>
                      <Text style={{ color: "#ffffff" }}>View on Map</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={{ color: "#ffffff" }}>{params.HotelAddress}</Text>
                <View style={{ flexDirection: "row", width: "100%", marginTop: 10 }}>
                  {Amenities.map(item => (
                    <View key={item}>
                      {item == "Housekeeping - daily" && (
                        <Icon
                          type="MaterialCommunityIcons"
                          size={24}
                          color="#ffffff"
                          name="washing-machine"
                        />
                      )}
                      {item == "Complimentary wireless internet" && (
                        <Icon
                          style={{ marginHorizontal: 5 }}
                          color="#ffffff"
                          size={24}
                          name="ios-wifi"
                        />
                      )}
                      {item == "24-hour front desk" && (
                        <Icon
                          style={{ marginHorizontal: 5 }}
                          type="FontAwesome5"
                          name="crosshairs"
                          size={24}
                          color="#ffffff"
                        />
                      )}
                      {item == "Air conditioning" && (
                        <Icon
                          type="MaterialCommunityIcons"
                          color="#ffffff"
                          size={24}
                          name="air-conditioner"
                        />
                      )}
                    </View>
                  ))}
                </View>
              </View>
            </View>
            <View style={{ flex: 4, backgroundColor: "#FFFFFF" }}>
              <View
                style={{
                  elevation: 2,
                  backgroundColor: "#ffffff",
                  marginHorizontal: 16,
                  marginTop: -40,
                  paddingHorizontal: 10,
                  marginBottom: 16,
                  borderRadius: 8
                }}>
                <ScrollView
                  contentContainerStyle={{ backgroundColor: "#ffffff" }}
                  showsVerticalScrollIndicator={false}>
                  <Text style={{ fontSize: 18, flex: 1, marginTop: 10 }}>Book your Hotels</Text>

                  {params.RoomDetails.map(item => {
                    const { width } = Dimensions.get("window");
                    const { params } = this.props.navigation.state;
                    const { _selectRadio } = this.state;
                    var str = params.HotelImages[0].Imagepath;
                    var res = str.replace(
                      "https://cdn.grnconnect.com/",
                      "https://images.grnconnect.com/"
                    );
                    return (
                      <View key={item.RoomIndex}>
                        <View style={{ marginVertical: 20, flexDirection: "row" }}>
                          <Image
                            style={{
                              width: width / 4,
                              height: width / 5,
                              borderRadius: 5
                            }}
                            source={{ uri: res || "https://via.placeholder.com/150" }}
                          />

                          <View
                            style={{
                              marginHorizontal: 10,
                              flex: 1
                            }}>
                            <TouchableOpacity
                              style={{ paddingEnd: 4 }}
                              onPress={this._radioButton(item)}>
                              <View style={{ flexDirection: "row" }}>
                                <TouchableOpacity
                                  style={{
                                    height: 18,
                                    width: 18,
                                    borderRadius: 12,
                                    borderWidth: 2,
                                    borderColor: "#000",
                                    alignItems: "center",
                                    justifyContent: "center"
                                  }}
                                  onPress={this._radioButton(item)}>
                                  {_selectRadio === item.RoomIndex && (
                                    <View
                                      style={{
                                        height: 10,
                                        width: 10,
                                        borderRadius: 6,
                                        backgroundColor: "#000"
                                      }}
                                    />
                                  )}
                                </TouchableOpacity>
                                <Text style={{ fontSize: 16, marginStart: 5 }}>
                                  {item.RoomType}
                                </Text>
                              </View>
                            </TouchableOpacity>

                            <Text
                              style={{
                                fontSize: 18,
                                fontWeight: "700"
                              }}>
                              ₹ {item.RoomTotal}
                            </Text>
                          </View>
                        </View>

                        <View style={{ marginBottom: 10 }}>
                          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Text style={{ color: "#717A81" }}>
                              {params.room}:Room(s),{params.Night}:night
                            </Text>
                            <Text style={{ color: "#717A81" }}>
                              {item.RefundRule ? item.RefundRule : ""}
                            </Text>
                          </View>
                          <Text style={{ fontSize: 16 }}>Room Cancellation Policy</Text>
                          <Text style={{ color: "#717A81" }}>
                            {item.RoomCancellationPolicy != ""
                              ? item.RoomCancellationPolicy
                              : "No room Descriptions"}
                          </Text>
                          <Text style={{ fontSize: 16 }}>Inclusions</Text>
                          <Text style={{ color: "#717A81" }}>
                            {item.Inclusions != "" ? item.Inclusions : "No room Inclusions"}
                          </Text>
                        </View>

                        <View style={{ height: 1.35, backgroundColor: "#DDDDDD" }}></View>
                      </View>
                    );
                  })}

                  <View style={{ marginTop: 20 }}>
                    <Text style={{ fontWeight: "700", fontSize: 18 }}>Description</Text>
                    <View>
                      <Text style={{ flex: 3, fontSize: 16, marginTop: 20 }}>
                        Property Location
                      </Text>
                      <HTML
                        baseFontStyle={{ color: "#717A81", fontFamily: "Poppins-Regular" }}
                        html={params.Description}
                      />
                    </View>
                    {params.RoomChain != null && (
                      <View style={{ marginTop: 10 }}>
                        <Text style={{ flex: 3, fontSize: 16 }}>Room</Text>
                        <Text style={{ color: "#717A81", flex: 4 }}>{params.RoomChain}</Text>
                      </View>
                    )}
                    {params.Facilities != null && (
                      <View style={{ marginTop: 10 }}>
                        <Text style={{ flex: 3, fontSize: 16 }}>Facilities</Text>
                        <Text style={{ color: "#717A81", flex: 4 }}>{params.Facilities}</Text>
                      </View>
                    )}
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
                    onPress={this._Next}>
                    <Text style={{ color: "#fff" }}>Next</Text>
                  </Button>
                </ScrollView>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  myStarStyle: {
    color: "#F68E1F",
    textShadowRadius: 2
  },
  myEmptyStarStyle: {
    color: "#F68E1F"
  }
});

export default HotelCheckout;
