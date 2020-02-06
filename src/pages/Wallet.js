import React from "react";
import {
  View,
  SafeAreaView,
  FlatList,
  TextInput,
  Dimensions,
  StyleSheet,
  StatusBar
} from "react-native";
import { Text, Button, Icon, ActivityIndicator } from "../components";
import { domainApi, etravosApi } from "../service";
import { connect } from "react-redux";
import HTML from "react-native-render-html";
import Modal from "react-native-modal";
import Toast from "react-native-simple-toast";
import RazorpayCheckout from "react-native-razorpay";
import analytics from "@react-native-firebase/analytics";

const { height } = Dimensions.get("window");

class Wallet extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      transaction: [],
      transactions: [],
      loader: false,
      modalShow: false,
      rupee: ""
    };
    this.doApiCall();
  }

  trackScreenView = async screen => {
    // Set & override the MainActivity screen name
    await analytics().setCurrentScreen(screen, screen);
  };
  componentDidMount() {
    this.trackScreenView("Wallet");
  }

  addMoneyToWallet(rupee) {
    const { user } = this.props;
    let param = {
      user_id: user.id,
      payment_method: "razorpay"
    };
    let data = {
      woo_add_to_wallet: "Add",
      woo_wallet_balance_to_add: rupee
    };
    console.log(data);
    this.setState({ loader: true });
    domainApi
      .post("/wallet/add", data)
      .then(({ data }) => {
        console.log(data);
        this.setState({ loader: false });
        if (data.code == 1) {
          this.setState({ loader: true });
          domainApi
            .post("/checkout/new-order?user_id=" + user.id + "&payment_method=razorpay")
            .then(res => {
              console.log(res.data);
              this.setState({ loader: false });
              if (res.status == 200) {
                var options = {
                  description: "Credits towards consultation",
                  //image: "https://i.imgur.com/3g7nmJC.png",
                  currency: "INR",
                  //key: "rzp_test_I66kFrN53lhauw",
                  key: "rzp_live_IRhvqgmESx60tW",
                  amount: parseInt(res.data.total) * 100,
                  name: "TripDesire",
                  prefill: {
                    email: user.billing.email,
                    contact: user.billing.phone,
                    name: "Razorpay Software"
                  },
                  theme: { color: "#E5EBF7" }
                };
                RazorpayCheckout.open(options)
                  .then(razorpayRes => {
                    console.log(razorpayRes);
                    if (razorpayRes.razorpay_payment_id != "") {
                      let param = {
                        order_id: res.data.id,
                        status: "completed"
                      };
                      domainApi
                        .post("/checkout/update-order", param)
                        .then(({ data: order }) => {
                          console.log(order);
                          this.doApiCall();
                        })
                        .catch(error => {
                          this.setState({ loader: false });
                        });
                    } else {
                      this.setState({ loader: false });
                      Toast.show("You have cancelled the order", Toast.SHORT);
                    }
                  })
                  .catch(error => {
                    // handle failure
                    this.setState({ loader: false });
                    alert(`Error:  ${error.description}`);
                  });
              }
            })
            .catch(error => {
              this.setState({ loader: false });
            });
        }
      })
      .catch(error => {
        this.setState({ loader: false });
      });
  }

  modalShow = () => {
    this.setState({ modalShow: true });
  };
  modalDismiss = () => {
    this.setState({ modalShow: false, rupee: null });
  };

  setRupee = rupee => {
    this.setState({ modalShow: false, rupee });
    this.addMoneyToWallet(rupee);
  };

  doApiCall() {
    const { user } = this.props;
    let param = {
      uid: user.id
    };
    this.setState({ loader: true });
    domainApi
      .get("/wallet", param)
      .then(({ data }) => {
        console.log(data);
        this.setState({ loader: false });
        this.setState({ transactions: data.transaction, transaction: data });
      })
      .catch(error => {
        this.setState({ loader: false });
      });
  }

  goBack = () => {
    this.props.navigation.goBack(null);
  };

  _renderItem = ({ item, index }) => {
    return (
      <View
        key={"Trans" + index}
        style={{
          padding: 16,
          marginHorizontal: 16,
          elevation: 2,
          shadowOffset: { width: 0, height: 2 },
          shadowColor: "rgba(0,0,0,0.1)",
          shadowOpacity: 1,
          shadowRadius: 4,
          backgroundColor: "#ffffff",
          marginTop: 16,
          borderRadius: 8
        }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 18, fontWeight: "300", flex: 1 }}>
            {item.details != "" ? item.details : "No details available"}
          </Text>
          <HTML
            baseFontStyle={{
              fontSize: 18,
              fontWeight: "500",
              color: item.type == "debit" ? "red" : "green"
            }}
            // containerStyle={{ marginHorizontal: 10 }}
            html={item.amount || "<p></p>"}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between"
          }}>
          <Text style={{ fontSize: 14, fontWeight: "200" }}>{item.date}</Text>
        </View>
      </View>
    );
  };

  _keyExtractor = (item, index) => "_key" + index;

  render() {
    const { transaction, transactions, loader, modalShow } = this.state;
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
            {transaction.transaction == "No transactions found" ? (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                  marginBottom: "40%"
                }}>
                <Text style={{ fontSize: 22, fontWeight: "500" }}>No transactions found</Text>

                <Button style={{ alignItems: "center", marginTop: 25 }} onPress={this.goBack}>
                  <Text style={{ color: "#5B89F9", fontWeight: "500", fontSize: 16 }}>Go Back</Text>
                </Button>
              </View>
            ) : (
              <View style={{ flex: 1 }}>
                <Button
                  style={{
                    backgroundColor: "#F68E1D",
                    marginHorizontal: 16,
                    padding: 8,
                    marginVertical: 16,
                    borderRadius: 20,
                    // marginBottom: 0,
                    //marginEnd: 0,
                    //  position: "absolute",
                    alignItems: "center"
                  }}
                  onPress={this.modalShow}>
                  <Text style={{ color: "#fff" }}>Add Money</Text>
                </Button>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={transactions}
                  keyExtractor={this._keyExtractor}
                  renderItem={this._renderItem}
                />
              </View>
            )}

            <Modal
              style={{ marginVertical: 96, marginHorizontal: 64 }}
              backdropColor="black"
              backdropOpacity={0.7}
              hasBackdrop
              isVisible={modalShow}
              onBackButtonPress={this.modalDismiss}
              onBackdropPress={this.modalDismiss}>
              <Amount
                //onModalBackPress={this.modalShow}
                onBackButtonPress={this.modalDismiss}
                data={this.setRupee}
              />
            </Modal>
            {loader && <ActivityIndicator />}
          </View>
        </SafeAreaView>
      </>
    );
  }
}

class Amount extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      rupee: ""
    };
  }

  setRupee = () => {
    this.props.data && this.props.data(this.state.rupee);
  };

  render() {
    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "#E5EBF7" }} />
        <SafeAreaView style={{ flex: 0, backgroundColor: "#ffffff" }}>
          <View>
            <View
              style={{
                flexDirection: "row",
                height: 42,
                backgroundColor: "#E5EBF7",
                alignItems: "center",
                justifyContent: "center"
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: "#1E293B",
                  fontWeight: "500"
                }}>
                Add Money
              </Text>
            </View>
            <TextInput
              keyboardType="numeric"
              style={{ borderColor: "#E5EBF7", borderWidth: 1, padding: 8, margin: 16 }}
              placeholder="Enter Amount"
              onChangeText={text => this.setState({ rupee: text })}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                marginHorizontal: 16
              }}>
              <Button style={styles.modalButton} onPress={this.props.onBackButtonPress}>
                <Text style={{ color: "#fff" }}>Cancel</Text>
              </Button>
              <Button style={[styles.modalButton, { marginStart: 5 }]} onPress={this.setRupee}>
                <Text style={{ color: "#fff" }}>Add</Text>
              </Button>
            </View>
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

const styles = StyleSheet.create({
  modalButton: {
    backgroundColor: "#F68E1D",
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 16,
    alignItems: "center"
  }
});

export default connect(mapStateToProps, null)(Wallet);
