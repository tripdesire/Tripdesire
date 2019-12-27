import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { CustomPicker } from "react-native-custom-picker";
import Icon from "./IconNB";

const { height } = Dimensions.get("window");

export class RNPicker extends React.Component {
  render() {
    const { items, onItemChange, value, getLabel } = this.props;
    console.log(value);
    return (
      <CustomPicker
        ref={el => (this.picker = el)}
        options={items}
        value={value}
        getLabel={getLabel}
        fieldTemplate={this.renderField}
        optionTemplate={this.renderOption}
        onValueChange={onItemChange}
        maxHeight={height / 2}
      />
    );
  }

  renderField = settings => {
    const { selectedItem, getLabel } = settings;
    const { fieldContainerStyle, iconStyle } = this.props;
    return (
      <TouchableOpacity
        style={[styles.container, fieldContainerStyle]}
        onPress={() => this.picker.showOptions()}>
        {selectedItem && <Text style={[styles.text]}>{getLabel(selectedItem)}</Text>}
        <Icon
          name="ios-arrow-down"
          size={20}
          style={{ position: "absolute", end: 0, marginBottom: "auto", top: 10, ...iconStyle }}
        />
      </TouchableOpacity>
    );
  };

  renderOption(settings) {
    const { item, getLabel } = settings;
    return (
      <View style={styles.optionContainer}>
        <View style={styles.innerContainer}>
          <Text>{getLabel(item)}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    padding: 10
  },
  text: {
    flex: 1,
    marginEnd: 24
  },
  headerFooterContainer: {
    padding: 10,
    alignItems: "center"
  },
  clearButton: { backgroundColor: "grey", borderRadius: 5, marginRight: 10, padding: 5 },
  optionContainer: {
    padding: 10,
    borderBottomColor: "grey",
    borderBottomWidth: 1
  },
  optionInnerContainer: {
    flex: 1,
    flexDirection: "row"
  },
  box: {
    width: 20,
    height: 20,
    marginRight: 10
  }
});

export default RNPicker;
