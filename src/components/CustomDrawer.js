import { DrawerItems } from "react-navigation-drawer";
import React, { PureComponent } from "react";
import { SafeAreaView, View } from "react-native";
class CustomDrawer extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "white" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "gray" }}>
          <View style={{ flex: 1, backgroundColor: "white" }}>
            <DrawerItems
              {...this.props}
              labelStyle={{ fontSize: 16, fontWeight: "200" }}
              style={{ backgroundColor: "#FFFFFF" }}
            />
          </View>
        </SafeAreaView>
      </>
    );
  }
}

export default CustomDrawer;
