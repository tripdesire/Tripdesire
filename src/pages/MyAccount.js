import React, { Component } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { Text } from "../components";

function MyAccount(props) {
  return (
    <>
      <SafeAreaView style={{ flex: 0, backgroundColor: "#E4EAF6" }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: "grey" }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Account</Text>
        </View>
        <View style={styles.container}></View>
      </SafeAreaView>
    </>
  );
}
export default MyAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
  header: {
    flexDirection: "row",
    paddingHorizontal: 16,
    height: 48,
    alignItems: "center",
    backgroundColor: "#E4EAF6"
  },
  headerTitle: {
    color: "#1E293B",
    fontWeight: "700",
    fontSize: 16
  }
});
