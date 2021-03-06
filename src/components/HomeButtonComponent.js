import React, { Component } from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import Button from "./Button";

function HomeButtonComponent({ tintColor, onPress, img_name, name }) {
  return (
    <Button onPress={onPress} style={styles.container}>
      <Image style={{ width: 72, height: 72, tintColor }} source={img_name} />
      <Text style={{ fontSize: 16, color: "#616A71", fontWeight: "700" }}>{name}</Text>
    </Button>
  );
}

const styles = StyleSheet.create({
  container: {
    elevation: 2,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "#d8eaff",
    shadowOpacity: 4,
    shadowRadius: 4,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    margin: 16
  }
});
export default HomeButtonComponent;
