import React, { PureComponent } from "react";
import { Text } from "react-native";
class TextComponent extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Text
        style={[{ fontFamily: "Poppins-Regular" }, this.props.style]}
        onPress={this.props.onPress}>
        {this.props.children}
      </Text>
    );
  }
}

export default TextComponent;
