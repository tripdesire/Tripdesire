import React from "react";
import {
  View,
  Image,
  ImageBackground,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Linking
} from "react-native";
import { HomeButtonComponent, Text, Button, Icon } from "../../src/components";
import SwiperFlatList from "react-native-swiper-flatlist";
import analytics from "@react-native-firebase/analytics";
import { domainApi } from "../service";
import axios from "axios";

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
      posts: []
    };
  }
  trackScreenView = async screen => {
    // Set & override the MainActivity screen name
    await analytics().setCurrentScreen(screen, screen);
  };
  componentDidMount() {
    axios
      .get("https://tripdesire.co/wp-json/wp/v2/posts")
      .then(({ data }) => {
        console.log(data);
        this.setState({ posts: data });
      })
      .catch(error => {
        console.log(error);
      });
    this.trackScreenView("Home");
  }

  navigateToScreen = (page, params = {}) => () => {
    this.props.navigation.navigate(page);
  };

  blogShare = blog => () => {
    Linking.canOpenURL(blog.link)
      .then(supported => {
        if (!supported) {
          Alert.alert("Invalid URL");
        } else {
          Linking.openURL(blog.link);
        }
      })
      .catch(err => console.log(err));
  };

  render() {
    const { posts } = this.state;
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
                    fontSize: 30,
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
          <SwiperFlatList autoplay autoplayDelay={2} autoplayLoop index={0}>
            <Image style={styles.img} source={require("../assets/imgs/flightOffer.jpg")} />
            <Image style={styles.img} source={require("../assets/imgs/HotelOffer.jpg")} />
            <Image style={styles.img} source={require("../assets/imgs/busOffer.jpg")} />
            <Image style={styles.img} source={require("../assets/imgs/cabOffer.jpg")} />
          </SwiperFlatList>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 12 }}>
            <Text style={{ fontSize: 16, color: "#616A71", fontWeight: "700" }}>BLOG</Text>
            <Button
              style={{
                alignSelf: "flex-end",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center"
              }}
              onPress={this.navigateToScreen("BlogList")}>
              <Text style={{}}>VIEW ALL</Text>
              <Icon style={{ paddingStart: 10 }} name="md-arrow-forward" size={18} />
            </Button>
          </View>
          <SwiperFlatList index={0}>
            {posts &&
              posts.map((item, index) => {
                return (
                  <Button
                    style={[styles.blogView, { marginEnd: posts.length - 1 == index ? 12 : 0 }]}
                    key={item.id}
                    onPress={this.blogShare(item)}>
                    <Image style={styles.blog} source={{ uri: item.featured_image_url }} />
                    <Text style={styles.blogtext}>{item.title.rendered}</Text>
                  </Button>
                );
              })}
          </SwiperFlatList>
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
    backgroundColor: "#ffffff",
    elevation: 2,
    marginStart: 12,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "#d8eaff",
    shadowOpacity: 4,
    shadowRadius: 4
  },
  blogtext: { width: width - 128, paddingHorizontal: 5, paddingVertical: 8 }
});

export default Home;
