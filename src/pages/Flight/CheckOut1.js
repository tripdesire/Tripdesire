import React from "react";
import {
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Modal
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
import CountryPicker, { getCallingCode, getAllCountries } from "react-native-country-picker-modal";
import GstDetails from "./GstDetails";
import HTML from "react-native-render-html";

class CheckOut1 extends React.PureComponent {
  constructor(props) {
    super(props);
    const { params } = props.navigation.state.params;
    console.log(props.navigation.state.params);
    this.state = {
      showGst: false,
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
          countryCode: "IN",
          visaType: "",
          passportNo: "",
          passportIssueDate: "",
          passportExpiryDate: "",
          show: false,
          showIssue: false,
          showExpiry: false
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
          countryCode: "IN",
          visaType: "",
          passportNo: "",
          passportIssueDate: "",
          passportExpiryDate: "",
          show: false,
          showIssue: false,
          showExpiry: false
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
          countryCode: "IN",
          visaType: "",
          passportNo: "",
          passportIssueDate: "",
          passportExpiryDate: "",
          show: false,
          showIssue: false,
          showExpiry: false
        };
      }),
      radioDirect: true,
      orderId: "",
      transactionId: "",
      status: "",
      taxDetails: "",
      GstDetails: "",
      isSelectPaymentMethod: 0,
      payment_method: "wallet"
    };
  }

  closeModal = val => {
    console.log(val);
    this.setState({ showGst: false, GstDetails: val, loading: false });
  };

  onCountrySelect = index => val => {
    let newData = Object.assign([], this.state.adults);
    newData[index].countryCode = val.cca2;
    this.setState({
      adults: newData
    });
  };

  show = (key, index, isShow) => () => {
    let newData = Object.assign([], this.state[key]);
    newData[index].show = isShow;
    this.setState({
      [key]: newData
    });
  };

  showIssue = (key, index, isShow) => () => {
    let newData = Object.assign([], this.state[key]);
    newData[index].showIssue = isShow;
    this.setState({
      [key]: newData
    });
  };

  showExpiry = (key, index, isShow) => () => {
    let newData = Object.assign([], this.state[key]);
    newData[index].showExpiry = isShow;
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
    newData[index].showIssue = false;
    newData[index].showExpiry = false;
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
    newData[index].showIssue = false;
    newData[index].showExpiry = false;
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
    newData[index].showIssue = false;
    newData[index].showExpiry = false;
    this.setState({
      infants: newData
    });
  };

  validate = () => {
    const { params } = this.props.navigation.state.params;

    let needToValidateAdults = false;
    let needToValidateChilds = false;
    let needToValidateInfants = false;
    needToValidateAdults = this.state.adults.some(
      item =>
        item.firstname == "" ||
        item.last_name == "" ||
        (params.flightType == 2 &&
          (item.visaType == "" ||
            item.passportNo == "" ||
            item.passportIssueDate == "" ||
            item.passportExpiryDate == ""))
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

    if (params.departFlight.IsGSTMandatory && this.state.GstDetails == "") {
      this.setState({ showGst: true });
    }

    const { user } = this.props;
    if (isEmpty(user)) {
      //Toast.show("Please login or signup", Toast.LONG);
      this.props.navigation.navigate("SignIn", { needBilling: true });
      return;
    }
    if (
      user.billing.email === "" ||
      user.billing.phone === "" ||
      user.billing.state === "" ||
      user.billing.city === "" ||
      user.billing.address_1 === "" ||
      user.billing.postcode === ""
    ) {
      this.props.navigation.navigate("BillingDetails", { needBillingOnly: true });
      return;
    }

    if (this.validate()) {
      Toast.show("Please enter all the fields.", Toast.LONG);
      return;
    }

    // "Educational|234234234|hyd|16-05-2002|19-05-2022",

    let PassportDetails = [
      ...this.state.adults.map(
        item =>
          item.visaType +
          "|" +
          item.passportNo +
          "|" +
          item.countryCode +
          "|" +
          moment(item.passportIssueDate).format("DD-MM-YYYY") +
          "|" +
          moment(item.passportExpiryDate).format("DD-MM-YYYY")
      )
    ].join("~");

    // console.log(PassportDetails);
    // return;

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
      user_id: user.id,
      payment_method: this.state.payment_method,
      adult_details: adult_details,
      child_details: child_details,
      infant_details: infant_details
    };
    console.log(param);

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
      this.setState({ loading: true });
      const { arrivalFlight, departFlight, tripType, flightType } = params;
      let RuleParams = {
        airlineId:
          flightType == 1
            ? departFlight.FlightSegments[0].OperatingAirlineCode
            : departFlight.IntOnward.FlightSegments[0].OperatingAirlineCode,
        classCode:
          flightType == 1
            ? departFlight.FlightSegments[0].BookingClassFare.ClassType
            : departFlight.IntOnward.FlightSegments[0].BookingClassFare.ClassType,
        couponFare:
          flightType == 1
            ? departFlight.FlightSegments[0].RPH
            : departFlight.IntOnward.FlightSegments[0].RPH,
        flightId:
          flightType == 1
            ? departFlight.FlightSegments[0].OperatingAirlineFlightNumber
            : departFlight.IntOnward.FlightSegments[0].OperatingAirlineFlightNumber,
        key: departFlight.OriginDestinationoptionId.Key,
        provider: departFlight.Provider,
        tripType: params.tripType,
        service: params.flightType,
        user: "",
        userType: 5
      };
      console.log(RuleParams);
      const { data: Rule } = await etravosApi.get("/Flights/GetFareRule", RuleParams);

      let taxDetail = {
        ActualBaseFare: departFlight.FareDetails.ChargeableFares.ActualBaseFare,
        ActualBaseFareRet: 0,
        AdultPax: params.adult,
        BookedFrom: "",
        BookingDate: moment(this.state.date).format("DD-MM-YYYY"),
        ChildPax: params.child,
        Conveniencefee: departFlight.FareDetails.ChargeableFares.Conveniencefee,
        ConveniencefeeRet: 0,
        Destination: params.destinationCode,
        DestinationName: params.to + ", " + params.destinationCode,
        FareDetails: null, // params.departFlight.FareDetails,
        FlightId: departFlight.OriginDestinationoptionId.Id,
        FlightIdRet: null,
        FlightType: flightType,
        GSTDetails: departFlight.IsGSTMandatory ? this.state.GstDetails : null,
        InfantPax: params.infant,
        IsLCC: departFlight.IsLCC,
        IsLCCRet: null,
        IsNonStopFlight:
          flightType == 1
            ? departFlight.FlightSegments.length > 1
              ? false
              : true
            : departFlight.IntOnward.FlightSegments.length > 1
            ? false
            : true,
        JourneyDate: params.journeyDate,
        Key: departFlight.OriginDestinationoptionId.Key,
        keyRet: null,
        OcTax: departFlight.FareDetails.OCTax,
        OnwardFlightSegments:
          params.flightType == 1
            ? departFlight.FlightSegments
            : departFlight.IntOnward.FlightSegments,
        provider: departFlight.Provider,
        ReturnDate: tripType == 2 ? params.returnDate : params.journeyDate,
        ReturnFlightSegments: flightType == 1 ? null : departFlight.IntReturn.FlightSegments,
        Rule,
        RuleRet: "",
        SCharge: departFlight.FareDetails.ChargeableFares.SCharge,
        SChargeRet: 0,
        Source: params.sourceCode,
        SourceName: params.from + ", " + params.sourceCode,
        Tax: departFlight.FareDetails.ChargeableFares.Tax,
        TaxRet: 0,
        TCharge: departFlight.FareDetails.NonchargeableFares.TCharge,
        TChargeRet: 0,
        TDiscount: departFlight.FareDetails.ChargeableFares.TDiscount,
        TDiscountRet: 0,
        TMarkup: departFlight.FareDetails.NonchargeableFares.TMarkup,
        TMarkupRet: 0,
        TPartnerCommission: departFlight.FareDetails.ChargeableFares.TPartnerCommission,
        TPartnerCommissionRet: 0,
        TravelClass: params.travelClass,
        TripType: params.tripType,
        TSdiscount: departFlight.FareDetails.NonchargeableFares.TSdiscount,
        TSdiscountRet: 0,
        User: "",
        UserType: 5
      };

      console.log("Onward", taxDetail);
      //console.log(JSON.stringify(taxDetail));
      //return;
      const { data: TaxDetails } = await etravosApi.post("/Flights/GetTaxDetails", taxDetail);
      //console.log("Onward Response", TaxDetails);
      if (
        TaxDetails.Status == 15 ||
        TaxDetails.Status == 16 ||
        TaxDetails.Status == 0 ||
        TaxDetails.Status == 10
      ) {
        this.setState({ loading: false });
        Toast.show(TaxDetails.Message, Toast.LONG);
        return;
      }

      let RuleRet = "";
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
        const data = await etravosApi.get("/Flights/GetFareRule", RuleParams);
        RuleRet = data.data;

        let taxDetailReturn = {
          ActualBaseFare: TaxDetails.ChargeableFares.ActualBaseFare,
          ActualBaseFareRet: arrivalFlight.FareDetails.ChargeableFares.ActualBaseFare,
          AdultPax: params.adult,
          BookedFrom: user.username ? user.username : null,
          BookingDate: moment(this.state.date).format("DD-MM-YYYY"),
          ChildPax: params.child,
          Conveniencefee: TaxDetails.ChargeableFares.Conveniencefee,
          ConveniencefeeRet: arrivalFlight.FareDetails.ChargeableFares.Conveniencefee,
          Destination: params.destinationCode,
          DestinationName: params.to + ", " + params.destinationCode,
          FareDetails: null, // TaxDetails, // params.TaxDetails,
          FlightId: departFlight.OriginDestinationoptionId.Id,
          FlightIdRet: arrivalFlight.OriginDestinationoptionId.Id,
          FlightType: flightType,
          GSTDetails: arrivalFlight.IsGSTMandatory ? this.state.GstDetails : null,
          InfantPax: params.infant,
          IsLCC: departFlight.IsLCC,
          IsLCCRet: arrivalFlight.IsLCC,
          IsNonStopFlight: arrivalFlight.FlightSegments.length > 1 ? false : true,
          JourneyDate: params.journeyDate,
          Key: departFlight.OriginDestinationoptionId.Key,
          keyRet: arrivalFlight.OriginDestinationoptionId.Key,
          OcTax: arrivalFlight.FareDetails.OCTax,
          OnwardFlightSegments: departFlight.FlightSegments,
          provider: arrivalFlight.Provider,
          ReturnDate: params.tripType == 2 ? params.returnDate : params.journeyDate,
          ReturnFlightSegments: params.arrivalFlight.FlightSegments,
          Rule,
          RuleRet,
          SCharge: TaxDetails.ChargeableFares.SCharge,
          SChargeRet: arrivalFlight.FareDetails.ChargeableFares.SCharge,
          Source: params.sourceCode,
          SourceName: params.from + ", " + params.sourceCode,
          Tax: TaxDetails.ChargeableFares.Tax,
          TaxRet: arrivalFlight.FareDetails.ChargeableFares.Tax,
          TCharge: TaxDetails.NonchargeableFares.TCharge,
          TChargeRet: arrivalFlight.FareDetails.NonchargeableFares.TCharge,
          TDiscount: TaxDetails.ChargeableFares.TDiscount,
          TDiscountRet: arrivalFlight.FareDetails.ChargeableFares.TDiscount,
          TMarkup: TaxDetails.NonchargeableFares.TMarkup,
          TMarkupRet: arrivalFlight.FareDetails.NonchargeableFares.TMarkup,
          TPartnerCommission: TaxDetails.ChargeableFares.TPartnerCommission,
          TPartnerCommissionRet: arrivalFlight.FareDetails.ChargeableFares.TPartnerCommission,
          TravelClass: params.travelClass,
          TripType: params.tripType,
          TSdiscount: TaxDetails.NonchargeableFares.TSdiscount,
          TSdiscountRet: arrivalFlight.FareDetails.NonchargeableFares.TSdiscount,
          User: "",
          UserType: 5
        };

        console.log(taxDetailReturn);
        var { data: TaxDetailsReturn } = await etravosApi.post(
          "/Flights/GetTaxDetails",
          taxDetailReturn
        );
        //console.log("Return datails", TaxDetailsReturn);
        if (
          TaxDetails.Status == 15 ||
          TaxDetails.Status == 16 ||
          TaxDetails.Status == 0 ||
          TaxDetails.Status == 10
        ) {
          this.setState({ loading: false });
          Toast.show(TaxDetailsReturn.Message, Toast.LONG);
          return;
        }
      }

      let book = {
        ActualBaseFare: TaxDetails.ChargeableFares.ActualBaseFare,
        ActualBaseFareRet:
          tripType == 2 && flightType == 1 ? TaxDetailsReturn.ChargeableFares.ActualBaseFare : 0,
        Address: user.billing.address_1,
        AdultPax: params.adult,
        Ages: age,
        BookedFrom: user.username ? user.username : null,
        BookingDate: moment(this.state.date).format("DD-MM-YYYY"),
        ChildPax: params.child,
        City: user.billing.city,
        Conveniencefee: TaxDetails.ChargeableFares.Conveniencefee,
        ConveniencefeeRet:
          tripType == 2 && flightType == 1 ? TaxDetailsReturn.ChargeableFares.Conveniencefee : 0,
        Destination: params.destinationCode,
        DestinationName: params.destinationAirportName,
        dob: dob,
        EmailId: user.billing.email || user.email,
        FareDetails: null,
        FlightId: departFlight.OriginDestinationoptionId.Id,
        FlightIdRet:
          tripType == 2 && flightType == 1
            ? arrivalFlight.OriginDestinationoptionId.Id
            : tripType == 2 && flightType == 2
            ? departFlight.OriginDestinationoptionId.Id
            : null,
        FlightType: flightType,
        Genders: gender,
        GSTDetails: departFlight.IsGSTMandatory ? this.state.GstDetails : null,
        InfantPax: params.infant,
        IsLCC: params.departFlight.IsLCC,
        IsLCCRet: tripType == 2 && flightType == 1 ? params.arrivalFlight.IsLCC : null,
        IsNonStopFlight:
          flightType == 1
            ? departFlight.FlightSegments.length > 1
              ? false
              : true
            : departFlight.IntOnward.FlightSegments.length > 1
            ? false
            : true,
        JourneyDate: params.journeyDate,
        key: params.departFlight.OriginDestinationoptionId.Key,
        keyRet:
          params.tripType == 2 && flightType == 1
            ? params.arrivalFlight.OriginDestinationoptionId.Key
            : null,
        MobileNo: user.billing.phone,
        Names: name,
        OcTax: params.departFlight.FareDetails.OCTax,
        OnwardFlightSegments:
          params.flightType == 1
            ? departFlight.FlightSegments
            : departFlight.IntOnward.FlightSegments,
        PassportDetails: params.flightType == 2 ? PassportDetails : null, // "Educational|234234234|hyd|16-05-2002|19-05-2022",
        PostalCode: user.billing.postcode,
        Provider: params.departFlight.Provider,
        Psgrtype: "",
        ReturnDate:
          params.tripType == 2 && flightType == 1 ? params.returnDate : params.journeyDate,
        ReturnFlightSegments:
          tripType == 2 && flightType == 1
            ? arrivalFlight.FlightSegments
            : tripType == 2 && flightType == 2
            ? departFlight.IntReturn.FlightSegments
            : null,
        Rule,
        RuleRet: tripType == 2 && flightType == 1 ? RuleRet : null,
        SCharge: TaxDetails.ChargeableFares.SCharge,
        SChargeRet: tripType == 2 && flightType == 1 ? TaxDetailsReturn.ChargeableFares.SCharge : 0,
        SMSUsageCount: 0,
        Source: params.sourceCode,
        SourceName: params.sourceAirportName,
        State: user.billing.state,
        STax: TaxDetails.ChargeableFares.STax,
        STaxRet: tripType == 2 && flightType == 1 ? TaxDetailsReturn.ChargeableFares.STax : 0,
        Tax: TaxDetails.ChargeableFares.Tax,
        TaxRet: tripType == 2 && flightType == 1 ? TaxDetailsReturn.ChargeableFares.Tax : 0,
        TCharge: TaxDetails.NonchargeableFares.TCharge,
        TChargeRet:
          tripType == 2 && flightType == 1 ? TaxDetailsReturn.NonchargeableFares.TCharge : 0,
        TDiscount: TaxDetails.ChargeableFares.TDiscount,
        TDiscountRet:
          tripType == 2 && flightType == 1 ? TaxDetailsReturn.ChargeableFares.TDiscount : 0,
        telephone: user.billing.phone,
        TMarkup: TaxDetails.NonchargeableFares.TCharge,
        TMarkupRet:
          tripType == 2 && flightType == 1 ? TaxDetailsReturn.NonchargeableFares.TCharge : 0,
        TPartnerCommission: TaxDetails.ChargeableFares.TPartnerCommission,
        TPartnerCommissionRet:
          tripType == 2 && flightType == 1
            ? TaxDetailsReturn.ChargeableFares.TPartnerCommission
            : 0,
        TravelClass: params.travelClass,
        TripType: params.tripType,
        TSdiscount: TaxDetails.NonchargeableFares.TSdiscount,
        TSDiscountRet:
          tripType == 2 && flightType == 1 ? TaxDetailsReturn.NonchargeableFares.TSdiscount : 0,
        User: "",
        UserType: 5
      };

      console.log(book);
      const { data: blockres } = await etravosApi.post("/Flights/BlockFlightTicket", book);
      //console.log(blockres);
      if (blockres.BookingStatus == 8) {
        const { data: ord } = await domainApi.post("/checkout/new-order?user_id=" + user.id, param);
        var options = {
          description: "Credits towards consultation",
          // image: "https://i.imgur.com/3g7nmJC.png",
          currency: "INR",
          key: "rzp_test_I66kFrN53lhauw",
          // key: "rzp_live_IRhvqgmESx60tW",
          amount: parseInt(ord.total) * 100,
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
              (razorpayRes.razorpay_payment_id && razorpayRes.razorpay_payment_id != "") ||
              razorpayRes.code == 0
            ) {
              this.setState({ loading: true });
              etravosApi
                .get("/Flights/BookFlightTicket?referenceNo=" + blockres.ReferenceNo)
                .then(({ data: Response }) => {
                  if (Response.ResponseStatus == 200) {
                    let paymentData = {
                      order_id: ord.id,
                      status: "completed",
                      transaction_id: razorpayRes.razorpay_payment_id,
                      reference_no: Response // blockres.data.ReferenceNo
                    };
                    console.log(paymentData);
                    this.setState({ loading: true });
                    domainApi
                      .post("/checkout/update-order", paymentData)
                      .then(({ data: order }) => {
                        this.setState({ loading: false });
                        const { params } = this.props.navigation.state.params;
                        console.log(order);
                        this.props.navigation.navigate("FlightThankYou", {
                          isOrderPage: false,
                          order: order.data,
                          params,
                          Response
                        });
                      })
                      .catch(error => {
                        this.setState({ loading: false });
                      });
                  } else {
                    Toast.show(Response.Message, Toast.SHORT);
                  }
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
          });
      } else {
        this.setState({ loading: false });
        Toast.show(blockres.Message, Toast.LONG);
      }
    } catch (error) {
      this.setState({ loading: false });
      Toast.show(error.message ? error.message : error.toString(), Toast.LONG);
    }
  };

  _radioButton = (index, item) => {
    this.setState({
      isSelectPaymentMethod: index,
      payment_method: item.gateway_id
    });
  };
  render() {
    const { params, data } = this.props.navigation.state.params;
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
                flexDirection: "row",
                paddingBottom: 10
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
                    ? " - " + moment(params.checkOutDate, "DD-MM-YYYY").format("DD MMM")
                    : ""}
                  {params.adult > 0 ? "| " + params.adult + " Adult" : " "}
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
                        tintColor={"#000000"}
                        style={{ width: 20 }}
                      />
                      <Text style={{ fontSize: 18, fontWeight: "500", marginStart: 10 }}>
                        Traveller Details
                      </Text>
                    </View>
                    {params.flightType == 2 && (
                      <Text style={{ marginTop: 10, fontSize: 12 }}>
                        NAME SHOULD BE SAME AS MENTIONED IN YOUR PASSPORT.
                      </Text>
                    )}
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
                                marginEnd: 5
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
                              <Text style={{ flexBasis: "15%" }}>DOB</Text>
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
                                  marginStart: 5,
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
                          {params.flightType == 2 && (
                            <Text style={{ marginTop: 5 }}>Passport Details</Text>
                          )}
                          {params.flightType == 2 && (
                            <View
                              style={{
                                flexDirection: "row",
                                marginTop: 5,
                                justifyContent: "center",
                                alignItems: "center"
                              }}>
                              <TextInput
                                style={{
                                  borderWidth: 1,
                                  borderColor: "#F2F2F2",
                                  height: 40,
                                  flex: 1,
                                  paddingStart: 5,
                                  marginEnd: 5
                                }}
                                onChangeText={this.onAdultChange(index, "visaType")}
                                placeholder="Visa Type"
                              />
                              <TextInput
                                style={{
                                  borderWidth: 1,
                                  paddingStart: 5,
                                  borderColor: "#F2F2F2",
                                  height: 40,
                                  flex: 1
                                }}
                                placeholder="Passport No"
                                onChangeText={this.onAdultChange(index, "passportNo")}
                              />
                            </View>
                          )}
                          {params.flightType == 2 && (
                            <CountryPicker
                              //withCallingCode
                              //placeholder="Select Country"
                              withCountryNameButton
                              countryCode={this.state.adults[index].countryCode}
                              withFilter
                              containerButtonStyle={{
                                backgroundColor: "#FFFFFF",
                                paddingHorizontal: 10,
                                paddingVertical: Platform.OS == "ios" ? 0 : 10,
                                elevation: 1,
                                marginTop: 5,
                                shadowOpacity: 0.2,
                                shadowRadius: 1,
                                shadowOffset: { height: 1, width: 0 }
                              }}
                              onSelect={this.onCountrySelect(index)}
                            />
                          )}
                          {params.flightType == 2 && (
                            <View
                              style={{
                                marginTop: 5,
                                flexDirection: "row",
                                justifyContent: "space-between",
                                flex: 1
                              }}>
                              <View style={{ flex: 1 }}>
                                <Button
                                  style={{
                                    flex: 1,
                                    borderWidth: 1,
                                    borderColor: "#F2F2F2",
                                    height: 40,
                                    justifyContent: "center",
                                    alignItems: "center"
                                  }}
                                  onPress={this.showIssue("adults", index, true)}
                                  placeholder="Issue Date">
                                  <Text>
                                    {this.state.adults[index].passportIssueDate != ""
                                      ? moment(this.state.adults[index].passportIssueDate).format(
                                          "DD-MMM-YYYY"
                                        )
                                      : "-- Issue Date --"}
                                  </Text>
                                </Button>
                                <DateTimePicker
                                  date={this.state.adults[index].passportIssueDate || new Date()}
                                  isVisible={this.state.adults[index].showIssue}
                                  onConfirm={this.onAdultChange(index, "passportIssueDate")}
                                  onCancel={this.showIssue("adults", index, false)}
                                  maximumDate={new Date()}
                                />
                              </View>
                              <View style={{ flex: 1, marginStart: 5 }}>
                                <Button
                                  style={{
                                    flex: 1,
                                    borderWidth: 1,
                                    borderColor: "#F2F2F2",
                                    height: 40,
                                    justifyContent: "center",
                                    alignItems: "center"
                                  }}
                                  onPress={this.showExpiry("adults", index, true)}
                                  placeholder="Expiry Date">
                                  <Text>
                                    {this.state.adults[index].passportExpiryDate != ""
                                      ? moment(this.state.adults[index].passportExpiryDate).format(
                                          "DD-MMM-YYYY"
                                        )
                                      : "-- Expiry Date --"}
                                  </Text>
                                </Button>
                                <DateTimePicker
                                  date={
                                    this.state.adults[index].passportExpiryDate ||
                                    moment(params.journeyDate, "DD-MM-YYYY").toDate()
                                  }
                                  isVisible={this.state.adults[index].showExpiry}
                                  onConfirm={this.onAdultChange(index, "passportExpiryDate")}
                                  onCancel={this.showExpiry("adults", index, false)}
                                  minimumDate={moment(params.journeyDate, "DD-MM-YYYY").toDate()}
                                />
                              </View>
                            </View>
                          )}
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
                                marginEnd: 5
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
                              <Text style={{ flexBasis: "15%" }}>DOB</Text>
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
                                  marginStart: 5,
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
                          {params.flightType == 2 && (
                            <Text style={{ marginTop: 5 }}>Passport Details</Text>
                          )}
                          {params.flightType == 2 && (
                            <View
                              style={{
                                flexDirection: "row",
                                marginTop: 5,
                                justifyContent: "center",
                                alignItems: "center"
                              }}>
                              <TextInput
                                style={{
                                  borderWidth: 1,
                                  borderColor: "#F2F2F2",
                                  height: 40,
                                  flex: 1,
                                  paddingStart: 5,
                                  marginEnd: 5
                                }}
                                onChangeText={this.onChildsChange(index, "visaType")}
                                placeholder="Visa Type"
                              />
                              <TextInput
                                style={{
                                  borderWidth: 1,
                                  paddingStart: 5,
                                  borderColor: "#F2F2F2",
                                  height: 40,
                                  flex: 1
                                }}
                                placeholder="Passport No"
                                onChangeText={this.onChildsChange(index, "passportNo")}
                              />
                            </View>
                          )}
                          {params.flightType == 2 && (
                            <CountryPicker
                              //withCallingCode
                              //placeholder="Select Country"
                              withCountryNameButton
                              countryCode={this.state.childs[index].countryCode}
                              withFilter
                              containerButtonStyle={{
                                backgroundColor: "#FFFFFF",
                                paddingHorizontal: 10,
                                paddingVertical: Platform.OS == "ios" ? 0 : 10,
                                elevation: 1,
                                marginTop: 5,
                                shadowOpacity: 0.2,
                                shadowRadius: 1,
                                shadowOffset: { height: 1, width: 0 }
                              }}
                              onSelect={this.onCountrySelect(index)}
                            />
                          )}
                          {params.flightType == 2 && (
                            <View
                              style={{
                                marginTop: 5,
                                flexDirection: "row",
                                justifyContent: "space-between",
                                flex: 1
                              }}>
                              <View style={{ flex: 1 }}>
                                <Button
                                  style={{
                                    flex: 1,
                                    borderWidth: 1,
                                    borderColor: "#F2F2F2",
                                    height: 40,
                                    justifyContent: "center",
                                    alignItems: "center"
                                  }}
                                  onPress={this.showIssue("childs", index, true)}
                                  placeholder="Issue Date">
                                  <Text>
                                    {this.state.childs[index].passportIssueDate != ""
                                      ? moment(this.state.childs[index].passportIssueDate).format(
                                          "DD-MMM-YYYY"
                                        )
                                      : "-- Issue Date --"}
                                  </Text>
                                </Button>
                                <DateTimePicker
                                  date={this.state.childs[index].passportIssueDate || new Date()}
                                  isVisible={this.state.childs[index].showIssue}
                                  onConfirm={this.onChildsChange(index, "passportIssueDate")}
                                  onCancel={this.showIssue("childs", index, false)}
                                  maximumDate={new Date()}
                                />
                              </View>
                              <View style={{ flex: 1, marginStart: 5 }}>
                                <Button
                                  style={{
                                    flex: 1,
                                    borderWidth: 1,
                                    borderColor: "#F2F2F2",
                                    height: 40,
                                    justifyContent: "center",
                                    alignItems: "center"
                                  }}
                                  onPress={this.showExpiry("childs", index, true)}
                                  placeholder="Expiry Date">
                                  <Text>
                                    {this.state.childs[index].passportExpiryDate != ""
                                      ? moment(this.state.childs[index].passportExpiryDate).format(
                                          "DD-MMM-YYYY"
                                        )
                                      : "-- Expiry Date --"}
                                  </Text>
                                </Button>
                                <DateTimePicker
                                  date={
                                    this.state.childs[index].passportExpiryDate ||
                                    moment(params.journeyDate, "DD-MM-YYYY").toDate()
                                  }
                                  isVisible={this.state.childs[index].showExpiry}
                                  onConfirm={this.onChildsChange(index, "passportExpiryDate")}
                                  onCancel={this.showExpiry("childs", index, false)}
                                  minimumDate={moment(params.journeyDate, "DD-MM-YYYY").toDate()}
                                />
                              </View>
                            </View>
                          )}
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
                                marginEnd: 5
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
                              <Text style={{ flexBasis: "15%" }}>DOB</Text>
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
                                  marginStart: 5,
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
                          {params.flightType == 2 && (
                            <Text style={{ marginTop: 5 }}>Passport Details</Text>
                          )}
                          {params.flightType == 2 && (
                            <View
                              style={{
                                flexDirection: "row",
                                marginTop: 5,
                                justifyContent: "center",
                                alignItems: "center"
                              }}>
                              <TextInput
                                style={{
                                  borderWidth: 1,
                                  borderColor: "#F2F2F2",
                                  height: 40,
                                  flex: 1,
                                  paddingStart: 5,
                                  marginEnd: 5
                                }}
                                onChangeText={this.onInfantChange(index, "visaType")}
                                placeholder="Visa Type"
                              />
                              <TextInput
                                style={{
                                  borderWidth: 1,
                                  paddingStart: 5,
                                  borderColor: "#F2F2F2",
                                  height: 40,
                                  flex: 1
                                }}
                                placeholder="Passport No"
                                onChangeText={this.onInfantChange(index, "passportNo")}
                              />
                            </View>
                          )}
                          {params.flightType == 2 && (
                            <CountryPicker
                              //withCallingCode
                              //placeholder="Select Country"
                              withCountryNameButton
                              countryCode={this.state.infants[index].countryCode}
                              withFilter
                              containerButtonStyle={{
                                backgroundColor: "#FFFFFF",
                                paddingHorizontal: 10,
                                paddingVertical: Platform.OS == "ios" ? 0 : 10,
                                elevation: 1,
                                marginTop: 5,
                                shadowOpacity: 0.2,
                                shadowRadius: 1,
                                shadowOffset: { height: 1, width: 0 }
                              }}
                              onSelect={this.onCountrySelect(index)}
                            />
                          )}
                          {params.flightType == 2 && (
                            <View
                              style={{
                                marginTop: 5,
                                flexDirection: "row",
                                justifyContent: "space-between",
                                flex: 1
                              }}>
                              <View style={{ flex: 1 }}>
                                <Button
                                  style={{
                                    flex: 1,
                                    borderWidth: 1,
                                    borderColor: "#F2F2F2",
                                    height: 40,
                                    justifyContent: "center",
                                    alignItems: "center"
                                  }}
                                  onPress={this.showIssue("infants", index, true)}
                                  placeholder="Issue Date">
                                  <Text>
                                    {this.state.infants[index].passportIssueDate != ""
                                      ? moment(this.state.infants[index].passportIssueDate).format(
                                          "DD-MMM-YYYY"
                                        )
                                      : "-- Issue Date --"}
                                  </Text>
                                </Button>
                                <DateTimePicker
                                  date={this.state.infants[index].passportIssueDate || new Date()}
                                  isVisible={this.state.infants[index].showIssue}
                                  onConfirm={this.onInfantChange(index, "passportIssueDate")}
                                  onCancel={this.showIssue("infants", index, false)}
                                  maximumDate={new Date()}
                                />
                              </View>
                              <View style={{ flex: 1, marginStart: 5 }}>
                                <Button
                                  style={{
                                    flex: 1,
                                    borderWidth: 1,
                                    borderColor: "#F2F2F2",
                                    height: 40,
                                    justifyContent: "center",
                                    alignItems: "center"
                                  }}
                                  onPress={this.showExpiry("infants", index, true)}
                                  placeholder="Expiry Date">
                                  <Text>
                                    {this.state.infants[index].passportExpiryDate != ""
                                      ? moment(this.state.infants[index].passportExpiryDate).format(
                                          "DD-MMM-YYYY"
                                        )
                                      : "-- Expiry Date --"}
                                  </Text>
                                </Button>
                                <DateTimePicker
                                  date={
                                    this.state.infants[index].passportExpiryDate ||
                                    moment(params.journeyDate, "DD-MM-YYYY").toDate()
                                  }
                                  isVisible={this.state.infants[index].showExpiry}
                                  onConfirm={this.onInfantChange(index, "passportExpiryDate")}
                                  onCancel={this.showExpiry("infants", index, false)}
                                  minimumDate={moment(params.journeyDate, "DD-MM-YYYY").toDate()}
                                />
                              </View>
                            </View>
                          )}
                        </View>
                      ))}
                  </View>
                </View>

                {data.payment_gateway &&
                  data.payment_gateway.map((item, index) => {
                    return (
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
                        }}
                        key={item.id}>
                        <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                          <TouchableOpacity onPress={() => this._radioButton(index, item)}>
                            <View
                              style={{
                                height: 18,
                                width: 18,
                                borderRadius: 12,
                                borderWidth: 2,
                                marginTop: 4,
                                borderColor: "#000",
                                alignItems: "center",
                                justifyContent: "center"
                              }}>
                              {this.state.isSelectPaymentMethod === index && (
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
                          <Text style={{ fontSize: 18, fontWeight: "500", marginStart: 5 }}>
                            {item.gateway_title}
                          </Text>
                        </View>
                        <HTML
                          baseFontStyle={{
                            flex: 1,
                            fontSize: 12,
                            color: "#696969",
                            marginHorizontal: 20
                          }}
                          html={item.gateway_description}
                        />
                        {/* <Text
                          style={{
                            flex: 1,
                            fontSize: 12,
                            color: "#696969",
                            marginHorizontal: 20
                          }}>
                          {item.gateway_description}
                        </Text> */}
                      </View>
                    );
                  })}

                <Button
                  style={{
                    backgroundColor: "#F68E1D",
                    marginHorizontal: 100,
                    alignItems: "center",
                    justifyContent: "center",
                    height: 36,
                    marginVertical: 20,
                    borderRadius: 20
                  }}
                  onPress={this._order}>
                  <Text style={{ color: "#fff" }}>Book Now</Text>
                </Button>
              </ScrollView>
              <Modal
                animationType="slide"
                transparent={false}
                visible={this.state.showGst}
                onRequestClose={this.closeModal}>
                <GstDetails onBackPress={this.closeModal} />
              </Modal>
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
