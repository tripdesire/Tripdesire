import { Text, Icon, Button } from "../../src/components";
import React, { useEffect, useState } from "react";
import { View, SafeAreaView, Image, Dimensions, FlatList, Animated } from "react-native";
import axios from "axios";
import LinearGradient from "react-native-linear-gradient";
import HTML from "react-native-render-html";
import moment from "moment";
import { ScrollView } from "react-native-gesture-handler";
import FastImage from "react-native-fast-image";

const { height, width } = Dimensions.get("window");
const aspectHeight = (width, height, newWidth) => (height / width) * newWidth;

function Blog({ navigation }) {
  console.log(navigation.getParam("item"));
  var item = navigation.getParam("item");

  const customRenderer = {
    img: (htmlAttribs, children, convertedCSSStyles, passProps) => {
      return (
        <FastImage
          key={passProps.key}
          style={{ width: width - 32, height: aspectHeight(1260, 650, width - 64) }}
          source={{ uri: htmlAttribs.src }}
        />
      );
    }
  };

  return (
    <>
      <SafeAreaView style={{ flex: 0, backgroundColor: "#000000" }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              // height: 72,
              backgroundColor: "#E5EBF7",
              paddingVertical: 4
            }}>
            <Button onPress={() => navigation.goBack(null)} style={{ padding: 16 }}>
              <Icon name="md-arrow-back" size={24} />
            </Button>
            <Text style={{ flex: 1 }}>{item.title.rendered}</Text>
          </View>
          <ScrollView contentContainerStyle={{ marginHorizontal: 16 }}>
            <HTML
              baseFontStyle={{ color: "#000000" }}
              html={item.content.rendered || "<div/>"}
              renderers={customRenderer}
            />
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
}

export default Blog;
