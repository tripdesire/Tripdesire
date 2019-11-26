import React, { PureComponent } from "react";
import { Text } from "../components";
import { Image, ImageBackground, Dimensions } from "react-native";

const { height, width } = Dimensions.get("window");

class Splash extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    setTimeout(() => {
      this.props.navigation.navigate("Cab"); //DrawerNavigator
    }, 2000);
  }

  render() {
    return (
      <ImageBackground
        style={{
          height: height,
          width: width,
          alignItems: "center",
          justifyContent: "center"
        }}
        source={require("../assets/imgs/Bg.png")}>
        <Image
          resizeMode="contain"
          style={{
            width: width - 100,
            height: height / 5,
            alignItems: "center",
            marginTop: 100,
            justifyContent: "center"
          }}
          source={require("../assets/imgs/LOGOSplash.png")}
        />
      </ImageBackground>
    );
  }
}

export default Splash;
