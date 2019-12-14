import React, { PureComponent } from "react";
import { View, Image, StyleSheet, FlatList, ScrollView, Modal, SafeAreaView } from "react-native";
import { withNavigation } from "react-navigation";
import { Text, Button } from "../../components";
import Icon from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import HTML from "react-native-render-html";

class FareDetails extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log(this.props.data);
  }

  render() {
    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "#ffffff" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <View>
            <View
              style={{
                flexDirection: "row",
                marginHorizontal: 16,
                height: 56,
                alignItems: "center"
              }}>
              <Button onPress={this.props.onBackPress}>
                <Ionicons name="md-arrow-back" size={24} />
              </Button>
              <Text style={{ fontSize: 18, color: "#1E293B", marginStart: 10, fontWeight: "700" }}>
                Fare Rules
              </Text>
            </View>
            <ScrollView contentContainerStyle={{ marginHorizontal: 16, marginVertical: 10 }}>
              <HTML html={this.props.data} />
            </ScrollView>
          </View>
        </SafeAreaView>
      </>
    );
  }
}

export default FareDetails;
