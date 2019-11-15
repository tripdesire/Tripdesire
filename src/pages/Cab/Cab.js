import React, { PureComponent } from "react";
import { View } from "react-native";
import { Header } from "../../components";
class Cab extends React.PureComponent {
  render() {
    return (
      <View style={{ flexDirection: "column", flex: 1 }}>
        <View style={{ backgroundColor: "#E4EAF6", flex: 1 }}>
          <Header
            firstName="Cab"
            lastName="Search"
            onPress={() => this.props.navigation.goBack(null)}
          />
        </View>
      </View>
    );
  }
}

export default Cab;
