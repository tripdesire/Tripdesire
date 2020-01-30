import React from "react";
import { View, StyleSheet, SafeAreaView, Image, Dimensions, StatusBar } from "react-native";
import { Text, Button, Icon } from "../../components";
import SwiperFlatList from "react-native-swiper-flatlist";
import ImageZoom from "react-native-image-pan-zoom";

const { width, height } = Dimensions.get("window");

function ImageFull({ onBackPress, params }) {
  console.log(params);
  return (
    <>
      <StatusBar backgroundColor="black" barStyle="light-content" />
      <SafeAreaView style={{ flex: 0, backgroundColor: "#E5EBF7" }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
        <View style={styles.headerContainer}>
          <Button onPress={onBackPress} style={{ padding: 16, zIndex: 1 }}>
            <Icon name="md-arrow-back" size={24} />
          </Button>
          <Text style={{ fontWeight: "700", fontSize: 16 }}>Hotel Images</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: "#000" }}>
          <SwiperFlatList
            //  autoplay
            // autoplayDelay={2}
            //  autoplayLoop

            index={0}
            paginationStyleItem={{
              height: 10,
              width: 10,
              marginLeft: 4,
              marginRight: 4
            }}
            paginationStyle={{ bottom: 68 }}
            paginationActiveColor="#4D4C4C"
            paginationDefaultColor="#CCCCCC">
            {params.HotelImages.map(item => {
              let str = item.Imagepath.replace(
                "https://cdn.grnconnect.com/",
                "https://images.grnconnect.com/"
              );
              console.log(str);
              return (
                <ImageZoom
                  key={item.Imagepath}
                  cropWidth={Dimensions.get("window").width}
                  cropHeight={Dimensions.get("window").height}
                  imageWidth={width}
                  imageHeight={height}>
                  <Image
                    style={{
                      width,
                      height,
                      resizeMode: "contain"
                    }}
                    source={{
                      uri: item.Imagepath != "" ? str : "https://via.placeholder.com/150"
                    }}
                  />
                </ImageZoom>
              );
            })}
          </SwiperFlatList>
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
    backgroundColor: "#E5EBF7"
  }
});

export default ImageFull;
