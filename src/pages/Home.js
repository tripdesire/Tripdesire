import React from "react";
import {
  View,
  Image,
  SafeAreaView,
  ImageBackground,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet
} from "react-native";
import { HomeButtonComponent, Text } from "../../src/components";
import SwiperFlatList from "react-native-swiper-flatlist";
import analytics from "@react-native-firebase/analytics";

const { width, height } = Dimensions.get("window");

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
      ]
    };
  }
  trackScreenView = async screen => {
    // Set & override the MainActivity screen name
    await analytics().setCurrentScreen(screen, screen);
  };
  componentDidMount() {
    this.trackScreenView("Home");
  }

  navigateToScreen = (page, params = {}) => () => {
    this.props.navigation.navigate(page);
  };

  render() {
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
            <Image
              style={{
                width: width - 64,
                marginHorizontal: 32,
                marginBottom: 20,
                height: aspectHeight(1134, 1134, width - 64),
                resizeMode: "contain"
              }}
              source={require("../assets/imgs/flightOffer.jpg")}
            />
            <Image
              style={{
                width: width - 64,
                marginHorizontal: 32,
                marginBottom: 20,
                height: aspectHeight(1134, 1134, width - 64),
                resizeMode: "contain"
              }}
              source={require("../assets/imgs/HotelOffer.jpg")}
            />
            <Image
              style={{
                width: width - 64,
                marginHorizontal: 32,
                marginBottom: 20,
                height: aspectHeight(1134, 1134, width - 64),
                resizeMode: "contain"
              }}
              source={require("../assets/imgs/busOffer.jpg")}
            />
            <Image
              style={{
                width: width - 64,
                marginHorizontal: 32,
                marginBottom: 20,
                height: aspectHeight(1134, 1134, width - 64),
                resizeMode: "contain"
              }}
              source={require("../assets/imgs/cabOffer.jpg")}
            />
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
  }
});

export default Home;
