import React, { PureComponent } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Picker,
  ScrollView,
  SafeAreaView
} from "react-native";
import Toast from "react-native-simple-toast";
import DateTimePicker from "react-native-modal-datetime-picker";
import { Button, Text, ActivityIndicator, Icon } from "../../components";
import moment from "moment";
import RazorpayCheckout from "react-native-razorpay";
import RNPickerSelect from "react-native-picker-select";
import { isEmpty } from "lodash";
import { etravosApi, domainApi } from "../../service";
import { connect } from "react-redux";
class CheckOut1 extends React.PureComponent {
  constructor(props) {
    super(props);
    const { params } = props.navigation.state.params;
    console.log(props.navigation.state.params);
    this.state = {
      loading: false,
      date: new Date(),
      gender: "Mr",
      DOB: new Date(),
      mode: "date",
      ffn: false,
      firstname: "",
      lastname: "",
      age: "",
      adultName: "",
      adultDob: "",
      adultAge: "",
      adultGender: "",
      childName: "",
      childDob: "",
      childAge: "",
      childGender: "",
      upDateOrder: "",
      adults: [...Array(parseInt(params.adult))].map(item => {
        return {
          den: "Mr",
          firstname: "",
          last_name: "",
          dob: moment()
            .subtract(18, "years")
            .toDate(), //
          age: moment().diff(
            moment()
              .subtract(18, "years")
              .toDate(),
            "years"
          ),
          gender: "M",
          show: false
        };
      }),
      childs: [...Array(parseInt(params.child))].map(item => {
        return {
          den: parseInt(params.child) > 0 ? "Mr" : "",
          firstname: "",
          last_name: "",
          dob: moment()
            .subtract(2, "years")
            .toDate(),
          age: moment().diff(
            moment()
              .subtract(2, "years")
              .toDate(),
            "years"
          ),
          gender: parseInt(params.child) > 0 ? "M" : "",
          show: false
        };
      }),
      infants: [...Array(parseInt(params.infant))].map(item => {
        return {
          den: parseInt(params.infant) > 0 ? "Mr" : "",
          firstname: "",
          last_name: "",
          dob: new Date(),
          age: moment().diff(
            moment()
              .subtract(0, "years")
              .toDate(),
            "years"
          ),
          gender: parseInt(params.infant) > 0 ? "M" : "",
          show: false
        };
      }),
      radioDirect: true,
      orderId: "",
      transactionId: "",
      status: "",
      taxDetails: ""
    };
    console.log(props.navigation.state.params);
  }

  show = (key, index, isShow) => () => {
    let newData = Object.assign([], this.state[key]);
    newData[index].show = isShow;
    this.setState({
      [key]: newData
    });
  };

  _FFN = () => {
    this.setState({ ffn: this.state.ffn == true ? false : true });
  };

  onAdultChange = (index, key) => text => {
    let newData = Object.assign([], this.state.adults);
    newData[index][key] = text;
    if ((key = "dob")) {
      newData[index].age = moment().diff(moment(text), "years");
    }
    if (key == "gender") {
      newData[index].den = text == "M" ? "Mr" : "Mrs";
    }
    newData[index].show = false;
    this.setState({
      adults: newData
    });
  };

  onChildsChange = (index, key) => text => {
    let newData = Object.assign([], this.state.childs);
    newData[index][key] = text;
    if ((key = "dob")) {
      newData[index].age = moment().diff(moment(text), "years");
    }
    if (key == "gender") {
      newData[index].den = text == "M" ? "Mr" : "Mrs";
    }
    newData[index].show = false;
    this.setState({
      childs: newData
    });
  };

  onInfantChange = (index, key) => text => {
    let newData = Object.assign([], this.state.infants);
    newData[index][key] = text;
    if ((key = "dob")) {
      newData[index].age = moment().diff(moment(text), "years");
    }
    if (key == "gender") {
      newData[index].den = text == "M" ? "Mr" : "Mrs";
    }
    newData[index].show = false;
    this.setState({
      infants: newData
    });
  };

  validate = () => {
    let needToValidateAdults = false;
    let needToValidateChilds = false;
    let needToValidateInfants = false;
    needToValidateAdults = this.state.adults.every(
      item => item.firstname == "" || item.last_name == "" || item.age == ""
    );
    needToValidateChilds =
      this.state.childs != 0 &&
      this.state.childs.every(
        item => item.firstname == "" || item.last_name == "" || item.age == ""
      );
    needToValidateInfants =
      this.state.infants != 0 &&
      this.state.infants.every(
        item => item.firstname == "" || item.last_name == "" || item.age == ""
      );

    return needToValidateAdults || needToValidateChilds || needToValidateInfants;
  };

  _order = async () => {
    const { params } = this.props.navigation.state.params;
    console.log(this.state);

    let journey_date = moment(params.journey_date, "DD MMM").format("DD-MM-YYYY");

    let adult_details = this.state.adults.map(item => ({
      "ad-den": item.den,
      "ad-fname": item.firstname,
      "ad-lname": item.last_name,
      "ad-dob": item.dob,
      "ad-gender": item.gender,
      "ad-age": item.age
    }));

    let child_details = this.state.childs.map(item => ({
      "ch-den": item.den,
      "ch-fname": item.firstname,
      "ch-lname": item.last_name,
      "ch-dob": item.dob,
      "ch-gender": item.gender,
      "ch-age": item.age
    }));

    let infant_details = this.state.infants.map(item => ({
      "if-den": item.den,
      "if-fname": item.firstname,
      "if-lname": item.last_name,
      "if-dob": item.dob,
      "if-gender": item.gender,
      "if-age": item.age
    }));

    console.log(adult_details, child_details, infant_details);

    let param = {
      user_id: "7",
      payment_method: "razopay",
      adult_details: adult_details,
      child_details: child_details,
      infant_details: infant_details
    };

    let name = [
      ...this.state.adults.map(
        item => item.den + "|" + item.firstname + "|" + item.last_name + "|adt"
      ),
      ...this.state.childs.map(
        item => item.den + "|" + item.firstname + "|" + item.last_name + "|chd"
      ),
      ...this.state.infants.map(
        item => item.den + "|" + item.firstname + "|" + item.last_name + "|inf"
      )
    ].join("~");

    let dob = [
      ...this.state.adults.map(item => moment(item.dob).format("DD-MM-YYYY")),
      ...this.state.childs.map(item => moment(item.dob).format("DD-MM-YYYY")),
      ...this.state.infants.map(item => moment(item.dob).format("DD-MM-YYYY"))
    ].join("~");

    let gender = [
      ...this.state.adults.map(item => item.gender),
      ...this.state.childs.map(item => item.gender),
      ...this.state.infants.map(item => item.gender)
    ].join("~");

    let age = [
      ...this.state.adults.map(item => item.age),
      ...this.state.childs.map(item => item.age),
      ...this.state.infants.map(item => item.age)
    ].join("~");

    try {
      let taxDetail = {
        ActualBaseFare: params.departFlight.FareDetails.ChargeableFares.ActualBaseFare,
        ActualBaseFareRet: 0,
        AdultPax: params.adult,
        BookedFrom: null,
        BookingDate: this.state.date,
        ChildPax: params.child,
        Conveniencefee: params.departFlight.FareDetails.ChargeableFares.Conveniencefee,
        ConveniencefeeRet: 0,
        Destination: params.destinationCode,
        DestinationName: params.destinationAirportName,
        FareDetails: params.departFlight.FareDetails,
        FlightId: params.departFlight.FlightUId,
        FlightIdRet: null,
        FlightType: params.flightType,
        GSTDetails: params.departFlight.IsGSTMandatory
          ? {
              GSTCompanyAddress: "Hyderabad",
              GSTCompanyContactNumber: "9234234234",
              GSTCompanyName: "i2space",
              GSTNumber: "534234234233",
              GSTCompanyEmail: "guru.m@i2space.com",
              GSTFirstName: "guru",
              GSTLastName: "bharat"
            }
          : {},
        InfantPax: params.infant,
        IsLCC: true,
        IsLCCRet: null,
        IsNonStopFlight: false,
        JourneyDate: params.journeyDate,
        Key: params.departFlight.OriginDestinationoptionId.Key,
        keyRet: null,
        OcTax: 0,
        OnwardFlightSegments:
          params.flightType == 1
            ? params.departFlight.FlightSegments
            : params.departFlight.IntOnward.FlightSegments,
        provider: params.departFlight.Provider,
        ReturnDate: params.tripType == 2 ? params.returnDate : params.journeyDate,
        ReturnFlightSegments: null,
        Rule: " ",
        RuleRet: null,
        SCharge: params.departFlight.FareDetails.ChargeableFares.SCharge,
        SChargeRet: 0,
        Source: params.sourceCode,
        SourceName: params.sourceAirportName,
        Tax: params.departFlight.FareDetails.ChargeableFares.Tax,
        TaxRet: 0,
        TCharge: 0,
        TChargeRet: 0,
        TDiscount: params.departFlight.FareDetails.ChargeableFares.TDiscount,
        TDiscountRet: 0,
        TMarkup: 0,
        TMarkupRet: 0,
        TPartnerCommission: 0,
        TPartnerCommissionRet: 0,
        TravelClass: params.travelClass,
        TripType: params.tripType,
        TSdiscount: 0,
        TSdiscountRet: 0,
        User: "",
        UserType: 5
      };

      const { data: TaxDetails } = await etravosApi.post("/Flights/GetTaxDetails", taxDetail);
      console.log("Onward", TaxDetails);

      let taxDetailReturn = {
        ActualBaseFare: params.departFlight.FareDetails.ChargeableFares.ActualBaseFare,
        ActualBaseFareRet:
          params.tripType == 2 && params.flightType == 1
            ? params.arrivalFlight.FareDetails.ChargeableFares.ActualBaseFare
            : params.tripType == 2 && params.flightType == 2
            ? params.departFlight.FareDetails.ChargeableFares.ActualBaseFare
            : 0,
        AdultPax: params.adult,
        BookedFrom: null,
        BookingDate: this.state.date,
        ChildPax: params.child,
        Conveniencefee: params.departFlight.FareDetails.ChargeableFares.Conveniencefee,
        ConveniencefeeRet:
          params.tripType == 2 && params.flightType == 1
            ? params.arrivalFlight.FareDetails.ChargeableFares.Conveniencefee
            : params.tripType == 2 && params.flightType == 2
            ? params.departFlight.FareDetails.ChargeableFares.Conveniencefee
            : 0,
        Destination: params.destinationCode,
        DestinationName: params.destinationAirportName,
        FareDetails: params.departFlight.FareDetails,
        FlightId: params.departFlight.FlightUId,
        FlightIdRet:
          params.tripType == 2 && params.flightType == 1
            ? params.arrivalFlight.FlightUId
            : params.tripType == 2 && params.flightType == 2
            ? params.departFlight.FlightUId
            : null,
        FlightType: params.flightType,
        GSTDetails: params.departFlight.IsGSTMandatory
          ? {
              GSTCompanyAddress: "Hyderabad",
              GSTCompanyContactNumber: "9234234234",
              GSTCompanyName: "i2space",
              GSTNumber: "534234234233",
              GSTCompanyEmail: "guru.m@i2space.com",
              GSTFirstName: "guru",
              GSTLastName: "bharat"
            }
          : {},
        InfantPax: params.infant,
        IsLCC: true,
        IsLCCRet: null,
        IsNonStopFlight: false,
        JourneyDate: params.journeyDate,
        Key: params.departFlight.OriginDestinationoptionId.Key,
        keyRet:
          params.tripType == 2 && params.flightType == 1
            ? params.arrivalFlight.OriginDestinationoptionId.Key
            : params.tripType == 2 && params.flightType == 2
            ? params.departFlight.OriginDestinationoptionId.Key
            : null,
        OcTax: 0,
        OnwardFlightSegments:
          params.flightType == 1
            ? params.departFlight.FlightSegments
            : params.departFlight.IntOnward.FlightSegments,
        provider: params.departFlight.Provider,
        ReturnDate: params.tripType == 2 ? params.returnDate : params.journeyDate,
        ReturnFlightSegments:
          params.tripType == 2 && params.flightType == 1
            ? params.arrivalFlight.FlightSegments
            : params.tripType == 2 && params.flightType == 2
            ? params.departFlight.IntReturn.FlightSegments
            : [],
        Rule: " ",
        RuleRet: null,
        SCharge: params.departFlight.FareDetails.ChargeableFares.SCharge,
        SChargeRet:
          params.tripType == 2 && params.flightType == 1
            ? params.arrivalFlight.FareDetails.ChargeableFares.SCharge
            : params.tripType == 2 && params.flightType == 2
            ? params.departFlight.FareDetails.ChargeableFares.SCharge
            : 0,
        Source: params.sourceCode,
        SourceName: params.sourceAirportName,
        Tax: params.departFlight.FareDetails.ChargeableFares.Tax,
        TaxRet:
          params.tripType == 2 && params.flightType == 1
            ? params.arrivalFlight.FareDetails.ChargeableFares.Tax
            : params.tripType == 2 && params.flightType == 2
            ? params.departFlight.FareDetails.ChargeableFares.Tax
            : 0,
        TCharge: 0,
        TChargeRet: 0,
        TDiscount: params.departFlight.FareDetails.ChargeableFares.TDiscount,
        TDiscountRet:
          params.tripType == 2 && params.flightType == 1
            ? params.arrivalFlight.FareDetails.ChargeableFares.TDiscount
            : params.tripType == 2 && params.flightType == 2
            ? params.departFlight.FareDetails.ChargeableFares.TDiscount
            : 0,
        TMarkup: 0,
        TMarkupRet: 0,
        TPartnerCommission: 0,
        TPartnerCommissionRet: 0,
        TravelClass: params.travelClass,
        TripType: params.tripType,
        TSdiscount: 0,
        TSdiscountRet: 0,
        User: "",
        UserType: 5
      };

      //console.log(taxDetailReturn);

      const { data: TaxDetailsReturn } = await etravosApi.post(
        "/Flights/GetTaxDetails",
        taxDetailReturn
      );
      console.log("Return datails", TaxDetailsReturn);

      let book = {
        ActualBaseFare: TaxDetails.ChargeableFares.ActualBaseFare,
        ActualBaseFareRet: TaxDetailsReturn.ChargeableFares.ActualBaseFare,
        Address: "Hyderabad",
        AdultPax: params.adult,
        Ages: age,
        BookedFrom: null,
        BookingDate: this.state.date,
        ChildPax: params.child,
        City: "Hyderabad",
        Conveniencefee: TaxDetails.ChargeableFares.Conveniencefee,
        ConveniencefeeRet: TaxDetailsReturn.ChargeableFares.Conveniencefee,
        Destination: params.destinationCode,
        DestinationName: params.destinationAirportName,
        dob: dob,
        EmailId: "guruu@email.com",
        FareDetails: "",
        FlightId: params.departFlight.FlightUId,
        FlightIdRet:
          params.tripType == 2 && params.flightType == 1
            ? params.arrivalFlight.FlightUId
            : params.tripType == 2 && params.flightType == 2
            ? params.departFlight.FlightUId
            : null,
        FlightType: params.flightType,
        Genders: gender,
        GSTDetails: params.departFlight.IsGSTMandatory
          ? {
              GSTCompanyAddress: "Hyderabad",
              GSTCompanyContactNumber: "9234234234",
              GSTCompanyName: "i2space",
              GSTNumber: "534234234233",
              GSTCompanyEmail: "guru.m@i2space.com",
              GSTFirstName: "guru",
              GSTLastName: "bharat"
            }
          : {},
        InfantPax: params.infant,
        IsLCC: true,
        IsLCCRet: params.tripType == 2 ? true : null,
        IsNonStopFlight: false,
        JourneyDate: params.journeyDate,
        key: params.departFlight.OriginDestinationoptionId.Key,
        keyRet:
          params.tripType == 2 && params.flightType == 1
            ? params.arrivalFlight.OriginDestinationoptionId.Key
            : params.tripType == 2 && params.flightType == 2
            ? params.departFlight.OriginDestinationoptionId.Key
            : null,
        MobileNo: "9999995999",
        Names: name,
        OcTax: 0,
        OnwardFlightSegments:
          params.flightType == 1
            ? params.departFlight.FlightSegments
            : params.departFlight.IntOnward.FlightSegments,
        PassportDetails: "",
        PostalCode: "500071",
        Provider: params.departFlight.Provider,
        Psgrtype: "",
        ReturnDate: params.tripType == 2 ? params.returnDate : params.journeyDate,
        ReturnFlightSegments:
          params.tripType == 2 && params.flightType == 1
            ? params.arrivalFlight.FlightSegments
            : params.tripType == 2 && params.flightType == 2
            ? params.departFlight.IntReturn.FlightSegments
            : [],
        Rule: " ",
        RuleRet: null,
        SCharge: TaxDetails.ChargeableFares.SCharge,
        SChargeRet: TaxDetailsReturn.ChargeableFares.SCharge,
        SMSUsageCount: 0,
        Source: params.sourceCode,
        SourceName: params.sourceAirportName,
        State: "Telangana",
        STax: TaxDetails.ChargeableFares.STax,
        STaxRet: TaxDetailsReturn.ChargeableFares.STax,
        Tax: TaxDetails.ChargeableFares.Tax,
        TaxRet: TaxDetailsReturn.ChargeableFares.Tax,
        TCharge: TaxDetails.NonchargeableFares.TCharge,
        TChargeRet: TaxDetailsReturn.NonchargeableFares.TCharge,
        TDiscount: TaxDetails.ChargeableFares.TDiscount,
        TDiscountRet: TaxDetailsReturn.ChargeableFares.TDiscount,
        telephone: "8888588888",
        TMarkup: TaxDetails.NonchargeableFares.TCharge,
        TMarkupRet: TaxDetailsReturn.NonchargeableFares.TCharge,
        TPartnerCommission: TaxDetails.ChargeableFares.TPartnerCommission,
        TPartnerCommissionRet: TaxDetailsReturn.ChargeableFares.TPartnerCommission,
        TravelClass: params.travelClass,
        TripType: params.tripType,
        TSdiscount: TaxDetails.NonchargeableFares.TSdiscount,
        TSDiscountRet: TaxDetailsReturn.NonchargeableFares.TSdiscount,
        User: "",
        UserType: 5
      };

      // console.log(JSON.stringify(book));
      // return;

      if (this.validate()) {
        Toast.show("Please enter all the fields.", Toast.SHORT);
      } else {
        if (isEmpty(this.props.user)) {
          //Toast.show("Please login or signup", Toast.SHORT);
          this.props.navigation.navigate("SignIn", { isCheckout: true });
        } else {
          console.log(book, this.state);
          const { params, data } = this.props.navigation.state.params;
          console.log(params, data, param);

          this.setState({ loading: true });
          etravosApi
            .post("/Flights/BlockFlightTicket", book)
            .then(blockres => {
              console.log(blockres.data);
              if (blockres.data.BookingStatus == 8) {
                const { user } = this.props;
                domainApi
                  .post("/checkout/new-order?user_id=" + user.id, param)
                  .then(({ data: order }) => {
                    console.log(order);

                    var options = {
                      description: "Credits towards consultation",
                      image: "https://i.imgur.com/3g7nmJC.png",
                      currency: "INR",
                      key: "rzp_test_a3aQYPLYowGvWJ",
                      amount: parseInt(order.total) * 100,
                      name: "TripDesire",
                      prefill: {
                        email: user.billing.email,
                        contact: user.billing.phone,
                        name: "Razorpay Software"
                      },
                      theme: { color: "#E5EBF7" }
                    };

                    RazorpayCheckout.open(options)
                      .then(razorpayRes => {
                        // handle success
                        console.log(razorpayRes);
                        // alert(`Success: ${data.razorpay_payment_id}`);

                        if (
                          (razorpayRes.razorpay_payment_id &&
                            razorpayRes.razorpay_payment_id != "") ||
                          razorpayRes.code == 0
                        ) {
                          this.setState({ loading: true });
                          etravosApi
                            .get(
                              "/Flights/BookFlightTicket?referenceNo=" + blockres.data.ReferenceNo
                            )
                            .then(({ data: Response }) => {
                              console.log(Response);

                              let paymentData = {
                                order_id: order.id,
                                status: "completed",
                                transaction_id: razorpayRes.razorpay_payment_id,
                                reference_no: Response // blockres.data.ReferenceNo
                              };
                              console.log(paymentData);

                              this.setState({ loading: true });
                              domainApi.post("/checkout/update-order", paymentData).then(resp => {
                                this.setState({ loading: false });
                                console.log(resp);
                              });
                              const { params } = this.props.navigation.state.params;
                              this.props.navigation.navigate("ThankYou", {
                                order,
                                params,
                                razorpayRes
                              });
                            })
                            .catch(error => {
                              console.log(error);
                            });
                        } else {
                          Toast.show("You have been cancelled the ticket", Toast.LONG);
                        }
                      })
                      .catch(error => {
                        this.setState({ loading: false });
                        console.log(error);
                      })
                      .catch(error => {
                        this.setState({ loading: false });
                        console.log(error);
                      });
                  })
                  .catch(error => {
                    Toast.show(error, Toast.LONG);
                    this.setState({ loading: false });
                  });
              } else {
                this.setState({ loading: false });
                Toast.show("Ticket is not block successfully ", Toast.LONG);
              }
            })
            .catch(error => {
              Toast.show(error, Toast.LONG);
              this.setState({ loading: false });
            });
        }
      }
    } catch (e) {
      Toast.show(e.toString());
    }

    console.log(param);
    console.log(this.state);
  };

  _radioButton = value => {
    this.setState({
      radioDirect: value == "D" ? true : false,
      radioCheck: value == "CP" ? true : false,
      radioCOD: value == "C" ? true : false
    });
  };
  render() {
    const { params } = this.props.navigation.state.params;
    const { ffn, radioDirect, radioCheck, radioCOD, DOB, mode, adults } = this.state;

    return (
      <>
        <SafeAreaView style={{ flex: 0, backgroundColor: "#E5EBF7" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <View style={{ flex: 1 }}>
            <View
              style={{
                height: 56,
                backgroundColor: "#E5EBF7",
                flexDirection: "row",
                paddingHorizontal: 16,
                paddingVertical: 10
              }}>
              <Button onPress={() => this.props.navigation.goBack(null)}>
                <Icon name="md-arrow-back" size={24} />
              </Button>
              <View style={{ marginHorizontal: 5 }}>
                <Text style={{ fontWeight: "700", fontSize: 16 }}>Checkout</Text>
                <Text style={{ fontSize: 12, color: "#717984" }}>
                  {params.journey_date} {params.return_date ? " - " + params.return_date : ""}
                  {params.checkInDate
                    ? moment(params.checkInDate, "DD-MM-YYYY").format("DD MMM")
                    : ""}
                  {params.checkOutDate
                    ? " - " + moment(params.checkOutDate, "DD-MM-YYYY").format("DD MMM") + " "
                    : ""}
                  |{params.adult > 0 ? " " + params.adult + " Adult" : " "}
                  {params.child > 0 ? " , " + params.child + " Child" : " "}
                  {params.infant > 0 ? " , " + params.infant + " Infant" : " "}
                  {params.className ? "| " + params.className : ""}
                </Text>
              </View>
            </View>

            <View style={{ flex: 4, backgroundColor: "#FFFFFF" }}>
              <ScrollView
                contentContainerStyle={{ backgroundColor: "#ffffff" }}
                showsVerticalScrollIndicator={false}>
                <View
                  style={{
                    elevation: 2,
                    borderRadius: 8,
                    backgroundColor: "#ffffff",
                    marginHorizontal: 16,
                    marginTop: 20
                  }}>
                  <View style={{ marginHorizontal: 10, marginVertical: 10 }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Image
                        source={require("../../assets/imgs/person.png")}
                        resizeMode="contain"
                        style={{ width: 30 }}
                      />
                      <Text style={{ marginStart: 10, fontWeight: "300", fontSize: 16 }}>
                        Passengers Details
                      </Text>
                    </View>
                    {parseInt(params.adult) &&
                      [...Array(parseInt(params.adult))].map((e, index) => (
                        <View key={"adult_" + index}>
                          <View
                            style={{
                              flexDirection: "row",
                              marginTop: 10,
                              justifyContent: "center",
                              alignItems: "center"
                            }}>
                            <Text>Adult {index + 1}</Text>
                            {/* <View
                              style={{
                                borderWidth: 1,
                                borderColor: "#F2F2F2",
                                height: 40,
                                marginStart: 2,
                                justifyContent: "center",
                                alignItems: "center"
                              }}>
                              <Picker
                                selectedValue={this.state.adults[index].den}
                                style={{ height: 50, width: 60 }}
                                onValueChange={this.onAdultChange(index, "den")}>
                                <Picker.Item label="Mr." value="Mr" />
                                <Picker.Item label="Mrs." value="Mrs" />
                              </Picker>
                            </View> */}
                            <TextInput
                              style={{
                                borderWidth: 1,
                                borderColor: "#F2F2F2",
                                height: 40,
                                flex: 1,
                                paddingStart: 5,
                                marginHorizontal: 2
                              }}
                              onChangeText={this.onAdultChange(index, "firstname")}
                              placeholder="First Name"
                            />
                            <TextInput
                              style={{
                                borderWidth: 1,
                                paddingStart: 5,
                                borderColor: "#F2F2F2",
                                height: 40,
                                flex: 1
                              }}
                              placeholder="Last Name"
                              onChangeText={this.onAdultChange(index, "last_name")}
                            />
                          </View>
                          <View
                            style={{
                              marginTop: 5,
                              flexDirection: "row",
                              justifyContent: "center",
                              alignItems: "center"
                            }}>
                            <View
                              style={{
                                flex: 2,
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center"
                              }}>
                              <Text style={{ color: "#5D666D", marginStart: 5 }}>DOB</Text>
                              <Button
                                style={{
                                  flex: 1,
                                  marginStart: 5,
                                  borderWidth: 1,
                                  borderColor: "#F2F2F2",
                                  height: 40,
                                  justifyContent: "center",
                                  alignItems: "center"
                                }}
                                onPress={this.show("adults", index, true)}
                                placeholder="DOB">
                                <Text>
                                  {this.state.adults[index].dob != ""
                                    ? moment(this.state.adults[index].dob).format("DD-MMM-YYYY")
                                    : "-- Enter Dob --"}
                                </Text>
                              </Button>
                              <DateTimePicker
                                date={this.state.adults[index].dob}
                                isVisible={this.state.adults[index].show}
                                onConfirm={this.onAdultChange(index, "dob")}
                                onCancel={this.show("adults", index, false)}
                                maximumDate={moment()
                                  .subtract(18, "years")
                                  .toDate()}
                              />
                            </View>
                            <View
                              style={{
                                borderWidth: 1,
                                borderColor: "#F2F2F2",
                                height: 40,
                                flex: 1,
                                paddingHorizontal: 2,
                                marginHorizontal: 2,
                                justifyContent: "center",
                                alignItems: "center"
                              }}>
                              {/* <Picker
                                selectedValue={this.state.adults[index].gender}
                                style={{ height: 50, width: 100 }}
                                onValueChange={this.onAdultChange(index, "gender")}>
                                <Picker.Item label="Male" value="M" />
                                <Picker.Item label="Female" value="F" />
                              </Picker> */}
                              <RNPickerSelect
                                useNativeAndroidPickerStyle={false}
                                placeholder={{}}
                                selectedValue={this.state.adults[index].gender}
                                style={{
                                  inputAndroid: {
                                    color: "#000",
                                    padding: 0,
                                    height: 20,
                                    paddingStart: 3
                                  },
                                  inputIOS: { paddingStart: 3, color: "#000" },
                                  iconContainer: { marginEnd: 8 }
                                }}
                                onValueChange={this.onAdultChange(index, "gender")}
                                items={[
                                  { label: "Male", value: "M" },
                                  { label: "Female", value: "F" }
                                ]}
                                Icon={() => <Icon name="ios-arrow-down" size={20} />}
                              />
                            </View>
                          </View>
                          <Button style={{ marginTop: 10 }} onPress={this._FFN}>
                            <Text style={{ color: "#5B89F9" }}>
                              Optional (Frequent flyer Number)
                            </Text>
                          </Button>
                          {ffn && (
                            <View>
                              <Text>Frequent Flyer Details</Text>
                              <Text>
                                Please verify the credit of your frequent flyer miles at the airport
                                checkin counter.
                              </Text>
                              <View style={{ flexDirection: "row" }}>
                                <TextInput
                                  style={{
                                    borderWidth: 1,
                                    borderColor: "#F2F2F2",
                                    backgroundColor: "#F2F2F2",
                                    height: 40,
                                    paddingHorizontal: 10,
                                    marginEnd: 1,
                                    flex: 1
                                  }}
                                  placeholder="Indigo-5031"
                                />
                                <TextInput
                                  style={{
                                    borderWidth: 1,
                                    borderColor: "#F2F2F2",
                                    height: 40,
                                    paddingHorizontal: 10,
                                    flex: 1,
                                    marginStart: 1
                                  }}
                                  placeholder="Enter FNN"
                                />
                              </View>
                            </View>
                          )}
                        </View>
                      ))}

                    {parseInt(params.child) > 0 &&
                      [...Array(parseInt(params.child))].map((e, index) => (
                        <View key={"child_" + index}>
                          <View
                            style={{
                              flexDirection: "row",
                              marginTop: 10,
                              justifyContent: "center",
                              alignItems: "center"
                            }}>
                            <Text>Child {index + 1}</Text>
                            {/* <View
                              style={{
                                borderWidth: 1,
                                borderColor: "#F2F2F2",
                                height: 40,
                                marginStart: 2,
                                justifyContent: "center",
                                alignItems: "center"
                              }}>
                              <Picker
                                selectedValue={this.state.childs[index].den}
                                style={{ height: 50, width: 60 }}
                                onValueChange={this.onChildsChange(index, "den")}>
                                <Picker.Item label="Mr." value="Mr" />
                                <Picker.Item label="Mrs." value="Mrs" />
                              </Picker>
                            </View> */}
                            <TextInput
                              style={{
                                borderWidth: 1,
                                borderColor: "#F2F2F2",
                                height: 40,
                                flex: 1,
                                marginHorizontal: 2
                              }}
                              placeholder="First Name"
                              onChangeText={this.onChildsChange(index, "firstname")}
                            />
                            <TextInput
                              style={{
                                borderWidth: 1,
                                borderColor: "#F2F2F2",
                                height: 40,
                                flex: 1
                              }}
                              placeholder="Last Name"
                              onChangeText={this.onChildsChange(index, "last_name")}
                            />
                          </View>
                          <View
                            style={{
                              marginTop: 5,
                              flexDirection: "row",
                              justifyContent: "center",
                              alignItems: "center"
                            }}>
                            <View
                              style={{
                                flex: 2,
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center"
                              }}>
                              <Text style={{ color: "#5D666D", marginStart: 5 }}>DOB</Text>
                              <Button
                                style={{
                                  flex: 1,
                                  marginStart: 5,
                                  borderWidth: 1,
                                  borderColor: "#F2F2F2",
                                  height: 40,
                                  justifyContent: "center",
                                  alignItems: "center"
                                }}
                                onPress={this.show("childs", index, true)}
                                placeholder="DOB">
                                <Text>
                                  {moment(this.state.childs[index].dob).format("DD-MMM-YYYY")}
                                </Text>
                              </Button>
                              <DateTimePicker
                                date={this.state.childs[index].dob}
                                isVisible={this.state.childs[index].show}
                                onConfirm={this.onChildsChange(index, "dob")}
                                onCancel={this.show("childs", index, false)}
                                minimumDate={moment()
                                  .subtract(12, "years")
                                  .toDate()}
                                maximumDate={moment()
                                  .subtract(2, "years")
                                  .toDate()}
                              />
                            </View>
                            <View
                              style={{
                                borderWidth: 1,
                                borderColor: "#F2F2F2",
                                height: 40,
                                flex: 1,
                                paddingHorizontal: 2,
                                marginHorizontal: 2,
                                justifyContent: "center",
                                alignItems: "center"
                              }}>
                              {/* <Picker
                                selectedValue={this.state.childs[index].gender}
                                style={{ height: 50, width: 80 }}
                                onValueChange={this.onChildsChange(index, "gender")}>
                                <Picker.Item label="Male" value="M" />
                                <Picker.Item label="Female" value="F" />
                              </Picker> */}
                              <RNPickerSelect
                                useNativeAndroidPickerStyle={false}
                                placeholder={{}}
                                selectedValue={this.state.childs[index].gender}
                                style={{
                                  inputAndroid: {
                                    color: "#000",
                                    padding: 0,
                                    height: 20,
                                    paddingStart: 3
                                  },
                                  inputIOS: { paddingStart: 3, color: "#000" },
                                  iconContainer: { marginEnd: 8 }
                                }}
                                onValueChange={this.onChildsChange(index, "gender")}
                                items={[
                                  { label: "Male", value: "M" },
                                  { label: "Female", value: "F" }
                                ]}
                                Icon={() => <Icon name="ios-arrow-down" size={20} />}
                              />
                            </View>
                            <TextInput
                              style={{
                                borderWidth: 1,
                                borderColor: "#F2F2F2",
                                height: 40,
                                flex: 1
                              }}
                              placeholder="Age"
                              keyboardType="numeric"
                              onChangeText={this.onChildsChange(index, "age")}
                            />
                          </View>
                        </View>
                      ))}

                    {parseInt(params.infant) > 0 &&
                      [...Array(parseInt(params.infant))].map((e, index) => (
                        <View key={"_infant" + index}>
                          <View
                            style={{
                              flexDirection: "row",
                              marginTop: 10,
                              justifyContent: "center",
                              alignItems: "center"
                            }}>
                            <Text>Infant {index + 1}</Text>
                            {/* <View
                              style={{
                                borderWidth: 1,
                                borderColor: "#F2F2F2",
                                height: 40,
                                marginStart: 2,
                                justifyContent: "center",
                                alignItems: "center"
                              }}>
                              <Picker
                                selectedValue={this.state.infants[index].den}
                                style={{ height: 50, width: 60 }}
                                onValueChange={this.onInfantChange(index, "den")}>
                                <Picker.Item label="Mr." value="Mr" />
                                <Picker.Item label="Mrs." value="Mrs" />
                              </Picker>
                            </View> */}
                            <TextInput
                              style={{
                                borderWidth: 1,
                                borderColor: "#F2F2F2",
                                height: 40,
                                flex: 1,
                                marginHorizontal: 2
                              }}
                              placeholder="First Name"
                              onChangeText={this.onInfantChange(index, "firstname")}
                            />
                            <TextInput
                              style={{
                                borderWidth: 1,
                                borderColor: "#F2F2F2",
                                height: 40,
                                flex: 1
                              }}
                              placeholder="Last Name"
                              onChangeText={this.onInfantChange(index, "last_name")}
                            />
                          </View>
                          <View
                            style={{
                              marginTop: 5,
                              flexDirection: "row",
                              justifyContent: "center",
                              alignItems: "center"
                            }}>
                            <View
                              style={{
                                flex: 2,
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center"
                              }}>
                              <Text style={{ color: "#5D666D", marginStart: 5 }}>DOB</Text>
                              <Button
                                style={{
                                  flex: 1,
                                  marginStart: 5,
                                  borderWidth: 1,
                                  borderColor: "#F2F2F2",
                                  height: 40,
                                  justifyContent: "center",
                                  alignItems: "center"
                                }}
                                onPress={this.show("infants", index, true)}
                                placeholder="DOB">
                                <Text>
                                  {moment(this.state.infants[index].dob).format("DD-MMM-YYYY")}
                                </Text>
                              </Button>
                              <DateTimePicker
                                date={this.state.infants[index].dob}
                                isVisible={this.state.infants[index].show}
                                onConfirm={this.onInfantChange(index, "dob")}
                                onCancel={this.show("infants", index, false)}
                                maximumDate={new Date()}
                                minimumDate={moment()
                                  .subtract(2, "years")
                                  .toDate()}
                              />
                            </View>
                            <View
                              style={{
                                borderWidth: 1,
                                borderColor: "#F2F2F2",
                                height: 40,
                                flex: 1,
                                paddingHorizontal: 2,
                                marginHorizontal: 2,
                                justifyContent: "center",
                                alignItems: "center"
                              }}>
                              {/* <Picker
                                selectedValue={this.state.infants[index].gender}
                                style={{ height: 50, width: 80 }}
                                onValueChange={this.onInfantChange(index, "gender")}>
                                <Picker.Item label="Male" value="M" />
                                <Picker.Item label="Female" value="F" />
                              </Picker> */}
                              <RNPickerSelect
                                useNativeAndroidPickerStyle={false}
                                placeholder={{}}
                                selectedValue={this.state.infants[index].gender}
                                style={{
                                  inputAndroid: {
                                    color: "#000",
                                    padding: 0,
                                    height: 20,
                                    paddingStart: 3
                                  },
                                  inputIOS: { paddingStart: 3, color: "#000" },
                                  iconContainer: { marginEnd: 8 }
                                }}
                                onValueChange={this.onInfantChange(index, "gender")}
                                items={[
                                  { label: "Male", value: "M" },
                                  { label: "Female", value: "F" }
                                ]}
                                Icon={() => <Icon name="ios-arrow-down" size={20} />}
                              />
                            </View>
                            <TextInput
                              style={{
                                borderWidth: 1,
                                borderColor: "#F2F2F2",
                                height: 40,
                                flex: 1
                              }}
                              placeholder="Age"
                              keyboardType="numeric"
                              onChangeText={this.onInfantChange(index, "age")}
                            />
                          </View>
                        </View>
                      ))}
                  </View>
                </View>

                <View
                  style={{
                    elevation: 2,
                    backgroundColor: "#ffffff",
                    marginHorizontal: 16,
                    marginTop: 20,
                    height: 190,
                    padding: 10,
                    borderRadius: 8
                  }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity onPress={() => this._radioButton("D")}>
                      <View
                        style={{
                          height: 18,
                          width: 18,
                          borderRadius: 12,
                          borderWidth: 2,
                          borderColor: "#000",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>
                        {radioDirect && (
                          <View
                            style={{
                              height: 10,
                              width: 10,
                              borderRadius: 6,
                              backgroundColor: "#000"
                            }}
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                    <Text style={{ marginStart: 5, fontSize: 18 }}>RazorPay</Text>
                  </View>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 12,
                      color: "#696969",
                      marginHorizontal: 20
                    }}>
                    Accept Cards, Netbanking, Wallets & UPI. Developer Friendly API, Fast
                    Onboarding. Free & Easy Application Process.100+ Payment Modes, Secure Gateway,
                    Simple Integration. Easy Integration. Dashboard Reporting. etravosApis:
                    Customize Your Checkout, Autofill OTP on Mobile.
                  </Text>
                </View>

                <Button
                  style={{
                    backgroundColor: "#F68E1D",
                    marginHorizontal: 100,
                    alignItems: "center",
                    marginVertical: 30,
                    justifyContent: "center",
                    height: 40,
                    borderRadius: 20
                  }}
                  onPress={this._order}>
                  <Text style={{ color: "#fff" }}>Place Order</Text>
                </Button>
              </ScrollView>
            </View>
            {this.state.loading && <ActivityIndicator />}
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(CheckOut1);
