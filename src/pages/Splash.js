import React from "react";
import { Image, ImageBackground, Dimensions, StatusBar, View } from "react-native";

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
      <View
        style={{
          height: height,
          width: width,
          backgroundColor: "#f2f2f2",
          alignItems: "center",
          justifyContent: "center"
        }}>
        <Image
          resizeMode="contain"
          style={{
            width: width - 100,
            height: height / 5,
            alignItems: "center",
            marginTop: -50,
            justifyContent: "center"
          }}
          source={require("../assets/imgs/splashLogo.png")}
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
