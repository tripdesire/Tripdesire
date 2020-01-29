import React from "react";
import { View, SafeAreaView, Image, Platform, Clipboard } from "react-native";
import { Text, Button, Icon, ActivityIndicator } from "../components";
import { domainApi, etravosApi } from "../service";
import { connect } from "react-redux";
import HTML from "react-native-render-html";
import Share from "react-native-share";

class ReferAndEarn extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: "",
      loader: false,
      balance: "<h3>Available Balance:&nbsp;&nbsp;&nbsp;</h3>0.00"
    };
  }

  share = () => {
    Clipboard.setString("Copy Code");
    let options = {
      url:
        Platform.OS == "ios"
          ? "https://apps.apple.com/app/id1491593829"
          : "https://play.google.com/store/apps/details?id=com.tripdesire",
      message: this.state.data.message
    };
    this.setState({ loader: true });
    Share.open(options)
      .then(res => {
        this.setState({ loader: false });
        console.log(res);
      })
      .catch(err => {
        this.setState({ loader: false });
        err && console.log(err);
      });
  };

  componentDidMount() {
    const { user } = this.props;

    this.setState({ loader: true });
    domainApi
      .get("/refer", { user_id: user.id })
      .then(({ data }) => {
        console.log(data);
        data.html_msg = "Share The App, Get Rs. " + data.amount_referrer;
        data.earn_msg = "Earn " + data.amount_earner + " When Friends Join With";
        this.setState({ loader: false, data: data });
        this.setStaet({ loader: true });
        domainApi.get("/wallet", { uid: user.id }).then(({ data }) => {
          this.setState({
            balance: "<b>Available Balance:&nbsp;&nbsp;&nbsp;</b>" + data.balance,
            loader: false
          });
        });
      })
      .catch(error => {});
  }

  goBack = () => {
    this.props.navigation.goBack(null);
  };

  render() {
    const { loader, data, balance } = this.state;
    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "#E5EBF7" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <View>
            <View
              style={{
                flexDirection: "row",
                height: 56,
                backgroundColor: "#E5EBF7",
                alignItems: "center"
              }}>
              <Button style={{ padding: 16 }} onPress={this.goBack}>
                <Icon name="md-arrow-back" size={24} />
              </Button>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  flex: 1,
                  marginEnd: 16
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    color: "#1E293B",
                    marginStart: 10,
                    fontWeight: "300",
                    paddingVertical: 16
                  }}>
                  Refer & Earn
                </Text>
              </View>
            </View>
            <View style={{ marginHorizontal: 16, marginTop: 24 }}>
              <View
                style={{
                  padding: 16,
                  borderRadius: 8,
                  backgroundColor: "#ffffff",
                  alignSelf: "center",
                  marginVertical: 20
                }}>
                <Image
                  resizeMode="contain"
                  style={{ width: 160, height: 160 }}
                  source={require("../assets/imgs/IconReferAndEarn.png")}
                />
              </View>
              {/* <Text
                style={{ fontWeight: "500", fontSize: 22, lineHeight: 24, alignSelf: "center" }}>
                {data.html_msg}
              </Text> */}
              <View style={{ alignItems: "center" }}>
                <HTML
                  baseFontStyle={{
                    fontWeight: "600",
                    fontSize: 18,
                    lineHeight: 24
                  }}
                  html={data.html_msg ? data.html_msg : <p></p>}
                />
                <View style={{ marginTop: 20, alignItems: "center" }}>
                  <HTML
                    baseFontStyle={{
                      fontSize: 12,
                      lineHeight: 18
                    }}
                    html={data.earn_msg ? data.earn_msg : <p></p>}
                  />
                  <Text style={{ fontSize: 12, lineHeight: 14 }}>Your Invite Link</Text>
                  <Text style={{ marginTop: 20, fontSize: 12 }}>
                    Valid For {data.refer_earn_uses} Contacts
                  </Text>
                </View>
              </View>

              <View style={{ alignItems: "center", marginTop: 10 }}>
                <View style={{ alignItems: "center" }}>
                  <Text
                    style={{
                      borderStyle: "dotted",
                      borderWidth: 1,
                      borderRadius: 5,
                      color: "#5D646A",
                      borderColor: "#5D646A",
                      marginTop: 40,
                      paddingHorizontal: 36,
                      paddingVertical: 10,
                      fontSize: 18,
                      fontWeight: "700"
                    }}>
                    {data.refer_earn_code}
                  </Text>
                </View>
              </View>
              <Button
                style={{
                  backgroundColor: "#F68E1D",
                  marginHorizontal: 80,
                  marginTop: 50,
                  height: 36,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 20
                }}
                onPress={this.share}>
                <Text style={{ color: "#fff" }}>Share with friends</Text>
                <Image source={require("../assets/imgs/ArrowReferAndEarn.png")} />
              </Button>
            </View>
          </View>
          {loader && <ActivityIndicator />}
        </SafeAreaView>
      </>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(ReferAndEarn);
