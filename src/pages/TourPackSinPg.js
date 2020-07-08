import React from "react";
import {
  View,
  ImageBackground,
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Animated
} from "react-native";
import {
  Text,
  Button,
  Icon,
  LinearGradient,
  ActivityIndicator,
  TextInputComponent
} from "../components";
import FastImage from "react-native-fast-image";
import { domainApi } from "../service";
import HTML from "react-native-render-html";
import Toast from "react-native-simple-toast";
import { WebView } from "react-native-webview";
const { width, height } = Dimensions.get("window");
import AutoHeightWebView from "react-native-autoheight-webview";

const Header_Maximum_Height = height / 4;
const Header_Minimum_Height = height / 4 - 56;

class TourPackSinPg extends React.PureComponent {
  constructor(props) {
    super(props);
    this.AnimatedHeaderValue = new Animated.Value(0);
    console.log(props.navigation.state.params);
    this.state = {
      data: "",
      loading: false,
      passenger: ""
    };
  }

  componentDidMount() {
    const { item, id } = this.props.navigation.state.params;
    let param = {
      term_id: item.id,
      slug: item.slug,
      product_id: id
    };

    this.setState({ loading: true });
    domainApi
      .post("/package/single-product", param)
      .then(({ data }) => {
        console.log(data);
        this.setState({ loading: false, data: data.data });
      })
      .catch(error => {
        this.setState({ loading: false });
        console.log(error);
      });
  }

  _goBack = () => {
    this.props.navigation.goBack(null);
  };

  gotoPayment = () => {
    const { item, id } = this.props.navigation.state.params;
    let person = this.state.passenger + "~0~0~0";
    if (this.state.passenger != "") {
      this.props.navigation.navigate("BlogCheckout", {
        Blog: true,
        item: item,
        Hotel_id: id,
        person: person,
        No_of_person: this.state.passenger
      });
    } else {
      Toast.show("Please enter the Passengers", Toast.LONG);
    }
  };

  render() {
    const { data, loading } = this.state;
    const { item, image_url, sale_price } = this.props.navigation.state.params;

    const HeaderHeight = this.AnimatedHeaderValue.interpolate({
      inputRange: [0, Header_Maximum_Height],
      outputRange: [0, -Header_Maximum_Height],
      extrapolate: "clamp"
    });

    return (
      <>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <View style={{ flex: 1 }}>
            <Animated.View
              style={{
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                zIndex: 1000,
                top: Platform.OS == "ios" ? 20 : 0,
                // height: height / 4,
                transform: [{ translateY: HeaderHeight }],
                resizeMode: "cover"
              }}>
              <ImageBackground
                style={{ width, height: height / 4 }}
                resizeMode="cover"
                source={{ uri: image_url }}>
                <Button onPress={this._goBack} style={{ padding: 16 }}>
                  <Icon name="md-arrow-back" size={24} color="#fff" />
                </Button>
                <Text
                  style={{
                    fontSize: 30,
                    fontWeight: "700",
                    color: "#fff",
                    alignSelf: "center",
                    marginTop: 20
                  }}>
                  {item.name}
                </Text>
              </ImageBackground>
            </Animated.View>
            <ScrollView
              scrollEventThrottle={16}
              contentContainerStyle={{ paddingTop: height / 4 }}
              onScroll={Animated.event([
                { nativeEvent: { contentOffset: { y: this.AnimatedHeaderValue } } }
              ])}>
              <View>
                {/* <WebView
                  style={{ height: 3800 }}
                  originWhitelist={["*"]}
                  source={{ uri: data.page_url }}
                  injectedJavaScript={`
                    let style = document.createElement('style');
                    style.type = 'text/css';
                    style.innerHTML='${data.page_css}';
                    document.head.appendChild(style);
                    true;
                  `}
                  onMessage={() => {}}
                /> */}
                <AutoHeightWebView
                  customScript={`
                    let style = document.createElement('style');
                    style.type = 'text/css';
                    style.innerHTML='${data.page_css}';
                    document.head.appendChild(style);
                    true;
                  `}
                  source={{ uri: data.page_url }}
                  scalesPageToFit={true}
                />
              </View>

              <View style={{ alignItems: "center", marginHorizontal: 20 }}>
                <TextInputComponent
                  label="No. of Person"
                  placeholder="Enter Here"
                  value={this.state.passenger}
                  keyboardType="numeric"
                  onChangeText={text => this.setState({ passenger: text })}
                />
              </View>

              <Text style={{ padding: 20, fontWeight: "600", fontSize: 16, color: "#065af3" }}>
                {"₹" + sale_price + "/Person"}
              </Text>

              <LinearGradient
                style={{
                  backgroundColor: "#F68E1D",
                  marginHorizontal: 120,
                  alignItems: "center",
                  justifyContent: "center",
                  height: 36,
                  marginVertical: 20,
                  borderRadius: 20
                }}
                colors={["#53b2fe", "#065af3"]}>
                <Button onPress={this.gotoPayment}>
                  <Text style={{ color: "#fff" }}>Book Now</Text>
                </Button>
              </LinearGradient>
            </ScrollView>
          </View>
        )}
      </>
    );
  }
}

export default TourPackSinPg;
