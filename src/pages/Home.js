import React from "react";
import {
  View,
  Image,
  ImageBackground,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  FlatList,
  TouchableOpacity
} from "react-native";
import {
  HomeButtonComponent,
  Text,
  Button,
  Icon,
  LinearGradient,
  CurrencyText
} from "../../src/components";
import SwiperFlatList from "react-native-swiper-flatlist";
import analytics from "@react-native-firebase/analytics";
import axios from "axios";
import FastImage from "react-native-fast-image";
import Modal from "react-native-modal";
import moment from "moment";
import Offer from "./Offer";

const { width } = Dimensions.get("window");

const aspectHeight = (width, height, newWidth) => (height / width) * newWidth;

class Home extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      suggestions: [],
      isSelect: true,
      Images: [
        { img: require("../assets/imgs/offer.png") },
        { img: require("../assets/imgs/offer.png") },
        { img: require("../assets/imgs/offer.png") },
        { img: require("../assets/imgs/offer.png") }
      ],
      flights: [
        {
          source: "DEL",
          destination: "PNQ",
          sourceName: "NEW DELHI",
          destinationName: "Pune",
          journeyDate: "25-02-2020",
          returnDate: "",
          tripType: 1,
          flightType: 1,
          adults: 1,
          children: 0,
          infants: 0,
          travelClass: "E",
          className: "Economy",
          destinationAirportName: "Pune, India- (PNQ) - Lohegaon",
          sourceAirportName: "NEW DELHI, India- (DEL) - Indira Gandhi Intl"
        },
        {
          source: "DEL",
          destination: "PNQ",
          sourceName: "NEW DELHI",
          destinationName: "Pune",
          journeyDate: "25-02-2020",
          returnDate: "",
          tripType: 1,
          flightType: 1,
          adults: 1,
          children: 0,
          infants: 0,
          travelClass: "E",
          className: "Economy",
          destinationAirportName: "Pune, India- (PNQ) - Lohegaon",
          sourceAirportName: "NEW DELHI, India- (DEL) - Indira Gandhi Intl"
        },
        {
          source: "DEL",
          destination: "PNQ",
          sourceName: "NEW DELHI",
          destinationName: "Pune",
          journeyDate: "25-02-2020",
          returnDate: "",
          tripType: 1,
          flightType: 1,
          adults: 1,
          children: 0,
          infants: 0,
          travelClass: "E",
          className: "Economy",
          destinationAirportName: "Pune, India- (PNQ) - Lohegaon",
          sourceAirportName: "NEW DELHI, India- (DEL) - Indira Gandhi Intl"
        },
        {
          source: "DEL",
          destination: "PNQ",
          sourceName: "NEW DELHI",
          destinationName: "Pune",
          journeyDate: "25-02-2020",
          returnDate: "",
          tripType: 1,
          flightType: 1,
          adults: 1,
          children: 0,
          infants: 0,
          travelClass: "E",
          className: "Economy",
          destinationAirportName: "Pune, India- (PNQ) - Lohegaon",
          sourceAirportName: "NEW DELHI, India- (DEL) - Indira Gandhi Intl"
        },
        {
          source: "DEL",
          destination: "PNQ",
          sourceName: "NEW DELHI",
          destinationName: "Pune",
          journeyDate: "25-02-2020",
          returnDate: "",
          tripType: 1,
          flightType: 1,
          adults: 1,
          children: 0,
          infants: 0,
          travelClass: "E",
          className: "Economy",
          destinationAirportName: "Pune, India- (PNQ) - Lohegaon",
          sourceAirportName: "NEW DELHI, India- (DEL) - Indira Gandhi Intl"
        },
        {
          source: "DEL",
          destination: "PNQ",
          sourceName: "NEW DELHI",
          destinationName: "Pune",
          journeyDate: "25-02-2020",
          returnDate: "",
          tripType: 1,
          flightType: 1,
          adults: 1,
          children: 0,
          infants: 0,
          travelClass: "E",
          className: "Economy",
          destinationAirportName: "Pune, India- (PNQ) - Lohegaon",
          sourceAirportName: "NEW DELHI, India- (DEL) - Indira Gandhi Intl"
        }
      ],
      posts: [],
      index: 0,
      modalShow: false
    };
  }

  modalShow = index => () => {
    console.log(index);
    this.setState({ index: index, modalShow: true });
  };
  modalDismiss = () => {
    this.setState({ modalShow: false });
  };

  trackScreenView = async screen => {
    // Set & override the MainActivity screen name
    await analytics().setCurrentScreen(screen, screen);
  };
  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      axios
        .get("https://tripdesire.co/wp-json/wp/v2/posts")
        .then(({ data }) => {
          console.log(data);
          this.setState({ posts: data });
        })
        .catch(error => {
          console.log(error);
        });
    });

    this.trackScreenView("Home");
  }

  navigateToScreen = (page, params = {}) => () => {
    this.props.navigation.navigate(page, params);
  };

  blogShare = item => () => {
    this.props.navigation.navigate("Blog", { item });
  };

  renderItem = ({ item, index }) => {
    return (
      <Button
        style={[styles.blogView, { marginEnd: this.state.posts.length - 1 == index ? 12 : 2 }]}
        key={item.id}
        onPress={this.blogShare(item)}>
        <FastImage style={styles.blog} source={{ uri: item.featured_image_url }} />
        <Text style={styles.blogtext}>{item.title.rendered}</Text>
      </Button>
    );
  };

  _gotoFlightSearch = item => () => {
    this.props.navigation.navigate("FlightSearch", { item });
  };

  _renderItem = ({ item, index }) => {
    const date = moment(item.journeyDate, "DD-MM-YYYY");
    return (
      <Button
        style={[
          styles.flightView,
          {
            marginEnd: this.state.flights.length - 1 == index ? 12 : 2
          }
        ]}
        onPress={this._gotoFlightSearch(item)}>
        <FastImage
          resizeMode="contain"
          style={{ height: 60, width: 60, marginTop: 15 }}
          source={{
            uri: "http://tripdesire.co/wp-content/uploads/2020/02/6E-min.png"
          }}
        />
        <Text style={[styles.place, { marginTop: 10 }]}>{item.sourceName}</Text>
        <Text>To</Text>
        <Text style={styles.place}>{item.destinationName}</Text>
        <Text>{date.format("DD MMM,YY") + date.format("(dddd)")}</Text>
        <LinearGradient style={styles.BottomStripe} colors={["#53b2fe", "#065af3"]}>
          <Text style={{ fontSize: 16, fontWeight: "600", color: "#fff", lineHeight: 20 }}>
            Starting From:
          </Text>
          <CurrencyText style={[styles.heading, { color: "#fff", lineHeight: 20 }]}>
            ₹ 1400
          </CurrencyText>
        </LinearGradient>
      </Button>
    );
  };

  keyExtractor = (item, index) => "Sap" + index + item;

  _keyExtractor = (item, index) => "sap" + index + item;

  render() {
    const { posts, flights, index } = this.state;
    return (
      <>
        {/* <SafeAreaView style={{ flex: 0, backgroundColor: "transparent" }} /> */}
        {/* <SafeAreaView style={{ flex: 1, backgroundColor: "grey" }}> */}
        <ScrollView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
          <StatusBar backgroundColor="black" barStyle="light-content" />
          <View style={styles.containerStyle}>
            <View style={styles.sliderContainerStyle}>
              <ImageBackground
                // resizeMode="cover"
                style={styles.slider}
                source={require("../assets/imgs/Banner.jpg")}>
                <Text
                  style={{
                    fontSize: 26,
                    color: "#FFFFFF",
                    fontWeight: "700",
                    marginHorizontal: 20,
                    lineHeight: 32
                  }}>
                  Desire.Travel.Explore
                </Text>
              </ImageBackground>
            </View>
          </View>
          <View
            style={{
              marginTop: 30,
              flexDirection: "row",
              justifyContent: "space-between",
              marginHorizontal: 16
            }}>
            <HomeButtonComponent
              tintColor={"#5789FF"}
              name="Flights"
              img_name={require("../assets/imgs/flight.png")}
              onPress={this.navigateToScreen("FlightSearch")}
            />
            <HomeButtonComponent
              name="Hotels"
              tintColor={"#5789FF"}
              img_name={require("../assets/imgs/Hotel.png")}
              onPress={this.navigateToScreen("Hotel")}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginHorizontal: 16
            }}>
            <HomeButtonComponent
              name="Buses"
              tintColor={"#5789FF"}
              img_name={require("../assets/imgs/bus.png")}
              onPress={this.navigateToScreen("Bus")}
            />
            <HomeButtonComponent
              name="Cabs"
              tintColor={"#5789FF"}
              img_name={require("../assets/imgs/car.png")}
              onPress={this.navigateToScreen("Cab")}
            />
          </View>
          <SwiperFlatList
          // autoplay autoplayDelay={2} autoplayLoop index={0}
          >
            <TouchableOpacity onPress={this.modalShow("0")}>
              <FastImage style={styles.imgNew} source={require("../assets/imgs/flightOffer.jpg")} />
            </TouchableOpacity>

            <FastImage style={styles.imgNew} source={require("../assets/imgs/hotelOffer.jpg")} />

            <FastImage style={styles.imgNew} source={require("../assets/imgs/cabOffer.jpg")} />

            <TouchableOpacity onPress={this.modalShow("3")}>
              <FastImage style={styles.imgNew} source={require("../assets/imgs/busOffer.jpg")} />
            </TouchableOpacity>
          </SwiperFlatList>
          <Text style={[styles.heading, { marginHorizontal: 12, color: "#1A2B48" }]}>
            POPULAR DOMESTIC ROUTES
          </Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={flights}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
            // contentContainerStyle={{ backgroundColor: "#FFF" }}
          />

          {posts && posts.length > 0 && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: 12
              }}>
              <Text style={[styles.heading, { color: "#1A2B48" }]}>BLOG</Text>
              <Button
                style={{
                  alignSelf: "flex-end",
                  flexDirection: "row",
                  justifyContent: "center"
                }}
                onPress={this.navigateToScreen("BlogList")}>
                <Text style={{}}>VIEW ALL</Text>
                <Icon style={{ paddingStart: 10 }} name="md-arrow-forward" size={18} />
              </Button>
            </View>
          )}
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={posts}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
          />
          <Modal
            style={{ margin: 16 }}
            backdropColor="black"
            backdropOpacity={0.7}
            hasBackdrop
            isVisible={this.state.modalShow}
            onBackButtonPress={this.modalDismiss}
            onBackdropPress={this.modalDismiss}>
            <View>
              <LinearGradient
                style={{
                  alignSelf: "flex-end",
                  alignItems: "center",
                  width: 30,
                  height: 30,
                  justifyContent: "center",
                  borderRadius: 15,
                  zIndex: 1,
                  marginEnd: -10
                }}
                colors={["#53b2fe", "#065af3"]}>
                <TouchableOpacity onPress={this.modalDismiss}>
                  <Icon name="md-close" size={20} color={"#fff"} />
                </TouchableOpacity>
              </LinearGradient>
              <ScrollView
                style={{ backgroundColor: "#fff", padding: 10, marginTop: -10 }}
                showsVerticalScrollIndicator={false}>
                <Offer
                  abouttheoffer={
                    index == 0 ? (
                      <>
                        <Text>
                          To get discounts, users have to book flights for their preferred
                          destination by applying coupon code TDFLIGHT2020 to avail of the offer.
                        </Text>
                        <Text>Book your flight between 1st - 29th Feb 2020.</Text>
                      </>
                    ) : index == 3 ? (
                      <>
                        <Text>
                          To get discounts Book a bus on Trip Desire coupon code TDBUS100.
                        </Text>
                      </>
                    ) : null
                  }
                  howtoavailthisoffer={
                    index == 0 ? (
                      <>
                        <Text>
                          Search flights on trip desire between 1st - 29th Feb 2020 and choose your
                          preferred flight.
                        </Text>
                        <Text>
                          Apply coupon code TDFLIGHT2020 at the time of making your booking.
                        </Text>
                      </>
                    ) : index == 3 ? (
                      <>
                        <Text>Search and choose your preferred bus.</Text>
                        <Text>Apply coupon code TDBUS100 at the time of making your booking.</Text>
                      </>
                    ) : null
                  }
                  termandcondition={
                    index == 0 ? (
                      <>
                        <Text>
                          &#9679; The offer is valid only on flight bookings made between 1st - 29th
                          Feb 2020.
                        </Text>
                        <Text>
                          &#9679; The offer is valid for domestic and international flight bookings
                          only.
                        </Text>
                        <Text>
                          &#9679; The code is applicable on a minimum booking amount of ₹5000.
                        </Text>
                        <Text>
                          &#9679; It is mandatory to apply the coupon code TDFLIGHT2020 at the time
                          of booking.
                        </Text>
                        <Text>&#9679; The coupon code is for one-time use only.</Text>
                        <Text style={{ marginBottom: 10 }}>
                          &#9679; The offer is valid for bookings made on Tripdesire Website, Mobile
                          site, Android & iOS App.
                        </Text>
                      </>
                    ) : index == 3 ? (
                      <>
                        <Text>&#9679; This offer is valid for all users.</Text>
                        <Text>
                          &#9679; You must apply coupon code TDBUS100 at the time of booking.
                        </Text>
                        <Text>
                          &#9679; The code is applicable on a minimum booking amount of ₹5000.
                        </Text>
                        <Text>
                          &#9679; The offer is valid for bookings made on Tripdesire Website,
                          Android & iOS App.
                        </Text>
                      </>
                    ) : null
                  }
                />
              </ScrollView>
            </View>
          </Modal>
        </ScrollView>

        {/* </SafeAreaView> */}
      </>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    alignSelf: "center",
    width,
    overflow: "hidden",
    height: width / 1.7,
    backgroundColor: "#FFF"
  },
  sliderContainerStyle: {
    borderRadius: width,
    width: width * 2,
    height: width * 2,
    marginStart: -(width / 2),
    position: "absolute",
    bottom: 0,
    overflow: "hidden"
  },
  slider: {
    height: width / 1.7,
    width,
    position: "absolute",
    bottom: 0,
    marginStart: width / 2,
    //  backgroundColor: "#9DD6EB",
    alignItems: "center",
    justifyContent: "center"
  },
  img: {
    width: width - 64,
    marginHorizontal: 32,
    marginBottom: 20,
    height: aspectHeight(1134, 1134, width - 64),
    resizeMode: "contain"
  },
  imgNew: {
    width: width - 64,
    marginHorizontal: 32,
    marginBottom: 20,
    height: aspectHeight(2362, 1181, width - 64),
    resizeMode: "contain"
  },
  imgNeww: {
    width: width - 64,
    marginHorizontal: 32,
    marginBottom: 20,
    height: aspectHeight(3543, 1181, width - 64),
    resizeMode: "contain"
  },
  blog: {
    width: width - 128,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    height: aspectHeight(1260, 600, width - 128),
    resizeMode: "cover"
  },
  blogView: {
    borderRadius: 8,
    width: width - 128,
    marginVertical: 15,
    alignItems: "center",
    backgroundColor: "#fff",
    elevation: 2,
    marginStart: 12,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "#d8eaff",
    shadowOpacity: 4,
    shadowRadius: 4
  },
  blogtext: { width: width - 128, paddingHorizontal: 5, paddingVertical: 8 },
  heading: { fontSize: 18, fontWeight: "700" },
  place: { fontSize: 18, fontWeight: "600", color: "#1A2B48", textTransform: "capitalize" },
  flightView: {
    backgroundColor: "#ffffff",
    elevation: 2,
    width: width - 96,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "#d8eaff",
    shadowOpacity: 4,
    shadowRadius: 4,
    marginStart: 12,
    marginVertical: 15,
    alignItems: "center",
    borderRadius: 8
  },
  BottomStripe: {
    backgroundColor: "red",
    width: "100%",
    alignItems: "center",
    marginTop: 5,
    elevation: 2,
    paddingVertical: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8
  },
  offerHeading: {
    fontSize: 18,
    fontWeight: "500"
  },
  offertext: {
    fontSize: 16
  }
});

export default Home;
