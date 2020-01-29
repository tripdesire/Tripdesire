import React from "react";
import { View, Image, SafeAreaView, ImageBackground, Dimensions, ScrollView } from "react-native";
import { Button, HomeButtonComponent, Text } from "../../src/components";

const { width, height } = Dimensions.get("window");

const aspectHeight = (width, height, newWidth) => (height / width) * newWidth;

class Home extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      suggestions: [],
      isSelect: true
    };
  }

  navigateToScreen = (page, params = {}) => () => {
    this.props.navigation.navigate(page);
  };

  render() {
    const { IconcolorFlight, IconcolorHotels, IconcolorBus, IconcolorCab } = this.state;
    return (
      <>
        {/* <SafeAreaView style={{ flex: 0, backgroundColor: "transparent" }} /> */}
        {/* <SafeAreaView style={{ flex: 1, backgroundColor: "grey" }}> */}
        <ScrollView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
          <View
            style={{
              backgroundColor: "#ffffff",
              color: "#fff",
              borderRadius: 20
            }}>
            <ImageBackground
              resizeMode="cover"
              style={{
                width,
                justifyContent: "center",
                alignItems: "center",
                height: height / 2.8,
                width: width + 220,
                alignSelf: "center",
                borderBottomLeftRadius: 650,
                borderBottomRightRadius: 650,
                overflow: "hidden"
                //   transform: [{ translateX: 100, translateY: 100 }]
              }}
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
              {/* <Text
                  style={{
                    color: "#081057",
                    fontSize: 30,
                    lineHeight: 34,
                    fontWeight: "700",
                    marginHorizontal: 20
                  }}>
                  WANT TO GO??
                </Text>
                <Text style={{ marginHorizontal: 20, color: "#ffffff", fontWeight: "700" }}>
                  Search Amazing Flights, Hotels, Bus & Cabs
                </Text>
                <Text style={{ marginHorizontal: 20, color: "#ffffff", fontWeight: "700" }}>
                  at a good Price.
                </Text> */}
            </ImageBackground>
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
          <Image
            style={{
              marginVertical: 20,
              resizeMode: "contain",
              marginHorizontal: 32,
              width: width - 64,
              height: aspectHeight(1134, 1134, width - 64)
            }}
            source={require("../assets/imgs/offer.png")}
          />
        </ScrollView>
        {/* </SafeAreaView> */}
      </>
    );
  }
}

export default Home;
