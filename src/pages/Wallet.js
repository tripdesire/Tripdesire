import React from "react";
import { View, SafeAreaView } from "react-native";
import { Text, Button, Icon, DataNotFound } from "../components";
import { domainApi, etravosApi } from "../service";
import { connect } from "react-redux";
import HTML from "react-native-render-html";

class Wallet extends React.PureComponent {
  constructor(props) {
    super(props);
    this.doApiCall();
    this.state = {
      transaction: []
    };
  }

  doApiCall() {
    const { user } = this.props;
    // console.log(user.id);
    let param = {
      uid: user.id
    };
    domainApi.get("/wallet", param).then(({ data }) => {
      console.log(data);
      this.setState({ transaction: data });
    });
  }

  goBack = () => {
    this.props.navigation.goBack(null);
  };

  render() {
    const { transaction } = this.state;
    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "#E5EBF7" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <View style={{ flex: 1 }}>
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
                    fontWeight: "700",
                    paddingVertical: 16
                  }}>
                  Wallet
                </Text>
                <View style={{ marginStart: 10, paddingVertical: 16 }}>
                  <HTML
                    baseFontStyle={{
                      fontSize: 18,
                      color: "#1E293B",
                      fontWeight: "700"
                    }}
                    // containerStyle={{ marginHorizontal: 10 }}
                    html={transaction.balance || "<p></p>"}
                  />
                </View>
              </View>
            </View>
            {transaction.transaction == "No transactions found" && (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                  marginBottom: "40%"
                }}>
                <Text style={{ fontSize: 22, fontWeight: "500" }}>No transactions founds</Text>

                <Button style={{ alignItems: "center", marginTop: 25 }} onPress={this.goBack}>
                  <Text style={{ color: "#5B89F9", fontWeight: "500", fontSize: 16 }}>Go Back</Text>
                </Button>
              </View>
            )}
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(Wallet);
