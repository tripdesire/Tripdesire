import React from "react";
import { View, StatusBar, ScrollView, SafeAreaView } from "react-native";
import { Text, Button, ActivityIndicator, Icon } from "../../components";
import HTML from "react-native-render-html";
import analytics from "@react-native-firebase/analytics";
import { IGNORED_TAGS, alterNode, makeTableRenderer } from "react-native-render-html-table-bridge";
import WebView from "react-native-webview";

class FareDetails extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loader: false
    };
  }

  trackScreenView = async screen => {
    await analytics().setCurrentScreen(screen, screen);
  };

  componentDidMount() {
    this.trackScreenView("Flight Fare Rules");
  }

  render() {
    const { loader } = this.state;
    const htmlConfig = {
      alterNode,
      renderers: {
        table: makeTableRenderer({
          WebViewComponent: WebView
          // tableStyleSpecs: { trOddBackground: "#FFF", trEvenBackground: "#FFF" }
        })
      },
      ignoredTags: IGNORED_TAGS
    };

    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "#000000" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <StatusBar backgroundColor="black" barStyle="light-content" />

          <View
            style={{
              flexDirection: "row",
              height: 56,
              backgroundColor: "#E5EBF7",
              alignItems: "center"
            }}>
            <Button style={{ padding: 16 }} onPress={this.props.onBackPress}>
              <Icon name="md-arrow-back" size={24} />
            </Button>
            <Text style={{ fontSize: 18, color: "#1E293B", marginStart: 10, fontWeight: "700" }}>
              Fare Rules
            </Text>
          </View>
          <ScrollView
            contentContainerStyle={{ marginHorizontal: 16, marginVertical: 10 }}
            style={{ flex: 1 }}>
            <HTML
              baseFontStyle={{ fontFamily: "Poppins-Regular" }}
              html={this.props.data || "<div></div>"}
              {...htmlConfig}
            />
          </ScrollView>

          {loader && <ActivityIndicator />}
        </SafeAreaView>
      </>
    );
  }
}

export default FareDetails;
