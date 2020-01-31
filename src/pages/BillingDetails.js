import React, { PureComponent } from "react";
import { View, StatusBar, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import Toast from "react-native-simple-toast";
import { etravosApi, domainApi } from "../service";
import moment from "moment";
import { isEmpty } from "lodash";
import { Button, Text, TextInputComponent, ActivityIndicator, Icon } from "../components";
import { connect } from "react-redux";
import { Signup, Signin, Billing } from "../store/action";

class BillingDetails extends React.PureComponent {
  constructor(props) {
    super(props);
    const { user } = this.props;
    this.state = {
      loader: false,
      firstname: user.billing.first_name,
      lastname: user.billing.last_name,
      email: user.billing.email,
      phone: user.billing.phone,
      streetAddress: user.billing.address_1,
      city: user.billing.city,
      // company: user.billing.company,
      streetAddress1: user.billing.address_2,
      state: user.billing.state,
      postcode: user.billing.postcode,
      country: user.billing.country
    };
  }

  _Submit = () => {
    const { needBilling, needBillingOnly } = this.props.navigation.state.params;

    const {
      firstname,
      lastname,
      email,
      phone,
      streetAddress,
      city,
      // company,
      streetAddress1,
      state,
      postcode,
      country
    } = this.state;
    let param = {
      user_id: this.props.user.id,
      billing_first_name: firstname,
      billing_last_name: lastname,
      //  billing_company: company,
      billing_email: email,
      billing_phone: phone,
      billing_address_1: streetAddress,
      billing_address_2: streetAddress1,
      billing_city: city,
      billing_state: state,
      billing_postcode: postcode,
      billing_country: country
    };

    let redux = {
      first_name: firstname,
      last_name: lastname,
      company: "",
      address_1: streetAddress,
      address_2: streetAddress1,
      city: city,
      postcode: postcode,
      country: country,
      state: state,
      email: email,
      phone: phone
    };

    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (
      firstname === "" &&
      lastname === "" &&
      streetAddress === "" &&
      streetAddress1 === "" &&
      city === "" &&
      postcode === "" &&
      country === "" &&
      state === "" &&
      email === "" &&
      phone === ""
    ) {
      Toast.show("Please fill deatils", Toast.LONG);
    } else {
      if (email != "" && reg.test(email) == false) {
        Toast.show("Please enter the correct email", Toast.LONG);
      } else {
        this.setState({ loader: true });
        domainApi.post("/checkout/update-billing", param).then(({ data }) => {
          console.log(data);
          this.setState({ loader: false });
          if (data.status == 1) {
            this.props.Billing(redux);
            if (needBilling) {
              this.props.navigation.goBack(null);
              this.props.navigation.goBack(null);
            } else if (needBillingOnly) {
              this.props.navigation.goBack(null);
            }
            Toast.show(data.msg, Toast.LONG);
          } else {
            Toast.show("You didn't update your billing address", Toast.LONG);
          }
        });
      }
    }
  };

  render() {
    const {
      firstname,
      lastname,
      email,
      phone,
      streetAddress,
      city,
      company,
      streetAddress1,
      state,
      postcode,
      country,
      loader
    } = this.state;
    return (
      <>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        <SafeAreaView style={{ flex: 0, backgroundColor: "#000000" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                height: 56,
                alignItems: "center",
                paddingEnd: 16,
                backgroundColor: "#E4EAF6"
              }}>
              <Button onPress={() => this.props.navigation.goBack(null)} style={{ padding: 16 }}>
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
                Billing Address
              </Text>
            </View>
            <ScrollView contentContainerStyle={{ marginHorizontal: 16 }}>
              <TextInputComponent
                label="First Name"
                placeholder="Enter the first name"
                value={firstname}
                onChangeText={text => this.setState({ firstname: text })}
              />
              <TextInputComponent
                label="Last Name"
                placeholder="Enter the last name"
                value={lastname}
                onChangeText={text => this.setState({ lastname: text })}
              />
              <TextInputComponent
                label="Email"
                placeholder="Enter the email"
                value={email}
                onChangeText={text => this.setState({ email: text })}
              />
              <TextInputComponent
                keyboardType="numeric"
                label="Phone"
                placeholder="Enter the phone number"
                value={phone}
                onChangeText={text => this.setState({ phone: text })}
              />
              <TextInputComponent
                label="Address Line 1"
                placeholder="Enter the address line 1"
                value={streetAddress}
                onChangeText={text => this.setState({ streetAddress: text })}
              />
              <TextInputComponent
                label="Address Line 2"
                placeholder="Enter the address line 2"
                value={streetAddress1}
                onChangeText={text => this.setState({ streetAddress1: text })}
              />
              <TextInputComponent
                label="PostCode"
                placeholder="Enter the post code"
                value={postcode}
                onChangeText={text => this.setState({ postcode: text })}
              />
              <TextInputComponent
                label="City/Town"
                placeholder="Enter the city"
                value={city}
                onChangeText={text => this.setState({ city: text })}
              />
              {/* <TextInputComponent
                label="Company"
                placeholder="Enter the company"
                value={company}
                onChangeText={text => this.setState({ company: text })}
              /> */}
              <TextInputComponent
                label="State"
                placeholder="Enter the State"
                value={state}
                onChangeText={text => this.setState({ state: text })}
              />
              <TextInputComponent
                label="Country"
                placeholder="Enter the country"
                value={country}
                onChangeText={text => this.setState({ country: text })}
              />
              <View style={{ alignItems: "center" }}>
                <Button style={styles.button} onPress={this._Submit}>
                  <Text style={{ color: "#fff" }}>Submit</Text>
                </Button>
              </View>
            </ScrollView>
            {loader && <ActivityIndicator />}
          </View>
        </SafeAreaView>
      </>
    );
  }
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: "#F68E1F",
    height: 36,
    width: 200,
    marginVertical: 40,
    paddingHorizontal: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25
  }
});

const mapDispatchToProps = {
  Signin,
  Billing
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, mapDispatchToProps)(BillingDetails);
