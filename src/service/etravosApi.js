import React from "react";
import axios from "axios";
import axiosRetry from "axios-retry";
import Toast from "react-native-simple-toast";

class Service {
  constructor() {
    let service = axios.create({
      // baseURL: "http://webapi.i2space.co.in",
      baseURL: "https://webapi.etravos.com",
      headers: {
        ConsumerKey: "CCD88EAD264CA93C4A43FBEE6F8136E2FAC8F5A8",
        ConsumerSecret: "1B8338C50149C78CCAEB0CC72527146ADB5E347B"
      }
    });
    axiosRetry(service, { retries: 3, retryDelay: axiosRetry.exponentialDelay });
    service.interceptors.response.use(this.handleSuccess, this.handleError);
    this.service = service;
  }

  handleSuccess(response) {
    console.log(response);
    return response;
  }

  handleError = error => {
    console.log(error);
    Toast.show(e.message ? e.message : e.toString(), Toast.LONG);
    // switch (error.response.status) {
    //   case 401:
    //     //this.redirectTo(document, "/");
    //     break;
    //   case 404:
    //     //this.redirectTo(document, "/404");
    //     break;
    //   default:
    //     //this.redirectTo(document, "/500");
    //     break;
    // }
    return Promise.reject(error);
  };

  get(path, params = {}) {
    return this.service.get(path, { params: params });
  }

  patch(path, payload) {
    return this.service.request({
      method: "PATCH",
      url: path,
      responseType: "json",
      data: payload
    });
  }

  post(path, payload) {
    return this.service.request({
      method: "POST",
      url: path,
      responseType: "json",
      data: payload
    });
  }
}

export default new Service();
