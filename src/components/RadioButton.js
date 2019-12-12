import React from "react";
import { TouchableOpacity } from "react-native";
import Text from "./TextComponent";
import Icon from "./IconNB";
import PropTypes from "prop-types";

function RadioButton({ style, selected, onPress, label }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        padding: 16,
        alignItems: "center",
        width: "100%",
        ...style
      }}>
      <Icon
        type="MaterialCommunityIcons"
        color={selected ? "#337ab7" : "#00000099"}
        size={24}
        name={selected ? "radiobox-marked" : "radiobox-blank"}
      />
      <Text style={{ marginStart: 16, flex: 1 }}>{label}</Text>
    </TouchableOpacity>
  );
}

RadioButton.propTypes = {
  ...TouchableOpacity.propTypes,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
  selected: PropTypes.bool,
  onPress: PropTypes.func,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

RadioButton.defaultProps = {
  selected: false,
  onPress: () => {},
  label: ""
};

export default RadioButton;
