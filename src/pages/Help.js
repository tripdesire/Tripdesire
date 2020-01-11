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

        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          <Text style={{ marginHorizontal: 16, marginTop: 50, fontWeight: "400", fontSize: 20 }}>
            Any Queries ?
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginHorizontal: 16
            }}>
            <View style={{ marginTop: 25, flex: 1 }}>
              <Button
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 15,
                  elevation: 2,
                  marginEnd: 8,
                  borderRadius: 8,
                  backgroundColor: "#fff",
                  shadowOffset: { width: 0, height: 2 },
                  shadowColor: "rgba(0,0,0,0.1)",
                  shadowOpacity: 1,
                  shadowRadius: 4
                }}
                onPress={_call}>
                <Image
                  source={require("../assets/imgs/phoneHelp.png")}
                  style={styles.img}
                  resizeMode="contain"
                />
                <View style={{ alignItems: "center" }}>
                  <Text style={styles.title}>Toll Free</Text>
                  <Text style={styles.subTitle}>(18001208653)</Text>
                </View>
              </Button>
            </View>
            <View style={{ marginTop: 25, flex: 1 }}>
              <Button
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 15,
                  elevation: 2,
                  marginStart: 8,
                  borderRadius: 8,
                  backgroundColor: "#fff",
                  shadowOffset: { width: 0, height: 2 },
                  shadowColor: "rgba(0,0,0,0.1)",
                  shadowOpacity: 1,
                  shadowRadius: 4
                }}
                onPress={_email}>
                <Image
                  source={require("../assets/imgs/emailHelp.png")}
                  style={styles.img}
                  resizeMode="contain"
                />
                <View style={{ alignItems: "center" }}>
                  <Text style={styles.title}>E-Mail</Text>
                  <Text style={[styles.subTitle]}>info@tripdesire.co</Text>
                </View>
              </Button>
            </View>
          </View>
          <View
            style={{
              marginHorizontal: 16,
              marginTop: 16,
              borderRadius: 8,
              padding: 8,
              elevation: 2,
              backgroundColor: "#fff",
              shadowOffset: { width: 0, height: 2 },
              shadowColor: "rgba(0,0,0,0.1)",
              shadowOpacity: 1,
              shadowRadius: 4,
              flexDirection: "row"
            }}>
            <Image
              source={require("../assets/imgs/locationHelp.png")}
              style={styles.img}
              resizeMode="contain"
            />
            <View style={{ alignItems: "flex-start", flex: 1 }}>
              <Text style={[styles.title, { marginTop: 5 }]}>Address</Text>
              <Text style={{ color: "#9CA3AB", fontSize: 12 }}>
                91 Springboard NH8-Udyog Vihar 90B, Delhi - Jaipur Expy, Udyog Vihar, Sector 18,
                Gurugram, Haryana 122008
              </Text>
            </View>
          </View>
        </View>

        {/* <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
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
          </View>

          <Button
            style={{
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              elevation: 2,
              shadowOffset: { width: 0, height: 2 },
              shadowColor: "rgba(0,0,0,0.1)",
              shadowOpacity: 1,
              shadowRadius: 4
            }}
            onPress={_map}>
            <Image
              source={require("../assets/imgs/address.png")}
              style={styles.img}
              resizeMode="contain"
            />
            <View style={styles.textContainer}>
              <Text style={styles.title}>Address</Text>
              <Text style={[styles.subTitle, { flex: 1 }]}>
                91springboard NH8-Udyog Vihar 90B, Delhi - Jaipur Expy, Udyog Vihar, Sector 18,
                Gurugram, Haryana 122008
              </Text>
            </View>
          </Button>
        </View> */}
      </SafeAreaView>
    </>
  );
}
export default Help;

const styles = StyleSheet.create({
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
    // flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
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
    alignItems: "center"
  },
  title: {
    color: "#5D89F4",
    // fontWeight: "bold",
    fontSize: 14
  },
  subTitle: {
    // marginTop: 8,
    fontSize: 12,
    color: "#9CA3AB"
  }
});
