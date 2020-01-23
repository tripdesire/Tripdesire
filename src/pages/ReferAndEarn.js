import React from "react";
import { View, SafeAreaView, Image, Platform } from "react-native";
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
    let options = {
      url:
        Platform.OS == "ios"
          ? "https://apps.apple.com/app/id1491593829"
          : "https://play.google.com/store/apps/details?id=com.tripdesire",
      message: this.state.data.message
    };
    Share.open(options)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
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
        data.html_msg =
          "Invite your friends on TripDesire and get <HTML " +
          data.amount_referrer +
          " as wallet credit. Your friend will get " +
          data.amount_earner +
          " as wallet credit";
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
              <Text style={{ fontWeight: "500", fontSize: 22, lineHeight: 24 }}>
                Refer A Friend And
              </Text>
              <Text style={{ fontWeight: "500", fontSize: 22, lineHeight: 22 }}>earn money</Text>
              <View
                style={{
                  padding: 16,
                  borderRadius: 8,
                  backgroundColor: "#ffffff",
                  alignSelf: "center",
                  marginBottom: 20,
                  marginTop: 40,
                  elevation: 2,
                  shadowOffset: { width: 0, height: 2 },
                  shadowColor: "rgba(0,0,0,0.1)",
                  shadowOpacity: 1,
                  shadowRadius: 4
                }}>
                <Image
                  resizeMode="contain"
                  style={{ width: 90, height: 90 }}
                  source={require("../assets/imgs/IconReferAndEarn.png")}
                />
              </View>
              <View style={{ alignItems: "center", marginTop: 20 }}>
                <HTML baseFontStyle={{ color: "#5D646A" }} html={data.html_msg} />
                <Text style={{ marginTop: 20, color: "#5D646A" }}>
                  Referral valid upto {data.refer_earn_uses} users
                </Text>

                {/* <Text style={{ color: "#5D646A" }}>{data.html_msg}</Text> */}
                {/* <Text style={{ color: "#5D646A" }}>both you and your friends earn money.</Text> */}
              </View>
              <View style={{ alignItems: "center", marginTop: 10 }}>
                <Text style={{ color: "#5D646A" }}>Your Referral Code</Text>
                <View style={{ alignItems: "center" }}>
                  <Text
                    style={{
                      borderStyle: "dashed",
                      borderWidth: 1,
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
                  marginHorizontal: 90,
                  marginTop: 50,
                  height: 36,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 20
                }}
                onPress={this.share}>
                <Text style={{ color: "#fff" }}>Refer Friends</Text>
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
