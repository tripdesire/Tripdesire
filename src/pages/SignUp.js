import React from "react";
import { View, Image, StyleSheet, ScrollView, Dimensions, TextInput } from "react-native";
import Toast from "react-native-simple-toast";
import { domainApi } from "../service";
import { Button, Text, TextInputComponent, ActivityIndicator, Icon } from "../components";
import { connect } from "react-redux";
import { Signin } from "../store/action";
import { GoogleSignin } from "@react-native-community/google-signin";
import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from "react-native-fbsdk";
import axios from "axios";

class SignUp extends React.PureComponent {
  constructor(props) {
    GoogleSignin.configure({
      iosClientId: "700390422426-jd4ktatcufq8ncqd6p3728be7c3cl3bj.apps.googleusercontent.com"
    });
    super(props);
    this.state = {
      loader: false,
      firstname: "",
      lastname: "",
      email: "",
      password: ""
    };
  }

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
    if (this.state.firstname != "" && this.state.email != "" && this.state.password != "") {
      if (reg.test(this.state.email) === true) {
        this.setState({ loader: true });
        domainApi
          .post("/register", bodyFormData, {
            config: { headers: { "Content-Type": "multipart/form-data" } }
          })
          .then(response => {
            if (response.data.status == 1) {
              console.log(response);
              this.setState({ loader: false });
              Toast.show("Successful Signup! Login now", Toast.LONG);
              this.props.navigation.goBack(null);
            } else {
              this.setState({ loader: false });
              Toast.show("Something went wrong", Toast.LONG);
            }
          })
          .catch(() => {
            this.setState({ loader: false });
          });
      } else {
        Toast.show("Please fill all fields", Toast.LONG);
      }
    }
  };

  _Social_login = social => {
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
            this.props.navigation.goBack(null);
            Toast.show("Login successful", Toast.LONG);
          } else {
            this.setState({ loader: false });
            Toast.show("Wrong Email / Password.", Toast.LONG);
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
                        if (isCheckout) {
                          this.goBack();
                        } else {
                          this.props.navigation.navigate("Home");
                        }
                        Toast.show("you are login successfully", Toast.LONG);
                      } else {
                        this.setState({ loader: false });
                        Toast.show("you are not login successfully", Toast.LONG);
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

  render() {
    const { loader } = this.state;
    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            height: 56,
            alignItems: "center",
            paddingHorizontal: 16,
            backgroundColor: "#E4EAF6"
          }}>
          <Button onPress={() => this.props.navigation.goBack(null)}>
            <Icon name="md-arrow-back" size={24} />
          </Button>
          <Text
            style={{
              fontSize: 18,
              color: "#1E293B",
              marginStart: 10,
              fontWeight: "700",
              lineHeight: 24
            }}>
            Register
          </Text>
        </View>
        <ScrollView>
          <View style={{ marginTop: 20, marginHorizontal: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: "600" }}>Welcome To</Text>
            <Text style={{ fontSize: 20, fontWeight: "600" }}>TripDesire</Text>
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
              label="FirstName"
              placeholder="Enter the firstName"
              value={this.state.firstname}
              imgpath={require("../assets/imgs/profile.png")}
              onChangeText={text => this.setState({ firstname: text })}
            />
            <TextInputComponent
              label="LastName"
              placeholder="Enter the lastName"
              value={this.state.lastname}
              imgpath={require("../assets/imgs/profile.png")}
              onChangeText={text => this.setState({ lastname: text })}
            />
            <TextInputComponent
              label="Email"
              placeholder="Enter the email"
              value={this.state.email}
              imgpath={require("../assets/imgs/email.png")}
              onChangeText={text => this.setState({ email: text })}
            />
            <TextInputComponent
              label="Password"
              placeholder="Enter the password"
              value={this.state.password}
              imgpath={require("../assets/imgs/password.png")}
              onChangeText={text => this.setState({ password: text })}
            />
            <Button style={styles.button} onPress={this.signUp}>
              <Text style={{ color: "#fff" }}>Sign Up</Text>
            </Button>
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
              onPress={() => this._Social_login("google")}>
              <Image source={require("../assets/imgs/google.png")} />
              <Text style={{ color: "#D2D1D1" }}>Sign Up by Google</Text>
            </Button>
            <Button
              style={[styles.facebook_google_button, { marginTop: 10, marginBottom: 60 }]}
              onPress={() => this._Social_login("facebook")}>
              <Image
                style={{ width: 40, height: 40 }}
                resizeMode="contain"
                source={require("../assets/imgs/facebook.png")}
              />
              <Text style={{ color: "#D2D1D1", marginStart: 5 }}>Sign Up by Facebook</Text>
            </Button>
            <View>
              {/* <LoginButton
                onLoginFinished={(error, result) => {
                  if (error) {
                    console.log("login has error: " + result.error);
                  } else if (result.isCancelled) {
                    console.log("login is cancelled.");
                  } else {
                    AccessToken.getCurrentAccessToken().then(data => {
                      console.log(data.accessToken.toString());
                    });
                  }
                }}
                onLogoutFinished={() => console.log("logout.")}
              /> */}
            </View>
          </View>
        </ScrollView>
        {loader && <ActivityIndicator />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#F68E1F",
    height: 48,
    width: 200,
    marginVertical: 40,
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
    color: "#A4A5AA"
  }
});

const mapDispatchToProps = {
  Signin
};

export default connect(null, mapDispatchToProps)(SignUp);
