import React from "react";
import { View, StyleSheet, SafeAreaView, Image, Linking, ScrollView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { isEmpty } from "lodash";
import { GoogleSignin } from "@react-native-community/google-signin";
import { Logout } from "../store/action";
import { Text, Button, Icon } from "../components";

function MyAccount({ navigation }) {
  GoogleSignin.configure({
    iosClientId: "700390422426-jd4ktatcufq8ncqd6p3728be7c3cl3bj.apps.googleusercontent.com"
  });

  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  const login = () => {
    navigation.navigate("LoginStack", {});
  };
  const signUp = () => {
    navigation.navigate("SignUp", { backToAccount: true });
  };

  const myTrips = () => {
    // if (isEmpty(user)) {
    //   navigation.navigate("LoginStack", { isCheckout: true });
    // } else {
    navigation.navigate("OrderStack");
    // }
  };

  const wallet = () => {
    navigation.navigate("Wallet");
  };

  const help = () => {
    navigation.navigate("Help");
  };

  const editAddress = () => {
    navigation.navigate("BillingDetails", {});
  };

  const myProfile = () => {
    navigation.navigate("ProfilePage");
  };

  const privacyPolicy = () => {
    let url = "http://tripdesire.co/privacy-policy/";
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          Alert.alert("Invalid URL");
        } else {
          Linking.openURL(url);
        }
      })
      .catch(err => console.log(err));
  };

  const termsCondition = () => {
    let url = "http://tripdesire.co/terms-and-conditions/";
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          Alert.alert("Invalid URL");
        } else {
          Linking.openURL(url);
        }
      })
      .catch(err => console.log(err));
  };

  const logout = () => {
    dispatch(Logout(null));
    GoogleSignin.signOut();
  };

  return (
    <>
      <SafeAreaView style={{ flex: 0, backgroundColor: "#E4EAF6" }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Account</Text>
        </View>
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}>
          <Image
            source={require("../assets/imgs/profile_tab.png")}
            style={{ width: 112, height: 112 }}
          />
          {isEmpty(user) ? (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Button onPress={login}>
                <Text style={styles.loginButton}>Login</Text>
              </Button>
              <View style={{ width: 3, backgroundColor: "#757575", height: 18 }} />
              <Button onPress={signUp}>
                <Text style={styles.loginButton}>Sign Up</Text>
              </Button>
            </View>
          ) : (
            <>
              <Text style={styles.loginButton}>
                {user.first_name !== "" && user.last_name !== ""
                  ? user.first_name + " " + user.last_name
                  : user.first_name !== ""
                  ? user.first_name
                  : user.username}
              </Text>
              {user.email !== "" && <Text>{user.email}</Text>}
            </>
          )}
          <View style={{ marginTop: 16 }} />
          {!isEmpty(user) && (
            <Button style={styles.rowView} onPress={myProfile}>
              <Image
                source={require("../assets/imgs/my_account.png")}
                style={{ width: 28, height: 28 }}
              />
              <Text style={styles.rowText}>My Profile</Text>
            </Button>
          )}

          <Button style={styles.rowView} onPress={myTrips}>
            <Image
              source={require("../assets/imgs/my_trip.png")}
              style={{ width: 28, height: 28 }}
            />
            <Text style={styles.rowText}>My Trips</Text>
          </Button>

          {!isEmpty(user) && (
            <Button style={styles.rowView} onPress={wallet}>
              <Image
                source={require("../assets/imgs/wallet.png")}
                style={{ width: 28, height: 28, tintColor: "#999DA0" }}
              />
              <Text style={styles.rowText}>Wallet</Text>
            </Button>
          )}

          {!isEmpty(user) && (
            <Button style={styles.rowView} onPress={editAddress}>
              <Image
                source={require("../assets/imgs/edit_address.png")}
                style={{ width: 28, height: 28 }}
              />
              <Text style={styles.rowText}>Edit Address</Text>
            </Button>
          )}

          <Button style={styles.rowView} onPress={privacyPolicy}>
            <Image
              source={require("../assets/imgs/privacy.png")}
              style={{ width: 28, height: 28 }}
            />
            <Text style={styles.rowText}>Privacy Policy</Text>
          </Button>

          <Button style={styles.rowView} onPress={termsCondition}>
            <Image
              source={require("../assets/imgs/term_condition.png")}
              style={{ width: 28, height: 28 }}
            />
            <Text style={styles.rowText}>Terms & Condition</Text>
          </Button>

          <Button style={styles.rowView} onPress={help}>
            <Image source={require("../assets/imgs/help.png")} style={{ width: 28, height: 28 }} />
            <Text style={styles.rowText}>Help</Text>
          </Button>

          {!isEmpty(user) && (
            <Button style={styles.rowView} onPress={logout}>
              <Icon type="AntDesign" name="logout" size={24} color="#999DA0" />
              <Text style={styles.rowText}>Logout</Text>
            </Button>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
export default MyAccount;

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
    padding: 16
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
  },
  loginButton: {
    fontWeight: "bold",
    fontSize: 16,
    padding: 10
  },
  rowView: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    height: 48
  },
  rowText: {
    marginStart: 16,
    fontSize: 18,
    color: "#999DA0"
  }
});
