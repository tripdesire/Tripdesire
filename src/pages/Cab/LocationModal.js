import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  StatusBar
} from "react-native";
import { Button, Text, ActivityIndicator, Icon } from "../../components";
import Toast from "react-native-simple-toast";
import { etravosApi } from "../../service";
import Autocomplete from "react-native-autocomplete-input";
import { CabSugg } from "../../store/action";
import { connect } from "react-redux";
import analytics from "@react-native-firebase/analytics";

const { height } = Dimensions.get("window");

class SuggLoc extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log(props.data);
    this.state = {
      suggestions: props.data,
      loader: false,
      filteredList: [],
      finalArr: [],
      item: ""
    };
  }

  trackScreenView = async screen => {
    // Set & override the MainActivity screen name
    await analytics().setCurrentScreen(screen, screen);
  };

  componentDidMount() {
    this.trackScreenView("Location Modal");

    const { cabSuggestion } = this.props;

    if (cabSuggestion.length == 0) {
      this.setState({ loader: true });
      etravosApi
        .get("/Cabs/Cities")
        .then(res => {
          this.props.CabSugg(res.data);
          this.setState({ loader: false });
          console.log(res.data);
        })
        .catch(error => {
          Toast.show(error, Toast.LONG);
        });
    } else if (this.props.data) {
      this.setState({ suggestions: this.props.data });
    } else {
      console.log(this.props.selectedTransfer);
      this.setState({ item: cabSuggestion[0] });
      if (this.props.selectedTransfer == 1) {
        this.setState({
          suggestions: cabSuggestion[0].Airport
        });
      } else if (this.props.selectedTransfer == 2) {
        this.setState({
          suggestions: cabSuggestion[0].RailwayStation
        });
      } else if (this.props.selectedTransfer == 3) {
        this.setState({
          suggestions: cabSuggestion[0].Hotel
        });
      } else {
        this.setState({
          suggestions: [
            ...cabSuggestion[0].Airport,
            ...cabSuggestion[0].RailwayStation,
            ...cabSuggestion[0].Hotel
          ]
        });
      }
    }
  }

  filterList = text => {
    let filteredList = this.state.suggestions.filter((item, index) =>
      item.toLowerCase().includes(text.toLowerCase())
    );
    this.setState({ suggestions: filteredList });
  };

  handleItemChange = item => () => {
    this.props.onChange && this.props.onChange(item);
    this.props.item(this.state.item);
  };

  keyExtractor = (item, index) => {
    return "cab_" + item + index;
  };

  renderItem = ({ item, i }) => {
    let text = item;
    return (
      <TouchableOpacity
        style={{
          //backgroundColor: "#FFFFFF",
          //minHeight: 35,
          paddingStart: 8,
          marginVertical: 8,
          justifyContent: "center"
        }}
        onPress={this.handleItemChange(item)}
        key={"_Sep" + i}>
        <Text style={{ flex: 1 }}>{text + "\n"}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        <SafeAreaView style={{ flex: 0, backgroundColor: "#000000" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <View>
            <Button
              onPress={this.props.onModalBackPress}
              style={{
                alignItems: "center",
                justifyContent: "center",
                height: 48,
                width: 48,
                zIndex: 1
              }}>
              <Icon name="md-arrow-back" size={24} />
            </Button>
            <View style={styles.autocompleteContainer}>
              <Autocomplete
                placeholder={this.props.placeholder}
                inputContainerStyle={{
                  borderWidth: 0,
                  height: 48,
                  paddingStart: 48,
                  justifyContent: "center"
                }}
                data={this.state.suggestions}
                onChangeText={this.filterList}
                listStyle={{
                  maxHeight: height,
                  margin: 0,
                  paddingHorizontal: 16,
                  borderWidth: 0
                }}
                renderItem={this.renderItem}
                keyExtractor={this.keyExtractor}
              />
            </View>
            {this.state.loader && <ActivityIndicator />}
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  autocompleteContainer: {
    flex: 1,
    start: 0,
    position: "absolute",
    end: 0,
    top: 0
  }
});

const mapStateToProps = state => ({
  cabSuggestion: state.cabSuggestion
});

const mapDispatchToProps = {
  CabSugg
};

export default connect(mapStateToProps, mapDispatchToProps)(SuggLoc);
