import React from "react";
import { View } from "react-native";
import { withNavigation } from "react-navigation";
import Text from "./TextComponent";
import Button from "./Button";
import Icon from "./IconNB";

class HeaderFlights extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  goBack = () => {
    this.props.navigation.goBack(null);
  };
  render() {
    const { flight_type, journey_date, return_date, style } = this.props;
    return (
      <View style={[{ flexDirection: "row", width: "100%" }, style]}>
        <Button onPress={this.goBack} style={{ padding: 16 }}>
          <Icon name="md-arrow-back" size={24} />
        </Button>
        <View style={{ paddingTop: 16, flex: 1 }}>
          <Text style={{ fontWeight: "700", fontSize: 16, marginHorizontal: 5 }}>
            {this.props.from} TO {this.props.to}
          </Text>
          <Text style={{ fontSize: 12, marginHorizontal: 5, color: "#717984" }}>
            {this.props.journey_date ? this.props.journey_date : ""}
            {this.props.return_date ? "-" + this.props.return_date : ""} |
            {this.props.Adult > 0 ? " " + this.props.Adult + " Adult " : ""}
            {this.props.Child > 0 ? this.props.Child + " Child " : ""}{" "}
            {this.props.Infant > 0 ? this.props.Infant + " Infant" : ""} | {this.props.className}
          </Text>
        </View>
        {this.props.children}
      </View>
    );
  }
}

export default withNavigation(HeaderFlights);
