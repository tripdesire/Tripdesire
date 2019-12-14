import React, { useState } from "react";
import { View, SafeAreaView, StyleSheet } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { Button, Text, Icon } from "../../components";

function AddPassengers({ submit, onModalBackPress }) {
  const [adult, setAdult] = useState("1");
  const [children, setChildren] = useState("0");
  const [infants, setInfants] = useState("0");

  const _submit = () => {
    submit && submit({ adult, children, infants });
  };
  const changeAdults = value => {
    setAdult(value);
  };
  const changeChildren = value => {
    setChildren(value);
  };
  const changeInfants = value => {
    setInfants(value);
  };
  const ArrowDown = () => <Icon name="ios-arrow-down" size={20} />;

  return (
    <>
      <SafeAreaView style={{ flex: 0, backgroundColor: "#ffffff" }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
        <View>
          <View style={styles.container}>
            <Button
              onPress={onModalBackPress}
              style={{
                alignItems: "center",
                justifyContent: "center",
                height: 48,
                width: 48
              }}>
              <Icon name="md-arrow-back" size={24} />
            </Button>
            <Text style={{ fontSize: 18 }}>Choose Passengers</Text>
          </View>
          <View style={styles.pickerContainer}>
            <View style={{ alignItems: "center" }}>
              <Text>Adults</Text>
              <RNPickerSelect
                useNativeAndroidPickerStyle={false}
                placeholder={{}}
                value={adult}
                style={{
                  inputAndroidContainer: { height: 40, width: 40 },
                  inputAndroid: { paddingStart: 0, color: "#000" },
                  iconContainer: { justifyContent: "center", top: 0, bottom: 0 }
                }}
                onValueChange={changeAdults}
                items={[
                  { value: "1", label: "1" },
                  { value: "2", label: "2" },
                  { value: "3", label: "3" },
                  { value: "4", label: "4" },
                  { value: "5", label: "5" },
                  { value: "6", label: "6" },
                  { value: "7", label: "7" },
                  { value: "8", label: "8" },
                  { value: "9", label: "9" }
                ]}
                Icon={ArrowDown}
              />
            </View>
            <View style={{ alignItems: "center" }}>
              <Text>Childrens</Text>
              <RNPickerSelect
                useNativeAndroidPickerStyle={false}
                placeholder={{}}
                value={children}
                style={{
                  inputAndroidContainer: { height: 40, width: 40 },
                  inputAndroid: { paddingStart: 0, color: "#000" },
                  iconContainer: { justifyContent: "center", top: 0, bottom: 0 }
                }}
                onValueChange={changeChildren}
                items={[
                  { value: "0", label: "0" },
                  { value: "1", label: "1" },
                  { value: "2", label: "2" },
                  { value: "3", label: "3" },
                  { value: "4", label: "4" },
                  { value: "5", label: "5" },
                  { value: "6", label: "6" },
                  { value: "7", label: "7" },
                  { value: "8", label: "8" },
                  { value: "9", label: "9" }
                ]}
                Icon={ArrowDown}
              />
            </View>
            <View style={{ alignItems: "center" }}>
              <Text>Infants</Text>
              <RNPickerSelect
                useNativeAndroidPickerStyle={false}
                placeholder={{}}
                value={infants}
                style={{
                  inputAndroidContainer: { height: 40, width: 40 },
                  inputAndroid: { paddingStart: 0, color: "#000" },
                  iconContainer: { justifyContent: "center", top: 0, bottom: 0 }
                }}
                onValueChange={changeInfants}
                items={[
                  { value: "0", label: "0" },
                  { value: "1", label: "1" },
                  { value: "2", label: "2" },
                  { value: "3", label: "3" },
                  { value: "4", label: "4" },
                  { value: "5", label: "5" },
                  { value: "6", label: "6" },
                  { value: "7", label: "7" },
                  { value: "8", label: "8" },
                  { value: "9", label: "9" }
                ]}
                Icon={ArrowDown}
              />
            </View>
          </View>
          <Button style={styles.btn} onPress={_submit}>
            <Text style={{ paddingHorizontal: 40, color: "#fff" }}>Submit</Text>
          </Button>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center"
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginVertical: 10
  },
  btn: {
    height: 40,
    backgroundColor: "#F68E1F",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    borderRadius: 20
  }
});

export default React.memo(AddPassengers);
