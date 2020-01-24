import React from "react";
import { Text, StyleSheet, Platform } from "react-native";

function CurrencyText(props) {
  return <Text {...props} style={[styles.container, props.style]} />;
}

const styles = StyleSheet.create({
  container: {
    fontFamily: "System"
    //fontWeight: "bold"
  }
});

CurrencyText.propTypes = {
  ...Text.propTypes
};

export default CurrencyText;
