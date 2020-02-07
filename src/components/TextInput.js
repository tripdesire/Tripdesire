import React, { PureComponent } from "react";
import { StyleSheet, View, Text, TextInput, Image, Platform } from "react-native";

class TextInputComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isFocus: false
    };
  }

  onfocus = () => {
    this.setState({ isFocus: true });
  };

  onblur = () => {
    this.setState({ isFocus: false });
  };

  render() {
    return (
      <View
        style={[
          {
            flexDirection: "row",
            width: "100%",
            paddingTop: 14,
            borderBottomWidth: 1
          },
          { borderBottomColor: this.state.isFocus ? "#5789FF" : "#EAEBEF" }
        ]}>
        {this.props.imgpath && (
          <Image style={{ width: 18, resizeMode: "contain" }} source={this.props.imgpath} />
        )}
        <View style={{ flex: 1 }}>
          <Text style={styles.text}>{this.props.label}</Text>
          <TextInput
            {...this.props}
            style={[
              styles.textinput,
              { color: "#000000" },
              Platform.OS == "ios" ? { paddingVertical: 8 } : null
            ]}
            placeholder={this.props.placeholder}
            placeholderTextColor={"#D9D8DD"}
            onFocus={this.onfocus}
            onBlur={this.onblur}></TextInput>
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
    color: "#757575"
  }
});
export default TextInputComponent;
