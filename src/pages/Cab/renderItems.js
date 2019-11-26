import React, {PureComponent} from "react";
import {
  View,
  Image,
  Modal,
  StyleSheet,
  SafeAreaView,
  Platform,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  FlatList
} from "react-native";
import {Button, Text, AutoCompleteModal, ActivityIndicator, Icon} from "../../components";
import Toast from "react-native-simple-toast";
import Ionicons from "react-native-vector-icons/Ionicons";
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import RNPickerSelect from "react-native-picker-select";
import Service from "../../service";
import {Header} from "../../components";
import SuggLoc from "./LocationModal";
import Autocomplete from "react-native-autocomplete-input";

const {height} = Dimensions.get("window");

class RenderItems extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      closeDetails: false
    };
  }

  _onFareDetails = () => {
    this.setState({closeDetails: true});
  };

  closeFareDetails = () => {
    this.setState({closeDetails: false});
  };

  render() {
    const {closeDetails} = this.state;
    return (
      <View
        style={{
          paddingVertical: 20,
          backgroundColor: this.props.index % 2 == 0 ? "#FFFFFF" : "#E5EBF7"
        }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginHorizontal: 16
          }}>
          <Text style={{flex: 1, fontWeight: "700", fontSize: 16}}>{this.props.item.Name}</Text>
          <Button
            style={{
              backgroundColor: "#5191FB",
              borderRadius: 20,
              paddingHorizontal: 10,
              paddingVertical: 5
            }}>
            <Text style={{color: "#fff", fontWeight: "600"}}>Book Now</Text>
          </Button>
        </View>
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 16,
            alignItems: "center",
            marginVertical: 10
          }}>
          <Icon name={Platform.OS == "ios" ? "ios-car" : "md-car"} size={50} />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              flex: 1
            }}>
            <View style={{flexDirection: "row", alignItems: "center"}}>
              <Icon
                name="seat"
                type="MaterialCommunityIcons"
                size={24}
                color="#6287F9"
                style={{paddingHorizontal: 5}}
              />
              <Text>{this.props.item.SeatingCapacity} Setas</Text>
              <Icon
                name="shopping-bag"
                type="Foundation"
                size={24}
                color="#6287F9"
                style={{paddingHorizontal: 5}}
              />
              <Text>{this.props.item.AdditionalInfo.BaggageQuantity} bags</Text>
            </View>
            <View style={{alignItems: "flex-end"}}>
              <Text style={{fontSize: 16, fontWeight: "600", lineHeight: 20}}>
                $ {this.props.item.PerKm}/km
              </Text>
              <Text style={{fontSize: 18, fontWeight: "700", lineHeight: 22}}>
                $ {this.props.item.TotalNetAmount}
              </Text>
            </View>
          </View>
        </View>
        <View style={{flexDirection: "row", marginHorizontal: 16}}>
          <Text style={{flex: 1, paddingEnd: 10}}>Full cancellation policy</Text>
          <Button
            style={{flexDirection: "row", alignItems: "center", justifyContent: "center"}}
            onPress={this._onFareDetails}>
            <Icon type="FontAwesome" name="mobile-phone" size={24} color="#6287F9" />
            <Text style={{paddingStart: 5, fontWeight: "700", color: "#6287F9"}}>Fare Details</Text>
          </Button>
        </View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={closeDetails}
          onRequestClose={this.closeFareDetails}>
          <FareDetails data={this.props.item} onBackPress={this.closeFareDetails} />
        </Modal>
      </View>
    );
  }
}

class FareDetails extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log(this.props.data);
  }

  render() {
    const {data} = this.props;
    return (
      <View>
        <View style={styles.headerContainer}>
          <Button onPress={this.props.onBackPress} style={{padding: 16}}>
            <Icon name="md-arrow-back" size={24} />
          </Button>
          <Text style={{fontWeight: "700", fontSize: 18}}>Fare Details</Text>
        </View>
        <Text style={{marginHorizontal: 16, fontWeight: "700", fontSize: 16}}>Fare Details</Text>
        <Text style={{marginHorizontal: 16}}>
          Approx. one way distance : {data.ApproxDistance} Kms.
        </Text>
        <Text style={{marginHorizontal: 16, fontWeight: "700", fontSize: 16, marginTop: 10}}>
          If you will use car/cab more than day(s) and {data.ApproxDistance} kms extra charges as
          follows:
        </Text>
        <Text style={{marginHorizontal: 16}}>After {data.ApproxDistance} kms & day(s) :</Text>
        <View style={{marginHorizontal: 16, flexDirection: "row", alignItems: "center"}}>
          <View style={{backgroundColor: "black", width: 8, height: 8, borderRadius: 8}}></View>
          <Text style={{marginStart: 10}}>Rs {data.PerKm} per Km.</Text>
        </View>
        <View style={{marginHorizontal: 16, flexDirection: "row", alignItems: "center"}}>
          <View style={{backgroundColor: "black", width: 8, height: 8, borderRadius: 8}}></View>
          <Text style={{marginStart: 10}}>Rs {data.DriverCharges} per day driver charges</Text>
        </View>
        <Text style={{marginHorizontal: 16, fontWeight: "700", fontSize: 16, marginTop: 10}}>
          Terms & Conditions:
        </Text>
        <Text style={{marginHorizontal: 16}}>Fare includes Vehicle & Fuel charges</Text>
        <Text style={{marginHorizontal: 16}}>
          Each day will be counted from midnight 12 to midnight 12
        </Text>
        <Text style={{marginHorizontal: 16}}>
          Toll(both-ways), State Tax, Parking & Airport Entry (not included in bill) to be paid
          wherever applicable
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    backgroundColor: "#FFFFFF"
  }
});

export default RenderItems;
