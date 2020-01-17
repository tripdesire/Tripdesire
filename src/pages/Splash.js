import React from "react";
import { Image, ImageBackground, Dimensions, StatusBar, View } from "react-native";
import changeNavigationBarColor from "react-native-navigation-bar-color";
import OneSignal from "react-native-onesignal"; // Import package from node modules

const { height, width } = Dimensions.get("window");

class Splash extends React.PureComponent {
  constructor(props) {
    // changeNavigationBarColor("#1E2A48");
    super(props);
    OneSignal.init("9acded5d-5de2-41a5-85c8-18ea9a376ee2");
  }

  componentDidMount() {
    setTimeout(() => {
      this.props.navigation.navigate("TabNavigator");
    }, 3000);
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#f2f2f2",
          alignItems: "center",
          justifyContent: "center"
        }}>
        <Image
          resizeMode="contain"
          style={{
            width: width / 1.3,
            //height: height / 1.5,
            alignItems: "center",
            justifyContent: "center"
          }}
          source={require("../assets/gifs/splashLogo.gif")}
        />
      </View>
      /* <ImageBackground
        style={{
          height: height,
          width: width,
          alignItems: "center",
          justifyContent: "center"
        }}
        source={require("../assets/imgs/Bg.jpg")}>
        <Image
          resizeMode="contain"
          style={{
            width: width - 100,
            height: height / 5,
            alignItems: "center",
            marginTop: -50,
            justifyContent: "center"
          }}
          source={require("../assets/imgs/td-logo.png")}
        />
      </ImageBackground> */
    );
  }
}

export default Splash;
