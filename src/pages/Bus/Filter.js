import React from "react";
import { View, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { Button, Text, CheckBox, RadioButton, Header, Icon } from "../../components";
import { uniq } from "lodash";

class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: {
        busTimings: ["6.00 AM to 6.00 PM", "6.00 PM to 6.00 AM"],
        busType: ["AC", "Non AC", "Sleeper", "Seater"],
        travels: [],
        boardingPoints: [],
        droppingPoints: [],
        sortBy: [
          "Fare low to high",
          "Fare high to low",
          "Travels Asc",
          "Travels Desc",
          "Departure Asc",
          "Departure Desc",
          "Arrival Asc",
          "Arrival Desc"
        ]
      },
      index: 0
    };
    this.filterTabs = [
      "Bus Timings",
      "Bus Type",
      "Travels",
      "Boarding Points",
      "Dropping Points",
      "Sort by"
    ];
  }

  componentDidMount() {
    const { data } = this.props;
    //console.log(data);
    let travels = [];
    let boardingPoints = [];
    let droppingPoints = [];

    for (let value of data) {
      travels.push(value.DisplayName);
      boardingPoints.push(...value.BoardingTimes.map(item => item.Location));
      droppingPoints.push(...value.DroppingTimes.map(item => item.Location));
    }
    travels = uniq(travels).sort();
    boardingPoints = uniq(boardingPoints).sort();
    droppingPoints = uniq(droppingPoints).sort();

    this.setState({
      filters: {
        ...this.state.filters,
        travels,
        boardingPoints,
        droppingPoints
      }
    });
    //console.log(travels, boardingPoints, droppingPoints);
  }

  changeActiveTab = index => () => {
    this.setState({ index });
  };

  updateFilter = (key, index) => () => {
    const { filterValues } = this.props;
    const { filters } = this.state;
    let newData = Object.assign({}, filterValues);
    if (newData[key].includes(filters[key][index])) {
      newData[key].splice(
        newData[key].findIndex(val => val == filters[key][index]),
        1
      );
    } else {
      newData[key].push(filters[key][index]);
    }
    this.props.onChangeFilter && this.props.onChangeFilter(newData);
  };

  onRadioUpdate = (key, value) => () => {
    const { filterValues, onChangeFilter } = this.props;
    let newData = Object.assign({}, filterValues);
    newData[key] = value;
    console.log(newData);
    onChangeFilter && onChangeFilter(newData);
  };

  render() {
    const { index, filters } = this.state;
    const { filterValues } = this.props;

    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "white" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "grey" }}>
          <View style={styles.headerContainer}>
            <Button onPress={this.props.onBackPress} style={{ padding: 16 }}>
              <Icon name="md-arrow-back" size={24} />
            </Button>
            <Text style={{ fontWeight: "700", fontSize: 16 }}>Filter</Text>
          </View>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={{ flex: 2, backgroundColor: "#E8EEF6" }}>
              {this.filterTabs.map((item, i) => (
                <Button
                  style={[styles.filterTabs, i == index ? { backgroundColor: "#FFFFFF" } : null]}
                  key={"filter_" + item + index}
                  onPress={this.changeActiveTab(i)}>
                  <Text>{item}</Text>
                </Button>
              ))}
            </View>
            <View style={{ flex: 3, backgroundColor: "#FFFFFF" }}>
              {index == 0 && (
                <ScrollView>
                  {filters.busTimings.map((item, index) => (
                    <CheckBox
                      label={item}
                      key={"busTimings_" + item + index}
                      checked={filterValues.busTimings.includes(item)}
                      onPress={this.updateFilter("busTimings", index)}
                    />
                  ))}
                </ScrollView>
              )}
              {index == 1 && (
                <ScrollView>
                  {filters.busType.map((item, index) => (
                    <CheckBox
                      label={item}
                      key={"busType_" + item + index}
                      checked={filterValues.busType.includes(item)}
                      onPress={this.updateFilter("busType", index)}
                    />
                  ))}
                </ScrollView>
              )}
              {index == 2 && (
                <ScrollView>
                  {filters.travels.map((item, index) => (
                    <CheckBox
                      label={item}
                      key={"travels_" + item + index}
                      checked={filterValues.travels.includes(item)}
                      onPress={this.updateFilter("travels", index)}
                    />
                  ))}
                </ScrollView>
              )}
              {index == 3 && (
                <ScrollView>
                  {filters.boardingPoints.map((item, index) => (
                    <CheckBox
                      label={item}
                      key={"boardingPoints_" + item + index}
                      checked={filterValues.boardingPoints.includes(item)}
                      onPress={this.updateFilter("boardingPoints", index)}
                    />
                  ))}
                </ScrollView>
              )}
              {index == 4 && (
                <ScrollView>
                  {filters.droppingPoints.map((item, index) => (
                    <CheckBox
                      label={item}
                      key={"droppingPoints_" + item + index}
                      checked={filterValues.droppingPoints.includes(item)}
                      onPress={this.updateFilter("droppingPoints", index)}
                    />
                  ))}
                </ScrollView>
              )}
              {index == 5 &&
                filters.sortBy.map((item, index) => (
                  <RadioButton
                    key={"sort_" + item + index}
                    label={item}
                    onPress={this.onRadioUpdate("sortBy", item)}
                    selected={item === filterValues.sortBy}
                  />
                ))}
            </View>
          </View>
          <View style={styles.footer}>
            {/* <Button style={styles.resetButton} onPress={this.reset}>
            <Text style={{ fontWeight: "700" }}>Reset</Text>
          </Button> */}
            <Button style={styles.applyButton} onPress={this.props.filter}>
              <Text style={{ color: "#FFFFFF", fontWeight: "700" }}>Apply</Text>
            </Button>
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    backgroundColor: "#FFFFFF"
  },
  filterTabs: {
    width: "100%",
    padding: 16
  },
  footer: {
    flexDirection: "row",
    width: "100%",
    padding: 8,
    backgroundColor: "#FFFFFF"
  },
  resetButton: {
    padding: 16,
    flex: 2,
    alignItems: "center"
  },
  applyButton: {
    padding: 16,
    backgroundColor: "#F68E1F",
    borderRadius: 8,
    flex: 1,
    alignItems: "center"
  }
});

export default Filter;
