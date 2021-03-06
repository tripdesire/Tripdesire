import React from "react";
import {
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  StatusBar
} from "react-native";
import Toast from "react-native-simple-toast";
import { domainApi } from "../service";
import { Button, Text, TextInputComponent, ActivityIndicator, Icon } from "../components";
import { connect } from "react-redux";
import { Signin } from "../store/action";
import { GoogleSignin } from "@react-native-community/google-signin";
import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from "react-native-fbsdk";
import analytics from "@react-native-firebase/analytics";

class SignIn extends React.PureComponent {
  constructor(props) {
    GoogleSignin.configure({
      //iosClientId: "700390422426-jd4ktatcufq8ncqd6p3728be7c3cl3bj.apps.googleusercontent.com"
    });
    super(props);
    this.state = {
      email: "",
      password: "",
      loader: false,
      showPassword: true,
      openPopup: false,
      modal_loading: false,
      referralCode: "",
      userId: "",
      isFocus: false
    };
  }

  onfocus = () => {
    this.setState({ isFocus: true });
  };

  onblur = () => {
    this.setState({ isFocus: false });
  };

  trackScreenView = async screen => {
    // Set & override the MainActivity screen name
    await analytics().setCurrentScreen(screen, screen);
  };
  componentDidMount() {
    this.trackScreenView("SignIn");
  }

  _showPassword = () => {
    this.setState({ showPassword: this.state.showPassword == true ? false : true });
  };

  login = () => {
    const { onBack, needBilling } = this.props.navigation.state.params;
    if (this.state.email != "" && this.state.password != "") {
      this.setState({ loader: true });
      let param = {
        email: this.state.email,
        password: this.state.password
      };
      domainApi
        .post("/login", param)
        .then(({ data }) => {
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
            //  Toast.show("Login successfully", Toast.SHORT);
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
          if (data.code == 1) {
            this.setState({ loader: false, userId: data.details.id });
            this.props.Signin(data.details);
            if (data.refer_earn) {
              this.setState({ openPopup: true });
            } else if (onBack) {
              onBack();
            } else if (
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
                    this.setState({ loader: true });
                    domainApi
                      .post("/social-login", details)
                      .then(({ data }) => {
                        if (data.code == 1) {
                          this.setState({ loader: false, userId: data.details.id });
                          this.props.Signin(data.details);
                          if (data.refer_earn) {
                            this.setState({ openPopup: true });
                          } else if (onBack) {
                            onBack();
                            this.goBack();
                          }
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

  applyReferral = () => {
    const { onBack, needBilling } = this.props.navigation.state.params;
    var formData = new FormData();
    formData.append("user_id", this.state.user_id);
    formData.append("refer_code", this.state.referralCode);
    this.setState({ modal_loading: true });
    domainApi
      .post("/referapply", formData, {
        headers: { "content-type": "multipart/form-data" }
      })
      .then(({ data }) => {
        this.setState({ modal_loading: false });
        if (data.status == 1) {
          if (onBack) {
            onBack();
          } else {
            this.goBack();
          }
        }
        Toast.show(data.message, Toast.LONG);
      })
      .catch(error => {
        this.setState({ modal_loading: false });
      });
  };

  handleSkip = () => {
    const { onBack } = this.props.navigation.state.params;
    this.setState({ openPopup: false });
    if (onBack) {
      onBack();
    } else {
      this.goBack();
    }
  };

  updateState = key => value => {
    this.setState({ [key]: value });
  };

  render() {
    return (
      <>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        <SafeAreaView style={{ flex: 0, backgroundColor: "#000000" }} />
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
            <Text style={{ fontSize: 18, color: "#1E293B", paddingHorizontal: 8 }}>Sign In</Text>
          </View>

          <ScrollView style={{ flex: 1 }}>
            <View style={{ marginTop: 20, marginHorizontal: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: "500" }}>Welcome Back</Text>
              <Text style={{ fontSize: 10, color: "#757575" }}>Sign In to Continue</Text>
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

              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  paddingTop: 14,
                  borderBottomWidth: 1,
                  borderBottomColor: this.state.isFocus ? "#5789FF" : "#D2D1D1"
                }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.text}>Password*</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      flex: 1,
                      alignItems: "center",
                      marginEnd: 16
                    }}>
                    <TextInput
                      secureTextEntry={this.state.showPassword}
                      style={[
                        styles.textinput,
                        {
                          paddingVertical: Platform.OS == "ios" ? 8 : null
                        }
                      ]}
                      onFocus={this.onfocus}
                      onBlur={this.onblur}
                      placeholderTextColor={"#D9D8DD"}
                      onChangeText={text => this.setState({ password: text })}></TextInput>
                    <Button onPress={this._showPassword}>
                      <Icon
                        name={
                          this.state.showPassword == true && Platform.OS != "ios"
                            ? "md-eye-off"
                            : this.state.showPassword == true && Platform.OS == "ios"
                            ? "ios-eye-off"
                            : this.state.showPassword == false && Platform.OS == "ios"
                            ? "ios-eye"
                            : "md-eye"
                        }
                        color="#5D666D"
                        size={20}
                      />
                    </Button>
                  </View>
                </View>
              </View>
              <Button style={{ marginTop: 30 }} onPress={this.navigateToScreen("ForgetPassword")}>
                <Text style={{ color: "#757575", fontSize: 12 }}>Forget Password ?</Text>
              </Button>
              <Button style={styles.button} onPress={this.login}>
                <Text style={{ color: "#fff" }}> SIGN IN</Text>
              </Button>
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <Button style={{ marginEnd: 5 }} onPress={this.navigateToScreen("SignUp")}>
                  <Text style={{ color: "#757575", fontSize: 12 }}>Don't have an account ?</Text>
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
                <View style={styles.line}></View>
                <Text style={{ marginHorizontal: 5, fontSize: 10, color: "#757575" }}>
                  Or Sign In with
                </Text>
                <View style={styles.line}></View>
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
                      style={styles.img}
                      source={require("../assets/imgs/mobileIconNew.png")}
                    />
                  </Button>
                  <Text style={styles.socialMediaLabel}>OTP</Text>
                </View>
                <View style={{ alignItems: "center" }}>
                  <Button
                    style={[styles.facebook_google_button, { marginHorizontal: 30 }]}
                    onPress={() => this.socialLogin("google")}>
                    <Image style={styles.img} source={require("../assets/imgs/googleNew.png")} />
                  </Button>
                  <Text style={styles.socialMediaLabel}>Google</Text>
                </View>
                <View style={{ alignItems: "center" }}>
                  <Button
                    style={[styles.facebook_google_button]}
                    onPress={() => this.socialLogin("facebook")}>
                    <Image style={styles.img} source={require("../assets/imgs/facebookNew.png")} />
                  </Button>
                  <Text style={styles.socialMediaLabel}>Facebook</Text>
                </View>
              </View>
            </View>
          </ScrollView>
          {this.state.loader && <ActivityIndicator />}
          {this.state.openPopup && (
            <View style={styles.modalOverlay}>
              <View style={styles.modalWrapper}>
                <View style={styles.modaltitleContainer}>
                  <Text>Referral Code</Text>
                  <Button style={{ padding: 12 }} onPress={this.handleSkip}>
                    <Text>Skip</Text>
                  </Button>
                </View>

                <TextInput
                  placeholder="Enter Code"
                  //keyboardType="numeric"
                  value={this.state.referralCode}
                  style={{
                    width: "100%",
                    borderWidth: 1,
                    borderColor: "#757575",
                    height: 40,
                    marginBottom: 15
                  }}
                  onChangeText={this.updateState("referralCode")}
                />

                {this.state.modal_loading ? (
                  <ActivityIndicator />
                ) : (
                  <Button onPress={this.applyReferral} style={styles.modalButton}>
                    <Text style={{ color: "#ffffff" }}>Next</Text>
                  </Button>
                )}
              </View>
            </View>
          )}
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
  },
  textinput: {
    width: "100%",
    fontSize: 16,
    paddingStart: 5,
    color: "#000"
  },
  text: {
    fontSize: 12,
    paddingStart: 5,
    color: "#757575"
  },
  modalOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "#00000066",
    justifyContent: "center",
    elevation: 2,
    shadowOpacity: 0.2,
    shadowRadius: 1,
    shadowOffset: { height: 2, width: 0 }
  },
  modalWrapper: {
    backgroundColor: "#EEEEEE",
    margin: 64,
    paddingHorizontal: 16,
    alignItems: "center"
  },
  modaltitleContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center"
  },
  modalButton: {
    height: 36,
    backgroundColor: "#F68E1F",
    paddingVertical: 8,
    paddingHorizontal: 30,
    marginBottom: 10,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center"
  },
  socialMediaLabel: { color: "#757575", fontSize: 10, marginTop: 5 },
  img: { width: 30, height: 30 },
  line: {
    height: 1.35,
    backgroundColor: "#757575",
    width: "10%"
  }
});

const mapStateToProps = state => ({ user: state.user });

const mapDispatchToProps = {
  Signin
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
