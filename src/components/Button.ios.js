import React, { PureComponent } from "react";
import { TouchableOpacity } from "react-native";

class Button extends React.PureComponent {
  render() {
    return <TouchableOpacity {...this.props}>{this.props.children}</TouchableOpacity>;
  }
}

export default Button;
