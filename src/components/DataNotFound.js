import { View } from "react-native";
import Text from "./TextComponent";
import React from "react";
import Button from "./Button";
import PropTypes from "prop-types";

function DataNotFound({ title, onPress, style, subtitle }) {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        flex: 4,
        marginBottom: "40%",
        ...style
      }}>
      <Text style={{ fontSize: 22, fontWeight: "500", lineHeight: 24 }}>{title}</Text>
      <Text style={{ color: "#b8b4b0", fontSize: 14 }}>
        {subtitle != null ? subtitle : "Try searching for a different route or date."}
      </Text>
      <Button style={{ alignItems: "center", marginTop: 25 }} onPress={onPress}>
        <Text style={{ color: "#5B89F9", fontWeight: "500", fontSize: 16 }}>Go Back</Text>
      </Button>
    </View>
  );
}

DataNotFound.PropTypes = {
  title: PropTypes.oneOfType([PropTypes.string]),
  onPress: PropTypes.func
};

DataNotFound.defaultProps = {
  onPress: () => {},
  title: ""
};

export default DataNotFound;
