import React, { PureComponent } from "react";
import { View, TouchableNativeFeedback } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import Toast from "react-native-simple-toast";

class Button extends React.PureComponent {
  onPress = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected == null || state.isConnected) {
        this.props.onPress && this.props.onPress();
      } else {
        Toast.show("Please connect to internet", Toast.LONG);
      }
    });
  };
  render() {
    return (
      <TouchableNativeFeedback {...this.props} onPress={this.onPress}>
        <View {...this.props}>{this.props.children}</View>
      </TouchableNativeFeedback>
    );
  }
}

export default Button;
