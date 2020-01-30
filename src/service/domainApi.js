import React from "react";
import axios from "axios";
import axiosRetry from "axios-retry";
import Toast from "react-native-simple-toast";

class Service {
  constructor() {
    let service = axios.create({
      // baseURL: "https://demo66.tutiixx.com/wp-json/wc/v2"
      baseURL: "https://tripdesire.co/wp-json/wc/v2"
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

  post(path, payload, extra = {}) {
    return this.service.request({
      method: "POST",
      url: path,
      responseType: "json",
      data: payload,
      ...extra
    });
  }
}

export default new Service();
