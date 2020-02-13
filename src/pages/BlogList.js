import { Text, Icon, Button, ActivityIndicator } from "../../src/components";
import React, { useEffect, useState } from "react";
import { View, SafeAreaView, Dimensions, FlatList } from "react-native";
import axios from "axios";
import LinearGradient from "react-native-linear-gradient";
import HTML from "react-native-render-html";
import moment from "moment";
import FastImage from "react-native-fast-image";

const { height, width } = Dimensions.get("window");

const aspectHeight = (width, height, newWidth) => (height / width) * newWidth;
function BlogList({ navigation }) {
  const [posts, setposts] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    setLoader(true);
    axios
      .get("https://tripdesire.co/wp-json/wp/v2/posts")
      .then(({ data }) => {
        console.log(data);
        setposts(data);
        setLoader(false);
      })
      .catch(error => {
        setLoader(false);
        console.log(error);
      });
  }, []);

  const customRenderer = {
    a: (htmlAttribs, children, convertedCSSStyles, passProps) => (
      <Text style={{ color: "#97A3AE" }} key={passProps.key}>
        {" ... "}
        {/* <Text
          style={{ color: "#F79120", paddingBottom: 16, fontSize: 16 }}
          onPress={this.navigateToScreen("BlogDetailScreen", this.props.item)}>
          Read more
        </Text> */}
      </Text>
    )
  };

  const renderItem = ({ item }) => {
    return (
      <View style={{ marginTop: 15 }} key={item}>
        <FastImage
          style={{
            marginHorizontal: 16,
            width: width - 32,
            height: aspectHeight(1260, 650, width - 64),
            resizeMode: "cover"
          }}
          source={{ uri: item.featured_image_url }}
        />
        <View
          style={{
            marginTop: -40,
            marginHorizontal: 48,
            padding: 10,
            elevation: 2,
            backgroundColor: "#ffffff",
            shadowOffset: { width: 2, height: 2 },
            shadowColor: "#d8eaff",
            shadowOpacity: 4,
            shadowRadius: 4
          }}>
          <Text>{moment(item.date).format("MMMM DD[,] YYYY")}</Text>
          <Text style={{ fontSize: 16, fontWeight: "500", marginTop: 10 }}>
            {item.title.rendered}
          </Text>

          <HTML
            baseFontStyle={{ color: "#000000" }}
            html={item.excerpt.rendered}
            renderers={customRenderer}
          />

          <LinearGradient
            style={{
              backgroundColor: "blue",
              width: 90,
              alignItems: "center",
              borderRadius: 15
            }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={["#53b2fe", "#065af3"]}>
            <Button
              style={{}}
              onPress={() => {
                navigation.navigate("Blog", { item });
              }}>
              <Text style={{ color: "#fff", fontSize: 12, fontWeight: "500", paddingVertical: 4 }}>
                Read More
              </Text>
            </Button>
          </LinearGradient>
        </View>
      </View>
    );
  };

  const keyExtractor = (item, index) => {
    return item.id + "Sap";
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
              height: 56,
              backgroundColor: "#E5EBF7"
            }}>
            <Button onPress={() => navigation.goBack(null)} style={{ padding: 16 }}>
              <Icon name="md-arrow-back" size={24} />
            </Button>
            <Text style={{ fontSize: 16, fontWeight: "500", padding: 16 }}>Blogs</Text>
          </View>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={posts}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            contentContainerStyle={{ backgroundColor: "#FFF" }}
            onEndReachedThreshold={0.5}
          />
          {loader && <ActivityIndicator />}
        </View>
      </SafeAreaView>
    </>
  );
}

export default BlogList;
