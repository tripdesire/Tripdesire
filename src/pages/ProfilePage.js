import React, { PureComponent } from "react";
import { View, StyleSheet, SafeAreaView, ScrollView, StatusBar, TextInput } from "react-native";
import Toast from "react-native-simple-toast";
import { Button, Text, TextInputComponent, ActivityIndicator, Icon } from "../components";
import { connect } from "react-redux";
import { UpdateProfile } from "../store/action";
import { domainApi } from "../service";
import { LoginButton, AccessToken } from "react-native-fbsdk";
import analytics from "@react-native-firebase/analytics";

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
      confirmPassword: "",
      showCurrentPassword: false,
      showNewPassword: false,
      showConfirmPassword: false,
      isFocus: false,
      isFocusNew: false,
      isFocusConfirm: false
    };
  }

  trackScreenView = async screen => {
    // Set & override the MainActivity screen name
    await analytics().setCurrentScreen(screen, screen);
  };
  componentDidMount() {
    this.trackScreenView("Profile");
  }

  onfocus = key => () => {
    this.setState({ [key]: true });
  };

  onblur = key => () => {
    this.setState({ [key]: false });
  };

  _showPassword = key => () => {
    this.setState({ [key]: this.state[key] == true ? false : true });
  };

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
      email: email,
      username: displayname
    };
    if (currentPassword != "" && newPassword != "" && confirmPassword != "") {
      param.current_pass = currentPassword;
      param.new_pass = newPassword;
      param.confirm_pass = confirmPassword;
    }

    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!reg.test(this.state.email)) {
      Toast.show("Your email address is not correct", Toast.LONG);
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
          Toast.show("Nothing to update", Toast.LONG);
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
              <Text style={{ marginTop: 20, marginStart: 5 }}>Password Change</Text>
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  paddingTop: 14,
                  borderBottomWidth: 1,
                  borderBottomColor: this.state.isFocus ? "#5789FF" : "#D2D1D1"
                }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, paddingStart: 5, color: "#757575" }}>
                    Current Password
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      flex: 1,
                      alignItems: "center",
                      marginEnd: 18
                    }}>
                    <TextInput
                      secureTextEntry={!this.state.showCurrentPassword}
                      style={[
                        styles.textinput,
                        {
                          paddingVertical: Platform.OS == "ios" ? 8 : null
                        }
                      ]}
                      onFocus={this.onfocus("isFocus")}
                      onBlur={this.onblur("isFocus")}
                      placeholderTextColor={"#D9D8DD"}
                      onChangeText={text => this.setState({ currentPassword: text })}
                    />
                    <Button
                      style={{ paddingVertical: 5 }}
                      onPress={this._showPassword("showCurrentPassword")}>
                      <Icon
                        name={
                          !this.state.showCurrentPassword == true && Platform.OS != "ios"
                            ? "md-eye-off"
                            : !this.state.showCurrentPassword == true && Platform.OS == "ios"
                            ? "ios-eye-off"
                            : !this.state.showCurrentPassword == false && Platform.OS == "ios"
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
              {/* <TextInputComponent
                label="Current Password"
                placeholder="Enter the currrent password"
                value={currentPassword}
                onChangeText={text => this.setState({ currentPassword: text })}
              /> */}
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  paddingTop: 14,
                  borderBottomWidth: 1,
                  borderBottomColor: this.state.isFocusNew ? "#5789FF" : "#D2D1D1"
                }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, paddingStart: 5, color: "#757575" }}>
                    New Password
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      flex: 1,
                      alignItems: "center",
                      marginEnd: 18
                    }}>
                    <TextInput
                      secureTextEntry={!this.state.showNewPassword}
                      style={[
                        styles.textinput,
                        {
                          paddingVertical: Platform.OS == "ios" ? 8 : null
                        }
                      ]}
                      onFocus={this.onfocus("isFocusNew")}
                      onBlur={this.onblur("isFocusNew")}
                      placeholderTextColor={"#D9D8DD"}
                      onChangeText={text => this.setState({ newPassword: text })}
                    />
                    <Button
                      style={{ paddingVertical: 5 }}
                      onPress={this._showPassword("showNewPassword")}>
                      <Icon
                        name={
                          !this.state.showNewPassword == true && Platform.OS != "ios"
                            ? "md-eye-off"
                            : !this.state.showNewPassword == true && Platform.OS == "ios"
                            ? "ios-eye-off"
                            : !this.state.showNewPassword == false && Platform.OS == "ios"
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
              {/* <TextInputComponent
                label="New Password"
                placeholder="Enter the new password"
                value={newPassword}
                onChangeText={text => this.setState({ newPassword: text })}
              /> */}
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  paddingTop: 14,
                  borderBottomWidth: 1,
                  borderBottomColor: this.state.isFocusConfirm ? "#5789FF" : "#D2D1D1"
                }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, paddingStart: 5, color: "#757575" }}>
                    Confirm Password
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      flex: 1,
                      alignItems: "center",
                      marginEnd: 18
                    }}>
                    <TextInput
                      secureTextEntry={!this.state.showConfirmPassword}
                      style={[
                        styles.textinput,
                        {
                          paddingVertical: Platform.OS == "ios" ? 8 : null
                        }
                      ]}
                      onFocus={this.onfocus("isFocusConfirm")}
                      onBlur={this.onblur("isFocusConfirm")}
                      placeholderTextColor={"#D9D8DD"}
                      onChangeText={text => this.setState({ confirmPassword: text })}
                    />
                    <Button
                      style={{ paddingVertical: 5 }}
                      onPress={this._showPassword("showConfirmPassword")}>
                      <Icon
                        name={
                          !this.state.showConfirmPassword == true && Platform.OS != "ios"
                            ? "md-eye-off"
                            : !this.state.showConfirmPassword == true && Platform.OS == "ios"
                            ? "ios-eye-off"
                            : !this.state.showConfirmPassword == false && Platform.OS == "ios"
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
              {/* <TextInputComponent
                label="Confirm Password"
                placeholder="Enter the confirm password"
                value={confirmPassword}
                onChangeText={text => this.setState({ confirmPassword: text })}
              /> */}
              <View style={{ alignItems: "center" }}>
                <Button style={styles.button} onPress={this._Submit}>
                  <Text style={{ color: "#fff" }}>Submit</Text>
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
    height: 36,
    width: 200,
    marginVertical: 40,
    paddingHorizontal: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25
  },
  textinput: {
    width: "100%",
    fontSize: 16,
    paddingStart: 5,
    color: "#000"
  }
});

const mapDispatchToProps = {
  UpdateProfile
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
