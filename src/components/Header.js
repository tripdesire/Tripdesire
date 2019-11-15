import React, { PureComponent } from "react";
import { View, Image } from "react-native";
import Text from "./TextComponent";
import { withNavigation } from "react-navigation";
import Icon from "react-native-vector-icons/Ionicons";
import Button from "./Button";
class Header extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  goBack = () => {
    this.props.navigation.goBack(null);
  };
  render() {
    return (
      <View style={{ flexDirection: "row", marginTop: 10, marginHorizontal: 16 }}>
        <Button onPress={this.goBack}>
          <Icon name="md-arrow-back" size={24} />
        </Button>
        <Text style={{ fontSize: 18, color: "#1E293B", marginStart: 10, fontWeight: "100" }}>
          {this.props.firstName}
        </Text>
        <Text style={{ fontSize: 18, color: "#1E293B", marginStart: 5, fontWeight: "700" }}>
          {this.props.lastName}
        </Text>
      </View>
    );
  }
}

export default withNavigation(Header);
