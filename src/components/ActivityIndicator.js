import React, { PureComponent } from "react";
import { ActivityIndicator as RNActivityIndicator, StyleSheet, Text, View } from "react-native";

class ActivityIndicator extends React.PureComponent {
  render() {
    return (
      <View style={styles.loading}>
        <RNActivityIndicator size="large" color="#5B89F9" />
        <Text style={{ color: "#5B89F9" }}>Please Wait...</Text>
      </View>
    );
  }
}

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
