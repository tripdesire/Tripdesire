import React from "react";
import { SafeAreaView, View, Image, StyleSheet } from "react-native";
import Text from "./TextComponent";
import Icon from "./IconNB";
import { isEmpty } from "lodash";
import { connect } from "react-redux";
import { Logout } from "../store/action";
import { GoogleSignin } from "@react-native-community/google-signin";
import Button from "./Button";

class CustomDrawer extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  signIn = () => {
    if (isEmpty(this.props.signIn)) {
      this.props.navigation.navigate("SignIn");
    }
  };

  _navigateToScreen = route => () => {
    this.props.navigation.navigate(route);
  };

  logout = () => {
    this.props.Logout(null);
    let logout = GoogleSignin.signOut();
  };

  render() {
    const { signIn } = this.props;
    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "#5789FF" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "gray" }}>
          <View style={{ flex: 1, backgroundColor: "white" }}>
            <Button style={styles.menuHeader} onPress={this.signIn}>
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
            </Button>

            <Button onPress={this._navigateToScreen("HomeStack")} style={styles.menuButton}>
              <Icon name="md-home" size={24} />
              <Text style={{ marginHorizontal: 33 }}>Home</Text>
            </Button>
            <Button onPress={this._navigateToScreen("OrderStack")} style={styles.menuButton}>
              <Icon type="FontAwesome5" name="clipboard-list" size={24} />
              <Text style={{ marginHorizontal: 33 }}>My Trips</Text>
            </Button>

            <Button onPress={this._navigateToScreen("ProfilePage")} style={styles.menuButton}>
              <Icon type="MaterialCommunityIcons" name="face-profile" size={24} />
              <Text style={{ marginHorizontal: 33 }}>My Profile</Text>
            </Button>
            <Button onPress={this._navigateToScreen("BillingDetails")} style={styles.menuButton}>
              <Icon type="MaterialCommunityIcons" name="face-profile" size={24} />
              <Text style={{ marginHorizontal: 33 }}>Address</Text>
            </Button>
            <Button onPress={this.logout} style={styles.menuButton}>
              <Icon type="AntDesign" name="logout" size={24} />
              <Text style={{ marginHorizontal: 33 }}>Logout</Text>
            </Button>
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  menuHeader: {
    color: "#5F6D78",
    padding: 20,
    height: 100,
    alignItems: "center",
    backgroundColor: "#5789FF",
    justifyContent: "space-between",
    flexDirection: "row"
  },
  menuButton: {
    flexDirection: "row",
    marginHorizontal: 16,
    height: 48,
    alignItems: "center"
  }
});
const mapStateToProps = state => ({
  signIn: state.signIn
});

const mapDispatchToProps = {
  Logout
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomDrawer);
