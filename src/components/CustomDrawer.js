import { DrawerItems } from "react-navigation-drawer";
import React, { PureComponent } from "react";
import { SafeAreaView, View, TouchableOpacity, Image } from "react-native";
import Text from "./TextComponent";
import Icon from "./IconNB";
import { isEmpty } from "lodash";
import { connect } from "react-redux";
import { Logout } from "../store/action";
import Toast from "react-native-simple-toast";
import { GoogleSignin, statusCodes } from "@react-native-community/google-signin";
import Button from "./Button";
class CustomDrawer extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  _NavigateToScreen = () => {
    if (isEmpty(this.props.signIn)) {
      this.props.navigation.navigate("SignIn");
    } else {
      Toast.show("You have already Login", Toast.LONG);
    }
  };

  _navigateToScreen = text => () => {
    if (text == "Logout") {
      this.props.Logout(null);
      let logout = GoogleSignin.signOut();
      console.log(logout);
    } else if (text == "MyProfile") {
      this.props.navigation.navigate("ProfilePage");
    } else if (text == "Billing") {
      this.props.navigation.navigate("BillingDetails");
    } else if (text == "Share") {
      //this.props.navigation.navigate("ProfilePage");
    }
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
                height: 100,
                alignItems: "center",
                backgroundColor: "#5789FF",
                justifyContent: "space-between",
                flexDirection: "row"
              }}
              onPress={this._NavigateToScreen}>
              <Image
                style={{ width: 50, height: 50, borderRadius: 25 }}
                source={{
                  uri: signIn.first_name
                    ? signIn.avatar_url
                    : "https://secure.gravatar.com/avatar/0ab9f728e6f3d09a0727affab105f3cb?s=96&d=mm&r=g"
                }}
              />
              {!signIn.first_name && (
                <Text
                  style={{ lineHeight: 22, fontSize: 18, color: "#fff", flex: 4, marginStart: 20 }}>
                  Login / SignUp
                </Text>
              )}
              {signIn.first_name && (
                <View style={{ flex: 4, marginStart: 20 }}>
                  <Text style={{ lineHeight: 22, fontSize: 18, color: "#fff", fontWeight: "700" }}>
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
            <Button
              onPress={this._navigateToScreen("MyProfile")}
              style={{ flexDirection: "row", marginHorizontal: 16, height: 48 }}>
              <Icon type="MaterialCommunityIcons" name="face-profile" size={24} />
              <Text style={{ marginHorizontal: 33 }}>My Profile</Text>
            </Button>
            <Button
              onPress={this._navigateToScreen("Billing")}
              style={{ flexDirection: "row", marginHorizontal: 16, height: 48 }}>
              <Icon type="MaterialCommunityIcons" name="face-profile" size={24} />
              <Text style={{ marginHorizontal: 33 }}>Billing Address</Text>
            </Button>
            <Button
              onPress={this._navigateToScreen("Share")}
              style={{ flexDirection: "row", marginHorizontal: 16, height: 48 }}>
              <Icon name="md-share" size={24} />
              <Text style={{ marginHorizontal: 33 }}>Share this app</Text>
            </Button>
            <Button
              onPress={this._navigateToScreen("Logout")}
              style={{ flexDirection: "row", marginHorizontal: 16, height: 48 }}>
              <Icon type="AntDesign" name="logout" size={24} />
              <Text style={{ marginHorizontal: 33 }}>Logout</Text>
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
