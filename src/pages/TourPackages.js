import React from "react";
import { View, ImageBackground, Dimensions, FlatList } from "react-native";
import { Text, Button, Icon, LinearGradient } from "../components";
import FastImage from "react-native-fast-image";

const { width, height } = Dimensions.get("window");

class TourPackages extends React.PureComponent {
  constructor(props) {
    console.log(props.navigation.state.params);
    super(props);
    this.state = {
      hotel: [
        {
          name: "Heavenly Shimla Tour"
        },
        {
          name: "Heavenly Shimla Tour"
        },
        {
          name: "Heavenly Shimla Tour"
        },
        {
          name: "Heavenly Shimla Tour"
        },
        {
          name: "Heavenly Shimla Tour"
        },
        {
          name: "Heavenly Shimla Tour"
        }
      ]
    };
  }

  _gotoViewDetail = item => () => {
    this.props.navigation.navigate("TourPackSinPg", {
      ...this.props.navigation.state.params.item,
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
        marginBottom: index == this.state.hotel.length - 1 ? 10 : 0,
        marginHorizontal: 8
      }}>
      <FastImage
        style={{ width: "100%", height: 150, borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
        source={{
          uri:
            "https://demo66.tutiixx.com/wp-content/uploads/2019/08/adventure-calm-clouds-414171-1-min.jpg"
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
        <Text style={{ fontWeight: "500", fontSize: 18 }}>Heavenlt Shimla Tour</Text>
        <Text>2 Night</Text>
      </View>
      <Text style={{ marginHorizontal: 8 }}>
        dsjglksfdhsfdkljlkshklsfdjhsfdjhsdljhksdlkjhsadkljhsadkljhsjhk
      </Text>
      <LinearGradient
        style={{
          marginHorizontal: 8,
          paddingVertical: 5,
          paddingHorizontal: 15,
          borderRadius: 18,
          marginVertical: 20,
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
    const { hotel } = this.state;
    const { item } = this.props.navigation.state.params;
    return (
      <View style={{ flex: 1 }}>
        <ImageBackground
          style={{ width: width, height: height / 4 }}
          resizeMode="cover"
          source={{ uri: item.img }}>
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
            {item.Name}
          </Text>
        </ImageBackground>
        <FlatList
          data={hotel}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          //numColumns={2}
        />
      </View>
    );
  }
}

export default TourPackages;
