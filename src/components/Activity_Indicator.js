import React, { PureComponent } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
class Activity_Indicator extends React.PureComponent {
  render() {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#5B89F9" />
        <Text style={{ color: "#5B89F9" }}>Please Wait...</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
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

export default Activity_Indicator;
