import React, { PureComponent } from "react";
import { View, Image, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Button, Text, CheckBox } from "../../components";

class RadioButton extends React.PureComponent {
  render() {
    const { index } = this.props;

    return (
      <View
        style={[
          { flexDirection: "row", marginHorizontal: 8, alignItems: "center" },
          this.props.style
        ]}>
        <TouchableOpacity onPress={this.props.onPress}>
          <View
            style={{
              height: 18,
              width: 18,
              borderRadius: 12,
              borderWidth: 2,
              marginHorizontal: 5,
              borderColor: "#000",
              alignItems: "center",
              justifyContent: "center"
            }}>
            {this.props.radioButton && (
              <View
                style={{
                  height: 10,
                  width: 10,
                  borderRadius: 6,
                  backgroundColor: "#000"
                }}
              />
            )}
          </View>
        </TouchableOpacity>
        <Text style={{ lineHeight: 20 }}>{this.props.Name}</Text>
      </View>
    );
  }
}
export default RadioButton;
