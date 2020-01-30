import React, { PureComponent } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  SafeAreaView,
  Linking,
  Modal,
  Platform,
  StatusBar
} from "react-native";
import {
  Button,
  Text,
  ActivityIndicator,
  Icon,
  LinearGradient,
  CurrencyText
} from "../../components";
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";
import Stars from "react-native-stars";
import { etravosApi } from "../../service";
//import MapView from "react-native-maps";
import moment from "moment";
import HTML from "react-native-render-html";
import { Component } from "react";
import Toast from "react-native-simple-toast";
import ImageFull from "./ImageFull";
import NumberFormat from "react-number-format";

class HotelCheckout extends React.Component {
  constructor(props) {
    super(props);
    const { params } = props.navigation.state;
    console.log(params);
    this.state = {
      _selectRadio: "1",
      imageShow: false,
      selectedRoom: params.RoomDetails[0],
      policy: false,
      data: "",
      loader: false,
      items: [
        { uri: "https://demo66.tutiixx.com/wp-content/uploads/2019/10/resort.jpg" },
        { uri: "https://demo66.tutiixx.com/wp-content/uploads/2019/10/resort.jpg" },
        { uri: "https://demo66.tutiixx.com/wp-content/uploads/2019/10/resort.jpg" },
        { uri: "https://demo66.tutiixx.com/wp-content/uploads/2019/10/resort.jpg" }
      ]
    };
    this.SingleHotelData();
  }

  componentDidMount() {
    console.log("kamal");
    const { params } = this.props.navigation.state;
    let param = {
      hotelId: params.HotelId,
      webService: params.WebService,
      cityId: params.cityid,
      provider: params.Provider,
      adults: params.adultDetail,
      children: params.childDetail,
      arrivalDate: params.checkInDate,
      departureDate: params.checkOutDate,
      noOfDays: params.Night,
      childrenAges: params.childAge,
      roomscount: params.room,
      userType: 5,
      hotelType: params.hoteltype,
      user: ""
    };

    console.log(param);
    console.log(JSON.stringify(param));

    this.setState({ loader: true });
    etravosApi
      .get("/Hotels/HotelDetails", param)
      .then(({ data }) => {
        this.setState({ loader: false });
        console.log(JSON.stringify(data));
        const { params } = this.props.navigation.state;

        //let merged = mergeWith({}, params, data, (a, b) => (b === null ? a : undefined));
        if (data.HotelId == null) {
          this.props.navigation.goBack(null);
          Toast.show("Room is not available", Toast.LONG);
        } else {
          this.props.navigation.setParams({ ...params, ...data });
          this.setState({ selectedRoom: data.RoomDetails[0] });
        }
        //console.log(merged);
      })
      .catch(error => {
        console.log(error);
      });
  }

  _radioButton = item => () => {
    this.setState({
      _selectRadio: item.RoomIndex,
      selectedRoom: item
    });
  };

  modalBackPress = () => {
    this.setState({ policy: false });
  };

  modalClose = () => {
    this.setState({ imageShow: false });
  };

  showImage = () => {
    this.setState({ imageShow: true });
  };

  SingleHotelData() {
    console.log("hey");
  }

  _viewLocation = (lat, lng, lbl) => () => {
    const scheme = Platform.select({ ios: "maps:0,0?q=", android: "geo:0,0?q=" });
    const latLng = `${lat},${lng}`;
    const label = lbl;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });
    Linking.openURL(url);
  };

  _Next = () => {
    const params = { ...this.props.navigation.state.params, selectedRoom: this.state.selectedRoom };

    this.props.navigation.navigate("HotelPayment", params);
  };

  _keyExtractor = (item, index) => "key" + index;

  renderItem = ({ item, index }) => <Image style={styles.image} source={{ uri: item.uri }} />;

  render() {
    const { params } = this.props.navigation.state;

    let str = params.HotelImages[0].Imagepath.replace(
      "https://cdn.grnconnect.com/",
      "https://images.grnconnect.com/"
    );

    const Amenities =
      params.Facilities && params.Facilities != null
        ? params.Facilities.split(",").map(s => s.trim())
        : [];
    console.log(Amenities);

    let checkInDate = moment(params.checkInDate, "DD-MM-YYYY").format("DD MMM");
    let checkOutDate = moment(params.checkOutDate, "DD-MM-YYYY").format("DD MMM");
    return (
      <>
        <StatusBar backgroundColor="#000000" barStyle={"light-content"} />
        <SafeAreaView style={{ flex: 0, backgroundColor: "#000000" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <View style={{ flex: 1, flexDirection: "column" }}>
            <LinearGradient colors={["#53b2fe", "#065af3"]} style={{}}>
              <View style={{ paddingBottom: 30 }}>
                <View
                  style={{
                    height: 56,
                    //  backgroundColor: "#5B89F9",
                    flexDirection: "row",
                    marginHorizontal: 16,
                    marginTop: 10
                  }}>
                  <Button onPress={() => this.props.navigation.goBack(null)}>
                    <Icon name="md-arrow-back" size={24} color="#fff" />
                  </Button>
                  <View
                    style={{
                      justifyContent: "space-between",
                      flexDirection: "row",
                      flex: 1
                    }}>
                    <View style={{ marginHorizontal: 20 }}>
                      <Text
                        style={{
                          fontWeight: "700",
                          fontSize: 16,
                          color: "#fff"
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
                    flexDirection: "row",
                    marginTop: 10,
                    alignItems: "flex-start"
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      flex: 1,
                      color: "#ffffff",
                      fontWeight: "700"
                    }}>
                    {params.HotelName}
                  </Text>
                  <View style={{ marginStart: 5, marginTop: 8 }}>
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

                <Text style={{ color: "#ffffff", marginHorizontal: 16 }}>
                  {params.HotelAddress}
                </Text>
              </View>
            </LinearGradient>
            <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
              <ScrollView
                contentContainerStyle={{ backgroundColor: "#ffffff", marginHorizontal: 16 }}
                showsVerticalScrollIndicator={false}>
                <View style={{ flexDirection: "row", marginTop: 16, width: "100%" }}>
                  <Button style={{ flex: 1 }} onPress={this.showImage}>
                    <Image
                      style={{
                        height: 260,
                        borderRadius: 5
                      }}
                      source={{
                        uri:
                          params.HotelImages[0] && params.HotelImages[0].Imagepath != ""
                            ? str
                            : "https://demo66.tutiixx.com/wp-content/uploads/2019/10/resort.jpg"
                      }}
                    />
                  </Button>
                  <View style={{ marginStart: 10 }}>
                    <Button onPress={this.showImage}>
                      <Image
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: 5
                        }}
                        source={{
                          uri: params.HotelImages[1]
                            ? params.HotelImages[1].Imagepath
                            : "https://demo66.tutiixx.com/wp-content/uploads/2019/10/resort.jpg"
                        }}
                      />
                    </Button>
                    <Button onPress={this.showImage}>
                      <Image
                        style={{
                          width: 80,
                          height: 80,
                          marginTop: 10,
                          borderRadius: 5
                        }}
                        source={{
                          uri:
                            params.HotelImages[2] != null
                              ? params.HotelImages[2].Imagepath
                              : "https://demo66.tutiixx.com/wp-content/uploads/2019/10/resort.jpg"
                        }}
                      />
                    </Button>
                    <Button
                      style={{ alignItems: "center", justifyContent: "center" }}
                      onPress={this.showImage}>
                      <Image
                        style={{
                          width: 80,
                          height: 80,
                          marginTop: 10,
                          borderRadius: 5
                        }}
                        source={{
                          uri:
                            params.HotelImages[3] != null
                              ? params.HotelImages[3].Imagepath
                              : "https://demo66.tutiixx.com/wp-content/uploads/2019/10/resort.jpg"
                        }}
                      />
                      <Text
                        style={{
                          position: "absolute",
                          fontWeight: "700",
                          fontSize: 16,
                          color: "#fff",
                          backgroundColor: "#00000080"
                        }}>
                        {params.HotelImages.length + "+"}
                      </Text>
                    </Button>
                  </View>
                </View>
                <View style={{ flexDirection: "row", marginTop: 16 }}>
                  <Text style={{ fontSize: 14 }}> {params.city}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center", marginStart: 5 }}>
                    <TouchableOpacity
                      style={{ color: "#717A81" }}
                      onPress={this._viewLocation(
                        params.Latitude,
                        params.Longitude,
                        params.HotelName
                      )}>
                      <Text style={{ color: "#5B89F9", fontSize: 14 }}>View on Map</Text>
                    </TouchableOpacity>
                    <Icon
                      name="location-pin"
                      type="SimpleLineIcons"
                      size={16}
                      style={{ marginStart: 5 }}
                      color="#5B89F9"
                    />
                  </View>
                </View>
                <Text style={{ fontSize: 18, flex: 1, marginTop: 10 }}>Book your Hotel</Text>

                {params.RoomDetails.map(item => {
                  const { params } = this.props.navigation.state;
                  const { _selectRadio } = this.state;
                  var str = item.Images;
                  if (str) {
                    str = str.replace(
                      "https://cdn.grnconnect.com/",
                      "https://images.grnconnect.com/"
                    );
                  }
                  return (
                    <View key={item.RoomIndex}>
                      <View style={{ marginVertical: 20, flexDirection: "row" }}>
                        <Image
                          style={{
                            width: 80,
                            height: 80,
                            borderRadius: 5
                          }}
                          source={{
                            uri:
                              str ||
                              "https://demo66.tutiixx.com/wp-content/uploads/2019/10/resort.jpg"
                          }}
                        />

                        <View
                          style={{
                            marginHorizontal: 10,
                            flex: 1
                          }}>
                          <TouchableOpacity
                            style={{ paddingEnd: 4 }}
                            onPress={this._radioButton(item)}>
                            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
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
                              <Text style={{ fontSize: 16, marginStart: 5, marginTop: -2 }}>
                                {item.RoomType}
                              </Text>
                            </View>
                          </TouchableOpacity>

                          <Text
                            style={{
                              fontSize: 18,
                              fontWeight: "700"
                            }}>
                            <CurrencyText style={{ fontWeight: "700", fontSize: 18 }}>
                              ₹
                            </CurrencyText>
                            <NumberFormat
                              value={item.RoomTotal.toFixed(2)}
                              displayType={"text"}
                              thousandSeparator={true}
                              thousandsGroupStyle="lakh"
                              renderText={value => (
                                <Text style={{ fontWeight: "700", fontSize: 18 }}>{value}</Text>
                              )}
                            />
                          </Text>
                        </View>
                      </View>

                      <View style={{ marginBottom: 10 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                          <Text style={{ color: "#717A81" }}>
                            {params.room}:Room(s), {params.Night}:night
                          </Text>
                          <Text style={{ color: "#717A81" }}>
                            {item.RefundRule != null && item.RefundRule == "Refundable Fare"
                              ? "Refundable"
                              : "Non Refundable"}
                          </Text>
                        </View>

                        {item.RoomCancellationPolicy !== "" && item.RoomCancellationPolicy != null && (
                          <Button
                            onPress={() =>
                              this.setState({ policy: true, data: item.RoomCancellationPolicy })
                            }>
                            <Text style={{ fontSize: 16, color: "#5B89F9" }}>
                              Room Cancellation Policy
                            </Text>
                          </Button>
                        )}
                        {item.Inclusions != null && item.Inclusions != "" && (
                          <View>
                            <Text style={{ fontSize: 16 }}>Inclusions</Text>
                            <Text style={{ color: "#717A81" }}>{item.Inclusions}</Text>
                          </View>
                        )}
                      </View>

                      <View style={{ height: 1.35, backgroundColor: "#DDDDDD" }}></View>
                    </View>
                  );
                })}

                <View style={{ marginTop: 20 }}>
                  <Text style={{ fontWeight: "500", fontSize: 18 }}>Description</Text>
                  <View>
                    <Text style={{ flex: 3, fontSize: 16, marginTop: 20 }}>Property Location</Text>
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
                      <Text style={{ color: "#717A81" }}>{Amenities.join(", ")}</Text>
                    </View>
                  )}
                </View>

                <Button
                  style={{
                    backgroundColor: "#F68E1D",
                    marginHorizontal: 80,
                    alignItems: "center",
                    justifyContent: "center",
                    height: 36,
                    marginVertical: 20,
                    borderRadius: 20
                  }}
                  onPress={this._Next}>
                  <Text style={{ color: "#fff" }}>Next</Text>
                </Button>
              </ScrollView>
            </View>
            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.policy}
              onRequestClose={this.modalBackPress}>
              <Cancellation data={this.state.data} onBackPress={this.modalBackPress} />
            </Modal>
            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.imageShow}
              onRequestClose={this.modalClose}>
              <ImageFull params={params} onBackPress={this.modalClose} />
            </Modal>
            {this.state.loader && <ActivityIndicator />}
          </View>
        </SafeAreaView>
      </>
    );
  }
}

class Cancellation extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props.data);
    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "#E5EBF7" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <View>
            <View style={styles.headerContainer}>
              <Button onPress={this.props.onBackPress} style={{ padding: 16 }}>
                <Icon name="md-arrow-back" size={24} />
              </Button>
              <Text style={{ fontWeight: "700", fontSize: 16 }}>Cancellation Policy</Text>
            </View>
            <Text style={{ marginHorizontal: 16, marginTop: 16 }}>
              {this.props.data != "" ? this.props.data : ""}
            </Text>
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
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    backgroundColor: "#E5EBF7"
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 10
  }
});

export default HotelCheckout;
