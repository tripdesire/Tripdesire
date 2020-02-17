import React from "react";
import axios from "axios";
import axiosRetry from "axios-retry";
import Toast from "react-native-simple-toast";
import perf from "@react-native-firebase/perf";

class Service {
  constructor() {
    let service = axios.create({
      // baseURL: "https://demo66.tutiixx.com/wp-json/wc/v2",
      baseURL: "https://tripdesire.co/wp-json/wc/v2",
      headers: { "Cache-Control": "no-cache" }
    });
    axiosRetry(service, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

    service.interceptors.request.use(
      config => {
        config.metadata = { startTime: new Date() };
        return config;
      },
      error => Promise.reject(error)
    );

    service.interceptors.response.use(
      response => {
        response.config.metadata.endTime = new Date();
        response.duration = response.config.metadata.endTime - response.config.metadata.startTime;
        return response;
      },
      error => {
        error.config.metadata.endTime = new Date();
        error.duration = error.config.metadata.endTime - error.config.metadata.startTime;
        return Promise.reject(error);
      }
    );

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

  async get(path, params = {}) {
    const metric = await perf().newHttpMetric(path, "GET");
    await metric.start();
    return this.service
      .get(path, { params: params })
      .then(async res => {
        metric.putAttribute("RESPONSE_TIME", res.duration.toString());
        metric.setHttpResponseCode(res.status);
        await metric.stop();
        return res;
      })
      .catch(async err => {
        metric.setHttpResponseCode(0);
        await metric.stop();
        return err;
      });
  }

  patch(path, payload) {
    return this.service.request({
      method: "PATCH",
      url: path,
      responseType: "json",
      data: payload
    });
  }

  async post(path, payload) {
    const metric = await perf().newHttpMetric(path, "POST");
    await metric.start();
    return this.service
      .request({
        method: "POST",
        url: path,
        responseType: "json",
        data: payload
      })
      .then(async res => {
        metric.putAttribute("RESPONSE_TIME", res.duration.toString());
        metric.setHttpResponseCode(res.status);
        await metric.stop();
        return res;
      })
      .catch(async err => {
        metric.setHttpResponseCode(0);
        await metric.stop();
        return err;
      });
  }
}

export default new Service();
