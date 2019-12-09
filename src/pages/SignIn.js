import React, { PureComponent } from "react";
import {
  View,
  Image,
  StyleSheet,
  TextInput,
  Dimensions,
  ToastAndroid,
  ScrollView
} from "react-native";
import Toast from "react-native-simple-toast";
import Icon from "react-native-vector-icons/AntDesign";
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";
import Stars from "react-native-stars";
import { etravosApi, domainApi } from "../service";
import moment from "moment";
import { Button, Text, TextInputComponent } from "../components";
import { connect } from "react-redux";
import { Signup, Signin } from "../store/action";
import axios from "axios";

class SignIn extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
  }

  navigateToScreen = () => {
    console.log(this.state);
    if (this.state.email != "" && this.state.password != "") {
      domainApi.post("/login", this.state).then(({ data }) => {
        console.log(data);
        if (data.code == "1") {
          this.props.Signin(data.details);
          this.props.navigation.navigate("Home");
        } else {
          Toast.show("Wrong Email And Password.", ToastAndroid.SHORT);
        }
      });
    } else {
      Toast.show("Please enter the email and password.", ToastAndroid.SHORT);
    }
  };

  NavigateToScreen = page => () => {
    this.props.navigation.navigate(page);
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            height: 56,
            alignItems: "center",
            paddingHorizontal: 16,
            backgroundColor: "#E4EAF6"
          }}>
          <Text style={{ fontSize: 18, color: "#1E293B", marginStart: 10, fontWeight: "100" }}>
            Login
          </Text>
        </View>

        <ScrollView style={{ flex: 4 }}>
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
              label="Password*"
              placeholder="Enter the password"
              value={this.state.password}
              onChangeText={text => this.setState({ password: text })}
            />
            <Button style={styles.button} onPress={this.navigateToScreen}>
              <Text style={{ color: "#fff" }}>Login</Text>
            </Button>
            <View style={{ flexDirection: "row", justifyContent: "center", marginVertical: 20 }}>
              <Button style={{ marginEnd: 5 }} onPress={this.NavigateToScreen("ForgetPassword")}>
                <Text style={{ color: "#000" }}>Forget Password ?</Text>
              </Button>
              <Button style={{ marginStart: 5 }} onPress={this.NavigateToScreen("SignUp")}>
                <Text style={{ color: "#000" }}>Regiter here ?</Text>
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
            <Button style={[styles.facebook_google_button, { marginTop: 20 }]}>
              <Image source={require("../assets/imgs/google.png")} />
              <Text style={{ color: "#D2D1D1" }}>Sign Up by Google</Text>
            </Button>
            <Button style={[styles.facebook_google_button, { marginTop: 10 }]}>
              <Image
                style={{ width: 40, height: 40 }}
                resizeMode="contain"
                source={require("../assets/imgs/facebook.png")}
              />
              <Text style={{ color: "#D2D1D1", marginStart: 5 }}>Sign Up by Facebook</Text>
            </Button>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#F68E1F",
    height: 48,
    marginTop: 40,
    marginHorizontal: 50,
    paddingHorizontal: 80,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25
  },
  facebook_google_button: {
    flexDirection: "row",
    backgroundColor: "#Fff",
    height: 48,
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

const mapStateToProps = state => ({
  signUp: state.signUp
});

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
