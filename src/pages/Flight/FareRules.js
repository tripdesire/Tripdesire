import React, { PureComponent } from "react";
import { View, StatusBar, ScrollView, SafeAreaView } from "react-native";
import { withNavigation } from "react-navigation";
import { Text, Button, ActivityIndicator } from "../../components";
import Icon from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import HTML from "react-native-render-html";
import analytics from "@react-native-firebase/analytics";

class FareDetails extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log(this.props.data);
    this.state = {
      loader: false
    };
  }

  trackScreenView = async screen => {
    // Set & override the MainActivity screen name
    await analytics().setCurrentScreen(screen, screen);
  };
  componentDidMount() {
    this.trackScreenView("Flight Fare Rules");
  }

  render() {
    const { loader } = this.state;
    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "#000000" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <StatusBar backgroundColor="black" barStyle="light-content" />
          <View>
            <View
              style={{
                flexDirection: "row",
                height: 56,
                backgroundColor: "#E5EBF7",
                alignItems: "center"
              }}>
              <Button style={{ padding: 16 }} onPress={this.props.onBackPress}>
                <Ionicons name="md-arrow-back" size={24} />
              </Button>
              <Text style={{ fontSize: 18, color: "#1E293B", marginStart: 10, fontWeight: "700" }}>
                Fare Rules
              </Text>
            </View>
            <ScrollView contentContainerStyle={{ marginHorizontal: 16, marginVertical: 10 }}>
              <HTML
                baseFontStyle={{ fontFamily: "Poppins-Regular" }}
                html={this.props.data || "<div></div>"}
              />
            </ScrollView>
          </View>
          {loader && <ActivityIndicator />}
        </SafeAreaView>
      </>
    );
  }
}

export default FareDetails;
