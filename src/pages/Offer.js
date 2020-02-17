import { View, StyleSheet } from "react-native";
import { Text } from "../../src/components";
import React from "react";

function Offer(props) {
  return (
    <View>
      <Text style={styles.offerHeading}>ABOUT THE OFFER</Text>
      {props.abouttheoffer}
      <Text style={[styles.offerHeading, { marginVertical: 10 }]}>HOW TO AVAIL THE OFFER</Text>
      {props.howtoavailthisoffer}
      <Text style={[styles.offerHeading, { marginVertical: 10 }]}>TERMS & CONDITIONS</Text>
      {props.termandcondition}
    </View>
  );
}

const styles = StyleSheet.create({
  offerHeading: {
    fontSize: 18,
    fontWeight: "500"
  }
});

export default Offer;
