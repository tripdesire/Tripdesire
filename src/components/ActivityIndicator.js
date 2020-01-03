import React, { PureComponent } from "react";
import propsTypes from "prop-types";
import {
  ActivityIndicator as RNActivityIndicator,
  StyleSheet,
  Text,
  View,
  Image
} from "react-native";

function ActivityIndicator({ label }) {
  return (
    <View style={styles.loading}>
      <Image
        source={require("../assets/gifs/loading.gif")}
        style={{ width: 70, resizeMode: "contain" }}
      />
      <Text style={{ color: label == "" ? "#5B89F9" : "#000000", fontWeight: "700" }}>{label}</Text>
    </View>
  );
}

ActivityIndicator.defaultProps = {
  label: "Please Wait..."
};
ActivityIndicator.prototype = {
  label: propsTypes.string
};

const styles = StyleSheet.create({
  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5FCFF"
  }
});

export default ActivityIndicator;
