import React, { PureComponent } from "react";
import { StyleSheet, View, Text, TextInput, Image, Platform } from "react-native";

class TextInputComponent extends React.PureComponent {
  render() {
    return (
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          paddingTop: 14,
          borderBottomWidth: 1,
          borderBottomColor: "#EAEBEF"
        }}>
        {this.props.imgpath && (
          <Image style={{ width: 18, resizeMode: "contain" }} source={this.props.imgpath} />
        )}
        <View style={{ flex: 1 }}>
          <Text style={styles.text}>{this.props.label}</Text>
          <TextInput
            {...this.props}
            style={[styles.textinput, Platform.OS == "ios" ? { paddingVertical: 8 } : null]}
            placeholder={this.props.placeholder}
            placeholderTextColor={"#D9D8DD"}></TextInput>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  textinput: {
    borderBottomColor: "#D2D1D1",
    width: "100%",
    fontSize: 16,
    paddingStart: 5,
    color: "#000"
  },
  text: {
    fontSize: 12,
    paddingStart: 5,
    color: "#A4A5AA"
  }
});
export default TextInputComponent;
