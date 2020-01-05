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
    //console.log(props.navigation.state.params);
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
    //console.log(props.navigation.state.params);
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
    if (key == "dob") {
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
    if (key == "dob") {
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
    if (key == "dob") {
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
    needToValidateAdults = this.state.adults.some(
      item => item.firstname == "" || item.last_name == ""
    );
    needToValidateChilds =
      this.state.childs.length != 0 &&
      this.state.childs.some(item => item.firstname == "" || item.last_name == "");
    needToValidateInfants =
      this.state.infants.length != 0 &&
      this.state.infants.some(item => item.firstname == "" || item.last_name == "");

    return needToValidateAdults || needToValidateChilds || needToValidateInfants;
  };

  _order = async () => {
    const { params } = this.props.navigation.state.params;

    const { user } = this.props;
    if (isEmpty(this.props.user)) {
      //Toast.show("Please login or signup", Toast.LONG);
      this.props.navigation.navigate("SignIn", { needBilling: true });
      return;
    }
    if (user.billing.email === "" || user.billing.phone === "") {
      this.props.navigation.navigate("BillingDetails", { needBillingOnly: true });
      return;
    }

    if (this.validate()) {
      Toast.show("Please enter all the fields.", Toast.LONG);
      return;
    }

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

    //console.log(adult_details, child_details, infant_details);

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
      console.log(params);
      let RuleParams = {
        airlineId: params.departFlight.FlightSegments[0].OperatingAirlineCode,
        classCode: params.departFlight.FlightSegments[0].BookingClassFare.ClassType,
        couponFare: params.departFlight.FlightSegments[0].RPH,
        flightId: params.departFlight.OriginDestinationoptionId.Id,
        key: params.departFlight.OriginDestinationoptionId.Key,
        provider: params.departFlight.Provider,
        tripType: params.tripType,
        service: params.flightType,
        user: "",
        userType: 5
      };
      const { data: Rule } = await etravosApi.get("/Flights/GetFareRule", RuleParams);

      let taxDetail = {
        ActualBaseFare: params.departFlight.FareDetails.ChargeableFares.ActualBaseFare,
        ActualBaseFareRet: 0,
        AdultPax: params.adult,
        BookedFrom: "Delhi",
        BookingDate: moment(this.state.date).format("DD-MM-YYYY"),
        ChildPax: params.child,
        Conveniencefee: params.departFlight.FareDetails.ChargeableFares.Conveniencefee,
        ConveniencefeeRet: 0,
        Destination: params.destinationCode,
        DestinationName: params.to + ", " + params.destinationCode,
        FareDetails: null, // params.departFlight.FareDetails,
        FlightId: params.departFlight.OriginDestinationoptionId.Id,
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
          : null,
        InfantPax: params.infant,
        IsLCC: params.departFlight.IsLCC,
        IsLCCRet: null,
        IsNonStopFlight: params.departFlight.FlightSegments.length > 1 ? false : true,
        JourneyDate: params.journeyDate,
        Key: params.departFlight.OriginDestinationoptionId.Key,
        keyRet: null,
        OcTax: params.departFlight.FareDetails.OCTax,
        OnwardFlightSegments:
          params.flightType == 1
            ? params.departFlight.FlightSegments
            : params.departFlight.IntOnward.FlightSegments,
        provider: params.departFlight.Provider,
        ReturnDate: params.tripType == 2 ? params.returnDate : params.journeyDate,
        ReturnFlightSegments: null,
        Rule,
        RuleRet: "",
        SCharge: params.departFlight.FareDetails.ChargeableFares.SCharge,
        SChargeRet: 0,
        Source: params.sourceCode,
        SourceName: params.from + ", " + params.sourceCode,
        Tax: params.departFlight.FareDetails.ChargeableFares.Tax,
        TaxRet: 0,
        TCharge: params.departFlight.FareDetails.NonchargeableFares.TCharge,
        TChargeRet: 0,
        TDiscount: params.departFlight.FareDetails.ChargeableFares.TDiscount,
        TDiscountRet: 0,
        TMarkup: params.departFlight.FareDetails.NonchargeableFares.TMarkup,
        TMarkupRet: 0,
        TPartnerCommission: params.departFlight.FareDetails.ChargeableFares.TPartnerCommission,
        TPartnerCommissionRet: 0,
        TravelClass: params.travelClass,
        TripType: params.tripType,
        TSdiscount: params.departFlight.FareDetails.NonchargeableFares.TSdiscount,
        TSdiscountRet: 0,
        User: "",
        UserType: 5
      };

      console.log("Onward", taxDetail);
      const { data: TaxDetails } = await etravosApi.post("/Flights/GetTaxDetails", taxDetail);
      console.log("Onward Response", TaxDetails);

      if (TaxDetails.Message != null) {
        Toast.show(TaxDetails.Message, Toast.LONG);
        return;
      }

      if (params.flightType == 1 && params.tripType == 2) {
        let RuleParams = {
          airlineId: params.arrivalFlight.FlightSegments[0].OperatingAirlineCode,
          classCode: params.arrivalFlight.FlightSegments[0].BookingClassFare.ClassType,
          couponFare: params.arrivalFlight.FlightSegments[0].RPH,
          flightId: params.arrivalFlight.OriginDestinationoptionId.Id,
          key: params.arrivalFlight.OriginDestinationoptionId.Key,
          provider: params.arrivalFlight.Provider,
          tripType: params.tripType,
          service: params.flightType,
          user: "",
          userType: 5
        };
        const { data: RuleRet } = await etravosApi.get("/Flights/GetFareRule", RuleParams);

        let taxDetailReturn = {
          ActualBaseFare: 0,
          ActualBaseFareRet: params.arrivalFlight.FareDetails.ChargeableFares.ActualBaseFare,
          AdultPax: params.adult,
          BookedFrom: "Delhi",
          BookingDate: moment(this.state.date).format("DD-MM-YYYY"),
          ChildPax: params.child,
          Conveniencefee: 0,
          ConveniencefeeRet: params.arrivalFlight.FareDetails.ChargeableFares.Conveniencefee,
          Destination: params.destinationCode,
          DestinationName: params.to + ", " + params.destinationCode,
          FareDetails: TaxDetails, // params.departFlight.FareDetails,
          FlightId: null,
          FlightIdRet: params.arrivalFlight.OriginDestinationoptionId.Id,
          FlightType: params.flightType,
          GSTDetails: params.arrivalFlight.IsGSTMandatory
            ? {
                GSTCompanyAddress: "Hyderabad",
                GSTCompanyContactNumber: "9234234234",
                GSTCompanyName: "i2space",
                GSTNumber: "534234234233",
                GSTCompanyEmail: "guru.m@i2space.com",
                GSTFirstName: "guru",
                GSTLastName: "bharat"
              }
            : null,
          InfantPax: params.infant,
          IsLCC: null,
          IsLCCRet: params.arrivalFlight.IsLCC,
          IsNonStopFlight: params.arrivalFlight.FlightSegments.length > 1 ? false : true,
          JourneyDate: params.journeyDate,
          Key: null,
          keyRet: params.arrivalFlight.OriginDestinationoptionId.Key,
          OcTax: params.arrivalFlight.FareDetails.OCTax,
          OnwardFlightSegments:
            params.flightType == 1
              ? params.departFlight.FlightSegments
              : params.departFlight.IntOnward.FlightSegments,
          provider: params.arrivalFlight.Provider,
          ReturnDate: params.tripType == 2 ? params.returnDate : params.journeyDate,
          ReturnFlightSegments:
            params.flightType == 1 && params.tripType == 2
              ? params.arrivalFlight.FlightSegments
              : null,
          Rule: "",
          RuleRet,
          SCharge: 0,
          SChargeRet: params.arrivalFlight.FareDetails.ChargeableFares.SCharge,
          Source: params.sourceCode,
          SourceName: params.from + ", " + params.sourceCode,
          Tax: 0,
          TaxRet: params.arrivalFlight.FareDetails.ChargeableFares.Tax,
          TCharge: 0,
          TChargeRet: params.arrivalFlight.FareDetails.NonchargeableFares.TCharge,
          TDiscount: 0,
          TDiscountRet: params.arrivalFlight.FareDetails.ChargeableFares.TDiscount,
          TMarkup: 0,
          TMarkupRet: params.arrivalFlight.FareDetails.NonchargeableFares.TMarkup,
          TPartnerCommission: 0,
          TPartnerCommissionRet:
            params.arrivalFlight.FareDetails.ChargeableFares.TPartnerCommission,
          TravelClass: params.travelClass,
          TripType: params.tripType,
          TSdiscount: 0,
          TSdiscountRet: params.arrivalFlight.FareDetails.NonchargeableFares.TSdiscount,
          User: "",
          UserType: 5
        };

        console.log(taxDetailReturn);

        const { data: TaxDetailsReturn } = await etravosApi.post(
          "/Flights/GetTaxDetails",
          taxDetailReturn
        );
        console.log("Return datails", TaxDetailsReturn);
      }

      return;

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
                    // image: "https://i.imgur.com/3g7nmJC.png",
                    currency: "INR",
                    key: "rzp_test_I66kFrN53lhauw", //"rzp_live_IRhvqgmESx60tW",
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
                          .get("/Flights/BookFlightTicket?referenceNo=" + blockres.data.ReferenceNo)
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
              Toast.show(blockres.data.Message, Toast.LONG);
            }
          })
          .catch(error => {
            Toast.show(error, Toast.LONG);
            this.setState({ loading: false });
          });
      }
    } catch (e) {
      Toast.show(e.toString());
    }

    //console.log(param);
    //console.log(this.state);
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
                //  height: 56,
                backgroundColor: "#E5EBF7",
                flexDirection: "row"
              }}>
              <Button onPress={() => this.props.navigation.goBack(null)} style={{ padding: 16 }}>
                <Icon name="md-arrow-back" size={24} />
              </Button>
              <View style={{ marginHorizontal: 5, paddingTop: 16, flex: 1 }}>
                <Text style={{ fontWeight: "700", fontSize: 16 }}>Checkout</Text>
                <Text style={{ fontSize: 12, color: "#717984" }}>
                  {params.journey_date} {params.return_date ? " - " + params.return_date : ""}
                  {params.checkInDate
                    ? moment(params.checkInDate, "DD-MM-YYYY").format("DD MMM")
                    : ""}
                  {params.checkOutDate
                    ? " - " + moment(params.checkOutDate, "DD-MM-YYYY").format("DD MMM") + " "
                    : ""}
                  {params.adult > 0 ? " | " + params.adult + " Adult" : " "}
                  {params.child > 0 ? " , " + params.child + " Child" : " "}
                  {params.infant > 0 ? " , " + params.infant + " Infant" : " "}
                  {params.className ? " | " + params.className : ""}
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
                    shadowOffset: { width: 0, height: 2 },
                    shadowColor: "rgba(0,0,0,0.1)",
                    shadowOpacity: 1,
                    shadowRadius: 4,
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
                            <Text style={{ flexBasis: "15%" }}>Adult {index + 1}</Text>

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
                              <Text style={{ color: "#5D666D", flexBasis: "15%" }}>DOB</Text>
                              <Button
                                style={{
                                  flex: 1,
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
                              <View
                                style={{
                                  borderWidth: 1,
                                  borderColor: "#F2F2F2",
                                  height: 40,
                                  flex: 1,
                                  paddingHorizontal: 2,
                                  marginHorizontal: 2,
                                  justifyContent: "center"
                                }}>
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
                            <Text style={{ flexBasis: "15%" }}>Child {index + 1}</Text>

                            <TextInput
                              style={{
                                borderWidth: 1,
                                borderColor: "#F2F2F2",
                                height: 40,
                                flex: 1,
                                paddingStart: 5,
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
                                paddingStart: 5,
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
                              <Text style={{ color: "#5D666D", flexBasis: "15%" }}>DOB</Text>
                              <Button
                                style={{
                                  flex: 1,
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
                              <View
                                style={{
                                  borderWidth: 1,
                                  borderColor: "#F2F2F2",
                                  height: 40,
                                  flex: 1,
                                  paddingHorizontal: 2,
                                  marginHorizontal: 2,
                                  justifyContent: "center"
                                }}>
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
                            </View>
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
                            <Text style={{ flexBasis: "15%" }}>Infant {index + 1}</Text>

                            <TextInput
                              style={{
                                borderWidth: 1,
                                borderColor: "#F2F2F2",
                                height: 40,
                                flex: 1,
                                paddingStart: 5,
                                marginHorizontal: 2
                              }}
                              placeholder="First Name"
                              onChangeText={this.onInfantChange(index, "firstname")}
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
                              <Text style={{ color: "#5D666D", flexBasis: "15%" }}>DOB</Text>
                              <Button
                                style={{
                                  flex: 1,
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
                              <View
                                style={{
                                  borderWidth: 1,
                                  borderColor: "#F2F2F2",
                                  height: 40,
                                  flex: 1,
                                  paddingHorizontal: 2,
                                  marginHorizontal: 2,
                                  justifyContent: "center"
                                }}>
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
                            </View>
                          </View>
                        </View>
                      ))}
                  </View>
                </View>

                <View
                  style={{
                    elevation: 2,
                    shadowOffset: { width: 0, height: 2 },
                    shadowColor: "rgba(0,0,0,0.1)",
                    shadowOpacity: 1,
                    shadowRadius: 4,
                    backgroundColor: "#ffffff",
                    marginHorizontal: 16,
                    marginTop: 20,
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
                    marginHorizontal: 120,
                    alignItems: "center",
                    marginVertical: 30,
                    justifyContent: "center",
                    height: 40,
                    borderRadius: 20
                    // marginTop: "auto"
                  }}
                  onPress={this._order}>
                  <Text style={{ color: "#fff", fontWeight: "700" }}>Book Now</Text>
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
