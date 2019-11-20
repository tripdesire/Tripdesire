import React, { PureComponent } from "react";
import { View, Image, StyleSheet, FlatList, ScrollView, Modal } from "react-native";
import { withNavigation } from "react-navigation";
import { Text, Button } from "../../components";
import Icon from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";

class FareDetails extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log(this.props.data);
  }

  render() {
    return (
      <View>
        <View
          style={{ flexDirection: "row", marginHorizontal: 16, height: 56, alignItems: "center" }}>
          <Button onPress={this.props.onBackPress}>
            <Ionicons name="md-arrow-back" size={24} />
          </Button>
          <Text style={{ fontSize: 18, color: "#1E293B", marginStart: 10, fontWeight: "700" }}>
            FareRules
          </Text>
        </View>
        <ScrollView contentContainerStyle={{ marginHorizontal: 16 }}>
          <Text>{this.props.data}</Text>
        </ScrollView>
      </View>
    );
  }
}

export default FareDetails;
