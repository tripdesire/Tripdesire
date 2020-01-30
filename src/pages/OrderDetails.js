import React, { PureComponent } from "react";
import { Text, Button, Icon } from "../components";
import { View, StyleSheet, SafeAreaView, StatusBar } from "react-native";
class OrderDetails extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  _goBack = () => {
    this.props.navigation.goBack(null);
  };

  render() {
    console.log(this.props.navigation.state.params);
    const order_data = this.props.navigation.state.params;

    return (
      <>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        <SafeAreaView style={{ flex: 0, backgroundColor: "#E5EBF7" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <View>
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 16,
                height: 56,
                backgroundColor: "#E5EBF7",
                alignItems: "center"
              }}>
              <Button onPress={this._goBack}>
                <Icon name="md-arrow-back" size={24} />
              </Button>
              <Text
                style={{
                  fontSize: 18,
                  color: "#1E293B",
                  marginStart: 5,
                  fontWeight: "700"
                }}>
                #{order_data.id}
              </Text>
            </View>
            <Text
              style={{ marginTop: "50%", alignSelf: "center", fontSize: 16, fontWeight: "500" }}>
              Invalid Ticket Contact Admin
            </Text>
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  summaryView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10
  }
});

export default OrderDetails;
