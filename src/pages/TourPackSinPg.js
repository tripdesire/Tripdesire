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
import { Text, Button, Icon, LinearGradient } from "../components";
import FastImage from "react-native-fast-image";
const { width, height } = Dimensions.get("window");

const Header_Maximum_Height = height / 4;
const Header_Minimum_Height = height / 4 - 56;

class TourPackSinPg extends React.PureComponent {
  constructor(props) {
    super(props);
    this.AnimatedHeaderValue = new Animated.Value(0);
    console.log(props.navigation.state.params);
    this.state = {
      hotels: [{ Name: "The Oberoi" }, { Name: "The Oberoi" }, { Name: "The Oberoi" }],
      days: [{ sno: "Day" }, { sno: "Day" }, { sno: "Day" }, { sno: "Day" }],
      can: false
    };
  }

  _renderItem = ({ item, index }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          padding: 8,
          marginTop: 10,
          marginBottom: index == this.state.hotels.length - 1 ? 10 : 0,
          elevation: 3,
          marginHorizontal: 5,
          alignItems: "center",
          borderRadius: 8,
          backgroundColor: "#fff"
        }}>
        <FastImage
          style={{ height: 120, width: 120, borderRadius: 8 }}
          resizeMode="cover"
          source={{ uri: "https://demo66.tutiixx.com/wp-content/uploads/2019/12/3-min.png" }}
        />
        <View style={{ marginStart: 10, flex: 1 }}>
          <Text style={styles.heading}>The Oberoi</Text>
          <Text style={{ flex: 1 }}>
            jkhsfufgioufdgkdfggjkdfgkjgfdjkfgdjklhfgdsfgdjhdfsghkldfjhkldfggkhdfgkljhdfgjhk
            jkhsfufgioufdgkdfggjkdfgkjgfdjkfgdjklhfgdsfgdjhdfsghkldfjhkldfggkhdf.
          </Text>
        </View>
      </View>
    );
  };

  _renderItemDay = ({ item, index }) => {
    return (
      <View style={{ flexDirection: "row", marginTop: 15, alignItems: "center" }}>
        <LinearGradient
          style={{
            height: 50,
            width: 50,
            backgroundColor: "red",
            borderRadius: 25,
            alignItems: "center",
            justifyContent: "center"
          }}
          colors={["#53b2fe", "#065af3"]}>
          <Text style={{ color: "#fff", fontWeight: "500", lineHeight: 16 }}>Day</Text>
          <Text style={{ color: "#fff", fontWeight: "500", lineHeight: 16 }}>{index + 1}</Text>
        </LinearGradient>
        <Text style={{ flex: 1, marginStart: 10 }}>
          kyfgjkfhfgdklfgdhuksfgljhfjklhfgduidfgpisfgdyiowfgdiure098fgdkiryhsfdjkfgdjkv
        </Text>
      </View>
    );
  };

  _keyExtractor = (index, item) => "sap" + item + index;

  _keyExtractorDay = (index, item) => "sap" + item + index;

  _goBack = () => {
    this.props.navigation.goBack(null);
  };

  _setCan = () => {
    this.setState({ can: this.state.can == false ? true : false });
  };

  render() {
    const { hotels, days, can } = this.state;
    const { name, Name } = this.props.navigation.state.params;

    const HeaderHeight = this.AnimatedHeaderValue.interpolate({
      inputRange: [0, Header_Maximum_Height],
      outputRange: [0, -Header_Maximum_Height],
      extrapolate: "clamp"
    });

    return (
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
            source={{ uri: "https://demo66.tutiixx.com/wp-content/uploads/2020/01/4-min.png" }}>
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
              {Name}
            </Text>
          </ImageBackground>
        </Animated.View>
        <ScrollView
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingTop: height / 4 }}
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { y: this.AnimatedHeaderValue } } }
          ])}>
          {/* <FastImage
            style={{ width: width - 16, height: height / 4, margin: 8 }}
            source={{ uri: "https://demo66.tutiixx.com/wp-content/uploads/2019/12/3-min.png" }}
          /> */}
          <View style={{ marginHorizontal: 8 }}>
            <Text style={styles.heading}>Package Overview</Text>
            <Text>
              fejhwluiofdjkhsfdhksfdhfsfdahsfdkljhpsfdkjhpiorkjryihnmbkjglnbfgdjlgrocxjhgljhfjkfdljkhfdkljfghduigjklxhfgjhsdfjhkfdgjksdjhk;fdf
            </Text>
            <Text style={styles.heading}>Inclusion</Text>
            <Text>&#9679; Assistant on arrival and departure.</Text>
            <Text>&#9679; Assistant on arrival and departure.</Text>
            <Text>&#9679; Assistant on arrival and departure.</Text>
            <Text>&#9679; Assistant on arrival and departure.</Text>
            <Text>&#9679; Assistant on arrival and departure.</Text>
            <Text>&#9679; Assistant on arrival and departure.</Text>
            <Text style={styles.heading}>Exclusion</Text>
            <Text>&#9679; Any expenses of personal nature.</Text>
            <Text>&#9679; Any expenses of personal nature.</Text>
            <Text>&#9679; Any expenses of personal nature.</Text>
            <Text>&#9679; Any expenses of personal nature.</Text>
            <Text>&#9679; Any expenses of personal nature.</Text>
            <Text>&#9679; Any expenses of personal nature.</Text>
            <Text style={styles.heading}>Hotel Details</Text>
            <FlatList
              data={hotels}
              renderItem={this._renderItem}
              keyExtractor={this._keyExtractor}
            />

            <Text style={[styles.heading, { marginTop: 10 }]}>Day wise Liteneary</Text>
            <FlatList
              data={days}
              renderItem={this._renderItemDay}
              keyExtractor={this._keyExtractorDay}
            />

            <Text style={[styles.heading, { marginTop: 10 }]}>Additional Info</Text>
            <View style={{ flexDirection: "row", marginVertical: 10 }}>
              <LinearGradient
                style={[
                  styles.tabButton,
                  {
                    borderColor: !can ? null : "#D2d2d2",
                    borderWidth: !can ? 0 : 1
                  }
                ]}
                colors={can == false ? ["#53b2fe", "#065af3"] : ["#ffffff", "#ffffff"]}>
                <Button onPress={this._setCan} style={styles.button}>
                  <Text style={{ color: !can ? "#fff" : "#d2d2d2" }}>Terms and Conditions</Text>
                </Button>
              </LinearGradient>
              <LinearGradient
                style={[
                  styles.tabButton,
                  {
                    marginStart: 20,
                    borderColor: can ? null : "#D2d2d2",
                    borderWidth: can ? 0 : 1
                  }
                ]}
                colors={can != false ? ["#53b2fe", "#065af3"] : ["#ffffff", "#ffffff"]}>
                <Button onPress={this._setCan} style={styles.button}>
                  <Text style={{ color: can ? "#fff" : "#d2d2d2" }}>Cancellation Policy</Text>
                </Button>
              </LinearGradient>
            </View>
            {can ? (
              <>
                <Text>&#9679; Cancellation Policy</Text>
                <Text>&#9679; Cancellation Policy</Text>
                <Text>&#9679; Cancellation Policy</Text>
                <Text>&#9679; Cancellation Policy</Text>
                <Text>&#9679; Cancellation Policy</Text>
                <Text>&#9679; Cancellation Policy</Text>
              </>
            ) : (
              <>
                <Text>&#9679; Terms and conditions</Text>
                <Text>&#9679; Terms and conditions</Text>
                <Text>&#9679; Terms and conditions</Text>
                <Text>&#9679; Terms and conditions</Text>
                <Text>&#9679; Terms and conditions</Text>
                <Text>&#9679; Terms and conditions</Text>
              </>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  heading: { fontWeight: "500", fontSize: 18 },
  tabButton: {
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center"
  },
  button: {
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 25
  }
});

export default TourPackSinPg;
