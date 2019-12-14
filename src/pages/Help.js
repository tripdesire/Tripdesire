import React, { Component } from "react";
import { View, StyleSheet, SafeAreaView, Image, Linking, Alert, Platform } from "react-native";
import { Text, Button } from "../components";

function Help(props) {
  const _call = () => {
    let phoneNumber = 18001208653;
    if (Platform.OS === "ios") {
      phoneNumber = `telprompt:18001208653`;
    } else {
      phoneNumber = `tel:18001208653`;
    }
    Linking.canOpenURL(phoneNumber)
      .then(supported => {
        if (!supported) {
          Alert.alert("Phone number is not available");
        } else {
          Linking.openURL(phoneNumber);
        }
      })
      .catch(err => console.log(err));
  };

  const _email = () => {
    let email = "mailto:info@tripdesire.co";
    Linking.canOpenURL(email)
      .then(supported => {
        if (!supported) {
          Alert.alert("Email is not available");
        } else {
          Linking.openURL(email);
        }
      })
      .catch(err => console.log(err));
  };

  const _map = () => {
    let map =
      "https://www.google.com/maps/search/?api=1&query=91springboard NH8-Udyog Vihar 90B, Delhi - Jaipur Expy, Udyog Vihar, Sector 18, Gurugram, Haryana 122008";
    Linking.canOpenURL(map)
      .then(supported => {
        if (!supported) {
          Alert.alert("Email is not available");
        } else {
          Linking.openURL(map);
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <>
      <SafeAreaView style={{ flex: 0, backgroundColor: "#E4EAF6" }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: "grey" }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Help</Text>
        </View>

        <View style={styles.container}>
          <Button style={styles.cardview} onPress={_call}>
            <Image
              source={require("../assets/imgs/phone.png")}
              style={styles.img}
              resizeMode="contain"
            />
            <View style={styles.textContainer}>
              <Text style={styles.title}>Toll Free</Text>
              <Text style={styles.subTitle}>(18001208653)</Text>
            </View>
          </Button>

          <Button style={styles.cardview} onPress={_email}>
            <Image
              source={require("../assets/imgs/email_help.png")}
              style={styles.img}
              resizeMode="contain"
            />
            <View style={styles.textContainer}>
              <Text style={styles.title}>E-Mail</Text>
              <Text style={styles.subTitle}>info@tripdesire.co</Text>
            </View>
          </Button>

          <Button style={styles.cardview} onPress={_map}>
            <Image
              source={require("../assets/imgs/address.png")}
              style={styles.img}
              resizeMode="contain"
            />
            <View style={styles.textContainer}>
              <Text style={styles.title}>Address</Text>
              <Text style={styles.subTitle}>
                91springboard NH8-Udyog Vihar 90B, Delhi - Jaipur Expy, Udyog Vihar, Sector 18,
                Gurugram, Haryana 122008
              </Text>
            </View>
          </Button>
        </View>
      </SafeAreaView>
    </>
  );
}
export default Help;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#FFF"
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
    fontSize: 18
  },
  cardview: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#FFF",
    marginBottom: 30,
    borderRadius: 8,
    elevation: 5,
    shadowOpacity: 0.4,
    shadowRadius: 1,
    shadowOffset: { height: 1, width: 0 }
  },
  img: {
    width: 64,
    height: 64
  },
  textContainer: {
    marginStart: 8,
    width: "100%",
    flexShrink: 1
  },
  title: {
    fontWeight: "bold",
    fontSize: 16
  },
  subTitle: {
    marginTop: 8,
    color: "#9CA3AB"
  }
});
