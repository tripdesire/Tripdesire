import { DrawerItems } from "react-navigation-drawer";
import React, { PureComponent } from "react";
import { SafeAreaView, View, TouchableOpacity, Image } from "react-native";
import Text from "./TextComponent";
import Icon from "./IconNB";
import { connect } from "react-redux";
import { Logout } from "../store/action";
import Toast from "react-native-simple-toast";
import { Button } from ".";
class CustomDrawer extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  _navigateToScreen = () => {
    if (this.props.signIn != {}) {
      this.props.navigation.navigate("SignIn");
    } else {
      Toast.show("You have already Login", Toast.LONG);
    }
  };

  _Logout = () => {
    this.props.Logout(null);
  };

  render() {
    const { signIn } = this.props;
    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "white" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "gray" }}>
          <View style={{ flex: 1, backgroundColor: "white" }}>
            <TouchableOpacity
              style={{
                color: "#5F6D78",
                padding: 20,
                height: 80,
                alignItems: "center",
                backgroundColor: "#5789FF",
                justifyContent: "space-between",
                flexDirection: "row"
              }}
              onPress={this._navigateToScreen}>
              <Image
                style={{ width: 45, height: 45, borderRadius: 22.5 }}
                source={{
                  uri: signIn.first_name
                    ? signIn.avatar_url
                    : "https://secure.gravatar.com/avatar/0ab9f728e6f3d09a0727affab105f3cb?s=96&d=mm&r=g"
                }}
              />
              {/* <Icon name="md-person" size={40} color="#fff" style={{ flex: 1 }} /> */}
              {!signIn.first_name && (
                <Text
                  style={{ lineHeight: 22, fontSize: 18, color: "#fff", flex: 4, marginStart: 20 }}>
                  Login / SignUp
                </Text>
              )}
              {signIn.first_name && (
                <View style={{ flex: 4, marginStart: 20 }}>
                  <Text style={{ lineHeight: 22, fontSize: 16, color: "#fff" }}>
                    {signIn.first_name + " " + signIn.last_name}
                  </Text>
                  <Text style={{ lineHeight: 18, color: "#fff" }}>{signIn.email}</Text>
                </View>
              )}
            </TouchableOpacity>
            <DrawerItems
              {...this.props}
              labelStyle={{ fontSize: 16, fontWeight: "200" }}
              style={{ backgroundColor: "#FFFFFF" }}
            />
            <Button onPress={this._Logout}>
              <Text style={{ marginHorizontal: 15 }}>Logout</Text>
            </Button>
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const mapStateToProps = state => ({
  signIn: state.signIn
});

const mapDispatchToProps = {
  Logout
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomDrawer);
