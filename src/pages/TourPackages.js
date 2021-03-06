import React from "react";
import { View, ImageBackground, Dimensions, FlatList, Platform, Animated } from "react-native";
import { Text, Button, Icon, LinearGradient, ActivityIndicator } from "../components";
import FastImage from "react-native-fast-image";
//import Animated from "react-native-reanimated";
import { domainApi } from "../service";
import HTML from "react-native-render-html";

const { width, height } = Dimensions.get("window");

const Header_Maximum_Height = height / 4;
const Header_Minimum_Height = height / 4 - 56;

class TourPackages extends React.PureComponent {
  constructor(props) {
    console.log(props.navigation.state.params);
    super(props);
    this.AnimatedHeaderValue = new Animated.Value(0);
    this.state = {
      ht: false,
      data: [],
      cat_details: "",
      loading: false
    };
  }

  componentDidMount() {
    const { item } = this.props.navigation.state.params;
    let param = {
      term_id: item.id,
      slug: item.slug
    };
    this.setState({ loading: true });
    domainApi
      .post("/package/product-list", param)
      .then(({ data }) => {
        this.setState({ loading: false });
        console.log(data);
        this.setState({ data: data.data, cat_details: data.category_details });
      })
      .catch(error => {
        this.setState({ loading: false });
        console.log(error);
      });
  }

  _gotoViewDetail = item => () => {
    this.props.navigation.navigate("TourPackSinPg", {
      ...this.props.navigation.state.params,
      ...item
    });
  };

  _renderItem = ({ item, index }) => (
    <View
      style={{
        elevation: 2,
        backgroundColor: "#fff",
        borderRadius: 8,
        marginTop: 10,
        marginBottom: index == this.state.data.length - 1 ? 10 : 0,
        marginHorizontal: 8
      }}>
      <FastImage
        style={{ width: "100%", height: 150, borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
        source={{
          uri: item.image_url
        }}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginHorizontal: 8,
          marginVertical: 15
        }}>
        <Text style={{ fontWeight: "500", fontSize: 18, flex: 1 }}>{item.title}</Text>
        <Text>{this.state.cat_details.category_description}</Text>
      </View>
      {/* <View style={{ marginHorizontal: 8 }}>
        <HTML html={item.description} />
      </View> */}
      <LinearGradient
        style={{
          marginHorizontal: 8,
          paddingVertical: 5,
          paddingHorizontal: 15,
          borderRadius: 18,
          marginBottom: 10,
          width: 120
        }}
        colors={["#53b2fe", "#065af3"]}>
        <Button onPress={this._gotoViewDetail(item)}>
          <Text style={{ color: "#fff" }}>View Details</Text>
        </Button>
      </LinearGradient>
    </View>
  );

  _goBack = () => {
    this.props.navigation.goBack(null);
  };

  _keyExtractor = (item, index) => "Sap" + item + index;

  render() {
    const { data, loading } = this.state;
    const { item } = this.props.navigation.state.params;

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
                style={{
                  width: width,
                  height: height / 4
                }}
                resizeMode="cover"
                source={{ uri: item.image_url }}>
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
            <FlatList
              data={data}
              renderItem={this._renderItem}
              keyExtractor={this._keyExtractor}
              scrollEventThrottle={16}
              contentContainerStyle={{ paddingTop: height / 4 }}
              onScroll={Animated.event([
                { nativeEvent: { contentOffset: { y: this.AnimatedHeaderValue } } }
              ])}
            />
          </View>
        )}
      </>
    );
  }
}

export default TourPackages;
