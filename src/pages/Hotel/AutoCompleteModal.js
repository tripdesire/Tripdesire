import React, { PureComponent } from "react";
import { View, Image, StyleSheet, Modal, TouchableOpacity, Picker } from "react-native";
import { Button, Text } from "../../components";
import Service from "../../service";
import Autocomplete from "react-native-autocomplete-input";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/Ionicons";
import moment from "moment";
import { connect } from "react-redux";
import { Header } from "../../components";

class AutoCompleteModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      filteredList: this.props.suggestions
    };
  }

  filterList = text => {
    console.log(text);
    let filteredList = this.props.suggestions.filter(item =>
      item.CityName.toLowerCase().includes(text.toLowerCase())
    );
    this.setState({ filteredList });
  };

  handleItemChange = item => () => {
    this.props.onChange && this.props.onChange(item);
  };

  renderItem = ({ item, i }) => (
    <TouchableOpacity
      style={{
        backgroundColor: "#FFFFFF",
        height: 30,
        justifyContent: "center",
        marginHorizontal: 10
      }}
      onPress={this.handleItemChange(item)}>
      <Text>
        {item.CityName}, {item.CityId} - (India)
      </Text>
    </TouchableOpacity>
  );

  keyExtractor = (item, index) => item.CityName + index;

  render() {
    return (
      <Modal animationType="slide" transparent={false} visible={this.props.visible}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Button
            onPress={this.props.onModalBackPress}
            style={{ alignItems: "center", justifyContent: "center", height: 48, width: 48 }}>
            <Icon name="md-arrow-back" size={24} />
          </Button>
          <View style={styles.autocompleteContainer}>
            <Autocomplete
              placeholder={this.props.placeholder}
              inputContainerStyle={{ borderWidth: 0, height: 48, justifyContent: "center" }}
              data={this.state.filteredList}
              onChangeText={this.filterList}
              listStyle={{ maxHeight: 300 }}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
            />
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  autocompleteContainer: {
    flex: 1,
    start: 48,
    position: "absolute",
    end: 0,
    top: 0,
    zIndex: 1
  }
});

export default AutoCompleteModal;
