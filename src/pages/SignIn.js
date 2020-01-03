import React from "react";
import { View, Image, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import Toast from "react-native-simple-toast";
import { domainApi } from "../service";
import { Button, Text, TextInputComponent, ActivityIndicator, Icon } from "../components";
import { connect } from "react-redux";
import { Signin } from "../store/action";
import { GoogleSignin } from "@react-native-community/google-signin";
import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from "react-native-fbsdk";

class SignIn extends React.PureComponent {
  constructor(props) {
    GoogleSignin.configure({
      iosClientId: "700390422426-jd4ktatcufq8ncqd6p3728be7c3cl3bj.apps.googleusercontent.com"
    });
    super(props);
    this.state = {
      email: "",
      password: "",
      loader: false
    };
  }

  login = () => {
    const { onBack, needBilling } = this.props.navigation.state.params;
    console.log(this.state);
    if (this.state.email != "" && this.state.password != "") {
      this.setState({ loader: true });
      let param = {
        email: this.state.email,
        password: this.state.password
      };
      domainApi
        .post("/login", param)
        .then(({ data }) => {
          console.log(data);
          if (data.code == "1") {
            this.setState({ loader: false });
            this.props.Signin(data.details);
            onBack && onBack();
            if (
              needBilling &&
              (data.details.billing.email == "" || data.details.billing.phone == "")
            ) {
              this.props.navigation.navigate("BillingDetails", {
                ...this.props.navigation.state.params
              });
            } else {
              this.goBack();
            }
            Toast.show("Login successful", Toast.LONG);
          } else {
            this.setState({ loader: false });
            Toast.show("Username/Password does not match", Toast.LONG);
          }
        })
        .catch(error => {
          this.setState({ loader: false });
          Toast.show(error, Toast.LONG);
        });
    } else {
      Toast.show("Please fill all the details.", Toast.LONG);
    }
  };

  navigateToScreen = (page, params = {}) => () => {
    if (page == "OTPScreen") {
      const { onBack } = this.props.navigation.state.params;
      this.props.navigation.navigate(page, { onBack });
    } else {
      this.props.navigation.navigate(page, params);
    }
  };

  socialLogin = social => {
    const { onBack, needBilling } = this.props.navigation.state.params;
    if (social == "google") {
      GoogleSignin.signIn().then(user => {
        let details = user.user;
        details.mode = "google";
        this.setState({ loader: true });
        domainApi.post("/social-login", details).then(({ data }) => {
          console.log(data);
          if (data.code == 1) {
            this.setState({ loader: false });
            this.props.Signin(data.details);
            onBack && onBack();
            if (
              needBilling &&
              (data.details.billing.email == "" || data.details.billing.phone == "")
            ) {
              this.props.navigation.navigate("BillingDetails", {
                ...this.props.navigation.state.params
              });
            } else {
              this.goBack();
            }
            Toast.show("Login successful", Toast.LONG);
          } else {
            this.setState({ loader: false });
            Toast.show("Wrong Email / Password.", Toast.LONG);
          }
        });
      });
    } else {
      LoginManager.logInWithPermissions(["public_profile", "email"]).then(
        result => {
          if (result.isCancelled) {
            Toast.show("Login cancelled", Toast.LONG);
          } else {
            AccessToken.getCurrentAccessToken().then(data => {
              const infoRequest = new GraphRequest(
                "/me?fields=id,first_name,last_name,email,name",
                { accessToken: data.accessToken },
                (error, result) => {
                  if (error) {
                    Toast.show(error.toString(), Toast.LONG);
                    //console.log(error);
                  } else {
                    let details = result;
                    details.mode = "facebook";
                    console.log(result);
                    this.setState({ loader: true });
                    domainApi
                      .post("/social-login", details)
                      .then(({ data }) => {
                        console.log(data);
                        if (data.code == 1) {
                          this.setState({ loader: false });
                          this.props.Signin(data.details);
                          onBack && onBack();
                          this.goBack();
                          Toast.show("Login successful", Toast.SHORT);
                        } else {
                          this.setState({ loader: false });
                          Toast.show("Login Failed", Toast.SHORT);
                        }
                      })
                      .catch(err => {
                        this.setState({ loader: false });
                        Toast.show(err.toString(), Toast.SHORT);
                      });
                  }
                }
              );
              new GraphRequestManager().addRequest(infoRequest).start();
            });
          }
        },
        error => {
          //console.log("Login fail with error: " + error);
        }
      );
    }
  };

  goBack = () => {
    this.props.navigation.goBack(null);
  };

  render() {
    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "#E4EAF6" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <View
            style={{
              flexDirection: "row",
              height: 56,
              alignItems: "center",
              backgroundColor: "#E4EAF6"
            }}>
            <Button onPress={this.goBack} style={{ padding: 16 }}>
              <Icon name="md-arrow-back" size={24} />
            </Button>
            <Text
              style={{ fontSize: 18, color: "#1E293B", paddingHorizontal: 8, fontWeight: "100" }}>
              Login
            </Text>
          </View>

          <ScrollView style={{ flex: 1 }}>
            <View style={{ marginTop: 20, marginHorizontal: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: "600" }}>Welcome To</Text>
              <Text style={{ fontSize: 20, fontWeight: "600" }}>TripDesire</Text>
            </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginVertical: 20,
                marginHorizontal: 20
              }}>
              <TextInputComponent
                label="Email*"
                placeholder="Enter the email"
                value={this.state.email}
                onChangeText={text => this.setState({ email: text })}
              />
              <TextInputComponent
                secureTextEntry={true}
                label="Password*"
                placeholder="Enter the password"
                value={this.state.password}
                onChangeText={text => this.setState({ password: text })}
              />
              <Button style={styles.button} onPress={this.login}>
                <Text style={{ color: "#fff" }}>Login</Text>
              </Button>
              <View style={{ flexDirection: "row", justifyContent: "center", marginVertical: 20 }}>
                <Button style={{ marginEnd: 5 }} onPress={this.navigateToScreen("ForgetPassword")}>
                  <Text style={{ color: "#000" }}>Forget Password ?</Text>
                </Button>
                <Button style={{ marginStart: 5 }} onPress={this.navigateToScreen("SignUp")}>
                  <Text style={{ color: "#000" }}>Register here ?</Text>
                </Button>
              </View>
              <View
                style={{
                  height: 1.35,
                  backgroundColor: "#D2D1D1",
                  width: "30%"
                }}></View>
              <View
                style={{
                  backgroundColor: "#E6E6E6",
                  height: 30,
                  width: 30,
                  marginTop: -21,
                  borderRadius: 15,
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                <Text>Or</Text>
              </View>
              <Button
                style={[styles.facebook_google_button, { marginTop: 20 }]}
                onPress={this.navigateToScreen("OTPScreen")}>
                <Text style={{ color: "#D2D1D1" }}>Login via OTP</Text>
              </Button>
              <Button
                style={[styles.facebook_google_button, { marginTop: 10 }]}
                onPress={() => this.socialLogin("google")}>
                <Image source={require("../assets/imgs/google.png")} />
                <Text style={{ color: "#D2D1D1" }}>Login by Google</Text>
              </Button>
              <Button
                style={[styles.facebook_google_button, { marginTop: 10 }]}
                onPress={() => this.socialLogin("facebook")}>
                <Image
                  style={{ width: 40, height: 40 }}
                  resizeMode="contain"
                  source={require("../assets/imgs/facebook.png")}
                />
                <Text style={{ color: "#D2D1D1", marginStart: 5 }}>Login by Facebook</Text>
              </Button>
            </View>
          </ScrollView>
          {this.state.loader && <ActivityIndicator />}
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#F68E1F",
    height: 48,
    marginTop: 40,
    width: 200,
    marginHorizontal: 50,
    paddingHorizontal: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25
  },
  facebook_google_button: {
    flexDirection: "row",
    backgroundColor: "#Fff",
    height: 48,
    width: 200,
    borderWidth: 1,
    borderColor: "#D2D1D1",
    marginHorizontal: 50,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25
  }
});

const mapDispatchToProps = {
  Signin
};

export default connect(null, mapDispatchToProps)(SignIn);
