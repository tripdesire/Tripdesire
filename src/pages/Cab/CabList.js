import React, { PureComponent } from "react";
import { View, FlatList, Modal } from "react-native";
import { Button, Text, ActivityIndicator, Icon } from "../../components";
import Toast from "react-native-simple-toast";
import moment from "moment";
import { etravosApi } from "../../service";
import RenderItems from "./RenderItems";
import Filter from "./Filter";

class CabList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      cabs: [],
      filteredcabs: [],
      loader: false,
      filterModalVisible: false,
      filterValues: {
        cars: [],
        seatingCapacity: [],
        price: []
      }
    };
  }
  openFilter = () => {
    this.setState({ filterModalVisible: true });
  };
  closeFilter = () => {
    this.setState({ filterModalVisible: false });
  };
  onChangeFilter = filterValues => {
    this.setState({ filterValues });
  };
  filter = () => {
    const { filterValues, cabs } = this.state;
    let filteredcabs = cabs.filter(
      item =>
        (filterValues.cars.length == 0 || filterValues.cars.includes(item.Name)) &&
        (filterValues.seatingCapacity.length == 0 ||
          filterValues.seatingCapacity.includes(item.SeatingCapacity)) &&
        (filterValues.price.length == 0 ||
          (filterValues.price[0] <= item.TotalAmount && filterValues.price[1] >= item.TotalAmount))
    );
    this.setState({
      filteredcabs,
      filterModalVisible: false
    });
  };

  componentDidMount() {
    const { params } = this.props.navigation.state;
    console.log(params);
    this.setState({ loader: true });
    etravosApi
      .get("/Cabs/AvailableCabs", params)
      .then(({ data }) => {
        console.log(data);
        if (data.AvailableCabs == null) {
          this.setState({ loader: false });
          Toast.show("Data not found.", Toast.LONG);
        } else {
          this.setState({
            filteredcabs: data.AvailableCabs,
            cabs: data.AvailableCabs,
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
    const { loader, cabs, filteredcabs, filterModalVisible } = this.state;
    let journeyDate = moment(params.journeyDate, "DD-MM-YYYY").format("DD MMM");
    let returnDate = moment(params.returnDate, "DD-MM-YYYY").format("DD MMM");
    return (
      <View style={{ flex: 1 }}>
        <View style={{ backgroundColor: "#E5EBF7", flexDirection: "row", width: "100%" }}>
          <Button onPress={() => this.props.navigation.goBack(null)} style={{ padding: 16 }}>
            <Icon name="md-arrow-back" size={24} />
          </Button>
          <View style={{ flex: 1, paddingTop: 16, paddingBottom: 8 }}>
            <View>
              <Text style={{ fontWeight: "700", fontSize: 16, marginHorizontal: 5 }}>
                {params.sourceName}{" "}
                {params.destinationName != "" ? "to " + params.destinationName : ""}
              </Text>
              <Text style={{ fontSize: 12, marginHorizontal: 5, color: "#717984" }}>
                {journeyDate}{" "}
                {params.returnDate && params.returnDate != "" ? "- " + returnDate : ""}
                {loader ? "" : ", " + filteredcabs.length + " Cabs Found"}
              </Text>
            </View>
          </View>
          <Button
            style={{
              flexDirection: "row",
              marginStart: "auto",
              paddingEnd: 8,
              paddingVertical: 16
            }}
            onPress={this.openFilter}>
            <Icon name="filter" size={20} color="#5D89F4" type="MaterialCommunityIcons" />
            <Text style={{ fontSize: 14, marginHorizontal: 5, color: "#717984" }}>
              Sort & Filter
            </Text>
          </Button>
        </View>
        <View style={{ flex: 4, backgroundColor: "#FFFFFF" }}>
          <FlatList
            data={filteredcabs}
            keyExtractor={this._keyExtractoritems}
            renderItem={this._renderItemList}
          />
          {filteredcabs.length == 0 && (
            <View style={{ alignItems: "center", justifyContent: "center", flex: 4 }}>
              <Text style={{ fontSize: 18, fontWeight: "700" }}>Data not Found.</Text>
            </View>
          )}
          <Modal
            animationType="slide"
            transparent={false}
            visible={filterModalVisible}
            onRequestClose={this.closeFilter}>
            <Filter
              data={cabs}
              onBackPress={this.closeFilter}
              filterValues={this.state.filterValues}
              onChangeFilter={this.onChangeFilter}
              filter={this.filter}
            />
          </Modal>
          {loader && <ActivityIndicator />}
        </View>
      </View>
    );
  }
}

export default CabList;
