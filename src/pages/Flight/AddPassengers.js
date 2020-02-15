import React, { useState } from "react";
import { View, SafeAreaView, StyleSheet, StatusBar } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { Button, Text, Icon } from "../../components";
import Toast from "react-native-simple-toast";

function AddPassengers({ submit, onModalBackPress, adultCount, childrenCount, infantsCount }) {
  console.log(adultCount, childrenCount, infantsCount);
  const [adult, setAdult] = useState(adultCount);
  const [children, setChildren] = useState(childrenCount);
  const [infants, setInfants] = useState(infantsCount);
  const [childValue, setChildValue] = useState(
    [...Array(10 - parseInt(adultCount) - parseInt(infantsCount))].map((item, index) => {
      return { value: index.toString(), label: index.toString() };
    })
  );
  const [InfantValue, setInfantValue] = useState(
    [...Array(10 - parseInt(adultCount) - parseInt(childrenCount))].map((item, index) => {
      return { value: index.toString(), label: index.toString() };
    })
  );

  const _submit = () => {
    if (parseInt(adult) + parseInt(children) + parseInt(infants) > 9) {
      Toast.show("Total passengers can not be greater than 9");
    } else if (adult < infants) {
      Toast.show("Infants can not be greater adults", Toast.SHORT);
    } else {
      submit && submit({ adult, children, infants });
    }
  };
  const changeAdults = value => {
    setAdult(value);
    //let newArray = Object.assign([], childValue);
    console.log(10 - parseInt(value) + parseInt(infants));
    if (9 >= parseInt(value) + parseInt(infants)) {
      let newArray = [...Array(10 - parseInt(value) - parseInt(infants))].map((item, index) => {
        return { value: index.toString(), label: index.toString() };
      });
      setChildValue(newArray);
    }
    console.log(10 - parseInt(value) + parseInt(children));
    if (9 >= parseInt(value) + parseInt(children)) {
      let newArrayInfant = [...Array(10 - parseInt(value) - parseInt(children))].map(
        (item, index) => {
          return { value: index.toString(), label: index.toString() };
        }
      );
      setInfantValue(newArrayInfant);
    }
  };
  const changeChildren = value => {
    setChildren(value);
    let newArray = [...Array(10 - parseInt(adult) - parseInt(value))].map((item, index) => {
      return { value: index.toString(), label: index.toString() };
    });
    setInfantValue(newArray);
  };
  const changeInfants = value => {
    setInfants(value);
    let newArray = [...Array(10 - parseInt(adult) - parseInt(value))].map((item, index) => {
      return { value: index.toString(), label: index.toString() };
    });
    setChildValue(newArray);
  };
  const ArrowDown = () => <Icon name="ios-arrow-down" size={20} />;

  return (
    <>
      <SafeAreaView style={{ flex: 0, backgroundColor: "#000000" }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
        <StatusBar backgroundColor="black" barStyle="light-content" />
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
            <Text style={{ fontSize: 18 }}>Choose Traveller</Text>
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
                  inputIOS: { color: "#000" },
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

            <View
              style={{
                alignItems: "center"
              }}>
              <Text>Children</Text>
              <RNPickerSelect
                useNativeAndroidPickerStyle={false}
                placeholder={{}}
                value={children}
                style={{
                  inputAndroidContainer: { height: 40, width: 40 },
                  inputAndroid: { paddingStart: 0, color: "#000" },
                  inputIOS: { color: "#000" },
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
                  { value: "8", label: "8" }
                ]}
                Icon={ArrowDown}
              />
            </View>
            <View
              style={{
                alignItems: "center"
              }}>
              <Text>Infants</Text>
              <RNPickerSelect
                useNativeAndroidPickerStyle={false}
                placeholder={{}}
                value={infants}
                style={{
                  inputAndroidContainer: { height: 40, width: 40 },
                  inputAndroid: { paddingStart: 0, color: "#000" },
                  inputIOS: { color: "#000" },
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
                  { value: "8", label: "8" }
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
    height: 36,
    backgroundColor: "#F68E1F",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    borderRadius: 20
  }
});

export default React.memo(AddPassengers);
