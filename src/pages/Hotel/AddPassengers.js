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

class AddPassengers extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      room: 1,
      data: [
        { adults: 0, children: 0, childAge: [-1, -1] },
        { adults: 0, children: 0, childAge: [-1, -1] },
        { adults: 0, children: 0, childAge: [-1, -1] },
        { adults: 0, children: 0, childAge: [-1, -1] }
      ]
    };
  }
  onRoomChange = (itemValue, index) => {
    let newData = Object.assign([], this.state.data);
    for (let i = index + 1; i < this.state.data.length; i++) {
      newData[i] = { adults: 0, children: 0, childAge: [-1, -1] };
    }
    this.setState({
      room: itemValue,
      data: newData
    });
  };
  onAdultsChange = index => value => {
    let newData = Object.assign([], this.state.data);
    newData[index].adults = value;
    this.setState({
      data: newData
    });
  };

  onChildrenChange = index => value => {
    let newData = Object.assign([], this.state.data);
    newData[index].children = value;
    newData[index].childAge = [-1, -1];
    this.setState({
      data: newData
    });
  };

  onChildAgeChange = (index, childIndex) => value => {
    let newData = Object.assign([], this.state.data);
    newData[index].childAge[childIndex] = value;
    this.setState({
      data: newData
    });
  };

  _submit = () => {
    this.props.submit && this.props.submit(this.state);
  };

  render() {
    return (
      <Modal animationType="slide" transparent={false} visible={this.props.visible}>
        <View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Button
              onPress={this.props.modalClose}
              style={{ alignItems: "center", justifyContent: "center", height: 48, width: 48 }}>
              <Icon name="md-arrow-back" size={24} />
            </Button>
            <Text style={{ fontSize: 18 }}>Choose Passengers</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginHorizontal: 20,
              marginVertical: 10
            }}>
            <View style={{ alignItems: "center" }}>
              <Text>Rooms</Text>
              <Picker
                selectedValue={this.state.room}
                style={{
                  height: 50,
                  width: 60,
                  borderWidth: 1,
                  borderRadius: 5,
                  borderColor: "#000"
                }}
                onValueChange={this.onRoomChange}>
                <Picker.Item label="1" value={1} />
                <Picker.Item label="2" value={2} />
                <Picker.Item label="3" value={3} />
                <Picker.Item label="4" value={4} />
              </Picker>
            </View>
          </View>
          {[...Array(this.state.room)].map((e, index) => (
            <View
              style={{
                flexDirection: "row",
                //justifyContent: "space-between",
                marginHorizontal: 20,
                marginVertical: 10
              }}
              key={"room" + index}>
              <View style={{ alignItems: "center" }}>
                <Text>Adults</Text>
                <Picker
                  selectedValue={this.state.data[index].adults}
                  style={{
                    height: 50,
                    width: 60,
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor: "#000"
                  }}
                  onValueChange={this.onAdultsChange(index)}>
                  <Picker.Item label="0" value={0} />
                  <Picker.Item label="1" value={1} />
                  <Picker.Item label="2" value={2} />
                </Picker>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text>Children</Text>
                <Picker
                  selectedValue={this.state.data[index].children}
                  style={{ height: 50, width: 60 }}
                  onValueChange={this.onChildrenChange(index)}>
                  <Picker.Item label="0" value={0} />
                  <Picker.Item label="1" value={1} />
                  <Picker.Item label="2" value={2} />
                </Picker>
              </View>
              {[...Array(this.state.data[index].children)].map((ch, childIndex) => (
                <View style={{ alignItems: "center" }} key={"room" + index + childIndex}>
                  <Text>Child{childIndex + 1} age</Text>
                  <Picker
                    selectedValue={this.state.data[index].childAge[childIndex]}
                    style={{ height: 50, width: 60 }}
                    onValueChange={this.onChildAgeChange(index, childIndex)}>
                    <Picker.Item label="--" value={-1} />
                    <Picker.Item label="<1" value={0} />
                    <Picker.Item label="1" value={1} />
                    <Picker.Item label="2" value={2} />
                    <Picker.Item label="3" value={3} />
                    <Picker.Item label="4" value={4} />
                    <Picker.Item label="5" value={5} />
                  </Picker>
                </View>
              ))}
            </View>
          ))}

          <Button
            style={{
              height: 40,
              backgroundColor: "#F68E1F",
              justifyContent: "center",
              alignItems: "center",
              marginHorizontal: 20,
              borderRadius: 8
            }}
            onPress={this._submit}>
            <Text style={{ paddingHorizontal: 40, color: "#fff" }}>Submit</Text>
          </Button>
        </View>
      </Modal>
    );
  }
}

export default AddPassengers;
