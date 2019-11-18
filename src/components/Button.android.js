import React, { PureComponent } from "react";
import { View, TouchableNativeFeedback } from "react-native";

class Button extends React.PureComponent {
  render() {
    return (
      <TouchableNativeFeedback onPress={this.props.onPress}>
        <View {...this.props}>{this.props.children}</View>
      </TouchableNativeFeedback>
    );
  }
}

export default Button;
