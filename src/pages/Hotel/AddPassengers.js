import React, { PureComponent } from "react";
import { View, StatusBar, Modal, SafeAreaView } from "react-native";
import { Button, Text } from "../../components";
import Icon from "react-native-vector-icons/Ionicons";
import RNPickerSelect from "react-native-picker-select";
import Toast from "react-native-simple-toast";
import analytics from "@react-native-firebase/analytics";

class AddPassengers extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      room: 1,
      data: [
        { adults: 1, children: 0, childAge: [-1, -1] },
        { adults: 1, children: 0, childAge: [-1, -1] },
        { adults: 1, children: 0, childAge: [-1, -1] },
        { adults: 1, children: 0, childAge: [-1, -1] }
      ]
    };
  }
  trackScreenView = async screen => {
    // Set & override the MainActivity screen name
    await analytics().setCurrentScreen(screen, screen);
  };
  componentDidMount() {
    this.trackScreenView("Hotel Add Passengers");
  }
  onRoomChange = (itemValue, index) => {
    let newData = Object.assign([], this.state.data);
    for (let i = 0; i <= index; i++) {
      newData[i] = { adults: 1, children: 0, childAge: [-1, -1] };
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

  validate = () => {
    let needToValidateChildsAge = false;
    for (let i = 0; i < this.state.data.length; i++) {
      for (let j = 0; j < this.state.data[i].children; j++) {
        console.log(this.state.data[i].childAge[j]);
        if (this.state.data[i].children > 0 && this.state.data[i].childAge[j] == -1) {
          return needToValidateChildsAge == false;
        } else if (this.state.data[i].children == 0) {
          return needToValidateChildsAge == false;
        }
      }
    }
  };

  _submit = () => {
    if (!this.validate()) {
      let newData = Object.assign({}, this.state);
      for (let i = newData.room; i < this.state.data.length; i++) {
        newData.data[i] = { adults: 0, children: 0, childAge: [-1, -1] };
      }
      this.props.submit && this.props.submit(newData);
    } else {
      Toast.show("Children age can't empty");
    }
  };

  render() {
    return (
      <Modal animationType="slide" transparent={false} visible={this.props.visible}>
        <>
          <StatusBar backgroundColor="black" barStyle="light-content" />
          <SafeAreaView style={{ flex: 0, backgroundColor: "#000000" }} />
          <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
            <View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Button
                  onPress={this.props.modalClose}
                  style={{ alignItems: "center", justifyContent: "center", height: 48, width: 48 }}>
                  <Icon name="md-arrow-back" size={24} />
                </Button>
                <Text style={{ fontSize: 18 }}>Choose Rooms & Guests</Text>
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
                  <RNPickerSelect
                    useNativeAndroidPickerStyle={false}
                    placeholder={{}}
                    value={this.state.room}
                    style={{
                      inputAndroidContainer: { height: 40 },
                      inputAndroid: { paddingStart: 0, color: "#000" },
                      inputIOS: { color: "#000" },
                      iconContainer: { justifyContent: "center", top: 0, bottom: 0 }
                    }}
                    onValueChange={this.onRoomChange}
                    items={[
                      { value: 1, label: "1" },
                      { value: 2, label: "2" },
                      { value: 3, label: "3" },
                      { value: 4, label: "4" }
                    ]}
                    Icon={() => <Icon name="ios-arrow-down" size={20} />}
                  />
                </View>
              </View>
              {[...Array(this.state.room)].map((e, index) => (
                <View
                  style={{
                    flexDirection: "row",
                    marginHorizontal: 20,
                    marginVertical: 10
                  }}
                  key={"room" + index}>
                  <View style={{ alignItems: "center" }}>
                    <Text>Adults</Text>

                    <RNPickerSelect
                      useNativeAndroidPickerStyle={false}
                      placeholder={{}}
                      value={this.state.data[index].adults}
                      style={{
                        inputAndroidContainer: { height: 40 },
                        inputAndroid: { paddingStart: 0, color: "#000" },
                        inputIOS: { color: "#000" },
                        iconContainer: { justifyContent: "center", top: 0, bottom: 0 }
                      }}
                      onValueChange={this.onAdultsChange(index)}
                      items={[
                        { value: 1, label: "1" },
                        { value: 2, label: "2" },
                        { value: 3, label: "3" },
                        { value: 4, label: "4" }
                      ]}
                      Icon={() => <Icon name="ios-arrow-down" size={20} />}
                    />
                  </View>
                  <View style={{ alignItems: "center", marginStart: 10 }}>
                    <Text>Children</Text>

                    <RNPickerSelect
                      useNativeAndroidPickerStyle={false}
                      placeholder={{}}
                      value={this.state.data[index].children}
                      style={{
                        inputAndroidContainer: { height: 40 },
                        inputAndroid: { paddingStart: 0, color: "#000" },
                        inputIOS: { color: "#000" },
                        iconContainer: { justifyContent: "center", top: 0, bottom: 0 }
                      }}
                      onValueChange={this.onChildrenChange(index)}
                      items={[
                        { value: 0, label: "0" },
                        { value: 1, label: "1" },
                        { value: 2, label: "2" }
                      ]}
                      Icon={() => <Icon name="ios-arrow-down" size={20} />}
                    />
                  </View>
                  {[...Array(this.state.data[index].children)].map((ch, childIndex) => (
                    <View
                      style={{ alignItems: "center", marginStart: 10 }}
                      key={"room" + index + childIndex}>
                      <Text>Child {childIndex + 1} age</Text>

                      <RNPickerSelect
                        useNativeAndroidPickerStyle={false}
                        placeholder={{}}
                        value={this.state.data[index].childAge[childIndex]}
                        style={{
                          inputAndroidContainer: { height: 40 },
                          inputAndroid: { paddingStart: 0, color: "#000" },
                          inputIOS: { color: "#000" },
                          iconContainer: { justifyContent: "center", top: 0, bottom: 0 }
                        }}
                        onValueChange={this.onChildAgeChange(index, childIndex)}
                        items={[
                          { value: -1, label: "--" },
                          { value: 0, label: "<1" },
                          { value: 1, label: "1" },
                          { value: 2, label: "2" },
                          { value: 3, label: "3" },
                          { value: 4, label: "4" },
                          { value: 5, label: "5" }
                        ]}
                        Icon={() => <Icon name="ios-arrow-down" size={20} />}
                      />
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
          </SafeAreaView>
        </>
      </Modal>
    );
  }
}

export default AddPassengers;
