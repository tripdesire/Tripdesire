import React from "react";
import {
  View,
  Image,
  ImageBackground,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  FlatList
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
        { from: "New Delhi" },
        { from: "New Delhi" },
        { from: "New Delhi" },
        { from: "New Delhi" },
        { from: "New Delhi" },
        { from: "New Delhi" },
        { from: "New Delhi" }
      ],
      posts: []
    };
  }
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

  _gotoFlightSearch = () => {
    console.log("kamal");
    this.props.navigation.navigate("FlightSearch", { check: "Blog" });
  };

  _renderItem = ({ item, index }) => {
    return (
      <Button
        style={[
          styles.flightView,
          {
            marginEnd: this.state.flights.length - 1 == index ? 12 : 2
          }
        ]}
        onPress={this._gotoFlightSearch}>
        <FastImage
          resizeMode="contain"
          style={{ height: 60, width: 60, marginTop: 15 }}
          source={{
            uri: "http://tripdesire.co/wp-content/uploads/2020/02/6E-min.png"
          }}
        />
        <Text style={[styles.place, { marginTop: 10 }]}>New Delhi</Text>
        <Text>To</Text>
        <Text style={styles.place}>Pune</Text>
        <Text>25 Feb 2020(Thursday)</Text>
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
    const { posts, flights } = this.state;
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
              onPress={this.navigateToScreen("FlightSearch", { check: "FromFlight" })}
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
          <SwiperFlatList autoplay autoplayDelay={2} autoplayLoop index={0}>
            <FastImage style={styles.imgNew} source={require("../assets/imgs/2ratio1.jpg")} />
            <FastImage style={styles.imgNeww} source={require("../assets/imgs/3Ratio1.jpg")} />
            <FastImage style={styles.img} source={require("../assets/imgs/flightOffer.jpg")} />
            <FastImage style={styles.img} source={require("../assets/imgs/HotelOffer.jpg")} />
            <FastImage style={styles.img} source={require("../assets/imgs/busOffer.jpg")} />
            <FastImage style={styles.img} source={require("../assets/imgs/cabOffer.jpg")} />
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
  place: { fontSize: 18, fontWeight: "600", color: "#1A2B48" },
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
  }
});

export default Home;
