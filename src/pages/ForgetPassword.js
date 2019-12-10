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
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";
import Stars from "react-native-stars";
import { etravosApi, domainApi } from "../service";
import moment from "moment";
import { Icon } from "../components";
import { Button, Text, TextInputComponent, ActivityIndicator } from "../components";
import { connect } from "react-redux";
import { Signup, Signin } from "../store/action";
import axios from "axios";

class ForgetPassword extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: ""
    };
  }

  _submit = () => {
    console.log(this.state.email);
    domainApi.get("/forget-password?email=" + this.state.email).then(res => {
      console.log(res);
    });
  };

  render() {
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
            Forget Password
          </Text>
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
          <Button style={styles.button} onPress={this._submit}>
            <Text style={{ color: "#fff" }}>Submit</Text>
          </Button>
        </View>
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
  }
});

export default ForgetPassword;
