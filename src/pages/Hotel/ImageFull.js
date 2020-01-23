import React from "react";
import { View, StyleSheet, SafeAreaView, Image, Dimensions } from "react-native";
import { Text, Button, Icon } from "../../components";
import SwiperFlatList from "react-native-swiper-flatlist";

const { width, height } = Dimensions.get("window");

function ImageFull({ onBackPress, params }) {
  console.log(params);
  return (
    <>
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
              return (
                <Image
                  key={item.Imagepath}
                  style={{
                    width: width,
                    resizeMode: "contain"
                  }}
                  source={{
                    uri: str
                  }}
                />
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
