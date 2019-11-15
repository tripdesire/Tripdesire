import React, { PureComponent } from "react";
import { Text } from "../components";
import { Image, ImageBackground, Dimensions } from "react-native";
import { connect } from "react-redux";
import { DomSugg, IntSugg, DomHotelSugg, BusSugg } from "../store/action";
import Service from "../service";
import axios from "axios";
const { height, width } = Dimensions.get("window");
class Splash extends React.PureComponent {
  constructor(props) {
    super(props);
    // setTimeout(() => {
    //   this.props.navigation.navigate("Bus");
    // }, 2000);
  }

  // getDomesticSeggestion() {
  //   return Service.get("/Flights/Airports?flightType=1");
  // }

  // getInternationalSeggestion() {
  //   return Service.get("/Flights/Airports?flightType=2");
  // }
  getHotelSugesstion() {
    return Service.get("/Hotels/Cities?hoteltype=1");
  }
  // getBusSuggestion() {
  //   return Service.get("/Buses/Sources");
  // }

  componentDidMount() {
    const {
      domesticSuggestion,
      internationalSuggestion,
      domesticHotelSuggestion,
      busSuggestion
    } = this.props;
    if (
      domesticSuggestion.length == 0 ||
      internationalSuggestion.length == 0 ||
      domesticHotelSuggestion.length == 0 //||
      // busSuggestion.length == 0
    ) {
      axios
        .all([
          //  this.getDomesticSeggestion(),
          //  this.getInternationalSeggestion(),
          this.getHotelSugesstion()
          //  this.getBusSuggestion()
        ])
        .then(
          axios.spread(hotel => {
            //   this.props.DomSugg(domestic.data);
            //  this.props.IntSugg(international.data);
            this.props.DomHotelSugg(hotel.data);
            //    this.props.BusSugg(bus.data);
            this.props.navigation.navigate("DrawerNavigator"); //DrawerNavigator
          })
        );
    } else {
      this.props.navigation.navigate("DrawerNavigator");
      axios
        .all([
          // this.getDomesticSeggestion(),
          // this.getInternationalSeggestion(),
          this.getHotelSugesstion()
          // this.getBusSuggestion()
        ])
        .then(
          axios.spread(hotel => {
            // this.props.DomSugg(domestic.data);
            //  this.props.IntSugg(international.data);
            this.props.DomHotelSugg(hotel.data);
            // this.props.BusSugg(bus.data);
            // Both requests are now complete
          })
        );
    }
  }

  render() {
    return (
      <ImageBackground
        style={{
          height: height,
          width: width,
          alignItems: "center",
          justifyContent: "center"
        }}
        source={require("../assets/imgs/Bg.png")}>
        <Image
          resizeMode="contain"
          style={{
            width: width - 100,
            height: height / 5,
            alignItems: "center",
            marginTop: 100,
            justifyContent: "center"
          }}
          source={require("../assets/imgs/LOGOSplash.png")}
        />
      </ImageBackground>
    );
  }
}

const mapDispatchToProps = {
  DomSugg,
  IntSugg,
  DomHotelSugg,
  BusSugg
};
const mapStateToProps = state => ({
  domesticSuggestion: state.domesticSuggestion,
  internationalSuggestion: state.internationalSuggestion,
  domesticHotelSuggestion: state.domesticHotelSuggestionReducer,
  busSuggestion: state.busSuggestion
});

export default connect(mapStateToProps, mapDispatchToProps)(Splash);
