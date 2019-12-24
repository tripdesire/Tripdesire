/**
 * @format
 */

import "react-native-gesture-handler";
import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import { Client } from "bugsnag-react-native";
const bugsnag = new Client("9ff3d6b0a7ccbe196c090bd4c3195c2d");

AppRegistry.registerComponent(appName, () => App);
