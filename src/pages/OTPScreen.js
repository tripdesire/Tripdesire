import React from "react";
import { View, StyleSheet, TextInput, SafeAreaView } from "react-native";
import CountryPicker, { getCallingCode, getAllCountries } from "react-native-country-picker-modal";
import { domainApi } from "../service";
import Toast from "react-native-simple-toast";
import { Text, Button, ActivityIndicator, Icon } from "../components";

class OTPScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      country_code: "IN",
      phone: ""
    };
  }

  sendOTP = () => {
    const { onBack } = this.props.navigation.state.params;

    if (this.state.phone == "" || this.state.phone.length < 4 || this.state.phone.length > 13) {
      Toast.show("Phone number is not valid", Toast.LONG);
      return;
    }
    this.setState({ loading: true });
    domainApi
      .get("/sendOTP", {
        phone: this.state.phone,
        country_code: getCallingCode(this.state.country_code)
      })
      .then(({ data }) => {
        this.setState({ loading: false });
        if (data.type == "failed") {
          Toast.show(data.message, Toast.LONG);
        } else {
          this.navigateToScreen("OTPVerify", {
            phone: this.state.phone,
            country_code: getCallingCode(this.state.country_code),
            onBack
          });
        }
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  };

  navigateToScreen = (route, params = {}) => {
    this.props.navigation.navigate(route, params);
  };

  updateState = key => value => {
    this.setState({ [key]: value });
  };

  onCountrySelect = val => {
    this.setState({ country_code: val.cca2 || "IN" });
  };
  getCountryCodeByCallingCode(callingCode) {
    callingCode = callingCode.replace("+", "");
    let country = getAllCountries().find(item => callingCode === item.cca2);
    if (country) {
      return country.cca2;
    } else {
      return "IN";
    }
  }

  render() {
    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "#E4EAF6" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "grey" }}>
          <View style={styles.header}>
            <Button onPress={() => this.props.navigation.goBack(null)} style={{ padding: 16 }}>
              <Icon name="md-arrow-back" size={24} />
            </Button>
            <Text style={styles.headerTitle}>OTP</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: "#FFFFFF", alignItems: "center" }}>
            <Text style={styles.login_txt}>
              We will send you the otp to {"\n"}authenticate your account
            </Text>
            <View style={styles.rowView}>
              <CountryPicker
                withCallingCode
                withCallingCodeButton
                countryCode={this.getCountryCodeByCallingCode(this.state.country_code)}
                withFilter
                containerButtonStyle={styles.countryPickerContainer}
                onSelect={this.onCountrySelect}
              />
              <TextInput
                placeholder="Phone Number"
                keyboardType="phone-pad"
                value={this.state.phone}
                onChangeText={this.updateState("phone")}
                style={{ flex: 1 }}
              />
            </View>

            <Button onPress={this.sendOTP} style={styles.button}>
              <Text style={{ fontWeight: "800", fontSize: 16, color: "#ffffff" }}>Next</Text>
            </Button>
          </View>
          {this.state.loading && <ActivityIndicator />}
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20
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
  countryPickerContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: Platform.OS == "ios" ? 0 : 10,
    elevation: 1,
    marginEnd: 10,
    shadowOpacity: 0.2,
    shadowRadius: 1,
    shadowOffset: { height: 1, width: 0 }
  },
  rowView: {
    marginTop: 30,
    paddingHorizontal: 16,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between"
  },
  login_txt: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: "25%"
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

export default OTPScreen;
