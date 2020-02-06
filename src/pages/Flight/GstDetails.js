import React, { PureComponent } from "react";
import { View, StatusBar, SafeAreaView } from "react-native";
import { Text, Button, TextInputComponent, Icon } from "../../components";
import analytics from "@react-native-firebase/analytics";

class GstDetails extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log(this.props.data);
    this.state = {
      GSTCompanyAddress: "",
      GSTCompanyContactNumber: "",
      GSTCompanyName: "",
      GSTNumber: "",
      GSTCompanyEmail: "",
      GSTFirstName: "",
      GSTLastName: ""
    };
  }

  trackScreenView = async screen => {
    // Set & override the MainActivity screen name
    await analytics().setCurrentScreen(screen, screen);
  };
  componentDidMount() {
    this.trackScreenView("Flight Gst Details");
  }

  _submit = () => {
    this.props.onBackPress && this.props.onBackPress(this.state);
  };

  //   GSTCompanyAddress: "Hyderabad",
  //   GSTCompanyContactNumber: "9234234234",
  //   GSTCompanyName: "i2space",
  //   GSTNumber: "534234234233",
  //   GSTCompanyEmail: "guru.m@i2space.com",
  //   GSTFirstName: "guru",
  //   GSTLastName: "bharat"

  render() {
    const {
      GSTCompanyAddress,
      GSTCompanyContactNumber,
      GSTCompanyName,
      GSTNumber,
      GSTCompanyEmail,
      GSTFirstName,
      GSTLastName
    } = this.state;
    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "#000000" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <StatusBar backgroundColor="black" barStyle="light-content" />
          <View>
            <View
              style={{
                flexDirection: "row",
                height: 56,
                backgroundColor: "#E5EBF7",
                alignItems: "center"
              }}>
              <Button style={{ padding: 16 }} onPress={this.props.onBackPress}>
                <Icon name="md-arrow-back" size={24} />
              </Button>
              <Text style={{ fontSize: 18, color: "#1E293B", marginStart: 10, fontWeight: "700" }}>
                GST Details
              </Text>
            </View>
            <View style={{ marginHorizontal: 16, alignItems: "center" }}>
              <TextInputComponent
                label="GST Company Address"
                placeholder="Tap to write"
                value={GSTCompanyAddress}
                onChangeText={text => this.setState({ GSTCompanyAddress: text })}
              />
              <TextInputComponent
                label="GST Company Contact Number"
                placeholder="Tap to write"
                value={GSTCompanyContactNumber}
                onChangeText={text => this.setState({ GSTCompanyContactNumber: text })}
              />
              <TextInputComponent
                label="GST Company Name"
                placeholder="Tap to write"
                value={GSTCompanyName}
                onChangeText={text => this.setState({ GSTCompanyName: text })}
              />
              <TextInputComponent
                label="GST Number"
                placeholder="Tap to write"
                value={GSTNumber}
                onChangeText={text => this.setState({ GSTNumber: text })}
              />
              <TextInputComponent
                label="GST Company Email"
                placeholder="Tap to write"
                value={GSTCompanyEmail}
                onChangeText={text => this.setState({ GSTCompanyEmail: text })}
              />
              <TextInputComponent
                label="GST First Name"
                placeholder="Tap to write"
                value={GSTFirstName}
                onChangeText={text => this.setState({ GSTFirstName: text })}
              />
              <TextInputComponent
                label="GST Last Name"
                placeholder="Tap to write"
                value={GSTLastName}
                onChangeText={text => this.setState({ GSTLastName: text })}
              />
              <View style={{ flexDirection: "row" }}>
                <Button
                  style={{
                    height: 40,
                    marginTop: 20,
                    marginEnd: 10,
                    backgroundColor: "#F68E1F",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "40%",
                    borderRadius: 20
                  }}
                  onPress={this._submit}>
                  <Text style={{ paddingHorizontal: 40, color: "#fff" }}>Submit</Text>
                </Button>
                <Button
                  style={{
                    height: 40,
                    marginTop: 20,
                    marginStart: 10,
                    backgroundColor: "#F68E1F",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "40%",
                    borderRadius: 20
                  }}
                  onPress={this._submit}>
                  <Text style={{ paddingHorizontal: 40, color: "#fff" }}>Skip</Text>
                </Button>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </>
    );
  }
}

export default GstDetails;
