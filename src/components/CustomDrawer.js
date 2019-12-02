import {DrawerItems} from "react-navigation-drawer";
import React, {PureComponent} from "react";
import {SafeAreaView, View} from "react-native";
import Text from "./TextComponent";
import Icon from "./IconNB";
class CustomDrawer extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <>
        <SafeAreaView style={{flex: 0, backgroundColor: "white"}} />
        <SafeAreaView style={{flex: 1, backgroundColor: "gray"}}>
          <View style={{flex: 1, backgroundColor: "white"}}>
            <View
              style={{
                color: "#5F6D78",
                padding: 20,
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row"
              }}>
              <Icon name="md-person" size={40} />
              <View>
                <Text style={{lineHeight: 22, fontSize: 18}}>kamlesh kumar</Text>
                <Text style={{lineHeight: 18}}>kamlesh@webiixx.com</Text>
              </View>
            </View>
            <DrawerItems
              {...this.props}
              labelStyle={{fontSize: 16, fontWeight: "200"}}
              style={{backgroundColor: "#FFFFFF"}}
            />
            <Text style={{marginHorizontal: 15}}>Logout</Text>
          </View>
        </SafeAreaView>
      </>
    );
  }
}

export default CustomDrawer;
