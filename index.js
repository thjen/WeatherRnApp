/** @format */

import {AppRegistry} from 'react-native';
import {mainRouter} from './src/components/Router';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => mainRouter);
