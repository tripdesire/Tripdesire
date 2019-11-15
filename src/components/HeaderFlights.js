import React, { PureComponent } from "react";
import { View, Image } from "react-native";
import Text from "./TextComponent";
import Button from "./Button";
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/Ionicons";
class HeaderFlights extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Button onPress={this.props.onPress} style={{ padding: 16 }}>
          <Icon name="md-arrow-back" size={24} />
        </Button>
        <View style={{ justifyContent: "space-between", flexDirection: "row", flex: 1 }}>
          <View>
            <Text style={{ fontWeight: "700", fontSize: 16, marginHorizontal: 5 }}>
              {this.props.from} TO {this.props.to}
            </Text>
            <Text style={{ fontSize: 12, marginHorizontal: 5, color: "#717984" }}>
              {this.props.journey_date} | {this.props.Adult > 0 ? this.props.Adult + " Adult " : ""}
              {this.props.Child > 0 ? this.props.Child + " Child " : ""}{" "}
              {this.props.Infant > 0 ? this.props.Infant + " Infant" : ""} | {this.props.className}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              flex: 1
            }}>
            <IconMaterial name="filter" fontSize={35} color="#5D89F4" />
            <Text
              style={{
                fontSize: 12,
                marginHorizontal: 5,
                color: "#717984"
              }}>
              Sort & Filter
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

export default HeaderFlights;
