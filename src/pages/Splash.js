import React from "react";
import { Image, ImageBackground, Dimensions, StatusBar } from "react-native";

const { height, width } = Dimensions.get("window");

class Splash extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    setTimeout(() => {
      this.props.navigation.navigate("TabNavigator");
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
      </ImageBackground>
    );
  }
}

export default Splash;
