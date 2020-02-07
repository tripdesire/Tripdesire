import React, { PureComponent } from "react";
import { TouchableOpacity } from "react-native";
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
      <TouchableOpacity {...this.props} onPress={this.onPress}>
        {this.props.children}
      </TouchableOpacity>
    );
  }
}

export default Button;
