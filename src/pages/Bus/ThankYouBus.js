import React, { PureComponent } from "react";
import {
  View,
  Image,
  Modal,
  StyleSheet,
  SafeAreaView,
  Platform,
  ScrollView,
  Dimensions,
  TouchableOpacity
} from "react-native";
import { Button, Text, AutoCompleteModal, ActivityIndicator, Icon } from "../../components";

class ThankYouBus extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log(props.navigation.state.params);
  }

  render() {
    return (
      <View>
        <Text>ThankYouCab</Text>
      </View>
    );
  }
}

export default ThankYouBus;
