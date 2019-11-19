import React, { PureComponent } from "react";
import { View, TouchableWithoutFeedback } from "react-native";

class Button extends React.PureComponent {
  render() {
    return (
      <TouchableWithoutFeedback onPress={this.props.onPress}>
        <View {...this.props}>{this.props.children}</View>
      </TouchableWithoutFeedback>
    );
  }
}

export default Button;
