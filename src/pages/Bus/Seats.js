import React, {PureComponent} from "react";
import {View, StyleSheet} from "react-native";
import Toast from "react-native-simple-toast";
import {Button, Text, ActivityIndicator, Header} from "../../components";
import Service from "../../service";
import moment from "moment";

class Seats extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      seats: {upper: [], lower: []},
      data: [],
      selectedTab: "lower"
    };
  }

  componentDidMount() {
    console.log(this.props.navigation.state.params);
    const {
      tripType,
      item: {Id, SourceId, DestinationId, Journeydate, Provider, Travels}
    } = this.props.navigation.state.params;
    const data = {
      tripId: Id,
      sourceId: SourceId,
      destinationId: DestinationId,
      journeyDate: moment(Journeydate, "YYYY-MM-DD").format("DD-MM-YYYY"),
      provider: Provider,
      travelOperator: Travels,
      tripType,
      userType: 5,
      user: ""
      //returnDate: null
    };
    console.log(data);

    this.setState({loading: true});
    Service.get("/Buses/TripDetails", data)
      .then(({data}) => {
        if (Array.isArray(data.Seats) && data.Seats) {
          //data = data.Seats.ma;
          //   [upper, lower] = Object.values(
          //     data.Seats.reduce((c, v) => {
          //       let k = Object.values(v).join("_"); //Using the values as key.
          //       c[k] = c[k] || [];
          //       c[k].push(v);
          //       return c;
          //     }, {})
          //   );

          let seats = {upper: [], lower: []};
          for (let i of data.Seats) {
            switch (i.Zindex) {
              case 0:
                seats.lower.push(i);
                break;
              case 0:
                seats.upper.push(i);
                break;
            }
          }

          const lowerRows = seats.lower.reduce((prev, current) => {
            return prev.Row > current.Row ? prev : current;
          });

          const lowerColumns = seats.lower.reduce((prev, current) => {
            return prev.Column > current.Column ? prev : current;
          });

          const upperRows =
            seats.upper.length > 0
              ? seats.upper.reduce((prev, current) => {
                  return prev.Row > current.Row ? prev : current;
                })
              : null;

          const upperColumns =
            seats.upper.length > 0
              ? seats.upper.reduce((prev, current) => {
                  return prev.Column > current.Column ? prev : current;
                })
              : null;

          this.setState({
            loading: false,
            seats,
            data: data.Seats,
            selectedTab: seats.lower.length == 0 && seats.upper.length > 0 ? "upper" : "lower",
            lowerRows: lowerRows.Row,
            upperRows: upperRows ? upperRows.Row : 0,
            lowerColumns: lowerColumns.Column,
            upperColumns: upperColumns ? upperColumns.Column : 0
          });
          console.log(this.state);
        } else {
          Toast.show("Seats not available");
          this.setState({loading: false});
        }
      })
      .catch(error => {
        console.log(error);
        this.setState({loading: false});
      });
  }

  getColumn = () => {
    return <Text>Row</Text>;
  };

  render() {
    const {seats, loading, selectedTab} = this.state;
    return (
      <View style={{flex: 1}}>
        <Header firstName="Seats" />
        {seats.lower.length > 0 && seats.upper.length > 0 && (
          <View style={styles.tabContainer}>
            <Button
              style={[selectedTab == "lower" ? {backgroundColor: "#5B89F9"} : null, styles.tab]}>
              <Text style={[selectedTab == "lower" ? {color: "#FFF"} : null]}>Lower Birth</Text>
            </Button>
            <Button
              style={[selectedTab == "upper" ? {backgroundColor: "#5B89F9"} : null, styles.tab]}>
              <Text style={[selectedTab == "upper" ? {color: "#FFF"} : null]}>Upper Birth</Text>
            </Button>
          </View>
        )}
        {/*selectedTab == "lower" && [...Array(10)].map((e, i) => {
    return <li key={i}>{i}</li>
  })*/}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    padding: 16
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4
  }
});

export default Seats;
