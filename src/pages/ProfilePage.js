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
import Stars from "react-native-stars";
import { etravosApi, domainApi } from "../service";
import moment from "moment";
import { Button, Text, TextInputComponent, ActivityIndicator, Icon } from "../components";
import { connect } from "react-redux";
import { Signup, Signin } from "../store/action";
import { GoogleSignin, statusCodes } from "@react-native-community/google-signin";
import { LoginButton, AccessToken } from "react-native-fbsdk";
import axios from "axios";

class ProfilePage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      firstname: "",
      lastname: "",
      displayname: "",
      email: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    };
  }

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
            value={this.state.firstname}
            onChangeText={text => this.setState({ firstname: text })}
          />
          <TextInputComponent
            label="Last Name"
            placeholder="Enter the last name"
            value={this.state.lastname}
            onChangeText={text => this.setState({ lastname: text })}
          />
          <TextInputComponent
            label="Display Name"
            placeholder="Enter the display name"
            value={this.state.displayname}
            onChangeText={text => this.setState({ displayname: text })}
          />
          <TextInputComponent
            label="Email"
            placeholder="Enter the email"
            value={this.state.email}
            onChangeText={text => this.setState({ email: text })}
          />

          <Text style={{ marginTop: 20 }}>Password Change</Text>
          <TextInputComponent
            label="Current Password"
            placeholder="Enter the currrent password"
            value={this.state.currentPassword}
            onChangeText={text => this.setState({ currentPassword: text })}
          />
          <TextInputComponent
            label="New Password"
            placeholder="Enter the new password"
            value={this.state.newPassword}
            onChangeText={text => this.setState({ newPassword: text })}
          />
          <TextInputComponent
            label="Confirm Password"
            placeholder="Enter the confirm password"
            value={this.state.confirmPassword}
            onChangeText={text => this.setState({ confirmPassword: text })}
          />
          <View style={{ alignItems: "center" }}>
            <Button style={styles.button}>
              <Text style={{ color: "#fff" }}>Sign Up</Text>
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
    width: 200,
    marginVertical: 40,
    paddingHorizontal: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25
  }
});

export default ProfilePage;
