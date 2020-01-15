import React, { PureComponent } from "react";
import {
  View,
  Image,
  Modal,
  StyleSheet,
  SafeAreaView,
  Platform,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  FlatList
} from "react-native";
import { Button, Text, AutoCompleteModal, ActivityIndicator, Header, Icon } from "../../components";
import Toast from "react-native-simple-toast";
import { withNavigation } from "react-navigation";
import axios from "axios";

const { height } = Dimensions.get("window");

class RenderItems extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      closeDetails: false,
      loading: false
    };
  }

  _onFareDetails = () => {
    this.setState({ closeDetails: true });
  };

  closeFareDetails = () => {
    this.setState({ closeDetails: false });
  };

  _BookNow = item => () => {
    const { params } = this.props;
    // let param = {
    //   params: params,
    //   item: item,

    // };
    // console.log(param);
    this.props.navigation.navigate("CheckoutCab", { params, item });
  };

  render() {
    const { closeDetails, loading } = this.state;
    return (
      <TouchableOpacity
        style={{
          borderRadius: 8,
          elevation: 2,
          shadowOffset: { width: 0, height: 2 },
          shadowColor: "rgba(0,0,0,0.1)",
          shadowOpacity: 1,
          shadowRadius: 4,
          marginHorizontal: 16,
          marginTop: 16,
          backgroundColor: "#ffffff"
        }}
        onPress={this._BookNow(this.props.item)}>
        <View
          style={{
            flexDirection: "row",
            marginEnd: 8,
            paddingVertical: 8,
            flexShrink: 1,
            alignItems: "center"
          }}>
          <Image
            style={{ width: 50, height: 50 }}
            source={require("../../assets/imgs/carNew.png")}
          />
          <View
            style={{
              marginStart: 2
            }}>
            <Text>{this.props.item.Name}</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                justifyContent: "space-between"
              }}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontSize: 12, color: "#5D666D" }}>
                  {this.props.item.SeatingCapacity} Seats |{" "}
                </Text>

                <Text style={{ fontSize: 12, color: "#5D666D" }}>
                  {this.props.item.AdditionalInfo.BaggageQuantity} bags
                </Text>
              </View>
              {/* <View
                style={{
                  width: 60,
                  borderStyle: "dashed",
                  borderWidth: 1,
                  height: 1,
                  marginHorizontal: 8,
                  alignItems: "center",
                  justifyContent: "center",
                  borderColor: "#8894A8",
                  borderRadius: 1
                }}>
                <Image
                  tintColor={"#000"}
                  style={{ width: 24, height: 24, position: "absolute" }}
                  source={require("../../assets/imgs/carNew.png")}
                />
              </View> */}
            </View>
          </View>
        </View>

        <View
          style={{
            borderTopWidth: 0.5,
            borderTopColor: "#d2d2d2",
            paddingVertical: 8,
            flexDirection: "row",
            marginHorizontal: 8,
            justifyContent: "space-between",
            alignItems: "center"
          }}>
          <Button onPress={this._onFareDetails}>
            <Text style={{ fontSize: 12, color: "#6287F9" }}>Fare Details</Text>
          </Button>
          <Text style={{ fontSize: 18, fontWeight: "600" }}>
            ₹ {this.props.item.TotalNetAmount}
          </Text>
        </View>

        <Modal
          animationType="slide"
          transparent={false}
          visible={closeDetails}
          onRequestClose={this.closeFareDetails}>
          <FareDetails data={this.props.item} onBackPress={this.closeFareDetails} />
        </Modal>
      </TouchableOpacity>
    );
  }
}

class FareDetails extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log(this.props.data);
  }

  render() {
    const { data } = this.props;
    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "#E5EBF7" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <View>
            <View style={styles.headerContainer}>
              <Button onPress={this.props.onBackPress} style={{ padding: 16 }}>
                <Icon name="md-arrow-back" size={24} />
              </Button>
              <Text style={{ fontWeight: "700", fontSize: 18 }}>Fare Details</Text>
            </View>
            <Text style={{ marginHorizontal: 16, marginTop: 16, fontWeight: "700", fontSize: 16 }}>
              Fare Details
            </Text>
            <Text style={{ marginHorizontal: 16 }}>
              Approx. one way distance : {data.ApproxDistance} Kms.
            </Text>
            <Text style={{ marginHorizontal: 16, fontWeight: "700", fontSize: 16, marginTop: 10 }}>
              If you will use car/cab more than day(s) and {data.ApproxDistance} kms extra charges
              as follows:
            </Text>
            <Text style={{ marginHorizontal: 16 }}>After {data.ApproxDistance} kms & day(s) :</Text>
            <View style={{ marginHorizontal: 16, flexDirection: "row", alignItems: "center" }}>
              <View
                style={{ backgroundColor: "black", width: 8, height: 8, borderRadius: 8 }}></View>
              <Text style={{ marginStart: 10 }}>Rs {data.PerKm} per Km.</Text>
            </View>
            <View style={{ marginHorizontal: 16, flexDirection: "row", alignItems: "center" }}>
              <View
                style={{ backgroundColor: "black", width: 8, height: 8, borderRadius: 8 }}></View>
              <Text style={{ marginStart: 10 }}>
                Rs {data.DriverCharges} per day driver charges
              </Text>
            </View>
            <Text style={{ marginHorizontal: 16, fontWeight: "700", fontSize: 16, marginTop: 10 }}>
              Terms & Conditions:
            </Text>
            <Text style={{ marginHorizontal: 16 }}>Fare includes Vehicle & Fuel charges</Text>
            <Text style={{ marginHorizontal: 16 }}>
              Each day will be counted from midnight 12 to midnight 12
            </Text>
            <Text style={{ marginHorizontal: 16 }}>
              Toll(both-ways), State Tax, Parking & Airport Entry (not included in bill) to be paid
              wherever applicable
            </Text>
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    backgroundColor: "#E5EBF7"
  }
});

export default withNavigation(RenderItems);
