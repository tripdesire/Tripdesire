import React, { PureComponent } from "react";
import { StyleSheet, View, Text, TextInput, Image } from "react-native";

class TextInputComponent extends React.PureComponent {
  render() {
    return (
      <View
        style={[
          {
            flexDirection: "row",
            width: "100%",
            paddingTop: 14,
            borderBottomWidth: 1,
            borderBottomColor: "#EAEBEF"
          }
        ]}>
        {this.props.imgpath && (
          <Image style={{ width: 18, resizeMode: "contain" }} source={this.props.imgpath} />
        )}
        <View>
          <Text style={styles.text}>{this.props.label}</Text>
          <TextInput
            {...this.props}
            style={styles.textinput}
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
    paddingStart: 5
  },
  text: {
    fontSize: 12,
    paddingStart: 5,
    color: "#A4A5AA"
  }
});
export default TextInputComponent;
