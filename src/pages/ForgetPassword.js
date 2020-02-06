import React, { PureComponent } from "react";
import { View, StatusBar, StyleSheet, SafeAreaView } from "react-native";
import Toast from "react-native-simple-toast";
import { etravosApi, domainApi } from "../service";
import { Icon } from "../components";
import { Button, Text, TextInputComponent, ActivityIndicator } from "../components";
import analytics from "@react-native-firebase/analytics";

class ForgetPassword extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      loader: false
    };
  }

  trackScreenView = async screen => {
    // Set & override the MainActivity screen name
    await analytics().setCurrentScreen(screen, screen);
  };
  componentDidMount() {
    this.trackScreenView("Forget Password");
  }

  _submit = () => {
    //console.log(this.state.email);
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (this.state.email != "") {
      if (reg.test(this.state.email) === true) {
        this.setState({ loader: true });
        domainApi
          .get("/forget-password?email=" + this.state.email)
          .then(({ data }) => {
            this.setState({ loader: false });
            if (data.code == 1) {
              Toast.show(data.message, Toast.LONG);
            } else {
              Toast.show(data.message, Toast.LONG);
            }
            //  console.log(res);
          })
          .catch(error => {
            this.setState({ loader: false });
          });
      } else {
        Toast.show("Please enter the correct email", Toast.SHORT);
      }
    } else {
      Toast.show("Please enter the email", Toast.SHORT);
    }
  };

  render() {
    const { loader } = this.state;
    return (
      <>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        <SafeAreaView style={{ flex: 0, backgroundColor: "#000000" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
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
          {loader && <ActivityIndicator />}
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#F68E1F",
    height: 40,
    width: "100%",
    marginVertical: 40,
    marginHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25
  }
});

export default ForgetPassword;
