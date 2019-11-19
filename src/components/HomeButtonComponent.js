import React, { Component } from "react";
import { View, Image, Text } from "react-native";
import Button from "./Button";
class HomeButtonComponent extends Component {
  render() {
    return (
      <Button
        onPress={this.props.onPress}
        style={{
          elevation: 2,
          shadowOffset: { width: 0, height: 2 },
          shadowColor: "rgba(0,0,0,0.1)",
          shadowOpacity: 1,
          shadowRadius: 4,
          backgroundColor: "#FFFFFF",
          borderRadius: 15,
          padding: 16,
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          margin: 16
        }}>
        <Image
          style={{
            width: 72,
            height: 72
          }}
          source={this.props.img_name}
        />
        <Text
          style={{
            fontSize: 16,
            color: this.props.color ? this.props.color : "#8898A7"
          }}>
          {this.props.name}
        </Text>
      </Button>
    );
  }
}

export default HomeButtonComponent;
