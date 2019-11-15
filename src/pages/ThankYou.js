import React, { PureComponent } from "react";
import { Text, Button } from "../components";
import { Image, ImageBackground, Dimensions, View } from "react-native";
import { connect } from "react-redux";
import { DomSugg, IntSugg, DomHotelSugg, BusSugg } from "../store/action";
import Service from "../service";
import axios from "axios";
const { height, width } = Dimensions.get("window");
class ThankYou extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  navigateToScreen = page => () => {
    this.props.navigation.navigate(page);
  };

  render() {
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          paddingHorizontal: 40
        }}>
        <Image
          source={require("../assets/imgs/Thank-You.png")}
          style={{ height: height / 2.5, width: width / 1.2 }}
          resizeMode="contain"
        />
        <Text style={{ alignItems: "center", justifyContent: "center" }}>
          Lorem ipsum is a simply dummy text in the printing and testing industry
        </Text>
        <Button
          style={{
            backgroundColor: "#F68E1F",
            justifyContent: "center",
            marginHorizontal: 50,
            marginVertical: 40,
            height: 40,
            borderRadius: 20
          }}
          onPress={this.navigateToScreen("Home")}>
          <Text style={{ color: "#fff", paddingHorizontal: 40 }}>Go Home</Text>
        </Button>
      </View>
    );
  }
}

export default ThankYou;
