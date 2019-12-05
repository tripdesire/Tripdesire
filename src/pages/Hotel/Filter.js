import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { Button, Icon, Text, CheckBox } from "../../components";
import { uniq, max, min, isEmpty } from "lodash";
import RangeSlider from "rn-range-slider";

function Filter({ data, onBackPress, filterValues, onChangeFilter, filter }) {
  const [index, setIndex] = useState(0);
  const [filterTabs, setFilterTab] = useState(["Price", "Rating", "Amenities"]);
  const [filters, setFilters] = useState({
    price: {},
    rating: ["5", "4", "3", "2", "1"],
    amenities: []
  });

  useEffect(() => {
    //console.log(data);
    let price = [];
    let amenities = [];

    for (let value of data) {
      price.push(...value.RoomDetails.map(item => item.RoomTotal));
      amenities.push(...value.Facilities.split(",").map(item => item.trim()));
    }
    amenities = uniq(amenities).sort();
    price = { min: Math.floor(min(price)), max: Math.ceil(max(price)) };

    setFilters({
      ...filters,
      price,
      amenities
    });
    console.log(filters);
  }, []);

  const updateFilter = (key, index) => () => {
    let newData = Object.assign({}, filterValues);
    if (newData[key].includes(filters[key][index])) {
      newData[key].splice(
        newData[key].findIndex(val => val == filters[key][index]),
        1
      );
    } else {
      newData[key].push(filters[key][index]);
    }
    onChangeFilter && onChangeFilter(newData);
  };

  const priceUpdate = (low, high) => {
    let newData = Object.assign({}, filterValues);
    newData.price = { min: low, max: high };
    onChangeFilter && onChangeFilter(newData);
  };

  return (
    <>
      <SafeAreaView style={{ flex: 0, backgroundColor: "white" }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: "gray" }}>
        <View style={styles.headerContainer}>
          <Button onPress={onBackPress} style={{ padding: 16 }}>
            <Icon name="md-arrow-back" size={24} />
          </Button>
          <Text style={{ fontWeight: "700", fontSize: 16 }}>Filter</Text>
        </View>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={{ flex: 2, backgroundColor: "#E8EEF6" }}>
            {filterTabs.map((item, i) => (
              <Button
                style={[styles.filterTabs, i == index ? { backgroundColor: "#FFFFFF" } : null]}
                key={"filter_" + item + index}
                onPress={() => setIndex(i)}>
                <Text>{item}</Text>
              </Button>
            ))}
          </View>
          <View style={{ flex: 3, backgroundColor: "#FFFFFF" }}>
            {index == 0 && !isEmpty(filters.price) && (
              <View style={{ width: "100%", alignItems: "center", padding: 8 }}>
                <RangeSlider
                  style={{
                    //flex: 1,
                    width: "100%",
                    height: 80
                  }}
                  isMarkersSeparated={true}
                  gravity={"center"}
                  min={filters.price.min}
                  max={filters.price.max}
                  initialLowValue={
                    filterValues.price.min ? filterValues.price.min : filters.price.min
                  }
                  initialHighValue={
                    filterValues.price.max ? filterValues.price.max : filters.price.max
                  }
                  selectionColor="#F68E1F"
                  blankColor="#757575"
                  labelBackgroundColor="#E8EEF6"
                  labelBorderColor="#E8EEF6"
                  labelTextColor="#000"
                  onValueChanged={priceUpdate}
                />
                <View
                  style={{
                    width: "100%",
                    justifyContent: "space-between",
                    flexDirection: "row"
                  }}>
                  <Text style={{ fontWeight: "700" }}>{filters.price.min}</Text>
                  <Text style={{ fontWeight: "700" }}>{filters.price.max}</Text>
                </View>
              </View>
            )}
            {index == 1 && (
              <ScrollView>
                {filters.rating.map((item, index) => (
                  <CheckBox
                    label={item + " Star"}
                    key={"rating_" + item + index}
                    checked={filterValues.rating.includes(item)}
                    onPress={updateFilter("rating", index)}
                  />
                ))}
              </ScrollView>
            )}
            {index == 2 && (
              <ScrollView>
                {filters.amenities.map((item, index) => (
                  <CheckBox
                    label={item}
                    key={"amenities_" + item + index}
                    checked={filterValues.amenities.includes(item)}
                    onPress={updateFilter("amenities", index)}
                  />
                ))}
              </ScrollView>
            )}
          </View>
        </View>
        <View style={styles.footer}>
          {/* <Button style={styles.resetButton} onPress={this.reset}>
                <Text style={{ fontWeight: "700" }}>Reset</Text>
              </Button> */}
          <Button style={styles.applyButton} onPress={filter}>
            <Text style={{ color: "#FFFFFF", fontWeight: "700" }}>Apply</Text>
          </Button>
        </View>
      </SafeAreaView>
    </>
  );
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
