import React, { Component } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { _ } from "lodash";
import { connect } from "react-redux";
import Toast from "react-native-simple-toast";
import { Text, Button, ActivityIndicator, Icon } from "../components";
import { Signin } from "../store/action";
import { domainApi } from "../service";
import SmoothPinCodeInput from "react-native-smooth-pincode-input";

class OTPVerify extends Component {
  constructor(props) {
    super(props);
    const { phone, country_code } = this.props.navigation.state.params;
    this.state = {
      loading: false,
      timer: null,
      counter: 0,
      code: "",
      phone,
      country_code
    };
  }

  componentDidMount() {
    let timer = setInterval(this.tick, 1000);
    this.setState({ timer, counter: 30 });
  }

  componentWillUnmount() {
    clearInterval(this.state.timer);
  }
  tick = () => {
    if (this.state.counter < 0) {
      clearInterval(this.state.timer);
    } else {
      this.setState({
        counter: this.state.counter - 1
      });
    }
  };

  resendOTP = () => {
    this.setState({ loading: true });
    domainApi
      .get("/sendOTP", {
        phone: this.state.phone,
        country_code: this.state.country_code,
        resend: true
      })
      .then(({ data }) => {
        if (data.type == "failed") {
          Toast.show(data.message, Toast.LONG);
          this.setState({ loading: false });
        } else {
          Toast.show("OTP has been send", Toast.LONG);
          let timer = setInterval(this.tick, 1000);
          this.setState({ loading: false, code: "", timer, counter: 30 });
        }
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  };
  verifyOTP = () => {
    const { phone, country_code, code: otp } = this.state;
    const { onBack } = this.props.navigation.state.params;

    if (otp.length < 4) {
      Toast.show("Please Enter OTP");
      return;
    }
    this.setState({ loading: true });
    domainApi
      .get("/verifyOTP", { phone, country_code, otp })
      .then(({ data }) => {
        this.setState({ loading: false });
        if (data.code == 1) {
          this.setState({ loader: false });
          this.props.Signin(data.details);
          onBack && onBack();
          //this.props.navigation.pop(3);
          this.props.navigation.goBack(null);
          this.props.navigation.goBack(null);
          this.props.navigation.goBack(null);
          Toast.show("Login successful", Toast.LONG);
        } else {
          this.setState({ loader: false });
          Toast.show("Login / Signup Failed.", Toast.LONG);
        }
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  };

  navigateToScreen = (route, params = {}) => () => {
    this.props.navigation.navigate(route, params);
  };

  render() {
    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "#E4EAF6" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "grey" }}>
          <View style={styles.header}>
            <Button onPress={() => this.props.navigation.goBack(null)} style={{ padding: 16 }}>
              <Icon name="md-arrow-back" size={24} />
            </Button>
            <Text style={styles.headerTitle}>OTP Verify</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: "#FFFFFF", alignItems: "center" }}>
            <Text style={{ fontWeight: "700", fontSize: 18, marginTop: 100 }}>
              An OTP has been sent to you
            </Text>
            <Text style={{ fontWeight: "700", fontSize: 18 }}>on your Mobile Number</Text>

            <SmoothPinCodeInput
              value={this.state.code}
              containerStyle={{ marginTop: 40 }}
              onTextChange={code => this.setState({ code })}
              restrictToNumbers
              cellStyle={{
                borderRadius: 4,
                elevation: 1,
                shadowOpacity: 0.2,
                shadowRadius: 1,
                shadowOffset: { height: 1, width: 0 },
                borderWidth: 0,
                borderColor: "#92CE00",
                backgroundColor: "#FFFFFF"
              }}
              cellStyleFocused={{ borderWidth: 1 }}
            />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingTop: 20
              }}>
              <Text>Didn't recieve?</Text>
              {this.state.counter > 0 ? (
                <Text style={{ color: "#F79221", fontWeight: "600" }}>
                  {" "}
                  Resend ({this.state.counter})
                </Text>
              ) : (
                <Button onPress={this.resendOTP}>
                  <Text style={{ color: "#F79221", fontWeight: "600" }}> Resend</Text>
                </Button>
              )}
            </View>

            <Button onPress={this.verifyOTP} style={styles.button}>
              <Text style={{ fontWeight: "800", fontSize: 16, color: "#ffffff" }}>Continue</Text>
            </Button>
          </View>
          {this.state.loading && <ActivityIndicator />}
        </SafeAreaView>
      </>
    );
  }
}

const mapDispatchToProps = { Signin };
export default connect(null, mapDispatchToProps)(OTPVerify);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    alignItems: "center",
    justifyContent: "center"
  },
  header: {
    flexDirection: "row",
    paddingEnd: 16,
    height: 48,
    alignItems: "center",
    backgroundColor: "#E4EAF6"
  },
  headerTitle: {
    color: "#1E293B",
    fontWeight: "700",
    fontSize: 16
  },
  headerImage: {
    position: "absolute",
    top: 0,
    end: 0
  },
  footerImage: {
    position: "absolute",
    bottom: 0,
    start: 0
  },
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
  }
});
