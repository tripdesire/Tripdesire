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
  TouchableOpacity,
  FlatList
} from "react-native";
import { Button, Text, AutoCompleteModal, Activity_Indicator, Icon } from "../../components";
import Toast from "react-native-simple-toast";
import Ionicons from "react-native-vector-icons/Ionicons";
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import RNPickerSelect from "react-native-picker-select";
import Service from "../../service";
import { Header } from "../../components";
import SuggLoc from "./LocationModal";
import Autocomplete from "react-native-autocomplete-input";
import RenderItems from "./renderItems";
const { height } = Dimensions.get("window");

class CabList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      cabs: [],
      cabCount: "",
      loader: false
    };
  }

  componentDidMount() {
    const { params } = this.props.navigation.state;
    console.log(params);
    this.setState({ loader: true });
    Service.get("/Cabs/AvailableCabs", params)
      .then(({ data }) => {
        console.log(data);
        if (data.AvailableCabs == null) {
          //  console.log(data.AvailableTrips.length);
          this.setState({ cabCount: 0, loader: false });
          Toast.show("Data not found.", Toast.LONG);
        } else {
          this.setState({
            cabs: data.AvailableCabs,
            cabCount: data.AvailableCabs.length,
            loader: false
          });
        }
      })
      .catch(error => {
        console.log(error);
        Toast.show(error, Toast.LONG);
      });
  }

  _renderItemList = ({ item, index }) => {
    const { params } = this.props.navigation.state;
    return <RenderItems item={item} index={index} params={params} />;
  };

  _keyExtractoritems = (item, index) => "key" + index;

  render() {
    const { params } = this.props.navigation.state;
    const { cabCount, loader } = this.state;
    let journeyDate = moment(params.journeyDate, "DD-MM-YYYY").format("DD MMM");
    let returnDate = moment(params.returnDate, "DD-MM-YYYY").format("DD MMM");
    return (
      <View style={{ backgroundColor: "#E5EBF7", flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: "#E5EBF7" }}>
          <View
            style={{
              flexDirection: "row",
              width: "100%"
            }}>
            <Button onPress={() => this.props.navigation.goBack(null)} style={{ padding: 16 }}>
              <Icon name="md-arrow-back" size={24} />
            </Button>
            <View style={{ flex: 1, paddingTop: 16 }}>
              <View>
                <Text style={{ fontWeight: "700", fontSize: 16, marginHorizontal: 5 }}>
                  {params.sourceName}{" "}
                  {params.destinationName != "" ? "to " + params.destinationName : ""}
                </Text>
                <Text style={{ fontSize: 12, marginHorizontal: 5, color: "#717984" }}>
                  {journeyDate}{" "}
                  {params.returnDate && params.returnDate != "" ? "- " + returnDate : ""}
                  {cabCount ? ", " + cabCount + " Cabs Found" : ""}
                </Text>
              </View>
            </View>
            <Button
              style={{
                flexDirection: "row",
                marginStart: "auto",
                paddingEnd: 8,
                paddingVertical: 16
              }}>
              <Icon name="filter" size={20} color="#5D89F4" type="MaterialCommunityIcons" />
              <Text style={{ fontSize: 12, marginHorizontal: 5, color: "#717984" }}>
                Sort & Filter
              </Text>
            </Button>
          </View>
        </View>
        <View style={{ flex: 4, backgroundColor: "#FFFFFF" }}>
          <FlatList
            data={this.state.cabs}
            keyExtractor={this._keyExtractoritems}
            renderItem={this._renderItemList}
          />
          {cabCount == 0 && (
            <View style={{ alignItems: "center", justifyContent: "center", flex: 4 }}>
              <Text style={{ fontSize: 18, fontWeight: "700" }}>Data not Found.</Text>
            </View>
          )}
          {loader && <Activity_Indicator />}
        </View>
      </View>
    );
  }
}

export default CabList;
