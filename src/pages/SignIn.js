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
            Toast.show("Login successfully", Toast.SHORT);
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
              Sign In
            </Text>
          </View>

          <ScrollView style={{ flex: 1 }}>
            <View style={{ marginTop: 20, marginHorizontal: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: "500" }}>Welcome Back</Text>
              <Text style={{ fontSize: 10, color: "#A4A5AA" }}>Sign In to Continue</Text>
            </View>
            <View
              style={{
                justifyContent: "center",
                // alignItems: "center",
                marginVertical: 20,
                marginHorizontal: 20
              }}>
              <TextInputComponent
                label="Email Address*"
                // placeholder="Enter the email"
                value={this.state.email}
                onChangeText={text => this.setState({ email: text })}
              />
              <TextInputComponent
                secureTextEntry={true}
                label="Password*"
                // placeholder="Enter the password"
                value={this.state.password}
                onChangeText={text => this.setState({ password: text })}
              />
              <Button style={{ marginTop: 30 }} onPress={this.navigateToScreen("ForgetPassword")}>
                <Text style={{ color: "#A4A5AA", fontSize: 12 }}>Forget Password ?</Text>
              </Button>
              <Button style={styles.button} onPress={this.login}>
                <Text style={{ color: "#fff" }}> SIGN IN</Text>
              </Button>
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <Button style={{ marginEnd: 5 }} onPress={this.navigateToScreen("SignUp")}>
                  <Text style={{ color: "#A4A5AA", fontSize: 12 }}>Don't have an account ?</Text>
                </Button>
                <Button style={{ marginStart: 5 }} onPress={this.navigateToScreen("SignUp")}>
                  <Text style={{ color: "#5B89F9", fontSize: 12 }}>Sign Up</Text>
                </Button>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 20,
                  justifyContent: "center"
                }}>
                <View
                  style={{
                    height: 1.35,
                    backgroundColor: "#A4A5AA",
                    width: "10%"
                  }}></View>
                <Text style={{ marginHorizontal: 5, fontSize: 10, color: "#A4A5AA" }}>
                  Or Sign In with
                </Text>
                <View
                  style={{
                    height: 1.35,
                    backgroundColor: "#A4A5AA",
                    width: "10%"
                  }}></View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 20
                }}>
                <View style={{ alignItems: "center" }}>
                  <Button
                    style={[styles.facebook_google_button]}
                    onPress={this.navigateToScreen("OTPScreen")}>
                    <Image
                      style={{ width: 30, height: 30 }}
                      source={require("../assets/imgs/mobileIconNew.png")}
                    />
                  </Button>
                  <Text style={{ color: "#D2D1D1", fontSize: 10, marginTop: 5 }}>OTP</Text>
                </View>
                <View style={{ alignItems: "center" }}>
                  <Button
                    style={[styles.facebook_google_button, { marginHorizontal: 30 }]}
                    onPress={() => this.socialLogin("google")}>
                    <Image
                      style={{ width: 30, height: 30 }}
                      source={require("../assets/imgs/google.png")}
                    />
                  </Button>
                  <Text style={{ color: "#D2D1D1", fontSize: 10, marginTop: 5 }}>Google</Text>
                </View>
                <View style={{ alignItems: "center" }}>
                  <Button
                    style={[styles.facebook_google_button]}
                    onPress={() => this.socialLogin("facebook")}>
                    <Image
                      style={{ width: 30, height: 30 }}
                      source={require("../assets/imgs/facebookNew.png")}
                    />
                  </Button>
                  <Text style={{ color: "#D2D1D1", fontSize: 10, marginTop: 5 }}>Facebook</Text>
                </View>
              </View>
              {/* <Button
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
              </Button> */}
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
    width: "100%",
    backgroundColor: "#F68E1F",
    height: 36,
    alignSelf: "center",
    marginVertical: 30,
    marginHorizontal: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25
  },
  facebook_google_button: {
    backgroundColor: "#Fff",
    height: 40,
    width: 40,
    //borderWidth: 1,
    // borderColor: "#D2D1D1",
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    elevation: 2,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "rgba(0,0,0,0.2)",
    shadowOpacity: 1,
    shadowRadius: 4
  }
});

const mapDispatchToProps = {
  Signin
};

export default connect(null, mapDispatchToProps)(SignIn);
