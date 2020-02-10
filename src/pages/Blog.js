import { Text, Icon, Button } from "../../src/components";
import React, { useEffect, useState } from "react";
import { View, SafeAreaView, Image, Dimensions, FlatList } from "react-native";
import axios from "axios";
import LinearGradient from "react-native-linear-gradient";
import HTML from "react-native-render-html";
import moment from "moment";
import { ScrollView } from "react-native-gesture-handler";

function Blog({ navigation }) {
  console.log(navigation.getParam("item"));
  var item = navigation.getParam("item");
  return (
    <>
      <SafeAreaView style={{ flex: 0, backgroundColor: "#000000" }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              height: 56,
              backgroundColor: "#E5EBF7"
            }}>
            <Button onPress={() => navigation.goBack(null)} style={{ padding: 16 }}>
              <Icon name="md-arrow-back" size={24} />
            </Button>
            <Text>{item.title.rendered}</Text>
          </View>
          <ScrollView contentContainerStyle={{ marginHorizontal: 20 }}>
            <HTML baseFontStyle={{ color: "#000000" }} html={item.content.rendered} />
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
}

export default Blog;
