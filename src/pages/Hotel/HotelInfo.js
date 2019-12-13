import React from "react";
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  Modal,
  TextInput,
  Dimensions,
  SafeAreaView,
  TouchableOpacity
} from "react-native";
import { Button, Text, ActivityIndicator, Icon } from "../../components";
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";
import Stars from "react-native-stars";
import { orderBy } from "lodash";
import { etravosApi } from "../../service";
import moment from "moment";
import Toast from "react-native-simple-toast";
import Filter from "./Filter";

class HotelInfo extends React.PureComponent {
  constructor(props) {
    super(props);
    const { params } = props.navigation.state;
    //console.log(params);
    this.state = {
      loader: true,
      city: params.city,
      Night: params.NoOfDays,
      checkIn: moment(params.arrivalDate, "DD-MM-YYYY").format("DD MMM"),
      checkOut: moment(params.departureDate, "DD-MM-YYYY").format("DD MMM"),
      room: params.room,
      adultDetail: params.adults,
      childDetail: params.children,
      childAge: params.childrenAges,
      cityid: params.destinationId,
      adult: params.adults_count,
      children: params.children_count,
      hoteltype: params.hoteltype,
      infant: 0,
      checkInDate: params.arrivalDate,
      checkOutDate: params.departureDate,
      hotels: [],
      filteredHotels: [],
      filterModalVisible: false,
      filterValues: {
        price: [],
        rating: [],
        amenities: [],
        sortBy: "Price low to high"
      }
    };
  }

  componentDidMount() {
    const { params } = this.props.navigation.state;

    etravosApi
      .get("/Hotels/AvailableHotels", params)
      .then(({ data, status }) => {
        if (status != 200) {
          this.props.navigation.goBack(null);
          Toast.show("No Data Found.", Toast.SHORT);
        }
        this.setState({
          hotels: data.AvailableHotels,
          filteredHotels: data.AvailableHotels,
          loader: false
        });
      })
      .catch(error => {
        Toast.show(error.toString(), Toast.LONG);
        console.log(error);
      });
  }

  onHotelChange = text => {
    if (text == "") {
      var filteredHotels = [...this.state.hotels];
    } else {
      var filteredHotels = this.state.hotels.filter(item =>
        item.HotelName.toLowerCase().includes(text.toLowerCase())
      );
    }
    this.setState({ filteredHotels });
  };
  openFilter = () => {
    this.setState({ filterModalVisible: true });
  };
  closeFilter = () => {
    this.setState({ filterModalVisible: false });
  };
  onChangeFilter = filterValues => {
    this.setState({ filterValues });
  };
  filter = () => {
    const { filterValues, hotels } = this.state;
    let filteredHotels = hotels.filter(
      item =>
        (filterValues.rating.length == 0 || filterValues.rating.includes(item.StarRating)) &&
        (filterValues.amenities.length == 0 ||
          filterValues.amenities.some(value => item.Facilities.includes(value))) &&
        (filterValues.price.length == 0 ||
          (item.RoomDetails.some(value => filterValues.price[0] <= value.RoomTotal) &&
            item.RoomDetails.some(value => filterValues.price[1] >= value.RoomTotal)))
    );
    switch (filterValues.sortBy) {
      case "Price low to high":
        filteredHotels = orderBy(filteredHotels, "RoomDetails[0].RoomTotal", "asc");
        break;
      case "Price high to low":
        filteredHotels = orderBy(filteredHotels, "RoomDetails[0].RoomTotal", "desc");
        break;
      case "Hotel Name Asc":
        filteredHotels = orderBy(filteredHotels, "HotelName", "asc");
        break;
      case "Hotel Name Desc":
        filteredHotels = orderBy(filteredHotels, "HotelName", "desc");
        break;
      case "Rating Asc":
        filteredHotels = orderBy(filteredHotels, "Rating", "asc");
        break;
      case "Rating Desc":
        filteredHotels = orderBy(filteredHotels, "Rating", "desc");
        break;
    }
    this.setState({
      filteredHotels,
      filterModalVisible: false
    });
  };

  _BookNow(param) {
    // let jd = moment(data.journeyDate, "DD-MM-YYYY").format("DD MMM");
    Object.assign(param, {
      city: this.state.city,
      Night: this.state.Night,
      room: this.state.room,
      adult: this.state.adult,
      child: this.state.children,
      infant: this.state.infant,
      hoteltype: this.state.hoteltype,
      adultDetail: this.state.adultDetail,
      childDetail: this.state.childDetail,
      cityid: this.state.cityid,
      childAge: this.state.childAge,
      checkInDate: this.state.checkInDate,
      checkOutDate: this.state.checkOutDate
    });
    this.props.navigation.navigate("HotelCheckout", param);
  }

  _renderItemList = ({ item, index }) => {
    const { width, height } = Dimensions.get("window");
    var str = item.HotelImages[0].Imagepath;
    var res = str.replace("https://cdn.grnconnect.com/", "https://images.grnconnect.com/");
    return (
      <TouchableOpacity
        style={{
          padding: index % 2 == 0 ? 10 : 26,
          marginTop: 16,
          marginHorizontal: index % 2 == 0 ? 16 : null,
          flexDirection: "row",
          elevation: index % 2 == 0 ? 1 : null,
          borderRadius: index % 2 == 0 ? 5 : null,
          backgroundColor: index % 2 == 0 ? null : "#E9ECF3"
        }}
        onPress={() => this._BookNow(item, index)}>
        <Image
          style={{ width: width / 4, height: height / 6, borderRadius: 5 }}
          resizeMode="cover"
          source={{ uri: res || "https://via.placeholder.com/150" }}
        />
        <View
          style={{
            paddingStart: 5,
            flex: 1,
            backgroundColor: index % 2 == 0 ? "#ffffff" : "#E9ECF3"
          }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", flex: 1 }}>
            <Text style={{ fontSize: 16, flex: 1 }}>{item.HotelName}</Text>
            <View style={{ marginStart: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: "700" }}>
                ${item.RoomDetails[0].RoomTotal}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  resizeMode="contain"
                  style={{ width: 30 }}
                  source={require("../../assets/imgs/logo.png")}
                />
                <Text style={{ color: "green" }}>{item.StarRating}/5</Text>
                <Text>(2732)</Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row"
            }}>
            <Text style={{ color: "#636C73", marginEnd: 10 }}>{this.state.city}</Text>
            <Stars
              default={parseInt(item.StarRating)}
              count={5}
              half={true}
              starSize={50}
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
          <View style={{ flexDirection: "row", justifyContent: "space-between", flex: 1 }}>
            <View style={{ flexDirection: "row", flex: 2 }}>
              <Image source={require("../../assets/imgs/location.png")} />
              <Text style={{ color: "#636C73", fontSize: 12, marginStart: 5 }}>
                {item.HotelAddress}
              </Text>
            </View>
            <Text style={{ color: "#636C73", flex: 1, paddingStart: 5, marginStart: 10 }}>
              {this.state.room}:Room(s),{this.state.Night}:Night
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
            <View style={{ flexDirection: "row" }}>
              <Image
                source={require("../../assets/imgs/washing-machine.png")}
                style={{ width: 30 }}
                resizeMode="contain"
              />
              <Image
                source={require("../../assets/imgs/wifi.png")}
                style={{ width: 30 }}
                resizeMode="contain"
              />
              <Image
                source={require("../../assets/imgs/cafet-area.png")}
                style={{ width: 30 }}
                resizeMode="contain"
              />
            </View>
            <Button
              style={{
                backgroundColor: "#F68E1F",
                borderRadius: 15,
                paddingVertical: 5,
                alignItems: "center",
                justifyContent: "center",
                height: 30,
                paddingHorizontal: 12
              }}
              onPress={() => this._BookNow(item, index)}>
              <Text style={{ color: "#fff" }}>Book Now</Text>
            </Button>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  _keyExtractoritems = (item, index) => "key" + index;

  render() {
    //console.log(this.state);
    const {
      city,
      checkIn,
      checkOut,
      loader,
      hotelName,
      hotels,
      filteredHotels,
      filterModalVisible
    } = this.state;
    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "#E5EBF7" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "#E5EBF7"
              }}>
              <Button onPress={() => this.props.navigation.goBack(null)} style={{ padding: 16 }}>
                <Icon name="md-arrow-back" size={24} />
              </Button>
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                  flex: 1,
                  paddingTop: 16,
                  paddingBottom: 16
                }}>
                <View>
                  <Text style={{ fontWeight: "700", fontSize: 16, marginHorizontal: 5 }}>
                    {city}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "flex-start"
                    }}>
                    <IconMaterial name="calendar-month" size={18} color="#717984" />
                    <Text style={{ fontSize: 12, marginHorizontal: 5, color: "#717984" }}>
                      {checkIn} - {checkOut}
                    </Text>
                  </View>
                </View>
              </View>
              <Button
                style={{
                  flexDirection: "row",
                  marginStart: "auto",
                  paddingEnd: 8,
                  paddingVertical: 16
                }}
                onPress={this.openFilter}>
                <Icon name="filter" size={20} color="#5D89F4" type="MaterialCommunityIcons" />
                <Text style={{ fontSize: 12, marginHorizontal: 5, color: "#717984" }}>
                  Sort & Filter
                </Text>
              </Button>
            </View>
            <View style={{ height: 40, width: "100%" }}>
              <View style={{ flex: 2, backgroundColor: "#E5EBF7" }}></View>
              <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}></View>
              <View
                style={{
                  marginHorizontal: 30,
                  borderRadius: 3,
                  borderColor: "#d2d2d2d2",
                  borderWidth: 1,
                  justifyContent: "space-between",
                  backgroundColor: "#FFFFFF",
                  flexDirection: "row",
                  ...StyleSheet.absoluteFill
                }}>
                <TextInput
                  placeholder="Hotel Name"
                  style={{ marginStart: 20, color: "#61666A" }}
                  value={hotelName}
                  onChangeText={this.onHotelChange}
                />
                <Button
                  style={{
                    backgroundColor: "#5B89F9",
                    justifyContent: "center",
                    borderBottomRightRadius: 3,
                    borderTopRightRadius: 3
                  }}>
                  <Image
                    style={{
                      width: 20,
                      resizeMode: "contain",
                      alignSelf: "center",
                      marginHorizontal: 8
                    }}
                    source={require("../../assets/imgs/search.png")}
                  />
                </Button>
              </View>
            </View>

            <View style={{ flex: 5 }}>
              <FlatList
                data={filteredHotels}
                keyExtractor={this._keyExtractoritems}
                renderItem={this._renderItemList}
              />
              {filteredHotels && (
                <View style={{ flex: 5, alignItems: "center", justifyContent: "center" }}>
                  <Text>Data not found</Text>
                </View>
              )}
            </View>
            <Modal
              animationType="slide"
              transparent={false}
              visible={filterModalVisible}
              onRequestClose={this.closeFilter}>
              <Filter
                data={hotels}
                onBackPress={this.closeFilter}
                filterValues={this.state.filterValues}
                onChangeFilter={this.onChangeFilter}
                filter={this.filter}
              />
            </Modal>
            {loader && <ActivityIndicator />}
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
export default HotelInfo;
