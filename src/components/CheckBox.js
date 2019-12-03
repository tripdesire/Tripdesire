import React from "react";
import PropTypes from "prop-types";
import { View, TouchableOpacity, Platform } from "react-native";
import Icon from "./IconNB";
import Text from "./TextComponent";

class CheckBox extends React.PureComponent {
  render() {
    const { checked, label } = this.props;
    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        style={{
          flexDirection: "row",
          padding: 16,
          alignItems: "center",
          width: "100%"
        }}>
        <Icon
          type="MaterialCommunityIcons"
          color={checked ? "#337ab7" : "#00000099"}
          size={30}
          name={checked ? "checkbox-marked" : "checkbox-blank-outline"}
        />

        <Text style={{ marginStart: 16, flex: 1 }}>{label}</Text>
      </TouchableOpacity>
    );
  }
}

CheckBox.propTypes = {
  ...TouchableOpacity.propTypes,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
  checked: PropTypes.bool,
  onPress: PropTypes.func,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

CheckBox.defaultProps = {
  checked: false,
  onPress: () => {},
  label: ""
};

export default CheckBox;
