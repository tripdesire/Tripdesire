import React from "react";
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
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
import axios from "axios";
import analytics from "@react-native-firebase/analytics";

class SignUp extends React.PureComponent {
  constructor(props) {
    GoogleSignin.configure({
      //iosClientId: "700390422426-jd4ktatcufq8ncqd6p3728be7c3cl3bj.apps.googleusercontent.com"
    });
    super(props);
    this.state = {
      loader: false,
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      openPopup: false,
      modal_loading: false,
      showPassword: true,
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
    this.trackScreenView("SignUp");
  }

  _showPassword = () => {
    this.setState({ showPassword: this.state.showPassword == true ? false : true });
  };

  signUp = () => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let params = {
      fname: this.state.firstname,
      lname: this.state.lastname,
      email: this.state.email,
      password: this.state.password
    };
    var bodyFormData = new FormData();
    bodyFormData.append("fname", this.state.firstname);
    bodyFormData.append("lname", this.state.lastname);
    bodyFormData.append("email", this.state.email);
    bodyFormData.append("password", this.state.password);
    console.log(params);
    if (
      this.state.firstname != "" &&
      this.state.lastname != "" &&
      this.state.email != "" &&
      this.state.password != ""
    ) {
      if (reg.test(this.state.email) === true) {
        this.setState({ loader: true });
        domainApi
          .post("/register", bodyFormData, {
            config: { headers: { "Content-Type": "multipart/form-data" } }
          })
          .then(({ data }) => {
            if (data.status == 1) {
              console.log(data);
              this.setState({ loader: false, userId: data.user_id });
              //Toast.show("Successful Signup! Login now", Toast.LONG);
              this.setState({ openPopup: true });
            } else {
              this.setState({ loader: false });
              Toast.show(data.error, Toast.LONG);
            }
          })
          .catch(() => {
            this.setState({ loader: false });
          });
      } else {
        Toast.show("Please enter the correct email address", Toast.LONG);
      }
    } else {
      Toast.show("Please fill all the details", Toast.LONG);
    }
  };

  _Social_login = social => {
    const { needBilling } = this.props.navigation.state.params;
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
            if (data.refer_earn) {
              this.setState({ openPopup: true });
            } else if (
              needBilling &&
              (data.details.billing.email == "" || data.details.billing.phone == "")
            ) {
              this.props.navigation.navigate("BillingDetails", {
                ...this.props.navigation.state.params
              });
            } else {
              this.props.navigation.goBack(null);
              this.props.navigation.goBack(null);
            }
            // Toast.show("Login successful", Toast.LONG);
          } else {
            this.setState({ loader: false });
            Toast.show("Username/Password does not match", Toast.LONG);
          }
        });
      });
    } else if (social == "facebook") {
      LoginManager.logInWithPermissions(["public_profile", "email"]).then(
        result => {
          if (result.isCancelled) {
            //console.log("Login cancelled");
          } else {
            AccessToken.getCurrentAccessToken().then(data => {
              const infoRequest = new GraphRequest(
                "/me?fields=id,first_name,last_name,email,name",
                { accessToken: data.accessToken },
                (error, result) => {
                  if (error) {
                    //console.log(error);
                  } else {
                    let details = result;
                    details.mode = "facebook";
                    console.log(result);
                    this.setState({ loader: true });
                    domainApi.post("/social-login", details).then(({ data }) => {
                      console.log(data);
                      if (data.code == 1) {
                        this.setState({ loader: false });
                        this.props.Signin(data.details);
                        if (data.refer_earn) {
                          this.setState({ openPopup: true });
                        }
                        this.props.navigation.goBack(null);
                        this.props.navigation.goBack(null);
                        // Toast.show("you are signup successfully", Toast.LONG);
                      } else {
                        this.setState({ loader: false });
                        Toast.show("Please try again", Toast.LONG);
                      }
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

  navigateToScreen = (page, params = {}) => () => {
    const { onBack } = this.props.navigation.state.params;
    this.props.navigation.navigate(page, { onBack });
  };

  goBack = () => {
    const { backToAccount } = this.props.navigation.state.params;
    if (backToAccount) {
      this.props.navigation.goBack(null);
      this.props.navigation.goBack(null);
    } else {
      this.props.navigation.goBack(null);
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
        console.log(data);
        this.setState({ modal_loading: false });
        if (data.status == 1) {
          if (onBack) {
            onBack();
          } else {
            this.goBack();
          }
        }
        Toast.show(data.message, Toast.LONG);
        console.log(data);
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
    const { loader } = this.state;
    return (
      <>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        <SafeAreaView style={{ flex: 0, backgroundColor: "#000000" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <View>
            <View
              style={{
                flexDirection: "row",
                height: 56,
                alignItems: "center",
                paddingHorizontal: 16,
                backgroundColor: "#E4EAF6"
              }}>
              <Button onPress={this.goBack}>
                <Icon name="md-arrow-back" size={24} />
              </Button>
              <Text
                style={{
                  fontSize: 18,
                  color: "#1E293B",
                  paddingHorizontal: 16
                }}>
                Sign Up
              </Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ marginTop: 20, marginHorizontal: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: "500" }}>Welcome To Trip Desire</Text>
                <Text style={{ fontSize: 10, color: "#757575" }}>Sign Up to Continue</Text>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 20,
                  marginHorizontal: 20,
                  borderRadius: 10
                }}>
                <TextInputComponent
                  label="First Name*"
                  //  placeholder="Enter the firstName"
                  value={this.state.firstname}
                  //imgpath={require("../assets/imgs/profile.png")}
                  onChangeText={text => this.setState({ firstname: text })}
                />
                <TextInputComponent
                  label="Last Name"
                  // placeholder="Enter the lastName"
                  value={this.state.lastname}
                  // imgpath={require("../assets/imgs/profile.png")}
                  onChangeText={text => this.setState({ lastname: text })}
                />
                <TextInputComponent
                  label="Email*"
                  //  placeholder="Enter the email"
                  value={this.state.email}
                  //imgpath={require("../assets/imgs/email.png")}
                  onChangeText={text => this.setState({ email: text })}
                />

                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    paddingTop: 14,
                    borderBottomWidth: 1,
                    borderBottomColor: this.state.isFocus ? "#5789FF" : "#EAEBEF"
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
                          { paddingVertical: Platform.OS == "ios" ? 8 : null }
                        ]}
                        onFocus={this.onfocus}
                        onBlur={this.onblur}
                        onChangeText={text => this.setState({ password: text })}
                        placeholderTextColor={"#D9D8DD"}></TextInput>
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

                <Button style={styles.button} onPress={this.signUp}>
                  <Text style={{ color: "#fff" }}>Sign Up</Text>
                </Button>

                <View style={{ flexDirection: "row", justifyContent: "center" }}>
                  <Button style={{ marginEnd: 5 }}>
                    <Text style={{ color: "#757575", fontSize: 12 }}>
                      Already have an account ?
                    </Text>
                  </Button>
                  <Button style={{ marginStart: 5 }} onPress={this.navigateToScreen("SignIn")}>
                    <Text style={{ color: "#5B89F9", fontSize: 12 }}>Sign In</Text>
                  </Button>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 20 }}>
                  <View style={styles.line}></View>
                  <Text style={{ marginHorizontal: 5, fontSize: 10, color: "#757575" }}>
                    Or Sign Up with
                  </Text>
                  <View style={styles.line}></View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    flex: 1,
                    justifyContent: "space-around",
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
                      style={[styles.facebook_google_button]}
                      onPress={() => this._Social_login("google")}>
                      <Image style={styles.img} source={require("../assets/imgs/googleNew.png")} />
                    </Button>
                    <Text style={styles.socialMediaLabel}>Google</Text>
                  </View>
                  <View style={{ alignItems: "center" }}>
                    <Button
                      style={[styles.facebook_google_button]}
                      onPress={() => this._Social_login("facebook")}>
                      <Image
                        style={styles.img}
                        source={require("../assets/imgs/facebookNew.png")}
                      />
                    </Button>
                    <Text style={styles.socialMediaLabel}>Facebook</Text>
                  </View>
                </View>
              </View>
            </ScrollView>
            {loader && <ActivityIndicator />}

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
          </View>
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
    marginVertical: 30,
    marginHorizontal: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25
  },
  facebook_google_button: {
    flexDirection: "row",
    backgroundColor: "#Fff",
    height: 40,
    width: 40,
    // borderWidth: 1,
    // borderColor: "#D2D1D1",
    marginHorizontal: 20,
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
    borderBottomColor: "#D2D1D1",
    width: "100%",
    fontSize: 16,
    paddingStart: 5
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

const mapDispatchToProps = {
  Signin
};

export default connect(null, mapDispatchToProps)(SignUp);
