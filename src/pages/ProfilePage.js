import React, { PureComponent } from "react";
import { View, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import Toast from "react-native-simple-toast";
import { Button, Text, TextInputComponent, ActivityIndicator, Icon } from "../components";
import { connect } from "react-redux";
import { UpdateProfile } from "../store/action";
import { domainApi } from "../service";
import { LoginButton, AccessToken } from "react-native-fbsdk";

class ProfilePage extends React.PureComponent {
  constructor(props) {
    super(props);
    const { user } = this.props;
    this.state = {
      firstname: user.first_name,
      lastname: user.last_name,
      displayname: user.username,
      email: user.email,
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    };
  }

  _Submit = () => {
    const {
      firstname,
      lastname,
      displayname,
      email,
      currentPassword,
      newPassword,
      confirmPassword
    } = this.state;
    let param = {
      user_id: this.props.user.id,
      first_name: firstname,
      last_name: lastname,
      user_email: email,
      display_name: displayname,
      nickname: ""
    };
    let redux = {
      first_name: firstname,
      last_name: lastname,
      email: email
    };
    if (currentPassword != "" && newPassword != "" && confirmPassword != "") {
      param.current_pass = currentPassword;
      param.new_pass = newPassword;
      param.confirm_pass = confirmPassword;
    }

    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!reg.test(this.state.email)) {
      Toast.show("Your email address should not correctly", Toast.LONG);
    } else if (
      !(newPassword === "" && confirmPassword === "" && currentPassword === "") &&
      (newPassword === "" || confirmPassword === "" || currentPassword === "")
    ) {
      Toast.show("Enter Passwords", Toast.LONG);
    } else if (confirmPassword !== newPassword) {
      Toast.show("New password and confirm password can't different.", Toast.LONG);
    } else {
      domainApi.post("/login/update-user", param).then(({ data }) => {
        console.log(param);
        console.log(data);
        if (data.status == 1) {
          this.props.UpdateProfile(redux);
        } else {
          Toast.show("You didn't update your profile deatils", Toast.LONG);
        }
      });
    }
  };

  render() {
    const {
      firstname,
      lastname,
      displayname,
      email,
      currentPassword,
      newPassword,
      confirmPassword
    } = this.state;
    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "#E5EBF7" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <View style={{ flex: 1 }}>
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
                My Account
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
                label="Display Name"
                placeholder="Enter the display name"
                value={displayname}
                onChangeText={text => this.setState({ displayname: text })}
              />
              <TextInputComponent
                label="Email"
                placeholder="Enter the email"
                value={email}
                onChangeText={text => this.setState({ email: text })}
              />

              <Text style={{ marginTop: 20 }}>Password Change</Text>
              <TextInputComponent
                label="Current Password"
                placeholder="Enter the currrent password"
                value={currentPassword}
                onChangeText={text => this.setState({ currentPassword: text })}
              />
              <TextInputComponent
                label="New Password"
                placeholder="Enter the new password"
                value={newPassword}
                onChangeText={text => this.setState({ newPassword: text })}
              />
              <TextInputComponent
                label="Confirm Password"
                placeholder="Enter the confirm password"
                value={confirmPassword}
                onChangeText={text => this.setState({ confirmPassword: text })}
              />
              <View style={{ alignItems: "center" }}>
                <Button style={styles.button} onPress={this._Submit}>
                  <Text style={{ color: "#fff" }}>Sign Up</Text>
                </Button>
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </>
    );
  }
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: "#F68E1F",
    height: 48,
    width: 200,
    marginVertical: 40,
    paddingHorizontal: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25
  }
});

const mapDispatchToProps = {
  UpdateProfile
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
