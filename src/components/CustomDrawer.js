import { DrawerItems } from "react-navigation-drawer";
import React, { PureComponent } from "react";
class CustomDrawer extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    return <DrawerItems {...this.props} labelStyle={{ fontSize: 16, fontWeight: "200" }} />;
  }
}

export default CustomDrawer;
