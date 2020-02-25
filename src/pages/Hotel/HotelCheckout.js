import React, { PureComponent } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
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
import moment from "moment";
import HTML from "react-native-render-html";
import { Component } from "react";
import Toast from "react-native-simple-toast";
import ImageFull from "./ImageFull";
import NumberFormat from "react-number-format";
import analytics from "@react-native-firebase/analytics";
import ReadMore from "react-native-read-more-text";

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
      ],
      index: 0
    };
    this.SingleHotelData();
  }

  trackScreenView = async screen => {
    // Set & override the MainActivity screen name
    await analytics().setCurrentScreen(screen, screen);
  };

  componentDidMount() {
    this.trackScreenView("Hotel Single Page");
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
        console.log(data);
        const { params } = this.props.navigation.state;
        //let merged = mergeWith({}, params, data, (a, b) => (b === null ? a : undefined));
        if (data.HotelId == null) {
          this.props.navigation.goBack(null);
          Toast.show("Room is not available", Toast.LONG);
        } else {
          this.props.navigation.setParams({ ...params, ...data });
          this.setState({ selectedRoom: data.RoomDetails[0] });
        }
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

  showImage = index => () => {
    console.log(index);
    this.setState({ imageShow: true, index: index });
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

  _renderTruncatedFooter = handlePress => {
    return (
      <Text style={{ color: "#5191FA", marginTop: 5 }} onPress={handlePress}>
        Show more
      </Text>
    );
  };

  _renderRevealedFooter = handlePress => {
    return (
      <Text style={{ color: "#5191FA", marginTop: 5 }} onPress={handlePress}>
        Show less
      </Text>
    );
  };

  render() {
    const { params } = this.props.navigation.state;

    let str =
      params.HotelImages.length == 1
        ? params.HotelImages[0].Imagepath.replace(
            "https://cdn.grnconnect.com/",
            "https://images.grnconnect.com/"
          )
        : params.HotelImages[1].Imagepath.replace(
            "https://cdn.grnconnect.com/",
            "https://images.grnconnect.com/"
          );

    const Amenities =
      params.Facilities && params.Facilities != null
        ? params.Facilities.split(",").map(s => s.trim())
        : [];

    const Description = params.Description.replace(/(<([^>]+)>)/gi, "");

    let checkInDate = moment(params.checkInDate, "DD-MM-YYYY").format("DD MMM");
    let checkOutDate = moment(params.checkOutDate, "DD-MM-YYYY").format("DD MMM");
    return (
      <>
        <StatusBar backgroundColor="#000000" barStyle={"light-content"} />
        <SafeAreaView style={{ flex: 0, backgroundColor: "#000000" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <View style={{ flex: 1, flexDirection: "column" }}>
            <LinearGradient colors={["#53b2fe", "#065af3"]} style={{}}>
              <View style={{ paddingBottom: 20 }}>
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
                  <View style={{ marginStart: 5 }}>
                    <Stars
                      default={parseInt(params.StarRating)}
                      count={parseInt(params.StarRating)}
                      half={true}
                      starSize={50}
                      fullStar={
                        <IconMaterial name={"star"} style={[styles.myStarStyle]} size={18} />
                      }
                      emptyStar={
                        <IconMaterial
                          size={18}
                          name={"star-outline"}
                          style={[styles.myStarStyle, styles.myEmptyStarStyle]}
                        />
                      }
                      halfStar={
                        <IconMaterial size={18} name={"star-half"} style={[styles.myStarStyle]} />
                      }
                    />
                  </View>
                </View>

                <Text style={{ color: "#ffffff", marginHorizontal: 16 }}>
                  {params.HotelAddress}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", marginHorizontal: 16 }}>
                  <Text
                    style={{ color: "#F68E1F", fontWeight: "600" }}
                    onPress={this._viewLocation(
                      params.Latitude,
                      params.Longitude,
                      params.HotelName
                    )}>
                    View on Map
                  </Text>
                  <Icon
                    name="location-pin"
                    type="Entypo"
                    size={20}
                    style={{ marginStart: 5 }}
                    color="#F68E1F"
                  />
                </View>
              </View>
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <ScrollView
                contentContainerStyle={{ marginHorizontal: 16 }}
                showsVerticalScrollIndicator={false}>
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 16,
                    width: "100%"
                  }}>
                  <Button
                    style={{ flex: 1 }}
                    onPress={
                      params.HotelImages && params.HotelImages.length == 1
                        ? this.showImage(0)
                        : this.showImage(1)
                    }>
                    <Image
                      style={{
                        height: 260,
                        borderRadius: 5
                      }}
                      source={{
                        uri:
                          params.HotelImages &&
                          params.HotelImages.length == 1 &&
                          params.HotelImages[0] &&
                          params.HotelImages[0] != null
                            ? str
                            : params.HotelImages &&
                              params.HotelImages.length > 1 &&
                              params.HotelImages[1] &&
                              params.HotelImages[1] != null
                            ? str
                            : "https://demo66.tutiixx.com/wp-content/uploads/2019/10/resort.jpg"
                      }}
                    />
                  </Button>
                  <View style={{ marginStart: 10 }}>
                    <Button onPress={this.showImage(2)}>
                      <Image
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: 5
                        }}
                        source={{
                          uri:
                            params.HotelImages &&
                            params.HotelImages.length > 1 &&
                            params.HotelImages[2] &&
                            params.HotelImages[2] != null
                              ? params.HotelImages[2].Imagepath
                              : "https://demo66.tutiixx.com/wp-content/uploads/2019/10/resort.jpg"
                        }}
                      />
                    </Button>
                    <Button onPress={this.showImage(3)}>
                      <Image
                        style={{
                          width: 80,
                          height: 80,
                          marginTop: 10,
                          borderRadius: 5
                        }}
                        source={{
                          uri:
                            params.HotelImages &&
                            params.HotelImages.length > 1 &&
                            params.HotelImages[3] &&
                            params.HotelImages[3] != null
                              ? params.HotelImages[3].Imagepath
                              : "https://demo66.tutiixx.com/wp-content/uploads/2019/10/resort.jpg"
                        }}
                      />
                    </Button>
                    <Button
                      style={{ alignItems: "center", justifyContent: "center" }}
                      onPress={this.showImage(4)}>
                      <Image
                        style={{
                          width: 80,
                          height: 80,
                          marginTop: 10,
                          borderRadius: 5
                        }}
                        source={{
                          uri:
                            params.HotelImages &&
                            params.HotelImages.length > 1 &&
                            params.HotelImages[4] &&
                            params.HotelImages[4] != null
                              ? params.HotelImages[4].Imagepath
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
                    <>
                      <TouchableOpacity
                        key={item.RoomIndex}
                        style={{
                          backgroundColor: "#FFF",
                          elevation: 2,
                          padding: 10,
                          borderRadius: 5,
                          marginHorizontal: 1,
                          marginVertical: 20,
                          flexDirection: "row"
                        }}
                        onPress={this._radioButton(item)}>
                        <TouchableOpacity
                          style={{
                            height: 18,
                            width: 18,
                            borderRadius: 12,
                            borderWidth: 1,
                            marginEnd: 8,
                            marginTop: 3,
                            borderColor: "#A0A9B2",
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
                                backgroundColor: "#5191FA"
                              }}
                            />
                          )}
                        </TouchableOpacity>
                        <View style={{ flex: 1 }}>
                          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Text style={{ fontSize: 16, flex: 1 }}>{item.RoomType}</Text>
                            <Text
                              style={{
                                fontSize: 18,
                                fontWeight: "700"
                              }}>
                              <CurrencyText style={{ fontWeight: "700", fontSize: 16 }}>
                                ₹
                              </CurrencyText>
                              <NumberFormat
                                decimalScale={0}
                                fixedDecimalScale
                                value={item.RoomTotal}
                                displayType={"text"}
                                thousandSeparator={true}
                                thousandsGroupStyle="lakh"
                                renderText={value => (
                                  <Text style={{ fontWeight: "700", fontSize: 18 }}>{value}</Text>
                                )}
                              />
                            </Text>
                          </View>

                          <Text style={{ color: "#717A81" }}>
                            {params.room}: Room, {params.Night}: Night
                          </Text>
                          {/* </View> */}

                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              flex: 1,
                              justifyContent: "space-between"
                            }}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                              <Icon
                                type="MaterialIcons"
                                size={16}
                                name="check-circle"
                                color={
                                  item.RefundRule != null && item.RefundRule ? "#27ae60" : "#F44336"
                                }
                              />
                              <Text
                                style={{
                                  color:
                                    item.RefundRule != null && item.RefundRule
                                      ? "#27ae60"
                                      : "#F44336",
                                  fontSize: 12
                                }}>
                                {item.RefundRule != null && item.RefundRule == "Refundable Fare"
                                  ? " Refundable"
                                  : " Non Refundable"}
                              </Text>
                            </View>
                          </View>
                          <View>
                            {item.Inclusions != null && item.Inclusions != "" && (
                              <>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                  <Icon type="MaterialIcons" size={16} name="check" />
                                  <Text style={{ fontWeight: "500", fontSize: 12 }}>Includes</Text>
                                </View>
                                <ReadMore
                                  numberOfLines={1}
                                  renderTruncatedFooter={this._renderTruncatedFooter}
                                  renderRevealedFooter={this._renderRevealedFooter}>
                                  <Text style={{ color: "#717A81", fontSize: 12 }}>
                                    {item.Inclusions}
                                  </Text>
                                </ReadMore>
                              </>
                            )}
                          </View>
                        </View>
                      </TouchableOpacity>
                      <View style={{ height: 1.35, backgroundColor: "#DDDDDD" }} />
                    </>
                  );
                })}

                <View style={{ marginTop: 20 }}>
                  <Text style={{ fontWeight: "500", fontSize: 18, marginBottom: 16 }}>
                    Hotel Information
                  </Text>

                  <ReadMore
                    numberOfLines={3}
                    renderTruncatedFooter={this._renderTruncatedFooter}
                    renderRevealedFooter={this._renderRevealedFooter}>
                    <Text numberOfLines={3} style={{ color: "#717A81" }}>
                      {Description}
                    </Text>
                  </ReadMore>

                  {params.Facilities != null && (
                    <View style={{ marginTop: 16 }}>
                      <Text style={{ fontWeight: "500", fontSize: 18, marginBottom: 16 }}>
                        Hotel Facilities
                      </Text>
                      <FlatList
                        data={Amenities}
                        keyExtractor={item => item}
                        numColumns={2}
                        renderItem={({ item }) => (
                          <Text style={{ color: "#717A81", flex: 1, marginVertical: 4 }}>
                            &bull; {item}
                          </Text>
                        )}
                      />
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
              <ImageFull params={params} index={this.state.index} onBackPress={this.modalClose} />
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
